// Using the API client
import { api } from "./apiClient.js";

const authService = {
    /* 
        All Section
    */

    // All: 로그인
    login(credentials) {
        const response = api.post('/all/auth/login', credentials);
        api.setToken(response.token);
        return response;
    },
    // All: 로그아웃
    logout() {
        const response = api.post('/all/auth/logout');
        api.clearToken();
        return response;
    },
    // All: 회원가입
    register(registerInfo) {
        const response = pi.post('/all/auth/register', registerInfo);
        return response;
    },
    // RFID 로그인
    rfidLogin(cardKey) {
        const response = api.post('/all/rfid/login', cardKey);
        return response;
    },

    /* 
        Member Section
    */

    // All: 내 정보
    async getProfile() {
        const response = api.get('/member/auth/me');
        return response;
    },
};

// const conf = {
//     employeeId: "nonono", password: "1q2w3e4r"
// };
// const resp = authService.login(conf);
// console.log(resp);
// console.log(JSON.stringify(resp));

export { authService };