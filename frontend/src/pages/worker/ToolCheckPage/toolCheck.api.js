import { api } from "@/shared/api/axios";
import { API_ROUTES } from "@/shared/api/routes";

/**
 * 공구 체크 API 요청
 * @param {Array<string>} toolNames - 필요한 공구 이름 목록
 * @returns {Promise<Object>} 공구 체크 응답 데이터
 */
export const startToolDetection = async (toolNames) => {
  try {
    const response = await api.post(API_ROUTES.EMBEDDED.DETECTION_TOOL.START, {
      name: toolNames
    });
    console.log("[공구 체크 API 요청값]:", { name: toolNames });
    console.log("[공구 체크 API 응답값]:", response.data);
    return response.data;
  } catch (error) {
    console.error("Failed to start tool detection:", error);
    throw error;
  }
};

export const stopToolDetection = async () => {
  try {
    const response = await api.post(API_ROUTES.EMBEDDED.DETECTION_TOOL.STOP);
    console.log("[공구 체크 중지 응답값]:", response.data);
    return response.data;
  } catch (error) {
    console.error("Failed to stop tool detection:", error);
    throw error;
  }
};
