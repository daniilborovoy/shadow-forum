import { Request, Response, NextFunction } from 'express';
import MessageService from '../service/message.service';
import ApiError from '../exceptions/api.error';

class MessageController {
  async getMessages(req: Request, res: Response, next: NextFunction) {
    try {
      const discussion = req.params.discussion;
      if (!discussion) throw ApiError.BadRequestError('discussion id missing!');
      const messages = await MessageService.getMessagesByDiscussionId(discussion);
      res.status(200).json(messages);
    } catch (err) {
      next(err);
    }
  }

  async createMessage(req: Request, res: Response, next: NextFunction) {
    try {
      const { message, discussionId } = req.body;
      if (!discussionId) throw ApiError.BadRequestError('discussion id missing!');
      const userId = req.body.user.id;
      await MessageService.saveMessage(message, userId, discussionId);
      res.status(200);
    } catch (err) {
      next(err);
    }
  }

  async deleteMessage(req: Request, res: Response) {
    // try {
    //   const { messageId } = req.body;
    //   await MessageService.deleteMessage();
    // } catch (err) {}
  }

  async updateMessage() {
    // try {
    //   const { messageId, body } = req.body;
    //   await MessageService.updateMessage(messageId, body);
    // } catch (err) {}
  }
}

export default new MessageController();
