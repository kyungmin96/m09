import axios_api from "../auth/axios_api";

/**
 * 회원가입 API 함수
 * @param {RegisterPayload} payload - 회원가입 요청 데이터
 * @returns {Promise<any>} 회원가입 응답 데이터
 */

export const register = async (payload) => {
  try {
    const response = await axios_api.post("/all/auth/register", payload);
    return response.data;
  } catch (error) {
    if (error.response) {
      throw error.response?.data;
    }
  }
  throw new Error("회원 가입 오류 발생");
};

/**
 * 로그인 API 함수
 * @param {LoginPayload} payload - 로그인 요청 데이터
 * @returns {Promise<any>} 로그인 응답 데이터
 */
export const login = async (payload) => {
  try {
    const response = await axios_api.post("/all/auth/login", payload);
    if (response.data) {
      console.log(response.data);
      // console.log(response.data.data.token);
      
      localStorage.setItem('auth-token', response.data?.data?.token);
    }
    return response.data;
  } catch (error) {
    if (error.response) {
      throw error.response?.data;
    }
    throw new Error("로그인 오류 발생");
  }
};

/**
 * 로그아웃 API 함수
 * @returns {Promise<any>} 로그아웃 응답 데이터
 */
export const logout = async () => {
  try {
    const response = await axios_api.post("/member/auth/logout");
    localStorage.removeItem('auth-token');
    return response.data;
  } catch (error) {
    if (error.response) {
      throw error.response?.data;
    }
    throw new Error("로그아웃 오류 발생");
  }
};
