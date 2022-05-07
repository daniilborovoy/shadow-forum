import { Request, Response, NextFunction } from 'express';
import DiscussionService from '../service/discussion.service';
import { DiscussionDto } from '../dtos/discussion.dto';
import tokenService from '../service/token.service';

class DiscussionController {
  async getDiscussion(req: Request, res: Response, next: NextFunction) {
    try {
      const discussionId: string = req.params.id;
      const authorizationHeader: string | undefined = req.headers.authorization;

      if (authorizationHeader) {
        const accessToken = authorizationHeader.split(' ')[1];
        const userData = tokenService.validateAccessToken(accessToken);

        if (userData && userData.id) {
          const discussion = await DiscussionService.getDiscussion(
            discussionId,
            userData.id.toString(),
          );
          return res.status(200).json(discussion);
        }
      }
      const discussion = await DiscussionService.getDiscussion(discussionId);
      return res.status(200).json(discussion);
    } catch (err: unknown) {
      next(err);
    }
  }

  async getDiscussions(
    req: Request<null, null, null, { _limit: number; title: string }>,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const { _limit: limit, title } = req.query;
      const discussions = await DiscussionService.getAllDiscussions(limit, title);
      return res.status(200).json(discussions);
    } catch (err: unknown) {
      next(err);
    }
  }

  async getMyDiscussions(req: Request, res: Response, next: NextFunction) {
    try {
      const id: string = req.body.user.id;
      const discussions = await DiscussionService.fetchMyDiscussions(id);
      return res.status(200).json(discussions);
    } catch (err: unknown) {
      next(err);
    }
  }

  async createDiscussion(req: Request, res: Response, next: NextFunction) {
    try {
      const { title: discussionTitle, body: discussionBody } = req.body;
      const userId = req.body.user.id; // req.user
      const discussion = await DiscussionService.createDiscussion(
        userId,
        discussionTitle,
        discussionBody,
      );
      res.status(200).json(discussion);
    } catch (err: unknown) {
      next(err);
    }
  }

  async deleteDiscussion(req: Request, res: Response, next: NextFunction) {
    try {
      const discussionId = req.query.id as string;
      const userId: string = req.body.user.id;
      const deletedDiscussion = await DiscussionService.deleteDiscussion(discussionId, userId);
      res.status(200).json(deletedDiscussion);
    } catch (err: unknown) {
      next(err);
    }
  }

  async updateDiscussion(req: Request, res: Response, next: NextFunction) {
    try {
      const { id: discussionId, title: discussionTitle, body: discussionBody } = req.body;
      const discussion = await DiscussionService.updateDiscussion(
        discussionId,
        discussionTitle,
        discussionBody,
      );
      const discussionDto = new DiscussionDto(discussion);
      res.status(200).json(discussionDto);
      return;
    } catch (err: unknown) {
      next(err);
    }
  }

  async addView(req: Request, res: Response, next: NextFunction) {
    try {
      const { id: discussionId }: { id: string } = req.body;
      const discussion = await DiscussionService.addView(discussionId);
      if (discussion) return res.status(200);
      res.status(500);
      return;
    } catch (err: unknown) {
      next(err);
    }
  }
}

export default new DiscussionController();
