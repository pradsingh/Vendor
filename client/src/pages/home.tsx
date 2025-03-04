import { Link } from "wouter";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Bot, TrendingUp, Store } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import SearchSuggestions from "@/components/search-suggestions";

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);

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
                  <Store className="mr-2 h-4 w-4" />
                  Vendor Registration
                </Button>
              </Link>
              <Link href="/deals">
                <Button variant="ghost" className="w-full justify-start">
                  <TrendingUp className="mr-2 h-4 w-4" />
                  Browse Deals
                </Button>
              </Link>
              <Link href="/dashboard">
                <Button variant="ghost" className="w-full justify-start">
                  <Store className="mr-2 h-4 w-4" />
                  Vendor Dashboard
                </Button>
              </Link>
            </nav>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-auto bg-gradient-to-b from-background to-secondary/10">
          <div className="max-w-4xl mx-auto px-4 py-12">
            <div className="text-center mb-16">
              <h1 className="text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/80">
                Xinacle AI search
              </h1>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Let our advanced AI negotiate the best deals for you, saving your precious time and money
              </p>
            </div>

            {/* Central Search Area */}
            <div className="max-w-3xl mx-auto mb-16">
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-primary/10 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-500 opacity-75"></div>
                <div className="relative">
                  <Search className="absolute left-6 top-1/2 transform -translate-y-1/2 h-6 w-6 text-muted-foreground" />
                  <Input
                    className="h-20 pl-16 pr-6 text-xl rounded-2xl shadow-lg bg-card/50 backdrop-blur-sm border-2 border-primary/10 focus:border-primary/20 transition-all"
                    placeholder="What are you looking for?"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onFocus={() => setShowSuggestions(true)}
                    onBlur={() => {
                      // Delay hiding suggestions to allow clicking on them
                      setTimeout(() => setShowSuggestions(false), 200);
                    }}
                  />
                  <SearchSuggestions query={searchQuery} isOpen={showSuggestions} />
                </div>
              </div>
              <div className="mt-6 text-sm text-center text-muted-foreground space-y-2">
                <p className="font-medium">Popular searches:</p>
                <p>"Looking for trusted plumbers in my area"</p>
                <p>"Compare outstation taxi prices for Mumbai to Pune"</p>
                <p>"Best restaurant deals for group dining"</p>
              </div>
            </div>

            {/* Features */}
            <div className="grid md:grid-cols-3 gap-8 mb-16">
              <Card className="group hover:shadow-lg transition-all duration-300">
                <CardContent className="pt-6">
                  <div className="mb-4 p-3 bg-primary/10 rounded-lg w-fit">
                    <Bot className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Smart AI Negotiation</h3>
                  <p className="text-muted-foreground">
                    Our AI analyzes market trends and vendor data to negotiate the best possible deals
                  </p>
                </CardContent>
              </Card>

              <Card className="group hover:shadow-lg transition-all duration-300">
                <CardContent className="pt-6">
                  <div className="mb-4 p-3 bg-primary/10 rounded-lg w-fit">
                    <TrendingUp className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Real-time Bargaining</h3>
                  <p className="text-muted-foreground">
                    Get instant price quotes and automated bargaining based on vendor preferences
                  </p>
                </CardContent>
              </Card>

              <Card className="group hover:shadow-lg transition-all duration-300">
                <CardContent className="pt-6">
                  <div className="mb-4 p-3 bg-primary/10 rounded-lg w-fit">
                    <Store className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Verified Vendors</h3>
                  <p className="text-muted-foreground">
                    Connect with trusted local vendors offering competitive prices
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Local Marketplace Section */}
            <div className="grid md:grid-cols-2 gap-8">
                <div className="relative rounded-xl overflow-hidden shadow-lg group hover:shadow-xl transition-all duration-300">
                  <img
                    src="/images/local-marketplace.jpg"
                    alt="Local Market"
                    className="w-full h-64 object-cover transform group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end">
                    <div className="p-6 text-white">
                      <h3 className="text-xl font-bold mb-2">Explore Local Marketplace</h3>
                      <p className="text-sm text-white/80">
                        Discover trusted service providers and vendors in your locality
                      </p>
                    </div>
                  </div>
                </div>

                <div className="relative rounded-xl overflow-hidden shadow-lg group hover:shadow-xl transition-all duration-300">
                  <img
                    src="/images/special-deals.jpg"
                    alt="Special Deals"
                    className="w-full h-64 object-cover transform group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end">
                    <div className="p-6 text-white">
                      <h3 className="text-xl font-bold mb-2">Crazy Deals Near You</h3>
                      <p className="text-sm text-white/80">
                        Find amazing discounts and exclusive offers from local businesses
                      </p>
                    </div>
                  </div>
                </div>
              </div>
          </div>
        </main>
      </div>
    </div>
  );
}