import { describe, expect, it } from 'vitest';
import { errorCode, normalizeAuthErrorCode } from '@/services/codeError';

describe('errorCode', () => {
  it('maps credential errors to a shared message', () => {
    expect(errorCode('auth/invalid-credential')).toBe('Неверный email или пароль');
    expect(errorCode('auth/wrong-password')).toBe('Неверный email или пароль');
    expect(errorCode('auth/user-not-found')).toBe('Неверный email или пароль');
  });

  it('maps network failures to a connection message', () => {
    expect(errorCode('auth/network-request-failed')).toBe(
      'Нет соединения с сервером. Проверьте интернет и попробуйте снова',
    );
  });

  it('maps unknown and default codes to a server error message', () => {
    expect(errorCode('unknown_error')).toBe('Ошибка сервера. Попробуйте позже');
    expect(errorCode('something-unexpected')).toBe('Ошибка сервера. Попробуйте позже');
  });

  it('keeps existing auth and form validation messages', () => {
    expect(errorCode('auth/invalid-email')).toBe('Некорректный email');
    expect(errorCode('auth/email-already-in-use')).toBe('Пользователь уже существует');
    expect(errorCode('password-not-match')).toBe('Пароли не совпадают');
  });

  it('translates messages for English locale', () => {
    expect(errorCode('auth/invalid-credential', 'en')).toBe('Invalid email or password');
    expect(errorCode('password-not-match', 'en')).toBe('Passwords do not match');
  });
});

describe('normalizeAuthErrorCode', () => {
  it('returns a direct auth code when present', () => {
    expect(normalizeAuthErrorCode({ code: 'auth/invalid-credential' })).toBe(
      'auth/invalid-credential',
    );
  });

  it('unwraps a nested credential code from network-request-failed', () => {
    expect(
      normalizeAuthErrorCode({
        code: 'auth/network-request-failed',
        customData: {
          message: 'FirebaseError: Firebase: Error (auth/wrong-password).',
        },
      }),
    ).toBe('auth/wrong-password');
  });

  it('unwraps a nested code from the error message when needed', () => {
    expect(
      normalizeAuthErrorCode({
        code: 'auth/network-request-failed',
        message: 'Firebase: Error (auth/user-not-found).',
      }),
    ).toBe('auth/user-not-found');
  });

  it('keeps network-request-failed when no nested auth code is available', () => {
    expect(
      normalizeAuthErrorCode({
        code: 'auth/network-request-failed',
        message: 'Failed to fetch',
      }),
    ).toBe('auth/network-request-failed');
  });

  it('falls back to unknown_error when no code is available', () => {
    expect(normalizeAuthErrorCode({})).toBe('unknown_error');
    expect(normalizeAuthErrorCode(undefined)).toBe('unknown_error');
  });
});
