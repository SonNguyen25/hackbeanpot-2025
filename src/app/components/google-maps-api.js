"use client";

import { useEffect, useState, useCallback } from "react";
import {
  GoogleMap,
  LoadScriptNext,
  Marker,
  InfoWindow,
  DirectionsRenderer,
  Autocomplete,
} from "@react-google-maps/api";

const mapContainerStyle = {
  width: "100%",
  height: "90vh",
};

const defaultCenter = {
  lat: 37.7749, // San Francisco (Default)
  lng: -122.4194,
};

const googleMapsApiKey = "AIzaSyAnJwodEb-frtGzHXwB8-bI9Gtrt20zlxU"; // Replace with your API Key

const customMapStyle = [
  { elementType: "geometry", stylers: [{ color: "#000000" }] },
  { elementType: "labels.text.fill", stylers: [{ color: "#A0A0A0" }] },
  { elementType: "labels.text.stroke", stylers: [{ color: "#000000" }] },
  {
    featureType: "road",
    elementType: "geometry",
    stylers: [{ color: "#1C1C1C" }],
  },
  {
    featureType: "road",
    elementType: "labels.text.fill",
    stylers: [{ color: "#A0A0A0" }],
  },
  {
    featureType: "water",
    elementType: "geometry.fill",
    stylers: [{ color: "#121212" }],
  },
  {
    featureType: "poi",
    elementType: "geometry.fill",
    stylers: [{ color: "#191919" }],
  },
  {
    featureType: "landscape",
    elementType: "geometry.fill",
    stylers: [{ color: "#101010" }],
  },
];

const controlStyles = `
  /* Main container */
  .gmnoprint.gm-style-mtc-bbw {
    background-color: #000000 !important;
  }

  /* Buttons */
  .gm-style-mtc button {
    background-color: #000000 !important;
    color: #22C55E !important;
    font-family: Roboto, Arial, sans-serif !important;
    box-shadow: 0 1px 4px -1px rgba(0,0,0,0.3) !important;
  }

  /* Button hover state */
  .gm-style-mtc button:hover {
    background-color: #1a1a1a !important;
  }

  /* Dropdown menu */
  .gm-style-mtc ul {
    background-color: #000000 !important;
    border: 1px solid #22C55E !important;
    box-shadow: 0 1px 4px -1px rgba(0,0,0,0.3) !important;
  }

  /* Menu items */
  .gm-style-mtc ul li {
    background-color: #000000 !important;
    color: #22C55E !important;
  }

  /* Menu item hover */
  .gm-style-mtc ul li:hover {
    background-color: #1a1a1a !important;
  }

  /* Checkbox menu items */
  .ssQIHO-checkbox-menu-item {
    background-color: #000000 !important;
    color: #22C55E !important;
  }

  /* Labels */
  .gm-style-mtc label {
    color: #22C55E !important;
  }

  /* SVG icons in checkboxes */
  .ssQIHO-checkbox-menu-item span span {
    filter: invert(72%) sepia(40%) saturate(599%) hue-rotate(84deg) brightness(93%) contrast(89%) !important;
  }

  /* All other map controls */
  .gm-bundled-control .gmnoprint > div,
  .gm-bundled-control .gmnoprint > div > div {
    background-color: #000000 !important;
    color: #22C55E !important;
    border: 1px solid #22C55E !important;
  }

  /* Control buttons */
  .gm-bundled-control button {
   filter: invert(1) hue-rotate(180deg) !important;
  }

  /* Selected state */
  .gm-style-mtc button[aria-checked="true"] {
    color: #22C55E !important;
    font-weight: 500 !important;
  }
`;

const routeColors = ["#FF0000", "#0000FF", "#800080", "#FFA500"];

