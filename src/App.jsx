import { useState } from "react";
import GoogleMap from "./components/GoogleMap";
import LocationPanel from "./components/LocationPanel";
import { locations } from "./data/locations";
import "./App.css";

function App() {
  const [selectedLocation, setSelectedLocation] = useState(null);

  return (
    <main className="app">
      <section className="map-section">
        <GoogleMap
          locations={locations}
          selectedLocation={selectedLocation}
          onSelectLocation={setSelectedLocation}
        />
      </section>

      <LocationPanel location={selectedLocation} />
    </main>
  );
}

export default App;