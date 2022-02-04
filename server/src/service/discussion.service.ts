import { HydratedDocument, Types } from 'mongoose';
import DiscussionModel, { Discussion } from '../models/discussion.model';
import { DiscussionDto } from '../dtos/discussion.dto';

class DiscussionService {

  // TODO Необходимо оптимизировать проверку на авторство
  async verifyCreator(userId: Types.ObjectId, discussionId: Types.ObjectId): Promise<boolean> {
    const discussion = await DiscussionModel.findById(discussionId);
    if (!discussion) throw new Error('Удаляемого обсуждения не существует!');
    const creatorId: string = discussion.creator.toString();
    if (userId.toString() === creatorId) return true;
    return false;
  };

  async getDiscussion(discussionId: string, userId?: Types.ObjectId) {
    const discussion: HydratedDocument<Discussion> | null = await DiscussionModel.findById(discussionId);
    if (!discussion) throw new Error('Обсуждение не найдено!');
    const discussionDto = new DiscussionDto(discussion);
    if (userId) {
      const isCreator: boolean = await this.verifyCreator(userId, discussion.creator);
      return {
        ...discussionDto,
        isCreator,
      };
    }
    return discussionDto;
  }

  async getAllDiscussions(limit: number | undefined) {

    const discussions = await DiscussionModel.find({}, null, { limit });
    const discussionsDto: DiscussionDto[] = discussions.map(discussion => new DiscussionDto(discussion));
    return discussionsDto;
  }

  async createDiscussion(discussionTitle: string, userId: Types.ObjectId, discussionBody: string) {
    const discussion: HydratedDocument<Discussion> = await DiscussionModel.create({
      title: discussionTitle,
      creationDate: new Date(),
      body: discussionBody,
      creator: userId,
    });
    const discussionDto = new DiscussionDto(discussion);
    return discussionDto;
  }

  async deleteDiscussion(discussionId: Types.ObjectId, userId: Types.ObjectId) {

    const isCreator: boolean = await this.verifyCreator(userId, discussionId);
    if (!isCreator) {
      throw new Error('Нельзя удалить не свое обсуждение!');
    }
    const discussion: HydratedDocument<Discussion> | null = await DiscussionModel.findByIdAndDelete(discussionId);
    if (!discussion) throw new Error('Нечего удалять!');
    return discussion;
  }

  async updateDiscussion(discussionId: Types.ObjectId, discussionTitle: string, discussionBody: string) {
    const discussion: HydratedDocument<Discussion> | null = await DiscussionModel.findById(discussionId);
    if (!discussion) throw new Error('Изменяемое обсуждение не найдено!');
    discussion.title = discussionTitle;
    discussion.body = discussionBody;
    await discussion.save();
    return discussion;
  }
}

export default new DiscussionService();
