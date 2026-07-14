function LocationPanel({ location }) {
  if (!location) {
    return (
      <section className="location-section">
        <div className="location-placeholder">
          <h1>Marshawn Lynch's Guide to Oakland</h1>

            <p>
              Select a numbered stop on the map to learn more about my favorite spots in Oakland.
            </p>
        </div>
      </section>
    );
  }

  return (
    <section className="location-section">
      <div className="location-preview">
        <p className="stop-number">Stop {location.stop}</p>

        <h1>{location.name}</h1>

        {location.address && (
          <p className="location-address">{location.address}</p>
        )}

        {location.description && (
          <p className="location-description">{location.description}</p>
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
            Open in Google Maps
          </a>
        )}
      </div>
    </section>
  );
}

export default LocationPanel;