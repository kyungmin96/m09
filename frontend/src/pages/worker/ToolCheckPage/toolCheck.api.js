import { api } from "@/shared/api/axios";
import { API_ROUTES } from "@/shared/api/routes";

/**
 * 공구 체크 API 요청
 * @param {Object} toolData - 공구 체크 데이터
 * @returns {Promise<Object>} 공구 체크 응답 데이터
 */
export const checkTools = async (toolData) => {
  try {
    // API 요청
    const response = await api.post(API_ROUTES.EMBEDDED.DETECTION_TOOL.START);
    console.log("[공구 체크 API 요청값] :", response.data);
  } catch (error) {
    console.error("Failed to check tools:", error);
    throw error;
  }
};
