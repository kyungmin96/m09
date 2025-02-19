import { Route, Navigate } from 'react-router-dom';
import { WorkerLayout } from '@/shared/layouts/WorkerLayout';
import { ProtectedRoute } from '@/app/routes/guards/auth.guard';

import { MainPage } from '@/pages/worker/MainPage';
import { TaskAssignment } from '@/pages/worker/TaskAssignmentPage/TaskAssignment';
import { PrepareToolPage } from '@/pages/worker/PrepareToolPage';
import { ToolCheckPage } from '@/pages/worker/ToolCheckPage';
import { CheckSafetyPage } from '@/pages/worker/CheckSafetyPage';
import { MovementPage } from '@/pages/worker/MovementPage';
import { WorkProgressPage } from '@/pages/worker/WhileWorkPage';
import { WorkCompletePage } from '@/pages/worker/WorkCompletePage';

// 레이아웃 컴포넌트를 ProtectedRoute로 감싸서 
// 모든 하위 라우트에 인증 보호 적용
export const workerRoutes = (
  <Route
    key="worker-routes"
    path="/worker" 
    element={
      <ProtectedRoute>
        <WorkerLayout />
      </ProtectedRoute>
    }
  >
    <Route path="main" element={<MainPage />} />
    <Route path="today-task" element={<TaskAssignment />} />
    <Route path="prepare-tool" element={<PrepareToolPage />} />
    <Route path="tool-check/:checkType" element={<ToolCheckPage />} />
    <Route path="safety-check" element={<CheckSafetyPage />} />
    <Route path="movement/:type" element={<MovementPage />} />
    <Route path="while-work" element={<WorkProgressPage />} />
    <Route path="complete-work" element={<WorkCompletePage />} />

    {/* 존재하지 않는 worker 하위 경로를 위한 catch-all 라우트 */}
    <Route path="*" element={<Navigate to="/not-found" replace />} />
  </Route>
);