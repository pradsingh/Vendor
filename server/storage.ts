import { vendors, deals, quotations, type Vendor, type Deal, type Quotation, type InsertVendor, type InsertDeal, type InsertQuotation } from "@shared/schema";

export interface IStorage {
  // Vendor operations
  getVendor(id: number): Promise<Vendor | undefined>;
  getVendorByWhatsapp(whatsapp: string): Promise<Vendor | undefined>;
  createVendor(vendor: InsertVendor): Promise<Vendor>;
  listVendors(): Promise<Vendor[]>;
  
  // Deal operations
  createDeal(deal: InsertDeal): Promise<Deal>;
  getDeal(id: number): Promise<Deal | undefined>;
  listDeals(vendorId?: number): Promise<Deal[]>;
  
  // Quotation operations
  createQuotation(quotation: InsertQuotation): Promise<Quotation>;
  getQuotation(id: number): Promise<Quotation | undefined>;
  listQuotations(dealId: number): Promise<Quotation[]>;
}

export class MemStorage implements IStorage {
  private vendors: Map<number, Vendor>;
  private deals: Map<number, Deal>;
  private quotations: Map<number, Quotation>;
  private currentIds: { vendor: number; deal: number; quotation: number };

  constructor() {
    this.vendors = new Map();
    this.deals = new Map();
    this.quotations = new Map();
    this.currentIds = { vendor: 1, deal: 1, quotation: 1 };
  }

  async getVendor(id: number): Promise<Vendor | undefined> {
    return this.vendors.get(id);
  }

  async getVendorByWhatsapp(whatsapp: string): Promise<Vendor | undefined> {
    return Array.from(this.vendors.values()).find(
      (vendor) => vendor.whatsappNumber === whatsapp
    );
  }

  async createVendor(insertVendor: InsertVendor): Promise<Vendor> {
    const id = this.currentIds.vendor++;
    const vendor: Vendor = { ...insertVendor, id, verified: false };
    this.vendors.set(id, vendor);
    return vendor;
  }

  async listVendors(): Promise<Vendor[]> {
    return Array.from(this.vendors.values());
  }

  async createDeal(insertDeal: InsertDeal): Promise<Deal> {
    const id = this.currentIds.deal++;
    const deal: Deal = { ...insertDeal, id, active: true };
    this.deals.set(id, deal);
    return deal;
  }

  async getDeal(id: number): Promise<Deal | undefined> {
    return this.deals.get(id);
  }

  async listDeals(vendorId?: number): Promise<Deal[]> {
    const deals = Array.from(this.deals.values());
    if (vendorId) {
      return deals.filter((deal) => deal.vendorId === vendorId);
    }
    return deals;
  }

  async createQuotation(insertQuotation: InsertQuotation): Promise<Quotation> {
    const id = this.currentIds.quotation++;
    const quotation: Quotation = { ...insertQuotation, id };
    this.quotations.set(id, quotation);
    return quotation;
  }

  async getQuotation(id: number): Promise<Quotation | undefined> {
    return this.quotations.get(id);
  }

  async listQuotations(dealId: number): Promise<Quotation[]> {
    return Array.from(this.quotations.values()).filter(
      (quotation) => quotation.dealId === dealId
    );
  }
}

export const storage = new MemStorage();
