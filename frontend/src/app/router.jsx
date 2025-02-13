import { Routes, Route } from 'react-router-dom';

import { WorkerLayout } from '@/shared/Layouts/WorkerLayout';
import { ControlLayout } from '@/shared/Layouts/ControlLayout';
import { LoginWorkerPage } from '@/pages/worker/LoginWorkerPage';
import { WorkplaceMovePage } from '@/pages/worker/WorkplaceMovePage';
import { LoginControlPage } from '@/pages/control/LoginControlPage';
import TaskAssignment from '@/pages/worker/TaskAssignmentPage/TaskAssignment';
import ToolCheckPage from '@/pages/worker/ToolCheckPage/index';
import WorkProgressPage from '@/pages/worker/WhileWorkPage';
import WorkCompletePage from '@/pages/worker/WorkCompletePage/index';
// import { LoginControlPage } from '@/pages/control/LoginControlPage/index';
import ToolReturnPage from '@/pages/worker/ToolReturnPage/index';
import CheckSafetyPage from '@/pages/worker/CheckSafetyPage';
import CartManagePage from '@/pages/control/CartManagePage';
import TestMainPage from '@/pages/TestMainPage';

export const AppRouter = () => {
  return (
    <Routes>
      {/* 테스트 메인 페이지 */}
      <Route path="/" element={<TestMainPage />} />
      {/* 작업자 영역 */}
      <Route path="/worker" element={<WorkerLayout />}>
        <Route path="login" element={<LoginWorkerPage />} />
        <Route path="today-task" element={< TaskAssignment />}/>
        <Route path="workplace_move" element={<WorkplaceMovePage />} />
        <Route path="prepare-toolcheck" element={<ToolCheckPage />} />
        <Route path="while-work" element={<WorkProgressPage />}/>
        <Route path="complete-work" element={<WorkCompletePage />} />
        <Route path="workplace-move" element={<WorkplaceMovePage />} />
        <Route path="prepare-toolcheck" element={<ToolCheckPage />} />
        <Route path="return-toolcheck" element={<ToolReturnPage />} />
        <Route path="safety-check" element={<CheckSafetyPage />} />
      </Route>

      {/* 관제탑 영역 */}
      <Route path="/control" element={<ControlLayout />}>
        <Route path="login" element={<LoginControlPage />} />
        <Route path="cart-manage" element={<CartManagePage />} />
      </Route>
    </Routes>
  );
};