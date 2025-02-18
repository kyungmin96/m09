import { Routes, Route, Navigate } from 'react-router-dom';
import { testRoutes } from './routes/test.routes';
import { workerRoutes } from './routes/worker.routes';
import { controlRoutes } from './routes/control.routes';
import { LoginWorkerPage } from '@/pages/worker/LoginWorkerPage';
import { NotFoundPage } from '@/pages/NotFoundPage';
import { PublicRoute } from '@/app/routes/guards/auth.guard';

export const AppRouter = () => {
  // testRoutes가 배열인 경우, 각 요소에 key가 있는지 확인
  const routesWithKeys = Array.isArray(testRoutes) 
    ? testRoutes.map((route, index) => {
        // 이미 key가 있으면 그대로 사용, 없으면 추가
        return route.key ? route : { ...route, key: `test-route-${index}` };
      })
    : testRoutes;

  return (
    <Routes>
      {/* 메인 경로 */}
      <Route key="root" path="/" element={<Navigate to="/login" replace />} />
      
      {/* 로그인 페이지 - 로그인 상태면 메인으로 리다이렉트 */}
      <Route 
        key="login"
        path="/login" 
        element={
          <PublicRoute>
            <LoginWorkerPage />
          </PublicRoute>
        } 
      />
      
      {/* 각 라우트 그룹 - 이미 각 파일에서 ProtectedRoute 적용됨 */}
      {workerRoutes}
      {controlRoutes}
      
      {/* 테스트 라우트 */}
      {routesWithKeys}

      {/* Not Found 페이지 - 모든 경로에 대한 catch-all */}
      <Route key="not-found" path="/not-found" element={<NotFoundPage />} />
      
      {/* 위의 모든 라우트와 일치하지 않는 경우 */}
      <Route key="catch-all" path="*" element={<Navigate to="/not-found" replace />} />
    </Routes>
  );
};