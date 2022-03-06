import { HydratedDocument, Types } from 'mongoose';
import DiscussionModel, { Discussion } from '../models/discussion.model';
import { DiscussionDto } from '../dtos/discussion.dto';
import ApiError from '../exceptions/api.error';

// TODO комментарии
class DiscussionService {

  verifyCreator(userId: string, creatorId: string): boolean {
    return userId === creatorId;
  };

  async getDiscussion(discussionId: string, userId?: string) {
    const discussion: HydratedDocument<Discussion> | null = await DiscussionModel.findById(discussionId);
    if (!discussion) throw ApiError.BadRequestError('discussion not found!');
    const discussionDto = new DiscussionDto(discussion);
    if (userId) {
      const isCreator: boolean = this.verifyCreator(userId, String(discussion.creatorId));
      return {
        ...discussionDto,
        isCreator,
      };
    }
    return {
      ...discussionDto,
      isCreator: false,
    };
  }

  async getAllDiscussions(limit: number | undefined) {

    const discussions = await DiscussionModel.find({}, null, {
      sort: { creationDate: -1 },
      limit,
    });
    const discussionsDto: DiscussionDto[] = discussions.map(discussion => new DiscussionDto(discussion));
    return discussionsDto;
  }

  async createDiscussion(discussionTitle: string, userId: string, discussionBody: string) {
    const discussion: HydratedDocument<Discussion> = await DiscussionModel.create({
      title: discussionTitle,
      creationDate: new Date(),
      body: discussionBody,
      creatorId: userId,
    });
    const discussionDto = new DiscussionDto(discussion);
    return discussionDto;
  }

  async deleteDiscussion(discussionId: string, userId: string) {
    const isCreator: boolean = this.verifyCreator(userId, discussionId);
    if (!isCreator) {
      throw ApiError.BadRequestError('you can not delete someone else`s discussion!');
    }
    const discussion: HydratedDocument<Discussion> | null = await DiscussionModel.findByIdAndDelete(discussionId);
    if (!discussion) throw ApiError.BadRequestError('nothing to delete!');
    return discussion;
  }

  async updateDiscussion(discussionId: Types.ObjectId, discussionTitle: string, discussionBody: string) {
    const discussion: HydratedDocument<Discussion> | null = await DiscussionModel.findById(discussionId);
    if (!discussion) throw new Error('Editable discussion not found!');
    discussion.title = discussionTitle;
    discussion.body = discussionBody;
    await discussion.save();
    return discussion;
  }

  async addView(discussionId: string) {
    if (!discussionId) throw ApiError.BadRequestError('discussion id missing!');
    const discussion: HydratedDocument<Discussion> | null = await DiscussionModel.findById(discussionId);
    if (!discussion) throw ApiError.BadRequestError('discussion not found!');
    discussion.viewsCount++;
    await discussion.save();
    return discussion;
  }
}

export default new DiscussionService();
