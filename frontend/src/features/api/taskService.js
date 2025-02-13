import { api } from "./apiClient";

const memberService = {
    /* 
        Member Section
    */
    
    // Member: 오늘의 작업 불러오기
    async getInProcess() {
        const response = await api.get('/member/tasks/posts/in-process');
        return response;
    },
    // Member: 공구 조회하기
    async getToolListByTask(taskId) {
        const response = await api.get(`/member/tools/${taskid}`);
        return response;
    },
    // Member: 전체 공구 조회하기
    async getToolList() {
        const response = await api.get('/member/tools');
        return response;
    },

    /*
    Manager Section
    */

    // Manager: 동료 조회하기
    async findCompaninons(taskId) {
        const response = await api.get(`/member/tools/${taskid}`);
        return response;
    },
}