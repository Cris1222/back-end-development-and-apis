import express, { urlencoded } from 'express';
const app = express();

import apiRouter from './routes/api.routes.js';
import { notFoundHandler, finalErrorHandler } from './middleware/error.middleware.js';

app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

app.use(urlencoded({ extended: true }));
app.use('/api', apiRouter);
app.use(notFoundHandler);
app.use(finalErrorHandler);
const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});