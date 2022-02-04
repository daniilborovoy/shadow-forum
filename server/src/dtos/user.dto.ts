import { HydratedDocument, Types } from 'mongoose';
import { User } from '../models/user.model';

export class UserDto {
  email: string;
  id: Types.ObjectId;
  isActivated: boolean;
  name: string;

  constructor(model: HydratedDocument<User>) {
    this.id = model._id;
    this.name = model.name;
    this.email = model.email;
    this.isActivated = model.isActivated;
  }
}
