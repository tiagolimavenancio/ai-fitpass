"use client";

import { useState, useEffect, useCallback } from "react";
import { MapPinIcon, SearchIcon, LoaderIcon, XIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { useDebounce } from "@/lib/hooks/useDebounce";

export interface AddressResult {
  lat: number;
  lng: number;
  address: string;
  street?: string;
  city?: string;
  postcode?: string;
  country?: string;
}

interface GeoapifyProperties {
  formatted: string;
  address_line1?: string;
  city?: string;
  country?: string;
  postcode?: string;
  state?: string;
  lon: number;
  lat: number;
  place_id: string;
}

interface GeoapifyFeature {
  type: "Feature";
  properties: GeoapifyProperties;
  geometry: {
    type: "Point";
    coordinates: [number, number];
  };
  bbox?: [number, number, number, number];
}

function extractAddressComponents(properties: GeoapifyProperties) {
  return {
    street: properties.address_line1 || "",
    city: properties.city || "",
    postcode: properties.postcode || "",
    country: properties.country || "",
  };
}

interface AddressSearchProps {
  value?: AddressResult | null;
  onChange: (value: AddressResult | null) => void;
  placeholder?: string;
  className?: string;
}

export function AddressSearch({
  value,
  onChange,
  placeholder = "Search for an address...",
  className,
}: AddressSearchProps) {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<GeoapifyFeature[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const debouncedQuery = useDebounce(query, 300);

  const searchAddress = useCallback(async (searchQuery: string) => {
    if (searchQuery.length < 3) {
      setSuggestions([]);
      return;
    }

    const token = process.env.NEXT_PUBLIC_GEOAPIFY_API_KEY;
    if (!token) {
      console.error("Geoapify API key not configured");
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(
        `https://api.geoapify.com/v1/geocode/search?text=${encodeURIComponent(
          searchQuery,
        )}&apiKey=${token}`,
      );
      const data = await response.json();
      setSuggestions(data.features || []);
    } catch (error) {
      console.error("Error fetching address:", error);
      setSuggestions([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Trigger search when debounced query changes
  useEffect(() => {
    searchAddress(debouncedQuery);
  }, [debouncedQuery, searchAddress]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  const handleSelect = (feature: GeoapifyFeature) => {
    const { properties, geometry } = feature;
    const [lng, lat] = geometry.coordinates;
    const components = extractAddressComponents(properties);
    onChange({
      lat,
      lng,
      address: properties.formatted,
      ...components,
    });
    setQuery(properties.formatted);
    setSuggestions([]);
    setIsFocused(false);
  };

  const handleClear = () => {
    onChange(null);
    setQuery("");
    setSuggestions([]);
  };

  const isSearching = query !== debouncedQuery;

  return (
    <div className={cn("relative", className)}>
      <div className="relative">
        <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input
          type="text"
          value={query || value?.address || ""}
          onChange={handleInputChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setTimeout(() => setIsFocused(false), 200)}
          placeholder={placeholder}
          className="w-full rounded-lg border border-input bg-background py-3 pl-10 pr-10 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
        />
        {(isLoading || isSearching) && (
          <LoaderIcon className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin text-muted-foreground" />
        )}
        {!isLoading && !isSearching && value && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            <XIcon className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Suggestions dropdown */}
      {isFocused && suggestions.length > 0 && (
        <div className="absolute z-50 mt-1 w-full rounded-lg border bg-popover shadow-lg">
          {suggestions.map((suggestion) => (
            <button
              key={suggestion.properties.place_id}
              type="button"
              onClick={() => handleSelect(suggestion)}
              className="flex w-full items-start gap-3 px-4 py-3 text-left text-sm first:rounded-t-lg last:rounded-b-lg hover:bg-accent"
            >
              <MapPinIcon className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
              <span className="line-clamp-2">{suggestion.properties.formatted}</span>
            </button>
          ))}
        </div>
      )}

      {/* Selected address display */}
      {value && !isFocused && !query && (
        <div className="mt-3 flex items-start gap-3 rounded-lg border border-green-200 bg-green-50 p-3 dark:border-green-900 dark:bg-green-950">
          <MapPinIcon className="mt-0.5 h-4 w-4 shrink-0 text-green-600 dark:text-green-400" />
          <div className="flex-1">
            <p className="text-sm font-medium text-green-800 dark:text-green-200">
              Selected Location
            </p>
            <p className="text-sm text-green-700 dark:text-green-300">
              {value.address}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
