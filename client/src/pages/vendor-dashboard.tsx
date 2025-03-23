import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { type Deal } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import DealForm from "@/components/deal-form";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import { HomeButton } from "@/components/home-button";

export default function VendorDashboard() {
  const [showDealForm, setShowDealForm] = useState(false);

  const dealsQuery = useQuery<Deal[]>({
    queryKey: ["/api/deals", 1],
  });

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
        <Card className="max-w-4xl mx-auto border-0 shadow-lg bg-white/80 backdrop-blur">
          <CardContent className="p-8">
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Vendor Dashboard
              </h1>
              <Dialog open={showDealForm} onOpenChange={setShowDealForm}>
                <DialogTrigger asChild>
                  <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white">
                    <Plus className="mr-2 h-4 w-4" />
                    New Deal
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DealForm onSuccess={() => setShowDealForm(false)} />
                </DialogContent>
              </Dialog>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              {dealsQuery.data?.map((deal) => (
                <Card key={deal.id} className="border-0 shadow-md"> {/* Added className for consistency */}
                  <CardContent>
                    <p className="text-muted-foreground mb-4">{deal.description}</p>
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-sm text-muted-foreground">Base Price</p>
                        <p className="font-semibold">${deal.basePrice}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Negotiable Range</p>
                        <p className="font-semibold">
                          ${deal.minPrice} - ${deal.maxPrice}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Status</p>
                        <span className={`inline-block px-2 py-1 rounded-full text-xs ${
                          deal.active ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                        }`}>
                          {deal.active ? "Active" : "Inactive"}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}