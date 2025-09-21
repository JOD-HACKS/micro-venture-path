import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Bell,
  BookOpen,
  Briefcase,
  Calendar,
  CheckCircle,
  Clock,
  DollarSign,
  FileText,
  GraduationCap,
  MapPin,
  Plus,
  Shield,
  Star,
  TrendingUp,
  Users,
  Zap
} from 'lucide-react';
import { ProjectCard } from '@/components/ui/project-card';
import { mockProjects } from '@/lib/db/mock-data';
import { useToast } from '@/hooks/use-toast';

// Mock user data - in real app this would come from auth context
const mockUser = {
  id: '1',
  name: 'Priya Sharma',
  email: 'priya.sharma@example.com',
  role: 'student' as const,
  avatar: '',
  college: 'Government Engineering College, Bharuch',
  year: 3,
  course: 'Computer Science Engineering',
  skills: ['React', 'JavaScript', 'Python', 'UI/UX Design'],
  completedProjects: 3,
  rating: 4.8,
  totalEarnings: 18500,
  isCollegeVerified: true,
  skillsVerified: ['React', 'JavaScript'],
  joinedAt: '2024-01-15',
};

const mockNotifications = [
  {
    id: '1',
    type: 'application_update',
    title: 'Application Approved!',
    message: 'Your application for "Rural E-Commerce Mobile App" has been approved.',
    time: '2 hours ago',
    isRead: false,
  },
  {
    id: '2',
    type: 'skill_verification',
    title: 'Skill Verified',
    message: 'Your React skill has been verified successfully.',
    time: '1 day ago',
    isRead: false,
  },
  {
    id: '3',
    type: 'payment',
    title: 'Payment Released',
    message: '₹5,000 has been released for completed milestone.',
    time: '3 days ago',
    isRead: true,
  },
];

const mockApplications = [
  {
    id: '1',
    projectId: '1',
    projectTitle: 'Rural E-Commerce Mobile App Development',
    status: 'selected' as const,
    appliedAt: '2024-09-18',
    employer: 'TechCorp Solutions',
    stipend: 5000,
  },
  {
    id: '2',
    projectId: '2', 
    projectTitle: 'Smart Irrigation System Dashboard',
    status: 'shortlisted' as const,
    appliedAt: '2024-09-20',
    employer: 'AgriTech Innovations',
    stipend: 8000,
  },
  {
    id: '3',
    projectId: '8',
    projectTitle: 'Digital Literacy Training Platform',
    status: 'submitted' as const,
    appliedAt: '2024-09-21',
    employer: 'EduTech Foundation',
    stipend: 18000,
  },
];

