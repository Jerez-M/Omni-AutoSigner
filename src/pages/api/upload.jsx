// upload.jsx
import formidable from 'formidable';
import fs from 'fs';
import path from 'path';

export const config = {
    api: {
        bodyParser: false, // Disable default body parsing
    },
};

export default async function handler(req, res) {
    if (req.method === 'POST') {
        const form = new formidable.IncomingForm();
        const uploadsFolder = path.join(process.cwd(), '/public/uploads');

        // Ensure the uploads folder exists
        if (!fs.existsSync(uploadsFolder)) {
            fs.mkdirSync(uploadsFolder, { recursive: true });
        }

        form.parse(req, (err, fields, files) => {
            if (err) {
                console.error('Error parsing form:', err);
                return res.status(500).json({ error: 'Error parsing form' });
            }

            const file = files.file;
            const tempPath = file.filepath;
            const newPath = path.join(uploadsFolder, file.originalFilename);

            fs.rename(tempPath, newPath, (err) => {
                if (err) {
                    console.error('Error saving file:', err);
                    return res.status(500).json({ error: 'Error saving file' });
                }
                res.status(200).json({ message: 'File uploaded successfully', filePath: `/uploads/${file.originalFilename}` });
            });
        });
    } else {
        res.status(405).json({ error: 'Method not allowed' });
    }
}
