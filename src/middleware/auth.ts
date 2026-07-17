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
  user?: DecodedIdToken & {
    id?: number;
    uid: string;
    email: string;
    role: string;
    status: string;
    approved: boolean;
    isActive: boolean;
  };
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
      
      let role = 'NONE';
      let status = 'PENDING';
      let approved = false;
      let isActive = false;
      let dbUser: any;

      if (decodedToken.email === 'devanshgautam0001@gmail.com') {
        role = 'OWNER';
        status = 'APPROVED';
        approved = true;
        isActive = true;
      }

      // Attempt database lookup but fail gracefully if PostgreSQL is offline/unavailable
      try {
        const results = await db.select().from(users).where(eq(users.uid, decodedToken.uid));
        dbUser = results[0];
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
          // If the logged in email is owner, override database fields to protect owner
          if (dbUser.email === 'devanshgautam0001@gmail.com') {
            role = 'OWNER';
            status = 'APPROVED';
            approved = true;
            isActive = true;
          } else {
            role = dbUser.role || 'NONE';
            status = dbUser.status || 'PENDING';
            approved = dbUser.approved !== undefined ? dbUser.approved : false;
            isActive = dbUser.isActive !== undefined ? dbUser.isActive : false;
          }
        }
      } catch (dbErr) {
        console.warn('[Auth Middleware] Database access failed, using token details:', dbErr);
        if (decodedToken.email === 'devanshgautam0001@gmail.com') {
          role = 'OWNER';
          status = 'APPROVED';
          approved = true;
          isActive = true;
        }
      }

      req.user = {
        ...decodedToken,
        id: dbUser?.id,
        role,
        status,
        approved,
        isActive,
      } as any;
      return next();
    } catch (firebaseError: any) {
      console.error('[Auth Middleware] Firebase ID Token verification failed:', firebaseError.message || firebaseError);
      return res.status(401).json({ error: 'Unauthorized: Invalid Firebase token' });
    }
  } else {
    // 3. Process as our custom application JWT
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as any;
      const email = decoded.email;
      let dbUser: any;
      
      let role = 'NONE';
      let status = 'PENDING';
      let approved = false;
      let isActive = false;

      if (email === 'devanshgautam0001@gmail.com') {
        role = 'OWNER';
        status = 'APPROVED';
        approved = true;
        isActive = true;
      }

      try {
        const results = await db.select().from(users).where(eq(users.uid, decoded.uid));
        dbUser = results[0];
        if (dbUser) {
          if (dbUser.email === 'devanshgautam0001@gmail.com') {
            role = 'OWNER';
            status = 'APPROVED';
            approved = true;
            isActive = true;
          } else {
            role = dbUser.role || 'NONE';
            status = dbUser.status || 'PENDING';
            approved = dbUser.approved !== undefined ? dbUser.approved : false;
            isActive = dbUser.isActive !== undefined ? dbUser.isActive : false;
          }
        }
      } catch (dbErr) {
        console.warn('[Auth Middleware] Custom JWT database lookup failed:', dbErr);
        if (email === 'devanshgautam0001@gmail.com') {
          role = 'OWNER';
          status = 'APPROVED';
          approved = true;
          isActive = true;
        } else {
          role = decoded.role || 'NONE';
        }
      }

      req.user = {
        uid: decoded.uid,
        email,
        role,
        status,
        approved,
        isActive,
        sub: decoded.uid,
        id: dbUser?.id || decoded.id,
      } as any;
      return next();
    } catch (jwtError: any) {
      console.error('[Auth Middleware] Custom JWT verification failed:', jwtError.message || jwtError);
      return res.status(401).json({ error: 'Unauthorized: Invalid custom JWT token' });
    }
  }
};

export const requireApproved = (req: AuthRequest, res: Response, next: NextFunction) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Unauthorized: Not authenticated' });
  }

  if (req.user.email === 'devanshgautam0001@gmail.com') {
    return next();
  }

  if (req.user.status !== 'APPROVED' || !req.user.approved || !req.user.isActive) {
    return res.status(403).json({
      error: 'Forbidden: Your account is awaiting administrator approval or has been suspended.',
      status: req.user.status,
      approved: req.user.approved,
      isActive: req.user.isActive
    });
  }

  next();
};

export const requireRole = (allowedRoles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user || !req.user.role) {
      return res.status(401).json({ error: 'Unauthorized: Missing user role' });
    }
    // OWNER role has full access and overrides all role checks
    if (req.user.role === 'OWNER') {
      return next();
    }
    
    // Support legacy client calls/roles mapping if necessary
    const rolesToCheck = allowedRoles.map(r => {
      if (r === 'SUPER_ADMIN') return 'OWNER';
      if (r === 'ANALYST' || r === 'VIEWER') return 'USER'; // Map any legacy roles to NONE/USER or allowed role
      return r;
    });

    if (!allowedRoles.includes(req.user.role) && !rolesToCheck.includes(req.user.role)) {
      return res.status(403).json({ error: `Forbidden: Access restricted to roles: [${allowedRoles.join(', ')}]` });
    }
    next();
  };
};


