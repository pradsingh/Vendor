import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { type Deal } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import DealForm from "@/components/deal-form";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus } from "lucide-react";

export default function VendorDashboard() {
  const [showDealForm, setShowDealForm] = useState(false);

  const dealsQuery = useQuery<Deal[]>({
    queryKey: ["/api/deals", 1], // Hard-coded vendor ID for demo
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Vendor Dashboard</h1>
        <Dialog open={showDealForm} onOpenChange={setShowDealForm}>
          <DialogTrigger asChild>
            <Button>
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
          <Card key={deal.id}>
            <CardHeader>
              <CardTitle>{deal.title}</CardTitle>
            </CardHeader>
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
    </div>
  );
}
