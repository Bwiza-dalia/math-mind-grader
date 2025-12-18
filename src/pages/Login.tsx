import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { UserRole } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { GraduationCap, User, Users, Shield } from 'lucide-react';
import { cn } from '@/lib/utils';

const roles: { value: UserRole; label: string; icon: typeof User; description: string }[] = [
  { value: 'professor', label: 'Professor', icon: GraduationCap, description: 'Create and grade exams' },
  { value: 'student', label: 'Student', icon: User, description: 'Submit and view results' },
  { value: 'admin', label: 'Admin', icon: Shield, description: 'Manage system' },
];

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedRole, setSelectedRole] = useState<UserRole>('professor');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(email, password, selectedRole);
      navigate('/dashboard');
    } catch (error) {
      // Error is already handled by AuthContext with toast
      console.error('Login error:', error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-primary/5 p-4">
      <div className="w-full max-w-md space-y-8 animate-fade-up">
        {/* Logo */}
        <div className="text-center">
          <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-primary shadow-glow mb-4">
            <GraduationCap className="h-8 w-8 text-primary-foreground" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight">EasyGrade</h1>
          <p className="text-muted-foreground mt-2">AI-Powered Exam Grading System</p>
        </div>

        <Card className="border-border/50 shadow-xl">
          <CardHeader className="space-y-1 pb-4">
            <CardTitle className="text-xl">Welcome back</CardTitle>
            <CardDescription>Select your role and sign in to continue</CardDescription>
          </CardHeader>
          <CardContent>
            {/* Role Selection */}
            <div className="grid grid-cols-3 gap-2 mb-6">
              {roles.map((role) => {
                const Icon = role.icon;
                const isSelected = selectedRole === role.value;
                return (
                  <button
                    key={role.value}
                    type="button"
                    onClick={() => setSelectedRole(role.value)}
                    className={cn(
                      'flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all duration-200',
                      isSelected
                        ? 'border-primary bg-primary/5 shadow-glow'
                        : 'border-border hover:border-primary/50 hover:bg-muted/50'
                    )}
                  >
                    <Icon className={cn('h-6 w-6', isSelected ? 'text-primary' : 'text-muted-foreground')} />
                    <span className={cn('text-sm font-medium', isSelected ? 'text-primary' : 'text-muted-foreground')}>
                      {role.label}
                    </span>
                  </button>
                );
              })}
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@university.edu"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-11"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-11"
                />
              </div>
              <Button type="submit" className="w-full h-11 font-semibold">
                Sign in as {roles.find(r => r.value === selectedRole)?.label}
              </Button>
            </form>

            <p className="text-center text-sm text-muted-foreground mt-6">
              Demo mode: Click sign in with any credentials
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}