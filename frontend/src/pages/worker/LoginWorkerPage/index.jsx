import { LoginForm } from '@/features/auth/ui/LoginForm'
import { Logo } from '@/shared/ui/Logo/Logo.jsx';
import './styles.scss';

export const LoginWorkerPage = () => {
  const handleLogin = (formData) => {
    // 작업자 로그인 처리 로직
    console.log('Worker login:', formData);
  };

  return (
    <div className="worker-login">
      <Logo size="large" />
      <LoginForm onSubmit={handleLogin} userType="worker" />
    </div>
  );
};