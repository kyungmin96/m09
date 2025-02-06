import React, { useState } from 'react'
import Button from '@/shared/ui/Button/Button.jsx'
import styles from './LoginForm.module.scss'

const LoginForm = ({ type }) => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    
    // 로그인 로직 
    if (!username || !password) {
      setError('사용자명과 비밀번호를 입력해주세요.')
      return
    }

    // TODO: 실제 로그인 API 호출
    console.log('Login attempt:', { username, password, type })
  }

  return (
    <form onSubmit={handleSubmit} className={styles.loginForm}>
      <div className={styles.inputGroup}>
        <label htmlFor="username" className={styles.label}>
          사용자명
        </label>
        <input
          type="text"
          id="username"
          className={styles.input}
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="사용자명을 입력하세요"
          required
        />
      </div>

      <div className={styles.inputGroup}>
        <label htmlFor="password" className={styles.label}>
          비밀번호
        </label>
        <input
          type="password"
          id="password"
          className={styles.input}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="비밀번호를 입력하세요"
          required
        />
      </div>

      {error && (
        <div className={styles.errorMessage}>
          {error}
        </div>
      )}

      <Button 
        type="submit" 
        variant="primary" 
        fullWidth 
        size="lg"
      >
        {type === 'worker' ? '작업자 로그인' : '관제탑 로그인'}
      </Button>
    </form>
  )
}

export default LoginForm