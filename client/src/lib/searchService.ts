
import { useQuery } from "@tanstack/react-query";

interface SearchResult {
  id: string;
  title: string;
  description: string;
  price?: string;
  discount?: string;
  type?: string;
  availability?: string;  // Time until service is available
  rating?: number;        // Service rating (0-5)
  reviews?: number;       // Number of reviews
}

export function useSearch(query: string) {
  const enabled = !!query && query.length > 2;

  return useQuery({
    queryKey: [`search-${query}`],
    queryFn: async () => {
      // In a real app, this would be an API call
      // For now, return mock results directly
      return generateMockResults(query);
    },
    enabled: enabled,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

// Mock function to generate fake results until the API is ready
function generateMockResults(query: string): SearchResult[] {
  if (!query || query.trim().length < 3) return [];
  
  // Clean up the query for better mock results
  const cleanQuery = query.toLowerCase().trim();
  
  // Exclude marketing terms from results
  const marketingTerms = ["smart ai negotiation", "real time bargaining", "verified vendors"];
  if (marketingTerms.some(term => cleanQuery.includes(term.toLowerCase()))) {
    return []; // Return empty results for marketing terms
  }
  
  const mockData: Record<string, SearchResult[]> = {
    "plumber": [
      {
        id: "p1",
        title: "Rajesh Plumbing Services",
        description: "Professional plumbing with 10+ years experience. Specializing in pipe repairs, installation and bathroom fixtures.",
        price: "₹500/hr",
        availability: "45 mins",
        rating: 4.7,
        reviews: 32,
        type: "service"
      },
      {
        id: "p2",
        title: "Quick Fix Plumbers",
        description: "Emergency plumbing services available 24/7. Fast response time and quality workmanship guaranteed.",
        price: "₹650/hr",
        availability: "20 mins",
        rating: 4.9,
        reviews: 46,
        type: "service"
      },
      {
        id: "p3",
        title: "City Plumbing Solutions",
        description: "Commercial and residential plumbing. Free inspection and quotes for all new customers.",
        price: "₹450/hr",
        availability: "60 mins",
        rating: 4.5,
        reviews: 28,
        type: "service"
      }
    ],
    "electrician": [
      {
        id: "e1",
        title: "PowerPro Electricians",
        description: "Licensed electricians for all residential and commercial needs. Safety certified and insured professionals.",
        price: "₹600/hr",
        availability: "30 mins",
        rating: 4.8,
        reviews: 42,
        type: "service"
      },
      {
        id: "e2",
        title: "Voltage Masters",
        description: "Specializing in electrical panel upgrades, wiring, and smart home installations. 24/7 emergency service.",
        price: "₹550/hr",
        availability: "45 mins",
        rating: 4.6,
        reviews: 35,
        type: "service"
      },
      {
        id: "e3",
        title: "Reliable Electric",
        description: "Family owned business with 15+ years experience. Residential rewiring, fixtures, and repairs.",
        price: "₹500/hr",
        availability: "60 mins",
        rating: 4.3,
        reviews: 24,
        type: "service"
      }
    ],
    "taxi": [
      {
        id: "t1",
        title: "City Cab Services",
        description: "Reliable taxi service for city travel and airport transfers. Clean cars and professional drivers.",
        price: "₹200/km",
        availability: "10 mins",
        rating: 4.5,
        reviews: 87,
        type: "service"
      },
      {
        id: "t2",
        title: "Premium Airport Transfers",
        description: "Luxury vehicles for airport pick-up and drop-off. Fixed rates and no hidden charges.",
        price: "₹1500 fixed rate",
        availability: "25 mins",
        rating: 4.8,
        reviews: 52,
        type: "service"
      },
      {
        id: "t3",
        title: "Outstation Travel Specialists",
        description: "Comfortable long distance travel services. Experienced drivers and well-maintained vehicles.",
        price: "₹15/km",
        availability: "45 mins",
        rating: 4.6,
        reviews: 38,
        type: "service"
      }
    ],
    "restaurant": [
      {
        id: "r1",
        title: "Spice Garden Restaurant",
        description: "Authentic Indian cuisine with modern twists. Perfect for family dining with vegetarian and non-vegetarian options.",
        price: "₹500 for two",
        availability: "15 mins wait",
        rating: 4.4,
        reviews: 123,
        type: "service"
      },
      {
        id: "r2",
        title: "Oceanfront Seafood",
        description: "Fresh seafood prepared in various international styles. Beautiful ambiance with seafront dining.",
        price: "₹800 for two",
        availability: "30 mins wait",
        rating: 4.7,
        reviews: 95,
        type: "service"
      },
      {
        id: "r3",
        title: "Urban Cafe & Bistro",
        description: "Casual dining with international menu options. Great for breakfast, lunch, and dinner.",
        price: "₹400 for two",
        availability: "No wait",
        rating: 4.2,
        reviews: 78,
        type: "service"
      }
    ]
  };
  
  // Keyword mapping for related searches
  const keywordMap: Record<string, string[]> = {
    "plumber": ["pipe", "leak", "water", "bathroom", "sink", "toilet", "shower", "drain"],
    "electrician": ["wiring", "electrical", "power", "outlet", "switch", "light", "circuit", "breaker"],
    "taxi": ["cab", "ride", "driver", "car", "transport", "travel", "trip", "airport", "transfer"],
    "restaurant": ["food", "dinner", "lunch", "eat", "meal", "cuisine", "dining", "takeout", "delivery"],
    "handyman": ["repair", "fix", "install", "home", "house", "maintenance", "assembly"],
    "mechanic": ["car", "auto", "vehicle", "repair", "service", "engine", "maintenance"]
  };
  
  // First check exact category matches
  for (const category in mockData) {
    if (cleanQuery.includes(category)) {
      return mockData[category];
    }
  }
  
  // Then check keyword matches
  for (const category in keywordMap) {
    if (keywordMap[category].some(keyword => cleanQuery.includes(keyword))) {
      return mockData[category] || [];
    }
  }
  
  // If no specific matches, return general results
  const generalResults: SearchResult[] = [
    {
      id: "g1",
      title: `${query} - Available Services`,
      description: `Top rated services for "${query}" with verified professionals and best market rates.`,
      price: "₹500",
      availability: "30 mins",
      rating: 4.8,
      reviews: 42,
      type: "service"
    },
    {
      id: "g2",
      title: `${query} Solutions`,
      description: `Expert assistance for ${query} with guaranteed customer satisfaction.`,
      price: "₹450",
      availability: "45 mins",
      rating: 4.5,
      reviews: 36,
      type: "service"
    },
    {
      id: "g3",
      title: `Budget ${query} Options`,
      description: `Affordable and reliable ${query} services for every need and budget.`,
      price: "₹350",
      availability: "60 mins",
      rating: 4.2,
      reviews: 28,
      type: "service"
    }
  ];
  
  return generalResults;
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
