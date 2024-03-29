class AppError extends Error {
  constructor() {
    super();
    Error.captureStackTrace(this, this.constructor);
  }
  addError = function (message, statusCode) {
    this.message = message;
    this.statusCode = statusCode || 500;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true;
    return this;
  };
}

export default AppError;
