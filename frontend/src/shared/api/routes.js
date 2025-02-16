export const API_ROUTES = {
  // 인증 관련
  AUTH: {
    REGISTER: '/all/auth/register',
    LOGIN: '/all/auth/login',
    LOGOUT: '/member/auth/logout',
  },
  
  // 작업 게시물 관련
  TASKS: {
    GET: '/member/tasks/posts',
    POST: '/member/tasks/posts',
    IN_PROGRESS: '/member/tasks/posts/in-progress',   // 사용자의 오늘 할당 예정 작업 조회
    TODAY_ALLOCATE: '/tasks/posts/today-allocate',    // 선택한 작업 내용 갱신 요청
    DETAILS: (postId) => `/member/tasks/posts/${postId}`,
    DELETE: (postId) => `/manager/tasks/posts/${postId}`,
    PUT: (postId) => `/manager/tasks/posts/${postId}`,
    PDF: (taskId) => `/member/pdf/tasks/${taskId}`,   // 작업 PDF 다운로드
  },

  // 리포트 관련
  REPORTS: {
    GET: (reportId) => `/reports/${reportId}`,
    POST: (reportId) => `/reports/${reportId}`,
    DELETE: (reportId) => `/reports/${reportId}`,
    TASK_GET: (taskId) => `/reports/task/${taskId}`,
    TASK_POST: (taskId) => `/reports/task/${taskId}`,
  },
  
  EMBEDDED: {
    // 임베디드 통신 - NFC 카트 관련
    NFC: {
      START: '/nfc/start',
      STOP: '/nfc/stop',
    },
    // 임베디드 통신 - 복장 체크 관련
    HELMET: {
      START: '/embedded/detect-helmet/start',
      STOP: '/embedded/detect-helmet/stop',
    },
    // 임베디드 통신 - 수동 주행 관련
    MANUAL_DRIVE: {
      FORWARD: '/embedded/manual-drive/forward',
      BACKWARD: '/embedded/manual-drive/backward',
      LEFT: '/embedded/manual-drive/left',
      RIGHT: '/embedded/manual-drive/right',
      STOP: '/embedded/manual-drive/stop',
    },
    // 임베디드 통신 - 추종 주행 관련
    DRIVE: {
      START: '/embedded/drive/start',
      STOP: '/embedded/drive/stop',
    },
  },
};