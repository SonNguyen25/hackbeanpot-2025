"use client";

import { useEffect, useState, useCallback } from "react";
import { GoogleMap, LoadScript, Marker, InfoWindow, DirectionsRenderer, Autocomplete } from "@react-google-maps/api";

const mapContainerStyle = {
  width: "75%",
  height: "100vh",
};

const defaultCenter = {
  lat: 37.7749, // San Francisco (Default)
  lng: -122.4194,
};

const googleMapsApiKey = "AIzaSyAnJwodEb-frtGzHXwB8-bI9Gtrt20zlxU"; // Replace with your API Key

// 🖤 **Dark Themed Google Maps Style**
const customMapStyle = [
  { elementType: "geometry", stylers: [{ color: "#000000" }] },
  { elementType: "labels.text.fill", stylers: [{ color: "#A0A0A0" }] },
  { elementType: "labels.text.stroke", stylers: [{ color: "#000000" }] },
  { featureType: "road", elementType: "geometry", stylers: [{ color: "#1C1C1C" }] },
  { featureType: "road", elementType: "labels.text.fill", stylers: [{ color: "#A0A0A0" }] },
  { featureType: "water", elementType: "geometry.fill", stylers: [{ color: "#121212" }] },
  { featureType: "poi", elementType: "geometry.fill", stylers: [{ color: "#191919" }] },
  { featureType: "landscape", elementType: "geometry.fill", stylers: [{ color: "#101010" }] },
];

