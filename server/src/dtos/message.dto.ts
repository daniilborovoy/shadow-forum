import { HydratedDocument, Types } from 'mongoose';
import { Message } from '../models/message.model';

export class MessageDto {
  readonly messageId: Types.ObjectId;
  readonly userId: Types.ObjectId;
  readonly body: string;
  readonly creationDate: Date;

  constructor(model: HydratedDocument<Message>) {
    this.messageId = model._id;
    this.userId = model.creatorId;
    this.body = model.body;
    this.creationDate = model.creationDate;
  }
}
