import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Search, 
  Filter, 
  SlidersHorizontal,
  Clock,
  IndianRupee,
  Shield,
  Smartphone,
  MapPin,
  RefreshCw,
  X
} from 'lucide-react';
import { ProjectCard } from '@/components/ui/project-card';
import { ProjectCardSkeleton } from '@/components/ui/loading';
import { EmptyState } from '@/components/ui/empty-state';
import { OfflineIndicator } from '@/components/ui/offline-indicator';
import { MetaTags } from '@/components/seo/MetaTags';
import { useAnalytics } from '@/utils/analytics';
import { useLocalStorage } from '@/hooks/use-local-storage';
import { useOnlineStatus } from '@/hooks/use-online-status';
import { db, type Project } from '@/lib/db';

interface ProjectFilters {
  search: string;
  skills: string[];
  duration: 'all' | '1-2' | '3-4' | '5+';
  stipend: 'all' | '0-5000' | '5000-15000' | '15000+';
  isVerified: boolean | null;
  isMicroProject: boolean | null;
  hasEscrow: boolean | null;
}

export default function Projects() {
  const { trackSearch, trackFeatureUsage } = useAnalytics();
  const isOnline = useOnlineStatus();
  const [projects, setProjects] = useState<Project[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [savedFilters, setSavedFilters] = useLocalStorage<Partial<ProjectFilters>>('project-filters', {
    skills: [],
    duration: 'all' as const,
    stipend: 'all' as const,
    isVerified: null,
    isMicroProject: null,
    hasEscrow: null
  });
  
  const [filters, setFilters] = useState<ProjectFilters>({
    search: '',
    skills: savedFilters.skills || [],
    duration: savedFilters.duration || 'all',
    stipend: savedFilters.stipend || 'all',
    isVerified: savedFilters.isVerified || null,
    isMicroProject: savedFilters.isMicroProject || null,
    hasEscrow: savedFilters.hasEscrow || null,
  });
  const [sortBy, setSortBy] = useState<'recent' | 'stipend-high' | 'stipend-low' | 'duration-short' | 'applications'>('recent');

  const popularSkills = [
    'React', 'JavaScript', 'Python', 'Node.js', 'UI/UX Design',
    'Mobile Development', 'Machine Learning', 'Data Analysis', 
    'API Integration', 'Database Design'
  ];

  const loadProjects = async () => {
    try {
      setError(null);
      const projectData = await db.getProjects();
      setProjects(projectData);
    } catch (error) {
      console.error('Failed to load projects:', error);
      setError('Failed to load projects. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = useCallback(() => {
    let filtered = [...projects];

    // Search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(project =>
        project.title.toLowerCase().includes(searchLower) ||
        project.description.toLowerCase().includes(searchLower) ||
        project.skills_required.some(skill => 
          skill.toLowerCase().includes(searchLower)
        )
      );
      trackSearch(filters.search, filtered.length);
    }

    // Skills filter
    if (filters.skills.length > 0) {
      filtered = filtered.filter(project =>
        filters.skills.some(skill =>
          project.skills_required.some(req =>
            req.toLowerCase().includes(skill.toLowerCase())
          )
        )
      );
    }

    // Duration filter
    if (filters.duration !== 'all') {
      filtered = filtered.filter(project => {
        switch (filters.duration) {
          case '1-2':
            return project.duration_weeks <= 2;
          case '3-4':
            return project.duration_weeks >= 3 && project.duration_weeks <= 4;
          case '5+':
            return project.duration_weeks >= 5;
          default:
            return true;
        }
      });
    }

    // Stipend filter
    if (filters.stipend !== 'all') {
      filtered = filtered.filter(project => {
        switch (filters.stipend) {
          case '0-5000':
            return project.stipend_amount <= 5000;
          case '5000-15000':
            return project.stipend_amount > 5000 && project.stipend_amount <= 15000;
          case '15000+':
            return project.stipend_amount > 15000;
          default:
            return true;
        }
      });
    }

    // Boolean filters
    if (filters.isVerified !== null) {
      filtered = filtered.filter(project => project.is_college_verified === filters.isVerified);
    }
    if (filters.isMicroProject !== null) {
      filtered = filtered.filter(project => project.is_micro_project === filters.isMicroProject);
    }
    if (filters.hasEscrow !== null) {
      filtered = filtered.filter(project => project.has_escrow === filters.hasEscrow);
    }

    // Sorting
    switch (sortBy) {
      case 'stipend-high':
        filtered.sort((a, b) => b.stipend_amount - a.stipend_amount);
        break;
      case 'stipend-low':
        filtered.sort((a, b) => a.stipend_amount - b.stipend_amount);
        break;
      case 'duration-short':
        filtered.sort((a, b) => a.duration_weeks - b.duration_weeks);
        break;
      case 'applications':
        filtered.sort((a, b) => a.applications_count - b.applications_count);
        break;
      case 'recent':
      default:
        filtered.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        break;
    }

    setFilteredProjects(filtered);

    const { search, ...filtersToSave } = filters;
    setSavedFilters(filtersToSave);
  }, [projects, filters, trackSearch, setSavedFilters, sortBy]);

  useEffect(() => {
    loadProjects();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [projects, filters, sortBy, applyFilters]);

  const clearFilters = () => {
    const clearedFilters: ProjectFilters = {
      search: '',
      skills: [],
      duration: 'all' as const,
      stipend: 'all' as const,
      isVerified: null,
      isMicroProject: null,
      hasEscrow: null
    };
    setFilters(clearedFilters);
    const { search, ...filtersToSave } = clearedFilters;
    setSavedFilters(filtersToSave);
    trackFeatureUsage('filters', 'clear_all');
  };

  const toggleSkill = (skill: string) => {
    setFilters(prev => ({
      ...prev,
      skills: prev.skills.includes(skill)
        ? prev.skills.filter(s => s !== skill)
        : [...prev.skills, skill]
    }));
    trackFeatureUsage('filters', 'toggle_skill');
  };

  const retryLoad = () => {
    setLoading(true);
    setError(null);
    loadProjects();
  };

  if (loading) {
    return (
      <>
        <MetaTags 
          title="Browse Projects"
          description="Explore college-verified internships and micro-projects across India. Apply online or via SMS."
        />
        <div className="min-h-screen bg-background">
          <div className="border-b bg-muted/30">
            <div className="container-mobile py-6">
              <div className="animate-pulse space-y-4">
                <div className="h-8 bg-muted rounded w-48"></div>
                <div className="h-4 bg-muted rounded w-64"></div>
              </div>
            </div>
          </div>
          <div className="container-mobile py-6">
            <div className="flex flex-col lg:flex-row gap-6">
              <div className="lg:w-80">
                <div className="h-96 bg-muted rounded animate-pulse"></div>
              </div>
              <div className="flex-1">
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {[...Array(6)].map((_, i) => (
                    <ProjectCardSkeleton key={i} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <MetaTags 
          title="Browse Projects - Error"
          description="Error loading projects. Please try again."
          noIndex
        />
        <div className="min-h-screen bg-background">
          <div className="container-mobile py-8">
            <EmptyState
              icon={RefreshCw}
              title="Failed to Load Projects"
              description={error}
              action={{
                label: "Try Again",
                onClick: retryLoad
              }}
              secondaryAction={{
                label: "Go Home",
                href: "/"
              }}
            />
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <MetaTags 
        title="Browse Projects | Prashiskshan"
        description={`Explore ${projects.length} college-verified internships and micro-projects. Apply online or via SMS with offline support.`}
        keywords={['internships', 'micro-projects', 'college-verified', 'rural India', 'SMS application']}
      />
      <div className="min-h-screen bg-background">
        {/* Header */}
        <div className="border-b bg-muted/30">
          <div className="container-mobile py-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-foreground">
                  Browse Projects
                </h1>
                <p className="text-muted-foreground">
                  Discover {projects.length} verified internships and micro-projects
                </p>
              </div>
              
              <div className="flex items-center space-x-2">
                <OfflineIndicator />
                <Badge variant="secondary" className="bg-green-50 text-green-700">
                  <Shield className="w-3 h-3 mr-1" />
                  College Verified Available
                </Badge>
                <Badge variant="secondary" className="bg-blue-50 text-blue-700">
                  <Smartphone className="w-3 h-3 mr-1" />
                  SMS Apply Enabled
                </Badge>
              </div>
            </div>
          </div>
        </div>

        <div className="container-mobile py-6">
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Filters Sidebar */}
            <div className="lg:w-80">
              <Card className="sticky top-24">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg flex items-center">
                      <SlidersHorizontal className="w-5 h-5 mr-2" />
                      Filters
                    </CardTitle>
                    <Button variant="ghost" size="sm" onClick={clearFilters}>
                      Clear All
                    </Button>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-6">
                  {/* Search */}
                  <div>
                    <label className="text-sm font-medium mb-2 block">Search</label>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        placeholder="Search projects..."
                        value={filters.search}
                        onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                        className="pl-10"
                      />
                      {filters.search && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
                          onClick={() => setFilters(prev => ({ ...prev, search: '' }))}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      )}
                    </div>
                  </div>

                  <Separator />

                  {/* Duration */}
                  <div>
                    <label className="text-sm font-medium mb-2 block">Duration</label>
                    <Select value={filters.duration} onValueChange={(value: 'all' | '1-2' | '3-4' | '5+') => setFilters(prev => ({ ...prev, duration: value }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Durations</SelectItem>
                        <SelectItem value="1-2">1-2 weeks</SelectItem>
                        <SelectItem value="3-4">3-4 weeks</SelectItem>
                        <SelectItem value="5+">5+ weeks</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Stipend */}
                  <div>
                    <label className="text-sm font-medium mb-2 block">Stipend Range</label>
                    <Select value={filters.stipend} onValueChange={(value: 'all' | '0-5000' | '5000-15000' | '15000+') => setFilters(prev => ({ ...prev, stipend: value }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Ranges</SelectItem>
                        <SelectItem value="0-5000">₹0 - ₹5,000</SelectItem>
                        <SelectItem value="5000-15000">₹5,000 - ₹15,000</SelectItem>
                        <SelectItem value="15000+">₹15,000+</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Separator />

                  {/* Project Types */}
                  <div>
                    <label className="text-sm font-medium mb-3 block">Project Type</label>
                    <div className="space-y-3">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="verified"
                          checked={filters.isVerified === true}
                          onCheckedChange={(checked) => 
                            setFilters(prev => ({ ...prev, isVerified: checked ? true : null }))
                          }
                        />
                        <label htmlFor="verified" className="text-sm flex items-center">
                          <Shield className="w-4 h-4 mr-1 text-green-600" />
                          College Verified Only
                        </label>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="micro"
                          checked={filters.isMicroProject === true}
                          onCheckedChange={(checked) => 
                            setFilters(prev => ({ ...prev, isMicroProject: checked ? true : null }))
                          }
                        />
                        <label htmlFor="micro" className="text-sm flex items-center">
                          <Clock className="w-4 h-4 mr-1 text-blue-600" />
                          Micro-Projects Only
                        </label>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="escrow"
                          checked={filters.hasEscrow === true}
                          onCheckedChange={(checked) => 
                            setFilters(prev => ({ ...prev, hasEscrow: checked ? true : null }))
                          }
                        />
                        <label htmlFor="escrow" className="text-sm flex items-center">
                          <Shield className="w-4 h-4 mr-1 text-purple-600" />
                          Escrow Protected
                        </label>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  {/* Skills */}
                  <div>
                    <label className="text-sm font-medium mb-3 block">Skills</label>
                    <div className="flex flex-wrap gap-2">
                      {popularSkills.map((skill) => (
                        <Badge
                          key={skill}
                          variant={filters.skills.includes(skill) ? "default" : "secondary"}
                          className="cursor-pointer hover:bg-primary/80"
                          onClick={() => toggleSkill(skill)}
                        >
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Projects Grid */}
            <div className="flex-1">
              {/* Results Header */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
                <p className="text-muted-foreground">
                  Showing {filteredProjects.length} of {projects.length} projects
                </p>
                
                <Select value={sortBy} onValueChange={(value: 'recent' | 'stipend-high' | 'stipend-low' | 'duration-short' | 'applications') => setSortBy(value)}>
                  <SelectTrigger className="w-[200px] mt-2 sm:mt-0">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="recent">Most Recent</SelectItem>
                    <SelectItem value="stipend-high">Highest Stipend</SelectItem>
                    <SelectItem value="stipend-low">Lowest Stipend</SelectItem>
                    <SelectItem value="duration-short">Shortest Duration</SelectItem>
                    <SelectItem value="applications">Fewest Applications</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Projects Grid */}
              {filteredProjects.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {filteredProjects.map((project) => (
                    <ProjectCard key={project.id} project={project} />
                  ))}
                </div>
              ) : filters.search || filters.skills.length > 0 || filters.duration !== 'all' || filters.stipend !== 'all' || filters.isVerified !== null || filters.isMicroProject !== null || filters.hasEscrow !== null ? (
                <EmptyState
                  icon={Search}
                  title="No projects found"
                  description="Try adjusting your filters or search terms to find more opportunities."
                  action={{
                    label: "Clear All Filters",
                    onClick: clearFilters
                  }}
                />
              ) : (
                <EmptyState
                  icon={Search}
                  title="No projects available"
                  description="There are currently no projects available. Check back later for new opportunities."
                  action={{
                    label: "Refresh",
                    onClick: retryLoad
                  }}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}