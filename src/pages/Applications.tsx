import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { FileText, IndianRupee } from 'lucide-react';

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

const getStatusColor = (status: string) => {
  switch (status) {
    case 'selected': return 'bg-green-100 text-green-800 border-green-200';
    case 'shortlisted': return 'bg-blue-100 text-blue-800 border-blue-200';
    case 'submitted': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    case 'rejected': return 'bg-red-100 text-red-800 border-red-200';
    default: return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

export default function Applications() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container-mobile py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-foreground">Your Applications</h1>
            <p className="text-muted-foreground">Track the status of your internship applications</p>
          </div>
          <Button asChild>
            <Link to="/projects">Browse Projects</Link>
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <FileText className="w-5 h-5 mr-2" />
              Applications ({mockApplications.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockApplications.map((application) => (
                <div key={application.id} className="p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div>
                      <h3 className="font-medium text-foreground">
                        <Link to={`/applications/${application.id}`} className="hover:underline">
                          {application.projectTitle}
                        </Link>
                      </h3>
                      <div className="text-sm text-muted-foreground mt-1 flex items-center gap-2">
                        <span>Applied {new Date(application.appliedAt).toLocaleDateString()}</span>
                        <span>•</span>
                        <span>{application.employer}</span>
                        <span>•</span>
                        <span className="inline-flex items-center">
                          <IndianRupee className="w-3 h-3 mr-1" />
                          {application.stipend.toLocaleString()}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge className={getStatusColor(application.status)}>
                        {application.status}
                      </Badge>
                      <Button variant="outline" size="sm" asChild>
                        <Link to={`/applications/${application.id}`}>View</Link>
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}


