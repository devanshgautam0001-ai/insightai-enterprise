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
  
  let role = 'ANALYST';
  if (email === 'devanshgautam0001@gmail.com') {
    role = 'OWNER';
  } else if (existingUser) {
    role = existingUser.role;
    if (role === 'SUPER_ADMIN') {
      role = 'ADMIN'; // Map old SUPER_ADMIN role to ADMIN
    } else if (role === 'USER') {
      role = 'ANALYST'; // Map old USER role to ANALYST
    }
  } else {
    role = 'ANALYST';
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
        role,
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

