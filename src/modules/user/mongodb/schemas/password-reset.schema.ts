import mongoose, { Document, Schema } from "mongoose";

export interface PasswordResetDocument extends Document {
  id: string;
  email: string;
  verificationCode: string;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const passwordResetSchema = new Schema<PasswordResetDocument>(
  {
    email: {type: String, required: true, lowercase: true, trim: true},
    verificationCode: {type: String,required: true},
    isDeleted: {type: Boolean, default: false,},
  },
  {
    timestamps: true
  }
);

export const PasswordResetModel = mongoose.model<PasswordResetDocument>(
  "PasswordReset",
  passwordResetSchema
);
