import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

import { verifyToken } from '@clerk/clerk-sdk-node';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  async use(req: Request, res: Response, next: NextFunction) {
    try {
      const token = req.headers.authorization?.split(' ')[1];
      if (!token) {
        return res.status(401).json({ message: 'No token provided' });
      }

      const payload = await verifyToken(token, {
        issuer: process.env.CLERK_JWT_ISSUER!,
      });
      req['userId'] = payload.sub;

      next();
    } catch (error) {
      console.error(error);
      return res.status(401).json({ message: 'Unauthorized' });
    }
  }
}
