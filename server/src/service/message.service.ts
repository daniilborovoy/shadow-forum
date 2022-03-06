import ApiError from '../exceptions/api.error';
import { HydratedDocument, Types } from 'mongoose';
import MessageModel, { Message } from '../models/message.model';
import { MessageDto } from '../dtos/message.dto';

class MessageService {
  async saveMessage(message: string, userId: Types.ObjectId, discussionId: Types.ObjectId) {
    const userMessage: HydratedDocument<Message> = await MessageModel.create({
      body: message,
      creator: userId,
      discussion: discussionId,
      creationDate: new Date(),
    });
    const messageDto: MessageDto = new MessageDto(userMessage);
    return messageDto;
  }

  async getMessagesByDiscussionId(discussion: string) {
    const messages = await MessageModel.find({ discussion });
    if (messages) {
      const messagesDto = messages.map((message) => new MessageDto(message));
      return messagesDto;
    }
    return null;
  }

}

export default new MessageService();
