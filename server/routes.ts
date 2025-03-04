import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertVendorSchema, insertDealSchema, insertQuotationSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Vendor routes
  app.post("/api/vendors", async (req, res) => {
    try {
      const vendor = insertVendorSchema.parse(req.body);
      const existing = await storage.getVendorByWhatsapp(vendor.whatsappNumber);
      if (existing) {
        return res.status(400).json({ message: "Vendor already exists" });
      }
      const created = await storage.createVendor(vendor);
      res.json(created);
    } catch (e) {
      if (e instanceof z.ZodError) {
        return res.status(400).json({ message: e.errors[0].message });
      }
      throw e;
    }
  });

  app.get("/api/vendors", async (_req, res) => {
    const vendors = await storage.listVendors();
    res.json(vendors);
  });

  app.get("/api/vendors/:id", async (req, res) => {
    const vendor = await storage.getVendor(Number(req.params.id));
    if (!vendor) {
      return res.status(404).json({ message: "Vendor not found" });
    }
    res.json(vendor);
  });

  // Deal routes
  app.post("/api/deals", async (req, res) => {
    try {
      const deal = insertDealSchema.parse(req.body);
      const vendor = await storage.getVendor(deal.vendorId);
      if (!vendor) {
        return res.status(400).json({ message: "Vendor not found" });
      }
      const created = await storage.createDeal(deal);
      res.json(created);
    } catch (e) {
      if (e instanceof z.ZodError) {
        return res.status(400).json({ message: e.errors[0].message });
      }
      throw e;
    }
  });

  app.get("/api/deals", async (req, res) => {
    const vendorId = req.query.vendorId ? Number(req.query.vendorId) : undefined;
    const deals = await storage.listDeals(vendorId);
    res.json(deals);
  });

  // Quotation routes
  app.post("/api/quotations", async (req, res) => {
    try {
      const quotation = insertQuotationSchema.parse(req.body);
      const deal = await storage.getDeal(quotation.dealId);
      if (!deal) {
        return res.status(400).json({ message: "Deal not found" });
      }
      
      // Mock AI negotiation logic
      const basePrice = deal.basePrice;
      const minPrice = deal.minPrice;
      const negotiatedPrice = Math.floor((basePrice + minPrice) / 2);
      const aiNotes = `Negotiated from ${basePrice} to ${negotiatedPrice} based on market analysis`;
      
      const created = await storage.createQuotation({
        ...quotation,
        negotiatedPrice,
        aiNotes,
        status: "pending"
      });
      res.json(created);
    } catch (e) {
      if (e instanceof z.ZodError) {
        return res.status(400).json({ message: e.errors[0].message });
      }
      throw e;
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
