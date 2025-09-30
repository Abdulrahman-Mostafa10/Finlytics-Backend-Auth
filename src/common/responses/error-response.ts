export class ErrorResponse extends Error {
  success: boolean;
  message: string;
  messageCode: string;

  constructor(message: string, messageCode: string) {
    super(message);

    this.success = false;
    this.message = message;
    this.messageCode = messageCode;

    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = {ErrorResponse};
