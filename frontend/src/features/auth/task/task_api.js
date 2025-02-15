import axios_api from "../axios_api";

/**
 * 작업 게시물 가져오기 API 함수
 * @returns {Promise} 작업 게시물 목록 응답 데이터
 */
export const fetchTaskPosts = async () => {
  try {
    const response = await axios_api.get("/member/tasks/posts");
    return response.data;
  } catch (error) {
    if (error.response) {
      throw error.response?.data;
    }
    throw new Error("작업 게시물 가져오기 오류 발생");
  }
};

/**
 * 작업 게시물 생성 API 함수
 * @param {Object} payload - 생성할 게시물 데이터
 * @returns {Promise} 생성된 게시물 응답 데이터
 */
export const createTaskPost = async (payload) => {
  try {
    const response = await axios_api.post("/manager/tasks/posts", payload);
    return response.data;
  } catch (error) {
    if (error.response) {
      throw error.response?.data;
    }
    throw new Error("작업 게시물 생성 오류 발생");
  }
};

/**
 * 작업 게시물 삭제 API 함수
 * @param {string} postId - 삭제할 게시물 ID
 * @returns {Promise} 삭제 결과 응답 데이터
 */
export const deleteTaskPost = async (postId) => {
  try {
    const response = await axios_api.delete(`/manager/tasks/posts/${postId}`);
    return response.data;
  } catch (error) {
    if (error.response) {
      throw error.response?.data;
    }
    throw new Error("작업 게시물 삭제 오류 발생");
  }
};

/**
 * 작업 상세 조회
 * @param {string} postId - 조회할 작업 ID
 */
export const fetchTaskDetails = async (postId) => {
    try {
      const response = await axios_api.get(`/member/tasks/posts/${postId}`);
      return response.data;
    } catch (error) {
      if (error.response) {
        throw error.response?.data;
      }
      throw new Error("작업 상세 조회 오류 발생");
    }
};

/**
 * 작업 게시물 수정
 * @param {string} postId - 수정할 작업 ID
 * @param {Object} payload - 수정할 데이터
 */
export const updateTaskPost = async (postId, payload) => {
    try {
      const response = await axios_api.put(`/manager/tasks/posts/${postId}`, payload);
      return response.data;
    } catch (error) {
      if (error.response) {
        throw error.response?.data;
      }
      throw new Error("작업 게시물 수정 오류 발생");
    }
};

/**
 * 작업 PDF 조회 API 함수
 * @param {string} taskId - 조회할 작업 ID
 * @returns {Promise} PDF 파일 데이터
 */
export const fetchTaskPdf = async (taskId) => {
  try {
    const response = await axios_api.get(`/tasks/pdf/tasks/${taskId}`, {
      responseType: 'blob', // PDF 데이터를 Blob 형식으로 받기 위함
    });
    return response.data;
  } catch (error) {
    if (error.response) {
      throw error.response?.data;
    }
    throw new Error("작업 PDF 조회 중 오류 발생");
  }
};