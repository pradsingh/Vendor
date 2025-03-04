import { useQuery } from "@tanstack/react-query";
import { type Deal, type Vendor } from "@shared/schema";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import QuotationDialog from "@/components/quotation-dialog";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState } from "react";

export default function Deals() {
  const [searchTerm, setSearchTerm] = useState("");

  const dealsQuery = useQuery<Deal[]>({
    queryKey: ["/api/deals"],
  });

  const vendorsQuery = useQuery<Vendor[]>({
    queryKey: ["/api/vendors"],
  });

  const filteredDeals = dealsQuery.data?.filter((deal) => {
    const vendor = vendorsQuery.data?.find((v) => v.id === deal.vendorId);
    return (
      deal.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      deal.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vendor?.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Available Deals</h1>

      <div className="relative mb-8">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
        <Input
          className="pl-10"
          placeholder="Search deals..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDeals?.map((deal) => {
          const vendor = vendorsQuery.data?.find((v) => v.id === deal.vendorId);
          return (
            <Card key={deal.id}>
              <CardHeader>
                <CardTitle>{deal.title}</CardTitle>
                <p className="text-sm text-muted-foreground">
                  by {vendor?.name}
                </p>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  {deal.description}
                </p>
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Base Price</p>
                    <p className="font-semibold">${deal.basePrice}</p>
                  </div>
                  <QuotationDialog deal={deal} vendor={vendor} />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
