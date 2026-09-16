import { Router } from 'express';

const router = Router();

// GET /api -> returns 200 plain text
router.get('/', (req, res) => {
  res.status(200).send('API is available!');
});

// GET /api/crash -> triggers 500 error
router.get('/crash', (req, res, next) => {
  const error = new Error('Database connection failed.');
  next(error);
});

// GET /api/bad-request -> triggers 400 error
router.get('/bad-request', (req, res, next) => {
  const error = new Error('Client-side data is missing.');
  error.status = 400;
  next(error);
});

export default router;