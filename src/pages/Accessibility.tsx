import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function Accessibility() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container-mobile py-8 max-w-3xl">
        <Card>
          <CardHeader>
            <CardTitle>Accessibility</CardTitle>
          </CardHeader>
          <CardContent className="text-muted-foreground space-y-3">
            <p>We aim to meet WCAG standards. This is a placeholder page.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}


