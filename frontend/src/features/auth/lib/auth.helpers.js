// @/features/auth/lib/auth.helpers.js

/**
 * 사번 유효성 검사
 * @param {string} value - 검사할 사번
 * @returns {string} 에러 메시지 (유효한 경우 빈 문자열)
 */
export const validateId = (value) => {
  if (!value) return '';
  const idRegex = /^\d{7}$/;
  if (!idRegex.test(value)) {
    return '사번은 7자리 숫자로 구성되어 있습니다.';
  }
  return '';
};

/**
 * 비밀번호 유효성 검사
 * @param {string} value - 검사할 비밀번호
 * @returns {string} 에러 메시지 (유효한 경우 빈 문자열)
 */
export const validatePassword = (value) => {
  if (!value) return '';
  if (value.length < 8) {
    return '비밀번호는 특수문자 포함 8자 이상입니다.';
  }
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(value)) {
    return '비밀번호는 특수문자 포함 8자 이상입니다.';
  }
  if (/\s/.test(value)) {
    return '비밀번호에 공백을 포함할 수 없습니다.';
  }
  return '';
};

/**
 * 폼 전체 유효성 검사
 * @param {string} id - 사번
 * @param {string} password - 비밀번호
 * @returns {boolean} 폼이 유효한지 여부
 */
export const isFormValid = (id, password) => {
  // null이나 undefined 체크
  if (!id || !password) return false;
  
  return id.length > 0 &&
    password.length > 0 &&
    !validateId(id) &&
    !validatePassword(password);
};