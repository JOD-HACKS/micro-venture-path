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
      <section className="relative bg-gradient-to-br from-primary/10 via-secondary to-accent/10 py-20 md:py-32">
        <div className="container-mobile">
          <div className="text-center max-w-4xl mx-auto">
            <Badge className="mb-4 bg-primary/10 text-primary border-primary/20 hover:bg-primary/20">
              🎓 Empowering Rural India's Students
            </Badge>
            
            <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6 leading-tight">
              College-Verified <span className="text-primary">Internships</span> for Every Student
            </h1>
            
            <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
              Join India's largest platform for verified internships and micro-projects. 
              Apply via SMS, work offline, and get paid securely through our escrow system.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <Button size="lg" className="px-8 py-3 text-lg" asChild>
                <Link to="/auth?mode=signup&role=student">
                  Start as Student
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              
              <Button size="lg" variant="outline" className="px-8 py-3 text-lg" asChild>
                <Link to="/auth?mode=signup&role=employer">
                  Hire Talent
                </Link>
              </Button>
              
              <Button size="lg" variant="ghost" className="px-8 py-3 text-lg" asChild>
                <Link to="/auth?mode=signup&role=college_admin">
                  College Partnership
                </Link>
              </Button>
            </div>

            {/* Demo Video Placeholder */}
            <div className="relative max-w-2xl mx-auto">
              <div className="aspect-video bg-muted rounded-xl border-2 border-border flex items-center justify-center group cursor-pointer hover:bg-muted/80 transition-colors">
                <div className="text-center">
                  <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mb-4 mx-auto group-hover:scale-110 transition-transform">
                    <Play className="w-8 h-8 text-primary-foreground ml-1" />
                  </div>
                  <p className="text-muted-foreground">Watch Demo: How to Apply via SMS</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-muted/30">
        <div className="container-mobile">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-primary/10 rounded-full mb-3">
                  <stat.icon className="w-6 h-6 text-primary" />
                </div>
                <div className="text-2xl md:text-3xl font-bold text-foreground mb-1">
                  {stat.value}
                </div>
                <div className="text-sm text-muted-foreground">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container-mobile">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Why Choose Prashiskshan?
            </h2>
            <p className="text-lg text-muted-foreground">
              We've built India's most trusted platform for student internships, 
              with unique features designed for rural and remote areas.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="border-2 hover:shadow-brand transition-all duration-300 hover:-translate-y-1">
                <CardHeader>
                  <div className={`inline-flex items-center justify-center w-12 h-12 ${feature.bgColor} rounded-lg mb-4`}>
                    <feature.icon className={`w-6 h-6 ${feature.color}`} />
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Projects */}
      <section className="py-20 bg-muted/30">
        <div className="container-mobile">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Featured Projects
            </h2>
            <p className="text-lg text-muted-foreground">
              Discover amazing opportunities from verified employers and start building your future today.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {featuredProjects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>

          <div className="text-center">
            <Button size="lg" variant="outline" asChild>
              <Link to="/projects">
                View All Projects
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20">
        <div className="container-mobile">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Success Stories
            </h2>
            <p className="text-lg text-muted-foreground">
              Hear from students who have transformed their careers through our platform.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="text-center">
                <CardHeader>
                  <div className="flex justify-center mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <CardTitle className="text-lg">{testimonial.name}</CardTitle>
                  <p className="text-sm text-muted-foreground">{testimonial.college}</p>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">"{testimonial.text}"</p>
                  <Badge variant="secondary">{testimonial.project}</Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="container-mobile text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Start Your Journey?
          </h2>
          <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
            Join thousands of students who are already building their careers with verified internships and micro-projects.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" className="px-8 py-3 text-lg" asChild>
              <Link to="/auth?mode=signup">
                Get Started Free
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            
            <Button size="lg" variant="outline" className="px-8 py-3 text-lg border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary" asChild>
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