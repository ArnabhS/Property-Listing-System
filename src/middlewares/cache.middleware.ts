import { Request, Response, NextFunction } from 'express';
import redis from '../config/redis';

export const cacheMiddleware = (duration: number) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    if (req.method !== 'GET') {
      return next();
    }

    const key = `cache:${req.originalUrl}`;

    try {
      const cachedResponse = await redis.get(key);
      console.log("cachedResponse",cachedResponse);
      if (cachedResponse) {
        res.json(JSON.parse(cachedResponse));
        return;
      }

      const originalJson = res.json;
      res.json = function(body: any) {
        redis.setex(key, duration, JSON.stringify(body));
        return originalJson.call(this, body);
      };

      next();
    } catch (error) {
      next();
    }
  };
}
