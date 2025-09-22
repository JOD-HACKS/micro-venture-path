import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Code } from 'lucide-react';

export default function SmsGuide() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container-mobile py-8 max-w-3xl">
        <Card>
          <CardHeader>
            <CardTitle>SMS Application Guide</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p>Apply to any project via SMS using this format:</p>
            <div className="flex items-center gap-2 text-sm bg-muted p-3 rounded">
              <Code className="w-4 h-4" />
              APPLY &lt;PROJECT_ID&gt; &lt;OPTIONAL_MESSAGE&gt;
            </div>
            <p>Send to: +91 98765 43210</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}


