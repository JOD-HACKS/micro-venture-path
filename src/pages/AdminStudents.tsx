import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { GraduationCap, CheckCircle, XCircle } from 'lucide-react';

export default function AdminStudents() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container-mobile py-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <GraduationCap className="w-5 h-5 mr-2" />
              Students Pending Verification
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[{
                id: 'stu1', name: 'Aarav Mehta', college: 'GEC Bharuch', year: 3, skills: ['React', 'TypeScript']
              }, {
                id: 'stu2', name: 'Ishita Rao', college: 'AKTU, Lucknow', year: 3, skills: ['Python', 'Data Viz']
              }, {
                id: 'stu3', name: 'Rohit Kumar', college: 'NIT Raipur', year: 2, skills: ['Vue', 'Node.js']
              }].map(s => (
                <div key={s.id} className="p-4 border rounded-lg flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div className="min-w-0 flex-1">
                    <div className="font-medium truncate">{s.name}</div>
                    <div className="text-sm text-muted-foreground truncate">{s.college} • Year {s.year}</div>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {s.skills.map(skill => (
                        <Badge key={skill} variant="secondary" className="text-xs">{skill}</Badge>
                      ))}
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                    <Button size="sm" variant="outline" className="w-full sm:w-auto text-green-700 border-green-200">
                      <CheckCircle className="w-4 h-4 mr-1" /> Verify
                    </Button>
                    <Button size="sm" variant="outline" className="w-full sm:w-auto text-red-700 border-red-200">
                      <XCircle className="w-4 h-4 mr-1" /> Reject
                    </Button>
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

