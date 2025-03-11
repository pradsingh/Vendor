import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Bot, CheckCircle2, LoaderCircle, MessageSquare, Star } from "lucide-react";
import NegotiationOptions, { NegotiationOptions as NegotiationOptionsType } from "./negotiation-options";
import { NegotiationResult } from "@/lib/negotiationService";

interface SearchResult {
  id: string;
  title: string;
  description: string;
  price: string;
  originalPrice?: string;
  discount?: string;
  availability?: string;
  rating?: number;
  reviews?: number;
  vendor?: {
    id: string;
    name: string;
    location: string;
  };
  type?: string;
}

interface SearchResultsProps {
  results: SearchResult[];
  isLoading: boolean;
}

export default function SearchResults({ results, isLoading }: SearchResultsProps) {
  const [selectedResults, setSelectedResults] = useState<SearchResult[]>([]);
  const [showNegotiationOptions, setShowNegotiationOptions] = useState(false);
  const [negotiating, setNegotiating] = useState(false);
  const [negotiationProgress, setNegotiationProgress] = useState<{[key: string]: string}>({});
  const [negotiationResults, setNegotiationResults] = useState<{[key: string]: NegotiationResult}>({});
  const [showNegotiationPanel, setShowNegotiationPanel] = useState(false);
  const [allNegotiationsComplete, setAllNegotiationsComplete] = useState(false);

  // Deduplicate results and sort with selected ones at the top
  const uniqueResults = [...new Map(results.map(item => [item.id, item])).values()];
  const sortedResults = [...uniqueResults].sort((a, b) => {
    const aSelected = selectedResults.some(r => r.id === a.id);
    const bSelected = selectedResults.some(r => r.id === b.id);

    if (aSelected && !bSelected) return -1;
    if (!aSelected && bSelected) return 1;
    return 0;
  });

  useEffect(() => {
    // Clear selection when results change
    setSelectedResults([]);
    resetNegotiation();
  }, [results]);

  const handleStartNegotiation = () => {
    if (selectedResults.length > 0) {
      setShowNegotiationOptions(true);
    }
  };

  const handleNegotiationSubmit = async (options: NegotiationOptionsType) => {
    setShowNegotiationOptions(false);
    setNegotiating(true);
    setShowNegotiationPanel(true);

    try {
      // Initialize progress for all selected vendors
      const initialProgress: {[key: string]: string} = {};
      selectedResults.forEach(result => {
        initialProgress[result.id] = "Initiating negotiation...";
      });
      setNegotiationProgress(initialProgress);

      // Simulate negotiation with each vendor with different timings
      const negotiationPromises = selectedResults.map(async (result, index) => {
        // Update progress
        setNegotiationProgress(prev => ({
          ...prev,
          [result.id]: "Sending initial offer..."
        }));

        // Simulate negotiation delay (different for each vendor)
        await new Promise(resolve => setTimeout(resolve, 2000 + (index * 1500)));

        // First update
        setNegotiationProgress(prev => ({
          ...prev,
          [result.id]: "Vendor reviewing your offer..."
        }));

        await new Promise(resolve => setTimeout(resolve, 3000 + (index * 1000)));

        // Second update
        setNegotiationProgress(prev => ({
          ...prev,
          [result.id]: "Vendor counter-offering..."
        }));

        await new Promise(resolve => setTimeout(resolve, 2500));

        // Human-like negotiation responses
        const humanResponses = [
          "We've reached an agreement on better terms!",
          "The vendor has accepted our proposal with some modifications.",
          "Successfully negotiated a better deal for you.",
          "After some back and forth, we've secured favorable terms.",
          "Good news! The vendor has agreed to our conditions."
        ];

        // Random human-like response
        const randomResponse = humanResponses[Math.floor(Math.random() * humanResponses.length)];

        // Generate vendor name or use placeholder
        const vendorName = result.vendor?.name || `${result.title.split(' ')[0]} provider`;

        // Mock negotiation result
        const mockResult: NegotiationResult = {
          success: true,
          negotiatedItems: {
            availability: options.negotiateAvailability ? "Next 24 hours" : undefined,
            discount: options.negotiateDiscount ? `${Math.floor(Math.random() * 15) + 5}% off` : undefined,
            extraServices: options.negotiateExtraService ? [
              "Free installation", 
              "Extended warranty"
            ] : undefined,
          },
          message: `${randomResponse} ${options.negotiateDiscount ? "We've secured a special discount." : ""} ${options.negotiateExtraService ? "Additional services included at no extra cost." : ""}`,
          finalPrice: options.negotiateDiscount ? `₹${Math.floor(parseInt(result.price.replace('₹', '')) * 0.85)}` : result.price,
          vendorId: result.vendor?.id || result.id,
          timestamp: Date.now(),
        };

        // Final progress update
        setNegotiationProgress(prev => ({
          ...prev,
          [result.id]: "Negotiation complete!"
        }));

        return { id: result.id, result: mockResult };
      });

      // Wait for all negotiations to complete
      const results = await Promise.all(negotiationPromises);

      // Update the negotiation results state
      const newResults: {[key: string]: NegotiationResult} = {};
      results.forEach(({ id, result }) => {
        newResults[id] = result;
      });
      setNegotiationResults(newResults);
      setAllNegotiationsComplete(true);

    } catch (error) {
      console.error("Negotiation failed:", error);
    } finally {
      setNegotiating(false);
    }
  };

  const handleNegotiationCancel = () => {
    setShowNegotiationOptions(false);
  };

  const toggleSelectResult = (result: SearchResult) => {
    if (negotiating) return; // Prevent selection during negotiation

    setSelectedResults(prev => {
      const isSelected = prev.some(r => r.id === result.id);
      if (isSelected) {
        return prev.filter(r => r.id !== result.id);
      } else {
        return [...prev, result];
      }
    });
  };

  const resetNegotiation = () => {
    setNegotiationResults({});
    setNegotiationProgress({});
    setShowNegotiationPanel(false);
    setAllNegotiationsComplete(false);
  };

  const getVendorDisplayName = (result: SearchResult) => {
    if (result.vendor && result.vendor.name) {
      return result.vendor.name;
    }
    // Extract a vendor name from the title if possible
    const titleParts = result.title.split('-');
    if (titleParts.length > 1) {
      return titleParts[0].trim();
    }
    return result.title.split(' ')[0] + " Provider";
  };

  return (
    <div className="space-y-6">
      {/* Global negotiation section above all results */}
      {results.length > 0 && !allNegotiationsComplete && (
        <Card className="border-primary/20">
          <CardContent className="p-6">
            <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
              <div className="space-y-2">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Bot className="h-5 w-5 text-primary" />
                  AI Negotiation
                </h3>
                <p className="text-sm text-muted-foreground">
                  Select services below and use AI to negotiate for better deals
                </p>
              </div>
              <div>
                <Button 
                  onClick={handleStartNegotiation}
                  variant="default" 
                  disabled={selectedResults.length === 0 || negotiating}
                  className="w-full md:w-auto"
                >
                  {negotiating ? (
                    <>
                      <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                      Negotiating...
                    </>
                  ) : (
                    <>
                      Negotiate ({selectedResults.length})
                      <MessageSquare className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Negotiation completed results */}
      {allNegotiationsComplete && (
        <Card className="border-primary/20 bg-primary/5">
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                  Best Negotiation Result
                </h3>
                <Button variant="outline" size="sm" onClick={resetNegotiation}>
                  Start New Negotiation
                </Button>
              </div>

              <div className="mt-2">
                {/* Show only the best offer/vendor */}
                {(() => {
                  // Find the most successful negotiation result
                  const bestResultId = Object.keys(negotiationResults).find(id => 
                    negotiationResults[id]?.success
                  );
                  
                  if (bestResultId) {
                    const result = selectedResults.find(r => r.id === bestResultId);
                    if (!result) return null;
                    
                    const vendorName = getVendorDisplayName(result);
                    const originalPrice = result.price || "";
                    const discount = Math.floor(Math.random() * 15) + 5;
                    const finalPrice = originalPrice ? `₹${parseInt(originalPrice.replace('₹', '')) - 
                      (parseInt(originalPrice.replace('₹', '')) * discount / 100)}` : "";
                    
                    return (
                      <div className="p-4 bg-primary/5 rounded-md border border-primary/20">
                        <div className="flex justify-between items-center">
                          <h4 className="font-medium text-lg">{vendorName}</h4>
                          <Badge className="bg-green-500 text-white">Best Offer</Badge>
                        </div>
                        <p className="mt-3">
                          After some back and forth, we've secured favorable terms. We've secured a special discount 
                          from {vendorName} and they are giving the {result.title.split(' ')[0]} in {finalPrice} 
                          {negotiationResults[bestResultId].negotiatedItems?.extraServices?.length ? 
                           ` with ${negotiationResults[bestResultId].negotiatedItems.extraServices.join(" and ")}` : ""}
                        </p>
                        
                        <div className="mt-3 flex flex-wrap gap-2">
                          {originalPrice && (
                            <Badge variant="outline" className="text-sm">
                              Original: {originalPrice}
                            </Badge>
                          )}
                          {finalPrice && (
                            <Badge variant="outline" className="text-sm bg-green-50">
                              Final Offer: {finalPrice}
                            </Badge>
                          )}
                          {discount && (
                            <Badge variant="outline" className="text-sm">
                              Discount: {discount}%
                            </Badge>
                          )}
                        </div>
                      </div>
                    );
                  }
                  
                  return (
                    <div className="p-3 bg-primary/5 rounded-md">
                      <p>No successful negotiations to display.</p>
                    </div>
                  );
                })()}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Main grid for results with negotiation panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Results column */}
        <div className={showNegotiationPanel ? "lg:col-span-2" : "lg:col-span-3"}>
          <div className="space-y-6">
            {sortedResults.map((result, index) => {
              const isTopResult = index === 0;
              const isSelected = selectedResults.some(r => r.id === result.id);

              // Determine vendor display information
              const displayResult = {
                ...result,
                vendor: result.vendor || {
                  id: `default-${result.id}`,
                  name: "Vendor information unavailable",
                  location: ""
                }
              };

              // Create display variants based on result status
              const resultVariants = {
                cardBorder: isSelected ? "border-primary" : isTopResult ? "border-primary/20" : "",
                badge: isTopResult ? "Top Match" : result.discount ? "Discount" : "",
                badgeVariant: isTopResult ? "default" : "secondary",
              };

              return (
                <Card 
                  key={result.id} 
                  className={`${resultVariants.cardBorder} h-full transition-all hover:shadow-md`}
                >
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row gap-6">
                      <div className="flex-1">
                        {resultVariants.badge && (
                          <Badge className="mb-3" variant={resultVariants.badgeVariant as any}>
                            {resultVariants.badge}
                          </Badge>
                        )}

                        <div>
                          <h3 className="text-lg font-semibold">{displayResult.title}</h3>
                          <p className="text-sm">{displayResult.description}</p>
                        </div>

                        <div className="flex flex-wrap gap-3 mt-4">
                          <div className="flex items-center">
                            <span className="font-medium mr-1">₹{displayResult.price ? displayResult.price.replace('₹', '') : '0'}</span>
                            {displayResult.originalPrice && (
                              <span className="text-muted-foreground line-through ml-2">
                                {displayResult.originalPrice}
                              </span>
                            )}
                          </div>

                          {displayResult.availability && (
                            <div className="flex items-center">
                              <span className="inline-flex items-center">
                                <span className="mr-1">Available in</span> {displayResult.availability}
                              </span>
                            </div>
                          )}

                          {displayResult.rating && (
                            <div className="flex items-center">
                              <Star className="h-4 w-4 text-yellow-400 mr-1" />
                              <span>{displayResult.rating} ({displayResult.reviews || 0})</span>
                            </div>
                          )}
                        </div>

                        <div className="flex flex-wrap gap-3 text-sm mt-2">
                          {displayResult.vendor && (
                            <>
                              <a href="#" className="text-blue-500 hover:underline flex items-center">
                                <span className="mr-1">Google Business</span>
                                {displayResult.reviews && <span>({displayResult.reviews} reviews)</span>}
                              </a>
                              <a href="#" className="text-blue-500 hover:underline">
                                JustDial
                              </a>
                            </>
                          )}
                        </div>
                      </div>

                      <div className="flex flex-col gap-3">
                        <Button 
                          onClick={() => toggleSelectResult(result)}
                          variant={isSelected ? "default" : "outline"}
                          disabled={negotiating}
                        >
                          {isSelected ? "Selected" : "Select for Negotiation"}
                        </Button>

                        <Button variant="outline">
                          Contact
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}

            {sortedResults.length === 0 && !isLoading && (
              <Card>
                <CardContent className="p-6 text-center">
                  <p className="text-muted-foreground">No results found. Try a different search.</p>
                </CardContent>
              </Card>
            )}

            {isLoading && (
              <Card>
                <CardContent className="p-6 flex justify-center">
                  <LoaderCircle className="h-6 w-6 animate-spin text-primary" />
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Negotiation panel */}
        {showNegotiationPanel && (
          <div className="lg:col-span-1 space-y-6">
            <Card className="sticky top-6">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Bot className="h-5 w-5 text-primary" />
                  Negotiation Progress
                </h3>

                <div className="space-y-4">
                  {selectedResults.map(result => (
                    <div key={`progress-${result.id}`} className="p-3 border rounded-md">
                      <h4 className="font-medium text-sm">
                        {getVendorDisplayName(result)}
                      </h4>
                      <div className="flex items-center mt-2">
                        {negotiationProgress[result.id] && negotiationProgress[result.id] !== "Negotiation complete!" ? (
                          <>
                            <LoaderCircle className="animate-spin h-4 w-4 mr-2 text-primary" />
                            <p className="text-sm">{negotiationProgress[result.id]}</p>
                          </>
                        ) : (
                          <p className="text-sm flex items-center">
                            <CheckCircle2 className="h-4 w-4 mr-2 text-green-500" />
                            Negotiation complete!
                          </p>
                        )}
                      </div>

                      {negotiationResults[result.id] && (
                        <div className="mt-4 p-3 bg-primary/10 rounded-md">
                          <p className="text-sm flex items-center gap-2">
                            <Bot className="h-4 w-4 text-primary" />
                            {negotiationResults[result.id]?.message || 'Negotiation completed'}
                          </p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      {/* Negotiation options dialog */}
      {showNegotiationOptions && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-background rounded-lg max-w-md w-full max-h-[90vh] overflow-auto">
            <NegotiationOptions 
              onSubmit={handleNegotiationSubmit} 
              onCancel={handleNegotiationCancel}
            />
          </div>
        </div>
      )}
    </div>
  );
}