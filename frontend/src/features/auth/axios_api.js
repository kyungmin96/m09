import axios from "axios";

// axios_api 인스턴스 생성 및 export (import axios_api 해서 씀)
const axios_api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// API 요청 인터셉터
axios_api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth-token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// API 응답 인터셉터
axios_api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
   if (error.response?.status === 401) {
    // // 토큰 만료 시 재발급
    // const originalRequest = error.config;
    // const refreshToken = localStorage.getItem('refresh-token');
    // if (refreshToken) {
    //   try {
    //     const response = await axios_api.post('/auth/refresh', {
    //       refreshToken,
    //     });
    //     const newAccessToken = response.data.accessToken;
    //     localStorage.setItem('auth-token', newAccessToken);
    //     originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
    //     return axios_api(originalRequest);
    //   } catch (error) {
    //     return Promise.reject(error);
    //   }
    // }
      // 리프레쉬 토큰이 없으므로 localStorage를 비워주고 로그인 페이지로 이동
      localStorage.removeItem('auth-token');
      window.location.href = '/workcer/login';
   }
    return Promise.reject(error);
  }
);

export default axios_api;