export default function GoogleMapComponent() {
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [locations, setLocations] = useState([]);
  const [directions, setDirections] = useState(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [userLocation, setUserLocation] = useState(null);
  const [destination, setDestination] = useState("");
  const [autocompleteRef, setAutocompleteRef] = useState(null);
  const [error, setError] = useState("");
  const [stops, setStops] = useState([]);
  const [stopInputRef, setStopInputRef] = useState(null);
  const [earnedCoins, setEarnedCoins] = useState({});
  const [carbonFootprint, setCarbonFootprint] = useState(null);

  useEffect(() => {
    const style = document.createElement("style");
    style.textContent = controlStyles;
    document.head.appendChild(style);

    return () => {
      if (style.parentNode) {
        style.parentNode.removeChild(style);
      }
    };
  }, []);

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
    if (!userLocation || !destination || !directions) return;

    if (typeof window !== "undefined" && window.google?.maps) {
      const map = new window.google.maps.Map(document.createElement("div"));
      const service = new window.google.maps.places.PlacesService(map);
      const directionsService = new window.google.maps.DirectionsService();

      const ecoFriendlyKeywords = [
        "eco-friendly",
        "sustainable",
        "green",
        "organic",
      ];
      const searchTypes = [
        "lodging",
        "restaurant",
        "gas_station",
        "charging_station",
        "supermarket",
        "park",
        "tourist_attraction",
      ];
      let allPlaces = [];

      try {
        console.log("📌 Fetching waypoints from directions...");

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

          destinationLatLng = {
            lat: geoResponse.lat(),
            lng: geoResponse.lng(),
          };
        } else {
          destinationLatLng = destination;
        }

        const waypoints = directions.routes[0].legs[0].steps.map((step) => ({
          location: {
            lat: step.end_location.lat(),
            lng: step.end_location.lng(),
          },
          stopover: true,
        }));

        const locationsToSearch = [
          {
            location: { lat: userLocation.lat, lng: userLocation.lng },
            label: "Start",
          },
          { location: destinationLatLng, label: "Destination" },
          ...waypoints.map((wp) => ({
            location: wp.location,
            label: "Waypoint",
          })),
        ];

        console.log(
          `🔍 Searching eco-friendly locations near ${locationsToSearch.length} points...`
        );

        const placeSearchPromises = locationsToSearch.map((searchArea) => {
          if (
            !searchArea.location ||
            isNaN(searchArea.location.lat) ||
            isNaN(searchArea.location.lng)
          ) {
            console.warn(
              `⚠️ Invalid location found at ${searchArea.label}, skipping.`
            );
            return Promise.resolve([]);
          }

          return Promise.all(
            searchTypes.map(
              (type) =>
                new Promise((resolve) => {
                  service.nearbySearch(
                    {
                      location: searchArea.location,
                      radius: 3000,
                      type: type,
                      keyword: ecoFriendlyKeywords.join(" "),
                    },
                    (results, status) => {
                      if (
                        status ===
                        window.google.maps.places.PlacesServiceStatus.OK
                      ) {
                        console.log(
                          `✅ Found ${results.length} places near ${searchArea.label}`
                        );
                        resolve(results);
                      } else {
                        console.warn(
                          `⚠️ No results found near ${searchArea.label}`
                        );
                        resolve([]);
                      }
                    }
                  );
                })
            )
          );
        });

        const searchResults = await Promise.all(placeSearchPromises);
        allPlaces = searchResults.flat(2); // Flattens nested arrays from Promise.all()

        console.log(`🌱 Total Eco-Friendly Places Found: ${allPlaces.length}`);
        setLocations(allPlaces);
      } catch (error) {
        console.error("❌ Error fetching eco-friendly places:", error);
      }
    }
  }, [userLocation, destination, directions]);

  // Function to prevent duplicate stops, user location, or destination
  const isValidStop = (newStop) => {
    if (!newStop || !newStop.geometry) return false;

    const newStopId = newStop.place_id || newStop.formatted_address;

    // Check if the stop is already in the list
    if (
      stops.some(
        (stop) => (stop.place_id || stop.formatted_address) === newStopId
      )
    ) {
      alert("This stop has already been added.");
      return false;
    }

    // Check if the stop is the same as the destination
    if (
      destination &&
      (newStop.place_id === destination ||
        newStop.formatted_address === destination)
    ) {
      alert("This stop is the destination and cannot be added as a stop.");
      return false;
    }

    // Check if the stop matches the user's location
    if (
      userLocation &&
      newStop.geometry.location.lat === userLocation.lat &&
      newStop.geometry.location.lng === userLocation.lng
    ) {
      alert("You cannot add your current location as a stop.");
      return false;
    }

    return true;
  };

  const updateDirections = useCallback(() => {
    if (!userLocation || !destination) return;

    if (typeof window !== "undefined" && window.google?.maps) {
      const directionsService = new window.google.maps.DirectionsService();

      const request = {
        origin: userLocation,
        destination: destination,
        waypoints: stops.map((stop) => ({
          location: stop.geometry.location,
          stopover: true,
        })),
        travelMode: window.google.maps.TravelMode.DRIVING,
      };

      directionsService.route(request, (result, status) => {
        if (status === window.google.maps.DirectionsStatus.OK) {
          setDirections(result);
          setError("");
          // Calculate total distance
          let totalDistance = 0; // in meters
          result.routes[0].legs.forEach((leg) => {
            totalDistance += leg.distance.value; // sum all distances
          });

          // Convert meters to km
          const totalDistanceKm = totalDistance / 1000;

          // Carbon footprint calculation (0.24 kg CO₂ per km)
          const footprint = totalDistanceKm * 0.24;
          setCarbonFootprint(footprint.toFixed(2));
        } else {
          console.error("Error fetching directions:", status);
          setError("No route found. Please enter a valid address.");
        }
      });
    }
  }, [userLocation, destination, stops]);

  // Function to add location to stops and update directions
  const addToTrip = (location) => {
    if (!stops.some((stop) => stop.place_id === location.place_id)) {
      setStops((prevStops) => [...prevStops, location]);
      setLocations((prevLocations) =>
        prevLocations.filter((place) => place.place_id !== location.place_id)
      );
      setSelectedLocation(null);
    }
  };
  const removeStop = (index) => {
    const removedStop = stops[index];
    setStops((prevStops) => prevStops.filter((_, i) => i !== index));
    setLocations((prevLocations) => [...prevLocations, removedStop]);
  };

  const handleManualStopAdd = () => {
    if (stopInputRef) {
      const place = stopInputRef.getPlace();
      if (place && place.geometry && isValidStop(place)) {
        setStops((prevStops) => [...prevStops, place]);
        updateDirections();
      }
    }
  };

  useEffect(() => {
    if (mapLoaded) {
      updateDirections();
    }
  }, [mapLoaded, updateDirections]);

  useEffect(() => {
    if (mapLoaded) {
      fetchEcoFriendlyPlaces();
    }
  }, [mapLoaded, fetchEcoFriendlyPlaces]);

  const calculateDistance = (lat1, lng1, lat2, lng2) => {
    const toRad = (value) => (value * Math.PI) / 180;
    const R = 6371; // Earth's radius in km
    const dLat = toRad(lat2 - lat1);
    const dLng = toRad(lng2 - lng1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRad(lat1)) *
        Math.cos(toRad(lat2)) *
        Math.sin(dLng / 2) *
        Math.sin(dLng / 2);
    return R * (2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
  };

  const calculateCoinsForLocation = (location) => {
    let minDistance = Infinity;

    directions.routes[0].legs.forEach((leg) => {
      leg.steps.forEach((step) => {
        const dist = calculateDistance(
          step.start_location.lat(),
          step.start_location.lng(),
          location.geometry.location.lat(),
          location.geometry.location.lng()
        );
        if (dist < minDistance) {
          minDistance = dist;
        }
      });
    });

    if (minDistance < 1) return 5;
    if (minDistance < 3) return 3;
    return 1;
  };

  return (
    <LoadScriptNext
      googleMapsApiKey={googleMapsApiKey}
      libraries={["places"]}
      onLoad={() => setMapLoaded(true)}
    >
      <div className="flex ml-64">
        <div className="flex-grow">
          <div className="flex flex-row-reverse h-screen">
            {/* Stop Selection Panel */}
            <div className="w-1/3 p-4 bg-black text-white overflow-y-auto">
              <h3 className="font-bold text-xl mb-3 text-green-500">
                Get Directions
              </h3>
              <div>
                <label className="text-green-500">From:</label>
                <input
                  type="text"
                  value={
                    userLocation ? "Your Location" : "Fetching Location..."
                  }
                  readOnly
                  className="w-full p-2 rounded border-green-500 bg-gray-900 text-green-500 placeholder-green-700"
                />
              </div>
              <div className="mt-2">
                <label className="text-green-500">To:</label>
                <Autocomplete
                  onLoad={(auto) => setAutocompleteRef(auto)}
                  onPlaceChanged={() => {
                    if (autocompleteRef) {
                      setDestination(
                        autocompleteRef.getPlace().formatted_address
                      );
                    }
                  }}
                >
                  <input
                    type="text"
                    placeholder="Enter Destination"
                    className="w-full p-2 rounded border-green-500 bg-gray-900 text-green-500 placeholder-green-700"
                  />
                </Autocomplete>
              </div>
              <div className="mt-4">
                <label className="text-green-500">Add Stop:</label>
                <Autocomplete
                  onLoad={(auto) => setStopInputRef(auto)}
                  onPlaceChanged={handleManualStopAdd}
                >
                  <input
                    type="text"
                    placeholder="Enter a stop"
                    className="w-full p-2 rounded border-green-500 bg-gray-900 text-green-500 placeholder-green-700"
                  />
                </Autocomplete>
                <button
                  onClick={handleManualStopAdd}
                  className="bg-gradient-to-r from-green-400 to-blue-500 font-bold text-white px-4 py-2 rounded-md mt-2 hover:bg-green-600 transition w-full"
                >
                  Add Stop
                </button>
              </div>
              {/* Stops Section */}
              <div className="mt-6">
                <h4 className="text-lg font-semibold text-green-500">
                  Your Stops
                </h4>
                {stops.length === 0 ? (
                  <p className="text-green-500">No stops added yet.</p>
                ) : (
                  stops.map((stop, index) => (
                    <div
                      key={index}
                      className="flex justify-between items-center bg-gray-800 p-2 mt-2 rounded"
                    >
                      <span className="text-green-400">
                        {stop.name || stop.formatted_address}
                      </span>
                      <button
                        onClick={() => removeStop(index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        ❌
                      </button>
                    </div>
                  ))
                )}
              </div>
              {carbonFootprint && (
                <div className="mt-4 p-4 bg-gray-900 text-green-400 rounded">
                  <h4 className="text-lg font-semibold">
                    Estimated Total Carbon Footprint
                  </h4>
                  <p className="text-xl">🌍 {carbonFootprint} kg CO₂</p>
                  <p className="text-sm text-gray-400">
                    Based on a standard vehicle emission of 0.24 kg CO₂/km.
                  </p>
                </div>
              )}
              {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
            </div>
            {/* Map Section */}
            <div className="w-2/3">
              <GoogleMap
                mapContainerStyle={mapContainerStyle}
                center={defaultCenter}
                options={{
                  styles: customMapStyle,
                  zoom: 12,
                  zoomControl: true,
                  streetViewControl: false,
                  mapTypeControl: true,
                  mapTypeControlOptions: {
                    position: window?.google?.maps.ControlPosition?.TOP_RIGHT,
                    style:
                      window.google?.maps.MapTypeControlStyle.HORIZONTAL_BAR,
                    mapTypeIds: ["roadmap", "satellite", "hybrid", "terrain"],
                  },
                  fullscreenControl: false,
                }}
              >
                {/* User's Current Location */}
                {userLocation && (
                  <Marker
                    position={userLocation}
                    icon={{
                      url: "/car2.png",
                      scaledSize: new window.google.maps.Size(50, 50),
                      anchor: new window.google.maps.Point(25, 25),
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
                    icon={`http://maps.google.com/mapfiles/ms/icons/green-dot.png`}
                  />
                ))}
                {/* Popup (InfoWindow) */}
                {selectedLocation && (
                  <InfoWindow
                    position={selectedLocation.geometry.location}
                    onCloseClick={() => setSelectedLocation(null)}
                  >
                    <div className="p-4 bg-black text-white rounded-lg shadow-lg max-w-xs">
                      {/* Display Image if Available */}
                      {selectedLocation.photos &&
                        selectedLocation.photos.length > 0 && (
                          <img
                            src={
                              selectedLocation.photos[0].getUrl() ||
                              "/placeholder.svg"
                            }
                            alt={selectedLocation.name}
                            className="w-full h-32 object-cover rounded-md mb-3"
                          />
                        )}
                      <h3 className="text-lg font-bold text-green-400">
                        {selectedLocation.name}
                      </h3>
                      <p className="text-sm opacity-75 text-green-500">
                        {selectedLocation.vicinity || "No Address Available"}
                      </p>
                      {selectedLocation.rating && (
                        <p className="text-sm mt-1 text-green-400">
                          ⭐ {selectedLocation.rating} / 5
                        </p>
                      )}
                      {selectedLocation.opening_hours &&
                        selectedLocation.opening_hours.weekday_text && (
                          <div className="mt-2">
                            <p className="text-xs text-green-400">
                              Open Hours:
                            </p>
                            <ul className="text-xs opacity-75">
                              {selectedLocation.opening_hours.weekday_text.map(
                                (day, index) => (
                                  <li key={index}>{day}</li>
                                )
                              )}
                            </ul>
                          </div>
                        )}
                      {selectedLocation.website && (
                        <a
                          href={selectedLocation.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-green-400 underline mt-2 block"
                        >
                          Visit Website
                        </a>
                      )}
                      <p className="text-sm text-green-400 mt-2 block">
                        Eco-Friendly Location
                      </p>
                      <p className="text-sm text-yellow-400 font-semibold">
                        🎉 Earn {calculateCoinsForLocation(selectedLocation)}{" "}
                        Coins!
                      </p>
                      <button
                        onClick={() => addToTrip(selectedLocation)}
                        className="mt-2 bg-green-500 text-white px-3 py-1 rounded-md hover:bg-green-600"
                      >
                        ➕ Add to Trip
                      </button>
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
            </div>
          </div>
        </div>
      </div>
    </LoadScriptNext>
  );
}
