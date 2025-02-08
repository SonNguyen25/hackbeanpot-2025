"use client";

import { useEffect, useState } from "react";
import { GoogleMap, LoadScript, Marker, DirectionsRenderer } from "@react-google-maps/api";

const mapContainerStyle = {
  width: "100%",
  height: "500px",
};

const defaultCenter = {
  lat: 37.7749, // Default: San Francisco
  lng: -122.4194,
};

const googleMapsApiKey = "AIzaSyAnJwodEb-frtGzHXwB8-bI9Gtrt20zlxU"; 

export default function GoogleMapComponent() {
  const [locations, setLocations] = useState([]);
  const [directions, setDirections] = useState(null);

  useEffect(() => {
    const fetchEcoFriendlyPlaces = async () => {
      if (typeof window !== "undefined" && google?.maps) {
        const map = new google.maps.Map(document.createElement("div"));
        const service = new google.maps.places.PlacesService(map);

        const ecoFriendlyKeywords = ["eco-friendly", "sustainable", "green", "organic"];
        const searchTypes = ["lodging", "restaurant"];

        let allPlaces = [];

        for (const type of searchTypes) {
          await new Promise((resolve) => {
            service.nearbySearch(
              {
                location: defaultCenter,
                radius: 5000, // Search within 5km
                type: type,
                keyword: ecoFriendlyKeywords.join(" "),
              },
              (results, status) => {
                if (status === google.maps.places.PlacesServiceStatus.OK) {
                  allPlaces = [...allPlaces, ...results];
                }
                resolve();
              }
            );
          });
        }

        setLocations(allPlaces);
      }
    };

    const fetchDirections = async () => {
      if (typeof window !== "undefined" && google?.maps) {
        const directionsService = new google.maps.DirectionsService();

        const request = {
          origin:{
            "location":{
              "latLng":{
                "latitude": 37.419734,
                "longitude": -122.0827784
              }
            }
          },
          destination:{
            "location":{
              "latLng":{
                "latitude": 37.417670,
                "longitude": -122.079595
              }
            }
          },
          travelMode: google.maps.TravelMode.DRIVING, // Options: DRIVING, WALKING, BICYCLING, TRANSIT
        };

        directionsService.route(request, (result, status) => {
          if (status === google.maps.DirectionsStatus.OK) {
            setDirections(result);
          } else {
            console.error("Error fetching directions", status);
          }
        });
      }
    };

    fetchEcoFriendlyPlaces();
    fetchDirections();
  }, []);

  return (
    <LoadScript googleMapsApiKey={googleMapsApiKey} libraries={["places"]}>
      <GoogleMap mapContainerStyle={mapContainerStyle} center={defaultCenter} zoom={6}>
        {/* Markers for eco-friendly hotels & restaurants */}
        {locations.map((place, index) => (
          <Marker key={index} position={place.geometry.location} title={place.name} />
        ))}

        {/* Route from origin to destination */}
        {directions && <DirectionsRenderer directions={directions} />}
      </GoogleMap>
    </LoadScript>
  );
}
