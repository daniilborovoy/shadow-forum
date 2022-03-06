import { body } from 'express-validator';

const validateDiscussionBody = () => ([
  body('title')
    .isLength({
      min: 3,
      max: 100,
    }),
]);

export { validateDiscussionBody };
