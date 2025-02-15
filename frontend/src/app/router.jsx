import { Routes, Route } from 'react-router-dom';
import { WorkerLayout } from '@/shared/Layouts/WorkerLayout';
// import { ControlLayout } from '@/shared/Layouts/ControlLayout';

import { LoginWorkerPage } from '@/pages/worker/LoginWorkerPage';
import { MainPage } from '@/pages/worker/MainPage';
import { TaskAssignment } from '@/pages/worker/TaskAssignmentPage/TaskAssignment';
import { PrepareToolPage } from '@/pages/worker/PrepareToolPage';
import { ToolCheckPage } from '@/pages/worker/ToolCheckPage';
import { CheckSafetyPage } from '@/pages/worker/CheckSafetyPage';
import { WorkplaceMovePage } from '@/pages/worker/WorkplaceMovePage';
import { WorkProgressPage } from '@/pages/worker/WhileWorkPage';
import { WorkCompletePage } from '@/pages/worker/WorkCompletePage';

// import { LoginControlPage } from '@/pages/control/LoginControlPage';
// import { CartManagePage } from '@/pages/control/CartManagePage';

// import ToolReturnPage from '@/pages/worker/ToolReturnPage/index';

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

import { TestMainPage } from '@/pages/TestMainPage';

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
        <Route path="main" element={<MainPage/>}/>
        <Route path="today-task" element={< TaskAssignment />}/>
        <Route path="prepare-tool" element={< PrepareToolPage />}/>
        <Route path="tool-check/:checkType" element={<ToolCheckPage />} />
        {/* <Route path="prepare-toolcheck" element={<ToolCheckPage />} /> */}
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