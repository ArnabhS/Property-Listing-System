import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';
import dotenv from 'dotenv';

dotenv.config();

interface JwtPayload {
  userId: string;
  email: string;
}

export interface AuthRequest extends Request {
  user?: {
    _id: string;
    email: string;
  };
  body: any;
  params: any;
}

export const protect = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
      
      const user = await User.findById(decoded.userId).select('-password');
      
      if (!user) {
        res.status(401).json({ message: 'User not found' });
        return;
      }
      req.user = user;
      next();
    } catch (error) {
      res.status(401).json({ message: 'Invalid token' });
      return;
    }
  } else {
    res.status(401).json({ message: 'Not authorized, token missing' });
    return;
  }
};
