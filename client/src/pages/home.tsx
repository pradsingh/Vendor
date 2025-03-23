import { Link } from "wouter";
import { useState } from "react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Search, Bot, TrendingUp, Store } from "lucide-react";
import { Card, CardContent } from "../components/ui/card";
import SearchSuggestions from "../components/search-suggestions";
import SearchResults from "../components/search-results";
import { useSearch } from "../lib/searchService";

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [submittedQuery, setSubmittedQuery] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Get search results - this will use the mock data until the API is implemented
  const { data: searchResults = [], isLoading, isError } = useSearch(submittedQuery);

  // Debug - log search results
  console.log("Search query:", submittedQuery);
  console.log("Search results:", searchResults);

  return (
    <div className="min-h-screen bg-background">
      <div className="flex h-screen">
        {/* Sidebar */}
        <aside className="w-64 bg-card border-r shadow-lg">
          <div className="p-4">
            <img
              src="/assets/Xinacle_Logo.jpg"
              alt="Xinacle Logo"
              className="h-12 mb-8 mx-auto"
            />
            <nav className="space-y-2">
              <Link href="/register">
                <Button variant="ghost" className="w-full justify-start bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white">
                  <Store className="mr-2 h-4 w-4" />
                  Vendor Registration
                </Button>
              </Link>
              <Link href="/deals">
                <Button variant="ghost" className="w-full justify-start bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white">
                  <TrendingUp className="mr-2 h-4 w-4" />
                  Browse Deals
                </Button>
              </Link>
              <Link href="/dashboard">
                <Button variant="ghost" className="w-full justify-start bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white">
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
              <h1 className="text-4xl font-bold text-center mb-8 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
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
                  <form onSubmit={(e) => {
                    e.preventDefault();
                    setSubmittedQuery(searchQuery);
                  }}>
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
                  </form>
                  <SearchSuggestions 
                    query={searchQuery} 
                    isOpen={showSuggestions}
                    searchResults={searchResults} 
                    onSuggestionClick={(suggestion) => {
                      setSearchQuery(suggestion);
                      setSubmittedQuery(suggestion);
                      setShowSuggestions(false);
                    }}
                  />
                </div>
              </div>
              {!submittedQuery ? (
                <div className="mt-6 text-sm text-center text-muted-foreground space-y-2">
                  <p className="font-medium">Popular searches:</p>
                  <p>"Looking for trusted plumbers in my area"</p>
                  <p>"Compare outstation taxi prices for Mumbai to Pune"</p>
                  <p>"Best restaurant deals for group dining"</p>
                </div>
              ) : (
                <SearchResults 
                  results={searchResults} 
                  isLoading={isLoading} 
                />
              )}
            </div>

         

            {/* Hide marketing content when search results are displayed */}
            {!submittedQuery && (
              <section className="py-16 bg-secondary/10">
                <div className="container px-4 md:px-6 mx-auto">
                  <div className="grid gap-10 md:grid-cols-3">
                    <div className="text-center p-6 space-y-4">
                      <div className="mx-auto bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center">
                        <Bot className="h-8 w-8 text-primary" />
                      </div>
                      <h3 className="text-xl font-bold">Smart AI Negotiation</h3>
                      <p className="text-muted-foreground">
                        Our AI helps you negotiate the best deals based on real market conditions and historical data.
                      </p>
                    </div>

                    <div className="text-center p-6 space-y-4">
                      <div className="mx-auto bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center">
                        <TrendingUp className="h-8 w-8 text-primary" />
                      </div>
                      <h3 className="text-xl font-bold">Real-time Bargaining</h3>
                      <p className="text-muted-foreground">
                        Connect directly with sellers to negotiate prices and get personalized offers.
                      </p>
                    </div>

                    <div className="text-center p-6 space-y-4">
                      <div className="mx-auto bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center">
                        <Store className="h-8 w-8 text-primary" />
                      </div>
                      <h3 className="text-xl font-bold">Verified Vendors</h3>
                      <p className="text-muted-foreground">
                        All vendors on our platform are verified and rated to ensure quality service.
                      </p>
                    </div>
                  </div>
                </div>
              </section>
            )}

            {!submittedQuery && (
              <section className="py-16">
                <div className="container px-4 md:px-6 mx-auto">
                  <div className="grid md:grid-cols-2 gap-8">
                    <div className="relative rounded-xl overflow-hidden shadow-lg group hover:shadow-xl transition-all duration-300">
                      <img
                        src="/assets/marketplace.jpg"
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
                        src="/assets/deals.jpg"
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
              </section>
            )}
            <section className="py-16">
              <div className="container px-4 md:px-6 mx-auto text-center">
                <h2 className="text-3xl font-bold mb-4">Ready to discover the best deals?</h2>
                <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                  Join thousands of satisfied customers who are finding great deals and services every day.
                </p>
                <div className="flex gap-4 mt-6"> 
                  <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white">
                    Start Now
                  </Button>
                  <Button size="lg" variant="outline" asChild className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white">
                    <Link href="/signup">Sign Up</Link>
                  </Button>
                </div>
              </div>
            </section>
          </div>
        </main>
      </div>
    </div>
  );
}