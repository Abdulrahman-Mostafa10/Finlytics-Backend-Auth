// Lib
import { Model } from "mongoose";

// Common
import { BaseRepositoryImpl } from "../../../../common/infrastructure/mongodb/repositories/base.repository.impl";

// Entities
import { PasswordReset } from "../../entities/password-reset.entity";

// Mappers
import { PasswordResetMapper } from "../mappers/password-reset.mapper";

// Repositories
import { PasswordResetRepository } from "../../repositories/password-reset.repository";

// Schemas
import { PasswordResetDocument } from "../schemas/password-reset.schema";

export class PasswordResetRepositoryImpl
  extends BaseRepositoryImpl<PasswordReset, PasswordResetDocument>
  implements PasswordResetRepository
{
  constructor(model: Model<PasswordResetDocument>) {
    super(model, PasswordResetMapper);
  }
}
