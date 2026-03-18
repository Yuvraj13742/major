import express from 'express';
import multer from 'multer';
import archiver from 'archiver';
import cors from 'cors';
import AdmZip from 'adm-zip';
import { spawn } from 'child_process';
import path from 'path';
import fs from 'fs';
import os from 'os';

const app = express();
app.use(cors());
const upload = multer({ storage: multer.memoryStorage() });

// Orchestration engine calling the Java multithread executable
const executeJava = (tempDir, action) => {
    return new Promise((resolve, reject) => {
        // Pointing dynamically to the neighboring injava directory
        const injavaPath = path.resolve(process.cwd(), '../injava');
        
        const javaProcess = spawn('java', ['Main', tempDir, action], {
            cwd: injavaPath
        });

        javaProcess.stdout.on('data', (data) => console.log(`Java Info: ${data}`));
        javaProcess.stderr.on('data', (data) => console.error(`Java Log: ${data}`));

        javaProcess.on('close', (code) => {
            if (code === 0) resolve();
            else reject(new Error(`Java process crashed with code ${code}`));
        });
    });
};

app.post('/api/encrypt', upload.array('files'), async (req, res) => {
    try {
        if (!req.files || req.files.length === 0) return res.status(400).json({ error: 'No files uploaded.' });

        const sessionID = Math.random().toString(36).substring(7);
        const tempDir = path.join(os.tmpdir(), `vaultx_${sessionID}`);
        
        // Write virtual files to actual physical disk matching the Java input expectation
        for (const file of req.files) {
            const filePath = path.join(tempDir, file.originalname);
            await fs.promises.mkdir(path.dirname(filePath), { recursive: true });
            await fs.promises.writeFile(filePath, file.buffer);
        }

        // Delegate execution to the Java ProcessManagement multithreaded engine
        await executeJava(tempDir, 'ENCRYPT');

        res.setHeader('Content-Type', 'application/zip');
        res.setHeader('Content-Disposition', 'attachment; filename=encrypted-vault.zip');

        const archive = archiver('zip', { zlib: { level: 9 } });
        archive.pipe(res);
        archive.directory(tempDir, false);
        await archive.finalize();

        await fs.promises.rm(tempDir, { recursive: true, force: true });
    } catch (e) {
        console.error(e);
        if (!res.headersSent) res.status(500).json({ error: 'Server error orchestrating Java' });
    }
});

app.post('/api/decrypt', upload.array('files'), async (req, res) => {
    try {
        if (!req.files || req.files.length === 0) return res.status(400).json({ error: 'No files uploaded.' });

        const sessionID = Math.random().toString(36).substring(7);
        const tempDir = path.join(os.tmpdir(), `vaultx_dec_${sessionID}`);
        await fs.promises.mkdir(tempDir, { recursive: true });

        const firstFile = req.files[0];
        if (firstFile.originalname.endsWith('.zip') || firstFile.mimetype === 'application/zip' || firstFile.mimetype === 'application/x-zip-compressed') {
            const zip = new AdmZip(firstFile.buffer);
            const zipEntries = zip.getEntries();
            
            for (const entry of zipEntries) {
                if (!entry.isDirectory) {
                    const filePath = path.join(tempDir, entry.entryName);
                    await fs.promises.mkdir(path.dirname(filePath), { recursive: true });
                    await fs.promises.writeFile(filePath, entry.getData());
                }
            }
        } else {
            for (const file of req.files) {
                const filePath = path.join(tempDir, file.originalname);
                await fs.promises.mkdir(path.dirname(filePath), { recursive: true });
                await fs.promises.writeFile(filePath, file.buffer);
            }
        }

        await executeJava(tempDir, 'DECRYPT');

        res.setHeader('Content-Type', 'application/zip');
        res.setHeader('Content-Disposition', 'attachment; filename=decrypted-vault.zip');

        const archive = archiver('zip', { zlib: { level: 9 } });
        archive.pipe(res);
        archive.directory(tempDir, false);
        await archive.finalize();

        await fs.promises.rm(tempDir, { recursive: true, force: true });
    } catch (e) {
        console.error(e);
        if (!res.headersSent) res.status(500).json({ error: 'Server error orchestrating Java' });
    }
});

// Serve the React Frontend UI statically alongside the API
app.use(express.static(path.join(process.cwd(), 'dist')));
app.get('*', (req, res) => {
    if (!req.path.startsWith('/api/')) {
        res.sendFile(path.join(process.cwd(), 'dist', 'index.html'));
    }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`VaultX Application successfully running on port ${PORT}`));

export default app;
