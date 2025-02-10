import { Outlet } from 'react-router-dom';
import './ControlLayout.scss';

export const ControlLayout = () => {
  return (
    <div className="control-layout">
      <Outlet />
    </div>
  );
};