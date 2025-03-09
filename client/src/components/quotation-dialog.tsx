import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { type Deal, type Vendor, type InsertQuotation } from "@shared/schema";
import { useToast } from "../hooks/use-toast";
import { Button } from "../components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../components/ui/dialog";
import { apiRequest } from "../lib/queryClient";
import { MessagesSquare, Bot } from "lucide-react";

interface QuotationDialogProps {
  deals: Deal[];
  vendors: Vendor[];
}

export default function QuotationDialog({ deals, vendors }: QuotationDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();
  const [selectedDeals, setSelectedDeals] = useState<Deal[]>([]);
  const [isNegotiated, setIsNegotiated] = useState(false); // Track negotiation status

  const quotationMutation = useMutation({
    mutationFn: async () => {
      const quotations = selectedDeals.map(deal => ({
        dealId: deal.id,
        status: "pending",
      }));

      const res = await apiRequest("POST", "/api/quotations", { quotations });
      return res.json();
    },
    onSuccess: (data) => {
      const successfulNegotiations = data.filter((quote: any) => quote.success);
      toast({
        title: "Quotations Generated",
        description: `${successfulNegotiations.length} quotations were generated.`,
      });
      setIsOpen(false);
      setIsNegotiated(true); // Set negotiation status to true after successful negotiation
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to generate quotations",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleNegotiate = () => {
    if (isNegotiated) {
      toast({
        title: "Negotiation Error",
        description: "You have already initiated a negotiation. You cannot negotiate again.",
        variant: "destructive",
      });
      return;
    }
    quotationMutation.mutate();
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          Get Quotes
          <MessagesSquare className="ml-2 h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>AI Negotiation</DialogTitle>
        </DialogHeader>

        <div className="py-6">
          <div>
            {vendors.map(vendor => (
              <div key={vendor.id} className="flex items-center">
                <input
                  type="checkbox"
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedDeals([...selectedDeals, vendor.id]);
                    } else {
                      setSelectedDeals(selectedDeals.filter(d => d.id !== vendor.id));
                    }
                  }}
                />
                <span className="ml-2">{vendor.name}</span>
              </div>
            ))}
          </div>
          <Button
            className="w-full mt-6"
            onClick={handleNegotiate}
            disabled={quotationMutation.isPending || selectedDeals.length === 0}
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