import { streamingApi } from '@/shared/api/axios';
import { API_ROUTES } from '@/shared/api/routes';

/** (임베 / GET) 카메라 streaming response
 * response: data 값에 string으로 url 받음
 * */
export const getStreamingUrl = async () => {
    try {
        const response = await streamingApi.get(API_ROUTES.DIRECT_EMBEDDED.STREAMING);
        return response.data.data; // http://i12a202.p.ssafy.io/streaming/ 반환
    } catch (error) {
        throw new Error('스트리밍 URL을 가져오는데 실패했습니다: ' + (error.message || '알 수 없는 오류'));
    }
};

/**
 * (임베 / POST) 단순 카메라 streaming start POST
 * 파라미터 없이 카메라 스트리밍을 시작하는 요청
 */
export const startCameraStreaming = async () => {
    try {
        const response = await streamingApi.post(API_ROUTES.DIRECT_EMBEDDED.CAMERA_START);
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
        const response = await streamingApi.post(API_ROUTES.DIRECT_EMBEDDED.CAMERA_STOP);
        return response.data;
    } catch (error) {
        throw new Error('카메라 스트리밍 중지에 실패했습니다: ' + (error.message || '알 수 없는 오류'));
    }
};