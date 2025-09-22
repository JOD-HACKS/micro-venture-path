import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function Help() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container-mobile py-8 max-w-3xl">
        <Card>
          <CardHeader>
            <CardTitle>Help Center</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-muted-foreground">
            <p>Find answers to common questions about applying, offline mode, and SMS applications.</p>
            <ul className="list-disc pl-5">
              <li>How to apply via SMS</li>
              <li>How escrow payments work</li>
              <li>How college verification works</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}


