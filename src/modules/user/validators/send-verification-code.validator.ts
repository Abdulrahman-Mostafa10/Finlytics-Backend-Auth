import Joi from "joi";

export interface SendVerificationCodeInput {
  email: string;
}

const sendVerificationCodeSchema = Joi.object({
  email: Joi.string().email().required().messages({
    "string.email": "Please provide a valid email address",
    "string.empty": "Email is required",
  }),
});

export class SendVerificationCodeJoiValidator {
  static validate(input: SendVerificationCodeInput): void {
    const { error } = sendVerificationCodeSchema.validate(input, { abortEarly: false });
    
    if (error) {
      const errorMessages = error.details.map((detail) => detail.message).join(", ");
      throw new Error(errorMessages);
    }
  }
}
