import { useState, useEffect } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { 
  ArrowLeft, 
  Mail, 
  Phone, 
  User, 
  Building, 
  GraduationCap,
  Eye,
  EyeOff,
  Github,
  Chrome
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { mockColleges } from '@/lib/db/mock-data';

const signInSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

const signUpSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().min(10, 'Please enter a valid phone number'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string(),
  role: z.enum(['student', 'employer', 'college_admin', 'coordinator']),
  collegeId: z.string().optional(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type SignInForm = z.infer<typeof signInSchema>;
type SignUpForm = z.infer<typeof signUpSchema>;

export default function Auth() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [step, setStep] = useState(1);

  const signInForm = useForm<SignInForm>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const signUpForm = useForm<SignUpForm>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      password: '',
      confirmPassword: '',
      role: 'student',
      collegeId: '',
    },
  });

  useEffect(() => {
    const modeParam = searchParams.get('mode');
    const roleParam = searchParams.get('role');
    
    if (modeParam === 'signup') {
      setMode('signup');
    }
    
    if (roleParam && ['student', 'employer', 'college_admin', 'coordinator'].includes(roleParam)) {
      signUpForm.setValue('role', roleParam as any);
    }
  }, [searchParams, signUpForm]);

  const selectedRole = signUpForm.watch('role');

  const onSignIn = async (data: SignInForm) => {
    setLoading(true);
    try {
      // TODO: Implement actual authentication
      console.log('Sign in:', data);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Welcome back!",
        description: "You have been signed in successfully.",
      });
      
      navigate('/dashboard');
    } catch (error) {
      toast({
        title: "Sign in failed",
        description: "Please check your credentials and try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const onSignUp = async (data: SignUpForm) => {
    setLoading(true);
    try {
      // TODO: Implement actual registration
      console.log('Sign up:', data);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast({
        title: "Account created!",
        description: "Welcome to Prashiskshan. Please check your email to verify your account.",
      });
      
      navigate('/dashboard');
    } catch (error) {
      toast({
        title: "Registration failed",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'student': return <GraduationCap className="w-4 h-4" />;
      case 'employer': return <Building className="w-4 h-4" />;
      case 'college_admin': return <User className="w-4 h-4" />;
      case 'coordinator': return <User className="w-4 h-4" />;
      default: return <User className="w-4 h-4" />;
    }
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'student': return 'Student';
      case 'employer': return 'Employer';
      case 'college_admin': return 'College Admin';
      case 'coordinator': return 'Coordinator';
      default: return 'User';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Back to Home */}
        <Button variant="ghost" size="sm" asChild className="mb-4">
          <Link to="/" className="flex items-center text-muted-foreground hover:text-foreground">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Link>
        </Button>

        <Card className="shadow-brand">
          <CardHeader className="text-center">
            <div className="flex items-center justify-center mb-4">
              <div className="h-12 w-12 rounded-xl bg-primary flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-lg">P</span>
              </div>
            </div>
            <CardTitle className="text-2xl font-bold">
              {mode === 'signin' ? 'Welcome back' : 'Join Prashiskshan'}
            </CardTitle>
            <CardDescription>
              {mode === 'signin' 
                ? 'Sign in to your account to continue' 
                : 'Create your account to start your journey'}
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Social Sign In */}
            <div className="grid grid-cols-2 gap-3">
              <Button variant="outline" className="w-full" disabled={loading}>
                <Github className="w-4 h-4 mr-2" />
                GitHub
              </Button>
              <Button variant="outline" className="w-full" disabled={loading}>
                <Chrome className="w-4 h-4 mr-2" />
                Google
              </Button>
            </div>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <Separator />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  Or continue with email
                </span>
              </div>
            </div>

            {/* Sign In Form */}
            {mode === 'signin' && (
              <Form {...signInForm}>
                <form onSubmit={signInForm.handleSubmit(onSignIn)} className="space-y-4">
                  <FormField
                    control={signInForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <Input 
                              {...field} 
                              type="email" 
                              placeholder="Enter your email"
                              className="pl-10"
                              disabled={loading}
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={signInForm.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input 
                              {...field} 
                              type={showPassword ? "text" : "password"}
                              placeholder="Enter your password"
                              className="pr-10"
                              disabled={loading}
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                              onClick={() => setShowPassword(!showPassword)}
                              disabled={loading}
                            >
                              {showPassword ? (
                                <EyeOff className="h-4 w-4 text-muted-foreground" />
                              ) : (
                                <Eye className="h-4 w-4 text-muted-foreground" />
                              )}
                            </Button>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="flex items-center justify-between">
                    <Button 
                      variant="link" 
                      size="sm" 
                      className="p-0 h-auto"
                      type="button"
                    >
                      Forgot password?
                    </Button>
                  </div>

                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? 'Signing in...' : 'Sign In'}
                  </Button>
                </form>
              </Form>
            )}

            {/* Sign Up Form */}
            {mode === 'signup' && (
              <Form {...signUpForm}>
                <form onSubmit={signUpForm.handleSubmit(onSignUp)} className="space-y-4">
                  {step === 1 && (
                    <>
                      <FormField
                        control={signUpForm.control}
                        name="role"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>I am a</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select your role" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="student">
                                  <div className="flex items-center">
                                    <GraduationCap className="w-4 h-4 mr-2" />
                                    Student
                                  </div>
                                </SelectItem>
                                <SelectItem value="employer">
                                  <div className="flex items-center">
                                    <Building className="w-4 h-4 mr-2" />
                                    Employer
                                  </div>
                                </SelectItem>
                                <SelectItem value="college_admin">
                                  <div className="flex items-center">
                                    <User className="w-4 h-4 mr-2" />
                                    College Admin
                                  </div>
                                </SelectItem>
                                <SelectItem value="coordinator">
                                  <div className="flex items-center">
                                    <User className="w-4 h-4 mr-2" />
                                    Coordinator
                                  </div>
                                </SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {selectedRole && (
                        <div className="p-3 bg-muted/50 rounded-lg">
                          <div className="flex items-center mb-2">
                            {getRoleIcon(selectedRole)}
                            <span className="ml-2 font-medium">{getRoleLabel(selectedRole)}</span>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {selectedRole === 'student' && 'Access internships, build skills, and grow your career.'}
                            {selectedRole === 'employer' && 'Post projects, find talent, and build your team.'}
                            {selectedRole === 'college_admin' && 'Manage college verification and oversee student activities.'}
                            {selectedRole === 'coordinator' && 'Help students and coordinate with colleges.'}
                          </p>
                        </div>
                      )}

                      <Button 
                        type="button" 
                        className="w-full" 
                        onClick={() => setStep(2)}
                        disabled={!selectedRole}
                      >
                        Continue
                      </Button>
                    </>
                  )}

                  {step === 2 && (
                    <>
                      <FormField
                        control={signUpForm.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Full Name</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                <Input 
                                  {...field} 
                                  placeholder="Enter your full name"
                                  className="pl-10"
                                  disabled={loading}
                                />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={signUpForm.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                <Input 
                                  {...field} 
                                  type="email" 
                                  placeholder="Enter your email"
                                  className="pl-10"
                                  disabled={loading}
                                />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={signUpForm.control}
                        name="phone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Phone Number</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                <Input 
                                  {...field} 
                                  type="tel" 
                                  placeholder="+91 98765 43210"
                                  className="pl-10"
                                  disabled={loading}
                                />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {(selectedRole === 'student' || selectedRole === 'coordinator') && (
                        <FormField
                          control={signUpForm.control}
                          name="collegeId"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>College</FormLabel>
                              <Select onValueChange={field.onChange} value={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select your college" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {mockColleges.map((college) => (
                                    <SelectItem key={college.id} value={college.id}>
                                      {college.name}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      )}

                      <FormField
                        control={signUpForm.control}
                        name="password"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Password</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Input 
                                  {...field} 
                                  type={showPassword ? "text" : "password"}
                                  placeholder="Create a password"
                                  className="pr-10"
                                  disabled={loading}
                                />
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                  onClick={() => setShowPassword(!showPassword)}
                                  disabled={loading}
                                >
                                  {showPassword ? (
                                    <EyeOff className="h-4 w-4 text-muted-foreground" />
                                  ) : (
                                    <Eye className="h-4 w-4 text-muted-foreground" />
                                  )}
                                </Button>
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={signUpForm.control}
                        name="confirmPassword"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Confirm Password</FormLabel>
                            <FormControl>
                              <Input 
                                {...field} 
                                type="password"
                                placeholder="Confirm your password"
                                disabled={loading}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="flex space-x-2">
                        <Button 
                          type="button" 
                          variant="outline" 
                          className="flex-1"
                          onClick={() => setStep(1)}
                          disabled={loading}
                        >
                          Back
                        </Button>
                        <Button type="submit" className="flex-1" disabled={loading}>
                          {loading ? 'Creating account...' : 'Create Account'}
                        </Button>
                      </div>
                    </>
                  )}
                </form>
              </Form>
            )}

            {/* Toggle Mode */}
            <div className="text-center">
              <p className="text-sm text-muted-foreground">
                {mode === 'signin' ? "Don't have an account?" : 'Already have an account?'}
                {' '}
                <Button
                  variant="link"
                  size="sm"
                  className="p-0 h-auto font-medium"
                  onClick={() => {
                    setMode(mode === 'signin' ? 'signup' : 'signin');
                    setStep(1);
                  }}
                >
                  {mode === 'signin' ? 'Sign up' : 'Sign in'}
                </Button>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Trust Indicators */}
        <div className="text-center space-y-2">
          <div className="flex justify-center space-x-2">
            <Badge variant="secondary" className="text-xs">
              🔒 Secure & Encrypted
            </Badge>
            <Badge variant="secondary" className="text-xs">
              ✓ College Verified
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground">
            By signing up, you agree to our{' '}
            <Link to="/terms" className="underline hover:text-foreground">
              Terms of Service
            </Link>{' '}
            and{' '}
            <Link to="/privacy" className="underline hover:text-foreground">
              Privacy Policy
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}