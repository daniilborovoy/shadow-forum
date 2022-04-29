import ApiError from '../exceptions/api.error';
import { HydratedDocument, Types } from 'mongoose';
import MessageModel, { Message } from '../models/message.model';
import { MessageDto } from '../dtos/message.dto';
import DiscussionModel, { Discussion } from '../models/discussion.model';

class MessageService {
  async saveMessage(message: string, userId: string, discussionId: string) {
    const discussion: HydratedDocument<Discussion> | null = await DiscussionModel.findById(
      discussionId,
    );
    if (!discussion) throw ApiError.BadRequestError('сan`t create message, discussion not found!');
    const userMessage: HydratedDocument<Message> = await MessageModel.create({
      body: message,
      createdBy: userId,
      discussionId: discussionId,
      creationDate: new Date(),
    });
    const createdMessage = await userMessage.populate('createdBy');
    discussion.messagesCount++;
    await discussion.save();
    const messageDto: MessageDto = new MessageDto(createdMessage);
    return messageDto;
  }

  async deleteMessage(messageId: string, discussionId: string): Promise<MessageDto | null> {
    const discussion: HydratedDocument<Discussion> | null = await DiscussionModel.findById(
      discussionId,
    );
    if (!discussion) throw ApiError.BadRequestError('сan`t delete message, discussion not found!');
    const userMessage: HydratedDocument<Message> | null = await MessageModel.findByIdAndDelete(
      messageId,
    );
    discussion.messagesCount--;
    await discussion.save();
    if (userMessage) {
      const messageDto: MessageDto = new MessageDto(userMessage);
      return messageDto;
    }
    return null;
  }

  async getMessagesByDiscussionId(discussionId: string): Promise<MessageDto[] | null> {
    const messages = await MessageModel.find({ discussionId }).populate('createdBy');
    if (messages) {
      const messagesDto: MessageDto[] = messages.map((message) => new MessageDto(message));
      return messagesDto;
    }
    return null;
  }
}

export default new MessageService();
