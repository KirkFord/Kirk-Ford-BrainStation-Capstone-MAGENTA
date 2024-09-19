import React, { useState, useEffect, useRef } from 'react';
import './Guestbook.scss';
import { MouseDraw } from '../../scripts/MouseDraw';

const generateUserToken = () => {
    let userToken = localStorage.getItem('userToken');
    if (!userToken) {
        userToken = `user_${Date.now()}_${Math.random().toString(36).substring(7)}`;
        localStorage.setItem('userToken', userToken);
    }
    return userToken;
};

const Guestbook = () => {
    const [text, setText] = useState('');
    const [entries, setEntries] = useState([]);
    const drawingRef = useRef([]); 
    const mouseDrawRef = useRef(); 

    useEffect(() => {
        fetchEntries();
    }, []);

    const fetchEntries = async () => {
        try {
            const response = await fetch('/api/Guestbook-api');
            const data = await response.json();
            setEntries(data.entries.reverse());
        } catch (error) {
            console.error('Error fetching guestbook entries:', error);
        }
    };

    const handleSubmit = async () => {
        const userToken = generateUserToken(); 

        if (!text && drawingRef.current.length === 0) {
            alert('Please write something or draw to submit.');
            return;
        }

        const currentDate = new Date().toLocaleString();
        const submissionText = `${text}\n\nSubmitted on: ${currentDate}`; 

        const submission = { text: submissionText, drawing: drawingRef.current, userToken };

        try {
            const response = await fetch('/api/Guestbook-api', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(submission),
            });

            const data = await response.json();
            if (response.ok) {
                alert('Guestbook entry submitted: ' + data.message);
                setText('');
                drawingRef.current = [];
                mouseDrawRef.current.clearCanvas(); 

                fetchEntries(); 
            } else {
                alert(data.error);
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
            ></textarea>

            <div className="drawing-container">
                <svg width="500" height="300">
                    <MouseDraw
                        ref={mouseDrawRef}
                        x={0}
                        y={0}
                        width={500}
                        height={300}
                        thickness={3}
                        onChange={(newDrawing) => (drawingRef.current = newDrawing)}
                    />
                </svg>
            </div>

            <button className="guestbook-submit" onClick={handleSubmit}>
                Submit
            </button>

            <div className="guestbook-entries">
                <h2>Previous Entries</h2>
                {entries.length > 0 ? (
                    entries.map((entry, index) => (
                        <div key={index} className="entry">
                            <p>{entry.text}</p>
                            {entry.drawing && entry.drawing.length > 0 && (
                                <div>
                                    <svg width="500" height="300">
                                        {entry.drawing.map((line, i) => (
                                            <polyline
                                                key={i}
                                                points={line.points
                                                    .map(point => `${point.x},${point.y}`)
                                                    .join(' ')}
                                                stroke="black"
                                                strokeWidth={line.thickness}
                                                fill="none"
                                            />
                                        ))}
                                    </svg>
                                </div>
                            )}
                        </div>
                    ))
                ) : (
                    <p>No entries yet. Be the first to sign the guestbook!</p>
                )}
            </div>
        </div>
    );
};

export default Guestbook;
