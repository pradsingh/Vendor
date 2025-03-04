import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Bot } from "lucide-react";

interface SearchSuggestionsProps {
  query: string;
  isOpen: boolean;
}

export default function SearchSuggestions({ query, isOpen }: SearchSuggestionsProps) {
  const [suggestions, setSuggestions] = useState<string[]>([]);

  // Mock suggestions based on query
  useEffect(() => {
    if (!query) {
      setSuggestions([]);
      return;
    }

    // Mock AI suggestions
    const mockSuggestions = [
      `Find best ${query} services near me`,
      `Compare prices for ${query}`,
      `Negotiate rates for ${query} services`,
      `Top rated ${query} providers`,
      `Best deals on ${query}`,
    ];

    setSuggestions(mockSuggestions);
  }, [query]);

  if (!isOpen || !query) return null;

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
            {suggestions.map((suggestion, index) => (
              <motion.div
                key={suggestion}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.2, delay: index * 0.05 }}
              >
                <button
                  className="w-full px-4 py-2 text-left flex items-center gap-2 rounded-lg hover:bg-secondary transition-colors"
                  onClick={() => {
                    // Handle suggestion click
                  }}
                >
                  <Bot className="h-4 w-4 text-primary" />
                  <span>{suggestion}</span>
                </button>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </Card>
    </motion.div>
  );
}
