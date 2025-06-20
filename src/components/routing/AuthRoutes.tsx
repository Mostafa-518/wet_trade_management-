
import { Route } from 'react-router-dom';
import { Login } from '@/pages/Login';
import { SignUp } from '@/pages/SignUp';
import { ROUTES } from '@/config/routes';

export function AuthRoutes() {
  return (
    <>
      <Route path={ROUTES.LOGIN} element={<Login />} />
      <Route path={ROUTES.SIGNUP} element={<SignUp />} />
    </>
  );
}
