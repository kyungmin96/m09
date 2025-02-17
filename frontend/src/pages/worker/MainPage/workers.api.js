import { api } from '@/shared/api/axios';
import { API_ROUTES } from '@/shared/api/routes';

/**
 * 오늘의 작업 목록 API 요청
 * @returns {Promise<Object>} 오늘의 작업 목록 응답 데이터
 */
export const getTodayWorks = async () => {
  try {
    console.log('API 호출 시작');

    // 토큰 확인
    const token = localStorage.getItem('auth-token');
    console.log('현재 토큰:', token);

    // 현재 헤더 설정 확인
    console.log('요청 설정:', {
      headers: api.defaults.headers,
      baseURL: api.defaults.baseURL
    });

    console.log('요청 URL: ', API_ROUTES.TASKS.IN_PROGRESS);
    
    const response = await api.get(`${API_ROUTES.TASKS.IN_PROGRESS}`);

    console.log('API 응답: ', response);
    
    const todayWorks = response.data;

    console.log("[오늘의 작업 목록]: ", todayWorks);
    localStorage.setItem('todayWorks', JSON.stringify(todayWorks));
    
    return response.data;
  } catch (error) {
    if (error.response) {
      throw error.response?.data;
    }
    // throw new Error("오늘의 작업 목록 오류 발생");
  }
};

/**
 * 작업 선택 API 요청
 * @param {Array<number>} workIds - 선택한 작업 ID 목록
 * @returns {Promise<Object>} 작업 선택 응답 데이터
 */
export const selectWorks = async (workIds) => {
  try {
    const response = await api.post(API_ROUTES.WORKS.SELECT, { workIds });
    return response.data;
  } catch (error) {
    if (error.response) {
      throw error.response?.data;
    }
    throw new Error("작업 선택 오류 발생");
  }
};
