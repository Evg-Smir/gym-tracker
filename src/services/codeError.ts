const AUTH_CODE_PATTERN = /auth\/[a-z0-9-]+/i;

type AuthErrorLike = {
  code?: string;
  message?: string;
  customData?: {
    message?: string;
  };
};

const extractAuthCode = (value?: string): string | undefined => {
  if (!value) return undefined;
  const match = value.match(AUTH_CODE_PATTERN);
  return match?.[0]?.toLowerCase();
};

export const normalizeAuthErrorCode = (err: AuthErrorLike | null | undefined): string => {
  const directCode = err?.code?.toLowerCase();

  if (directCode && directCode !== 'auth/network-request-failed') {
    return directCode;
  }

  const nestedCode =
    extractAuthCode(err?.customData?.message) ||
    extractAuthCode(err?.message);

  if (nestedCode && nestedCode !== 'auth/network-request-failed') {
    return nestedCode;
  }

  return directCode || 'unknown_error';
};

export const errorCode = (code: string) => {
  switch (code) {
    case 'auth/email-already-exists':
    case 'auth/email-already-in-use':
      return 'Пользователь уже существует';
    case 'auth/invalid-email':
      return 'Некорректный email';
    case 'auth/wrong-password':
    case 'auth/invalid-credential':
    case 'auth/user-not-found':
      return 'Неверный email или пароль';
    case 'auth/requires-recent-login':
      return 'Введите текущий пароль для подтверждения';
    case 'auth/weak-password':
      return 'Слишком слабый пароль';
    case 'auth/too-many-requests':
      return 'Слишком много попыток. Попробуйте позже';
    case 'auth/network-request-failed':
      return 'Нет соединения с сервером. Проверьте интернет и попробуйте снова';
    case 'password-not-match':
      return 'Пароли не совпадают';
    case 'unknown_error':
    default:
      return 'Ошибка сервера. Попробуйте позже';
  }
};
