import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { 
  ArrowLeft,
  CheckCircle,
  Clock,
  FileText,
  Shield,
  Smartphone,
  Upload,
  Wifi,
  WifiOff,
  AlertCircle,
  IndianRupee
} from 'lucide-react';
import { db, type Project } from '@/lib/db';
import { pwa } from '@/lib/pwa';
import { useToast } from '@/hooks/use-toast';

const applicationSchema = z.object({
  coverLetter: z.string().min(50, 'Cover letter must be at least 50 characters').max(1000, 'Cover letter must be less than 1000 characters'),
  agreeToTerms: z.boolean().refine(val => val === true, 'You must agree to the terms and conditions'),
  availableImmediately: z.boolean(),
  hasRequiredSkills: z.boolean().refine(val => val === true, 'You must confirm you have the required skills'),
});

type ApplicationForm = z.infer<typeof applicationSchema>;

export default function Apply() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [step, setStep] = useState(1);
  const totalSteps = 3;

  const form = useForm<ApplicationForm>({
    resolver: zodResolver(applicationSchema),
    defaultValues: {
      coverLetter: '',
      agreeToTerms: false,
      availableImmediately: true,
      hasRequiredSkills: false,
    },
  });

  useEffect(() => {
    if (id) {
      loadProject(id);
    }
    
    // Listen for online/offline status
    const cleanup = pwa.onOnlineStatusChange(setIsOnline);
    return cleanup;
  }, [id]);

  const loadProject = async (projectId: string) => {
    try {
      const projectData = await db.getProject(projectId);
      setProject(projectData);
    } catch (error) {
      console.error('Failed to load project:', error);
      toast({
        title: "Error",
        description: "Failed to load project details. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data: ApplicationForm) => {
    if (!project) return;

    setSubmitting(true);
    
    try {
      if (isOnline) {
        // Submit directly if online
        await db.createApplication({
          project_id: project.id,
          student_id: 'current_user_id', // TODO: Get from auth context
          status: 'submitted',
          cover_letter: data.coverLetter,
          submitted_via: 'web',
          is_queued: false
        });

        toast({
          title: "Application Submitted!",
          description: "Your application has been submitted successfully. You'll hear back from the employer soon.",
        });

        navigate('/dashboard');
      } else {
        // Queue for offline submission
        const applicationId = await pwa.queueApplication({
          projectId: project.id,
          studentId: 'current_user_id', // TODO: Get from auth context
          coverLetter: data.coverLetter,
        });

        toast({
          title: "Application Queued!",
          description: "Your application has been queued and will be submitted when you're back online.",
        });

        navigate('/dashboard');
      }
    } catch (error) {
      console.error('Failed to submit application:', error);
      toast({
        title: "Submission Failed",
        description: "Failed to submit your application. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading application form...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="w-full max-w-md text-center p-8">
          <CardContent>
            <AlertCircle className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Project Not Found</h2>
            <p className="text-muted-foreground mb-4">
              The project you're trying to apply for doesn't exist or has been removed.
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
  const isExpired = applicationDeadline.getTime() < Date.now();

  if (isExpired) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="w-full max-w-md text-center p-8">
          <CardContent>
            <Clock className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Application Deadline Passed</h2>
            <p className="text-muted-foreground mb-4">
              Unfortunately, the application deadline for this project has passed.
            </p>
            <div className="space-y-2">
              <Button asChild>
                <Link to="/projects">Browse Other Projects</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link to={`/projects/${project.id}`}>View Project Details</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background">
      {/* Header */}
      <div className="border-b bg-card/80 backdrop-blur-sm">
        <div className="container-mobile py-4">
          <Button variant="ghost" size="sm" asChild className="group">
            <Link to={`/projects/${project.id}`} className="flex items-center text-muted-foreground hover:text-foreground transition-colors">
              <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
              Back to Project
            </Link>
          </Button>
        </div>
      </div>

      <div className="container-mobile py-8">
        <div className="max-w-2xl mx-auto">
          {/* Progress */}
          <div className="mb-8 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
                  Apply for Project
                </h1>
                <p className="text-muted-foreground mt-1">Complete your application in {totalSteps} simple steps</p>
              </div>
              <div className="flex items-center space-x-2">
                {isOnline ? (
                  <Badge variant="secondary" className="bg-green-50 text-green-700 border-green-200 shadow-sm">
                    <Wifi className="w-3 h-3 mr-1" />
                    Online
                  </Badge>
                ) : (
                  <Badge variant="secondary" className="bg-orange-50 text-orange-700 border-orange-200 shadow-sm animate-pulse">
                    <WifiOff className="w-3 h-3 mr-1" />
                    Offline
                  </Badge>
                )}
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium">Step {step} of {totalSteps}</span>
                <span className="text-muted-foreground">{Math.round((step / totalSteps) * 100)}% Complete</span>
              </div>
              <Progress value={(step / totalSteps) * 100} className="h-3 transition-all duration-500" />
              
              {/* Step indicators */}
              <div className="flex items-center justify-between mt-4">
                {[1, 2, 3].map((stepNum) => (
                  <div key={stepNum} className="flex items-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all ${
                      stepNum < step 
                        ? 'bg-primary text-primary-foreground shadow-sm' 
                        : stepNum === step 
                        ? 'bg-primary/20 text-primary border-2 border-primary' 
                        : 'bg-muted text-muted-foreground'
                    }`}>
                      {stepNum < step ? (
                        <CheckCircle className="w-4 h-4" />
                      ) : (
                        stepNum
                      )}
                    </div>
                    <span className={`ml-2 text-sm hidden sm:inline ${
                      stepNum === step ? 'text-foreground font-medium' : 'text-muted-foreground'
                    }`}>
                      {stepNum === 1 && 'Skills Check'}
                      {stepNum === 2 && 'Cover Letter'}
                      {stepNum === 3 && 'Review & Submit'}
                    </span>
                    {stepNum < 3 && <div className="flex-1 h-px bg-border mx-4 hidden sm:block" />}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Project Summary */}
          <Card className="mb-6 card-enhanced border-primary/20">
            <CardHeader className="pb-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2 mb-3">
                    {project.is_college_verified && (
                      <Badge className="bg-green-50 text-green-700 border-green-200 shadow-sm">
                        <Shield className="w-3 h-3 mr-1" />
                        College Verified
                      </Badge>
                    )}
                    {project.is_micro_project && (
                      <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 shadow-sm">
                        <Clock className="w-3 h-3 mr-1" />
                        Micro-Project
                      </Badge>
                    )}
                    {project.has_escrow && (
                      <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200 shadow-sm">
                        <Shield className="w-3 h-3 mr-1" />
                        Escrow Protected
                      </Badge>
                    )}
                  </div>
                  <CardTitle className="text-xl md:text-2xl mb-3">{project.title}</CardTitle>
                  <CardDescription className="text-base leading-relaxed">
                    {project.description.slice(0, 200)}{project.description.length > 200 ? '...' : ''}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="flex items-center p-3 rounded-lg bg-green-50 border border-green-200">
                  <IndianRupee className="w-5 h-5 mr-3 text-green-600" />
                  <div>
                    <p className="font-semibold text-green-900">{formatCurrency(project.stipend_amount)}</p>
                    <p className="text-xs text-green-700">Stipend</p>
                  </div>
                </div>
                <div className="flex items-center p-3 rounded-lg bg-blue-50 border border-blue-200">
                  <Clock className="w-5 h-5 mr-3 text-blue-600" />
                  <div>
                    <p className="font-semibold text-blue-900">{project.duration_weeks} weeks</p>
                    <p className="text-xs text-blue-700">Duration</p>
                  </div>
                </div>
                <div className="flex items-center p-3 rounded-lg bg-purple-50 border border-purple-200">
                  <FileText className="w-5 h-5 mr-3 text-purple-600" />
                  <div>
                    <p className="font-semibold text-purple-900">{new Date(project.application_deadline).toLocaleDateString()}</p>
                    <p className="text-xs text-purple-700">Deadline</p>
                  </div>
                </div>
              </div>
              
              {project.skills_required.length > 0 && (
                <div className="mt-4 pt-4 border-t">
                  <p className="text-sm font-medium mb-2">Required Skills:</p>
                  <div className="flex flex-wrap gap-2">
                    {project.skills_required.slice(0, 6).map((skill) => (
                      <Badge key={skill} variant="secondary" className="text-xs">
                        {skill}
                      </Badge>
                    ))}
                    {project.skills_required.length > 6 && (
                      <Badge variant="secondary" className="text-xs">+{project.skills_required.length - 6} more</Badge>
                    )}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Application Form */}
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Step 1: Skills Check */}
              {step === 1 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Skills & Requirements</CardTitle>
                    <CardDescription>
                      Please confirm you have the required skills for this project
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h4 className="font-medium mb-3">Required Skills:</h4>
                      <div className="flex flex-wrap gap-2">
                        {project.skills_required.map((skill) => (
                          <Badge key={skill} variant="secondary">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <FormField
                      control={form.control}
                      name="hasRequiredSkills"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel>
                              I confirm that I have experience with the required skills
                            </FormLabel>
                            <FormDescription>
                              You should have practical experience with most of the skills listed above.
                            </FormDescription>
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="flex justify-end pt-4">
                      <Button 
                        type="button" 
                        onClick={() => setStep(2)}
                        disabled={!form.watch('hasRequiredSkills')}
                        className="min-w-[120px] button-primary"
                      >
                        Continue
                        <ArrowLeft className="w-4 h-4 ml-2 rotate-180" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Step 2: Cover Letter */}
              {step === 2 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Cover Letter</CardTitle>
                    <CardDescription>
                      Tell the employer why you're the right fit for this project
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <FormField
                      control={form.control}
                      name="coverLetter"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Your Message</FormLabel>
                          <FormControl>
                            <Textarea
                              {...field}
                              placeholder="Dear Hiring Manager,

I am excited to apply for this project because...

I have experience with [mention relevant skills/projects]...

I am available to start immediately and can dedicate [time commitment]...

Thank you for considering my application.

Best regards,
[Your name]"
                              className="min-h-[200px] resize-none"
                              disabled={submitting}
                            />
                          </FormControl>
                          <FormDescription>
                            {field.value.length}/1000 characters ({50 - field.value.length < 0 ? 0 : 50 - field.value.length} more needed)
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="availableImmediately"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel>
                              I am available to start this project immediately
                            </FormLabel>
                            <FormDescription>
                              Employers prefer candidates who can start right away.
                            </FormDescription>
                          </div>
                        </FormItem>
                      )}
                    />

                    <div className="flex flex-col sm:flex-row justify-between gap-3 pt-4">
                      <Button 
                        type="button" 
                        variant="outline"
                        onClick={() => setStep(1)}
                        className="min-w-[120px]"
                      >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back
                      </Button>
                      <Button 
                        type="button" 
                        onClick={() => setStep(3)}
                        disabled={!form.watch('coverLetter') || form.watch('coverLetter').length < 50}
                        className="min-w-[120px] button-primary"
                      >
                        Continue
                        <ArrowLeft className="w-4 h-4 ml-2 rotate-180" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Step 3: Review & Submit */}
              {step === 3 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Review & Submit</CardTitle>
                    <CardDescription>
                      Please review your application before submitting
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Application Summary */}
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-medium mb-2">Project:</h4>
                        <p className="text-sm text-muted-foreground">{project.title}</p>
                      </div>
                      
                      <div>
                        <h4 className="font-medium mb-2">Your Cover Letter:</h4>
                        <div className="bg-muted/50 p-3 rounded-lg text-sm whitespace-pre-wrap">
                          {form.watch('coverLetter')}
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-muted-foreground">Skills confirmed:</span>
                          <span className="ml-2">
                            {form.watch('hasRequiredSkills') ? '✓ Yes' : '✗ No'}
                          </span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Available immediately:</span>
                          <span className="ml-2">
                            {form.watch('availableImmediately') ? '✓ Yes' : '✗ No'}
                          </span>
                        </div>
                      </div>
                    </div>

                    <Separator />

                    {/* Terms & Conditions */}
                    <FormField
                      control={form.control}
                      name="agreeToTerms"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel>
                              I agree to the terms and conditions
                            </FormLabel>
                            <FormDescription>
                              By submitting this application, you agree to our{' '}
                              <Link to="/terms" className="underline hover:text-foreground">
                                Terms of Service
                              </Link>{' '}
                              and{' '}
                              <Link to="/privacy" className="underline hover:text-foreground">
                                Privacy Policy
                              </Link>
                            </FormDescription>
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Offline Notice */}
                    {!isOnline && (
                      <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                        <div className="flex items-center">
                          <WifiOff className="w-5 h-5 text-orange-600 mr-2" />
                          <div>
                            <h4 className="font-medium text-orange-900">You're currently offline</h4>
                            <p className="text-sm text-orange-700 mt-1">
                              Your application will be queued and submitted automatically when you reconnect to the internet.
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="flex justify-between">
                      <Button 
                        type="button" 
                        variant="outline"
                        onClick={() => setStep(2)}
                        disabled={submitting}
                      >
                        Back
                      </Button>
                      
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button 
                            type="button" 
                            disabled={!form.watch('agreeToTerms') || submitting}
                          >
                            {submitting ? (
                              <>
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                {isOnline ? 'Submitting...' : 'Queuing...'}
                              </>
                            ) : (
                              <>
                                <FileText className="w-4 h-4 mr-2" />
                                Submit Application
                              </>
                            )}
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Submit Application?</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to submit this application? You won't be able to edit it after submission.
                              {!isOnline && ' Since you\'re offline, it will be queued and submitted when you reconnect.'}
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel disabled={submitting}>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={form.handleSubmit(onSubmit)} disabled={submitting}>
                              Yes, Submit
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </CardContent>
                </Card>
              )}
            </form>
          </Form>

          {/* SMS Application Alternative */}
          <Card className="mt-6 bg-blue-50 border-blue-200">
            <CardContent className="p-4">
              <div className="flex items-center">
                <Smartphone className="w-5 h-5 text-blue-600 mr-3" />
                <div>
                  <h4 className="font-medium text-blue-900">Quick SMS Application</h4>
                  <p className="text-sm text-blue-700 mt-1">
                    You can also apply by sending SMS to <strong>+91 98765 43210</strong> with format: 
                    <code className="bg-blue-100 px-1 ml-1">APPLY {project.id} [Your message]</code>
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}