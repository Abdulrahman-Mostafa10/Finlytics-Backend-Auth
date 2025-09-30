// Lib
import {Types} from "mongoose";

// Entities
import {User} from "../../entities/user.entity";

// Schemas
import {UserDocument} from "../schemas/user.schema";

// User Mapper
export class UserMapper {
  static toDomain(userDoc: UserDocument): User {
    return new User({
      id: userDoc.id,
      firstName: userDoc.firstName,
      lastName: userDoc.lastName,
      email: userDoc.email,
      password: userDoc.password,
      createdAt: userDoc.createdAt,
      updatedAt: userDoc.updatedAt,
      isDeleted: userDoc.isDeleted,
      // Additional profile information
      dateOfBirth: userDoc.dateOfBirth,
      maritalStatus: userDoc.maritalStatus,
      profession: userDoc.profession,
      gender: userDoc.gender,
      address: userDoc.address,
      profileImage: userDoc.profileImage,
    });
  }

  static toPersistence(user: User): Partial<UserDocument> {
    return {
      _id: user.id ? new Types.ObjectId(user.id as string) : undefined,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      password: user.password,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      isDeleted: user.isDeleted,
      // Additional profile information
      dateOfBirth: user.dateOfBirth,
      maritalStatus: user.maritalStatus,
      profession: user.profession,
      gender: user.gender,
      address: user.address,
      profileImage: user.profileImage,
    };
  }
}
