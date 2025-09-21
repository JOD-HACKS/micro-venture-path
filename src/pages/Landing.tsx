import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  CheckCircle, 
  Shield, 
  Smartphone, 
  Clock, 
  Users, 
  TrendingUp,
  Star,
  ArrowRight,
  Play,
  Award,
  Globe
} from 'lucide-react';
import { ProjectCard } from '@/components/ui/project-card';
import { mockProjects } from '@/lib/db/mock-data';

export default function Landing() {
  const featuredProjects = mockProjects.slice(0, 3);
  
  const features = [
    {
      icon: Shield,
      title: 'College-Verified Projects',
      description: 'All projects are verified by partnered colleges and universities, ensuring quality and legitimacy for students.',
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      icon: Smartphone,
      title: 'SMS Application System',
      description: 'Apply to projects via SMS even without internet. Perfect for students in remote areas with limited connectivity.',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      icon: Clock,
      title: 'Micro-Internships',
      description: 'Short-term projects (1-4 weeks) that fit around your studies and provide real-world experience.',
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    },
    {
      icon: Shield,
      title: 'Escrow Protection',
      description: 'Secure payment system that protects both students and employers. Payments are held safely until milestones are met.',
      color: 'text-orange-600',
      bgColor: 'bg-orange-50'
    },
    {
      icon: Award,
      title: 'Skill Verification',
      description: 'Earn verified skill badges through practical tasks and showcase your capabilities to employers.',
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50'
    },
    {
      icon: Globe,
      title: 'Offline-First Design',
      description: 'Work seamlessly even with poor internet. Queue applications offline and sync when connected.',
      color: 'text-teal-600',
      bgColor: 'bg-teal-50'
    }
  ];

  const stats = [
    { label: 'Active Students', value: '25,000+', icon: Users },
    { label: 'Projects Completed', value: '3,500+', icon: CheckCircle },
    { label: 'Partner Colleges', value: '150+', icon: Shield },
    { label: 'Success Rate', value: '94%', icon: TrendingUp }
  ];

  const testimonials = [
    {
      name: 'Priya Sharma',
      college: 'Government Engineering College, Bharuch',
      text: 'I completed my first micro-project in just 2 weeks and earned ₹5,000. The college verification gave me confidence it was legitimate.',
      rating: 5,
      project: 'Rural E-Commerce App'
    },
    {
      name: 'Amit Kumar',
      college: 'Dr. A.P.J. Abdul Kalam Technical University',
      text: 'Applied via SMS from my village and got selected! The offline feature helped me stay updated even with poor network.',
      rating: 5,
      project: 'Digital Literacy Platform'
    },
    {
      name: 'Sneha Patel',
      college: 'NIT Raipur',
      text: 'The skill verification badges helped me showcase my abilities. Employers trust the college-verified system.',
      rating: 5,
      project: 'Smart Irrigation Dashboard'
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary/10 via-secondary to-accent/10 py-20 md:py-32 overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 bg-grid-white/[0.02] bg-[length:50px_50px]" />
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-secondary/5 rounded-full blur-3xl" />
        
        <div className="container-mobile relative">
          <div className="text-center max-w-4xl mx-auto">
            <div className="animate-fade-in">
              <Badge className="mb-6 bg-primary/10 text-primary border-primary/20 hover:bg-primary/20 transition-colors">
                🎓 Empowering Rural India's Students
              </Badge>
            </div>
            
            <div className="animate-slide-up">
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-foreground mb-8 leading-tight">
                College-Verified <span className="text-primary bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">Internships</span> for Every Student
              </h1>
            </div>
            
            <div className="animate-slide-up" style={{animationDelay: '0.2s'}}>
              <p className="text-xl md:text-2xl text-muted-foreground mb-10 max-w-3xl mx-auto leading-relaxed">
                Join India's largest platform for verified internships and micro-projects. 
                Apply via SMS, work offline, and get paid securely through our escrow system.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16 animate-slide-up" style={{animationDelay: '0.4s'}}>
              <Button size="lg" className="px-8 py-4 text-lg btn-primary-enhanced group" asChild>
                <Link to="/auth?mode=signup&role=student">
                  Start as Student
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
              
              <Button size="lg" variant="outline" className="px-8 py-4 text-lg hover-lift border-2" asChild>
                <Link to="/auth?mode=signup&role=employer">
                  Hire Talent
                </Link>
              </Button>
              
              <Button size="lg" variant="ghost" className="px-8 py-4 text-lg hover-lift" asChild>
                <Link to="/auth?mode=signup&role=college_admin">
                  College Partnership
                </Link>
              </Button>
            </div>

            {/* Demo Video Placeholder */}
            <div className="relative max-w-3xl mx-auto animate-scale-in" style={{animationDelay: '0.6s'}}>
              <div className="aspect-video bg-gradient-to-br from-muted to-muted/50 rounded-2xl border-2 border-border shadow-2xl flex items-center justify-center group cursor-pointer hover:shadow-3xl transition-all duration-500 hover:scale-105">
                <div className="text-center">
                  <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center mb-6 mx-auto group-hover:scale-110 transition-transform duration-300 shadow-lg">
                    <Play className="w-10 h-10 text-primary-foreground ml-1" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Watch Demo: How to Apply via SMS</h3>
                  <p className="text-muted-foreground">See how students can apply to internships using just SMS</p>
                </div>
              </div>
              {/* Video overlay effect */}
              <div className="absolute inset-0 bg-gradient-to-tr from-primary/5 to-transparent rounded-2xl pointer-events-none" />
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gradient-to-r from-muted/30 to-muted/10 border-y">
        <div className="container-mobile">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center group animate-slide-up" style={{animationDelay: `${index * 0.1}s`}}>
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary/10 to-primary/5 rounded-xl mb-4 group-hover:scale-110 transition-transform duration-300">
                  <stat.icon className="w-8 h-8 text-primary" />
                </div>
                <div className="text-3xl md:text-4xl font-bold text-foreground mb-2 bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text">
                  {stat.value}
                </div>
                <div className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-gradient-to-b from-background to-muted/20">
        <div className="container-mobile">
          <div className="text-center max-w-3xl mx-auto mb-20 animate-fade-in">
            <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-6">
              Why Choose <span className="text-primary">Prashiskshan</span>?
            </h2>
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
              We've built India's most trusted platform for student internships, 
              with unique features designed for rural and remote areas.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="group animate-slide-up" style={{animationDelay: `${index * 0.1}s`}}>
                <div className="card-enhanced p-8 h-full">
                  <div className={`inline-flex items-center justify-center w-16 h-16 ${feature.bgColor} rounded-2xl mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    <feature.icon className={`w-8 h-8 ${feature.color}`} />
                  </div>
                  <h3 className="text-xl font-bold mb-4 text-foreground group-hover:text-primary transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Projects */}
      <section className="py-24 bg-gradient-to-br from-muted/30 via-muted/10 to-background">
        <div className="container-mobile">
          <div className="text-center max-w-3xl mx-auto mb-16 animate-fade-in">
            <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-6">
              Featured <span className="text-primary">Projects</span>
            </h2>
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
              Discover amazing opportunities from verified employers and start building your future today.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {featuredProjects.map((project, index) => (
              <div key={project.id} className="animate-slide-up hover-lift" style={{animationDelay: `${index * 0.1}s`}}>
                <ProjectCard project={project} />
              </div>
            ))}
          </div>

          <div className="text-center animate-scale-in" style={{animationDelay: '0.4s'}}>
            <Button size="lg" variant="outline" className="px-8 py-4 text-lg hover-lift border-2 group" asChild>
              <Link to="/projects">
                View All Projects
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24">
        <div className="container-mobile">
          <div className="text-center max-w-3xl mx-auto mb-20 animate-fade-in">
            <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-6">
              Success <span className="text-primary">Stories</span>
            </h2>
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
              Hear from students who have transformed their careers through our platform.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="animate-slide-up" style={{animationDelay: `${index * 0.1}s`}}>
                <div className="card-enhanced p-8 text-center h-full">
                  <div className="flex justify-center mb-6">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <blockquote className="text-muted-foreground mb-6 leading-relaxed italic">
                    "{testimonial.text}"
                  </blockquote>
                  <div className="mt-auto">
                    <h4 className="font-bold text-lg text-foreground mb-1">{testimonial.name}</h4>
                    <p className="text-sm text-muted-foreground mb-3">{testimonial.college}</p>
                    <Badge variant="secondary" className="bg-primary/10 text-primary">{testimonial.project}</Badge>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-r from-primary via-primary/95 to-primary text-primary-foreground relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 bg-grid-white/[0.05] bg-[length:30px_30px]" />
        <div className="absolute -top-20 -right-20 w-40 h-40 bg-white/10 rounded-full blur-2xl" />
        <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-white/10 rounded-full blur-2xl" />
        
        <div className="container-mobile text-center relative">
          <div className="animate-fade-in">
            <h2 className="text-3xl md:text-5xl font-bold mb-6">
              Ready to Start Your Journey?
            </h2>
            <p className="text-xl md:text-2xl mb-12 opacity-90 max-w-3xl mx-auto leading-relaxed">
              Join thousands of students who are already building their careers with verified internships and micro-projects.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center animate-scale-in" style={{animationDelay: '0.2s'}}>
            <Button size="lg" variant="secondary" className="px-10 py-4 text-lg font-semibold hover-lift group" asChild>
              <Link to="/auth?mode=signup">
                Get Started Free
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
            
            <Button size="lg" variant="outline" className="px-10 py-4 text-lg border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary transition-all duration-300 hover-lift" asChild>
              <Link to="/projects">
                Browse Projects
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}