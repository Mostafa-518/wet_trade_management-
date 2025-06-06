
import { AuthGuard } from '@/components/AuthGuard';
import { LoginForm } from '@/components/LoginForm';

export function Login() {
  return (
    <AuthGuard requireAuth={false}>
      <LoginForm />
    </AuthGuard>
  );
}
