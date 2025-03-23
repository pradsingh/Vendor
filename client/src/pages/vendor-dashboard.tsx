import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { type Deal } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import DealForm from "@/components/deal-form";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Calendar, Users, MapPin, Clock } from "lucide-react";
import { HomeButton } from "@/components/home-button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function VendorDashboard() {
  const [showDealForm, setShowDealForm] = useState(false);
  
  // Mock vendor data - in a real app, this would come from authentication/context
  const vendorData = {
    id: "vendor-123",
    name: "Super Tyre House",
    location: "Delhi NCR",
    category: "Automotive",
    activeDeals: 7,
    totalSales: 12450000, // in paise (₹124,500)
  };

  // Mock deals data specifically for this vendor
  const mockDeals = [
    {
      id: "deal-1",
      title: "Monsoon Ready Tyre Package",
      description: "Complete set of 4 premium grip tyres with free alignment & balancing",
      basePrice: 1299900, // in paise (₹12,999)
      minPrice: 1199900, // in paise (₹11,999)
      maxPrice: 1399900, // in paise (₹13,999)
      active: true,
      targetAudience: "Car owners in Delhi NCR",
      startDate: "2025-04-01",
      endDate: "2025-05-15",
      redemptions: 23,
      impressions: 456,
    },
    {
      id: "deal-2",
      title: "Ultra Premium Alloy Wheels",
      description: "Imported alloy wheels with lifetime warranty and free installation",
      basePrice: 2499900, // in paise (₹24,999)
      minPrice: 2299900, // in paise (₹22,999)
      maxPrice: 2699900, // in paise (₹26,999)
      active: true,
      targetAudience: "Luxury car owners",
      startDate: "2025-03-15",
      endDate: "2025-06-30",
      redemptions: 8,
      impressions: 189,
    },
    {
      id: "deal-3",
      title: "Basic Tyre Replacement",
      description: "Budget-friendly tyre replacement for all small cars",
      basePrice: 699900, // in paise (₹6,999)
      minPrice: 649900, // in paise (₹6,499)
      maxPrice: 749900, // in paise (₹7,499)
      active: false,
      targetAudience: "Budget car owners in Delhi",
      startDate: "2025-01-01",
      endDate: "2025-02-28",
      redemptions: 45,
      impressions: 892,
    },
  ];

  // In a real application, this would fetch from an API
  const dealsQuery = {
    data: mockDeals,
    isLoading: false,
    error: null,
  };

  // Format price from paise to rupees with commas
  const formatPrice = (priceInPaise) => {
    return "₹" + (priceInPaise / 100).toLocaleString('en-IN');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/5 to-background p-8">
      <HomeButton />
      <div className="container mx-auto px-4">
        <div className="flex justify-center mb-8">
          <img
            src="/assets/Xinacle_Logo.jpg"
            alt="Xinacle Logo"
            className="h-16 object-contain"
          />
        </div>
        
        {/* Vendor Header Card */}
        <Card className="max-w-4xl mx-auto border-0 shadow-lg bg-white/80 backdrop-blur mb-6">
          <CardContent className="p-6">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  {vendorData.name}
                </h1>
                <div className="flex items-center mt-2 text-muted-foreground">
                  <MapPin className="h-4 w-4 mr-1" />
                  <span>{vendorData.location}</span>
                  <span className="mx-2">•</span>
                  <span>{vendorData.category}</span>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-muted-foreground">Total Sales</p>
                <p className="text-xl font-bold">{formatPrice(vendorData.totalSales)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Dashboard Content */}
        <Card className="max-w-4xl mx-auto border-0 shadow-lg bg-white/80 backdrop-blur">
          <CardContent className="p-8">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-bold">Manage Deals</h2>
              <Dialog open={showDealForm} onOpenChange={setShowDealForm}>
                <DialogTrigger asChild>
                  <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white">
                    <Plus className="mr-2 h-4 w-4" />
                    New Deal
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-3xl">
                  <AdvancedDealForm onSuccess={() => setShowDealForm(false)} />
                </DialogContent>
              </Dialog>
            </div>

            <Tabs defaultValue="active" className="mb-6">
              <TabsList>
                <TabsTrigger value="active">Active Deals</TabsTrigger>
                <TabsTrigger value="inactive">Inactive Deals</TabsTrigger>
                <TabsTrigger value="all">All Deals</TabsTrigger>
              </TabsList>
              
              <TabsContent value="active" className="mt-4">
                <DealsList 
                  deals={dealsQuery.data.filter(deal => deal.active)} 
                  formatPrice={formatPrice} 
                />
              </TabsContent>
              
              <TabsContent value="inactive" className="mt-4">
                <DealsList 
                  deals={dealsQuery.data.filter(deal => !deal.active)} 
                  formatPrice={formatPrice} 
                />
              </TabsContent>
              
              <TabsContent value="all" className="mt-4">
                <DealsList 
                  deals={dealsQuery.data} 
                  formatPrice={formatPrice} 
                />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// Component for displaying the list of deals
function DealsList({ deals, formatPrice }) {
  if (deals.length === 0) {
    return <p className="text-center text-muted-foreground py-8">No deals found in this category.</p>;
  }

  return (
    <div className="grid md:grid-cols-2 gap-6">
      {deals.map((deal) => (
        <Card key={deal.id} className="border-0 shadow-md overflow-hidden">
          <div className={`h-2 ${deal.active ? "bg-green-500" : "bg-gray-400"}`}></div>
          <CardContent className="p-6">
            <h3 className="text-lg font-bold mb-1">{deal.title}</h3>
            <p className="text-muted-foreground mb-4 text-sm">{deal.description}</p>
            
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <p className="text-xs text-muted-foreground">Base Price</p>
                <p className="font-semibold">{formatPrice(deal.basePrice)}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Negotiable Range</p>
                <p className="font-semibold">
                  {formatPrice(deal.minPrice)} - {formatPrice(deal.maxPrice)}
                </p>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
              <div className="flex items-center">
                <Calendar className="h-3 w-3 mr-1 text-muted-foreground" />
                <span>{new Date(deal.startDate).toLocaleDateString('en-IN')} - {new Date(deal.endDate).toLocaleDateString('en-IN')}</span>
              </div>
              <div className="flex items-center">
                <Users className="h-3 w-3 mr-1 text-muted-foreground" />
                <span>{deal.targetAudience}</span>
              </div>
            </div>
            
            <div className="flex justify-between items-center mt-4">
              <div className="flex space-x-1">
                <span className="inline-block px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                  {deal.redemptions} Redemptions
                </span>
                <span className="inline-block px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-xs">
                  {deal.impressions} Views
                </span>
              </div>
              <Button variant="outline" size="sm">
                Edit Deal
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

// Advanced Deal Form Component with campaign-like targeting options
function AdvancedDealForm({ onSuccess }) {
  // This would be a functional form in a real application
  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-6">Create New Deal Campaign</h2>
      
      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Deal Title</label>
            <input type="text" className="w-full p-2 border rounded" placeholder="Monsoon Tyre Special Offer" />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <textarea className="w-full p-2 border rounded min-h-20" placeholder="Describe your offer in detail"></textarea>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Base Price (₹)</label>
              <input type="number" className="w-full p-2 border rounded" placeholder="12999" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Deal Type</label>
              <select className="w-full p-2 border rounded">
                <option>Fixed Price</option>
                <option>Percentage Discount</option>
                <option>Buy One Get One</option>
              </select>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Min Price (₹)</label>
              <input type="number" className="w-full p-2 border rounded" placeholder="11999" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Max Price (₹)</label>
              <input type="number" className="w-full p-2 border rounded" placeholder="13999" />
            </div>
          </div>
        </div>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Campaign Duration</label>
            <div className="grid grid-cols-2 gap-4">
              <input type="date" className="w-full p-2 border rounded" />
              <input type="date" className="w-full p-2 border rounded" />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Target Audience</label>
            <select className="w-full p-2 border rounded mb-2">
              <option>All Customers</option>
              <option>Previous Customers</option>
              <option>New Customers</option>
            </select>
            <input type="text" className="w-full p-2 border rounded" placeholder="Specific audience details (e.g., Car owners in Delhi NCR)" />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Location Targeting</label>
            <select className="w-full p-2 border rounded">
              <option>Delhi NCR</option>
              <option>Mumbai</option>
              <option>Bangalore</option>
              <option>All India</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Budget Allocation</label>
            <input type="number" className="w-full p-2 border rounded" placeholder="Budget in ₹" />
          </div>
        </div>
      </div>
      
      <div className="mt-6 pt-4 border-t flex justify-end gap-2">
        <Button variant="outline" onClick={() => onSuccess()}>Cancel</Button>
        <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white">
          Create Deal Campaign
        </Button>
      </div>
    </div>
  );
}