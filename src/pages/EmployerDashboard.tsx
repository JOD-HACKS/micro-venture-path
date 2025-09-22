import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { mockProjects } from '@/lib/db/mock-data';
import { Briefcase, Users, IndianRupee, Clock, Plus } from 'lucide-react';

export default function EmployerDashboard() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container-mobile py-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
          <h1 className="text-2xl font-bold">Employer Dashboard</h1>
          <Button asChild className="w-full sm:w-auto">
            <Link to="/employer/projects/new" className="flex items-center justify-center">
              <Plus className="w-4 h-4 mr-2" />
              Post Project
            </Link>
          </Button>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Briefcase className="w-5 h-5 mr-2" />
              My Projects
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {mockProjects.slice(0, 4).map((p) => (
                <div key={p.id} className="border rounded-lg p-4 hover:bg-muted/50 transition-colors">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium truncate">{p.title}</h3>
                      <div className="mt-1 text-sm text-muted-foreground line-clamp-2">{p.description}</div>
                      <div className="mt-3 flex items-center gap-3 text-sm">
                        <span className="inline-flex items-center">
                          <IndianRupee className="w-4 h-4 mr-1" />
                          {p.stipend_amount.toLocaleString()}
                        </span>
                        <span className="inline-flex items-center">
                          <Clock className="w-4 h-4 mr-1" />
                          {p.duration_weeks} weeks
                        </span>
                        <span className="inline-flex items-center">
                          <Users className="w-4 h-4 mr-1" />
                          {p.applications_count} apps
                        </span>
                      </div>
                    </div>
                    <Badge variant="outline" className="sm:ml-3 self-start sm:self-auto">{p.status}</Badge>
                  </div>
                  <div className="mt-3 flex flex-col sm:flex-row gap-2">
                    <Button variant="outline" size="sm" asChild className="w-full sm:w-auto">
                      <Link to={`/projects/${p.id}`}>View</Link>
                    </Button>
                    <Button variant="outline" size="sm" className="w-full sm:w-auto">Manage</Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Users className="w-5 h-5 mr-2" />
              Recent Applicants
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[{
                id: 'a1', name: 'Aarav Mehta', project: 'Farmer Marketplace Lite (Mobile App)', status: 'shortlisted'
              }, {
                id: 'a2', name: 'Ishita Rao', project: 'Smart Irrigation Dashboard (Web)', status: 'submitted'
              }, {
                id: 'a3', name: 'Rohit Kumar', project: 'Digital Literacy Platform (Local Languages)', status: 'selected'
              }].map(app => (
                <div key={app.id} className="p-3 border rounded-lg flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div className="min-w-0 flex-1">
                    <div className="font-medium truncate">{app.name}</div>
                    <div className="text-sm text-muted-foreground truncate">{app.project}</div>
                  </div>
                  <Badge className="w-fit">{app.status}</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
