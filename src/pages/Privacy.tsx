import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function Privacy() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container-mobile py-8 max-w-3xl">
        <Card>
          <CardHeader>
            <CardTitle>Privacy Policy</CardTitle>
          </CardHeader>
          <CardContent className="text-muted-foreground space-y-3">
            <p>Placeholder privacy policy content.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}


