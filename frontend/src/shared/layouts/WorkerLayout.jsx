import { Outlet } from 'react-router-dom';
import './WorkerLayout.scss';

export const WorkerLayout = () => {
  return (
    <div className="worker-layout">
      <div className="worker-layout__container">
        <Outlet />
      </div>
    </div>
  );
};