import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';
import { Menu, Search, Bell, User, LogOut, Settings } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface HeaderProps {
  isAuthenticated?: boolean;
  userRole?: 'student' | 'employer' | 'college_admin' | 'coordinator';
  userName?: string;
  onSignOut?: () => void;
}

export function Header({ isAuthenticated = false, userRole, userName, onSignOut }: HeaderProps) {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const navItems = [
    { href: '/projects', label: 'Browse Projects', public: true },
    { href: '/employers', label: 'For Employers', public: true },
    { href: '/colleges', label: 'For Colleges', public: true },
    { href: '/about', label: 'About', public: true },
  ];

  const authenticatedNavItems = [
    { href: '/dashboard', label: 'Dashboard', roles: ['student', 'employer', 'college_admin', 'coordinator'] },
    { href: '/applications', label: 'Applications', roles: ['student'] },
    { href: '/my-projects', label: 'My Projects', roles: ['employer'] },
    { href: '/verification', label: 'Verification', roles: ['college_admin', 'coordinator'] },
  ];

  const isActiveRoute = (href: string) => location.pathname === href;

  const NavItems = ({ mobile = false }: { mobile?: boolean }) => (
    <>
      {navItems.map((item) => (
        <Link
          key={item.href}
          to={item.href}
          className={`${mobile ? 'block px-3 py-2' : 'inline-flex'} text-sm font-medium transition-colors hover:text-primary ${
            isActiveRoute(item.href) ? 'text-primary' : 'text-foreground/80'
          }`}
          onClick={() => mobile && setIsOpen(false)}
        >
          {item.label}
        </Link>
      ))}
      
      {isAuthenticated && userRole && authenticatedNavItems
        .filter(item => item.roles.includes(userRole))
        .map((item) => (
          <Link
            key={item.href}
            to={item.href}
            className={`${mobile ? 'block px-3 py-2' : 'inline-flex'} text-sm font-medium transition-colors hover:text-primary ${
              isActiveRoute(item.href) ? 'text-primary' : 'text-foreground/80'
            }`}
            onClick={() => mobile && setIsOpen(false)}
          >
            {item.label}
          </Link>
        ))}
    </>
  );

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container-mobile flex h-16 items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2">
          <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-sm">P</span>
          </div>
          <span className="font-bold text-xl text-foreground">Prashiskshan</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          <NavItems />
        </nav>

        {/* Right Section */}
        <div className="flex items-center space-x-2">
          {/* Search Button - Hidden on mobile */}
          <Button variant="ghost" size="sm" className="hidden sm:inline-flex">
            <Search className="h-4 w-4" />
            <span className="sr-only">Search</span>
          </Button>

          {isAuthenticated ? (
            <>
              {/* Notifications */}
              <Button variant="ghost" size="sm" className="relative">
                <Bell className="h-4 w-4" />
                <Badge 
                  variant="destructive" 
                  className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 text-xs flex items-center justify-center"
                >
                  3
                </Badge>
                <span className="sr-only">Notifications</span>
              </Button>

              {/* User Menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="flex items-center space-x-2">
                    <User className="h-4 w-4" />
                    {userName && <span className="hidden sm:inline">{userName}</span>}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium">{userName || 'User'}</p>
                      <p className="text-xs text-muted-foreground capitalize">{userRole?.replace('_', ' ')}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/profile" className="flex items-center">
                      <User className="mr-2 h-4 w-4" />
                      Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/settings" className="flex items-center">
                      <Settings className="mr-2 h-4 w-4" />
                      Settings
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={onSignOut} className="text-destructive">
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="sm" asChild>
                <Link to="/auth">Sign In</Link>
              </Button>
              <Button size="sm" asChild>
                <Link to="/auth?mode=signup">Get Started</Link>
              </Button>
            </div>
          )}

          {/* Mobile Menu */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="sm" className="md:hidden">
                <Menu className="h-4 w-4" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-80">
              <div className="flex flex-col space-y-4 mt-6">
                <div className="flex items-center space-x-2 px-3">
                  <div className="h-6 w-6 rounded bg-primary flex items-center justify-center">
                    <span className="text-primary-foreground font-bold text-xs">P</span>
                  </div>
                  <span className="font-bold text-lg">Prashiskshan</span>
                </div>
                
                <nav className="flex flex-col space-y-2">
                  <NavItems mobile />
                </nav>
                
                {!isAuthenticated && (
                  <div className="flex flex-col space-y-2 px-3 pt-4 border-t">
                    <Button variant="ghost" asChild>
                      <Link to="/auth" onClick={() => setIsOpen(false)}>Sign In</Link>
                    </Button>
                    <Button asChild>
                      <Link to="/auth?mode=signup" onClick={() => setIsOpen(false)}>Get Started</Link>
                    </Button>
                  </div>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}