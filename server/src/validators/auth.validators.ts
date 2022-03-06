import { body } from 'express-validator';

const validateRegistrationBody = () => [
  body('email')
    .isEmail(),
  body('password')
    .isLength({
      min: 8,
      max: 32,
    }),
  body('name')
    .isLength({
      min: 1,
      max: 30,
    }),
];

export { validateRegistrationBody };
