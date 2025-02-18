import { api } from '@/shared/api/axios';
import { API_ROUTES } from '@/shared/api/routes';

/**
 * 회원가입 API 요청
 * @param {Object} payload - 회원가입 요청 데이터
 * @returns {Promise<Object>} 회원가입 응답 데이터
 */
export const register = async (payload) => {
  try {
    const response = await api.post(API_ROUTES.AUTH.REGISTER, payload);
    return response.data;
  } catch (error) {
    if (error.response) {
      throw error.response?.data;
    }
    throw new Error("회원 가입 오류 발생");
  }
};

/**
 * 로그인 API 요청
 * @param {Object} payload - 로그인 요청 데이터 (employeeId, password)
 * @returns {Promise<Object>} 로그인 응답 데이터
 */
export const login = async (payload) => {
  try {
    const response = await api.post(API_ROUTES.AUTH.LOGIN, payload);
    return response.data;
  } catch (error) {
    // 에러 객체 전체 구조 로깅
    console.error('Auth API 로그인 에러 전체 구조:', JSON.stringify(error, null, 2));
    console.error('response.data 구조:', error.response?.data);
    console.error('error.message:', error.message);
    
    if (error.response?.data) {
      // 에러 응답 데이터를 그대로 전달
      throw error.response.data;
    }
    throw new Error("로그인 오류 발생");
  }
};

/**
 * 로그아웃 API 요청
 * @returns {Promise<Object>} 로그아웃 응답 데이터
 */
export const logout = async () => {
  try {
    const response = await api.post(API_ROUTES.AUTH.LOGOUT);
    return response.data;
  } catch (error) {
    if (error.response) {
      throw error.response?.data;
    }
    throw new Error("로그아웃 오류 발생");
  }
};
