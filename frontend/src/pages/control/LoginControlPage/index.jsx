import LoginForm from '@/features/auth/ui/LoginForm'
import { Logo } from '@/shared/ui/Logo/Logo.jsx';
import './styles.scss';

export const LoginControlPage = () => {
  const handleLogin = (formData) => {
    // 관제탑 로그인 처리 로직
    console.log('Control tower login:', formData);
  };

  return (
    <div className="control-login-page">
      <div className="login--left">
        <Logo size="large" />
      </div>
      <div className="login--right">
        <h3>관제탑 로그인</h3>
        <LoginForm onSubmit={handleLogin} userType="control" />
      </div>
    </div>
  );
};