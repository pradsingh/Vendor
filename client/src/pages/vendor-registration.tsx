import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";
import { insertVendorSchema, type InsertVendor } from "@shared/schema";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { apiRequest } from "@/lib/queryClient";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";

export default function VendorRegistration() {
  const { toast } = useToast();
  const [, setLocation] = useLocation();

  const form = useForm<InsertVendor>({
    resolver: zodResolver(insertVendorSchema),
    defaultValues: {
      name: "",
      whatsappNumber: "",
      whatsappNegotiationNumber: "",
      whatsappBookingNumber: "",
      businessType: "",
      googleListingUrl: "",
      justDialUrl: "",
      bargainLevel: "NO_BARGAIN",
      maxDiscountThreshold: 0,
      thresholdAmount: 0,
      negotiationDescription: "",
    },
  });

  const registerMutation = useMutation({
    mutationFn: async (data: InsertVendor) => {
      const res = await apiRequest("POST", "/api/vendors", data);
      return res.json();
    },
    onSuccess: () => {
      toast({
        title: "Registration successful",
        description: "You can now start posting deals",
      });
      setLocation("/dashboard");
    },
    onError: (error: Error) => {
      toast({
        title: "Registration failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4">
        <div className="flex justify-center mb-8">
          <img
            src="attached_assets/473401005_1684307442443812_4879780615142385148_n.jpg"
            alt="Xinacle Logo"
            className="h-12"
          />
        </div>
        <h1 className="text-3xl font-bold text-center mb-8">Vendor Registration</h1>

        <Card className="max-w-2xl mx-auto">
          <CardContent className="pt-6">
            <Form {...form}>
              <form onSubmit={form.handleSubmit((data) => registerMutation.mutate(data))} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Business Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter your business name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="businessType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Business Type</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="e.g. Retail, Services, Food"
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="whatsappNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Primary WhatsApp Number</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="+1234567890"
                            type="tel"
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="whatsappNegotiationNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Negotiation WhatsApp Number</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="+1234567890 (Optional)"
                            type="tel"
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="whatsappBookingNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Booking WhatsApp Number</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="+1234567890 (Optional)"
                          type="tel"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="googleListingUrl"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Google Business Listing URL</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="https://google.com/business/..."
                            type="url"
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="justDialUrl"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>JustDial Listing URL</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="https://justdial.com/..."
                            type="url"
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="space-y-4 p-4 bg-secondary/10 rounded-lg">
                  <h3 className="font-semibold">Negotiation Settings</h3>

                  <FormField
                    control={form.control}
                    name="negotiationDescription"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Negotiation Approach</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Describe your typical negotiation process and bargaining techniques..."
                            className="min-h-[100px]"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Explain how you typically negotiate with customers and what factors influence your bargaining decisions
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="bargainLevel"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Bargaining Level</FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select bargaining level" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="NO_BARGAIN">No Bargain</SelectItem>
                            <SelectItem value="LOW_BARGAIN">Low Bargain</SelectItem>
                            <SelectItem value="MEDIUM_BARGAIN">Medium Bargain</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="maxDiscountThreshold"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Maximum Discount (%)</FormLabel>
                          <FormControl>
                            <Input 
                              type="number"
                              min="0"
                              max="100"
                              {...field}
                              onChange={e => field.onChange(Number(e.target.value))}
                            />
                          </FormControl>
                          <FormDescription>
                            Maximum discount percentage you're willing to offer
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="thresholdAmount"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Threshold Amount ($)</FormLabel>
                          <FormControl>
                            <Input 
                              type="number"
                              min="0"
                              {...field}
                              onChange={e => field.onChange(Number(e.target.value))}
                            />
                          </FormControl>
                          <FormDescription>
                            Order amount above which special discounts apply
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                <Button 
                  type="submit" 
                  className="w-full"
                  disabled={registerMutation.isPending}
                >
                  {registerMutation.isPending ? "Registering..." : "Register"}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}