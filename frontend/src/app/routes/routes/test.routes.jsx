import { Route, Navigate } from 'react-router-dom';

import RegisterTestPage from '@/pages/test/RegisterTestPage';
import LoginTestPage from '@/pages/test/LoginTestPage';
import LogoutTestPage from '@/pages/test/LogoutTestPage';
import TaskCreateTestPage from '@/pages/test/task/TaskCreateTestPage';
import TaskFetchTestPage from '@/pages/test/task/TaskFetchTestPage';
import TaskPdfTestPage from '@/pages/test/task/TaskPdfTestPage';
import ReportTaskTestPage from '@/pages/test/task/ReportTaskTestPage';
import HelmetDetectionTestPage from '@/pages/test/embedded/HelmetDetectionTestPage';
import ManualDriveTestPage from '@/pages/test/embedded/ManualDriveTestPage';
import DriveTestPage from '@/pages/test/embedded/DriveTestPage';
import ReportTestPage from '@/pages/test/reports/ReportTestPage';
import { TestMainPage } from '@/pages/TestMainPage';

// 웹소켓 테스트 컴포넌트 import
import NFCDetector from '@/pages/test/socketTest/NFCDetector';
import ToolDetector from '@/pages/test/socketTest/ToolDetector';
import HelmetDetector from '@/pages/test/socketTest/HelmetDetector';

export const testRoutes = (
  <>
    {/* 테스트 메인 페이지 */}
    <Route key="test-main" path="/test/main" element={<TestMainPage />} />
    
    {/* 테스트 Auth 페이지 */}
    <Route key="test-register" path="/test/register" element={<RegisterTestPage />} />
    <Route key="test-login" path="/test/login" element={<LoginTestPage />} />
    <Route key="test-logout" path="/test/logout" element={<LogoutTestPage />} />
    
    {/* 테스트 Task 페이지 */}
    <Route key="test-task-create" path="/test/task/task-create" element={<TaskCreateTestPage />} />
    <Route key="test-task-fetch" path="/test/task/task-fetch" element={<TaskFetchTestPage />} />
    <Route key="test-task-pdf" path="/test/task/task-pdf" element={<TaskPdfTestPage />} />
    <Route key="test-report-task" path="/test/task/report-task" element={<ReportTaskTestPage />} />
    
    {/* 테스트 Embedded 페이지 */}
    <Route key="test-helmet" path="/test/embedded/detect-helmet/start" element={<HelmetDetectionTestPage />} />
    <Route key="test-manual-drive" path="/test/embedded/manual-drive" element={<ManualDriveTestPage />} />
    <Route key="test-drive" path="/test/embedded/drive" element={<DriveTestPage />} />
    
    {/* 웹소켓 테스트 페이지 */}
    <Route key="test-nfc-detector" path="/test/embedded/nfc-detector" element={<NFCDetector />} />
    <Route key="test-tool-detector" path="/test/embedded/tool-detector" element={<ToolDetector />} />
    <Route key="test-helmet-detector" path="/test/embedded/helmet-detector" element={<HelmetDetector />} />
    
    {/* 테스트 Report 페이지 */}
    <Route key="test-report" path="/test/reports/report" element={<ReportTestPage />} />

    {/* 존재하지 않는 worker 하위 경로를 위한 catch-all 라우트 */}
    <Route path="*" element={<Navigate to="/not-found" replace />} />
  </>);