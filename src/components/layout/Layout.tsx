import { Header } from './Header';
import { Footer } from './Footer';

interface LayoutProps {
  children: React.ReactNode;
  hideFooter?: boolean;
}

export function Layout({ children, hideFooter = false }: LayoutProps) {
  // TODO: Replace with actual auth state
  const isAuthenticated = false;
  const userRole = undefined;
  const userName = undefined;

  const handleSignOut = () => {
    // TODO: Implement sign out
    console.log('Sign out');
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header 
        isAuthenticated={isAuthenticated}
        userRole={userRole}
        userName={userName}
        onSignOut={handleSignOut}
      />
      
      <main className="flex-1">
        {children}
      </main>
      
      {!hideFooter && <Footer />}
    </div>
  );
}