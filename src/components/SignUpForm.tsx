
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/hooks/useAuth';
import { usePersistentFormState } from '@/hooks/persistent-form';
import { FormResetButton } from '@/components/FormResetButton';

interface SignUpFormData {
  email: string;
  password: string;
  fullName: string;
}

export function SignUpForm() {
  const [loading, setLoading] = useState(false);
  const { signUp } = useAuth();
  const navigate = useNavigate();

  const {
    formValues,
    getInputProps,
    resetForm,
    hasPersistedData
  } = usePersistentFormState<SignUpFormData>({
    email: '',
    password: '',
    fullName: ''
  }, {
    customKey: 'signup-form',
    excludeFields: ['password'], // Don't persist password for security
    expirationHours: 24
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await signUp(formValues.email, formValues.password, formValues.fullName);
      resetForm(); // Clear form on successful signup
      navigate('/login');
    } catch (error) {
      // Error handling is done in the signUp function
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Sign Up</CardTitle>
          <p className="text-gray-600">Create your Wet Trades account</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name</Label>
              <Input
                id="fullName"
                type="text"
                placeholder="Enter your full name"
                required
                {...getInputProps('fullName')}
              />
            </div>
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
                minLength={6}
                {...getInputProps('password')}
              />
            </div>
            <div className="flex gap-2">
              <Button type="submit" className="flex-1" disabled={loading}>
                {loading ? 'Creating account...' : 'Sign Up'}
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
              Already have an account?{' '}
              <Link to="/login" className="text-blue-600 hover:underline">
                Sign in
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
