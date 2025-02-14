import axios_api from "../axios_api";

/**
 * 리포트 조회 API 함수
 * @param {string} reportId - 조회할 리포트 ID
 * @returns {Promise} 리포트 데이터
 */
export const fetchReport = async (reportId) => {
  try {
    const response = await axios_api.get(`/reports/${reportId}`);
    return response.data;
  } catch (error) {
    if (error.response) {
      throw error.response?.data;
    }
    throw new Error("리포트 조회 중 오류 발생");
  }
};

/**
 * 리포트 수정 API 함수
 * @param {string} reportId - 수정할 리포트 ID
 * @param {Object} payload - 수정할 데이터
 * @returns {Promise} 수정된 리포트 데이터
 */
export const updateReport = async (reportId, payload) => {
  try {
    const response = await axios_api.put(`/reports/${reportId}`, payload);
    return response.data;
  } catch (error) {
    if (error.response) {
      throw error.response?.data;
    }
    throw new Error("리포트 수정 중 오류 발생");
  }
};

/**
 * 리포트 삭제 API 함수
 * @param {string} reportId - 삭제할 리포트 ID
 * @returns {Promise} 삭제 결과 데이터
 */
export const deleteReport = async (reportId) => {
  try {
    const response = await axios_api.delete(`/reports/${reportId}`);
    return response.data;
  } catch (error) {
    if (error.response) {
      throw error.response?.data;
    }
    throw new Error("리포트 삭제 중 오류 발생");
  }
};

/**
 * Task와 연결된 Report 조회 API 함수
 * @param {string} taskId - 조회할 Task ID
 * @returns {Promise} 연결된 Report 데이터
 */
export const fetchReportByTask = async (taskId) => {
  try {
    const response = await axios_api.get(`/reports/task/${taskId}`);
    return response.data;
  } catch (error) {
    if (error.response) {
      throw error.response?.data;
    }
    throw new Error("Task와 연결된 Report 조회 중 오류 발생");
  }
};

/**
 * Task와 연결된 Report 생성 API 함수
 * @param {string} taskId - 생성할 Task ID
 * @param {Object} payload - 생성할 Report 데이터
 * @returns {Promise} 생성된 Report 데이터
 */
export const createReportForTask = async (taskId, payload) => {
  try {
    const response = await axios_api.post(`/reports/task/${taskId}`, payload);
    return response.data;
  } catch (error) {
    if (error.response) {
      throw error.response?.data;
    }
    throw new Error("Task와 연결된 Report 생성 중 오류 발생");
  }
};