import { kv } from '@vercel/kv'; // Assuming you're using Vercel KV for data storage

export default async function handler(req, res) {
    const { method } = req;

    switch (method) {
        case 'POST': {
            const { text, drawing } = req.body;

            if (!text || !drawing) {
                console.error('Validation Error: Text and drawing are required.');
                return res.status(400).json({ error: 'Text and drawing are required.' });
            }

            try {
                const entryId = `guestbook_${Date.now()}`;
                await kv.set(entryId, { text, drawing });
                console.log(`Guestbook entry saved with ID: ${entryId}`);
                return res.status(201).json({ message: 'Guestbook entry saved.', entryId });
            } catch (error) {
                console.error('Error saving guestbook entry:', error);
                return res.status(500).json({ error: 'Error saving guestbook entry.' });
            }
        }

        case 'GET': {
            try {
                const keys = await kv.keys('*guestbook_*');
                const entries = await Promise.all(
                    keys.map(async (key) => {
                        const entry = await kv.get(key);
                        return { id: key, ...entry };
                    })
                );
                console.log('Fetched guestbook entries:', entries);
                return res.status(200).json({ entries });
            } catch (error) {
                console.error('Error fetching guestbook entries:', error);
                return res.status(500).json({ error: 'Error fetching entries.' });
            }
        }

        case 'PUT': {
            const { id, text, drawing } = req.body;

            if (!id || (!text && !drawing)) {
                console.error('Validation Error: ID, and at least text or drawing, are required.');
                return res.status(400).json({ error: 'ID, and at least text or drawing, are required.' });
            }

            try {
                const entry = await kv.get(id);
                if (!entry) {
                    console.error(`Entry not found for ID: ${id}`);
                    return res.status(404).json({ error: 'Entry not found.' });
                }

                const updatedEntry = {
                    ...entry,
                    text: text || entry.text,
                    drawing: drawing || entry.drawing,
                };

                await kv.set(id, updatedEntry);
                console.log(`Guestbook entry updated with ID: ${id}`, updatedEntry);
                return res.status(200).json({ message: 'Guestbook entry updated.', entry: updatedEntry });
            } catch (error) {
                console.error('Error updating guestbook entry:', error);
                return res.status(500).json({ error: 'Error updating guestbook entry.' });
            }
        }

        case 'DELETE': {
            const { id } = req.query; // Accept id as query param

            if (!id) {
                console.error('Validation Error: ID is required for deletion.');
                return res.status(400).json({ error: 'ID is required.' });
            }

            try {
                const entry = await kv.get(id);
                if (!entry) {
                    console.error(`Entry not found for ID: ${id}`);
                    return res.status(404).json({ error: 'Entry not found.' });
                }

                await kv.del(id);
                console.log(`Guestbook entry deleted with ID: ${id}`);
                return res.status(200).json({ message: 'Guestbook entry deleted.' });
            } catch (error) {
                console.error('Error deleting guestbook entry:', error);
                return res.status(500).json({ error: 'Error deleting guestbook entry.' });
            }
        }

        default:
            console.error(`Method ${method} Not Allowed`);
            return res.status(405).json({ error: `Method ${method} Not Allowed` });
    }
}
