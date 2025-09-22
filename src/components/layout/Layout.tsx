import { ReactNode, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { useAuth } from '@/contexts/auth-context';
import { useToast } from '@/hooks/use-toast';
import { 
  Menu, 
  Shield, 
  Briefcase, 
  GraduationCap, 
  Users, 
  Home,
  Search,
  Bell,
  User,
  Settings,
  LogOut
} from 'lucide-react';

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [signingOut, setSigningOut] = useState(false);
  const { toast } = useToast();
  const { user, signOut } = useAuth();

  const isLoggedIn = !!user;
  const userRole = (user?.role as 'student' | 'employer' | 'college_admin' | 'coordinator') || 'student';

  const navigation = [
    { name: 'Home', href: '/', icon: Home },
    { name: 'Projects', href: '/projects', icon: Briefcase },
    ...(isLoggedIn ? [
      { name: 'Dashboard', href: userRole === 'student' ? '/dashboard' : userRole === 'employer' ? '/employer/dashboard' : userRole === 'college_admin' ? '/admin/placement-cell' : '/coordinator/verify', icon: User },
      ...(userRole === 'student' ? [{ name: 'Applications', href: '/applications', icon: Search }] : []),
    ] : []),
  ];

  const roleBasedNavigation = {
    student: [
      { name: 'My Skills', href: '/skills', icon: GraduationCap },
    ],
    employer: [
      { name: 'Post Project', href: '/employer/projects/new', icon: Briefcase },
      { name: 'Manage Projects', href: '/employer/dashboard', icon: Settings },
    ],
    college_admin: [
      { name: 'Verification Center', href: '/admin/placement-cell', icon: Shield },
      { name: 'Students', href: '/admin/students', icon: Users },
    ],
    coordinator: [
      { name: 'Quick Verify', href: '/coordinator/verify', icon: Shield },
    ],
  };

  const currentRoleNav = isLoggedIn ? (roleBasedNavigation[userRole as keyof typeof roleBasedNavigation] || []) : [];

  const isActiveRoute = (href: string) => {
    if (href === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(href);
  };

  const closeMobileMenu = () => setMobileMenuOpen(false);

  const handleSignOut = async (closeMenu = false) => {
    if (signingOut) return;

    try {
      setSigningOut(true);
      await signOut();
      toast({
        title: 'Signed out',
        description: 'You have been signed out successfully.',
      });
      if (closeMenu) {
        closeMobileMenu();
      }
      navigate('/auth?mode=signin');
    } catch (error) {
      console.error('Sign out failed:', error);
      toast({
        title: 'Sign out failed',
        description: 'Please try again.',
        variant: 'destructive',
      });
    } finally {
      setSigningOut(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container-mobile flex h-16 items-center">
          {/* Logo */}
          <button 
            type="button"
            className="flex items-center space-x-2 mr-6 focus-brand rounded-md px-2 py-1"
            onClick={() => { closeMobileMenu(); navigate('/'); }}
            aria-label="Go to Home"
          >
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary text-primary-foreground font-bold text-sm">
              प्र
            </div>
            <span className="font-bold text-xl text-foreground hidden sm:inline-block">
              Prashiskshan
            </span>
          </button>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1 flex-1">
            {navigation.map((item) => (
              item.name === 'Home' ? (
                <button
                  key={item.name}
                  type="button"
                  onClick={() => navigate('/')}
                  className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors focus-brand ${
                    isActiveRoute(item.href)
                      ? 'bg-accent text-accent-foreground'
                      : 'text-muted-foreground hover:text-foreground hover:bg-accent/50'
                  }`}
                >
                  <item.icon className="w-4 h-4 mr-2" />
                  {item.name}
                </button>
              ) : (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors focus-brand ${
                    isActiveRoute(item.href)
                      ? 'bg-accent text-accent-foreground'
                      : 'text-muted-foreground hover:text-foreground hover:bg-accent/50'
                  }`}
                >
                  <item.icon className="w-4 h-4 mr-2" />
                  {item.name}
                </Link>
              )
            ))}
            
            {currentRoleNav.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors focus-brand ${
                  isActiveRoute(item.href)
                    ? 'bg-accent text-accent-foreground'
                    : 'text-muted-foreground hover:text-foreground hover:bg-accent/50'
                }`}
              >
                <item.icon className="w-4 h-4 mr-2" />
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Right side actions */}
          <div className="flex items-center space-x-2 ml-auto">
            {/* Theme Toggle */}
            <ThemeToggle />
            
            {/* Notifications (if logged in) */}
            {isLoggedIn && (
              <Button variant="ghost" size="sm" className="h-9 w-9 px-0" asChild>
                <Link to="/notifications">
                  <Bell className="h-4 w-4" />
                  <span className="sr-only">Notifications</span>
                </Link>
              </Button>
            )}

            {/* Auth buttons */}
            {!isLoggedIn ? (
              <div className="hidden sm:flex items-center space-x-2">
                <Button variant="ghost" size="sm" asChild>
                  <Link to="/auth?mode=signin">Sign In</Link>
                </Button>
                <Button size="sm" asChild>
                  <Link to="/auth?mode=signup">Get Started</Link>
                </Button>
              </div>
            ) : (
              <>
                <Button variant="ghost" size="sm" className="h-9 w-9 px-0" asChild>
                  <Link to="/profile">
                    <User className="h-4 w-4" />
                    <span className="sr-only">Profile</span>
                  </Link>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="hidden sm:inline-flex items-center"
                  onClick={() => { void handleSignOut(); }}
                  disabled={signingOut}
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign Out
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-9 w-9 px-0 sm:hidden"
                  onClick={() => { void handleSignOut(); }}
                  disabled={signingOut}
                >
                  <LogOut className="h-4 w-4" />
                  <span className="sr-only">Sign Out</span>
                </Button>
              </>
            )}

            {/* Mobile menu trigger */}
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="md:hidden h-9 w-9 px-0"
                  aria-label="Open mobile menu"
                >
                  <Menu className="h-4 w-4" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80">
                <div className="flex flex-col space-y-4 mt-8">
                  {/* Logo in mobile menu */}
                  <button 
                    type="button"
                    className="flex items-center space-x-2 px-2 py-1 -mx-2 rounded-md focus-brand"
                    onClick={() => { closeMobileMenu(); navigate('/'); }}
                    aria-label="Go to Home"
                  >
                    <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary text-primary-foreground font-bold text-sm">
                      प्र
                    </div>
                    <span className="font-bold text-xl text-foreground">
                      Prashiskshan
                    </span>
                  </button>

                  <div className="border-t pt-4">
                    {/* Mobile Navigation */}
                    <nav className="space-y-1">
                      {navigation.map((item) => (
                        item.name === 'Home' ? (
                          <button
                            key={item.name}
                            type="button"
                            onClick={() => { closeMobileMenu(); navigate('/'); }}
                            className={`flex items-center w-full text-left px-3 py-3 rounded-md text-sm font-medium transition-colors focus-brand ${
                              isActiveRoute(item.href)
                                ? 'bg-accent text-accent-foreground'
                                : 'text-muted-foreground hover:text-foreground hover:bg-accent/50'
                            }`}
                          >
                            <item.icon className="w-5 h-5 mr-3" />
                            {item.name}
                          </button>
                        ) : (
                          <Link
                            key={item.name}
                            to={item.href}
                            onClick={closeMobileMenu}
                            className={`flex items-center px-3 py-3 rounded-md text-sm font-medium transition-colors focus-brand ${
                              isActiveRoute(item.href)
                                ? 'bg-accent text-accent-foreground'
                                : 'text-muted-foreground hover:text-foreground hover:bg-accent/50'
                            }`}
                          >
                            <item.icon className="w-5 h-5 mr-3" />
                            {item.name}
                          </Link>
                        )
                      ))}
                      
                      {currentRoleNav.map((item) => (
                        <Link
                          key={item.name}
                          to={item.href}
                          onClick={closeMobileMenu}
                          className={`flex items-center px-3 py-3 rounded-md text-sm font-medium transition-colors focus-brand ${
                            isActiveRoute(item.href)
                              ? 'bg-accent text-accent-foreground'
                              : 'text-muted-foreground hover:text-foreground hover:bg-accent/50'
                          }`}
                        >
                          <item.icon className="w-5 h-5 mr-3" />
                          {item.name}
                        </Link>
                      ))}
                    </nav>

                    {/* Mobile Auth buttons */}
                    {!isLoggedIn ? (
                      <div className="mt-6 pt-4 border-t space-y-2">
                        <Button variant="ghost" className="w-full justify-start" asChild>
                          <Link to="/auth?mode=signin" onClick={closeMobileMenu}>
                            Sign In
                          </Link>
                        </Button>
                        <Button className="w-full justify-start" asChild>
                          <Link to="/auth?mode=signup" onClick={closeMobileMenu}>
                            Get Started
                          </Link>
                        </Button>
                      </div>
                    ) : (
                      <div className="mt-6 pt-4 border-t space-y-2">
                        <Button
                          variant="outline"
                          className="w-full justify-start"
                          onClick={() => { void handleSignOut(true); }}
                          disabled={signingOut}
                        >
                          <LogOut className="w-4 h-4 mr-2" />
                          Sign Out
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        {children}
      </main>

      {/* Footer */}
      <footer className="border-t bg-muted/30">
        <div className="container-mobile py-8 md:py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Logo and description */}
            <div className="md:col-span-1">
              <Link to="/" className="flex items-center space-x-2 mb-4">
                <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary text-primary-foreground font-bold text-sm">
                  प्र
                </div>
                <span className="font-bold text-xl text-foreground">
                  Prashiskshan
                </span>
              </Link>
              <p className="text-sm text-muted-foreground mb-4">
                Empowering rural India's students with verified internships and micro-projects. 
                Apply online or via SMS, work offline-first.
              </p>
              <div className="flex space-x-2">
                <Badge variant="secondary" className="bg-green-50 text-green-700 border-green-200">
                  <Shield className="w-3 h-3 mr-1" />
                  College Verified
                </Badge>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="font-semibold text-foreground mb-3">Platform</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link to="/projects" className="text-muted-foreground hover:text-foreground transition-colors">
                    Browse Projects
                  </Link>
                </li>
                <li>
                  <Link to="/auth?mode=signup&role=student" className="text-muted-foreground hover:text-foreground transition-colors">
                    For Students
                  </Link>
                </li>
                <li>
                  <Link to="/auth?mode=signup&role=employer" className="text-muted-foreground hover:text-foreground transition-colors">
                    For Employers
                  </Link>
                </li>
                <li>
                  <Link to="/auth?mode=signup&role=college_admin" className="text-muted-foreground hover:text-foreground transition-colors">
                    College Partnership
                  </Link>
                </li>
              </ul>
            </div>

            {/* Support */}
            <div>
              <h3 className="font-semibold text-foreground mb-3">Support</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link to="/help" className="text-muted-foreground hover:text-foreground transition-colors">
                    Help Center
                  </Link>
                </li>
                <li>
                  <Link to="/contact" className="text-muted-foreground hover:text-foreground transition-colors">
                    Contact Us
                  </Link>
                </li>
                <li>
                  <Link to="/sms-guide" className="text-muted-foreground hover:text-foreground transition-colors">
                    SMS Application Guide
                  </Link>
                </li>
                <li>
                  <a href="tel:+919876543210" className="text-muted-foreground hover:text-foreground transition-colors">
                    SMS: +91 98765 43210
                  </a>
                </li>
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h3 className="font-semibold text-foreground mb-3">Legal</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link to="/privacy" className="text-muted-foreground hover:text-foreground transition-colors">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link to="/terms" className="text-muted-foreground hover:text-foreground transition-colors">
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link to="/cookies" className="text-muted-foreground hover:text-foreground transition-colors">
                    Cookie Policy
                  </Link>
                </li>
                <li>
                  <Link to="/accessibility" className="text-muted-foreground hover:text-foreground transition-colors">
                    Accessibility
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-8 pt-8 border-t flex flex-col md:flex-row md:items-center md:justify-between">
            <p className="text-xs text-muted-foreground">
              © 2024 Prashiskshan. Built for Smart India Hackathon. All rights reserved.
            </p>
            <div className="mt-4 md:mt-0 flex items-center space-x-4">
              <Badge variant="outline" className="text-xs">
                Made in India 🇮🇳
              </Badge>
              <span className="text-xs text-muted-foreground">
                v1.0.0
              </span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
