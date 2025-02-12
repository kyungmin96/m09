import { Routes, Route } from 'react-router-dom';

import { WorkerLayout } from '@/shared/Layouts/WorkerLayout';
import { ControlLayout } from '@/shared/Layouts/ControlLayout';
import { LoginWorkerPage } from '@/pages/worker/LoginWorkerPage';
import { WorkplaceMovePage } from '@/pages/worker/WorkplaceMovePage';
import { LoginControlPage } from '@/pages/control/LoginControlPage';
import ToolCheckPage from '@/pages/worker/ToolCheckPage/index';
<<<<<<< HEAD
=======
import { LoginControlPage } from '@/pages/control/LoginControlPage/index';
import TestMainPage from '@/pages/TestMainPage';
>>>>>>> 381161e7608834d92826b93c8671c23eb99ef2be

export const AppRouter = () => {
  return (
    <Routes>
      {/* 테스트 메인 페이지 */}
      <Route path="/" element={<TestMainPage />} />
      {/* 작업자 영역 */}
      <Route path="/worker" element={<WorkerLayout />}>
        <Route path="login" element={<LoginWorkerPage />} />
        <Route path="workplace_move" element={<WorkplaceMovePage />} />
        <Route path="prepare-toolcheck" element={<ToolCheckPage />} />
      </Route>

      {/* 관제탑 영역 */}
      <Route path="/control" element={<ControlLayout />}>
        <Route path="login" element={<LoginControlPage />} />
      </Route>
    </Routes>
  );
};