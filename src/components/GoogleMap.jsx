import { useEffect, useRef, useState } from "react";
import {
  importLibrary,
  setOptions,
} from "@googlemaps/js-api-loader";

const OAKLAND_CENTER = {
  lat: 37.8044,
  lng: -122.2712,
};

const INITIAL_ZOOM = 12;
const TOUR_ZOOM = 18;
const PAN_DURATION = 1200;

function easeInOutCubic(progress) {
  return progress < 0.5
    ? 4 * progress * progress * progress
    : 1 - Math.pow(-2 * progress + 2, 3) / 2;
}

function animateMapTo(
  map,
  destination,
  destinationZoom,
  duration = PAN_DURATION,
) {
  const startingCenter = map.getCenter();
  const startingZoom = map.getZoom();

  if (!startingCenter || startingZoom == null) {
    map.moveCamera({
      center: destination,
      zoom: destinationZoom,
    });

    return () => {};
  }

  const start = {
    lat: startingCenter.lat(),
    lng: startingCenter.lng(),
    zoom: startingZoom,
  };

  const startTime = performance.now();
  let animationFrameId;

  function animate(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const easedProgress = easeInOutCubic(progress);

    const lat =
      start.lat +
      (destination.lat - start.lat) * easedProgress;

    const lng =
      start.lng +
      (destination.lng - start.lng) * easedProgress;

    const zoom =
      start.zoom +
      (destinationZoom - start.zoom) * easedProgress;

    map.moveCamera({
      center: { lat, lng },
      zoom,
    });

    if (progress < 1) {
      animationFrameId = requestAnimationFrame(animate);
    }
  }

  animationFrameId = requestAnimationFrame(animate);

  return () => {
    cancelAnimationFrame(animationFrameId);
  };
}

function GoogleMap({
  locations,
  selectedLocation,
  onSelectLocation,
  tourStarted,
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
          zoom: INITIAL_ZOOM,
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
  const map = mapRef.current;

  if (!map || !selectedLocation) {
    return;
  }

  markersRef.current.forEach(({ locationId, pin }) => {
    const isSelected = selectedLocation.id === locationId;

    pin.background = isSelected ? "#b43a2f" : "#222222";
    pin.borderColor = "#ffffff";
    pin.glyphColor = "#ffffff";
    pin.scale = isSelected ? 1.35 : 1.1;
  });

  const destinationZoom = tourStarted
    ? TOUR_ZOOM
    : map.getZoom() ?? INITIAL_ZOOM;

  const cancelAnimation = animateMapTo(
    map,
    selectedLocation.position,
    destinationZoom,
    PAN_DURATION,
  );

  return () => {
    cancelAnimation();
  };
}, [selectedLocation, tourStarted]);

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