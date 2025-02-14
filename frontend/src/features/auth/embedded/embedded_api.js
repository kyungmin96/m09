import axios_api from "../axios_api";

/**
 * 헬멧 감지 시작 요청 API 함수
 * @returns {Promise} 요청 성공 여부 응답 데이터
 */
export const startHelmetDetection = async () => {
    try {
      const response = await axios_api.post("/embedded/detect-helmet/start");
      return response.data;
    } catch (error) {
      if (error.response) {
        throw error.response?.data;
      }
      throw new Error("헬멧 감지 시작 요청 중 오류 발생");
    }
};

/**
 * 수동 주행 - 전진
 */
export const manualDriveForward = async () => {
    try {
      const response = await axios_api.post("/embedded/manual-drive/forward");
      return response.data;
    } catch (error) {
      if (error.response) {
        throw error.response?.data;
      }
      throw new Error("수동 주행 전진 요청 중 오류 발생");
    }
};
  
  /**
   * 수동 주행 - 후진
   */
export const manualDriveBackward = async () => {
    try {
      const response = await axios_api.post("/embedded/manual-drive/backward");
      return response.data;
    } catch (error) {
      if (error.response) {
        throw error.response?.data;
      }
      throw new Error("수동 주행 후진 요청 중 오류 발생");
    }
};
  
  /**
   * 수동 주행 - 좌회전
   */
export const manualDriveLeft = async () => {
    try {
      const response = await axios_api.post("/embedded/manual-drive/left");
      return response.data;
    } catch (error) {
      if (error.response) {
        throw error.response?.data;
      }
      throw new Error("수동 주행 좌회전 요청 중 오류 발생");
    }
};
  
  /**
   * 수동 주행 - 우회전
   */
export const manualDriveRight = async () => {
    try {
      const response = await axios_api.post("/embedded/manual-drive/right");
      return response.data;
    } catch (error) {
      if (error.response) {
        throw error.response?.data;
      }
      throw new Error("수동 주행 우회전 요청 중 오류 발생");
    }
};

/**
 * 수동 주행 - 정지
 */
export const manualDriveStop = async () => {
    try {
      const response = await axios_api.post("/embedded/manual-drive/stop");
      return response.data;
    } catch (error) {
      if (error.response) {
        throw error.response?.data;
      }
      throw new Error("수동 주행 정지 요청 중 오류 발생");
    }
};

/**
 * 주행 시작 요청
 */
export const startDrive = async () => {
    try {
      const response = await axios_api.post("/embedded/drive/start");
      return response.data;
    } catch (error) {
      if (error.response) {
        throw error.response?.data;
      }
      throw new Error("주행 시작 요청 중 오류 발생");
    }
  };
  
  /**
   * 주행 정지 요청
   */
export const stopDrive = async () => {
    try {
      const response = await axios_api.post("/embedded/drive/stop");
      return response.data;
    } catch (error) {
      if (error.response) {
        throw error.response?.data;
      }
      throw new Error("주행 정지 요청 중 오류 발생");
    }
};