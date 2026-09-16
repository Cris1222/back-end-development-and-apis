import express, { json } from 'express';
import authRoutes from './routes/auth.js';
import watchlistRoutes from './routes/watchlist.js';
const app = express();
const PORT = process.env.PORT || 3000;
app.use(json());
app.use('/api/auth', authRoutes);
app.use('/api/watchlist', watchlistRoutes);
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

export default app;