import { Route } from 'react-router-dom';
import { WorkerLayout } from '@/shared/layouts/WorkerLayout';

import { MainPage } from '@/pages/worker/MainPage';
import { TaskAssignment } from '@/pages/worker/TaskAssignmentPage/TaskAssignment';
import { PrepareToolPage } from '@/pages/worker/PrepareToolPage';
import { ToolCheckPage } from '@/pages/worker/ToolCheckPage';
import { CheckSafetyPage } from '@/pages/worker/CheckSafetyPage';
import { MovementPage } from '@/pages/worker/MovementPage';
import { WorkProgressPage } from '@/pages/worker/WhileWorkPage';
import { WorkCompletePage } from '@/pages/worker/WorkCompletePage';

export const workerRoutes = [
  <Route key="worker" path="/worker" element={<WorkerLayout />}>
    <Route path="main" element={<MainPage />} />
    <Route path="today-task" element={<TaskAssignment />} />
    <Route path="prepare-tool" element={<PrepareToolPage />} />
    <Route path="tool-check/:checkType" element={<ToolCheckPage />} />
    <Route path="safety-check" element={<CheckSafetyPage />} />
    <Route path="movement/:type" element={<MovementPage />} />
    <Route path="while-work" element={<WorkProgressPage />} />
    <Route path="complete-work" element={<WorkCompletePage />} />
  </Route>
];