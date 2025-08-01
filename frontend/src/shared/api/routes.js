/** api 엔드 포인트 관련 설정
 * - 주석 달려있는 것은 현재 사용하는 api
 * - 임베디드 통신 관련해서는 현재 웹 소켓 도입 진행 중이기 때문에 작업하지 않을 것을 권장장
 * - 없는 api : 공구 전체 반납 (아예 필요 없을 수도), 공구 소모품 건의
 */
export const API_ROUTES = {
  // 인증 관련
  AUTH: {
    REGISTER: '/all/auth/register',
    LOGIN: '/all/auth/login',                           // ✅ (POST, Login) 로그인
    LOGOUT: '/member/auth/logout',                      // ✅ (POST, Header/Sidebar 내 로그아웃 버튼튼) 로그아웃
  },
  
  // 작업 게시물 관련
  TASKS: {
    GET: '/member/tasks/posts',
    POST: '/member/tasks/posts',
    IN_PROCESS: '/member/tasks/posts/in-process',      // ✅ (GET, MainPage 로드) 사용자의 오늘 할당 예정 작업 조회
    TODAY_ALLOCATE: '/manager/companions/allocate',     // (POST, PrepareTool 마운트) 선택한 작업 내용 갱신 요청 -> 응답으로 선택 작업 공구 목록 줌
    ALL_TOOL: '/member/tools',                          // (GET, PrepareTool 공구 추가) 전체 공구 목록 조회
    SELECTED_TOOL: '/member/tasks/posts/today',         // (GET, sync - 추후 적용) 선택 작업 공구 목록 조회
    ALL_WORKER: '/member/users/members',                // (GET, TaskAssignment 공동 작업자 설정) 전체 작업자 조회
    UPLOAD_COMPANIONS: '/manager/companions',           // (POST, 사용 안함) 선택된 작업 공동 작업자 정보 서버 저장
    DETAILS: (postId) => `/member/tasks/posts/${postId}`,
    DELETE: (postId) => `/manager/tasks/posts/${postId}`,
    PUT: (postId) => `/manager/tasks/posts/${postId}`,
    PDF: (taskId) => `/member/pdf/tasks/${taskId}`,     // (GET, PrepareTool 오늘의 작업, 컴포넌트 구현 X) 작업 PDF 다운로드 (수정 가능성 있음)
    STATUS_UPDATE: '/member/tasks/update-end'           // (POST, WorkCompltetPage 작업 종료 버튼) 작업 상태 갱신
  },

  // 리포트 관련
  REPORTS: {
    GET: (reportId) => `/reports/${reportId}`,
    POST: (reportId) => `/reports/${reportId}`,
    DELETE: (reportId) => `/reports/${reportId}`,
    TASK_GET: (taskId) => `/reports/task/${taskId}`,
    TASK_POST: (taskId) => `/reports/task/${taskId}`,   // (POST, WorkCompletePage 작업 종료 버튼) 작업별 특이사항 보고
  },

  // 카트 관련
  VEHICLES: {
    GET: '/manager/vehicles',  // (GET) 차량 모든 정보 조회
    // POST: '/manager/vehicles',
    // DELETE: (vehicleId) => `/manager/vehicles/${vehicleId}`,
    // PUT: (vehicleId) => `/manager/vehicles/${vehicleId}`,
  },
  
  // 서버 -> 임베디드 통신 관련
  EMBEDDED: {
    // NFC 카트 관련
    NFC: {
      START: '/embedded/nfc/start',
      STOP: '/embedded/nfc/stop',
    },
    // 공구 탐지 관련
    DETECTION_TOOL: {
      START: '/embedded/detect-09/start',                 // (소켓 / 수정 필요) 확정된 공구 활성화 목록 + 공구 탐지 시작
      STOP: '/embedded/detect-09/stop'                    // (소켓) 공구 탐지 중지지
    },
    // 복장 체크 관련
    HELMET: {
      START: '/embedded/detect-helmet/start',             // (소켓) 복장 탐지 시작
      STOP: '/embedded/detect-helmet/stop',               // (소켓) 복장 탐지 중지
    },
    // 수동 주행 관련
    MANUAL_DRIVE: {
      FORWARD: '/embedded/manual-drive/forward',
      BACKWARD: '/embedded/manual-drive/backward',
      LEFT: '/embedded/manual-drive/left',
      RIGHT: '/embedded/manual-drive/right',
      STOP: '/embedded/manual-drive/stop',
    },
    // 추종 주행 관련
    DRIVE: {
      START: '/embedded/drive/start',
      STOP: '/embedded/drive/stop',
    },
    CAMERA: {
      START: '/embedded/camera/start',
      STOP: '/embedded/camera/stop',
    }
  },

  // 임베디드 직접 통신 관련
  DIRECT_EMBEDDED: {
    STREAMING: '/stream',
  },
};