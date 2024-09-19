import { kv } from '@vercel/kv';
import { put } from '@vercel/blob';
import formidable from 'formidable';

export const config = {
    api: {
        bodyParser: false, // Disable body parsing to handle file uploads with formidable
    },
};

export default async function handler(req, res) {
    if (req.method === 'POST') {
        const form = new formidable.IncomingForm({
            multiples: false, // Handle one file at a time
            maxFileSize: 4.5 * 1024 * 1024, // Limit to 4.5 MB due to Vercel's limit
        });

        // Parse the incoming form data
        form.parse(req, async (err, fields, files) => {
            if (err) {
                console.error('Error parsing form:', err);
                return res.status(500).json({ error: 'Error processing the form.' });
            }

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
            } = fields;

            // Check if all required fields are filled
            if (!name || !email || !aboutPractice || !accessibilityAdherence) {
                return res.status(400).json({
                    error: 'Name, email, practice details, and accessibility adherence are required.',
                });
            }

            let cvUrl = '';
            if (files.cv) {
                const file = files.cv; // Get the CV file
                const filename = `uploads/${Date.now()}_${file.originalFilename}`; // Generate a unique filename

                try {
                    // Upload the file to Vercel Blob
                    const { url } = await put(filename, file.filepath, {
                        access: 'public', // Make the file public
                    });

                    cvUrl = url; // Store the uploaded file's URL
                } catch (error) {
                    console.error('Error uploading file to Blob:', error);
                    return res.status(500).json({ error: 'Error uploading CV file.' });
                }
            }

            const timestamp = Date.now();
            const entryId = `submission_${timestamp}`;

            // Structure the submission data as per the form fields
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

            // Store submission in Vercel KV
            await kv.set(entryId, submissionData);

            return res.status(200).json({
                message: 'Submission saved successfully!',
                entryId,
            });
        });
    } else {
        return res.status(405).json({ error: 'Method not allowed.' });
    }
}
