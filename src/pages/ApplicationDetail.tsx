import { Link, useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowLeft, FileText, IndianRupee } from 'lucide-react';

const mockApplications = [
  {
    id: '1',
    projectId: '1',
    projectTitle: 'Rural E-Commerce Mobile App Development',
    status: 'selected' as const,
    appliedAt: '2024-09-18',
    employer: 'TechCorp Solutions',
    stipend: 5000,
    coverLetter: 'I am excited to apply for this project because...'
  },
  {
    id: '2',
    projectId: '2', 
    projectTitle: 'Smart Irrigation System Dashboard',
    status: 'shortlisted' as const,
    appliedAt: '2024-09-20',
    employer: 'AgriTech Innovations',
    stipend: 8000,
    coverLetter: 'My background in data viz and React makes me a good fit.'
  },
  {
    id: '3',
    projectId: '8',
    projectTitle: 'Digital Literacy Training Platform',
    status: 'submitted' as const,
    appliedAt: '2024-09-21',
    employer: 'EduTech Foundation',
    stipend: 18000,
    coverLetter: 'I have built LMS modules and can contribute quickly.'
  },
];

const getStatusColor = (status: string) => {
  switch (status) {
    case 'selected': return 'bg-green-100 text-green-800 border-green-200';
    case 'shortlisted': return 'bg-blue-100 text-blue-800 border-blue-200';
    case 'submitted': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    case 'rejected': return 'bg-red-100 text-red-800 border-red-200';
    default: return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

export default function ApplicationDetail() {
  const { id } = useParams<{ id: string }>();
  const application = mockApplications.find(a => a.id === id);

  if (!application) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="w-full max-w-md text-center p-8">
          <CardContent>
            <h2 className="text-xl font-semibold mb-2">Application Not Found</h2>
            <p className="text-muted-foreground mb-4">We couldn't find this application.</p>
            <Button asChild>
              <Link to="/applications">Back to Applications</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b bg-card/80 backdrop-blur-sm">
        <div className="container-mobile py-4">
          <Button variant="ghost" size="sm" asChild className="group">
            <Link to="/applications" className="flex items-center text-muted-foreground hover:text-foreground transition-colors">
              <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
              Back to Applications
            </Link>
          </Button>
        </div>
      </div>

      <div className="container-mobile py-8">
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center">
              <FileText className="w-5 h-5 mr-2" />
              Application Details
            </CardTitle>
            <CardDescription>
              Submitted on {new Date(application.appliedAt).toLocaleDateString()}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <h3 className="font-semibold text-lg">{application.projectTitle}</h3>
                <p className="text-sm text-muted-foreground">{application.employer}</p>
              </div>
              <div className="flex items-center gap-3">
                <Badge className={getStatusColor(application.status)}>
                  {application.status}
                </Badge>
                <div className="text-sm inline-flex items-center">
                  <IndianRupee className="w-3 h-3 mr-1" />
                  {application.stipend.toLocaleString()}
                </div>
              </div>
            </div>

            <div className="pt-4 border-t">
              <h4 className="font-medium mb-2">Your Cover Letter</h4>
              <div className="bg-muted/50 p-3 rounded-lg text-sm whitespace-pre-wrap">
                {application.coverLetter}
              </div>
            </div>

            <div className="pt-4 border-t flex items-center gap-3">
              <Button asChild>
                <Link to={`/projects/${application.projectId}`}>View Project</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link to="/projects">Browse More Projects</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}


