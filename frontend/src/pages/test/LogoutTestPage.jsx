import React from 'react';
import { logout } from '@/features/auth/auth_api'; // 로그아웃 API 함수 가져오기
import { useNavigate } from 'react-router-dom'; // 페이지 이동을 위한 훅

const LogoutTestPage = () => {
  const navigate = useNavigate(); // 리디렉션에 사용

  const handleLogout = async () => {
    try {
      await logout(); // 로그아웃 API 호출
      alert('로그아웃이 완료되었습니다.');
      navigate('/login'); // 로그아웃 후 로그인 페이지로 이동
    } catch (error) {
      console.error('로그아웃 실패:', error);
      alert(error.message || '로그아웃 중 오류가 발생했습니다.');
    }
  };

  return (
    <div>
      <h1>로그아웃 테스트 페이지</h1>
      <button onClick={handleLogout}>로그아웃</button>
    </div>
  );
};

export default LogoutTestPage;
