import { kv } from '@vercel/kv';
import { put } from '@vercel/blob';

export default async function handler(req, res) {
    if (req.method === 'POST') {
        try {
            const { name, email, pronouns, portfolio, socialMedia, accommodations, aboutPractice, accessibilityAdherence, statementOfIntent, cv } = req.body;

            // Validate required fields
            if (!name || !email || !aboutPractice || !accessibilityAdherence || !cv) {
                return res.status(400).json({
                    error: 'Name, email, practice details, accessibility adherence, and CV are required.',
                });
            }

            // Handle CV file upload from the client-side
            let cvUrl = '';
            if (cv) {
                const filename = `uploads/${Date.now()}_${cv.name}`; // Generate a unique filename
                
                try {
                    // Upload the file to Vercel Blob
                    const { url } = await put(filename, cv, {
                        access: 'public', // Make the file public
                    });
                    cvUrl = url; // Store the uploaded file's URL
                } catch (error) {
                    console.error('Error uploading file to Blob:', error);
                    return res.status(500).json({ error: 'Error uploading CV file.' });
                }
            }

            // Prepare data for KV storage
            const timestamp = Date.now();
            const entryId = `submission_${timestamp}`;

            const submissionData = {
                name,
                email,
                pronouns,
                portfolio,
                socialMedia,
                accommodations,
                aboutPractice,
                accessibilityAdherence,
                statementOfIntent,
                cvUrl,
                timestamp,
            };

            // Store submission data in Vercel KV
            await kv.set(entryId, submissionData);

            return res.status(200).json({
                message: 'Submission saved successfully!',
                entryId,
            });
        } catch (error) {
            console.error('Error saving submission:', error);
            return res.status(500).json({ error: 'Error processing submission.' });
        }
    } else {
        return res.status(405).json({ error: 'Method not allowed.' });
    }
}
