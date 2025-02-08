import { LoginForm } from '@/features/auth/ui/LoginForm';
import './LoginWorkerPage.scss';

export const WorkerLoginPage = () => {
  const handleLogin = (formData) => {
    // 작업자 로그인 처리 로직
    console.log('Worker login:', formData);
  };

  return (
    <div className="worker-login-page">
      <div className="worker-login-container">
        <LoginForm onSubmit={handleLogin} userType="worker" />
      </div>
    </div>
  );
};