import { Route, Navigate } from 'react-router-dom';
import { ControlLayout } from '@/shared/layouts/ControlLayout';
import { ProtectedRoute } from '@/app/routes/guards/auth.guard';

// import { CartManagePage } from '@/pages/control/CartManagePage';

export const controlRoutes = [
  <Route
    key="control-routes"
    path="/control" 
    element={
      <ProtectedRoute>
        <ControlLayout />
      </ProtectedRoute>
    }
  >

    {/* <Route path="cart-manage" element={<CartManagePage />} /> */}

    {/* 존재하지 않는 worker 하위 경로를 위한 catch-all 라우트 */}
    <Route path="*" element={<Navigate to="/not-found" replace />} />
  </Route>
];