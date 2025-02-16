import React, { useState, useEffect } from 'react';
import { useAuth } from "@/contexts/AuthContext";
import { Button } from '@/shared/ui/Button/Button.jsx';
import { validateId, validatePassword, isFormValid } from '@/features/auth/lib/auth.helpers';
import './LoginForm.scss';

export const LoginForm = () => {
  const { login } = useAuth();
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');
  const [focusedInput, setFocusedInput] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showError, setShowError] = useState(false);
  const [isErrorFading, setIsErrorFading] = useState(false);
  const [validationErrors, setValidationErrors] = useState({
    id: '',
    password: ''
  });
  const [touched, setTouched] = useState({
    id: false,
    password: false
  });

  useEffect(() => {
    let fadeTimer;
    let hideTimer;

    if (showError) {
      fadeTimer = setTimeout(() => {
        setIsErrorFading(true);
        hideTimer = setTimeout(() => {
          setShowError(false);
          setIsErrorFading(false);
        }, 300);
      }, 2000);
    }

    return () => {
      if (fadeTimer) clearTimeout(fadeTimer);
      if (hideTimer) clearTimeout(hideTimer);
    };
  }, [showError]);

  const handleFocus = (inputName) => {
    setFocusedInput(inputName);
    setShowError(false);
  };

  const handleBlur = (inputName) => {
    setFocusedInput(null);
    setTouched(prev => ({
      ...prev,
      [inputName]: true
    }));

    if (inputName === 'id') {
      setValidationErrors(prev => ({
        ...prev,
        id: validateId(id)
      }));
    }
    if (inputName === 'password') {
      setValidationErrors(prev => ({
        ...prev,
        password: validatePassword(password)
      }));
    }
  };

  const handleIdChange = (e) => {
    const value = e.target.value;
    setId(value);

    if (value && touched.id) {
      setValidationErrors(prev => ({
        ...prev,
        id: validateId(value)
      }));
    } else {
      setValidationErrors(prev => ({
        ...prev,
        id: ''
      }));
    }
  };

  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setPassword(value);

    if (touched.password) {
      setValidationErrors(prev => ({
        ...prev,
        password: validatePassword(value)
      }));
    }
  };

  const handleClearId = () => {
    setId('');
    setValidationErrors(prev => ({
      ...prev,
      id: ''
    }));
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleButtonClick = (e) => {
    e.preventDefault();

    setTouched({
      id: true,
      password: true
    });

    setValidationErrors({
      id: validateId(id),
      password: validatePassword(password)
    });

    if (!isFormValid(id, password)) {
      setIsErrorFading(false);
      setShowError(true);
    } else {
      handleSubmit(e);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login({ employeeId: id, password });
      console.log('로그인 성공');
      navigate('/worker/main');
    } catch (error) {
      console.error('로그인 실패:', error);
      setShowError(true);
    }
  };

  return (
    <div className="login-form-container">
      <form onSubmit={handleSubmit}>
        <div className={`form-field ${focusedInput === 'id' || id ? 'focused' : ''}`}>
          <input
            id="id"
            type="text"
            value={id}
            placeholder="사번을 입력해주세요"
            onChange={handleIdChange}
            onFocus={() => handleFocus('id')}
            onBlur={() => handleBlur('id')}
            autoComplete="off"
          />
          <label htmlFor="id">ID</label>
          {id && (
            <button
              type="button"
              className="control-button clear-button"
              onClick={handleClearId}
              aria-label="clear input"
              tabIndex="-1"
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M10 0C4.47 0 0 4.47 0 10C0 15.53 4.47 20 10 20C15.53 20 20 15.53 20 10C20 4.47 15.53 0 10 0ZM15 13.59L13.59 15L10 11.41L6.41 15L5 13.59L8.59 10L5 6.41L6.41 5L10 8.59L13.59 5L15 6.41L11.41 10L15 13.59Z"
                  fill="#999" />
              </svg>
            </button>
          )}
          <div className="line"></div>
          {touched.id && validationErrors.id && <p className="field-error">{validationErrors.id}</p>}
        </div>

        <div className={`form-field ${focusedInput === 'password' || password ? 'focused' : ''}`}>
          <input
            id="password"
            type={showPassword ? "text" : "password"}
            value={password}
            placeholder="비밀번호를 입력해주세요"
            onChange={handlePasswordChange}
            onFocus={() => handleFocus('password')}
            onBlur={() => handleBlur('password')}
          />
          <label htmlFor="password">PW</label>
          {password && (
            <button
              type="button"
              className="control-button visibility-button"
              onClick={togglePasswordVisibility}
              aria-label={showPassword ? "hide password" : "show password"}
              tabIndex="-1"
            >
              {showPassword ? (
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M10 4C4.49 4 0 9.5 0 9.5C0 9.5 4.49 15 10 15C15.51 15 20 9.5 20 9.5C20 9.5 15.51 4 10 4ZM10 13C8.34 13 7 11.66 7 10C7 8.34 8.34 7 10 7C11.66 7 13 8.34 13 10C13 11.66 11.66 13 10 13ZM10 8.5C9.17 8.5 8.5 9.17 8.5 10C8.5 10.83 9.17 11.5 10 11.5C10.83 11.5 11.5 10.83 11.5 10C11.5 9.17 10.83 8.5 10 8.5Z"
                    fill="#999" />
                </svg>
              ) : (
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M10 4C5.27 4 1.46 7.02 0 9.5C1.46 11.98 5.27 15 10 15C14.73 15 18.54 11.98 20 9.5C18.54 7.02 14.73 4 10 4ZM10 13C8.34 13 7 11.66 7 10C7 8.34 8.34 7 10 7C11.66 7 13 8.34 13 10C13 11.66 11.66 13 10 13ZM10 8.5C9.17 8.5 8.5 9.17 8.5 10C8.5 10.83 9.17 11.5 10 11.5C10.83 11.5 11.5 10.83 11.5 10C11.5 9.17 10.83 8.5 10 8.5Z"
                    fill="#999" />
                  <path d="M1 1L19 19" stroke="#999" strokeWidth="2" />
                </svg>
              )}
            </button>
          )}
          <div className="line"></div>
          {touched.password && validationErrors.password && (
            <p className="field-error">{validationErrors.password}</p>
          )}
        </div>

        <div className="button-container">
          <Button
            variant="main"
            size="full"
            onClick={handleButtonClick}
            disabled={!isFormValid()}
          >
            로그인
          </Button>
          {showError && !isFormValid() && (
            <p className={`error-message ${isErrorFading ? 'fade-out' : ''}`}>
              ID와 PW를 모두 입력해주세요.
            </p>
          )}
        </div>
      </form>
    </div>
  );
};
