export class AppError extends Error {
  constructor(
    public statusCode: number,
    message: string,
    public isOperational: boolean = true
  ) {
    super(message);
    Object.setPrototypeOf(this, AppError.prototype);
  }
}

export const catchAsyncError = (fn: any) => {
  return (...args: any[]) => Promise.resolve(fn(...args)).catch(args[2]);
};
