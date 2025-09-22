import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

const allSkills = ['React', 'JavaScript', 'Python', 'UI/UX Design', 'Data Analysis', 'Node.js', 'Mobile Development'];
const verified = ['React', 'JavaScript'];

export default function Skills() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container-mobile py-8 max-w-3xl">
        <Card>
          <CardHeader>
            <CardTitle>Verify More Skills</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {allSkills.map(skill => (
                <Badge key={skill} variant={verified.includes(skill) ? 'default' : 'secondary'}>
                  {skill}{verified.includes(skill) ? ' ✓' : ''}
                </Badge>
              ))}
            </div>
            <div className="mt-4">
              <Button disabled>Start Verification (coming soon)</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}


