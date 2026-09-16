import { Router } from 'express';

const router = Router();

import { authenticate } from '../middleware/authenticate.js';
import { authorizeModification } from '../middleware/authorize.js';

import {
  getWatchlist,
  addMovie,
  updateMovie,
  deleteMovie
} from '../utils/db.js';

router.use(authenticate);

router.get('/:userId', (req, res) => {
  const userId = Number(req.params.userId);

  const watchlist = getWatchlist(userId);

  return res.status(200).json(watchlist);
});

router.post('/:userId/movies', authorizeModification, (req, res) => {
  const userId = Number(req.params.userId);
  const movieData = req.body;

  const updatedWatchlist = addMovie(userId, movieData);

  return res.status(201).json(updatedWatchlist);
});

router.put('/:userId/movies/:movieId', authorizeModification, (req, res) => {
  const userId = Number(req.params.userId);
  const movieId = Number(req.params.movieId);
  const movieData = req.body;

  const updatedWatchlist = updateMovie(
    userId,
    movieId,
    movieData
  );

  return res.status(200).json(updatedWatchlist);
});

router.delete('/:userId/movies/:movieId', authorizeModification, (req, res) => {
  const userId = Number(req.params.userId);
  const movieId = Number(req.params.movieId);

  const updatedWatchlist = deleteMovie(
    userId,
    movieId
  );

  return res.status(200).json(updatedWatchlist);
});

export default router;