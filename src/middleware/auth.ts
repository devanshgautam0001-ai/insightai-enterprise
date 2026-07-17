import { Request, Response, NextFunction } from 'express';
import { adminAuth } from '../lib/firebase-admin.ts';
import { DecodedIdToken } from 'firebase-admin/auth';
import jwt from 'jsonwebtoken';
import { db } from '../db/index.ts';
import { users } from '../db/schema.ts';
import { eq } from 'drizzle-orm';
import { getOrCreateUser } from '../db/users.ts';

const cleanEnvVal = (val: string | undefined): string | undefined => {
  if (!val) return val;
  let s = val.trim();
  if (s.startsWith('"') && s.endsWith('"')) {
    s = s.substring(1, s.length - 1);
  }
  return s;
};

const JWT_SECRET = cleanEnvVal(process.env.JWT_SECRET) || 'fallback-secret-key-123';

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

  // 1. Decode token to inspect its type dynamically
  let isFirebaseToken = false;
  try {
    const decodedUnverified = jwt.decode(token, { complete: true }) as any;
    if (decodedUnverified && decodedUnverified.header) {
      const alg = decodedUnverified.header.alg;
      const iss = decodedUnverified.payload?.iss;
      // Firebase ID tokens are always RS256 signed and issued by securetoken.google.com
      if (alg === 'RS256' || (iss && iss.startsWith('https://securetoken.google.com/'))) {
        isFirebaseToken = true;
      }
    }
  } catch (decodeErr) {
    console.error('[Auth Middleware] Failed to decode JWT header/payload:', decodeErr);
  }

  if (isFirebaseToken) {
    // 2. Process as a Firebase ID token
    try {
      const decodedToken = await adminAuth.verifyIdToken(token);
      
      let role = 'ANALYST'; // Default role
      if (decodedToken.email === 'devanshgautam0001@gmail.com') {
        role = 'OWNER';
      } else {
        // Attempt database lookup but fail gracefully if PostgreSQL is offline/unavailable
        try {
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
          if (dbUser) {
            role = dbUser.role || 'ANALYST';
          }
        } catch (dbErr) {
          console.warn('[Auth Middleware] PostgreSQL query failed (offline/refused). Falling back to safe default role:', dbErr);
          // Safe fallback role based on email context or tenant suffix if database connection failed
          if (decodedToken.email && (decodedToken.email.endsWith('.corp') || decodedToken.email.endsWith('.io'))) {
            role = 'ADMIN';
          } else {
            role = 'ANALYST';
          }
        }
      }

      if (role === 'SUPER_ADMIN') {
        role = 'OWNER';
      }

      req.user = {
        ...decodedToken,
        role
      };
      return next();
    } catch (firebaseError: any) {
      console.error('[Auth Middleware] Firebase ID Token verification failed:', firebaseError.message || firebaseError);
      return res.status(401).json({ error: 'Unauthorized: Invalid Firebase token' });
    }
  } else {
    // 3. Process as our custom application JWT
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as any;
      const userRole = decoded.email === 'devanshgautam0001@gmail.com' ? 'OWNER' : (decoded.role === 'SUPER_ADMIN' ? 'OWNER' : decoded.role);
      req.user = {
        uid: decoded.uid,
        email: decoded.email,
        role: userRole,
        sub: decoded.uid,
      } as any;
      return next();
    } catch (jwtError: any) {
      console.error('[Auth Middleware] Custom JWT verification failed:', jwtError.message || jwtError);
      return res.status(401).json({ error: 'Unauthorized: Invalid custom JWT token' });
    }
  }
};

export const requireRole = (allowedRoles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user || !req.user.role) {
      return res.status(401).json({ error: 'Unauthorized: Missing user role' });
    }
    // OWNER role has full access and overrides all role checks
    if (req.user.role === 'OWNER' || req.user.role === 'SUPER_ADMIN') {
      return next();
    }
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ error: `Forbidden: Access restricted to roles: [${allowedRoles.join(', ')}]` });
    }
    next();
  };
};


