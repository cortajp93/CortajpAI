import { users, admins, type User, type InsertUser, type Admin, type InsertAdmin, type Waitlist, type InsertWaitlist, type UpdateWaitlist } from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";
import { randomBytes } from "crypto";

// Helper function to generate verification token
function generateVerificationToken(): string {
  return randomBytes(32).toString('hex');
}

export interface IStorage {
  // Waitlist operations
  addToWaitlist(entry: InsertWaitlist): Promise<Waitlist>;
  isEmailRegistered(email: string): Promise<boolean>;
  getAllWaitlistEntries(): Promise<Waitlist[]>;
  updateWaitlistEntry(id: number, data: UpdateWaitlist): Promise<Waitlist>;
  verifyEmail(token: string): Promise<Waitlist | undefined>;
  getWaitlistByEmail(email: string): Promise<Waitlist | undefined>;

  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Admin operations
  createAdmin(admin: InsertAdmin): Promise<Admin>;
  getAdminByEmail(email: string): Promise<Admin | undefined>;
}

export class DatabaseStorage implements IStorage {
  async addToWaitlist(entry: InsertWaitlist): Promise<Waitlist> {
    const verificationToken = generateVerificationToken();
    const verificationExpiry = new Date();
    verificationExpiry.setHours(verificationExpiry.getHours() + 24); // 24 hour expiry

    const [waitlistEntry] = await db
      .insert(waitlist)
      .values({
        ...entry,
        verificationToken,
        verificationExpiry,
      })
      .returning();
    return waitlistEntry;
  }

  async isEmailRegistered(email: string): Promise<boolean> {
    const [existingEntry] = await db
      .select()
      .from(waitlist)
      .where(eq(waitlist.email, email));
    return !!existingEntry;
  }

  async getAllWaitlistEntries(): Promise<Waitlist[]> {
    return await db
      .select()
      .from(waitlist)
      .orderBy(waitlist.signupDate);
  }

  async updateWaitlistEntry(id: number, data: UpdateWaitlist): Promise<Waitlist> {
    const [updated] = await db
      .update(waitlist)
      .set(data)
      .where(eq(waitlist.id, id))
      .returning();
    return updated;
  }

  async verifyEmail(token: string): Promise<Waitlist | undefined> {
    const [entry] = await db
      .select()
      .from(waitlist)
      .where(eq(waitlist.verificationToken, token));

    if (!entry || entry.verified || !entry.verificationExpiry || new Date() > entry.verificationExpiry) {
      return undefined;
    }

    const [updated] = await db
      .update(waitlist)
      .set({
        verified: true,
        verificationToken: null,
        verificationExpiry: null
      })
      .where(eq(waitlist.id, entry.id))
      .returning();

    return updated;
  }

  async getWaitlistByEmail(email: string): Promise<Waitlist | undefined> {
    const [entry] = await db
      .select()
      .from(waitlist)
      .where(eq(waitlist.email, email));
    return entry;
  }

  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  async createAdmin(admin: InsertAdmin): Promise<Admin> {
    const [newAdmin] = await db
      .insert(admins)
      .values(admin)
      .returning();
    return newAdmin;
  }

  async getAdminByEmail(email: string): Promise<Admin | undefined> {
    const [admin] = await db
      .select()
      .from(admins)
      .where(eq(admins.email, email));
    return admin;
  }
}

export const storage = new DatabaseStorage();