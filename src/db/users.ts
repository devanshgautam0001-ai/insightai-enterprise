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
  
  let role = 'USER';
  if (existingUser) {
    role = existingUser.role;
  } else {
    const allUsers = await db.select().from(users);
    if (allUsers.length === 0) {
      role = 'ADMIN';
    } else {
      role = 'USER';
    }
    const superAdminEmail = process.env.SUPER_ADMIN_EMAIL || 'devanshgautam0001@gmail.com';
    if (email === superAdminEmail) {
      role = 'SUPER_ADMIN';
    }
  }

  const result = await db.insert(users)
    .values({
      uid,
      email,
      role,
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

