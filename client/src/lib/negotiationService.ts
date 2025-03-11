import { NegotiationOptions } from "@/components/negotiation-options";

export interface NegotiationResult {
  success: boolean;
  negotiatedItems: {
    availability?: string;
    discount?: string;
    extraServices?: string[];
  };
  message: string;
  vendorId?: string;
  timestamp?: number;
}

// Mock negotiation service - in a real app, this would make API calls
export async function negotiateWithVendor(
  vendorId: string, 
  options: NegotiationOptions
): Promise<NegotiationResult> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 2000 + Math.random() * 3000));

  // Mock success rate is 85%
  const success = Math.random() > 0.15;

  if (success) {
    return {
      success: true,
      negotiatedItems: {
        availability: options.negotiateAvailability ? "Next 24 hours" : undefined,
        discount: options.negotiateDiscount ? `${Math.floor(Math.random() * 15) + 5}% off` : undefined,
        extraServices: options.negotiateExtraService ? [
          "Free installation", 
          "Extended warranty",
          "Premium support"
        ].slice(0, Math.floor(Math.random() * 3) + 1) : undefined,
      },
      message: "Vendor accepted our offer with better terms!",
      vendorId,
      timestamp: Date.now(),
    };
  } else {
    return {
      success: false,
      negotiatedItems: {},
      message: "Vendor couldn't match our requirements at this time.",
      vendorId,
      timestamp: Date.now(),
    };
  }
}

// Negotiate with multiple vendors simultaneously
export async function negotiateWithMultipleVendors(
  vendorIds: string[],
  options: NegotiationOptions
): Promise<{[key: string]: NegotiationResult}> {
  const negotiations = vendorIds.map(vendorId => 
    negotiateWithVendor(vendorId, options)
      .then(result => ({ vendorId, result }))
  );

  const results = await Promise.all(negotiations);

  const resultMap: {[key: string]: NegotiationResult} = {};
  results.forEach(({ vendorId, result }) => {
    resultMap[vendorId] = result;
  });

  return resultMap;
}