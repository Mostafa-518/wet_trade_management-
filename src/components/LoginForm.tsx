
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/hooks/useAuth';
import { usePersistentFormState } from '@/hooks/persistent-form';
import { FormResetButton } from '@/components/FormResetButton';

interface LoginFormData {
  email: string;
  password: string;
}

export function LoginForm() {
  const [loading, setLoading] = useState(false);
  const { signIn } = useAuth();
  const navigate = useNavigate();

  const {
    formValues,
    getInputProps,
    resetForm,
    hasPersistedData
  } = usePersistentFormState<LoginFormData>({
    email: '',
    password: ''
  }, {
    customKey: 'login-form',
    excludeFields: ['password'], // Don't persist password for security
    expirationHours: 24 // Keep email for longer
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await signIn(formValues.email, formValues.password);
      navigate('/dashboard');
    } catch (error) {
      // Error handling is done in the signIn function
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Sign In</CardTitle>
          <p className="text-gray-600">Welcome back to Wet Trades - Orascom</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                required
                {...getInputProps('email')}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                required
                {...getInputProps('password')}
              />
            </div>
            <div className="flex gap-2">
              <Button type="submit" className="flex-1" disabled={loading}>
                {loading ? 'Signing in...' : 'Sign In'}
              </Button>
              <FormResetButton 
                onReset={resetForm}
                hasData={hasPersistedData()}
                variant="ghost"
                size="default"
              />
            </div>
          </form>
          <div className="mt-4 text-center">
            <p className="text-sm text-gray-600">
              Don't have an account?{' '}
              <Link to="/signup" className="text-blue-600 hover:underline">
                Sign up
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
