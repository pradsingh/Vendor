
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, Clock, MessageSquare, LoaderCircle, Bot, CheckCircle2 } from "lucide-react";
import NegotiationOptions, { NegotiationOptions as NegotiationOptionsType } from "./negotiation-options";
import { negotiateService, NegotiationResult } from "@/lib/negotiationService";

interface SearchResult {
  id: string;
  title: string;
  description: string;
  price?: string;
  discount?: string;
  type?: string;
  availability?: string;
  rating?: number;
  reviews?: number;
}

interface SearchResultsProps {
  results: SearchResult[];
  isLoading: boolean;
}

export default function SearchResults({ results, isLoading }: SearchResultsProps) {
  const [selectedResult, setSelectedResult] = useState<SearchResult | null>(null);
  const [showNegotiationOptions, setShowNegotiationOptions] = useState(false);
  const [negotiating, setNegotiating] = useState(false);
  const [negotiationResult, setNegotiationResult] = useState<NegotiationResult | null>(null);
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <LoaderCircle className="h-12 w-12 text-primary animate-spin" />
      </div>
    );
  }
  
  if (!results.length) {
    return (
      <Card className="w-full">
        <CardContent className="p-8 flex flex-col items-center justify-center text-center">
          <h3 className="text-lg font-semibold">No results found</h3>
          <p className="text-muted-foreground mt-2">
            Try a different search term or browse popular categories
          </p>
        </CardContent>
      </Card>
    );
  }
  
  // Process results to add availability and sort them by best match
  const processedResults = results.map(result => {
    // Add availability time if not present
    if (!result.availability) {
      // Generate random availability time between 15-120 mins
      const availMinutes = Math.floor(Math.random() * 105) + 15;
      result.availability = `${availMinutes} mins`;
    }
    
    // Add ratings if not present
    if (!result.rating) {
      result.rating = Number((3 + Math.random() * 2).toFixed(1)); // Random rating between 3.0-5.0
    }
    
    // Add review count if not present
    if (!result.reviews) {
      result.reviews = Math.floor(Math.random() * 50) + 5; // Random review count between 5-55
    }
    
    return result;
  });
  
  // Sort by a combination of availability, price and rating to find "best" option
  const sortedResults = [...processedResults].sort((a, b) => {
    // Calculate a score based on availability (lower is better)
    const aAvailMins = parseInt(a.availability?.split(' ')[0] || '999');
    const bAvailMins = parseInt(b.availability?.split(' ')[0] || '999');
    
    // Calculate a score based on price (lower is better)
    const aPrice = parseInt(a.price?.replace(/[^0-9]/g, '') || '999');
    const bPrice = parseInt(b.price?.replace(/[^0-9]/g, '') || '999');
    
    // Calculate overall score (lower is better)
    const aScore = aAvailMins * 0.5 + aPrice * 0.3 - (a.rating || 0) * 20;
    const bScore = bAvailMins * 0.5 + bPrice * 0.3 - (b.rating || 0) * 20;
    
    return aScore - bScore;
  });
  
  const handleNegotiateClick = (result: SearchResult) => {
    setSelectedResult(result);
    setShowNegotiationOptions(true);
    setNegotiationResult(null);
  };
  
  const handleNegotiationSubmit = async (options: NegotiationOptionsType) => {
    if (!selectedResult) return;
    
    setNegotiating(true);
    try {
      const result = await negotiateService(selectedResult.id, options);
      setNegotiationResult(result);
      setShowNegotiationOptions(false);
    } catch (error) {
      console.error("Negotiation failed:", error);
    } finally {
      setNegotiating(false);
    }
  };
  
  const handleNegotiationCancel = () => {
    setShowNegotiationOptions(false);
  };
  
  return (
    <div className="space-y-6">
      {/* Global negotiation section above all results */}
      {results.length > 0 && !negotiationResult?.success && (
        <Card className="border-primary/20">
          <CardContent className="p-6">
            <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
              <div className="space-y-2">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Bot className="h-5 w-5 text-primary" />
                  AI Negotiation
                </h3>
                <p className="text-sm text-muted-foreground">
                  Select a service below and use AI to negotiate for better deals
                </p>
              </div>
              
              {selectedResult && !showNegotiationOptions && (
                <Button 
                  onClick={() => setShowNegotiationOptions(true)}
                  disabled={negotiating}
                >
                  Go for Negotiation
                  <MessageSquare className="ml-2 h-4 w-4" />
                </Button>
              )}
            </div>
            
            {negotiating && (
              <div className="mt-4 flex items-center justify-center p-4 bg-secondary/20 rounded-lg">
                <LoaderCircle className="h-5 w-5 text-primary animate-spin mr-2" />
                <p className="text-sm">Negotiating the best deal for you...</p>
              </div>
            )}
            
            {selectedResult && showNegotiationOptions && (
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
      
      <div className="grid gap-6">
        {sortedResults.map((result, index) => {
          const isTopResult = index === 0;
          const isSelected = selectedResult?.id === result.id;
          
          // Modified result that incorporates negotiation results if applicable
          let displayResult = { ...result };
          if (isSelected && negotiationResult?.success) {
            if (negotiationResult.negotiatedItems.availability) {
              displayResult.availability = negotiationResult.negotiatedItems.availability;
            }
            if (negotiationResult.negotiatedItems.discount) {
              displayResult.discount = negotiationResult.negotiatedItems.discount;
            }
          }
        
        return (
          <div key={result.id} className="relative">
            {isTopResult && !isSelected && !showNegotiationOptions && (
              <Badge className="absolute top-0 right-0 -mt-4 mr-4 z-10" variant="destructive">
                Best Match
              </Badge>
            )}
            
            <Card className={`overflow-hidden transition ${isSelected ? 'ring-2 ring-primary' : ''}`}>
              <CardContent className="p-0">
                <div className="grid sm:grid-cols-[2fr_1fr] gap-4">
                  <div className="p-6">
                    <h3 className="text-xl font-semibold">{displayResult.title}</h3>
                    <p className="mt-2 text-muted-foreground">{displayResult.description}</p>
                    
                    <div className="mt-4 flex flex-wrap gap-3">
                      {displayResult.price && (
                        <Badge variant="outline" className="text-sm">
                          {displayResult.price}
                        </Badge>
                      )}
                      
                      {displayResult.discount && (
                        <Badge variant="secondary" className="text-sm">
                          {displayResult.discount} discount
                        </Badge>
                      )}
                      
                      {displayResult.availability && (
                        <Badge variant="outline" className="text-sm flex items-center gap-1">
                          <Clock className="h-3 w-3" />
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
                    
                    {isSelected && negotiationResult?.success && negotiationResult.negotiatedItems.extraServices && (
                      <div className="mt-4">
                        <h4 className="text-sm font-medium mb-2">Extra Services:</h4>
                        <ul className="space-y-1">
                          {negotiationResult.negotiatedItems.extraServices.map((service, i) => (
                            <li key={i} className="text-sm flex items-center gap-2">
                              <CheckCircle2 className="h-4 w-4 text-primary" />
                              {service}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    
                    {isSelected && negotiationResult?.success && (
                      <div className="mt-4 p-3 bg-primary/10 rounded-md">
                        <p className="text-sm flex items-center gap-2">
                          <Bot className="h-4 w-4 text-primary" />
                          {negotiationResult.message}
                        </p>
                      </div>
                    )}
                  </div>
                  
                  <div className="bg-muted/30 p-6 flex flex-col justify-between">
                    <div className="space-y-4">
                      {isSelected && negotiating ? (
                        <div className="flex flex-col items-center justify-center h-full">
                          <LoaderCircle className="h-8 w-8 text-primary animate-spin mb-2" />
                          <p className="text-sm text-center">Negotiating the best deal for you...</p>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          <Button 
                            variant={isSelected ? "default" : "outline"} 
                            className="w-full"
                            onClick={() => setSelectedResult(isSelected ? null : result)}
                          >
                            {isSelected ? "Deselect" : "Select for Negotiation"}
                          </Button>
                          
                          <Button 
                            variant="outline" 
                            className="w-full"
                          >
                            View Details
                          </Button>
                          
                          <Button 
                            variant="link" 
                            className="w-full"
                          >
                            Contact Directly
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        );
      })}
      </div>
    </div>
  );
}
