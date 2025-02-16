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
    if (error.response) {
      throw error.response?.data;
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
