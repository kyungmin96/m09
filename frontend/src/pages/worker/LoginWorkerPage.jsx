import LoginForm from '@/features/auth/ui/LoginForm'
import './LoginWorkerPage.scss';

export const LoginWorkerPage = () => {
  const handleLogin = (formData) => {
    // 작업자 로그인 처리 로직
    console.log('Worker login:', formData);
  };

  return (
    <div className="worker-login">
      <LoginForm onSubmit={handleLogin} userType="worker" />
    </div>
  );
};