// src/api/websocketService.js
import { api } from '@/shared/api/axios';
import { API_ROUTES } from '@/shared/api/routes';

// const WEBSOCKET_URL = "ws://70.12.246.80:8080/api/v1/ws";
const WEBSOCKET_URL = "ws://i12a202.p.ssafy.io/api/v1/ws";

/**
 * WebSocket 서비스 클래스
 * 웹소켓 연결 및 통신을 관리하는 서비스
 */
class WebSocketService {
  constructor() {
    this.socket = null;
    this.streaming = false;
    this.onMessageCallback = null;
    this.onCloseCallback = null;
    this.onErrorCallback = null;
  }

  /**
   * WebSocket 연결을 초기화합니다.
   * @returns {Promise} WebSocket 연결 Promise
   */
  connectWebSocket() {
    return new Promise((resolve, reject) => {
      if (this.socket && this.streaming) {
        console.warn("WebSocket 연결이 이미 활성화되어 있습니다.");
        return resolve(this.socket);
      }

      this.socket = new WebSocket(WEBSOCKET_URL);

      this.socket.onopen = () => {
        console.log("WebSocket 연결 성공");
        this.streaming = true;
        resolve(this.socket);
      };

      this.socket.onmessage = (event) => {
        try {
          if (typeof event.data === "string") {
            console.log("데이터 수신:", event.data);
            
            if (this.onMessageCallback) {
              this.onMessageCallback(event.data);
            }
          } else {
            console.warn("알 수 없는 데이터 형식:", event.data);
          }
        } catch (error) {
          console.error("데이터 처리 중 오류:", error);
        }
      };

      this.socket.onclose = () => {
        console.log("WebSocket 연결 종료");
        this.streaming = false;
        if (this.onCloseCallback) {
          this.onCloseCallback();
        }
      };

      this.socket.onerror = (error) => {
        console.error("WebSocket 오류:", error);
        if (this.onErrorCallback) {
          this.onErrorCallback(error);
        }
        reject(error);
      };
    });
  }

  /**
   * 메시지 수신 콜백을 설정합니다.
   * @param {Function} callback 메시지 수신 시 호출될 콜백 함수
   */
  setOnMessageCallback(callback) {
    this.onMessageCallback = callback;
  }

  /**
   * 연결 종료 콜백을 설정합니다.
   * @param {Function} callback 연결 종료 시 호출될 콜백 함수
   */
  setOnCloseCallback(callback) {
    this.onCloseCallback = callback;
  }

  /**
   * 에러 콜백을 설정합니다.
   * @param {Function} callback 에러 발생 시 호출될 콜백 함수
   */
  setOnErrorCallback(callback) {
    this.onErrorCallback = callback;
  }

  /**
   * WebSocket 연결을 종료합니다.
   */
  closeConnection() {
    if (this.socket && this.streaming) {
      this.socket.close();
      this.streaming = false;
      console.log("WebSocket 연결이 종료되었습니다.");
    }
  }

  /**
   * NFC 인식 시작을 요청합니다.
   * @returns {Promise} HTTP 요청 Promise
   */
  startNFCDetection() {
    return api.post(API_ROUTES.EMBEDDED.NFC.START);
  }
  
  /**
   * NFC 인식 중지를 요청합니다.
   * @returns {Promise} HTTP 요청 Promise
   */
  stopNFCDetection() {
    return api.post(API_ROUTES.EMBEDDED.NFC.STOP);
  }

  /**
   * 공구 탐지 시작을 요청합니다.
   * @param {Array} toolNames 탐지할 공구 이름 배열
   * @returns {Promise} HTTP 요청 Promise
   */
  startToolDetection(toolNames) {
    return api.post(API_ROUTES.EMBEDDED.DETECTION_TOOL.START, { name: toolNames });
  }
  
  /**
   * 공구 탐지 중지를 요청합니다.
   * @returns {Promise} HTTP 요청 Promise
   */
  stopToolDetection() {
    return api.post(API_ROUTES.EMBEDDED.DETECTION_TOOL.STOP);
  }

  /**
   * 복장 인식 시작을 요청합니다.
   * @returns {Promise} HTTP 요청 Promise
   */
  startHelmetDetection() {
    return api.post(API_ROUTES.EMBEDDED.HELMET.START);
  }
  
  /**
   * 복장 인식 중지를 요청합니다.
   * @returns {Promise} HTTP 요청 Promise
   */
  stopHelmetDetection() {
    return api.post(API_ROUTES.EMBEDDED.HELMET.STOP);
  }
}

// 싱글톤 인스턴스 생성
const websocketService = new WebSocketService();
export default websocketService;