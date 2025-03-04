import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { insertDealSchema, type InsertDeal } from "@shared/schema";
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
import { Textarea } from "@/components/ui/textarea";
import { apiRequest } from "@/lib/queryClient";

interface DealFormProps {
  onSuccess: () => void;
}

export default function DealForm({ onSuccess }: DealFormProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<InsertDeal>({
    resolver: zodResolver(insertDealSchema),
    defaultValues: {
      vendorId: 1, // Hard-coded for demo
      title: "",
      description: "",
      basePrice: 0,
      minPrice: 0,
      maxPrice: 0,
    },
  });

  const dealMutation = useMutation({
    mutationFn: async (data: InsertDeal) => {
      const res = await apiRequest("POST", "/api/deals", data);
      return res.json();
    },
    onSuccess: () => {
      toast({
        title: "Deal created",
        description: "Your deal has been posted successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/deals"] });
      onSuccess();
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to create deal",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-6">Create New Deal</h2>
      <Form {...form}>
        <form onSubmit={form.handleSubmit((data) => dealMutation.mutate(data))} className="space-y-6">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Deal Title</FormLabel>
                <FormControl>
                  <Input placeholder="Enter deal title" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Describe your deal"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-3 gap-4">
            <FormField
              control={form.control}
              name="basePrice"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Base Price ($)</FormLabel>
                  <FormControl>
                    <Input 
                      type="number"
                      min="0"
                      {...field}
                      onChange={e => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="minPrice"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Min Price ($)</FormLabel>
                  <FormControl>
                    <Input 
                      type="number"
                      min="0"
                      {...field}
                      onChange={e => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="maxPrice"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Max Price ($)</FormLabel>
                  <FormControl>
                    <Input 
                      type="number"
                      min="0"
                      {...field}
                      onChange={e => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <Button 
            type="submit" 
            className="w-full"
            disabled={dealMutation.isPending}
          >
            {dealMutation.isPending ? "Creating..." : "Create Deal"}
          </Button>
        </form>
      </Form>
    </div>
  );
}
