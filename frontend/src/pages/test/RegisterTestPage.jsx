import { useState } from 'react';
import { register } from '@/features/auth/auth_api';
import './RegisterTestPage.scss';

const RegisterTestPage = () => {
  const [registerData, setRegisterData] = useState({
    name: '',
    password: '',
    cardKey: '',
    position: 'ROLE_MEMBER'
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setRegisterData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await register(registerData);
      console.log('회원가입 성공:', response);

      // console.log(response.data);
      // console.log(response.data?.employeeId);
      
      alert(`회원가입이 완료되었습니다. 당신의 ID는 : ${response.data?.employeeId} 입니다.`);
      // window.location.href = '/worker/login';
    } catch (error) {
      console.error('회원가입 실패:', error);
      alert(error.message || '회원가입 중 오류가 발생했습니다.');
    }
  };

  return (
    <div className="register-test-container">
      <h2>회원가입 테스트</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>이름</label>
          <input
            type="text"
            name="name"
            value={registerData.name}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>비밀번호</label>
          <input
            type="password"
            name="password"
            value={registerData.password}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>카드키</label>
          <input
            type="text"
            name="cardKey"
            value={registerData.cardKey}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>직책</label>
          <select
            name="position"
            value={registerData.position}
            onChange={handleChange}
          >
            <option value="ROLE_MEMBER">작업자</option>
            <option value="ROLE_MANAGER">담당자</option>
            <option value="ROLE_ADMIN">관리자</option>
          </select>
        </div>
        <button type="submit">회원가입</button>
      </form>
    </div>
  );
};

export default RegisterTestPage;
