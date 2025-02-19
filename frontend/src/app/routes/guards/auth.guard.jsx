import { Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Toast } from '@/shared/ui/Toast/Toast';

/**
 * 로그인 상태 확인 함수
 * 실제 구현에서는 토큰 또는 세션 확인 로직으로 대체
 * @returns {boolean} 로그인 상태 여부
 */
export const isAuthenticated = () => {
  // 로컬 스토리지에서 토큰 확인 (실제 인증 로직으로 대체 필요)
  const token = localStorage.getItem('auth-token');
  return !!token;
};

/**
 * 로그인 상태 시 접근 가능한 보호된 라우트
 * 비로그인 시 토스트 메시지 표시 후 로그인 페이지로 리다이렉트
 */
export const ProtectedRoute = ({ children }) => {
  const [showToast, setShowToast] = useState(false);
  const [shouldRedirect, setShouldRedirect] = useState(false);
  
  useEffect(() => {
    if (!isAuthenticated()) {
      setShowToast(true);
    }
  }, []);

  const handleCloseToast = () => {
    setShowToast(false);
    setShouldRedirect(true);
  };

  if (!isAuthenticated()) {
    if (shouldRedirect) {
      return <Navigate to="/login" replace />;
    }
    
    return (
      <>
        {showToast && (
          <Toast 
            message="로그인이 필요한 페이지입니다."
            type="warning"
            onClose={handleCloseToast}
          />
        )}
        <div style={{ display: 'none' }}></div>
      </>
    );
  }

  return children;
};

/**
 * 비로그인 상태에서만 접근 가능한 라우트 (예: 로그인 페이지)
 * 로그인 상태에서 접근 시 메인 페이지로 리다이렉트
 */
export const PublicRoute = ({ children }) => {
  const [showToast, setShowToast] = useState(false);
  const [shouldRedirect, setShouldRedirect] = useState(false);
  
  useEffect(() => {
    if (isAuthenticated()) {
      setShowToast(true);
    }
  }, []);

  const handleCloseToast = () => {
    setShowToast(false);
    setShouldRedirect(true);
  };

  if (isAuthenticated()) {
    if (shouldRedirect) {
      return <Navigate to="/worker/main" replace />;
    }
    
    return (
      <>
        {showToast && (
          <Toast 
            message="이미 로그인되어 있습니다."
            type="info"
            onClose={handleCloseToast}
          />
        )}
        <div style={{ display: 'none' }}></div>
      </>
    );
  }

  return children;
};