import Joi from "joi";

export interface UploadProfileImageInput {
  profileImage: string;
}

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB

const uploadProfileImageSchema = Joi.object({
  profileImage: Joi.string().trim().required().messages({
    "string.empty": "Profile image is required",
    "any.required": "Profile image is required",
  }).custom((value, helpers) => {
    // Accept only popular/common formats
    const base64ImageRegex = /^data:image\/(jpeg|jpg|png|gif|webp);base64,/i;
    
    if (!base64ImageRegex.test(value)) {
      return helpers.error("string.pattern.base");
    }
    
    const base64Data = value.split(",")[1];
    if (!base64Data) {
      return helpers.error("string.pattern.base");
    }
    
    try {
      const decoded = Buffer.from(base64Data, "base64");
      const reencoded = decoded.toString("base64");
      
      if (reencoded !== base64Data) {
        return helpers.error("string.pattern.base");
      }
      
      if (decoded.length > MAX_FILE_SIZE) {
        return helpers.error("string.max", { limit: "5MB" });
      }
    } catch {
      return helpers.error("string.pattern.base");
    }
    
    return value;
  }).messages({
    "string.pattern.base": "Profile image must be a valid base64 encoded image (PNG, JPEG, JPG, GIF, or WebP)",
    "string.max": "Profile image must not exceed {#limit}",
  }),
});

export class UploadProfileImageJoiValidator {
  static validate(input: UploadProfileImageInput): void {
    const { error } = uploadProfileImageSchema.validate(input, { abortEarly: false });
    
    if (error) {
      throw error;
    }
  }
}
