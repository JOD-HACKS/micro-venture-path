import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { 
  Shield, 
  Clock, 
  IndianRupee, 
  Users, 
  Calendar, 
  MapPin,
  CheckCircle,
  AlertCircle,
  Smartphone,
  Copy,
  ExternalLink,
  ArrowLeft
} from 'lucide-react';
import { db, type Project } from '@/lib/db';
import { useToast } from '@/hooks/use-toast';

export default function ProjectDetail() {
  const { id } = useParams<{ id: string }>();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    if (id) {
      loadProject(id);
    }
  }, [id]);

  const loadProject = async (projectId: string) => {
    try {
      const projectData = await db.getProject(projectId);
      setProject(projectData);
    } catch (error) {
      console.error('Failed to load project:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const copySMSTemplate = () => {
    if (!project) return;
    
    const smsTemplate = `APPLY ${project.id} Hi, I'm interested in applying for "${project.title}". I have experience in ${project.skills_required.slice(0, 2).join(', ')}. Looking forward to contributing!`;
    
    navigator.clipboard.writeText(smsTemplate).then(() => {
      toast({
        title: "SMS Template Copied!",
        description: "You can now paste this in your SMS app and send to +91 98765 43210",
      });
    });
  };

  const simulateSMSApply = async () => {
    if (!project) return;
    
    try {
      // Mock SMS application
      await db.createApplicationFromSMS({
        phone: '+91 98765 43210',
        message: `APPLY ${project.id} Interested in this project`,
        projectId: project.id
      });
      
      toast({
        title: "SMS Application Submitted!",
        description: "Your application has been received and is being processed.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit SMS application. Please try again.",
        variant: "destructive"
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container-mobile py-8">
          <Card className="animate-pulse">
            <CardHeader className="h-48"></CardHeader>
            <CardContent className="space-y-4">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-4 bg-muted rounded"></div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="text-center p-8">
          <CardContent>
            <AlertCircle className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Project Not Found</h2>
            <p className="text-muted-foreground mb-4">
              The project you're looking for doesn't exist or has been removed.
            </p>
            <Button asChild>
              <Link to="/projects">Browse Other Projects</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const applicationDeadline = new Date(project.application_deadline);
  const daysLeft = Math.ceil((applicationDeadline.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
  const isExpired = daysLeft <= 0;

  return (
    <div className="min-h-screen bg-background">
      {/* Breadcrumb */}
      <div className="border-b bg-muted/30">
        <div className="container-mobile py-4">
          <Button variant="ghost" size="sm" asChild>
            <Link to="/projects" className="flex items-center text-muted-foreground hover:text-foreground">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Projects
            </Link>
          </Button>
        </div>
      </div>

      <div className="container-mobile py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Project Header */}
            <Card>
              <CardHeader>
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2 mb-3">
                      {project.is_college_verified && (
                        <Badge className="bg-green-50 text-green-700 border-green-200">
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
                    
                    <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
                      {project.title}
                    </h1>
                    
                    <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center">
                        <IndianRupee className="w-4 h-4 mr-1" />
                        <span className="font-medium text-foreground">{formatCurrency(project.stipend_amount)}</span>
                      </div>
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 mr-1" />
                        <span>{project.duration_weeks} {project.duration_weeks === 1 ? 'week' : 'weeks'}</span>
                      </div>
                      <div className="flex items-center">
                        <Users className="w-4 h-4 mr-1" />
                        <span>{project.applications_count} applications</span>
                      </div>
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-1" />
                        <span className={isExpired ? 'text-destructive font-medium' : ''}>
                          {isExpired ? 'Deadline passed' : `${daysLeft} days left`}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-col gap-2">
                    <Badge 
                      variant={project.status === 'active' ? 'default' : 'secondary'}
                      className={project.status === 'active' ? 'bg-green-100 text-green-800' : ''}
                    >
                      {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
            </Card>

            {/* Project Description */}
            <Card>
              <CardHeader>
                <CardTitle>Project Description</CardTitle>
              </CardHeader>
              <CardContent className="prose prose-sm max-w-none">
                <p className="text-muted-foreground whitespace-pre-line">
                  {project.description}
                </p>
              </CardContent>
            </Card>

            {/* Skills Required */}
            <Card>
              <CardHeader>
                <CardTitle>Skills Required</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {project.skills_required.map((skill) => (
                    <Badge key={skill} variant="secondary" className="text-sm">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Milestones */}
            <Card>
              <CardHeader>
                <CardTitle>Project Milestones</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {project.milestones.map((milestone, index) => (
                  <div key={milestone.id} className="space-y-3">
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-primary text-sm font-medium">
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="font-medium">{milestone.title}</h4>
                          <Badge variant="outline" className="text-xs">
                            {milestone.payment_percentage}% payment
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">
                          {milestone.description}
                        </p>
                        <div className="text-xs text-muted-foreground">
                          Due: {new Date(milestone.deadline).toLocaleDateString()}
                        </div>
                        {milestone.deliverables.length > 0 && (
                          <div className="mt-2">
                            <p className="text-xs font-medium text-muted-foreground mb-1">Deliverables:</p>
                            <ul className="text-xs text-muted-foreground list-disc list-inside">
                              {milestone.deliverables.map((deliverable, i) => (
                                <li key={i}>{deliverable}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    </div>
                    {index < project.milestones.length - 1 && <Separator />}
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Apply Section */}
            <Card>
              <CardHeader>
                <CardTitle>Apply for this Project</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {!isExpired ? (
                  <>
                    <Button size="lg" className="w-full" asChild>
                      <Link to={`/projects/${project.id}/apply`}>
                        Apply Now
                      </Link>
                    </Button>
                    
                    <div className="text-center">
                      <span className="text-sm text-muted-foreground">or</span>
                    </div>
                    
                    {/* SMS Apply Section */}
                    <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                      <div className="flex items-center mb-2">
                        <Smartphone className="w-4 h-4 text-blue-600 mr-2" />
                        <span className="font-medium text-blue-900">Apply via SMS</span>
                      </div>
                      <p className="text-sm text-blue-800 mb-3">
                        Send SMS to <strong>+91 98765 43210</strong>
                      </p>
                      <div className="flex gap-2">
                        <Button 
                          size="sm" 
                          variant="outline" 
                          onClick={copySMSTemplate}
                          className="flex-1 border-blue-300 text-blue-700 hover:bg-blue-100"
                        >
                          <Copy className="w-3 h-3 mr-1" />
                          Copy Template
                        </Button>
                        <Button 
                          size="sm" 
                          onClick={simulateSMSApply}
                          className="flex-1 bg-blue-600 hover:bg-blue-700"
                        >
                          Test SMS Apply
                        </Button>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="text-center p-4 bg-muted rounded-lg">
                    <AlertCircle className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">
                      Application deadline has passed
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Employer Info */}
            <Card>
              <CardHeader>
                <CardTitle>Employer</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-3 mb-4">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src="" alt="Employer" />
                    <AvatarFallback className="bg-primary/10 text-primary">
                      {project.employer_id.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h4 className="font-medium">Company #{project.employer_id}</h4>
                    <p className="text-sm text-muted-foreground">Verified Employer</p>
                  </div>
                  {project.is_college_verified && (
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  )}
                </div>
                
                <Button variant="outline" size="sm" className="w-full">
                  <ExternalLink className="w-4 h-4 mr-2" />
                  View Employer Profile
                </Button>
              </CardContent>
            </Card>

            {/* Project Stats */}
            <Card>
              <CardHeader>
                <CardTitle>Project Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Posted</span>
                  <span>{new Date(project.created_at).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Applications</span>
                  <span>{project.applications_count}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Duration</span>
                  <span>{project.duration_weeks} weeks</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Project Type</span>
                  <span>{project.is_micro_project ? 'Micro-Project' : 'Full Project'}</span>
                </div>
                {project.has_escrow && (
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Payment</span>
                    <span className="text-green-600 font-medium">Escrow Protected</span>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}