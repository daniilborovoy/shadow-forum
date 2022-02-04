import { HydratedDocument, Types } from 'mongoose';
import { Discussion } from '../models/discussion.model';

export class DiscussionDto {
  title: string;
  body: string;
  id: Types.ObjectId;

  constructor(model: HydratedDocument<Discussion>) {
    this.id = model._id;
    this.title = model.title;
    this.body = model.body;
  }
}
