import { useState } from "react";
import GoogleMap from "./components/GoogleMap";
import LocationPanel from "./components/LocationPanel";
import { locations } from "./data/locations";
import { trackEvent } from "./utils/analytics";
import "./App.css";

function App() {
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [tourStarted, setTourStarted] = useState(false);

   function handleExplore() {
    trackEvent("explore_oakland");

    setTourStarted(true);
    setSelectedLocation(locations[0]);
  }

   function handleSelectTourLocation(location) {
    trackEvent("stop_view", {
    stop_number: location.stop,
    location_id: location.id,
    location_name: location.name,
  });

    setTourStarted(true);
    setSelectedLocation(location);
  }

  return (
    <main className="app">
      <section className="map-section">
        <GoogleMap
          locations={locations}
          selectedLocation={selectedLocation}
          onSelectLocation={handleSelectTourLocation}
          tourStarted={tourStarted}
        />
      </section>

      <LocationPanel 
        location={selectedLocation} 
        locations={locations}
        onExplore={handleExplore}
        onSelectLocation={handleSelectTourLocation}
      />
    </main>
  );
}

export default App;