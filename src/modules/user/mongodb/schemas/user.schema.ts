import mongoose, {Schema, Document} from "mongoose";

export interface UserDocument extends Document {
  id: string;
  firstName?: string;
  lastName?: string;
  email: string;
  password: string;
  createdAt?: Date;
  updatedAt?: Date;
  isDeleted?: boolean;
  // Additional profile information (optional)
  dateOfBirth?: Date;
  maritalStatus?: string;
  profession?: string;
  gender?: string;
  address?: string;
  profileImage?: string;
}

const userSchema: Schema<UserDocument> = new Schema(
  {
    firstName: {type: String, required: false},
    lastName: {type: String, required: false},
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    isDeleted: {type: Boolean, default: false},
    // Additional profile information (optional)
    dateOfBirth: {type: Date, required: false},
    maritalStatus: {type: String, required: false},
    profession: {type: String, required: false},
    gender: {type: String, required: false},
    address: {type: String, required: false},
    profileImage: {type: String, required: false},
  },
  {timestamps: true}
);

export default mongoose.model<UserDocument>("users-v1", userSchema);
