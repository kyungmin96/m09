import React from 'react'
import ResponsiveWrapper from '@/shared/ui/responsive/ResponsiveWrapper'
import LoginForm from '@/features/login/ui/LoginForm'

const WorkerLogin = () => {
  return (
    <ResponsiveWrapper type="worker">
      <div>
        <h1>작업자 로그인</h1>
        <LoginForm type="worker" />
      </div>
    </ResponsiveWrapper>
  )
}

export default WorkerLogin