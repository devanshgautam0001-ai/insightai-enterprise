import { Request, Response, NextFunction } from 'express';
import { adminAuth } from '../lib/firebase-admin.ts';
import { DecodedIdToken } from 'firebase-admin/auth';
import jwt from 'jsonwebtoken';
import { db } from '../db/index.ts';
import { users } from '../db/schema.ts';
import { eq } from 'drizzle-orm';
import { getOrCreateUser } from '../db/users.ts';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-key-123';

export interface AuthRequest extends Request {
  user?: DecodedIdToken & { role?: string };
}

export const requireAuth = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized: Missing token' });
  }

  const token = authHeader.split('Bearer ')[1];

  // 1. Try to verify the token as our custom JWT
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    req.user = {
      uid: decoded.uid,
      email: decoded.email,
      role: decoded.role,
      sub: decoded.uid,
    } as any;
    return next();
  } catch (jwtError) {
    // If not a custom JWT, try to verify as a Firebase ID token
    try {
      const decodedToken = await adminAuth.verifyIdToken(token);
      
      // Determine role from PostgreSQL database or assign based on email
      let [dbUser] = await db.select().from(users).where(eq(users.uid, decodedToken.uid));
      if (!dbUser && decodedToken.email) {
        dbUser = await getOrCreateUser(
          decodedToken.uid,
          decodedToken.email,
          decodedToken.name || null,
          decodedToken.picture || null,
          (decodedToken.firebase as any)?.sign_in_provider || null
        );
      }
      const role = dbUser?.role || 'USER';
      
      req.user = {
        ...decodedToken,
        role
      };
      return next();
    } catch (firebaseError) {
      console.error('Error verifying custom JWT & Firebase ID token:', jwtError, firebaseError);
      return res.status(401).json({ error: 'Unauthorized: Invalid token' });
    }
  }
};

export const requireRole = (allowedRoles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user || !req.user.role) {
      return res.status(401).json({ error: 'Unauthorized: Missing user role' });
    }
    if (req.user.role === 'SUPER_ADMIN') {
      return next();
    }
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ error: `Forbidden: Access restricted to roles: [${allowedRoles.join(', ')}]` });
    }
    next();
  };
};