export default function GoogleMapComponent() {
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [locations, setLocations] = useState([]);
  const [directions, setDirections] = useState(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [userLocation, setUserLocation] = useState(null);
  const [destination, setDestination] = useState("");
  const [autocompleteRef, setAutocompleteRef] = useState(null);
  const [error, setError] = useState("");

  // 🛑 **Get User's Location for "From" Input**
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => console.error("Error getting user location:", error)
      );
    }
  }, []);

  const fetchEcoFriendlyPlaces = useCallback(async () => {
    if (!userLocation || !destination || !directions) return; // ✅ Ensures valid input
  
    if (typeof window !== "undefined" && window.google?.maps) {
      const map = new window.google.maps.Map(document.createElement("div"));
      const service = new window.google.maps.places.PlacesService(map);
      const directionsService = new window.google.maps.DirectionsService();
  
      const ecoFriendlyKeywords = ["eco-friendly", "sustainable", "green", "organic"];
      const searchTypes = ["lodging", 
      "restaurant",
      "gas_station", 
      "charging_station", 
      "supermarket",
      "park",
      "tourist_attraction"];
      let allPlaces = [];
  
      try {
        console.log("📌 Fetching waypoints from directions...");
  
        // ✅ Convert destination to LatLng if needed
        let destinationLatLng;
        if (typeof destination === "string") {
          const geocoder = new window.google.maps.Geocoder();
          const geoResponse = await new Promise((resolve, reject) => {
            geocoder.geocode({ address: destination }, (results, status) => {
              if (status === window.google.maps.GeocoderStatus.OK) {
                resolve(results[0].geometry.location);
              } else {
                reject(new Error("Failed to convert destination to LatLng"));
              }
            });
          });
  
          destinationLatLng = { lat: geoResponse.lat(), lng: geoResponse.lng() };
        } else {
          destinationLatLng = destination;
        }
  
        // ✅ Keep ALL waypoints (no reduction in number)
        const waypoints = directions.routes[0].legs[0].steps.map((step) => ({
          location: { lat: step.end_location.lat(), lng: step.end_location.lng() },
          stopover: true,
        }));
  
        // ✅ Locations to Search: Start, Destination, & All Waypoints
        const locationsToSearch = [
          { location: { lat: userLocation.lat, lng: userLocation.lng }, label: "Start" },
          { location: destinationLatLng, label: "Destination" },
          ...waypoints.map((wp) => ({ location: wp.location, label: "Waypoint" })),
        ];
  
        console.log(`🔍 Searching eco-friendly locations near ${locationsToSearch.length} points...`);
  
        // ✅ Parallelize API Calls Using `Promise.all()`
        const placeSearchPromises = locationsToSearch.map((searchArea) => {
          if (!searchArea.location || isNaN(searchArea.location.lat) || isNaN(searchArea.location.lng)) {
            console.warn(`⚠️ Invalid location found at ${searchArea.label}, skipping.`);
            return Promise.resolve([]);
          }
  
          return Promise.all(
            searchTypes.map((type) =>
              new Promise((resolve) => {
                service.nearbySearch(
                  {
                    location: searchArea.location,
                    radius: 3000, // ✅ Keeping original radius of 5km
                    type: type,
                    keyword: ecoFriendlyKeywords.join(" "),
                  },
                  (results, status) => {
                    if (status === window.google.maps.places.PlacesServiceStatus.OK) {
                      console.log(`✅ Found ${results.length} places near ${searchArea.label}`);
                      resolve(results);
                    } else {
                      console.warn(`⚠️ No results found near ${searchArea.label}`);
                      resolve([]);
                    }
                  }
                );
              })
            )
          );
        });
  
        // ✅ Wait for all searches to finish (runs in parallel)
        const searchResults = await Promise.all(placeSearchPromises);
  
        // ✅ Flatten array and store unique places
        allPlaces = searchResults.flat(2); // Flattens nested arrays from Promise.all()
  
        console.log(`🌱 Total Eco-Friendly Places Found: ${allPlaces.length}`);
        setLocations(allPlaces);
      } catch (error) {
        console.error("❌ Error fetching eco-friendly places:", error);
      }
    }
  }, [userLocation, destination, directions]);
  
  
  

  // ✅ **Fetch Directions Based on User Input**
  const fetchDirections = useCallback(async () => {
    if (!userLocation || !destination) {
      setError("Please enter a valid destination.");
      return;
    }

    if (typeof window !== "undefined" && window.google?.maps) {
      const directionsService = new window.google.maps.DirectionsService();

      const request = {
        origin: userLocation,
        destination: destination,
        travelMode: window.google.maps.TravelMode.DRIVING,
      };

      directionsService.route(request, (result, status) => {
        if (status === window.google.maps.DirectionsStatus.OK) {
          setDirections(result);
          setError(""); // Clear error if successful
        } else {
          console.error("Error fetching directions:", status);
          setError("No route found. Please enter a valid address.");
        }
      });
    }
  }, [userLocation, destination]);

  useEffect(() => {
    if (mapLoaded) {
      fetchEcoFriendlyPlaces();
    }
  }, [mapLoaded, fetchEcoFriendlyPlaces]);

  return (
    <LoadScript googleMapsApiKey={googleMapsApiKey} libraries={["places"]} onLoad={() => setMapLoaded(true)}>
      <div className="absolute top-4 left-4 z-50 bg-white p-4 rounded-lg shadow-lg w-80">
        <h3 className="font-bold mb-2">Get Directions</h3>
        <div>
          <label className="text-gray-700">From:</label>
          <input
            type="text"
            value={userLocation ? "Your Location" : "Fetching Location..."}
            readOnly
            className="w-full p-2 rounded border-gray-300"
          />
        </div>
        <div className="mt-2">
          <label className="text-gray-700">To:</label>
          <Autocomplete
            onLoad={(auto) => setAutocompleteRef(auto)}
            onPlaceChanged={() => {
              if (autocompleteRef) {
                setDestination(autocompleteRef.getPlace().formatted_address);
              }
            }}
          >
            <input
              type="text"
              placeholder="Enter Destination"
              className="w-full p-2 rounded border-gray-300"
            />
          </Autocomplete>
        </div>
        <button
          onClick={fetchDirections}
          className="bg-green-600 text-white px-4 py-2 rounded-md mt-3 hover:bg-green-700 transition w-full"
        >
          Get Route
        </button>
        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
      </div>

      <GoogleMap mapContainerStyle={mapContainerStyle} center={defaultCenter} zoom={12} options={{ styles: customMapStyle }}>
        {/* User's Current Location */}
        {userLocation && (
          <Marker
            position={userLocation}
            icon={{
              url: "/car2.png", // Use a custom car icon image
              scaledSize: new window.google.maps.Size(50, 50), // Adjust size
              anchor: new window.google.maps.Point(25, 25), // Centering the icon
            }}
          />
        )}

        {/* Eco-friendly locations with custom markers */}
        {locations.map((place, index) => (
          <Marker
            key={index}
            position={place.geometry.location}
            title={place.name}
            onClick={() => setSelectedLocation(place)}
            icon={{
              path: window.google?.maps.SymbolPath.CIRCLE,
              scale: 10,
              fillColor: "#16A34A",
              fillOpacity: 1,
              strokeWeight: 2,
              strokeColor: "#16A34A",
            }}
          />
        ))}

        {/* Popup (InfoWindow) that appears when a marker is clicked */}
        {selectedLocation && (
        <InfoWindow
        position={selectedLocation.geometry.location}
        onCloseClick={() => setSelectedLocation(null)}
      >
        <div className="p-4 bg-black text-white rounded-lg shadow-lg max-w-xs">
          {/* Display Image if Available */}
          {selectedLocation.photos && selectedLocation.photos.length > 0 && (
            <img
              src={selectedLocation.photos[0].getUrl()}
              alt={selectedLocation.name}
              className="w-full h-32 object-cover rounded-md mb-3"
            />
          )}
      
          <h3 className="text-lg font-bold text-green-400">{selectedLocation.name}</h3>
          <p className="text-sm opacity-75 text-green-500">{selectedLocation.vicinity || "No Address Available"}</p>
      
          {/* Display Rating if Available */}
          {selectedLocation.rating && (
            <p className="text-sm mt-1 text-green-400">
              ⭐ {selectedLocation.rating} / 5
            </p>
          )}
      
          {/* Display Opening Hours if Available */}
          {selectedLocation.opening_hours && selectedLocation.opening_hours.weekday_text && (
            <div className="mt-2">
              <p className="text-xs text-green-400">Open Hours:</p>
              <ul className="text-xs opacity-75">
                {selectedLocation.opening_hours.weekday_text.map((day, index) => (
                  <li key={index}>{day}</li>
                ))}
              </ul>
            </div>
          )}
      
          {/* Website Link */}
          {selectedLocation.website && (
            <a
              href={selectedLocation.website}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-blue-400 underline mt-2 block"
            >
              Visit Website
            </a>
          )}
        </div>
      </InfoWindow>
      
        )}

        {/* Display Route */}
        {directions && (
          <DirectionsRenderer
            directions={directions}
            options={{
              polylineOptions: {
                strokeColor: "#16A34A",
                strokeWeight: 6,
                strokeOpacity: 0.8,
              },
            }}
          />
        )}
      </GoogleMap>
    </LoadScript>
  );
}
