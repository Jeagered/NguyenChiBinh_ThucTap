export const PASSWORD_REQUIREMENT_MESSAGE = 'Mật khẩu phải dài 6-20 ký tự, có ít nhất 1 chữ, 1 số và 1 ký tự đặc biệt.';

const hasLetter = (value) => /\p{L}/u.test(value);
const hasNumber = (value) => /\p{N}/u.test(value);
const hasSpecialCharacter = (value) => /[^\p{L}\p{N}\s]/u.test(value);

export function isValidPassword(password) {
  return (
    typeof password === 'string' &&
    password.length >= 6 &&
    password.length <= 20 &&
    hasLetter(password) &&
    hasNumber(password) &&
    hasSpecialCharacter(password)
  );
}
