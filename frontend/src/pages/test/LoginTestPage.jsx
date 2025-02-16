import { useState } from 'react';
import { login, logout } from '@/features/auth/auth_api';
import './LoginTestPage.scss';

const LoginTestPage = () => {
  const [loginData, setLoginData] = useState({
    employeeId: '',
    password: ''
  });
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('auth-token'));

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLoginData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await login(loginData);
      console.log('로그인 성공:', response);
      
      if (response) {
        // localStorage.setItem('auth-token', response);
        setIsLoggedIn(true);
        alert('로그인 성공!');
      }
    } catch (error) {
      console.error('로그인 실패:', error);
      alert(error.message || '로그인 중 오류가 발생했습니다.');
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      setIsLoggedIn(false);
      alert('로그아웃 성공!');
    } catch (error) {
      console.error('로그아웃 실패:', error);
      alert(error.message || '로그아웃 중 오류가 발생했습니다.');
    }
  };

  return (
    <div className="login-test-container">
      <h2>로그인 테스트</h2>
      {isLoggedIn ? (
        <div className="logout-section">
          <p>로그인 되었습니다.</p>
          <button onClick={handleLogout}>로그아웃</button>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <div>
            <label>사원 ID</label>
            <input
              type="text"
              name="employeeId"
              value={loginData.employeeId}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label>비밀번호</label>
            <input
              type="password"
              name="password"
              value={loginData.password}
              onChange={handleChange}
              required
            />
          </div>
          <button type="submit">로그인</button>
        </form>
      )}
    </div>
  );
};

export default LoginTestPage;
