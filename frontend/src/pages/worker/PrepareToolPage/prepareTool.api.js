import { api } from '@/shared/api/axios';
import { API_ROUTES } from '@/shared/api/routes';

/**
 * 전체 공구 목록 조회
 * @returns {Promise<Object>} 전체 공구 목록 조회 응답 데이터
 */
export const fetchAllTools = async () => {
    try {
        const response = await api.get(API_ROUTES.TASKS.ALL_TOOL);
        console.log('[전체 공구 목록 조회]:', response.data);

        if (response.data.success) {
            return response.data.data.map(tool => ({
                id: tool.id,
                name: tool.name,
                category: tool.category,
                isActive: true
            }));
        }
        throw new Error('공구 목록 조회 실패');
    } catch (error) {
        console.error('Failed to fetch all tools:', error);
        throw error;
    }
};

/**
 * 필요한 공구 목록 필터링
 * @param {Array} allTools - 전체 공구 목록
 * @param {Array} uniqueTools - 작업에 필요한 공구 이름 목록
 * @returns {Object} 필요한 공구와 추가 가능한 공구 목록
 */
export const filterTools = (allTools, uniqueTools) => {
    const required = allTools.filter(tool => uniqueTools.includes(tool.name));
    const available = allTools.filter(tool => !uniqueTools.includes(tool.name));
    
    return { required, available };
};