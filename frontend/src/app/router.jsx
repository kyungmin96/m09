import { Routes, Route } from 'react-router-dom';
import { WorkerLayout } from '@/shared/Layouts/WorkerLayout';
import { ControlLayout } from '@/shared/Layouts/ControlLayout';
import { LoginWorkerPage } from '@/pages/worker/LoginWorkerPage';
import { WorkplaceMovePage } from '@/pages/worker/WorkplaceMovePage';
import { LoginControlPage } from '@/pages/control/LoginControlPage';


export const AppRouter = () => {
  return (
    <Routes>
      {/* 작업자 영역 */}
      <Route path="/" element={<WorkerLayout />}>
        <Route path="login" element={<LoginWorkerPage />} />
        <Route path="workplace_move" element={<WorkplaceMovePage />} />
      </Route>

      {/* 관제탑 영역 */}
      <Route path="/control" element={<ControlLayout />}>
        <Route path="login" element={<LoginControlPage />} />
      </Route>
    </Routes>
  );
};