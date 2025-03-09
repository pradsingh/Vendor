
import { NegotiationOptions } from "@/components/negotiation-options";

export interface NegotiationResult {
  success: boolean;
  negotiatedItems: {
    availability?: string;
    discount?: string;
    extraServices?: string[];
  };
  message: string;
}

export async function negotiateService(
  serviceId: string, 
  options: NegotiationOptions
): Promise<NegotiationResult> {
  // Simulate API call with delay
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // Mock negotiation results
  const result: NegotiationResult = {
    success: true,
    negotiatedItems: {},
    message: "Successfully negotiated!",
  };
  
  // Generate mock results based on selected options
  if (options.negotiateAvailability) {
    // Generate improved availability (earlier time)
    const minutes = Math.floor(Math.random() * 15) + 5; // 5-20 minutes 
    result.negotiatedItems.availability = `${minutes} mins`;
  }
  
  if (options.negotiateDiscount) {
    // Generate better discount
    const discountPercentage = Math.floor(Math.random() * 15) + 5; // 5-20% discount
    result.negotiatedItems.discount = `${discountPercentage}%`;
  }
  
  if (options.negotiateExtraService) {
    // Mock extra services
    const possibleExtras = [
      "Free inspection",
      "Extended warranty",
      "Priority support",
      "Complimentary maintenance check",
      "Free follow-up visit",
      "Discounted parts"
    ];
    
    // Select 1-2 random extra services
    const extraCount = Math.floor(Math.random() * 2) + 1;
    const extraServices: string[] = [];
    
    for (let i = 0; i < extraCount; i++) {
      const randomIndex = Math.floor(Math.random() * possibleExtras.length);
      const service = possibleExtras[randomIndex];
      extraServices.push(service);
      possibleExtras.splice(randomIndex, 1); // Remove selected service
    }
    
    result.negotiatedItems.extraServices = extraServices;
  }
  
  // Create appropriate message based on negotiation
  const messages: string[] = [];
  
  if (options.negotiateAvailability && result.negotiatedItems.availability) {
    // Extract minutes from availability string to make message more realistic
    const availMins = result.negotiatedItems.availability.match(/\d+/)?.[0] || "30";
    messages.push(`I've negotiated priority service - they can arrive in ${availMins} minutes`);
  }
  
  if (options.negotiateDiscount && result.negotiatedItems.discount) {
    messages.push(`Special discount of ${result.negotiatedItems.discount} applied exclusively for you`);
  }
  
  if (options.negotiateExtraService && result.negotiatedItems.extraServices?.length) {
    messages.push(`Secured complimentary extras: ${result.negotiatedItems.extraServices.join(", ")}`);
  }
  
  result.message = messages.length ? messages.join(". ") : "Successfully negotiated a better deal for you!";
  
  return result;
}
