export class AppError extends Error {
  readonly code: string;

  constructor(code: string, message?: string) {
    super(message ?? code);
    this.name = 'AppError';
    this.code = code;
  }
}

export const toAppError = (err: unknown, fallback = 'unknown_error'): AppError => {
  if (err instanceof AppError) return err;

  if (typeof err === 'object' && err !== null && 'code' in err) {
    const code = String((err as { code: unknown }).code || fallback);
    return new AppError(code);
  }

  if (err instanceof Error) {
    return new AppError(fallback, err.message);
  }

  return new AppError(fallback);
};
