import { Route } from 'react-router-dom';
import { ControlLayout } from '@/shared/layouts/ControlLayout';

// import { CartManagePage } from '@/pages/control/CartManagePage';

export const controlRoutes = [
  <Route key="control" path="/control" element={<ControlLayout />}>
    {/* <Route path="cart-manage" element={<CartManagePage />} /> */}
  </Route>
];