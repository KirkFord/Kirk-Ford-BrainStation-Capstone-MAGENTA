import React, { useState, useEffect } from 'react';
import Header from '../Header/Header'; // Assuming you have a Header component
import Footer from '../Footer/Footer'; // Assuming you have a Footer component
import './WebGallery.scss';
import { useCursor } from '../../scripts/UseCursor';


const WebGallery = () => {
    useCursor();
    const [exhibit, setExhibit] = useState(null);

    useEffect(() => {
        fetch('/assets/exhibits/exhibits.json')
            .then((response) => response.json())
            .then((data) => setExhibit(data));
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
                            {/* Display the original media */}
                            {artwork.original_type === 'image' && (
                                <img src={`/assets/exhibits/${exhibit.id}/${artwork.file.original}`} alt={artwork.altText} />
                            )}
                            {artwork.original_type === 'audio' && (
                                <audio controls aria-label={`Audio artwork: ${artwork.title}`}>
                                    <source src={`/assets/exhibits/${exhibit.id}/${artwork.file.original}`} type="audio/mpeg" />
                                </audio>
                            )}
                            {artwork.original_type === 'video' && (
                                <video controls aria-label={`Video artwork: ${artwork.title}`}>
                                    <source src={`/assets/exhibits/${exhibit.id}/${artwork.file.original}`} type="video/mp4" />
                                </video>
                            )}

                            {/* Display the transformed media if it exists */}
                            {artwork.transformed_type && (
                                <>
                                    <h4>Accessible Transformation:</h4>
                                    {artwork.transformed_type === 'image' && (
                                        <img src={`/assets/exhibits/${exhibit.id}/${artwork.file.transformed}`} alt={artwork.altText} />
                                    )}
                                    {artwork.transformed_type === 'audio' && (
                                        <audio controls aria-label={`Transformed audio artwork: ${artwork.title}`}>
                                            <source src={`/assets/exhibits/${exhibit.id}/${artwork.file.transformed}`} type="audio/mpeg" />
                                        </audio>
                                    )}
                                    {artwork.transformed_type === 'video' && (
                                        <video controls aria-label={`Transformed video artwork: ${artwork.title}`}>
                                            <source src={`/assets/exhibits/${exhibit.id}/${artwork.file.transformed}`} type="video/mp4" />
                                        </video>
                                    )}
                                </>
                            )}
                        </div>

                        <div className="art-description">
                            <h3>{artwork.title}</h3>
                            {/* Conditionally display "Medium/Tools/Transformation Process" if transformed_type exists */}
                            <p><strong>{artwork.transformed_type ? 'Medium/Tools/Transformation Process' : 'Medium/Tools'}:</strong> {artwork.medium}</p>
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
