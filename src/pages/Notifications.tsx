import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const mockNotifications = [
  { id: '1', title: 'Application Approved!', message: 'Your application for "Rural E-Commerce Mobile App" has been approved.', isRead: false, time: '2h' },
  { id: '2', title: 'Skill Verified', message: 'Your React skill has been verified successfully.', isRead: true, time: '1d' },
  { id: '3', title: 'Payment Released', message: '₹5,000 has been released for completed milestone.', isRead: true, time: '3d' },
];

export default function Notifications() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container-mobile py-8 max-w-3xl">
        <Card>
          <CardHeader>
            <CardTitle>Notifications</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {mockNotifications.map(n => (
              <div key={n.id} className={`p-4 border rounded-lg ${!n.isRead ? 'bg-primary/5 border-primary/20' : 'bg-muted/30'}`}>
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-medium">{n.title}</h4>
                    <p className="text-sm text-muted-foreground mt-1">{n.message}</p>
                  </div>
                  {!n.isRead && <Badge variant="destructive">New</Badge>}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}


