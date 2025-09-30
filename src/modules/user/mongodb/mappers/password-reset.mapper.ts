// Lib
import { Types } from "mongoose";

// Entities
import { PasswordReset } from "../../entities/password-reset.entity";

// Schemas
import { PasswordResetDocument } from "../schemas/password-reset.schema";

export class PasswordResetMapper {
  static toDomain(doc: PasswordResetDocument): PasswordReset {
    return new PasswordReset({
      id: doc.id,
      email: doc.email,
      verificationCode: doc.verificationCode,
      isDeleted: doc.isDeleted,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    });
  }

  static toPersistence(entity: PasswordReset): Partial<PasswordResetDocument> {
    return {
      _id: entity.id ? new Types.ObjectId(entity.id as string) : undefined,
      email: entity.email,
      verificationCode: entity.verificationCode,
      isDeleted: entity.isDeleted,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    };
  }
}
