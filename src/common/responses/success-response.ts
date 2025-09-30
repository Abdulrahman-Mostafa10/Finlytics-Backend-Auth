export class SuccessRepsonse {
  success: boolean;
  message: string;
  messageCode: string;
  data: any;

  constructor(message: string, messageCode: string, data: any) {
    this.success = true;
    this.message = message;
    this.messageCode = messageCode;
    this.data = data;
  }
}

module.exports = {SuccessRepsonse};
