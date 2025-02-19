import { api } from '@/shared/api/axios';
import { API_ROUTES } from '@/shared/api/routes';

/**
 * 공동 작업자 전체 조회 API 요청
 * @returns {Promise<Object>} 공동 작업자 전체 조회 응답 데이터
 */
export const getAllWorkers = async () => {
  try {
    const response = await api.get(API_ROUTES.TASKS.ALL_WORKER);    
    console.log('[API 응답]', response.data);
    
    // response.data의 employeeIds와 names 배열 확인
    if (!response.data?.data?.employeeIds || !response.data?.data?.names) {
      throw new Error('Invalid API response structure');
    }

    // API 응답을 작업자 객체 배열로 변환
    const workersList = response.data.data.employeeIds.map((id, index) => ({
      id: index + 1,  // 고유 ID 생성
      employeeId: id,
      name: response.data.data.names[index],
      position: 'ROLE_MEMBER'
    }));

    console.log('[변환된 작업자 목록]', workersList);

    // localStorage에 저장
    localStorage.setItem('allWorkers', JSON.stringify(workersList));
    
    return workersList;
  } catch (error) {
    console.error('Workers API error:', error);
    if (error.response) {
      throw error.response?.data;
    }
    throw new Error("공동 작업자 조회 오류 발생");
  }
};