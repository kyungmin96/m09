import React, { useState, useEffect } from 'react'
import styles from './ResponsiveWrapper.module.scss'

const ResponsiveWrapper = ({ 
  children, 
  type = 'worker' 
}) => {
  const [deviceType, setDeviceType] = useState(
    window.innerWidth >= 768 ? 'desktop' : 'mobile'
  )

  useEffect(() => {
    const handleResize = () => {
      setDeviceType(window.innerWidth >= 768 ? 'desktop' : 'mobile')
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // 작업자용 페이지는 모바일만 허용
  if (type === 'worker' && deviceType === 'desktop') {
    return (
      <div className={styles.restrictedAccess}>
        <p>작업자 페이지는 모바일에서만 접근 가능합니다.</p>
      </div>
    )
  }

  // 관제탑 페이지는 반응형으로 처리
  return (
    <div className={`
      ${styles.responsiveWrapper} 
      ${styles[`${type}-${deviceType}`]}
    `}>
      {children}
    </div>
  )
}

export default ResponsiveWrapper