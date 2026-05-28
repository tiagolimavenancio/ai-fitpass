"use client";

import { useCallback, useState } from "react";
import { Stack, TextInput, Card, Text, Button } from "@sanity/ui";
import { set, unset } from "sanity";
import type { ObjectInputProps } from "sanity";

interface AddressValue {
  fullAddress?: string;
  street?: string;
  city?: string;
  postcode?: string;
  country?: string;
  lat?: number;
  lng?: number;
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

export function MapboxAddressInput(props: ObjectInputProps) {
  const { value, onChange } = props;
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<GeoapifyFeature[]>([]);
  const [isLoading, setIsLoading] = useState(false);

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
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleInputChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const newQuery = event.target.value;
      setQuery(newQuery);

      // Debounce the search
      const timeoutId = setTimeout(() => {
        searchAddress(newQuery);
      }, 300);

      return () => clearTimeout(timeoutId);
    },
    [searchAddress],
  );

  const handleSelect = useCallback(
    (feature: GeoapifyFeature) => {
      const { properties, geometry } = feature;
      const components = extractAddressComponents(properties);
      const [lng, lat] = geometry.coordinates;

      onChange(
        set({
          fullAddress: properties.formatted,
          ...components,
          lat,
          lng,
        }),
      );

      setQuery(properties.formatted);
      setSuggestions([]);
    },
    [onChange],
  );

  const handleClear = useCallback(() => {
    onChange(unset());
    setQuery("");
    setSuggestions([]);
  }, [onChange]);

  const currentAddress = value as AddressValue | undefined;

  return (
    <Stack space={3}>
      <TextInput
        value={query || currentAddress?.fullAddress || ""}
        onChange={handleInputChange}
        placeholder="Start typing an address..."
      />

      {isLoading && (
        <Text size={1} muted>
          Searching...
        </Text>
      )}

      {suggestions.length > 0 && (
        <Card padding={2} radius={2} shadow={1}>
          <Stack space={2}>
            {suggestions.map((suggestion) => (
              <Button
                key={suggestion.properties.place_id}
                mode="ghost"
                onClick={() => handleSelect(suggestion)}
                style={{ textAlign: "left", width: "100%" }}
              >
                <Text size={1}>{suggestion.properties.formatted}</Text>
              </Button>
            ))}
          </Stack>
        </Card>
      )}

      {currentAddress?.fullAddress && (
        <Stack space={2}>
          <Card padding={3} radius={2} tone="positive">
            <Stack space={2}>
              <Text size={1} weight="semibold">
                Selected Address:
              </Text>
              <Text size={1}>{currentAddress.fullAddress}</Text>
              {currentAddress.city && (
                <Text size={1} muted>
                  City: {currentAddress.city}
                </Text>
              )}
              {currentAddress.postcode && (
                <Text size={1} muted>
                  Postcode: {currentAddress.postcode}
                </Text>
              )}
              {currentAddress.lat && currentAddress.lng && (
                <Text size={1} muted>
                  Coordinates: {currentAddress.lat.toFixed(4)},{" "}
                  {currentAddress.lng.toFixed(4)}
                </Text>
              )}
            </Stack>
          </Card>
          <Button mode="ghost" tone="critical" onClick={handleClear}>
            Clear Address
          </Button>
        </Stack>
      )}
    </Stack>
  );
}
