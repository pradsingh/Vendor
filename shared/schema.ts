import { pgTable, text, serial, integer, jsonb, timestamp, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const vendors = pgTable("vendors", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  whatsappNumber: text("whatsapp_number").notNull().unique(),
  whatsappNegotiationNumber: text("whatsapp_negotiation_number").notNull().default(''),
  whatsappBookingNumber: text("whatsapp_booking_number").notNull().default(''),
  businessType: text("business_type").notNull(),
  googleListingUrl: text("google_listing_url").notNull().default(''),
  justDialUrl: text("just_dial_url").notNull().default(''),
  bargainLevel: text("bargain_level").notNull(),
  maxDiscountThreshold: integer("max_discount_threshold").notNull().default(0),
  thresholdAmount: integer("threshold_amount").notNull().default(0),
  verified: boolean("verified").default(false),
});

export const deals = pgTable("deals", {
  id: serial("id").primaryKey(),
  vendorId: integer("vendor_id").notNull(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  basePrice: integer("base_price").notNull(),
  minPrice: integer("min_price").notNull(),
  maxPrice: integer("max_price").notNull(),
  active: boolean("active").default(true),
});

export const quotations = pgTable("quotations", {
  id: serial("id").primaryKey(),
  dealId: integer("deal_id").notNull(),
  negotiatedPrice: integer("negotiated_price").notNull(),
  aiNotes: text("ai_notes").notNull().default(''),
  status: text("status").notNull(), // pending, accepted, rejected
});

export const insertVendorSchema = createInsertSchema(vendors).pick({
  name: true,
  whatsappNumber: true,
  whatsappNegotiationNumber: true,
  whatsappBookingNumber: true,
  businessType: true,
  googleListingUrl: true,
  justDialUrl: true,
  bargainLevel: true,
  maxDiscountThreshold: true,
  thresholdAmount: true,
}).extend({
  whatsappNumber: z.string().regex(/^\+[1-9]\d{1,14}$/, "Invalid WhatsApp number"),
  whatsappNegotiationNumber: z.string().regex(/^\+[1-9]\d{1,14}$/, "Invalid WhatsApp number").optional(),
  whatsappBookingNumber: z.string().regex(/^\+[1-9]\d{1,14}$/, "Invalid WhatsApp number").optional(),
  bargainLevel: z.enum(["NO_BARGAIN", "LOW_BARGAIN", "MEDIUM_BARGAIN"]),
  googleListingUrl: z.string().url("Invalid Google listing URL").optional(),
  justDialUrl: z.string().url("Invalid JustDial URL").optional(),
  maxDiscountThreshold: z.number().min(0).max(100).optional(),
  thresholdAmount: z.number().min(0).optional(),
});

export const insertDealSchema = createInsertSchema(deals).pick({
  vendorId: true,
  title: true,
  description: true,
  basePrice: true,
  minPrice: true,
  maxPrice: true,
});

export const insertQuotationSchema = createInsertSchema(quotations).pick({
  dealId: true,
  negotiatedPrice: true,
  aiNotes: true,
  status: true,
});

export type InsertVendor = z.infer<typeof insertVendorSchema>;
export type InsertDeal = z.infer<typeof insertDealSchema>;
export type InsertQuotation = z.infer<typeof insertQuotationSchema>;

export type Vendor = typeof vendors.$inferSelect;
export type Deal = typeof deals.$inferSelect;
export type Quotation = typeof quotations.$inferSelect;