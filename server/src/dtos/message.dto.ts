import { HydratedDocument, Types } from 'mongoose';
import { Message } from '../models/message.model';

export class MessageDto {
  id: Types.ObjectId;
  body: string;
  creationDate: Date;

  constructor(model: HydratedDocument<Message>) {
    this.id = model._id;
    this.body = model.body;
    this.creationDate = model.creationDate;
  }
}
