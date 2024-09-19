import { put } from '@vercel/blob';
import { NextResponse } from 'next/server';

export async function POST(request) {
    try {
        const { searchParams } = new URL(request.url);
        const filename = searchParams.get('filename');

        if (!filename) {
            return NextResponse.json({ error: 'Filename is required' }, { status: 400 });
        }

        // Convert the request body into a Buffer (for handling files)
        const fileBuffer = await request.arrayBuffer();

        // Upload the file buffer to Vercel Blob
        const blob = await put(filename, Buffer.from(fileBuffer), {
            access: 'public', // Ensure public access for uploaded files
        });

        // Return the uploaded blob URL
        return NextResponse.json(blob);
    } catch (error) {
        console.error('Error uploading file:', error);
        return NextResponse.json({ error: 'Error uploading file' }, { status: 500 });
    }
}
