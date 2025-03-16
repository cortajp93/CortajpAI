import { pgTable, text, serial, timestamp, integer, decimal, json, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const admins = pgTable("admins", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  credits: integer("credits").notNull().default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const images = pgTable("images", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  originalUrl: text("original_url").notNull(),
  processedUrl: text("processed_url"),
  prompt: text("prompt"),
  inpaintMask: text("inpaint_mask"),
  status: text("status").notNull().default('pending'),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const transactions = pgTable("transactions", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  credits: integer("credits").notNull(),
  status: text("status").notNull().default('pending'),
  stripePaymentId: text("stripe_payment_id"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Schema for user registration
export const insertUserSchema = createInsertSchema(users)
  .pick({ email: true, password: true })
  .extend({
    email: z.string().email("Please enter a valid email address"),
    password: z.string().min(8, "Password must be at least 8 characters"),
  });

// Schema for image processing
export const insertImageSchema = createInsertSchema(images)
  .pick({ prompt: true })
  .extend({
    file: z.any(),
    maskData: z.string(),
  });

// Schema for credit purchase
export const insertTransactionSchema = createInsertSchema(transactions)
  .pick({ credits: true })
  .extend({
    credits: z.number().min(1, "Must purchase at least 1 credit"),
  });

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type Image = typeof images.$inferSelect;
export type InsertImage = z.infer<typeof insertImageSchema>;
export type Transaction = typeof transactions.$inferSelect;
export type InsertTransaction = z.infer<typeof insertTransactionSchema>;

export const insertAdminSchema = createInsertSchema(admins)
  .pick({ email: true, password: true });