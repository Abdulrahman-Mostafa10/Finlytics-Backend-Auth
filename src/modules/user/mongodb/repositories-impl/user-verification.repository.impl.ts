import { Model } from "mongoose";
import { BaseRepositoryImpl } from "../../../../common/infrastructure/mongodb/repositories/base.repository.impl";
import { UserVerificationRepository } from "../../repositories/user-verification.repository";
import { UserVerification } from "../../entities/user-verification.entity";
import { UserVerificationDocument } from "../schemas/user-verification.schema";
import { UserVerificationMapper } from "../mappers/user-verification.mapper";

export class UserVerificationRepositoryImpl
  extends BaseRepositoryImpl<UserVerification, UserVerificationDocument>
  implements UserVerificationRepository
{
  constructor(model: Model<UserVerificationDocument>) {
    super(model, UserVerificationMapper);
  }
}


