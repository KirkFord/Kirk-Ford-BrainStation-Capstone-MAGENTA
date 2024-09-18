import React, { useState } from 'react';
import './Guestbook.scss';
import { MouseDraw } from '../../scripts/MouseDraw';

const Guestbook = () => {
    const [text, setText] = useState('');
    const [drawingData, setDrawingData] = useState([]);
    
    // Save drawing data from MouseDraw
    const handleDrawingComplete = (lines) => {
        setDrawingData(lines);
    };

    const handleSubmit = async () => {
        // POST request to backend API
        try {
            const response = await fetch('/api/Guestbook-api', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    text,
                    drawing: drawingData,
                }),
            });
            const result = await response.json();
            if (response.ok) {
                console.log('Guestbook entry submitted:', result);
                // Reset form
                setText('');
                setDrawingData([]);
            } else {
                console.error('Failed to submit:', result.message);
            }
        } catch (error) {
            console.error('Error submitting guestbook entry:', error);
        }
    };

    return (
        <div className="guestbook">
            <h1>Guestbook</h1>
            <p>Leave your mark! You can write or draw something below:</p>

            <textarea
                className="guestbook-textarea"
                placeholder="Write something here..."
                value={text}
                onChange={(e) => setText(e.target.value)}
            />

            <div className="drawing-container">
                <svg width="500" height="300">
                    <MouseDraw
                        x={0}
                        y={0}
                        width={500}
                        height={300}
                        thickness={3}
                        onComplete={handleDrawingComplete} // Pass drawing data to parent
                    />
                </svg>
            </div>

            <button className="guestbook-submit" onClick={handleSubmit}>
                Submit
            </button>
        </div>
    );
};

export default Guestbook;
