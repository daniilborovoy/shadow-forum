import { Request, Response, NextFunction } from 'express';
import events from 'events';
import MessageService from '../service/message.service';
import { MessageDto } from '../dtos/message.dto';
import ApiError from '../exceptions/api.error';

const emitter = new events.EventEmitter();

class MessageController {

  async getMessages(req: Request, res: Response, next: NextFunction) {
    const discussion = req.params.discussion;
    if (!discussion) throw ApiError.BadRequestError('discussion id missing!');
    const messages = await MessageService.getMessagesByDiscussionId(discussion);
    res.status(200)
      .json(messages);
    next();
  }

  async createMessage(req: Request, res: Response) {
    const {
      message,
      discussionId,
    } = req.body;
    if (!discussionId) throw ApiError.BadRequestError('discussion id missing!');
    const userId = req.body.user.id;
    const userMessage: MessageDto = await MessageService.saveMessage(message, userId, discussionId);
    emitter.emit(`messages/${discussionId}`, userMessage);
    res.status(200);
  }

  async deleteMessage(req: Request, res: Response) {
    // const {
    //   messageId,
    // } = req.body;
    // await MessageService.deleteMessage();
  }

  async updateMessage() {
    // const {
    //   messageId,
    //   body
    // } = req.body;
    // await MessageService.updateMessage(messageId, body);
  }

  async subscribe(req: Request, res: Response) {
    const { discussionId } = req.params;
    emitter.once(`messages/${discussionId}`, (message) => {
      res.json(message);
    });
  }
}

export default new MessageController();
