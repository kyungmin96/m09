import { Routes, Route } from 'react-router-dom';

import { WorkerLayout } from '@/shared/Layouts/WorkerLayout';
import { ControlLayout } from '@/shared/Layouts/ControlLayout';
<<<<<<< HEAD
import { LoginWorkerPage } from '@/pages/worker/LoginWorkerPage';
import { WorkplaceMovePage } from '@/pages/worker/WorkplaceMovePage';
import { LoginControlPage } from '@/pages/control/LoginControlPage';
=======

import { LoginWorkerPage } from '@/pages/worker/LoginWorkerPage/index';
import ToolCheckPage from '@/pages/worker/ToolCheckPage/index';
import { LoginControlPage } from '@/pages/control/LoginControlPage/index';
>>>>>>> 11ce62d85d4fa4b39f975b87885b53ef82bdabc3


export const AppRouter = () => {
  return (
    <Routes>
      {/* 작업자 영역 */}
      <Route path="/" element={<WorkerLayout />}>
        <Route path="login" element={<LoginWorkerPage />} />
<<<<<<< HEAD
        <Route path="workplace_move" element={<WorkplaceMovePage />} />
=======
        <Route path="prepare-toolcheck" element={<ToolCheckPage />} />
>>>>>>> 11ce62d85d4fa4b39f975b87885b53ef82bdabc3
      </Route>

      {/* 관제탑 영역 */}
      <Route path="/control" element={<ControlLayout />}>
        <Route path="login" element={<LoginControlPage />} />
      </Route>
    </Routes>
  );
};