import { Router } from 'express';
import authMiddleware from '../middlewares/auth.middleware';
import DiscussionController from '../controllers/discussion.controller';
import { validateDiscussionBody } from '../validators/discussions.validators';

const router = Router();

router.get('/discussions', DiscussionController.getDiscussions);
router.get('/discussions/me', authMiddleware, DiscussionController.getMyDiscussions);
router.get('/discussions/:id', DiscussionController.getDiscussion);
router.post(
  '/discussions',
  authMiddleware,
  validateDiscussionBody(),
  DiscussionController.createDiscussion,
);
router.put(
  '/discussions',
  authMiddleware,
  validateDiscussionBody(),
  DiscussionController.updateDiscussion,
);
router.put('/discussions/viewed', DiscussionController.addView);
router.delete('/discussions', authMiddleware, DiscussionController.deleteDiscussion);

export default router;
