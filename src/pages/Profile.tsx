import { useEffect, useState, type ChangeEvent, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/auth-context';
import type { UserRole } from '@/lib/db/types';

const roleLabels: Record<UserRole, string> = {
  student: 'Student',
  employer: 'Employer',
  college_admin: 'College Admin',
  coordinator: 'Coordinator',
};

interface ProfileFormState {
  name: string;
  phone: string;
  collegeId: string;
}

export default function Profile() {
  const { user, updateProfile, signOut } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [formState, setFormState] = useState<ProfileFormState>({
    name: '',
    phone: '',
    collegeId: '',
  });
  const [saving, setSaving] = useState(false);
  const [signingOut, setSigningOut] = useState(false);

  useEffect(() => {
    if (user) {
      setFormState({
        name: user.name ?? '',
        phone: user.phone ?? '',
        collegeId: user.college_id ?? '',
      });
    }
  }, [user]);

  if (!user) {
    return null;
  }

  const handleChange = (key: keyof ProfileFormState) => (event: ChangeEvent<HTMLInputElement>) => {
    setFormState(prev => ({ ...prev, [key]: event.target.value }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSaving(true);

    const { error } = await updateProfile({
      name: formState.name.trim(),
      phone: formState.phone.trim(),
      college_id: formState.collegeId.trim() ? formState.collegeId.trim() : undefined,
    });

    if (error) {
      toast({
        title: 'Update failed',
        description: error.message || 'Could not save your profile. Please try again.',
        variant: 'destructive',
      });
    } else {
      toast({
        title: 'Profile updated',
        description: 'Your details have been saved.',
      });
    }

    setSaving(false);
  };

  const handleSignOut = async () => {
    if (signingOut) return;

    try {
      setSigningOut(true);
      await signOut();
      toast({
        title: 'Signed out',
        description: 'You have been signed out successfully.',
      });
      navigate('/auth?mode=signin');
    } catch (error) {
      toast({
        title: 'Sign out failed',
        description: 'Please try again.',
        variant: 'destructive',
      });
    } finally {
      setSigningOut(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container-mobile py-8 max-w-2xl space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Profile</h1>
            <p className="text-sm text-muted-foreground">
              Manage your account details and contact information.
            </p>
          </div>
          <Badge variant="secondary">{roleLabels[user.role]}</Badge>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Account Information</CardTitle>
          </CardHeader>
          <CardContent>
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="grid gap-2">
                <Label htmlFor="profile-name">Full Name</Label>
                <Input
                  id="profile-name"
                  value={formState.name}
                  onChange={handleChange('name')}
                  placeholder="Your name"
                  required
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="profile-email">Email</Label>
                <Input id="profile-email" value={user.email} disabled />
                <p className="text-xs text-muted-foreground">
                  Email is used for sign in and cannot be changed yet.
                </p>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="profile-phone">Phone</Label>
                <Input
                  id="profile-phone"
                  value={formState.phone}
                  onChange={handleChange('phone')}
                  type="tel"
                  placeholder="Your phone number"
                  required
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="profile-college">College ID</Label>
                <Input
                  id="profile-college"
                  value={formState.collegeId}
                  onChange={handleChange('collegeId')}
                  placeholder="Your college ID (optional)"
                />
              </div>

              <div className="flex flex-wrap items-center gap-2 justify-between">
                <Button type="submit" disabled={saving}>
                  {saving ? 'Saving...' : 'Save Changes'}
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  onClick={handleSignOut}
                  disabled={signingOut}
                >
                  {signingOut ? 'Signing out...' : 'Sign Out'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
