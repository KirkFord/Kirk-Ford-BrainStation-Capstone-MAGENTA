import React, { useEffect, useState } from 'react';
import './WebGallery.scss';

const WebGallery = () => {
  const [exhibit, setExhibit] = useState(null);

  useEffect(() => {
    // Fetch exhibit data from the JSON file
    fetch('/assets/exhibits/exhibits.json')
      .then((response) => response.json())
      .then((data) => setExhibit(data))
      .catch((error) => console.error('Error loading exhibit data:', error));
  }, []);

  if (!exhibit) return <div>Loading...</div>;

  return (
    <div className="web-gallery">
      {/* Overview Section */}
      <div className="gallery-overview">
        <h1>{exhibit.name}</h1>
        <h2>{exhibit.artist}</h2>
        <p>{exhibit.artistStatement}</p>
      </div>

      {/* Art Pieces Section */}
      <div className="gallery-artpieces">
        {exhibit.artworks.map((artwork, index) => (
          <div key={index} className="artpiece">
            <div className="art-content">
              {artwork.type === 'image' && (
                <img src={`/assets/exhibits/${exhibit.id}/${artwork.file}`} alt={artwork.altText} />
              )}
              {artwork.type === 'audio' && (
                <audio controls>
                  <source src={`/assets/exhibits/${exhibit.id}/${artwork.file}`} type="audio/mpeg" />
                </audio>
              )}
              {artwork.type === 'video' && (
                <video controls>
                  <source src={`/assets/exhibits/${exhibit.id}/${artwork.file}`} type="video/mp4" />
                </video>
              )}
            </div>
            <div className="art-description">
              <h3>{artwork.title}</h3>
              <p><strong>Medium/Tools:</strong> {artwork.medium}</p>
              <p><strong>Description:</strong> {artwork.description}</p>
              <p><strong>Alt Text:</strong> {artwork.altText}</p>
              <p><strong>Artsy Alt Text:</strong> {artwork.artsyAltText}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WebGallery;
