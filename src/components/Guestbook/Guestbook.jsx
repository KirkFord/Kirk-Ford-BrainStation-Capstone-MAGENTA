import React, { useState, useEffect } from 'react';
import './Guestbook.scss';
import { MouseDraw } from '../../scripts/MouseDraw';

const Guestbook = () => {
    const [text, setText] = useState('');
    const [drawing, setDrawing] = useState(''); // This will hold the drawing data
    const [entries, setEntries] = useState([]);

    // Fetch guestbook entries when the component loads
    useEffect(() => {
        fetchEntries();
    }, []);

    // Function to fetch existing guestbook entries
    const fetchEntries = async () => {
        try {
            const response = await fetch('/api/Guestbook-api');
            const data = await response.json();
            setEntries(data.entries);
        } catch (error) {
            console.error('Error fetching guestbook entries:', error);
        }
    };

    // Function to handle form submission
    const handleSubmit = async () => {
        if (!text && !drawing) {
            alert('Please write something or draw to submit.');
            return;
        }

        const submission = { text, drawing };

        try {
            const response = await fetch('/api/Guestbook-api', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(submission),
            });

            const data = await response.json();
            console.log('Guestbook entry submitted:', data);

            // Clear the form
            setText('');
            setDrawing('');

            // Fetch updated entries
            fetchEntries();
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
                    <MouseDraw x={0} y={0} width={500} height={300} thickness={3} onDrawingComplete={setDrawing} />
                </svg>
            </div>

            <button className="guestbook-submit" onClick={handleSubmit}>Submit</button>

            <div className="guestbook-entries">
                <h2>Previous Entries</h2>
                {entries.length > 0 ? (
                    entries.map((entry, index) => (
                        <div key={index} className="entry">
                            <p>{entry.text}</p>
                            {entry.drawing && <img src={entry.drawing} alt="User Drawing" />}
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
