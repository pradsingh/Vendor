
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
  vendor: {
    id: string;
    name: string;
    location: string;
  };
}

interface SearchResultsProps {
  results: SearchResult[];
}

export default function SearchResults({ results }: SearchResultsProps) {
  const [selectedResults, setSelectedResults] = useState<SearchResult[]>([]);
  const [showNegotiationOptions, setShowNegotiationOptions] = useState(false);
  const [negotiating, setNegotiating] = useState(false);
  const [negotiationResults, setNegotiationResults] = useState<{[key: string]: NegotiationResult | null}>({});
  const [negotiationProgress, setNegotiationProgress] = useState<{[key: string]: string}>({});
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

  const handleNegotiationSubmit = async (options: NegotiationOptionsType) => {
    if (selectedResults.length === 0) return;
    
    setNegotiating(true);
    setShowNegotiationOptions(false);
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
          message: `Successfully negotiated with ${result.vendor ? result.vendor.name : 'the vendor'}!`,
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
              
              {selectedResults.length > 0 && !showNegotiationOptions && !negotiating && (
                <Button 
                  onClick={() => setShowNegotiationOptions(true)}
                  disabled={negotiating}
                >
                  Go for Negotiation ({selectedResults.length})
                  <MessageSquare className="ml-2 h-4 w-4" />
                </Button>
              )}
            </div>
            
            {negotiating && !showNegotiationPanel && (
              <div className="mt-4 flex items-center justify-center p-4 bg-secondary/20 rounded-lg">
                <LoaderCircle className="h-5 w-5 text-primary animate-spin mr-2" />
                <p className="text-sm">Negotiating the best deal for you...</p>
              </div>
            )}
            
            {selectedResults.length > 0 && showNegotiationOptions && (
              <div className="mt-4">
                <NegotiationOptions
                  onSubmit={handleNegotiationSubmit}
                  onCancel={handleNegotiationCancel}
                />
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Negotiation result summary after all negotiations are complete */}
      {allNegotiationsComplete && Object.keys(negotiationResults).length > 0 && (
        <Card className="border-primary/20">
          <CardContent className="p-6">
            <div className="flex flex-col space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                  Negotiation Complete
                </h3>
                <Button variant="outline" onClick={resetNegotiation}>
                  Start New Negotiation
                </Button>
              </div>
              
              <p className="text-sm text-muted-foreground">
                We've successfully negotiated with {Object.keys(negotiationResults).length} vendors.
              </p>
              
              <div className="grid gap-4 mt-2">
                {selectedResults.map(result => (
                  <div key={`summary-${result.id}`} className="p-3 bg-primary/5 rounded-md">
                    <div className="flex justify-between items-center">
                      <h4 className="font-medium">{result.vendor.name}</h4>
                      <Badge variant="outline" className="text-sm">
                        {negotiationResults[result.id]?.success ? "Success" : "Failed"}
                      </Badge>
                    </div>
                    <p className="text-sm mt-2">{negotiationResults[result.id]?.message}</p>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
      
      {/* Main grid for results with negotiation panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Results column */}
        <div className={`lg:col-span-${showNegotiationPanel ? '2' : '3'} space-y-6`}>
          {sortedResults.map((result, index) => {
            const isTopResult = index === 0;
            const isSelected = selectedResults.some(r => r.id === result.id);
            
            // Modified result that incorporates negotiation results if applicable
            let displayResult = { ...result };
            if (isSelected && negotiationResults[result.id]?.success) {
              if (negotiationResults[result.id]?.negotiatedItems.availability) {
                displayResult.availability = negotiationResults[result.id].negotiatedItems.availability;
              }
              if (negotiationResults[result.id]?.negotiatedItems.discount) {
                displayResult.discount = negotiationResults[result.id].negotiatedItems.discount;
              }
            }
          
            return (
              <div key={result.id} className="relative">
                {isTopResult && !isSelected && (
                  <Badge className="absolute -top-2 -left-2 z-10 bg-primary" variant="default">
                    Top Match
                  </Badge>
                )}
                
                <Card className={`overflow-hidden transition-all ${isSelected ? 'border-primary shadow-md' : ''}`}>
                  <div className="flex flex-col md:flex-row">
                    <div className="p-6 flex-1">
                      <div className="space-y-3">
                        <div>
                          <h3 className="text-lg font-semibold">{displayResult.title}</h3>
                          <p className="text-sm text-muted-foreground">
                            {displayResult.vendor ? 
                              `${displayResult.vendor.name} • ${displayResult.vendor.location}` : 
                              "Vendor information unavailable"}
                          </p>
                        </div>
                        
                        <p className="text-sm">{displayResult.description}</p>
                        
                        <div className="flex items-center space-x-2">
                          <span className="text-xl font-bold">{displayResult.price}</span>
                          {displayResult.originalPrice && (
                            <span className="text-sm text-muted-foreground line-through">
                              {displayResult.originalPrice}
                            </span>
                          )}
                          {displayResult.discount && (
                            <Badge variant="secondary" className="text-xs">
                              {displayResult.discount}
                            </Badge>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex flex-wrap gap-2 mt-4">
                        {displayResult.availability && (
                          <Badge variant="outline" className="text-xs">
                            Available in {displayResult.availability}
                          </Badge>
                        )}
                        
                        {displayResult.rating && (
                          <Badge variant="outline" className="text-sm flex items-center gap-1">
                            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                            {displayResult.rating.toFixed(1)}{' '}
                            {displayResult.reviews && `(${displayResult.reviews})`}
                          </Badge>
                        )}
                      </div>
                      
                      {isSelected && negotiationResults[result.id]?.success && negotiationResults[result.id]?.negotiatedItems.extraServices && (
                        <div className="mt-4">
                          <h4 className="text-sm font-medium mb-2">Extra Services:</h4>
                          <ul className="space-y-1">
                            {negotiationResults[result.id]?.negotiatedItems.extraServices?.map((service, i) => (
                              <li key={i} className="text-sm flex items-center gap-2">
                                <CheckCircle2 className="h-4 w-4 text-primary" />
                                {service}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                      
                      {isSelected && negotiationResults[result.id]?.success && (
                        <div className="mt-4 p-3 bg-primary/10 rounded-md">
                          <p className="text-sm flex items-center gap-2">
                            <Bot className="h-4 w-4 text-primary" />
                            {negotiationResults[result.id]?.message || 'Negotiation completed'}
                          </p>
                        </div>
                      )}
                    </div>
                    
                    <div className="bg-muted/30 p-6 flex flex-col justify-between">
                      <div className="space-y-4">
                        {isSelected && negotiating ? (
                          <div className="flex flex-col items-center justify-center h-full">
                            <LoaderCircle className="h-8 w-8 text-primary animate-spin mb-2" />
                            <p className="text-sm text-center">Negotiating...</p>
                          </div>
                        ) : (
                          <div className="space-y-4">
                            <Button 
                              variant={isSelected ? "default" : "outline"} 
                              className="w-full"
                              onClick={() => toggleSelectResult(result)}
                              disabled={negotiating || allNegotiationsComplete}
                            >
                              {isSelected ? "Deselect" : "Select for Negotiation"}
                            </Button>
                            
                            <Button 
                              variant="outline" 
                              className="w-full"
                            >
                              Contact Directly
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </Card>
              </div>
            );
          })}
        </div>
        
        {/* Negotiation progress panel */}
        {showNegotiationPanel && (
          <div className="lg:col-span-1">
            <div className="sticky top-20">
              <Card>
                <CardContent className="p-4">
                  <h3 className="text-lg font-semibold mb-4">Negotiation Progress</h3>
                  
                  <div className="space-y-4">
                    {selectedResults.map(result => (
                      <div key={`progress-${result.id}`} className="p-3 border rounded-md">
                        <h4 className="font-medium text-sm">
                          {result.vendor ? result.vendor.name : 'Vendor'}
                        </h4>
                        <div className="flex items-center mt-2">
                          {negotiationProgress[result.id] && negotiationProgress[result.id] !== "Negotiation complete!" ? (
                            <>
                              <LoaderCircle className="h-4 w-4 text-primary animate-spin mr-2" />
                              <p className="text-xs">{negotiationProgress[result.id]}</p>
                            </>
                          ) : (
                            <>
                              <CheckCircle2 className="h-4 w-4 text-green-500 mr-2" />
                              <p className="text-xs">Negotiation complete!</p>
                            </>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  {allNegotiationsComplete && (
                    <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-md">
                      <p className="text-sm font-medium text-center text-green-800">
                        All negotiations complete!
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
