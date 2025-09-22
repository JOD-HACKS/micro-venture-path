import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Bell,
  BookOpen,
  Briefcase,
  Calendar,
  CheckCircle,
  Clock,
  DollarSign,
  FileText,
  GraduationCap,
  MapPin,
  Plus,
  Shield,
  Star,
  TrendingUp,
  Users,
  Zap
} from 'lucide-react';
import { ProjectCard } from '@/components/ui/project-card';
import { mockProjects } from '@/lib/db/mock-data';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/auth-context';

// Frontend-only: use auth context for name, mock arrays for lists

export default function Dashboard() {
  const { toast } = useToast();
  const { user } = useAuth();
  const [recommendedProjects, setRecommendedProjects] = useState(mockProjects.slice(0, 3));
  const [loading] = useState(false);

  // Real-looking hardcoded recent applications
  const applications = [
    {
      id: 'app_10021',
      projectId: 'p1',
      projectTitle: 'Farmer Marketplace Lite (Mobile App)',
      status: 'selected' as const,
      appliedAt: '2025-09-12',
      employer: 'KrishiKart Labs',
      stipend: 6000,
    },
    {
      id: 'app_10037',
      projectId: 'p2',
      projectTitle: 'Smart Irrigation Dashboard (Web)',
      status: 'shortlisted' as const,
      appliedAt: '2025-09-15',
      employer: 'AquaSense AgriTech',
      stipend: 9000,
    },
    {
      id: 'app_10054',
      projectId: 'p8',
      projectTitle: 'Digital Literacy Platform (Local Languages)',
      status: 'submitted' as const,
      appliedAt: '2025-09-18',
      employer: 'GramShiksha Foundation',
      stipend: 19000,
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'selected': return 'bg-green-100 text-green-800 border-green-200';
      case 'shortlisted': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'submitted': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'rejected': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const profileCompleteness = () => {
    let completed = 0;
    const total = 7;
    
    if (user?.name) completed++;
    if (user?.email) completed++;
    // Skills/profile fields can be extended when profile module is ready
    if (user?.college_id) completed++;
    
    return Math.round((completed / total) * 100);
  };

  const notifications = [
    { id: 'n1', title: 'Application Approved', message: 'Your application was approved.', time: '2h', isRead: false },
    { id: 'n2', title: 'New Project Added', message: 'A new project matching your skills is live.', time: '1d', isRead: true },
    { id: 'n3', title: 'Skill Verified', message: 'Your React skill has been verified.', time: '3d', isRead: true },
  ];
  const unreadNotifications = notifications.filter(n => !n.isRead).length;

  return (
    <div className="min-h-screen bg-background">
      <div className="container-mobile py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            {/* Welcome Section */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h1 className="text-3xl font-bold text-foreground">
                  {user ? `Welcome back, ${(user.name || 'User').split(' ')[0]}! 👋` : 'Welcome!'}
                </h1>
                <p className="text-muted-foreground mt-1">
                  Here's what's happening with your projects today.
                </p>
              </div>
              
              <div className="flex items-center space-x-2 mt-4 sm:mt-0">
                <Button asChild>
                  <a href="/#/projects">
                    <Plus className="w-4 h-4 mr-2" />
                    Browse Projects
                  </a>
                </Button>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Applications</CardTitle>
                  <FileText className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{applications.length}</div>
                  <p className="text-xs text-muted-foreground">Active and historical</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Completed</CardTitle>
                  <CheckCircle className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">0</div>
                  <p className="text-xs text-muted-foreground">Projects finished</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Earnings</CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">₹0</div>
                  <p className="text-xs text-muted-foreground">Total earned</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Rating</CardTitle>
                  <Star className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">—</div>
                  <p className="text-xs text-muted-foreground">Average rating</p>
                </CardContent>
              </Card>
            </div>

            {/* Recent Applications */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Briefcase className="w-5 h-5 mr-2" />
                  Recent Applications
                </CardTitle>
                <CardDescription>
                  Track the status of your recent project applications
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {applications.length === 0 ? (
                    <p className="text-sm text-muted-foreground">No applications yet.</p>
                  ) : (
                    applications.map((application) => (
                      <div key={application.id} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                        <div className="flex-1">
                          <h4 className="font-medium line-clamp-1">{application.projectTitle}</h4>
                          <div className="flex flex-wrap items-center gap-2 mt-1 text-sm text-muted-foreground">
                            <span>Applied {new Date(application.appliedAt).toLocaleDateString()}</span>
                            <span>•</span>
                            <span>{application.employer}</span>
                            <span>•</span>
                            <span>₹{application.stipend.toLocaleString()}</span>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          <Badge className={getStatusColor(application.status)}>
                            {application.status.replace('_', ' ')}
                          </Badge>
                          <Button variant="ghost" size="sm" asChild>
                            <a href={`/#/applications/${application.id}`}>View</a>
                          </Button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
                
                <div className="mt-4 pt-4 border-t">
                  <Button variant="outline" className="w-full" asChild>
                    <a href="/#/applications">View All Applications</a>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Recommended Projects */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Zap className="w-5 h-5 mr-2" />
                  Recommended for You
                </CardTitle>
                <CardDescription>
                  Projects matched to your skills and interests
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {recommendedProjects.map((project) => (
                    <ProjectCard key={project.id} project={project} showEmployer={false} />
                  ))}
                </div>
                
                <div className="mt-6">
                  <Button variant="outline" className="w-full" asChild>
                    <a href="/#/projects">Browse All Projects</a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Profile Card */}
            <Card>
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={user?.avatar_url || ''} alt={user?.name || 'User'} />
                    <AvatarFallback className="bg-primary/10 text-primary">
                      {(user?.name || 'U').split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2">
                      <h3 className="font-semibold truncate">{user?.name || 'User'}</h3>
                    </div>
                    <p className="text-sm text-muted-foreground truncate">{user?.college_id ? `College ID: ${user.college_id}` : 'No college set'}</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-2">
                    <span className="text-sm font-medium">Profile Completeness</span>
                    <span className="text-sm text-muted-foreground">{profileCompleteness()}%</span>
                  </div>
                  <Progress value={profileCompleteness()} className="h-2" />
                </div>

                <Separator />

                <div className="space-y-2">
                  <div className="flex items-center text-sm">
                    <GraduationCap className="w-4 h-4 mr-2 text-muted-foreground" />
                    <span className="text-muted-foreground">Year:</span>
                    <span className="ml-auto font-medium">—</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <BookOpen className="w-4 h-4 mr-2 text-muted-foreground" />
                    <span className="text-muted-foreground truncate">Course:</span>
                    <span className="ml-auto font-medium">—</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <Star className="w-4 h-4 mr-2 text-muted-foreground" />
                    <span className="text-muted-foreground">Rating:</span>
                    <span className="ml-auto font-medium">—</span>
                  </div>
                </div>

                <Button variant="outline" size="sm" className="w-full" asChild>
                  <a href="/#/profile">Edit Profile</a>
                </Button>
              </CardContent>
            </Card>

            {/* Skills */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Skills</CardTitle>
                <CardDescription>
                  No skills added
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2 mb-4">
                  {/* No skills to render in mock-only auth */}
                </div>
                
                <Button variant="outline" size="sm" className="w-full" asChild>
                  <a href="/#/skills">Verify More Skills</a>
                </Button>
              </CardContent>
            </Card>

            {/* Notifications */}
            <Card>
                <CardHeader>
                <CardTitle className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center">
                    <Bell className="w-5 h-5 mr-2" />
                    Notifications
                  </div>
                  {unreadNotifications > 0 && (
                    <Badge variant="destructive" className="h-5 w-5 rounded-full p-0 text-xs flex items-center justify-center">
                      {unreadNotifications}
                    </Badge>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {notifications.slice(0, 3).map((notification) => (
                    <div 
                      key={notification.id} 
                      className={`p-3 rounded-lg border transition-colors cursor-pointer hover:bg-muted/50 ${
                        !notification.isRead ? 'bg-primary/5 border-primary/20' : 'bg-muted/20'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-medium line-clamp-1">{notification.title}</h4>
                          <p className="text-xs text-muted-foreground line-clamp-2 mt-1">
                            {notification.message}
                          </p>
                          <span className="text-xs text-muted-foreground mt-1">{notification.time}</span>
                        </div>
                        {!notification.isRead && (
                          <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0 mt-1"></div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                
                <Button variant="outline" size="sm" className="w-full mt-4" asChild>
                  <a href="/#/notifications">View All Notifications</a>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}