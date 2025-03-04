import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Store, ShoppingBag, TrendingUp } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Local Vendor Marketplace</h1>
          <p className="text-lg text-muted-foreground">
            Connect with local vendors and get the best deals through AI-powered negotiations
          </p>
        </header>

        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <Card>
            <CardContent className="pt-6">
              <Store className="h-12 w-12 mb-4 text-primary" />
              <h2 className="text-xl font-semibold mb-2">For Vendors</h2>
              <p className="text-muted-foreground mb-4">
                Register your business and start posting deals to reach more customers
              </p>
              <Link href="/register">
                <Button className="w-full">Register Now</Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <ShoppingBag className="h-12 w-12 mb-4 text-primary" />
              <h2 className="text-xl font-semibold mb-2">Browse Deals</h2>
              <p className="text-muted-foreground mb-4">
                Discover great deals from local vendors in your area
              </p>
              <Link href="/deals">
                <Button className="w-full" variant="outline">
                  View Deals
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <TrendingUp className="h-12 w-12 mb-4 text-primary" />
              <h2 className="text-xl font-semibold mb-2">AI Negotiation</h2>
              <p className="text-muted-foreground mb-4">
                Let our AI negotiate the best prices for you automatically
              </p>
              <Button className="w-full" variant="secondary">
                Learn More
              </Button>
            </CardContent>
          </Card>
        </div>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6 text-center">Featured Vendors</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="relative rounded-lg overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1520333789090-1afc82db536a"
                alt="Business owner"
                className="w-full h-64 object-cover"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-black/50 p-4">
                <h3 className="text-white font-semibold">Local Businesses</h3>
                <p className="text-white/80 text-sm">
                  Connect with trusted local vendors
                </p>
              </div>
            </div>
            <div className="relative rounded-lg overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1495522097160-b7d527cc67f8"
                alt="Marketplace"
                className="w-full h-64 object-cover"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-black/50 p-4">
                <h3 className="text-white font-semibold">Marketplace</h3>
                <p className="text-white/80 text-sm">
                  Find the best deals in your area
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
