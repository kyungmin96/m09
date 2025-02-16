import { useState } from 'react';
import { useAuth } from '@/features/auth/context/AuthContext';
import { Button } from '@/components/ui/button';

const LogoutButton = () => {
  const { logout } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const handleLogout = async () => {
    try {
      setIsLoading(true);
      await logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      onClick={handleLogout}
      disabled={isLoading}
      variant="destructive"
    >
      {isLoading ? '로그아웃 중...' : '로그아웃'}
    </Button>
  );
};

export default LogoutButton;