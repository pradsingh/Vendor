import { Link } from "wouter";
import { useState, useEffect } from "react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Search, Bot, TrendingUp, Store, Star, ShieldCheck, Tag } from "lucide-react";
import { Card, CardContent } from "../components/ui/card";
import SearchSuggestions from "../components/search-suggestions";
import SearchResults from "../components/search-results";
import { useSearch } from "../lib/searchService";

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [submittedQuery, setSubmittedQuery] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Get search results - this will use the mock data until the API is implemented
  const { data: searchResults = [], isLoading, isError } = useSearch(submittedQuery);

  // Handle scroll effect for sticky header
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Recent searches (would be fetched from local storage in a real app)
  const recentSearches = [
    "Plumbers near me",
    "AC repair service",
    "Best car wash deals"
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="flex h-screen">
        {/* Sidebar */}
        <aside className="w-64 bg-card border-r shadow-lg hidden md:block">
          <div className="p-4 sticky top-0">
            <img
              src="/assets/Xinacle_Logo.jpg"
              alt="Xinacle Logo"
              className="h-12 mb-8 mx-auto"
            />
            <nav className="space-y-3">
              <Link href="/register">
                <Button variant="ghost" className="w-full justify-start bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white">
                  <Store className="mr-2 h-4 w-4" />
                  Vendor Registration
                </Button>
              </Link>
              <Link href="/deals">
                <Button variant="ghost" className="w-full justify-start bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white">
                  <Tag className="mr-2 h-4 w-4" />
                  Browse Deals
                </Button>
              </Link>
              <Link href="/dashboard">
                <Button variant="ghost" className="w-full justify-start bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white">
                  <TrendingUp className="mr-2 h-4 w-4" />
                  Vendor Dashboard
                </Button>
              </Link>
            </nav>

            {/* Recent Searches Section */}
            {recentSearches.length > 0 && (
              <div className="mt-8 border-t pt-4">
                <h3 className="text-sm font-medium mb-2">Recent Searches</h3>
                <ul className="space-y-2">
                  {recentSearches.map((search, index) => (
                    <li key={index}>
                      <Button 
                        variant="ghost" 
                        className="w-full justify-start text-xs text-left text-muted-foreground hover:text-foreground"
                        onClick={() => {
                          setSearchQuery(search);
                          setSubmittedQuery(search);
                        }}
                      >
                        <Search className="mr-2 h-3 w-3" />
                        {search}
                      </Button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </aside>

        {/* Mobile Navigation */}
        <div className={`fixed top-0 left-0 right-0 z-50 md:hidden transition-all duration-300 ${isScrolled ? 'bg-background/80 backdrop-blur-sm shadow-md' : ''}`}>
          <div className="flex items-center justify-between p-4">
            <img
              src="/assets/Xinacle_Logo.jpg"
              alt="Xinacle Logo"
              className="h-8 object-contain"
            />
            <div className="flex space-x-2">
              <Button variant="outline" size="sm" asChild>
                <Link href="/deals">Deals</Link>
              </Button>
              <Button variant="outline" size="sm" asChild>
                <Link href="/register">Register</Link>
              </Button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <main className="flex-1 overflow-auto bg-gradient-to-b from-background to-secondary/10">
          <div className="max-w-4xl mx-auto px-4 py-12 md:py-16">
            <div className="text-center mb-12 md:mb-16 pt-10 md:pt-0">
              <h1 className="text-4xl md:text-5xl font-bold text-center mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Xinacle AI Search
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
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
                      className="h-16 md:h-20 pl-16 pr-6 text-lg md:text-xl rounded-2xl shadow-lg bg-card/50 backdrop-blur-sm border-2 border-primary/10 focus:border-primary/20 transition-all"
                      placeholder="What are you looking for today?"
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
                  <p className="font-medium">Try searching for:</p>
                  <div className="flex flex-wrap justify-center gap-2 mt-3">
                    {["Plumbers in Mumbai", "AC repair near me", "Taxi from Delhi to Agra", "Best restaurant deals"].map((term, idx) => (
                      <Button 
                        key={idx} 
                        variant="outline" 
                        size="sm" 
                        className="rounded-full text-xs bg-primary/5"
                        onClick={() => {
                          setSearchQuery(term);
                          setSubmittedQuery(term);
                        }}
                      >
                        {term}
                      </Button>
                    ))}
                  </div>
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
              <section className="py-12 px-4 bg-secondary/10 rounded-xl mb-12">
                <div className="container mx-auto">
                  <h2 className="text-2xl font-bold text-center mb-8">How Xinacle Works for You</h2>
                  <div className="grid gap-8 md:grid-cols-3">
                    <div className="text-center p-6 space-y-4 bg-white/50 rounded-lg shadow-sm hover:shadow-md transition-all">
                      <div className="mx-auto bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center">
                        <Bot className="h-8 w-8 text-primary" />
                      </div>
                      <h3 className="text-xl font-bold">Smart AI Negotiation</h3>
                      <p className="text-muted-foreground">
                        Our AI analyzes market data to help you negotiate the best possible deals.
                      </p>
                    </div>

                    <div className="text-center p-6 space-y-4 bg-white/50 rounded-lg shadow-sm hover:shadow-md transition-all">
                      <div className="mx-auto bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center">
                        <TrendingUp className="h-8 w-8 text-primary" />
                      </div>
                      <h3 className="text-xl font-bold">Real-time Bargaining</h3>
                      <p className="text-muted-foreground">
                        Connect directly with sellers to negotiate prices and get personalized offers.
                      </p>
                    </div>

                    <div className="text-center p-6 space-y-4 bg-white/50 rounded-lg shadow-sm hover:shadow-md transition-all">
                      <div className="mx-auto bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center">
                        <ShieldCheck className="h-8 w-8 text-primary" />
                      </div>
                      <h3 className="text-xl font-bold">Verified Vendors</h3>
                      <p className="text-muted-foreground">
                        All vendors are verified and rated to ensure quality service every time.
                      </p>
                    </div>
                  </div>
                </div>
              </section>
            )}

            {!submittedQuery && (
              <section className="py-12">
                <h2 className="text-2xl font-bold text-center mb-8">Discover What's Nearby</h2>
                <div className="container mx-auto">
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
                          <p className="text-sm text-white/80 mb-4">
                            Discover trusted service providers and vendors in your locality
                          </p>
                          <Button size="sm" className="bg-white/20 hover:bg-white/30 backdrop-blur-sm">
                            Explore Now
                          </Button>
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
                          <p className="text-sm text-white/80 mb-4">
                            Find amazing discounts and exclusive offers from local businesses
                          </p>
                          <Button size="sm" className="bg-white/20 hover:bg-white/30 backdrop-blur-sm">
                            View Deals
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            )}

            {!submittedQuery && (
              <section className="py-12 bg-white/50 rounded-xl">
                <div className="container px-4 mx-auto text-center">
                  <h2 className="text-2xl font-bold mb-4">What Our Users Say</h2>
                  <div className="grid gap-6 md:grid-cols-3 mt-8">
                    {[
                      {
                        name: "Priya S.",
                        rating: 5,
                        comment: "Saved ₹2000 on plumbing repairs! The AI negotiation feature is incredible."
                      },
                      {
                        name: "Rahul M.",
                        rating: 5,
                        comment: "Found a reliable electrician in minutes. The service quality was exactly as promised."
                      },
                      {
                        name: "Anita K.",
                        rating: 4,
                        comment: "Great for finding local services. Would recommend to friends and family."
                      }
                    ].map((testimonial, idx) => (
                      <Card key={idx} className="border-0 shadow-sm">
                        <CardContent className="p-6">
                          <div className="flex items-center mb-4">
                            {Array(testimonial.rating).fill(0).map((_, i) => (
                              <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            ))}
                          </div>
                          <p className="italic text-sm mb-4">"{testimonial.comment}"</p>
                          <p className="text-sm font-medium">{testimonial.name}</p>
                        </CardContent>
                      </Card>
                    ))}
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
                <div className="flex flex-col sm:flex-row gap-4 justify-center mt-6">
                  <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white">
                    Start Searching Now
                  </Button>
                  <Button size="lg" variant="outline" asChild className="bg-white/50 hover:bg-white/70">
                    <Link href="/signup">Create Account</Link>
                  </Button>
                </div>
              </div>
            </section>
          </div>
        </main>
      </div>

      {/* Footer */}
      {!submittedQuery && (
        <footer className="bg-card border-t py-8">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="mb-4 md:mb-0">
                <img
                  src="/assets/Xinacle_Logo.jpg"
                  alt="Xinacle Logo"
                  className="h-8 object-contain"
                />
              </div>
              <div className="text-center md:text-right text-sm text-muted-foreground">
                <p>© 2025 Xinacle AI Search. All rights reserved.</p>
                <div className="flex gap-4 justify-center md:justify-end mt-2">
                  <Link href="/about" className="hover:text-primary">About</Link>
                  <Link href="/privacy" className="hover:text-primary">Privacy</Link>
                  <Link href="/terms" className="hover:text-primary">Terms</Link>
                  <Link href="/contact" className="hover:text-primary">Contact</Link>
                </div>
              </div>
            </div>
          </div>
        </footer>
      )}
    </div>
  );
}