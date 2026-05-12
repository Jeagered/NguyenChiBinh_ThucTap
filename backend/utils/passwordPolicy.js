const PASSWORD_REQUIREMENT_MESSAGE = 'Mat khau phai co 6-20 ky tu, gom chu, so va ky tu dac biet';

const hasLetter = (value) => /\p{L}/u.test(value);
const hasNumber = (value) => /\p{N}/u.test(value);
const hasSpecialCharacter = (value) => /[^\p{L}\p{N}\s]/u.test(value);

function isValidPassword(password) {
  return (
    typeof password === 'string' &&
    password.length >= 6 &&
    password.length <= 20 &&
    hasLetter(password) &&
    hasNumber(password) &&
    hasSpecialCharacter(password)
  );
}

module.exports = {
  PASSWORD_REQUIREMENT_MESSAGE,
  isValidPassword,
};
