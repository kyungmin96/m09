import React from 'react'
import ResponsiveWrapper from '@/shared/ui/responsive/ResponsiveWrapper'
import LoginForm from '@/features/login/ui/LoginForm'

const ControlTowerLogin = () => {
  return (
    <ResponsiveWrapper type="controlTower">
      <div>
        <h1>관제탑 로그인</h1>
        <LoginForm type="controlTower" />
      </div>
    </ResponsiveWrapper>
  )
}

export default ControlTowerLogin