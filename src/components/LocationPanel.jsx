import { trackEvent } from "../utils/analytics";

function LocationPanel({ location, locations, onExplore, onSelectLocation }) {
  if (!location) {
    return (
      <section className="landing-section">
        <section className="location-section">
          <a
              className="beast-logo"
              href="https://www.amazon.com/Beast-Mode-510-Sheldon-Allen/dp/1953165885"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => {
                trackEvent("book_link_click", {
                  link_location: "header_logo",
                });
              }}
            >
              <span className="beast-word">BEAST</span>
              <span className="mode-word">MODE</span>
              <span className="five-ten-word">510</span>
            </a>

          <div className="location-placeholder">
            <h1 className="display-font">Marshawn Lynch's Guide to Oakland</h1>

              <p className="quote">
                "I feel like the importance of Oakland is not that it's just a place, but it's a character in its
                own right. Beast Mode 510 is going to have some real representation of The Town."
              </p>
              <p>—Marshawn Lynch</p>

              <button
                className="explore-button"
                onClick={onExplore}
              >
                  <span className="display-font">Explore Oakland</span>
                  <span className="material-symbols-outlined">
                    chevron_right
                  </span>
              </button>

          </div>

              <img
                className="landing-image"
                src="/images/Marshawn.jpg"
                alt="Beast Mode 510 comic artwork"
              />
              
        </section>
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
            onClick={() => {
              trackEvent("tour_navigation", {
                direction: "previous",
                from_stop: location.stop,
                to_stop: previousLocation.stop,
              });

              onSelectLocation(previousLocation);
            }}
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
            onClick={() => {
                trackEvent("tour_navigation", {
                  direction: "next",
                  from_stop: location.stop,
                  to_stop: nextLocation.stop,
                });

                onSelectLocation(nextLocation);
              }}
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
              onPlay={() => {
                trackEvent("video_play", {
                  stop_number: location.stop,
                  location_name: location.name,
                });
              }}
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
            onClick={() => {
              trackEvent("open_google_maps", {
                stop_number: location.stop,
                location_name: location.name,
              });
            }}
          >
            Save in Google Maps
          </a>
        )}
      </div>
    </section>
  );
}

export default LocationPanel;