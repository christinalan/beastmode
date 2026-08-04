function LocationPanel({ location, locations, onExplore, onSelectLocation }) {
  if (!location) {
    return (
      <section className="location-section">
        <div className="location-placeholder">
          <h1 className="display-font">Marshawn Lynch's Guide to Oakland</h1>

            <p className="quote">
              "I feel like the importance of Oakland is not that it's just a place, but it's a character in its
              own right. I believe it's going to have some real representation of The Town."
            </p>
            <p>—Marshawn Lynch</p>

             <button
              className="explore-button"
              onClick={onExplore}
            >
                <span className="display-font">Explore Oakland</span>
                <span>→</span>
            </button>
            
        </div>
      </section>
    );
  }
    
  const currentIndex = locations.findIndex(
  (item) => item.id === location.id,
  );

  const previousLocation =
    currentIndex > 0 ? locations[currentIndex - 1] : null;

  const nextLocation =
    currentIndex < locations.length - 1
      ? locations[currentIndex + 1]
      : null;

  const isLastStop = currentIndex === locations.length - 1;


  return (
    <section className="location-section">
      <div className="location-preview">

<div className="stop-header">
  <p className="stop-number">Stop {location.stop}</p>

      <div className="stop-navigation">
        {previousLocation && (
          <button
            type="button"
            className="stop-navigation-button"
            onClick={() => onSelectLocation(previousLocation)}
            aria-label={`Go back to Stop ${previousLocation.stop}`}
          >
            <span className="material-symbols-outlined">
              chevron_left
            </span>
          </button>
        )}

        {nextLocation && (
          <button
            type="button"
            className="stop-navigation-button"
            onClick={() => onSelectLocation(nextLocation)}
            aria-label={`Go to Stop ${nextLocation.stop}`}
          >
            <span className="material-symbols-outlined">
              chevron_right
            </span>
          </button>
        )}

        {isLastStop && (
          <button
            type="button"
            className="stop-navigation-button"
            onClick={() => onSelectLocation(locations[0])}
            aria-label="Restart Guide"
          >
            <span className="material-symbols-outlined">
              restart_alt
            </span>
          </button>
        )}
      </div>
    </div>

        <h1 className="display-font">{location.name}</h1>

        {location.address && (
          <p className="location-address">{location.address}</p>
        )}

        {location.description && (
          <p className="location-description quote">{location.description}</p>
        )}

        {location.videoSrc && (
          <figure className="comic-video-container">
            <video
              key={`video-${location.id}`}
              className="comic-video"
              controls
              playsInline
              preload="metadata"
              poster={location.videoPoster || undefined}
            >
              <source src={location.videoSrc} type="video/mp4" />

              Your browser does not support video playback.
            </video>

            {/* {location.videoCaption && (
              <figcaption className="video-caption">
                {location.videoCaption}
              </figcaption>
            )} */}
          </figure>
        )}


        {location.mapsUrl && (
          <a
            className="maps-link"
            href={location.mapsUrl}
            target="_blank"
            rel="noreferrer"
          >
            Save in Google Maps
          </a>
        )}
      </div>
    </section>
  );
}

export default LocationPanel;