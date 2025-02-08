import { Routes, Route } from 'react-router-dom';
import { WorkerLayout } from '@/shared/Layouts/WorkerLayout';
import { ControlLayout } from '@/shared/Layouts/ControlLayout';
import { LoginWorkerPage } from '@/pages/worker/LoginWorkerPage/index';
import { LoginControlPage } from '@/pages/control/LoginControlPage/index';

export const AppRouter = () => {
  return (
    <Routes>
      {/* 작업자 영역 */}
      <Route path="/" element={<WorkerLayout />}>
        <Route path="login" element={<LoginWorkerPage />} />
      </Route>

      {/* 관제탑 영역 */}
      <Route path="/control" element={<ControlLayout />}>
        <Route path="login" element={<LoginControlPage />} />
      </Route>
    </Routes>
  );
};