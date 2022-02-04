import { Router } from 'express';
import authMiddleware from '../middlewares/auth.middleware';
import { body } from 'express-validator';
import DiscussionController from '../controllers/discussion.controller';

const router = Router();

router.get('/discussions', DiscussionController.getDiscussions);
router.get('/discussions/:id', DiscussionController.getDiscussion);
router.post('/discussions', authMiddleware, body('title')
  .isLength({
    min: 3,
    max: 100,
  }), DiscussionController.createDiscussion);
router.put('/discussions', authMiddleware, DiscussionController.updateDiscussion);
router.delete('/discussions', authMiddleware, DiscussionController.deleteDiscussion);

export default router;
