import { Request, Response, NextFunction } from 'express';
import DiscussionService from '../service/discussion.service';
import { Types } from 'mongoose';
import { DiscussionDto } from '../dtos/discussion.dto';
import events from 'events';
import MessageService from '../service/message.service';
import { MessageDto } from '../dtos/message.dto';

const emitter = new events.EventEmitter();

class MessageController {
  async getMessages(req: Request, res: Response) {
    const { discussion_id } = req.body;
    emitter.once(`message/${discussion_id}`, (message) => {
      res.json(message);
    });
  }

  async createMessage(req: Request, res: Response) {
    const {
      message,
      discussion_id: discussionId,
    } = req.body;
    const userId = req.body.user.id;
    const userMessage: MessageDto = await MessageService.saveMessage(message, userId, discussionId);
    emitter.emit(`message/${discussionId}`, userMessage);
    res.status(200);
  }

  async deleteMessage() {

  }

  async updateMessage() {

  }
}

export default new MessageController();
