import React from 'react';
import './Tooltip.scss';

const Tooltip = ({ hoveredArt }) => {
    if (!hoveredArt) return null;

    return (
        <div className="tooltip">
            <h3>{hoveredArt.artist}</h3>
            <p>{hoveredArt.title}</p>
        </div>
    );
};

export default Tooltip;
