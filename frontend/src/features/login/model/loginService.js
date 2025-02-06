// 로그인 서비스 로직
class LoginService {
    // 실제 API 엔드포인트와 연결될 로그인 메서드
    static async login({ username, password, userType }) {
      try {
        // 실제 서버 요청 로직 (예시)
        const response = await fetch('/api/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ username, password, userType })
        });
  
        const data = await response.json();
  
        if (!response.ok) {
          // 로그인 실패 처리
          throw new Error(data.message || '로그인에 실패했습니다.');
        }
  
        // 로그인 성공 시 토큰 저장
        this.saveToken(data.token);
  
        return data;
      } catch (error) {
        console.error('Login error:', error);
        throw error;
      }
    }
  
    // 토큰 저장 메서드
    static saveToken(token) {
      localStorage.setItem('authToken', token);
    }
  
    // 토큰 제거 메서드 (로그아웃 시)
    static removeToken() {
      localStorage.removeItem('authToken');
    }
  
    // 현재 로그인 상태 확인
    static isLoggedIn() {
      return !!localStorage.getItem('authToken');
    }
  
    // 사용자 타입 확인 메서드
    static validateUserType(userType) {
      const currentToken = localStorage.getItem('authToken');
      if (!currentToken) return false;
  
      try {
        // 토큰 디코딩 및 사용자 타입 검증 로직
        // 예: const decodedToken = jwt.decode(currentToken);
        // return decodedToken.userType === userType;
        return true; // 임시 구현
      } catch (error) {
        console.error('Token validation error:', error);
        return false;
      }
    }
  }
  
  export default LoginService;