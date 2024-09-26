import React, { useEffect } from 'react';
import './ToolTip.scss';

const Tooltip = ({ artwork }) => {
    useEffect(() => {
        console.log("Tooltip rendering with artwork:", artwork);
    }, [artwork]);

    if (!artwork) return null;

    return (
        <div className="tooltip">
            <h3>{artwork.title}</h3>
            <p><strong>Medium:</strong> {artwork.medium}</p>
            <p><strong>Description:</strong> {artwork.description}</p>
            <p><strong>Alt Text:</strong> {artwork.altText}</p>
            <p><strong>Artsy Alt Text:</strong> {artwork.artsyAltText}</p>
        </div>
    );
};

export default Tooltip;
