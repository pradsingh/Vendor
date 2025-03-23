import { HomeButton } from "@/components/home-button";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MapPin, Clock, Tag, ShoppingBag, Car, Wrench } from "lucide-react";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";

export default function Deals() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedDeal, setSelectedDeal] = useState(null);
  const [showDealDialog, setShowDealDialog] = useState(false);
  
  // Mock data for deals with Indian currency
  const sampleDeals = [
    {
      id: "deal-1",
      title: "Monsoon Ready Tyre Package",
      description: "Complete set of 4 premium grip tyres with free alignment & balancing",
      price: 1299900, // in paise (₹12,999)
      discountedPrice: 999900, // in paise (₹9,999)
      discountPercentage: 23,
      vendor: "Super Tyre House",
      location: "Delhi NCR",
      category: "tires",
      endDate: "2025-05-15",
      rating: 4.7,
      reviewCount: 42,
      specifications: [
        "All-weather premium grip tyres",
        "Suitable for all Indian roads",
        "1-year warranty against manufacturing defects",
        "Free wheel alignment and balancing",
        "Installation at service center or your location"
      ],
      contactPhone: "+91 98765 43210"
    },
    {
      id: "deal-2",
      title: "Ultra Premium Alloy Wheels",
      description: "Imported alloy wheels with lifetime warranty and free installation",
      price: 2499900, // in paise (₹24,999)
      discountedPrice: 1899900, // in paise (₹18,999)
      discountPercentage: 24,
      vendor: "Super Tyre House",
      location: "Delhi NCR",
      category: "wheels",
      endDate: "2025-06-30",
      rating: 4.9,
      reviewCount: 18,
      specifications: [
        "Imported premium alloy wheels",
        "Available in 15-inch to 19-inch sizes",
        "Lifetime warranty against manufacturing defects",
        "Free installation and balancing",
        "Complimentary periodic maintenance check"
      ],
      contactPhone: "+91 98765 43210"
    },
    {
      id: "deal-3",
      title: "Basic Tyre Replacement",
      description: "Budget-friendly tyre replacement for all small cars",
      price: 699900, // in paise (₹6,999)
      discountedPrice: 599900, // in paise (₹5,999)
      discountPercentage: 14,
      vendor: "Super Tyre House",
      location: "Delhi NCR",
      category: "tires",
      endDate: "2025-04-30",
      rating: 4.5,
      reviewCount: 76,
      specifications: [
        "Economy range tyres for daily use",
        "Suitable for city driving conditions",
        "6-month warranty",
        "Free installation",
        "Available for all small car models"
      ],
      contactPhone: "+91 98765 43210"
    },
    {
      id: "deal-4",
      title: "Premium Car Service",
      description: "Full car service with engine oil change and complete health checkup",
      price: 499900, // in paise (₹4,999)
      discountedPrice: 399900, // in paise (₹3,999)
      discountPercentage: 20,
      vendor: "Auto Care Solutions",
      location: "Mumbai",
      category: "service",
      endDate: "2025-04-15",
      rating: 4.2,
      reviewCount: 31,
      specifications: [
        "Complete engine oil change with premium oil",
        "Multi-point comprehensive vehicle check",
        "Air filter cleaning/replacement",
        "Brake inspection and service",
        "Electronic diagnostics and report"
      ],
      contactPhone: "+91 99876 54321"
    },
    {
      id: "deal-5",
      title: "Ceramic Coating Package",
      description: "Long-lasting premium ceramic coating for your vehicle with 3-year warranty",
      price: 1499900, // in paise (₹14,999)
      discountedPrice: 1199900, // in paise (₹11,999)
      discountPercentage: 20,
      vendor: "Shine Auto Spa",
      location: "Bangalore",
      category: "detailing",
      endDate: "2025-05-20",
      rating: 4.8,
      reviewCount: 23,
      specifications: [
        "9H hardness ceramic coating",
        "UV and weather protection",
        "Hydrophobic water-repellent properties",
        "3-year warranty with annual maintenance",
        "Complimentary interior detailing"
      ],
      contactPhone: "+91 97654 32109"
    },
    {
      id: "deal-6",
      title: "Car Battery Replacement",
      description: "Premium car battery with 5-year warranty and free installation",
      price: 899900, // in paise (₹8,999)
      discountedPrice: 749900, // in paise (₹7,499)
      discountPercentage: 17,
      vendor: "PowerTech Batteries",
      location: "Hyderabad",
      category: "accessories",
      endDate: "2025-06-10",
      rating: 4.6,
      reviewCount: 54,
      specifications: [
        "Maintenance-free premium battery",
        "5-year comprehensive warranty",
        "Free installation at your location",
        "Old battery exchange available",
        "24/7 emergency service"
      ],
      contactPhone: "+91 96543 21098"
    },
  ];

  // Filter deals based on selected category
  const filteredDeals = selectedCategory === "all" 
    ? sampleDeals 
    : sampleDeals.filter(deal => deal.category === selectedCategory);

  // Format price from paise to rupees with commas (Indian format)
  const formatPrice = (priceInPaise) => {
    return "₹" + (priceInPaise / 100).toLocaleString('en-IN');
  };

  // Calculate days remaining until deal ends
  const getDaysRemaining = (endDateStr) => {
    const endDate = new Date(endDateStr);
    const today = new Date();
    const diffTime = endDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  // Handle view deal click
  const handleViewDeal = (deal) => {
    setSelectedDeal(deal);
    setShowDealDialog(true);
  };

  // Get icon for category
  const getCategoryIcon = (category) => {
    switch(category) {
      case "tires":
        return <div className="rounded-full bg-blue-100 p-2"><Car className="h-5 w-5 text-blue-600" /></div>;
      case "wheels":
        return <div className="rounded-full bg-purple-100 p-2"><Clock className="h-5 w-5 text-purple-600" /></div>;
      case "service":
        return <div className="rounded-full bg-green-100 p-2"><Wrench className="h-5 w-5 text-green-600" /></div>;
      default:
        return <div className="rounded-full bg-gray-100 p-2"><ShoppingBag className="h-5 w-5 text-gray-600" /></div>;
    }
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
        
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Exclusive Automotive Deals
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Discover the best automotive deals from trusted vendors across India. 
            Save on tires, accessories, and services for your vehicle.
          </p>
        </div>
        
        {/* Category Tabs */}
        <Tabs 
          defaultValue="all" 
          className="mb-8"
          onValueChange={setSelectedCategory}
        >
          <div className="flex justify-center">
            <TabsList className="grid grid-cols-6 w-full max-w-2xl">
              <TabsTrigger value="all">All Deals</TabsTrigger>
              <TabsTrigger value="tires">Tires</TabsTrigger>
              <TabsTrigger value="wheels">Wheels</TabsTrigger>
              <TabsTrigger value="service">Service</TabsTrigger>
              <TabsTrigger value="detailing">Detailing</TabsTrigger>
              <TabsTrigger value="accessories">Accessories</TabsTrigger>
            </TabsList>
          </div>
          
          {/* Single TabsContent that displays filtered content */}
          <TabsContent value={selectedCategory} className="mt-8">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredDeals.map((deal) => (
                <Card key={deal.id} className="border-0 shadow-lg bg-white/90 backdrop-blur overflow-hidden flex flex-col">
                  {/* Deal Image (replaced with gradient placeholder) */}
                  <div className="h-48 bg-gradient-to-r from-blue-100 to-purple-100 flex items-center justify-center">
                    {getCategoryIcon(deal.category)}
                  </div>
                  
                  <div className="p-6 flex flex-col flex-grow">
                    {/* Deal Header */}
                    <div className="mb-4">
                      <h2 className="text-xl font-bold mb-1">{deal.title}</h2>
                      <p className="text-muted-foreground text-sm">{deal.description}</p>
                    </div>
                    
                    {/* Price Information */}
                    <div className="mb-4">
                      <div className="flex items-baseline gap-2">
                        <span className="text-2xl font-bold text-blue-600">
                          {formatPrice(deal.discountedPrice)}
                        </span>
                        <span className="text-muted-foreground line-through">
                          {formatPrice(deal.price)}
                        </span>
                        <span className="bg-red-100 text-red-800 px-2 py-0.5 rounded-full text-xs font-medium">
                          {deal.discountPercentage}% OFF
                        </span>
                      </div>
                      <div className="flex items-center mt-1">
                        <Tag className="h-4 w-4 mr-1 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">
                          Deal ends in {getDaysRemaining(deal.endDate)} days
                        </span>
                      </div>
                    </div>
                    
                    {/* Vendor Information */}
                    <div className="flex items-center mb-4">
                      <div className="h-8 w-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white font-bold mr-2">
                        {deal.vendor.charAt(0)}
                      </div>
                      <div>
                        <p className="font-medium">{deal.vendor}</p>
                        <div className="flex items-center text-xs text-muted-foreground">
                          <MapPin className="h-3 w-3 mr-1" />
                          <span>{deal.location}</span>
                          <span className="mx-1">•</span>
                          <div className="flex items-center">
                            <span className="text-yellow-500">★</span>
                            <span className="ml-1">{deal.rating}</span>
                            <span className="ml-1">({deal.reviewCount})</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Action Button */}
                    <div className="mt-auto">
                      <Button 
                        className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
                        onClick={() => handleViewDeal(deal)}
                      >
                        <ShoppingBag className="mr-2 h-4 w-4" />
                        View Deal
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
        
        {/* If no deals in the selected category */}
        {filteredDeals.length === 0 && (
          <div className="text-center py-16">
            <p className="text-xl text-muted-foreground">No deals found in this category.</p>
            <Button 
              className="mt-4 bg-gradient-to-r from-blue-600 to-purple-600"
              onClick={() => setSelectedCategory("all")}
            >
              View All Deals
            </Button>
          </div>
        )}
      </div>

      {/* Deal Detail Dialog */}
      {selectedDeal && (
        <Dialog open={showDealDialog} onOpenChange={setShowDealDialog}>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle className="text-xl">{selectedDeal.title}</DialogTitle>
              <DialogDescription className="text-sm">
                By {selectedDeal.vendor} • {selectedDeal.location}
              </DialogDescription>
            </DialogHeader>
            
            <div className="py-4">
              {/* Deal Showcase */}
              <div className="h-48 bg-gradient-to-r from-blue-100 to-purple-100 flex items-center justify-center mb-4 rounded-md">
                {getCategoryIcon(selectedDeal.category)}
              </div>
              
              {/* Price Information */}
              <div className="mb-6">
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold text-blue-600">
                    {formatPrice(selectedDeal.discountedPrice)}
                  </span>
                  <span className="text-muted-foreground line-through">
                    {formatPrice(selectedDeal.price)}
                  </span>
                  <span className="bg-red-100 text-red-800 px-2 py-0.5 rounded-full text-xs font-medium">
                    {selectedDeal.discountPercentage}% OFF
                  </span>
                </div>
                <div className="flex items-center mt-1">
                  <Tag className="h-4 w-4 mr-1 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">
                    Deal ends in {getDaysRemaining(selectedDeal.endDate)} days
                  </span>
                </div>
              </div>
              
              {/* Description */}
              <div className="mb-4">
                <h3 className="font-medium mb-2">Description</h3>
                <p className="text-muted-foreground">{selectedDeal.description}</p>
              </div>
              
              {/* Specifications */}
              <div className="mb-4">
                <h3 className="font-medium mb-2">Specifications</h3>
                <ul className="list-disc pl-5 text-muted-foreground space-y-1">
                  {selectedDeal.specifications.map((spec, index) => (
                    <li key={index}>{spec}</li>
                  ))}
                </ul>
              </div>
              
              {/* Contact Information */}
              <div>
                <h3 className="font-medium mb-2">Contact Information</h3>
                <p className="text-muted-foreground">{selectedDeal.contactPhone}</p>
              </div>
            </div>
            
            <DialogFooter className="flex justify-between items-center sm:justify-between">
              <div className="flex items-center">
                <span className="text-yellow-500 mr-1">★</span>
                <span>{selectedDeal.rating}</span>
                <span className="ml-1 text-muted-foreground">({selectedDeal.reviewCount} reviews)</span>
              </div>
              <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white">
                Claim Deal
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}