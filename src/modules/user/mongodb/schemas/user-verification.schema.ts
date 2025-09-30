import mongoose, {Schema, Document, Types} from "mongoose";

export interface UserVerificationDocument extends Document {
  email: string;
  verificationCode: string;
  challengeId: Types.ObjectId;
  isVerified: boolean;
  expiresAt: Date;
  isDeleted?: boolean;
  verifiedAt?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

export const UserVerificationSchema: Schema<UserVerificationDocument> =
  new Schema<UserVerificationDocument>(
    {
      challengeId: {
        type: Schema.Types.ObjectId,
        ref: "verification-codes-v1",
        required: true,
      },
      email: {type: String, required: true, unique: true},
      verificationCode: {type: String, required: true},
      isVerified: {type: Boolean, default: false, required: true},
      isDeleted: {type: Boolean, default: false, required: true},
      expiresAt: {type: Date, required: true},
      verifiedAt: {type: Date},
    },
    {timestamps: true}
  );

export default mongoose.model<UserVerificationDocument>(
  "users-verifications-v1",
  UserVerificationSchema
);
