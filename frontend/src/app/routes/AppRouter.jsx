import { Routes, Route, Navigate } from 'react-router-dom';
import { testRoutes } from './routes/test.routes';
import { workerRoutes } from './routes/worker.routes';
import { controlRoutes } from './routes/control.routes';
import { LoginWorkerPage } from '@/pages/worker/LoginWorkerPage';

export const AppRouter = () => {
  return (
    <Routes>
      {/* 메인 경로 */}
      <Route path="/" element={<Navigate to="/login" replace />} />
      
      {/* 로그인 페이지 */}
      <Route path="/login" element={<LoginWorkerPage />} />
      
      {/* 각 영역별 라우트 */}
      {testRoutes}
      {workerRoutes}
      {controlRoutes}
    </Routes>
  );
};