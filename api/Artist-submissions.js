import React, { useState } from 'react';
import './ArtistSubmissionForm.scss';

const ArtistSubmissionForm = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        pronouns: '',
        portfolio: '',
        socialMedia: '',
        accommodations: '',
        cv: null, // CV file
        aboutPractice: '',
        accessibilityAdherence: '',
        statementOfIntent: '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    // File size validation for CV upload
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file && file.size > 4.5 * 1024 * 1024) { // 4.5MB limit
            alert('File size exceeds 4.5MB limit.');
            setFormData({
                ...formData,
                cv: null, // Clear the file if it exceeds the limit
            });
        } else {
            setFormData({
                ...formData,
                cv: file, // Set the file if valid
            });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const submissionData = new FormData();
        for (const key in formData) {
            submissionData.append(key, formData[key]);
        }

        try {
            const response = await fetch('/api/artist-submissions', {
                method: 'POST',
                body: submissionData, // Send FormData with both text and file
            });

            const result = await response.json();
            if (response.ok) {
                alert('Submission successful!');
                setFormData({
                    name: '',
                    email: '',
                    pronouns: '',
                    portfolio: '',
                    socialMedia: '',
                    accommodations: '',
                    cv: null,
                    aboutPractice: '',
                    accessibilityAdherence: '',
                    statementOfIntent: '',
                });
            } else {
                alert(result.error || 'Submission failed.');
            }
        } catch (error) {
            console.error('Error submitting form:', error);
        }
    };

    return (
        <div className="artist-submission-form">
            <h1>Artist Submission Form</h1>
            <p>Please fill out the form below to submit your information.</p>

            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="name">Full Name</label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="pronouns">Preferred Pronouns</label>
                    <input
                        type="text"
                        id="pronouns"
                        name="pronouns"
                        value={formData.pronouns}
                        onChange={handleChange}
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="email">Email Address</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="portfolio">Website or Portfolio Link</label>
                    <input
                        type="url"
                        id="portfolio"
                        name="portfolio"
                        value={formData.portfolio}
                        onChange={handleChange}
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="socialMedia">Social Media Links</label>
                    <textarea
                        id="socialMedia"
                        name="socialMedia"
                        value={formData.socialMedia}
                        onChange={handleChange}
                        placeholder="Include links to relevant social media profiles"
                    ></textarea>
                </div>

                <div className="form-group">
                    <label htmlFor="statementOfIntent">Statement of Intent</label>
                    <textarea
                        id="statementOfIntent"
                        name="statementOfIntent"
                        value={formData.statementOfIntent}
                        onChange={handleChange}
                        placeholder="Provide your artist statement or intent for this submission"
                    ></textarea>
                </div>

                <div className="form-group">
                    <label htmlFor="cv">Upload CV (including Previous Exhibitions/Experience, max 4.5MB)</label>
                    <input
                        type="file"
                        id="cv"
                        name="cv"
                        accept=".pdf,.doc,.docx"
                        onChange={handleFileChange} // Use handleFileChange for file input
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="aboutPractice">Tell us about yourself and your practice</label>
                    <textarea
                        id="aboutPractice"
                        name="aboutPractice"
                        value={formData.aboutPractice}
                        onChange={handleChange}
                        placeholder="Provide details about your artistic journey, style, and mediums you work with"
                        required
                    ></textarea>
                </div>

                <div className="form-group">
                    <label htmlFor="accessibilityAdherence">
                        How will your work adhere to W3 accessibility guidelines and practices? Be specific for your particular discipline/media.
                    </label>
                    <textarea
                        id="accessibilityAdherence"
                        name="accessibilityAdherence"
                        value={formData.accessibilityAdherence}
                        onChange={handleChange}
                        placeholder="Explain how your submission will adhere to accessibility standards"
                        required
                    ></textarea>
                </div>

                <div className="form-group">
                    <label htmlFor="accommodations">Special Accommodations or Needs</label>
                    <textarea
                        id="accommodations"
                        name="accommodations"
                        value={formData.accommodations}
                        onChange={handleChange}
                        placeholder="Please describe any special accommodations or needs you have"
                    ></textarea>
                </div>

                <button type="submit" className="submit-btn">
                    Submit
                </button>
            </form>
        </div>
    );
};

export default ArtistSubmissionForm;
