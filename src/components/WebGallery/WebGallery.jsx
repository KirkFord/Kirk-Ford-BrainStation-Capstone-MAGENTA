import React, { useState, useEffect } from 'react';
import Header from '../Header/Header'; 
import Footer from '../Footer/Footer'; 
import './WebGallery.scss';
import { useCursor } from '../../scripts/UseCursor';

const WebGallery = () => {
    useCursor();
    const [exhibit, setExhibit] = useState(null);
    const [enlargedMedia, setEnlargedMedia] = useState(null);
    useEffect(() => {
        fetch('/assets/exhibits/exhibits.json')
            .then((response) => response.json())
            .then((data) => {
                // console.log(data);
                setExhibit(data);
            });
    }, []);

    const handleMediaClick = (mediaSrc) => {
        if (enlargedMedia === mediaSrc) {
            setEnlargedMedia(null); 
        } else {
            setEnlargedMedia(mediaSrc); 
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
                            {/* Handle original media display */}
                            <div className={`media-grid ${artwork.files?.original?.length === 1 ? 'single-item' : ''}`}>
                                {artwork.files?.original?.map((file, idx) => (
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
                            {/* Handle transformed media display */}
                            {artwork.transformed_type && (
                                <div className="transformation-section">
                                    <h4>Sensory Transformation:</h4>
                                    {artwork.transformed_type === 'image' && (
                                        <img 
                                            src={`/assets/exhibits/${exhibit.id}/${artwork.files?.transformed}`} 
                                            alt={`Transformed version of ${artwork.title}`} 
                                            className={enlargedMedia === `/assets/exhibits/${exhibit.id}/${artwork.files?.transformed}` ? 'enlarged' : ''}
                                            onClick={() => handleMediaClick(`/assets/exhibits/${exhibit.id}/${artwork.files?.transformed}`)}
                                        />
                                    )}
                                    {artwork.transformed_type === 'video' && (
                                        <video 
                                            controls 
                                            aria-label={`Transformed video artwork: ${artwork.title}`}
                                            className={enlargedMedia === `/assets/exhibits/${exhibit.id}/${artwork.files?.transformed}` ? 'enlarged' : ''}
                                            onClick={() => handleMediaClick(`/assets/exhibits/${exhibit.id}/${artwork.files?.transformed}`)}
                                        >
                                            <source src={`/assets/exhibits/${exhibit.id}/${artwork.files?.transformed}`} type="video/mp4" />
                                        </video>
                                    )}
                                    {artwork.transformed_type === 'audio' && (
                                        <audio 
                                            controls 
                                            aria-label={`Transformed audio artwork: ${artwork.title}`}
                                            className={enlargedMedia === `/assets/exhibits/${exhibit.id}/${artwork.files?.transformed}` ? 'enlarged' : ''}
                                            onClick={() => handleMediaClick(`/assets/exhibits/${exhibit.id}/${artwork.files?.transformed}`)}
                                        >
                                            <source src={`/assets/exhibits/${exhibit.id}/${artwork.files?.transformed}`} type="audio/mpeg" />
                                        </audio>
                                    )}
                                </div>
                            )}
                        </div>

                        <div className="art-description">
                            <h3>{artwork.title}</h3>
                            {/* Conditionally display "Medium/Tools/Transformation Process" if transformed_type exists */}
                            <p><strong>{artwork.transformed_type ? 'Medium/Tools/Transformative Process' : 'Medium/Tools'}:</strong> {artwork.medium}</p>
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
