// Libraries
import {Model} from "mongoose";

// Repositories
import {BaseRepositoryImpl} from "../../../../common/infrastructure/mongodb/repositories/base.repository.impl";
import {UserRepository} from "../../repositories/user.repository";

// Entities
import {User} from "../../entities/user.entity";

// Schemas
import {UserDocument} from "../schemas/user.schema";

// Mappers
import {UserMapper} from "../mappers/user.mapper";

export class UserRepositoryImpl
  extends BaseRepositoryImpl<User, UserDocument>
  implements UserRepository
{
  constructor(userModel: Model<UserDocument>) {
    super(userModel, UserMapper);
  }
}