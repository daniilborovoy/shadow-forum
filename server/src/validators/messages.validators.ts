import { body } from 'express-validator';

const validateMessageBody = () => [
  body('message').isLength({
    min: 1,
    max: 500,
  }),
];

export { validateMessageBody };
