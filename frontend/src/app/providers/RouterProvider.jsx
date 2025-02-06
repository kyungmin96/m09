import React from 'react'
import { 
  BrowserRouter as Router, 
  Routes, 
  Route, 
  Navigate 
} from 'react-router-dom'

import WorkerLogin from '@/pages/worker/login'
import ControlTowerLogin from '@/pages/controlTower/login'

// 반응형 관련 컴포넌트
import ResponsiveWrapper from '@/shared/ui/responsive/ResponsiveWrapper'

const RouterProvider = () => {
  return (
    <Router>
      <Routes>
        {/* Worker Routes (모바일 전용) */}
        <Route path="/worker/login" element={<WorkerLogin />} />

        {/* Control Tower Routes (반응형) */}
        <Route 
          path="/control-tower/login" 
          element={
            <ResponsiveWrapper type="controlTower">
              <ControlTowerLogin />
            </ResponsiveWrapper>
          } 
        />
        {/* 기본 리다이렉트 */}
        <Route path="/" element={<Navigate to="/worker/login" />} />
      </Routes>
    </Router>
  )
}

export default RouterProvider