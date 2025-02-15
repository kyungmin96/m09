import { useState, useEffect } from 'react';
import { register } from '../features/auth/auth_api';

const Register = () => {
  const [registerData, setRegisterData] = useState({
    name: '',
    password: '',
    cardKey: '',
    position: 'ROLE_MEMBER'
  });

  useEffect(() => {
    console.log('회원가입 데이터:', registerData);
  }
  , [registerData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    console.log('Selected value: ', value);
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
      // 성공 후 처리 (예: 로그인 페이지로 이동)
    } catch (error) {
      console.error('회원가입 실패:', error.message);
      // 에러 처리 (예: 에러 메시지 표시)
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        name="name"
        value={registerData.name}
        onChange={handleChange}
        placeholder="이름"
      />
      <input
        type="password"
        name="password"
        value={registerData.password}
        onChange={handleChange}
        placeholder="비밀번호"
      />
      <input
        type="text"
        name="cardKey"
        value={registerData.cardKey}
        onChange={handleChange}
        placeholder="카드키"
      />
      <select
        name="position"
        value={registerData.position}
        onChange={handleChange}
      >
        <option value="ROLE_MEMBER">작업자</option>
        <option value="ROLE_MANAGER">담당자</option>
        <option value="ROLE_ADMIN">관리자</option>
      </select>
      <button type="submit">회원가입</button>
    </form>
  );
};

export default Register;
