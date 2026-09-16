import { Router } from 'express';
import jwt from 'jsonwebtoken';
import { compare } from 'bcryptjs';
import users from '../data/users.json' with { type: 'json' };

const router = Router();

const JWT_SECRET = process.env.JWT_SECRET || 'secretkey';

router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({
      error: 'Username and password are required.'
    });
  }

  const user = users.find((u) => u.username === username);

  if (!user) {
    return res.status(401).json({
      error: 'Invalid credentials.'
    });
  }

  const isMatch = await compare(password, user.passwordHash);

  if (!isMatch) {
    return res.status(401).json({
      error: 'Invalid credentials.'
    });
  }

  const token = jwt.sign(
    {
      id: user.id,
      username: user.username,
      role: user.role
    },
    JWT_SECRET,
    {
      expiresIn: '1h'
    }
  );

  return res.status(200).json({
    token
  });
});

export default router;