import { Routes, Route } from 'react-router-dom';
import { WorkerLayout } from '@/shared/Layouts/WorkerLayout';
// import { ControlLayout } from '@/shared/Layouts/ControlLayout';

import { LoginWorkerPage } from '@/pages/worker/LoginWorkerPage';
import { MainPage } from '@/pages/worker/MainPage';
import { TaskAssignment } from '@/pages/worker/TaskAssignmentPage/TaskAssignment';
import { ToolCheckPage } from '@/pages/worker/ToolCheckPage';
import { CheckSafetyPage } from '@/pages/worker/CheckSafetyPage';
import { WorkplaceMovePage } from '@/pages/worker/WorkplaceMovePage';
import { WorkProgressPage } from '@/pages/worker/WhileWorkPage';
import { WorkCompletePage } from '@/pages/worker/WorkCompletePage';

// import { LoginControlPage } from '@/pages/control/LoginControlPage';
// import { CartManagePage } from '@/pages/control/CartManagePage';
import { TestMainPage } from '@/pages/TestMainPage';

export const AppRouter = () => {
  return (
    <Routes>
      {/* 테스트 메인 페이지 */}
      <Route path="/" element={<TestMainPage />} />
      {/* 작업자 영역 */}
      <Route path="/worker" element={<WorkerLayout />}>
        <Route path="login" element={<LoginWorkerPage />} />
        <Route path="main" element={<MainPage/>}/>
        <Route path="today-task" element={< TaskAssignment />}/>
        <Route path="prepare-toolcheck" element={<ToolCheckPage />} />
        <Route path="safety-check" element={<CheckSafetyPage />} />
        <Route path="workplace-move" element={<WorkplaceMovePage mode="to-workplace" />} />
        <Route path="while-work" element={<WorkProgressPage />}/>
        <Route path="return-move" element={<WorkplaceMovePage mode="to-warehouse" />} />
        <Route path="complete-work" element={<WorkCompletePage />} />
      </Route>

      {/* 관제탑 영역 */}
      {/* <Route path="/control" element={<ControlLayout />}>
        <Route path="login" element={<LoginControlPage />} />
        <Route path="cart-manage" element={<CartManagePage />} />
      </Route> */}
    </Routes>
  );
};