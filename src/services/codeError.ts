export const errorCode = (code: string) => {
  switch (code) {
    case 'auth/email-already-exists':
      return 'Пользователь уже существует';
    case 'auth/invalid-email':
      return 'Некорректный email';
    case 'auth/wrong-password':
      return 'Неверный пароль';
    case 'auth/invalid-credential':
      return 'Неверный email или пароль';
    case 'password-not-match':
      return 'Пароли не совпадают';
    default:
      return 'Произошла ошибка. Попробуйте снова.';
  }
};
