import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

export default function EmployerProjectNew() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container-mobile py-8 max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle>Post a New Project</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="title">Title</Label>
              <Input id="title" placeholder="Project title" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" className="min-h-[140px]" placeholder="Describe the project" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="stipend">Stipend (INR)</Label>
              <Input id="stipend" type="number" placeholder="10000" />
            </div>
            <Button disabled>Submit (placeholder)</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}


