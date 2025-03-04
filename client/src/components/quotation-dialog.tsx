import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { type Deal, type Vendor, type InsertQuotation } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { apiRequest } from "@/lib/queryClient";
import { MessagesSquare, Bot, ArrowRight } from "lucide-react";

interface QuotationDialogProps {
  deal: Deal;
  vendor?: Vendor;
}

export default function QuotationDialog({ deal, vendor }: QuotationDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();

  const quotationMutation = useMutation({
    mutationFn: async () => {
      const quotation: Partial<InsertQuotation> = {
        dealId: deal.id,
        status: "pending",
      };
      const res = await apiRequest("POST", "/api/quotations", quotation);
      return res.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Quotation Generated",
        description: `AI negotiated price: $${data.negotiatedPrice}`,
      });
      setIsOpen(false);
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to generate quotation",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          Get Quote
          <MessagesSquare className="ml-2 h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>AI Negotiation</DialogTitle>
        </DialogHeader>

        <div className="py-6">
          <div className="flex items-center gap-4 mb-6">
            <img
              src={vendor?.id ? "https://images.unsplash.com/photo-1600880292203-757bb62b4baf" : "https://images.unsplash.com/photo-1520333789090-1afc82db536a"}
              alt="Vendor"
              className="w-16 h-16 rounded-full object-cover"
            />
            <div>
              <h3 className="font-semibold">{vendor?.name || "Vendor"}</h3>
              <p className="text-sm text-muted-foreground">{deal.title}</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-secondary rounded-lg">
              <div className="flex items-center gap-2">
                <Bot className="h-5 w-5 text-primary" />
                <span>Base Price</span>
              </div>
              <span className="font-semibold">${deal.basePrice}</span>
            </div>

            <div className="flex items-center justify-center">
              <ArrowRight className="h-6 w-6 text-muted-foreground" />
            </div>

            <div className="flex items-center justify-between p-3 bg-primary/10 rounded-lg">
              <div className="flex items-center gap-2">
                <Bot className="h-5 w-5 text-primary" />
                <span>AI will negotiate between</span>
              </div>
              <span className="font-semibold">
                ${deal.minPrice} - ${deal.maxPrice}
              </span>
            </div>
          </div>

          <Button
            className="w-full mt-6"
            onClick={() => quotationMutation.mutate()}
            disabled={quotationMutation.isPending}
          >
            {quotationMutation.isPending ? (
              "Negotiating..."
            ) : (
              <>
                Start AI Negotiation
                <Bot className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}