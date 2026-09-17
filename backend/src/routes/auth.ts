import { Router, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { store } from '../store/dataStore';
import { config } from '../config';

export const authRouter = Router();

// POST /api/auth/login
authRouter.post('/login', (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email) {
    return res.status(400).json({ success: false, message: 'Email required' });
  }

  // Find user or create temporary viewer
  let user = store.users.get(email);
  if (!user) {
    user = {
      id: `usr_${Date.now()}`,
      email,
      role: email.includes('admin') ? 'admin' : email.includes('officer') ? 'authority' : 'viewer',
      region: 'Tapi-Basin',
      name: email.split('@')[0].toUpperCase()
    };
    store.users.set(email, user);
  }

  const token = jwt.sign(
    { id: user.id, email: user.email, role: user.role, region: user.region },
    config.jwtSecret,
    { expiresIn: '24h' }
  );

  res.json({
    success: true,
    token,
    user: {
      id: user.id,
      email: user.email,
      role: user.role,
      region: user.region,
      name: user.name
    }
  });
});

// POST /api/auth/refresh
authRouter.post('/refresh', (req: Request, res: Response) => {
  const { token } = req.body;
  if (!token) return res.status(400).json({ success: false, message: 'Token required' });

  try {
    const decoded = jwt.verify(token, config.jwtSecret) as any;
    const newToken = jwt.sign(
      { id: decoded.id, email: decoded.email, role: decoded.role, region: decoded.region },
      config.jwtSecret,
      { expiresIn: '24h' }
    );
    res.json({ success: true, token: newToken });
  } catch (err: any) {
    res.status(401).json({ success: false, message: 'Invalid or expired token' });
  }
});

// POST /api/auth/logout
authRouter.post('/logout', (req: Request, res: Response) => {
  res.json({ success: true, message: 'Logged out successfully' });
});
