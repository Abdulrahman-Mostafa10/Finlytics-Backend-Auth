import Joi from "joi";

export interface ExtractNationalIDInput {
  front_base64: string;
  back_base64: string;
}

export class ExtractNationalIDJoiValidator {
  static validate(input: ExtractNationalIDInput): void {
    const schema = Joi.object({
      front_base64: Joi.string().required().messages({
        "string.base": "Front image must be a string",
        "any.required": "Front image is required",
      }),
      back_base64: Joi.string().required().messages({
        "string.base": "Back image must be a string",
        "any.required": "Back image is required",
      }),
    });

    const { error } = schema.validate(input);
    if (error) {
      throw new Error(error.details[0].message);
    }
  }
}
