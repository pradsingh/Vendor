
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Bot } from "lucide-react";

interface NegotiationOptionsProps {
  onSubmit: (options: NegotiationOptions) => void;
  onCancel: () => void;
}

export interface NegotiationOptions {
  negotiateAvailability: boolean;
  negotiateDiscount: boolean;
  negotiateExtraService: boolean;
}

export default function NegotiationOptions({ onSubmit, onCancel }: NegotiationOptionsProps) {
  const [options, setOptions] = useState<NegotiationOptions>({
    negotiateAvailability: false,
    negotiateDiscount: true, // Default to price negotiation
    negotiateExtraService: false,
  });

  const handleOptionChange = (option: keyof NegotiationOptions) => {
    setOptions((prev) => ({
      ...prev,
      [option]: !prev[option],
    }));
  };

  const handleSubmit = () => {
    onSubmit(options);
  };

  return (
    <div className="p-4 bg-card border rounded-lg shadow-sm">
      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <Bot className="h-5 w-5 text-primary" />
        Multi-Vendor Negotiation Options
      </h3>
      
      <p className="text-sm text-muted-foreground mb-4">
        Our AI will negotiate with all selected vendors simultaneously to get you the best deals.
      </p>
      
      <div className="space-y-3 mb-6">
        <div className="flex items-start space-x-2">
          <Checkbox 
            id="availability" 
            checked={options.negotiateAvailability}
            onCheckedChange={() => handleOptionChange('negotiateAvailability')}
          />
          <div className="grid gap-1.5 leading-none">
            <label
              htmlFor="availability"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Priority Availability
            </label>
            <p className="text-sm text-muted-foreground">
              Negotiate for earlier service time
            </p>
          </div>
        </div>
        
        <div className="flex items-start space-x-2">
          <Checkbox 
            id="discount" 
            checked={options.negotiateDiscount}
            onCheckedChange={() => handleOptionChange('negotiateDiscount')}
          />
          <div className="grid gap-1.5 leading-none">
            <label
              htmlFor="discount"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Better Discount
            </label>
            <p className="text-sm text-muted-foreground">
              Try to get a better price on these services
            </p>
          </div>
        </div>
        
        <div className="flex items-start space-x-2">
          <Checkbox 
            id="extras" 
            checked={options.negotiateExtraService}
            onCheckedChange={() => handleOptionChange('negotiateExtraService')}
          />
          <div className="grid gap-1.5 leading-none">
            <label
              htmlFor="extras"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Extra Services
            </label>
            <p className="text-sm text-muted-foreground">
              Request additional complementary services
            </p>
          </div>
        </div>
      </div>
      
      <div className="flex justify-end gap-3">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button 
          onClick={handleSubmit}
          disabled={!options.negotiateAvailability && !options.negotiateDiscount && !options.negotiateExtraService}
        >
          Start Multi-Vendor Negotiation
        </Button>
      </div>
    </div>
  );
}
