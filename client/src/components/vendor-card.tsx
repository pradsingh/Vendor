import { type Vendor } from "@shared/schema";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Store, Phone } from "lucide-react";

interface VendorCardProps {
  vendor: Vendor;
}

export default function VendorCard({ vendor }: VendorCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Store className="h-5 w-5" />
          {vendor.name}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-2 text-muted-foreground">
          <Phone className="h-4 w-4" />
          {vendor.whatsappNumber}
        </div>
        <p className="mt-2 text-sm">
          Business Type: {vendor.businessType}
        </p>
        {vendor.verified && (
          <span className="inline-block mt-2 px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">
            Verified Vendor
          </span>
        )}
      </CardContent>
    </Card>
  );
}
