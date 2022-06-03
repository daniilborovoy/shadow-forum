import { HydratedDocument, Types } from 'mongoose';
import { Message } from '../models/message.model';
import { User } from '../models/user.model';

export class MessageDto {
  readonly messageId: Types.ObjectId;
  readonly createdBy: Types.ObjectId | User;
  readonly body: string;
  readonly creationDate: Date;

  constructor(model: HydratedDocument<Message>) {
    this.messageId = model._id;
    this.createdBy = model.createdBy;
    this.body = model.body;
    this.creationDate = model.creationDate;
  }
}
