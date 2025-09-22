import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ShieldCheck, ScanLine, Check, X } from 'lucide-react';

export default function CoordinatorVerify() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container-mobile py-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <ShieldCheck className="w-5 h-5 mr-2" />
              Quick Verify
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[{
                id: 'qv1', student: 'Aarav Mehta', task: 'Prototype screens for Farmer Marketplace', submittedAt: '2025-09-20'
              }, {
                id: 'qv2', student: 'Ishita Rao', task: 'IoT data schema for irrigation', submittedAt: '2025-09-19'
              }, {
                id: 'qv3', student: 'Rohit Kumar', task: 'Localization strings for literacy platform', submittedAt: '2025-09-18'
              }].map(item => (
                <div key={item.id} className="p-4 border rounded-lg flex items-center justify-between">
                  <div className="min-w-0">
                    <div className="font-medium truncate">{item.student}</div>
                    <div className="text-sm text-muted-foreground truncate">{item.task}</div>
                    <div className="text-xs text-muted-foreground mt-1">Submitted {new Date(item.submittedAt).toLocaleDateString()}</div>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" className="text-green-700 border-green-200">
                      <Check className="w-4 h-4 mr-1" /> Approve
                    </Button>
                    <Button size="sm" variant="outline" className="text-red-700 border-red-200">
                      <X className="w-4 h-4 mr-1" /> Reject
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


