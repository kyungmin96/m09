import axios from 'axios';

const LOCAL_STORAGE_KEYS = {
  AUTH_TOKEN: 'auth-token'
};

/** 백 요청 인터셉터 설정 함수
 * 토큰이 필요한 경우, localStorage에서 가져와서 헤더에 추가
 * 토큰이 있는 경우 Authorization 헤더에 Bearer 토큰 추가 (없으면 추가 X)
 * 요청이 성공한 경우, 요청 정보 로깅 / config 반환
 * 요청이 실패한 경우, Promise.reject(error) 반환 / 요청 에러 로깅
*/
const setRequestInterceptor = (instance) => {
  instance.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem(LOCAL_STORAGE_KEYS.AUTH_TOKEN);
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      console.log(`[API 요청] ${config.method?.toUpperCase()} ${config.url}`, config);
      return config;
    },
    (error) => {
      console.error(`[API 요청 오류] ${error}`);
      return Promise.reject(error);
    }
  );
};

/** 응답 인터셉터 설정 함수
 * 요청 성공 시, 응답 데이터 로깅 / 응답 그대로 반환
 * 요청 실패 시, 상태 코드에 따라 에러 대응
 *  - 401 : 인증 만료 → 토큰 제거 후 로그인 페이지로 이동
 *  - 403 : 접근 권한 없음 → 알림
 *  - 404 : 요청한 리소스 없음 → 알림
 *  - 500 : 서버 오류 → 알림
 *  - 그 외 : 에러 로깅
 * 요청은 보냈지만 응답 없는 경우 (네트워크 오류 등) : 알림
 * 요청 설정 중 오류 발생 : 에러 로깅
*/
const setResponseInterceptor = (instance) => {
  instance.interceptors.response.use(
    (response) => {
      console.log(`[API 응답] ${response.config.url}`, response.data);
      return response;
    },
    (error) => {
      if (error.response) {
        const { status, data, config } = error.response;
        if (status === 401) {
          console.warn(`[API 응답] 401 Unauthorized - 인증 만료`);
          localStorage.removeItem(LOCAL_STORAGE_KEYS.AUTH_TOKEN);
          alert('인증이 만료되었습니다. 다시 로그인해주세요.');
          window.location.href = '/login';
        }
        if (status === 403) {
          console.warn(`[API 응답] 403 Forbidden - 접근 불가`);
          alert('이 작업을 수행할 권한이 없습니다.');
        }
        if (status === 404) {
          console.warn(`[API 응답] 404 Not Found - 존재하지 않는 리소스`);
          alert('요청한 리소스를 찾을 수 없습니다.');
        }
        if (status === 500) {
          console.error(`[API 응답] 500 Internal Server Error`);
          alert('서버에서 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
        }
        console.error(`[API 오류] ${config.url} - 상태 코드 ${status}`, data);
      } else if (error.request) {
        console.error(`[API 응답 없음] 요청: ${error.request}`);
        alert('네트워크 오류가 발생했습니다. 인터넷 연결을 확인해주세요.');
      } else {
        console.error(`[API 설정 오류] ${error.message}`);
      }    
      return Promise.reject(error);
    }
  );
};

/** axios 인스턴스 생성
 * baseURL: API 기본 URL 설정 (환경 변수 사용)
 * headers: 요청 헤더 설정 (Content-Type: JSON 형식)
 * timeout: 요청 타임아웃 설정 (30초 / 부족할 경우 axios 추가 생성 또는 오버라이딩 필요요)
 * 추가 설정 고려 : 재시도 횟수 (retry), 재시도 간격 (retryDelay)
*/
export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  timeout: 10000, // 30초
});

// 인터셉터 설정
setRequestInterceptor(api);
setResponseInterceptor(api);