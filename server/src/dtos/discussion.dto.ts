import { HydratedDocument } from 'mongoose';
import { Discussion } from '../models/discussion.model';

export class DiscussionDto {
  readonly id: string;
  readonly title: string;
  readonly body: string;
  readonly creationDate: Date;
  readonly creatorId: string;
  readonly viewsCount: number;
  readonly messagesCount: number;
  readonly isCreator: boolean = false;

  constructor(model: HydratedDocument<Discussion>) {
    this.id = model._id.toString();
    this.title = model.title;
    this.body = model.body;
    this.creationDate = model.creationDate;
    this.creatorId = model.creatorId.toString();
    this.viewsCount = model.viewsCount;
    this.messagesCount = model.messagesCount;
  }
}
