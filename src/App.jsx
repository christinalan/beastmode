import { useState } from "react";
import GoogleMap from "./components/GoogleMap";
import LocationPanel from "./components/LocationPanel";
import { locations } from "./data/locations";
import "./App.css";

function App() {
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [tourStarted, setTourStarted] = useState(false);

   function handleExplore() {
    setTourStarted(true);
    setSelectedLocation(locations[0]);
  }

   function handleSelectTourLocation(location) {
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