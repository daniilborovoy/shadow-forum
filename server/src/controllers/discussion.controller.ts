import { Request, Response, NextFunction } from 'express';
import DiscussionService from '../service/discussion.service';
import { Types } from 'mongoose';
import { DiscussionDto } from '../dtos/discussion.dto';

class DiscussionController {
  async getDiscussion(req: Request, res: Response, next: NextFunction) {
    try {
      const discussionId: string = req.params.id;
      const userId = req.body.user.id ? req.body.user.id : null;
      const data = userId ? await DiscussionService.getDiscussion(discussionId, userId) : await DiscussionService.getDiscussion(discussionId);
      return res.status(200)
        .send(data);
    } catch (e) {
      next(e);
    }
  }

  async getDiscussions(req: Request, res: Response, next: NextFunction) {
    try {
      const limit = req.query._limit ? Number(req.query._limit) : undefined;
      const discussions = await DiscussionService.getAllDiscussions(limit);
      return res.status(200)
        .json(discussions);
    } catch (e) {
      next(e);
    }
  }

  async createDiscussion(req: any, res: Response, next: NextFunction) {
    try {
      const {
        title: discussionTitle,
        body: discussionBody,
      } = req.body;
      const userId = req.body.user.id; // req.user
      const discussion = await DiscussionService.createDiscussion(discussionTitle, userId, discussionBody);
      res.status(200)
        .json(discussion);
    } catch (e) {
      next(e);
    }
  }

  async deleteDiscussion(req: any, res: Response, next: NextFunction) {
    try {
      const { id: discussionId } = req.body;
      const userId: Types.ObjectId = req.body.user.id;
      const discussion = await DiscussionService.deleteDiscussion(discussionId, userId);
      const discussionDto = new DiscussionDto(discussion);
      res.status(200)
        .json(discussionDto);
    } catch (e) {
      next(e);
    }
  }

  async updateDiscussion(req: Request, res: Response, next: NextFunction) {
    try {
      const {
        id: discussionId,
        title: discussionTitle,
        body: discussionBody,
      } = req.body;
      const discussion = await DiscussionService.updateDiscussion(discussionId, discussionTitle, discussionBody);
      const discussionDto = new DiscussionDto(discussion);
      res.status(200)
        .json(discussionDto);
    } catch (e) {
      next(e);
    }
  }
}

export default new DiscussionController();
