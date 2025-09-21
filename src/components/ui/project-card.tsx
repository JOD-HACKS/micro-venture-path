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
  Shield
} from 'lucide-react';
import { Link } from 'react-router-dom';
import type { Project } from '@/lib/db/types';

interface ProjectCardProps {
  project: Project;
  showEmployer?: boolean;
  className?: string;
}

export function ProjectCard({ project, showEmployer = true, className }: ProjectCardProps) {
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
    <Card className={`group hover:shadow-brand transition-all duration-300 hover:-translate-y-1 ${className}`}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="space-y-2 flex-1">
            <div className="flex items-center space-x-2">
              {project.is_college_verified && (
                <Badge variant="secondary" className="bg-green-50 text-green-700 border-green-200">
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
            
            <h3 className="font-semibold text-lg line-clamp-2 group-hover:text-primary transition-colors">
              <Link to={`/projects/${project.id}`} className="hover:underline">
                {project.title}
              </Link>
            </h3>
          </div>
          
          <Badge variant="outline" className={getStatusColor(project.status)}>
            {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
          </Badge>
        </div>
        
        <p className="text-muted-foreground text-sm line-clamp-3">
          {project.description}
        </p>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Skills */}
        <div>
          <div className="flex flex-wrap gap-1">
            {project.skills_required.slice(0, 4).map((skill) => (
              <Badge key={skill} variant="secondary" className="text-xs">
                {skill}
              </Badge>
            ))}
            {project.skills_required.length > 4 && (
              <Badge variant="secondary" className="text-xs">
                +{project.skills_required.length - 4} more
              </Badge>
            )}
          </div>
        </div>

        <Separator />
        
        {/* Project Details */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center space-x-2 text-muted-foreground">
            <IndianRupee className="w-4 h-4" />
            <span className="font-medium text-foreground">{formatCurrency(project.stipend_amount)}</span>
          </div>
          
          <div className="flex items-center space-x-2 text-muted-foreground">
            <Clock className="w-4 h-4" />
            <span>{project.duration_weeks} {project.duration_weeks === 1 ? 'week' : 'weeks'}</span>
          </div>
          
          <div className="flex items-center space-x-2 text-muted-foreground">
            <Users className="w-4 h-4" />
            <span>{project.applications_count} applications</span>
          </div>
          
          <div className="flex items-center space-x-2 text-muted-foreground">
            <Calendar className="w-4 h-4" />
            <span className={daysLeft <= 7 ? 'text-destructive font-medium' : ''}>
              {daysLeft > 0 ? `${daysLeft} days left` : 'Deadline passed'}
            </span>
          </div>
        </div>

        {/* Employer Info */}
        {showEmployer && (
          <>
            <Separator />
            <div className="flex items-center space-x-3">
              <Avatar className="h-8 w-8">
                <AvatarImage src="" alt="Employer" />
                <AvatarFallback className="text-xs bg-muted">
                  {project.employer_id.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">
                  Employer #{project.employer_id}
                </p>
                <p className="text-xs text-muted-foreground">
                  Posted {new Date(project.created_at).toLocaleDateString()}
                </p>
              </div>
              {project.is_college_verified && (
                <CheckCircle className="w-4 h-4 text-green-600" />
              )}
            </div>
          </>
        )}
      </CardContent>

      <CardFooter className="flex items-center justify-between pt-4">
        <div className="flex items-center space-x-2 text-xs text-muted-foreground">
          <Smartphone className="w-3 h-3" />
          <span>SMS apply available</span>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" asChild>
            <Link to={`/projects/${project.id}`}>
              View Details
            </Link>
          </Button>
          <Button size="sm" asChild>
            <Link to={`/projects/${project.id}/apply`}>
              Apply Now
            </Link>
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}