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

// Helper to race a promise with a timeout
const withTimeout = <T>(promise: Promise<T>, ms: number, label: string): Promise<T> => {
  let timeoutId: NodeJS.Timeout;
  const timeoutPromise = new Promise<never>((_, reject) => {
    timeoutId = setTimeout(() => {
      reject(new Error(`${label} timed out after ${ms}ms`));
    }, ms);
  });
  return Promise.race([promise, timeoutPromise]).finally(() => {
    clearTimeout(timeoutId);
  });
};

export const requireAuth = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const isSyncEndpoint = req.path === '/auth/sync';
  
  if (isSyncEndpoint) {
    console.log("[SYNC] Request received");
  }

  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    if (isSyncEndpoint) {
      console.log("[SYNC] Missing token");
    }
    return res.status(401).json({ error: 'Unauthorized: Missing token' });
  }

  const token = authHeader.split('Bearer ')[1];
  if (isSyncEndpoint) {
    console.log("[SYNC] Token extracted");
  }

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
    if (isSyncEndpoint) {
      console.log("[SYNC] Verifying Firebase token");
    }
    // 2. Process as a Firebase ID token
    let decodedToken: DecodedIdToken;
    try {
      // Apply a strict 4-second timeout on verifying the Firebase token
      decodedToken = await withTimeout(
        adminAuth.verifyIdToken(token),
        4000,
        "Firebase Token Verification"
      );
      if (isSyncEndpoint) {
        console.log("[SYNC] Token verified");
      }
    } catch (firebaseError: any) {
      console.error('[Auth Middleware] Firebase ID Token verification failed:', firebaseError.message || firebaseError);
      return res.status(401).json({ error: `Unauthorized: Invalid Firebase token. Details: ${firebaseError.message || firebaseError}` });
    }

    let role = 'NONE';
    let status = 'PENDING';
    let approved = false;
    let isActive = false;
    let dbUser: any = null;

    if (decodedToken.email === 'devanshgautam0001@gmail.com') {
      role = 'OWNER';
      status = 'APPROVED';
      approved = true;
      isActive = true;
    }

    if (isSyncEndpoint) {
      console.log("[SYNC] Looking up user");
    }

    // Attempt database lookup but fail gracefully with strict 3-second timeout if PostgreSQL is offline/unavailable
    try {
      const results = await withTimeout(
        db.select().from(users).where(eq(users.uid, decodedToken.uid)),
        3000,
        "PostgreSQL select user"
      );
      dbUser = results[0];

      if (!dbUser && decodedToken.email) {
        if (isSyncEndpoint) {
          console.log("[SYNC] Creating user");
        }
        dbUser = await withTimeout(
          getOrCreateUser(
            decodedToken.uid,
            decodedToken.email,
            decodedToken.name || null,
            decodedToken.picture || null,
            (decodedToken.firebase as any)?.sign_in_provider || null
          ),
          3000,
          "PostgreSQL getOrCreateUser"
        );
      } else {
        if (isSyncEndpoint) {
          console.log("[SYNC] User found");
        }
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
      if (isSyncEndpoint) {
        console.log("[SYNC] Database complete");
      }
    } catch (dbErr: any) {
      console.warn('[Auth Middleware] Database access failed, using token details/fallback:', dbErr.message || dbErr);
      if (decodedToken.email === 'devanshgautam0001@gmail.com') {
        role = 'OWNER';
        status = 'APPROVED';
        approved = true;
        isActive = true;
      }
      if (isSyncEndpoint) {
        console.log("[SYNC] Database failed (bypassing with transient profile)");
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
        const results = await withTimeout(
          db.select().from(users).where(eq(users.uid, decoded.uid)),
          3000,
          "PostgreSQL select session"
        );
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


