import { HydratedDocument, Types } from 'mongoose';
import { Discussion } from '../models/discussion.model';

export class DiscussionDto {
  readonly id: Types.ObjectId;
  readonly title: string;
  readonly body: string;
  readonly creationDate: Date;
  readonly creatorId: Types.ObjectId;
  readonly viewsCount: number;
  readonly messagesCount: number;

  constructor(model: HydratedDocument<Discussion>) {
    this.id = model._id;
    this.title = model.title;
    this.body = model.body;
    this.creationDate = model.creationDate;
    this.creatorId = model.creatorId;
    this.viewsCount = model.viewsCount;
    this.messagesCount = model.messagesCount;
  }
}
