import { api } from '@/shared/api/axios';
import { API_ROUTES } from '@/shared/api/routes';

/**
 * (임베 / POST) 단순 카메라 streaming start POST
 * 파라미터 없이 카메라 스트리밍을 시작하는 요청
 */
export const startCameraStreaming = async () => {
    try {
        const response = await api.post(API_ROUTES.EMBEDDED.CAMERA.START);
        return response.data;
    } catch (error) {
        throw new Error('카메라 스트리밍 시작에 실패했습니다: ' + (error.message || '알 수 없는 오류'));
    }
};

/**
 * (임베 / POST) 단순 카메라 streaming stop POST
 * 파라미터 없이 카메라 스트리밍을 중지하는 요청
 */
export const stopCameraStreaming = async () => {
    try {
        const response = await api.post(API_ROUTES.EMBEDDED.CAMERA.STOP);
        return response.data;
    } catch (error) {
        throw new Error('카메라 스트리밍 중지에 실패했습니다: ' + (error.message || '알 수 없는 오류'));
    }
};