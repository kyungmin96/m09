import LoginForm from '@/features/auth/ui/LoginForm'
import './LoginControlPage.scss';

export const LoginControlPage = () => {
  const handleLogin = (formData) => {
    // 관제탑 로그인 처리 로직
    console.log('Control tower login:', formData);
  };

  return (
    <div className="control-login-page">
      <LoginForm onSubmit={handleLogin} userType="control" />
    </div>
  );
};