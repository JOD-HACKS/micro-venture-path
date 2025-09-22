import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Clock, 
  MapPin, 
  Users, 
  CheckCircle, 
  IndianRupee,
  Calendar,
  Smartphone,
  Shield,
  ArrowRight,
  Briefcase,
  Star
} from 'lucide-react';
import { Link } from 'react-router-dom';
import type { Project } from '@/lib/db/types';
import { useAuth } from '@/contexts/auth-context';

interface ProjectCardProps {
  project: Project;
  showEmployer?: boolean;
  className?: string;
  variant?: 'default' | 'compact' | 'featured';
}

export function ProjectCard({ project, showEmployer = true, className, variant = 'default' }: ProjectCardProps) {
  const { user } = useAuth();
  const isLoggedIn = !!user;
  const isStudent = user?.role === 'student';
  const applyPath = `/projects/${project.id}/apply`;
  const signInPath = `/auth?mode=signin&redirect=${encodeURIComponent(applyPath)}`;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getStatusColor = (status: Project['status']) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800 border-green-200';
      case 'closed': return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'paused': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-blue-100 text-blue-800 border-blue-200';
    }
  };
  
  const applicationDeadline = new Date(project.application_deadline);
  const daysLeft = Math.ceil((applicationDeadline.getTime() - Date.now()) / (1000 * 60 * 60 * 24));

  return (
    <Card className={`card-enhanced group h-full flex flex-col overflow-hidden ${className}`}>
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div className="space-y-3 flex-1">
            <div className="flex flex-wrap gap-2">
              {project.is_college_verified && (
                <Badge variant="secondary" className="bg-green-50 text-green-700 border-green-200 hover:bg-green-100">
                  <Shield className="w-3 h-3 mr-1" />
                  College Verified
                </Badge>
              )}
              {project.is_micro_project && (
                <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                  <Clock className="w-3 h-3 mr-1" />
                  Micro-Project
                </Badge>
              )}
              {project.has_escrow && (
                <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
                  <Shield className="w-3 h-3 mr-1" />
                  Escrow Protected
                </Badge>
              )}
            </div>
            
            <h3 className="font-bold text-xl line-clamp-2 group-hover:text-primary transition-colors leading-tight">
              <Link to={`/projects/${project.id}`} className="hover:underline">
                {project.title}
              </Link>
            </h3>
          </div>
          
          <Badge variant="outline" className={`${getStatusColor(project.status)} ml-4 shrink-0`}>
            {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
          </Badge>
        </div>
        
        <p className="text-muted-foreground line-clamp-3 leading-relaxed">
          {project.description}
        </p>
      </CardHeader>

      <CardContent className="space-y-6 flex-1">
        {/* Skills */}
        <div>
          <div className="flex flex-wrap gap-1.5">
            {project.skills_required.slice(0, 4).map((skill) => (
              <Badge key={skill} variant="secondary" className="text-xs py-1.5 hover:bg-secondary/80">
                {skill}
              </Badge>
            ))}
            {project.skills_required.length > 4 && (
              <Badge variant="secondary" className="text-xs py-1.5">
                +{project.skills_required.length - 4} more
              </Badge>
            )}
          </div>
        </div>
        
        {/* Project Details */}
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center space-x-3 p-3 rounded-lg bg-green-50/50 dark:bg-green-950/20">
            <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
              <IndianRupee className="w-4 h-4 text-green-600" />
            </div>
            <div>
              <div className="font-semibold text-foreground">{formatCurrency(project.stipend_amount)}</div>
              <div className="text-xs text-muted-foreground">Stipend</div>
            </div>
          </div>
          
          <div className="flex items-center space-x-3 p-3 rounded-lg bg-blue-50/50 dark:bg-blue-950/20">
            <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
              <Clock className="w-4 h-4 text-blue-600" />
            </div>
            <div>
              <div className="font-semibold text-foreground">{project.duration_weeks} weeks</div>
              <div className="text-xs text-muted-foreground">Duration</div>
            </div>
          </div>
          
          <div className="flex items-center space-x-3 p-3 rounded-lg bg-purple-50/50 dark:bg-purple-950/20">
            <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
              <Users className="w-4 h-4 text-purple-600" />
            </div>
            <div>
              <div className="font-semibold text-foreground">{project.applications_count}</div>
              <div className="text-xs text-muted-foreground">Applications</div>
            </div>
          </div>
          
          <div className="flex items-center space-x-3 p-3 rounded-lg bg-orange-50/50 dark:bg-orange-950/20">
            <div className="p-2 bg-orange-100 dark:bg-orange-900 rounded-lg">
              <Calendar className="w-4 h-4 text-orange-600" />
            </div>
            <div>
              <div className={`font-semibold ${daysLeft <= 7 ? 'text-destructive' : 'text-foreground'}`}>
                {daysLeft > 0 ? `${daysLeft} days` : 'Expired'}
              </div>
              <div className="text-xs text-muted-foreground">Deadline</div>
            </div>
          </div>
        </div>

        {/* Employer Info */}
        {showEmployer && (
          <>
            <Separator className="my-4" />
            <div className="flex items-center space-x-3 p-3 rounded-lg bg-muted/50">
              <Avatar className="h-10 w-10 ring-2 ring-border">
                <AvatarImage src="" alt="Employer" />
                <AvatarFallback className="text-sm bg-primary/10 text-primary font-semibold">
                  {project.employer_id.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-foreground truncate">
                  Employer #{project.employer_id}
                </p>
                <p className="text-xs text-muted-foreground">
                  Posted {new Date(project.created_at).toLocaleDateString()}
                </p>
              </div>
              {project.is_college_verified && (
                <div className="flex items-center space-x-1 px-2 py-1 rounded-full bg-green-50 text-green-700">
                  <CheckCircle className="w-3 h-3" />
                  <span className="text-xs font-medium">Verified</span>
                </div>
              )}
            </div>
          </>
        )}
      </CardContent>

      <CardFooter className="flex flex-col space-y-3 pt-6 mt-auto">
        <div className="flex items-center justify-between w-full text-xs text-muted-foreground">
          <div className="flex items-center space-x-2">
            <Smartphone className="w-3 h-3" />
            <span>SMS apply available</span>
          </div>
          <div className="flex items-center space-x-1">
            <Star className="w-3 h-3 text-yellow-500 fill-current" />
            <span>Featured</span>
          </div>
        </div>
        
        <div className="flex items-center space-x-2 w-full">
          <Button 
            variant="outline" 
            className="flex-1 group/btn"
            asChild
          >
            <Link to={`/projects/${project.id}`} className="flex items-center w-full h-full justify-center">
              <Briefcase className="w-4 h-4 mr-2" />
              View Details
            </Link>
          </Button>
          {isStudent ? (
            <Button 
              className="flex-1 btn-primary-enhanced group/btn"
              asChild
            >
              <Link to={applyPath} className="flex items-center w-full h-full justify-center">
                Apply Now
                <ArrowRight className="w-4 h-4 ml-2 group-hover/btn:translate-x-0.5 transition-transform" />
              </Link>
            </Button>
          ) : !isLoggedIn ? (
            <Button 
              className="flex-1 btn-primary-enhanced group/btn"
              asChild
            >
              <Link to={signInPath} className="flex items-center w-full h-full justify-center">
                Sign in to Apply
                <ArrowRight className="w-4 h-4 ml-2 group-hover/btn:translate-x-0.5 transition-transform" />
              </Link>
            </Button>
          ) : (
            <Button 
              className="flex-1 whitespace-normal text-center leading-tight py-2 h-auto" 
              variant="secondary"
              disabled
              title="Only student accounts can apply to projects"
            >
              Student Account Required
            </Button>
          )}
        </div>
      </CardFooter>
    </Card>
  );
}
