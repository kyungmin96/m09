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