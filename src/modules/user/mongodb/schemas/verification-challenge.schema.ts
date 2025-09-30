// Libs
import mongoose, {Schema, Document} from "mongoose";

// Enums
import {VerificationChallengePurposes} from "../../../../common/enums/verification-challenge-purposes.enum";

export interface VerificationChallengeDocument extends Document {
  email: string;
  verificationCode: string;
  expiresAt: Date;
  isUsed: boolean;
  purpose?: string;
  isDeleted?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

const VerificationChallengeSchema: Schema<VerificationChallengeDocument> =
  new Schema(
    {
      email: {
        type: String,
        required: true,
      },
      verificationCode: {
        type: String,
        required: true,
      },
      purpose: {
        type: String,
        enum: Object.values(VerificationChallengePurposes),
        default: VerificationChallengePurposes.EMAIL_VERIFICATION,
      },
      expiresAt: {
        type: Date,
        required: true,
      },
      isUsed: {
        type: Boolean,
        required: true,
      },
      isDeleted: {
        type: Boolean,
        default: false,
      },
    },
    {timestamps: true}
  );

export default mongoose.model<VerificationChallengeDocument>(
  "verification-codes-v1",
  VerificationChallengeSchema
);