export default function Dashboard() {
  const { toast } = useToast();
  const [user] = useState(mockUser);
  const [notifications] = useState(mockNotifications);
  const [applications] = useState(mockApplications);
  const [recommendedProjects, setRecommendedProjects] = useState(mockProjects.slice(0, 3));

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'selected': return 'bg-green-100 text-green-800 border-green-200';
      case 'shortlisted': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'submitted': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'rejected': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const profileCompleteness = () => {
    let completed = 0;
    const total = 7;
    
    if (user.name) completed++;
    if (user.email) completed++;
    if (user.skills.length > 0) completed++;
    if (user.college) completed++;
    if (user.course) completed++;
    if (user.avatar) completed++;
    if (user.skillsVerified.length > 0) completed++;
    
    return Math.round((completed / total) * 100);
  };

  const unreadNotifications = notifications.filter(n => !n.isRead).length;

  return (
    <div className="min-h-screen bg-background">
      <div className="container-mobile py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            {/* Welcome Section */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h1 className="text-3xl font-bold text-foreground">
                  Welcome back, {user.name.split(' ')[0]}! 👋
                </h1>
                <p className="text-muted-foreground mt-1">
                  Here's what's happening with your projects today.
                </p>
              </div>
              
              <div className="flex items-center space-x-2 mt-4 sm:mt-0">
                <Button asChild>
                  <Link to="/projects">
                    <Plus className="w-4 h-4 mr-2" />
                    Browse Projects
                  </Link>
                </Button>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Applications</CardTitle>
                  <FileText className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{applications.length}</div>
                  <p className="text-xs text-muted-foreground">
                    {applications.filter(a => a.status === 'selected').length} selected
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Completed</CardTitle>
                  <CheckCircle className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{user.completedProjects}</div>
                  <p className="text-xs text-muted-foreground">
                    Projects finished
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Earnings</CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">₹{user.totalEarnings.toLocaleString()}</div>
                  <p className="text-xs text-muted-foreground">
                    Total earned
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Rating</CardTitle>
                  <Star className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{user.rating}</div>
                  <p className="text-xs text-muted-foreground">
                    Average rating
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Recent Applications */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Briefcase className="w-5 h-5 mr-2" />
                  Recent Applications
                </CardTitle>
                <CardDescription>
                  Track the status of your recent project applications
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {applications.map((application) => (
                    <div key={application.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                      <div className="flex-1">
                        <h4 className="font-medium line-clamp-1">{application.projectTitle}</h4>
                        <div className="flex items-center space-x-4 mt-1 text-sm text-muted-foreground">
                          <span>Applied {new Date(application.appliedAt).toLocaleDateString()}</span>
                          <span>•</span>
                          <span>{application.employer}</span>
                          <span>•</span>
                          <span>₹{application.stipend.toLocaleString()}</span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Badge className={getStatusColor(application.status)}>
                          {application.status.replace('_', ' ')}
                        </Badge>
                        <Button variant="ghost" size="sm" asChild>
                          <Link to={`/applications/${application.id}`}>
                            View
                          </Link>
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="mt-4 pt-4 border-t">
                  <Button variant="outline" className="w-full" asChild>
                    <Link to="/applications">
                      View All Applications
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Recommended Projects */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Zap className="w-5 h-5 mr-2" />
                  Recommended for You
                </CardTitle>
                <CardDescription>
                  Projects matched to your skills and interests
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {recommendedProjects.map((project) => (
                    <ProjectCard key={project.id} project={project} showEmployer={false} />
                  ))}
                </div>
                
                <div className="mt-6">
                  <Button variant="outline" className="w-full" asChild>
                    <Link to="/projects">
                      Browse All Projects
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Profile Card */}
            <Card>
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={user.avatar} alt={user.name} />
                    <AvatarFallback className="bg-primary/10 text-primary">
                      {user.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2">
                      <h3 className="font-semibold truncate">{user.name}</h3>
                      {user.isCollegeVerified && (
                        <Shield className="w-4 h-4 text-green-600" />
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground truncate">{user.college}</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Profile Completeness</span>
                    <span className="text-sm text-muted-foreground">{profileCompleteness()}%</span>
                  </div>
                  <Progress value={profileCompleteness()} className="h-2" />
                </div>

                <Separator />

                <div className="space-y-2">
                  <div className="flex items-center text-sm">
                    <GraduationCap className="w-4 h-4 mr-2 text-muted-foreground" />
                    <span className="text-muted-foreground">Year:</span>
                    <span className="ml-auto font-medium">{user.year}</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <BookOpen className="w-4 h-4 mr-2 text-muted-foreground" />
                    <span className="text-muted-foreground truncate">Course:</span>
                    <span className="ml-auto font-medium">{user.course}</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <Star className="w-4 h-4 mr-2 text-muted-foreground" />
                    <span className="text-muted-foreground">Rating:</span>
                    <span className="ml-auto font-medium">{user.rating}/5.0</span>
                  </div>
                </div>

                <Button variant="outline" size="sm" className="w-full" asChild>
                  <Link to="/profile">
                    Edit Profile
                  </Link>
                </Button>
              </CardContent>
            </Card>

            {/* Skills */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Skills</CardTitle>
                <CardDescription>
                  {user.skillsVerified.length} of {user.skills.length} verified
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2 mb-4">
                  {user.skills.map((skill) => {
                    const isVerified = user.skillsVerified.includes(skill);
                    return (
                      <Badge 
                        key={skill} 
                        variant={isVerified ? "default" : "secondary"}
                        className={isVerified ? "bg-green-100 text-green-800 border-green-200" : ""}
                      >
                        {skill}
                        {isVerified && <CheckCircle className="w-3 h-3 ml-1" />}
                      </Badge>
                    );
                  })}
                </div>
                
                <Button variant="outline" size="sm" className="w-full" asChild>
                  <Link to="/skills">
                    Verify More Skills
                  </Link>
                </Button>
              </CardContent>
            </Card>

            {/* Notifications */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Bell className="w-5 h-5 mr-2" />
                    Notifications
                  </div>
                  {unreadNotifications > 0 && (
                    <Badge variant="destructive" className="h-5 w-5 rounded-full p-0 text-xs flex items-center justify-center">
                      {unreadNotifications}
                    </Badge>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {notifications.slice(0, 3).map((notification) => (
                    <div 
                      key={notification.id} 
                      className={`p-3 rounded-lg border transition-colors cursor-pointer hover:bg-muted/50 ${
                        !notification.isRead ? 'bg-primary/5 border-primary/20' : 'bg-muted/20'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-medium line-clamp-1">{notification.title}</h4>
                          <p className="text-xs text-muted-foreground line-clamp-2 mt-1">
                            {notification.message}
                          </p>
                          <span className="text-xs text-muted-foreground mt-1">{notification.time}</span>
                        </div>
                        {!notification.isRead && (
                          <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0 mt-1"></div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                
                <Button variant="outline" size="sm" className="w-full mt-4" asChild>
                  <Link to="/notifications">
                    View All Notifications
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}