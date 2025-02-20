import { LoginForm } from '@/features/auth/ui/LoginForm';
import { Logo } from '@/shared/ui/Logo/Logo.jsx';
import './styles.scss';

export const LoginWorkerPage = () => {
  return (
    <div className="control-login-page">
      <div className="login--left">
        <Logo size="large" />
      </div>
      <div className="login--right">
        <LoginForm />
      </div>
    </div>
  );
};