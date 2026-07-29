import { translate } from '@/i18n/translate';
import type { Locale } from '@/i18n/types';
import type { TranslationKey } from '@/i18n/dictionaries';

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

const ERROR_KEYS: Record<string, TranslationKey> = {
  'auth/email-already-exists': 'errors.emailAlreadyInUse',
  'auth/email-already-in-use': 'errors.emailAlreadyInUse',
  'auth/invalid-email': 'errors.invalidEmail',
  'auth/wrong-password': 'errors.invalidCredentials',
  'auth/invalid-credential': 'errors.invalidCredentials',
  'auth/user-not-found': 'errors.invalidCredentials',
  'auth/requires-recent-login': 'errors.requiresRecentLogin',
  'auth/weak-password': 'errors.weakPassword',
  'auth/too-many-requests': 'errors.tooManyRequests',
  'auth/network-request-failed': 'errors.network',
  'password-not-match': 'errors.passwordMismatch',
  unknown_error: 'errors.server',
};

export const errorCodeKey = (code: string): TranslationKey => {
  return ERROR_KEYS[code] ?? 'errors.server';
};

export const errorCode = (code: string, locale: Locale = 'ru') => {
  return translate(locale, errorCodeKey(code));
};
