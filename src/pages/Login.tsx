
import { AuthGuard } from '@/components/AuthGuard';
import { LoginForm } from '@/components/LoginForm';
import { UserRoleDebug } from '@/components/UserRoleDebug';
import { CreateTestUserButton } from '@/components/CreateTestUserButton';

export function Login() {
  return (
    <AuthGuard requireAuth={false}>
      <div className="space-y-8">
        <div className="text-center">
          <CreateTestUserButton />
        </div>
        <LoginForm />
        <UserRoleDebug />
      </div>
    </AuthGuard>
  );
}
