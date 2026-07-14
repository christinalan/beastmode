import { useEffect, useRef, useState } from "react";
import {
  importLibrary,
  setOptions,
} from "@googlemaps/js-api-loader";

const OAKLAND_CENTER = {
  lat: 37.8044,
  lng: -122.2712,
};

function GoogleMap({
  locations,
  selectedLocation,
  onSelectLocation,
}) {
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const markersRef = useRef([]);
  const onSelectLocationRef = useRef(onSelectLocation);

  const [mapError, setMapError] = useState("");

  /*
   * Keep the current callback available without rebuilding the map
   * every time App.jsx renders.
   */
  useEffect(() => {
    onSelectLocationRef.current = onSelectLocation;
  }, [onSelectLocation]);

  /*
   * Create the map and markers.
   */
  useEffect(() => {
    let isCancelled = false;

    async function initializeMap() {
      try {
        const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
        const mapId = import.meta.env.VITE_GOOGLE_MAPS_MAP_ID;

        if (!apiKey) {
          throw new Error(
            "VITE_GOOGLE_MAPS_API_KEY is missing from your .env file.",
          );
        }

        if (!mapId) {
          throw new Error(
            "VITE_GOOGLE_MAPS_MAP_ID is missing from your .env file.",
          );
        }

        /*
         * Configure Google's JavaScript API loader.
         */
        setOptions({
          key: apiKey,
          v: "weekly",
        });

        /*
         * Load only the libraries this component needs.
         */
        const [{ Map }, { AdvancedMarkerElement, PinElement }] =
          await Promise.all([
            importLibrary("maps"),
            importLibrary("marker"),
          ]);

        if (isCancelled || !mapContainerRef.current) {
          return;
        }

        const map = new Map(mapContainerRef.current, {
          center: OAKLAND_CENTER,
          zoom: 12,
          mapId,
          mapTypeControl: false,
          streetViewControl: false,
          fullscreenControl: true,
          clickableIcons: true,
        });

        mapRef.current = map;

        markersRef.current = locations.map((location, index) => {
          /*
           * Use location.stop when it exists.
           * Otherwise, use the location's array position.
           */
          const stopNumber = location.stop ?? index + 1;

          const pin = new PinElement({
            glyphText: String(stopNumber),
            glyphColor: "#ffffff",
            background: "#222222",
            borderColor: "#ffffff",
            scale: 1.1,
          });

          const marker = new AdvancedMarkerElement({
            map,
            position: location.position,
            title: `Stop ${stopNumber}: ${location.name}`,
            content: pin.element,
          });

          marker.addListener("click", () => {
            onSelectLocationRef.current(location);

            map.panTo(location.position);

            /*
             * Increase this to 15 or 16 if you want the map
             * to zoom closer whenever a pin is selected.
             */
            if ((map.getZoom() ?? 12) < 14) {
              map.setZoom(14);
            }
          });

          return {
            locationId: location.id,
            marker,
            pin,
          };
        });
      } catch (error) {
        console.error("Google Maps initialization failed:", error);

        if (!isCancelled) {
          setMapError(
            error instanceof Error
              ? error.message
              : "The Google Map could not be loaded.",
          );
        }
      }
    }

    initializeMap();

    return () => {
      isCancelled = true;

      /*
       * Remove markers when the component unmounts.
       */
      markersRef.current.forEach(({ marker }) => {
        marker.map = null;
      });

      markersRef.current = [];
      mapRef.current = null;
    };
  }, [locations]);

  /*
   * Update marker appearance when selectedLocation changes.
   */
  useEffect(() => {
    markersRef.current.forEach(({ locationId, pin }) => {
      const isSelected = selectedLocation?.id === locationId;

      pin.background = isSelected ? "#b43a2f" : "#222222";
      pin.borderColor = "#ffffff";
      pin.glyphColor = "#ffffff";
      pin.scale = isSelected ? 1.35 : 1.1;
    });

    if (selectedLocation && mapRef.current) {
      mapRef.current.panTo(selectedLocation.position);
    }
  }, [selectedLocation]);

  if (mapError) {
    return (
      <div className="map-error" role="alert">
        <div className="map-error__content">
          <h2>Unable to load the map</h2>
          <p>{mapError}</p>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={mapContainerRef}
      className="google-map"
      aria-label="Map showing stops in the Oakland guide"
    />
  );
}

export default GoogleMap;