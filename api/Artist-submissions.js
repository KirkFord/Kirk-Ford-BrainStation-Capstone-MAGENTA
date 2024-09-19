import { kv } from '@vercel/kv';

export default async function handler(req, res) {
    if (req.method === 'POST') {
        try {
            const {
                name,
                email,
                pronouns,
                portfolio,
                socialMedia,
                accommodations,
                aboutPractice,
                accessibilityAdherence,
                statementOfIntent,
                cvUrl, // This is coming from the client-side after file upload
            } = req.body;

            // Validate required fields
            if (!name || !email || !aboutPractice || !accessibilityAdherence || !cvUrl) {
                return res.status(400).json({
                    error: 'Name, email, practice details, accessibility adherence, and CV are required.',
                });
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
                cvUrl, // Already uploaded by the client
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
