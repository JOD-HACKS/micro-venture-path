import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Link } from 'react-router-dom';
import { 
  Shield, 
  Clock, 
  IndianRupee, 
  Users, 
  Calendar,
  MapPin,
  Briefcase,
  ExternalLink,
  Star,
  Smartphone
} from 'lucide-react';
import type { Project } from '@/lib/db/types';

interface ProjectCardProps {
  project: Project;
  showEmployer?: boolean;
  variant?: 'default' | 'compact';
}

export function ProjectCard({ 
  project, 
  showEmployer = true, 
  variant = 'default' 
}: ProjectCardProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDateShort = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = date.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return 'Expired';
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Tomorrow';
    if (diffDays <= 7) return `${diffDays}d left`;
    return date.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800';
      case 'paused':
        return 'bg-yellow-50 text-yellow-700 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-400 dark:border-yellow-800';
      case 'completed':
        return 'bg-gray-50 text-gray-700 border-gray-200 dark:bg-gray-900/20 dark:text-gray-400 dark:border-gray-800';
      case 'draft':
        return 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800';
      case 'closed':
        return 'bg-red-50 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200 dark:bg-gray-900/20 dark:text-gray-400 dark:border-gray-800';
    }
  };

  const isExpired = new Date(project.application_deadline) < new Date();
  const isExpiringSoon = !isExpired && new Date(project.application_deadline).getTime() - Date.now() < 7 * 24 * 60 * 60 * 1000;

  if (variant === 'compact') {
    return (
      <Card className="group hover:shadow-brand transition-all duration-300 hover:-translate-y-1 border-border bg-card">
        <CardContent className="p-4">
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2 mb-2">
                {project.is_college_verified && (
                  <Badge className="bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400">
                    <Shield className="w-3 h-3 mr-1" />
                    Verified
                  </Badge>
                )}
                {project.is_micro_project && (
                  <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400">
                    <Clock className="w-3 h-3 mr-1" />
                    Micro
                  </Badge>
                )}
              </div>
              <h3 className="font-semibold text-card-foreground line-clamp-2 text-sm mb-1 group-hover:text-primary transition-colors">
                {project.title}
              </h3>
            </div>
            <Badge className={getStatusColor(project.status)} variant="outline">
              {project.status}
            </Badge>
          </div>
          
          <div className="flex items-center justify-between text-sm text-muted-foreground mb-3">
            <div className="flex items-center">
              <IndianRupee className="w-3 h-3 mr-1" />
              <span className="font-medium text-card-foreground">{formatCurrency(project.stipend_amount)}</span>
            </div>
            <div className="flex items-center">
              <Clock className="w-3 h-3 mr-1" />
              <span>{project.duration_weeks}w</span>
            </div>
            <div className="flex items-center">
              <Users className="w-3 h-3 mr-1" />
              <span>{project.applications_count}</span>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="text-xs text-muted-foreground">
              <Calendar className="w-3 h-3 inline mr-1" />
              {formatDateShort(project.application_deadline)}
            </div>
            <Button size="sm" variant="ghost" className="h-7 px-2 text-xs" asChild>
              <Link to={`/projects/${project.id}`}>
                View
                <ExternalLink className="w-3 h-3 ml-1" />
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="group hover:shadow-brand transition-all duration-300 hover:-translate-y-1 border-border bg-card">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-3">
              {project.is_college_verified && (
                <Badge className="bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800">
                  <Shield className="w-3 h-3 mr-1" />
                  College Verified
                </Badge>
              )}
              {project.is_micro_project && (
                <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800">
                  <Clock className="w-3 h-3 mr-1" />
                  Micro-Project
                </Badge>
              )}
              {project.has_escrow && (
                <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-900/20 dark:text-purple-400 dark:border-purple-800">
                  <Shield className="w-3 h-3 mr-1" />
                  Escrow
                </Badge>
              )}
            </div>
            
            <h3 className="font-semibold text-lg text-card-foreground line-clamp-2 mb-2 group-hover:text-primary transition-colors">
              {project.title}
            </h3>
            
            <p className="text-sm text-muted-foreground line-clamp-3 mb-3">
              {project.description}
            </p>
          </div>
          
          <Badge 
            className={getStatusColor(project.status)} 
            variant="outline"
          >
            {project.status}
          </Badge>
        </div>

        {/* Skills */}
        <div className="flex flex-wrap gap-1 mb-3">
          {project.skills_required.slice(0, 3).map((skill) => (
            <Badge key={skill} variant="secondary" className="text-xs bg-muted/50 text-muted-foreground hover:bg-accent">
              {skill}
            </Badge>
          ))}
          {project.skills_required.length > 3 && (
            <Badge variant="secondary" className="text-xs bg-muted/50 text-muted-foreground">
              +{project.skills_required.length - 3}
            </Badge>
          )}
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        {/* Project Stats */}
        <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
          <div className="flex items-center text-muted-foreground">
            <IndianRupee className="w-4 h-4 mr-2" />
            <span className="font-medium text-card-foreground">{formatCurrency(project.stipend_amount)}</span>
          </div>
          <div className="flex items-center text-muted-foreground">
            <Clock className="w-4 h-4 mr-2" />
            <span>{project.duration_weeks} {project.duration_weeks === 1 ? 'week' : 'weeks'}</span>
          </div>
          <div className="flex items-center text-muted-foreground">
            <Users className="w-4 h-4 mr-2" />
            <span>{project.applications_count} applications</span>
          </div>
          <div className="flex items-center text-muted-foreground">
            <Calendar className="w-4 h-4 mr-2" />
            <span className={isExpired ? 'text-destructive font-medium' : isExpiringSoon ? 'text-orange-600 font-medium' : ''}>
              {formatDateShort(project.application_deadline)}
            </span>
          </div>
        </div>

        {/* Employer Info (if shown) */}
        {showEmployer && (
          <div className="flex items-center space-x-3 p-3 bg-muted/30 rounded-lg mb-4">
            <Avatar className="h-8 w-8">
              <AvatarFallback className="bg-primary/10 text-primary text-xs">
                {project.employer_id.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-sm text-card-foreground truncate">
                Company #{project.employer_id}
              </p>
              <div className="flex items-center text-xs text-muted-foreground">
                {project.is_college_verified && (
                  <>
                    <Shield className="w-3 h-3 mr-1 text-green-600" />
                    <span>College Verified</span>
                  </>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Location - Removed as not available in Project type */}
      </CardContent>

      <CardFooter className="pt-0">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center space-x-2">
            <Button size="sm" className="focus-brand" asChild disabled={isExpired}>
              <Link to={isExpired ? '#' : `/projects/${project.id}/apply`}>
                {isExpired ? 'Expired' : 'Apply Now'}
              </Link>
            </Button>
            
            <Button size="sm" variant="outline" className="focus-brand" asChild>
              <Link to={`/projects/${project.id}`}>
                <ExternalLink className="w-4 h-4 mr-1" />
                Details
              </Link>
            </Button>
          </div>

          {/* SMS Apply indicator */}
          <div className="flex items-center text-xs text-muted-foreground">
            <Smartphone className="w-3 h-3 mr-1" />
            <span className="hidden sm:inline">SMS Apply</span>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}