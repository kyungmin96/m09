import { LoginForm } from '@/features/auth/ui/LoginForm';
import { Logo } from '@/shared/ui/Logo/Logo.jsx';
import './styles.scss';

export const LoginWorkerPage = () => {
  return (
    <div className="worker-login">
      <Logo size="large" />
      <LoginForm />
    </div>
  );
};