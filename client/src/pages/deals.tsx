
import { HomeButton } from "@/components/home-button";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function Deals() {
  const sampleDeals = [
    {
      title: "Winter Tire Special",
      description: "Get 20% off on all winter tires",
      vendor: "AutoTire Plus",
    },
    {
      title: "Battery Replacement Deal",
      description: "Free installation with any car battery purchase",
      vendor: "PowerCell Services",
    },
    {
      title: "Service Package",
      description: "Complete car service at discounted price",
      vendor: "CarCare Express",
    },
  ];

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
        <h1 className="text-3xl font-bold text-center mb-8 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Available Deals
        </h1>
        <div className="grid md:grid-cols-3 gap-6">
          {sampleDeals.map((deal, index) => (
            <Card key={index} className="border-0 shadow-lg bg-white/80 backdrop-blur">
              <div className="p-6">
                <h2 className="text-xl font-bold mb-2">{deal.title}</h2>
                <p className="text-muted-foreground mb-4">{deal.description}</p>
                <p className="text-sm mb-4">Vendor: {deal.vendor}</p>
                <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white">
                  View Deal
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
