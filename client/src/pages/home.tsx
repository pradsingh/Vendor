import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Store, ShoppingBag, TrendingUp } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <div className="flex h-screen">
        {/* Sidebar */}
        <aside className="w-64 bg-card border-r">
          <div className="p-4">
            <img
              src="/473401005_1684307442443812_4879780615142385148_n.jpg"
              alt="Xinacle Logo"
              className="h-8 mb-8"
            />
            <nav className="space-y-2">
              <Link href="/register">
                <Button variant="ghost" className="w-full justify-start">
                  Vendor Registration
                </Button>
              </Link>
              <Link href="/deals">
                <Button variant="ghost" className="w-full justify-start">
                  Browse Deals
                </Button>
              </Link>
              <Link href="/dashboard">
                <Button variant="ghost" className="w-full justify-start">
                  Vendor Dashboard
                </Button>
              </Link>
            </nav>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-auto">
          <div className="max-w-4xl mx-auto px-4 py-12">
            <div className="text-center mb-12">
              <h1 className="text-4xl font-bold mb-4">AI-Powered Price Negotiation</h1>
              <p className="text-xl text-muted-foreground">
                Let our AI negotiate the best deals for you
              </p>
            </div>

            {/* Central Search Area */}
            <div className="max-w-2xl mx-auto mb-16">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  className="h-16 pl-12 pr-4 text-lg rounded-2xl shadow-lg"
                  placeholder="What are you looking for?"
                />
              </div>
              <p className="mt-3 text-sm text-center text-muted-foreground">
                Examples: "Find electronics deals", "Compare prices for laptops", "Negotiate best price for smartphones"
              </p>
            </div>

            {/* Features */}
            <div className="grid md:grid-cols-3 gap-6">
              <div className="p-6 rounded-lg bg-card">
                <h3 className="text-lg font-semibold mb-2">AI Negotiation</h3>
                <p className="text-muted-foreground">
                  Our AI analyzes market data to negotiate the best possible price for you
                </p>
              </div>
              <div className="p-6 rounded-lg bg-card">
                <h3 className="text-lg font-semibold mb-2">Smart Bargaining</h3>
                <p className="text-muted-foreground">
                  Automated bargaining strategies based on vendor preferences
                </p>
              </div>
              <div className="p-6 rounded-lg bg-card">
                <h3 className="text-lg font-semibold mb-2">Real-time Deals</h3>
                <p className="text-muted-foreground">
                  Connect with local vendors and get instant price quotes
                </p>
              </div>
            </div>

            {/* Featured Vendors - from original code */}
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
        </main>
      </div>
    </div>
  );
}