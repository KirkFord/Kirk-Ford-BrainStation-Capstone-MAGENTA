import { put } from '@vercel/blob';

export default async function handler(req, res) {
    if (req.method === 'POST') {
        try {
            const { searchParams } = new URL(req.url, `http://${req.headers.host}`);
            const filename = searchParams.get('filename');

            if (!filename) {
                return res.status(400).json({ error: 'Filename is required' });
            }

            // Read the request body as a stream and convert it to a buffer
            const fileBuffer = Buffer.from(await req.arrayBuffer());

            // Upload the file buffer to Vercel Blob
            const blob = await put(filename, fileBuffer, {
                access: 'public', // Ensure public access for uploaded files
            });

            // Return the uploaded blob URL
            return res.status(200).json(blob);
        } catch (error) {
            console.error('Error uploading file:', error);
            return res.status(500).json({ error: 'Error uploading file' });
        }
    } else {
        return res.status(405).json({ error: 'Method not allowed' });
    }
}
