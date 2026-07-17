import { db } from './index.ts';
import { users } from './schema.ts';
import { eq } from 'drizzle-orm';

export async function getOrCreateUser(
  uid: string,
  email: string,
  displayName?: string | null,
  photoUrl?: string | null,
  provider?: string | null
) {
  const [existingUser] = await db.select().from(users).where(eq(users.uid, uid));
  
  let role = 'NONE';
  let status = 'PENDING';
  let approved = false;
  let isActive = false;

  if (email === 'devanshgautam0001@gmail.com') {
    role = 'OWNER';
    status = 'APPROVED';
    approved = true;
    isActive = true;
  } else if (existingUser) {
    role = existingUser.role;
    status = existingUser.status || 'PENDING';
    approved = existingUser.approved !== undefined ? existingUser.approved : false;
    isActive = existingUser.isActive !== undefined ? existingUser.isActive : false;
  }

  const result = await db.insert(users)
    .values({
      uid,
      email,
      role,
      status,
      approved,
      isActive,
      displayName: displayName || null,
      photoUrl: photoUrl || null,
      provider: provider || null,
      lastLogin: new Date(),
      updatedAt: new Date(),
    })
    .onConflictDoUpdate({
      target: users.uid,
      set: {
        email,
        role,
        status,
        approved,
        isActive,
        displayName: displayName || null,
        photoUrl: photoUrl || null,
        provider: provider || null,
        lastLogin: new Date(),
        updatedAt: new Date(),
      },
    })
    .returning();

  return result[0];
}

