import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Bot } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";

interface SearchSuggestionsProps {
  query: string;
  isOpen: boolean;
  searchResults?: any[]; // Make this optional
  onSuggestionClick: (suggestion: string) => void;
}

export default function SearchSuggestions({ 
  query, 
  isOpen, 
  searchResults = [], // Provide default empty array
  onSuggestionClick 
}: SearchSuggestionsProps) {
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (query.length < 3 || !isOpen) {
      setSuggestions([]);
      setLoading(false);
      return;
    }

    const fetchSuggestions = async () => {
      setLoading(true);
      try {
        const results = await suggestionsApi(query);
        setSuggestions(results);
      } catch (error) {
        console.error("Error fetching suggestions:", error);
        setSuggestions([]);
      } finally {
        setLoading(false);
      }
    };

    // Only fetch suggestions if no search results are provided
    if (!searchResults || searchResults.length === 0) {
      const timeout = setTimeout(fetchSuggestions, 300);
      return () => clearTimeout(timeout);
    } else {
      setLoading(false);
    }
  }, [query, isOpen, searchResults]);

  if (!isOpen || !query || query.length < 3) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.15 }}
      className="absolute left-0 right-0 top-full mt-2 z-50"
    >
      <Card className="overflow-hidden">
        <div className="p-2 space-y-1">
          <AnimatePresence mode="popLayout">
            {loading ? (
              <div className="space-y-2">
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-8 w-full" />
              </div>
            ) : searchResults.length > 0 ? (
              // Display search results if available
              searchResults.map((result, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.2, delay: index * 0.05 }}
                >
                  <Button
                    className="w-full px-4 py-2 text-left flex items-center gap-2 rounded-lg hover:bg-secondary transition-colors"
                    variant="ghost"
                    onClick={() => onSuggestionClick(JSON.stringify(result))}
                  >
                    <span>{result.title || result.name || "Result " + (index + 1)}</span>
                  </Button>
                </motion.div>
              ))
            ) : suggestions.length > 0 ? (
              suggestions.map((suggestion, index) => (
                <motion.div
                  key={suggestion}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.2, delay: index * 0.05 }}
                >
                  <Button
                    className="w-full px-4 py-2 text-left flex items-center gap-2 rounded-lg hover:bg-secondary transition-colors"
                    variant="ghost"
                    onClick={() => onSuggestionClick(suggestion)}
                  >
                    <Bot className="h-4 w-4 text-primary" />
                    <span>{suggestion}</span>
                  </Button>
                </motion.div>
              ))
            ) : (
              <div className="p-2 text-sm text-muted-foreground">
                No suggestions found
              </div>
            )}
          </AnimatePresence>
        </div>
      </Card>
    </motion.div>
  );
}

// Suggestions API - provides smart search suggestions
export const suggestionsApi = async (query: string): Promise<string[]> => {
  // Simulate API call with a delay
  await new Promise((resolve) => setTimeout(resolve, 500));

  // Keywords that generate specialized suggestions
  const keywords = {
    "plumber": ["fix leaking pipe", "bathroom renovation", "install new sink", "water heater repair"],
    "electrician": ["ceiling fan installation", "fix wiring issue", "lighting upgrade", "circuit breaker repair"],
    "taxi": ["airport transfer", "city tour", "outstation trip", "hourly city cab"],
    "restaurant": ["dinner reservation", "lunch buffet", "family dining", "outdoor seating"],
    "handyman": ["furniture assembly", "home repairs", "painting service", "door installation"],
    "mechanic": ["car service", "engine repair", "wheel alignment", "brake replacement"]
  };

  // Clean up the query
  const cleanQuery = query.toLowerCase().trim();

  // Check for keyword matches
  for (const [category, suggestions] of Object.entries(keywords)) {
    if (cleanQuery.includes(category)) {
      return suggestions.map(s => `${s} - ${category} service`);
    }
  }

  // Default suggestions
  return [
    `${query} services near me`,
    `Best ${query} in town`,
    `Affordable ${query} options`,
    `${query} with discounts`,
    `Top rated ${query} professionals`
  ];
};