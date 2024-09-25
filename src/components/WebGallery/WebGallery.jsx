import React, { useState, useEffect } from 'react';
import Header from '../Header/Header'; 
import Footer from '../Footer/Footer'; 
import './WebGallery.scss';
import { useCursor } from '../../scripts/UseCursor';

const WebGallery = () => {
    useCursor();
    const [exhibit, setExhibit] = useState(null);
    const [enlargedMedia, setEnlargedMedia] = useState(null); // Track enlarged media (images/videos)

    useEffect(() => {
        fetch('/assets/exhibits/exhibits.json')
            .then((response) => response.json())
            .then((data) => {
                console.log(data); // Debugging
                setExhibit(data);
            });
    }, []);

    const handleMediaClick = (mediaSrc) => {
        if (enlargedMedia === mediaSrc) {
            setEnlargedMedia(null); // If already enlarged, shrink it
        } else {
            setEnlargedMedia(mediaSrc); // Enlarge the clicked media
        }
    };

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
                            {/* Handle media display */}
                            {artwork.files.map((file, idx) => (
                                <React.Fragment key={idx}>
                                    {artwork.original_type === 'image' && (
                                        <img 
                                            src={`/assets/exhibits/${exhibit.id}/${file}`} 
                                            alt={artwork.altText} 
                                            className={enlargedMedia === `/assets/exhibits/${exhibit.id}/${file}` ? 'enlarged' : ''}
                                            onClick={() => handleMediaClick(`/assets/exhibits/${exhibit.id}/${file}`)}
                                        />
                                    )}
                                    {artwork.original_type === 'video' && (
                                        <video 
                                            controls 
                                            aria-label={`Video artwork: ${artwork.title}`}
                                            className={enlargedMedia === `/assets/exhibits/${exhibit.id}/${file}` ? 'enlarged' : ''}
                                            onClick={() => handleMediaClick(`/assets/exhibits/${exhibit.id}/${file}`)}
                                        >
                                            <source src={`/assets/exhibits/${exhibit.id}/${file}`} type="video/mp4" />
                                        </video>
                                    )}
                                </React.Fragment>
                            ))}
                        </div>

                        <div className="art-description">
                            <h3>{artwork.title}</h3>
                            <p><strong>Medium/Tools:</strong> {artwork.medium}</p>
                            <p><strong>Description:</strong> {artwork.description}</p>
                            <p><strong>Literal Description:</strong> {artwork.altText}</p>
                            <p><strong>Artist's Description:</strong> {artwork.artsyAltText}</p>
                        </div>
                    </div>
                ))}
            </div>
            <Footer />
        </div>
    );
};

export default WebGallery;
