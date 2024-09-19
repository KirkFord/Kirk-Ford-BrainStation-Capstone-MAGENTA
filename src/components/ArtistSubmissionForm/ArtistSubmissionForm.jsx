import React, { useState } from 'react';
import './ArtistSubmissionForm.scss';

const ArtistSubmissionForm = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [aboutPractice, setAboutPractice] = useState('');
    const [accessibilityAdherence, setAccessibilityAdherence] = useState('');
    const [cvFile, setCvFile] = useState(null); // CV file

    // File size validation for CV upload
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file && file.size > 4.5 * 1024 * 1024) { // 4.5MB limit
            alert('File size exceeds 4.5MB limit.');
            setCvFile(null); // Clear the file if it exceeds the limit
        } else {
            setCvFile(file); // Set the file if valid
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('name', name);
        formData.append('email', email);
        formData.append('aboutPractice', aboutPractice);
        formData.append('accessibilityAdherence', accessibilityAdherence);

        if (cvFile) {
            formData.append('cv', cvFile); // Add CV file to formData
        }

        try {
            const response = await fetch('/api/aAtist-submissions', {
                method: 'POST',
                body: formData, // Send FormData with both text and file
            });

            const result = await response.json();
            if (response.ok) {
                alert('Submission successful!');
            } else {
                alert(result.error || 'Submission failed.');
            }
        } catch (error) {
            console.error('Error submitting form:', error);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <label>
                Name:
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
            </label>

            <label>
                Email:
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </label>

            <label>
                Tell us about yourself and your practice:
                <textarea value={aboutPractice} onChange={(e) => setAboutPractice(e.target.value)} required />
            </label>

            <label>
                How will your work adhere to W3 accessibility guidelines?
                <textarea value={accessibilityAdherence} onChange={(e) => setAccessibilityAdherence(e.target.value)} required />
            </label>

            <label>
                Upload CV (max 4.5MB):
                <input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={handleFileChange} // Use handleFileChange for file input
                />
            </label>

            <button type="submit">Submit</button>
        </form>
    );
};

export default ArtistSubmissionForm;
