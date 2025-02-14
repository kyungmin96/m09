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
// import ToolReturnPage from '@/pages/worker/ToolReturnPage/index';
import CheckSafetyPage from '@/pages/worker/CheckSafetyPage';
import CartManagePage from '@/pages/control/CartManagePage';
import TestMainPage from '@/pages/TestMainPage';
import RegisterTestPage from '@/pages/test/RegisterTestPage';
import LoginTestPage from '@/pages/test/LoginTestPage';
import LogoutTestPage from '@/pages/test/LogoutTestPage';
import TaskCreateTestPage from '@/pages/test/task/TaskCreateTestPage';
import TaskFetchTestPage from '@/pages/test/task/TaskFetchTestPage';
import HelmetDetectionTestPage from '@/pages/test/embedded/HelmetDetectionTestPage';
import ManualDriveTestPage from '@/pages/test/embedded/ManualDriveTestPage';
import DriveTestPage from '@/pages/test/embedded/DriveTestPage';
import TaskPdfTestPage from '@/pages/test/task/TaskPdfTestPage';
import ReportTestPage from '@/pages/test/reports/ReportTestPage';
import ReportTaskTestPage from '@/pages/test/task/ReportTaskTestPage';

export const AppRouter = () => {
  return (
    <Routes>
      {/* 테스트 메인 페이지 */}
      <Route path="/" element={<TestMainPage />} />
      <Route path="/test/register" element={<RegisterTestPage />} />
      <Route path="/test/login" element={<LoginTestPage />} />
      <Route path="/test/logout" element={<LogoutTestPage />} />
      {/* 테스트 task 페이지 */}
      <Route path="/test/task/task-create" element={<TaskCreateTestPage />} />
      <Route path="/test/task/task-fetch" element={<TaskFetchTestPage />} />
      <Route path="/test/task/task-pdf" element={<TaskPdfTestPage />} />
      <Route path="/test/task/report-task" element={<ReportTaskTestPage />} />
      {/* 테스트 embedded 페이지 */}
      <Route path="/test/embedded/detect-helmet/start" element={<HelmetDetectionTestPage />} />
      <Route path="/test/embedded/manual-drive" element={<ManualDriveTestPage />} />
      <Route path="/test/embedded/drive" element={<DriveTestPage />} />
      {/* 테스트 reports 페이지 */}
      <Route path="/test/reports/report" element={<ReportTestPage />} />
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
        {/* <Route path="return-toolcheck" element={<ToolReturnPage />} /> */}
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