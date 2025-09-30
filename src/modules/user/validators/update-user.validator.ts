import Joi from "joi";

export interface UpdateUserInput {
  firstName: string;
  lastName: string;
  maritalStatus: string;
  profession: string;
}

const updateUserSchema = Joi.object({
  firstName: Joi.string().required().min(2).max(50).messages({
    "string.empty": "First name is required",
    "string.min": "First name must be at least 2 characters long",
    "string.max": "First name cannot exceed 50 characters",
  }),
  lastName: Joi.string().required().min(2).max(50).messages({
    "string.empty": "Last name is required",
    "string.min": "Last name must be at least 2 characters long",
    "string.max": "Last name cannot exceed 50 characters",
  }),
  maritalStatus: Joi.string()
  .valid("single", "married", "divorced", "widowed")
  .insensitive()
  .required()
  .messages({
    "string.empty": "Marital status is required",
    "any.only": "Marital status must be one of: single, married, divorced, widowed",
    "string.base": "Marital status must be a string",
  }),
  profession: Joi.string().required().min(2).max(100).messages({
    "string.empty": "Profession is required",
    "string.min": "Profession must be at least 2 characters long",
    "string.max": "Profession cannot exceed 100 characters",
    "string.base": "Profession must be a string",
  })
});

export class UpdateUserJoiValidator {
  static validate(input: UpdateUserInput): void {
    
    const { error } = updateUserSchema.validate(input, { abortEarly: false });
    
    if (error) {
      const errorMessages = error.details.map((detail) => detail.message).join(", ");
      throw new Error(errorMessages);
    }
  }
}
