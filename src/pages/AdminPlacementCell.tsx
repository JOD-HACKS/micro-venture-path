import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Shield, CheckCircle, XCircle } from 'lucide-react';

export default function AdminPlacementCell() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container-mobile py-8">
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Shield className="w-5 h-5 mr-2" />
              Verification Center
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[{ id: 'ver1', type: 'Project', name: 'Panchayat Digital Notice Board' }, { id: 'ver2', type: 'Employer', name: 'KrishiKart Labs' }, { id: 'ver3', type: 'Student', name: 'Aarav Mehta' }].map(item => (
                <div key={item.id} className="p-4 border rounded-lg flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="font-medium">{item.name}</div>
                    <div className="text-sm text-muted-foreground">{item.type} pending verification</div>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                    <Button size="sm" variant="outline" className="w-full sm:w-auto text-green-700 border-green-200">
                      <CheckCircle className="w-4 h-4 mr-1" /> Approve
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

