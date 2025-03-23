import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { z } from "zod";
import { Link } from "wouter";
import { HomeButton } from "@/components/home-button"; // Added HomeButton import


const indianLanguages = [
  "English", "Hindi", "Bengali", "Telugu", "Marathi", "Tamil", "Urdu", "Gujarati",
  "Kannada", "Malayalam", "Odia", "Punjabi", "Assamese", "Maithili"
];

const businessTypes = [
  "Plumber","Tyre Shop", "Electrician", "Transport", "Carpenter", "Painter",
  "Home Cleaning", "Pest Control", "AC Repair", "Car Repair",
  "Real Estate", "Interior Designer", "Construction", "Other"
];

const vendorSchema = z.object({
  businessName: z.string().min(1, "Business name is required"),
  businessType: z.string().min(1, "Business type is required"),
  otherBusinessType: z.string().optional(),
  contactNo: z.string().regex(/^\91[0-9]{10}$/, "Invalid Indian phone number"),
  googleListingUrl: z.string().url("Invalid URL").optional().or(z.literal('')),
  justDialUrl: z.string().url("Invalid URL").optional().or(z.literal('')),
  otherListingUrls: z.string().optional().or(z.literal('')),
  primaryLanguage: z.string().min(1, "Primary language is required"),
  otherLanguages: z.array(z.string()).optional()
});

type VendorForm = z.infer<typeof vendorSchema>;

export default function VendorRegistration() {
  const { toast } = useToast();
  const [, setLocation] = useLocation();

  const form = useForm<VendorForm>({
    resolver: zodResolver(vendorSchema),
    defaultValues: {
      businessName: "",
      businessType: "",
      otherBusinessType: "",
      contactNo: "+91",
      googleListingUrl: "",
      justDialUrl: "",
      otherListingUrls: "",
      primaryLanguage: "",
      otherLanguages: []
    }
  });

  const registerMutation = useMutation({
    mutationFn: async (data: VendorForm) => {
      const res = await fetch("http://localhost:5001/VendorOnBoard", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      });
      if (!res.ok) throw new Error("Registration failed");
      return res.json();
    },
    onSuccess: () => {
      toast({
        title: "Registration successful",
        description: "Your business has been registered successfully",
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

        <Card className="max-w-2xl mx-auto border-0 shadow-lg bg-white/80 backdrop-blur">
          <CardContent className="p-8">
            <h1 className="text-3xl font-bold text-center mb-8 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Vendor Registration
            </h1>

            <Form {...form}>
              <form onSubmit={form.handleSubmit((data) => registerMutation.mutate(data))} className="space-y-6">
                <FormField
                  control={form.control}
                  name="businessName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Business Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter your business name" {...field} className="border-2" />
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
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select your business type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {businessTypes.map(type => (
                            <SelectItem key={type} value={type}>{type}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {form.watch('businessType') === 'Other' && (
                  <FormField
                    control={form.control}
                    name="otherBusinessType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Other Business Type</FormLabel>
                        <FormControl>
                          <Input placeholder="Specify your business type" {...field} className="border-2" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                <FormField
                  control={form.control}
                  name="contactNo"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Contact Number</FormLabel>
                      <FormControl>
                        <Input placeholder="+91" {...field} className="border-2" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="googleListingUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Google Listing URL</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Enter your Google Business listing URL" {...field} className="border-2" />
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
                      <FormLabel>Just Dial Listing URL</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Enter your Just Dial listing URL" {...field} className="border-2" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="otherListingUrls"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Other Listing URLs</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Enter other business listing URLs (one per line)" {...field} className="border-2" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="primaryLanguage"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Primary Language</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select primary language" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {indianLanguages.map(lang => (
                            <SelectItem key={lang} value={lang}>{lang}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="otherLanguages"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Other Languages</FormLabel>
                      <Select
                        onValueChange={(value) => {
                          const current = field.value || [];
                          field.onChange([...current, value]);
                        }}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select additional languages" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {indianLanguages.map(lang => (
                            <SelectItem key={lang} value={lang}>{lang}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {field.value?.map(lang => (
                          <span key={lang} className="px-2 py-1 bg-blue-100 rounded-full text-sm">
                            {lang}
                            <button
                              type="button"
                              onClick={() => field.onChange(field.value?.filter(l => l !== lang))}
                              className="ml-2 text-red-500"
                            >
                              ×
                            </button>
                          </span>
                        ))}
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                  disabled={registerMutation.isPending}
                >
                  {registerMutation.isPending ? "Registering..." : "Register Your Business"}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}