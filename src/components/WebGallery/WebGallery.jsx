import React, { useEffect, useState } from 'react';
import Header from '../Header/Header';
import Footer from '../Footer/Footer';
import { useCursor } from '../../scripts/UseCursor';  // Adjust the path accordingly
import './WebGallery.scss';

const WebGallery = () => {
    useEffect(() => {
        console.log("WebGallery Page rendered");
      }, []);
      
    useCursor();

    const [exhibit, setExhibit] = useState(null);

    useEffect(() => {
        fetch('/assets/exhibits/exhibits.json')
            .then((response) => response.json())
            .then((data) => setExhibit(data))
            .catch((error) => console.error('Error loading exhibit data:', error));
    }, []);

    if (!exhibit) return <div>Loading...</div>;

    return (
        
        <div className="web-gallery" aria-labelledby="gallery-heading">
            <Header />
            <div className="gallery-overview" role="region" aria-labelledby="overview-heading">
                <h1 id="gallery-heading">{exhibit.name}</h1>
                <h2>{exhibit.artist}</h2>
                <p>{exhibit.artistStatement}</p>
            </div>

            <div className="gallery-artpieces" role="list">
                {exhibit.artworks.map((artwork, index) => (
                    <div key={index} className="artpiece" role="listitem">
                        <div className="art-content">
                            {artwork.type === 'image' && (
                                <img src={`/assets/exhibits/${exhibit.id}/${artwork.file}`} alt={artwork.altText} />
                            )}
                            {artwork.type === 'audio' && (
                                <audio controls aria-label={`Audio artwork: ${artwork.title}`}>
                                    <source src={`/assets/exhibits/${exhibit.id}/${artwork.file}`} type="audio/mpeg" />
                                </audio>
                            )}
                            {artwork.type === 'video' && (
                                <video controls aria-label={`Video artwork: ${artwork.title}`}>
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
            <Footer />
        </div>
    );
};

export default WebGallery;
