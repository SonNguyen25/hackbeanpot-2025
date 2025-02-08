"use client";

import { useEffect, useState, useCallback  } from "react";
import { GoogleMap, LoadScript, Marker, DirectionsRenderer } from "@react-google-maps/api";

const mapContainerStyle = {
  width: "100%",
  height: "500px",
};

const defaultCenter = {
  lat: 37.7749, // San Francisco (Default)
  lng: -122.4194,
};

const googleMapsApiKey = "AIzaSyAnJwodEb-frtGzHXwB8-bI9Gtrt20zlxU"; // Replace with your API Key

// 🌿 Eco-Friendly Green Themed Map Style
const customMapStyle = [
  {
    elementType: "geometry",
    stylers: [{ color: "#5E60CE" }], // Purple-Blue Base
  },
  {
    elementType: "labels.text.fill",
    stylers: [{ color: "#80FFDB" }], // Light Mint Labels
  },
  {
    elementType: "labels.text.stroke",
    stylers: [{ color: "#5E60CE" }], // Dark Purple Outline
  },
  {
    featureType: "water",
    elementType: "geometry.fill",
    stylers: [{ color: "#48BFE3" }], // Sky Blue Water
  },
  {
    featureType: "road",
    elementType: "geometry",
    stylers: [{ color: "#4EA8DE" }], // Light Blue Roads
  },
  {
    featureType: "road",
    elementType: "labels.text.fill",
    stylers: [{ color: "#72EFDD" }], // Very Light Teal Road Labels
  },
  {
    featureType: "landscape",
    elementType: "geometry.fill",
    stylers: [{ color: "#56CFE1" }], // Light Teal Land
  },
  {
    featureType: "poi",
    elementType: "geometry.fill",
    stylers: [{ color: "#64DFDF" }], // Lighter Teal POIs
  },
];


export default function GoogleMapComponent() {
  const [locations, setLocations] = useState([]);
  const [directions, setDirections] = useState(null);
  const [mapLoaded, setMapLoaded] = useState(false); // ✅ Ensure API is loaded

  const fetchEcoFriendlyPlaces = useCallback(async () => {
    if (typeof window !== "undefined" && window.google?.maps) {
      const map = new window.google.maps.Map(document.createElement("div"));
      const service = new window.google.maps.places.PlacesService(map);

      const ecoFriendlyKeywords = ["eco-friendly", "sustainable", "green", "organic"];
      const searchTypes = ["lodging", "restaurant", "gas_station"];

      let allPlaces = [];

      for (const type of searchTypes) {
        await new Promise((resolve) => {
          service.nearbySearch(
            {
              location: defaultCenter,
              radius: 7000, // Search within 7km
              type: type,
              keyword: ecoFriendlyKeywords.join(" "),
            },
            (results, status) => {
              if (status === window.google.maps.places.PlacesServiceStatus.OK) {
                allPlaces = [...allPlaces, ...results];
              }
              resolve();
            }
          );
        });
      }

      setLocations(allPlaces);
    }
  }, []);

  const fetchDirections = useCallback(async () => {
    if (typeof window !== "undefined" && window.google?.maps) {
      const directionsService = new window.google.maps.DirectionsService();

      const request = {
        origin: { lat: 37.419734, lng: -122.0827784 },
        destination: { lat: 37.417670, lng: -122.079595 },
        travelMode: window.google.maps.TravelMode.DRIVING,
      };

      directionsService.route(request, (result, status) => {
        if (status === window.google.maps.DirectionsStatus.OK) {
          setDirections(result);
        } else {
          console.error("Error fetching directions", status);
        }
      });
    }
  }, []);

  useEffect(() => {
    if (mapLoaded) {
      fetchEcoFriendlyPlaces();
      fetchDirections();
    }
  }, [mapLoaded, fetchEcoFriendlyPlaces, fetchDirections]);

  return (
    <LoadScript
      googleMapsApiKey={googleMapsApiKey}
      libraries={["places"]}
      onLoad={() => setMapLoaded(true)} // ✅ Only load map when API is ready
    >
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        center={defaultCenter}
        zoom={12}
        options={{ styles: customMapStyle }} // ✅ Apply Green Themed Style
      >
        {/* Eco-friendly locations as markers */}
        {locations.map((place, index) => (
          <Marker key={index} position={place.geometry.location} title={place.name} />
        ))}

        {/* Route rendering */}
        {directions && <DirectionsRenderer directions={directions} />}
      </GoogleMap>
    </LoadScript>
  );
}