import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { 
  Mail, 
  Phone, 
  MapPin, 
  Facebook, 
  Twitter, 
  Linkedin, 
  Instagram,
  Send
} from 'lucide-react';

export function Footer() {
  const currentYear = new Date().getFullYear();

  const footerSections = [
    {
      title: 'For Students',
      links: [
        { label: 'Browse Projects', href: '/projects' },
        { label: 'Skill Verification', href: '/skills' },
        { label: 'How to Apply', href: '/help/apply' },
        { label: 'Student Success Stories', href: '/success-stories' },
      ]
    },
    {
      title: 'For Employers',
      links: [
        { label: 'Post a Project', href: '/post-project' },
        { label: 'Find Talent', href: '/talent' },
        { label: 'Pricing', href: '/pricing' },
        { label: 'Employer Resources', href: '/resources' },
      ]
    },
    {
      title: 'For Colleges',
      links: [
        { label: 'College Verification', href: '/college-verification' },
        { label: 'Admin Dashboard', href: '/admin' },
        { label: 'Partnership Program', href: '/partnerships' },
        { label: 'Training Materials', href: '/training' },
      ]
    },
    {
      title: 'Support',
      links: [
        { label: 'Help Center', href: '/help' },
        { label: 'SMS Guide', href: '/help/sms' },
        { label: 'Contact Us', href: '/contact' },
        { label: 'Report Issue', href: '/report' },
      ]
    }
  ];

  return (
    <footer className="border-t bg-muted/30">
      <div className="container-mobile py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center space-x-2 mb-4">
              <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-sm">P</span>
              </div>
              <span className="font-bold text-xl text-foreground">Prashiskshan</span>
            </Link>
            
            <p className="text-muted-foreground text-sm mb-6 max-w-md">
              Empowering India's students with college-verified internships and micro-projects. 
              Bridging the gap between education and industry, especially in rural areas.
            </p>
            
            {/* Contact Info */}
            <div className="space-y-3 text-sm text-muted-foreground">
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4" />
                <span>support@prashiskshan.in</span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4" />
                <span>+91 98765 43210</span>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="h-4 w-4" />
                <span>Bangalore, Karnataka, India</span>
              </div>
            </div>
            
            {/* Social Links */}
            <div className="flex items-center space-x-2 mt-6">
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <Facebook className="h-4 w-4" />
                <span className="sr-only">Facebook</span>
              </Button>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <Twitter className="h-4 w-4" />
                <span className="sr-only">Twitter</span>
              </Button>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <Linkedin className="h-4 w-4" />
                <span className="sr-only">LinkedIn</span>
              </Button>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <Instagram className="h-4 w-4" />
                <span className="sr-only">Instagram</span>
              </Button>
            </div>
          </div>
          
          {/* Footer Links */}
          {footerSections.map((section) => (
            <div key={section.title} className="space-y-4">
              <h4 className="font-semibold text-foreground">{section.title}</h4>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      to={link.href}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        
        {/* Newsletter Section */}
        <div className="mt-12 pt-8 border-t">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
            <div className="max-w-md">
              <h4 className="font-semibold text-foreground mb-2">Stay Updated</h4>
              <p className="text-sm text-muted-foreground mb-4">
                Get notified about new projects and opportunities in your area.
              </p>
              <div className="flex space-x-2">
                <Input 
                  type="email" 
                  placeholder="Enter your email" 
                  className="flex-1"
                />
                <Button size="sm" className="px-3">
                  <Send className="h-4 w-4" />
                  <span className="sr-only">Subscribe</span>
                </Button>
              </div>
            </div>
            
            {/* Language Selector Placeholder */}
            <div className="flex items-center space-x-4 text-sm text-muted-foreground">
              <span>🇮🇳 English</span>
              <Separator orientation="vertical" className="h-4" />
              <span>Available in 12+ languages</span>
            </div>
          </div>
        </div>
        
        {/* Bottom Section */}
        <div className="mt-8 pt-8 border-t flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          <div className="flex flex-wrap items-center space-x-6 text-sm text-muted-foreground">
            <span>© {currentYear} Prashiskshan. All rights reserved.</span>
            <Link to="/privacy" className="hover:text-foreground transition-colors">
              Privacy Policy
            </Link>
            <Link to="/terms" className="hover:text-foreground transition-colors">
              Terms of Service
            </Link>
            <Link to="/cookies" className="hover:text-foreground transition-colors">
              Cookie Policy
            </Link>
          </div>
          
          <div className="text-sm text-muted-foreground">
            Made with ❤️ for rural India
          </div>
        </div>
      </div>
    </footer>
  );
}