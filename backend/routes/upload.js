const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const cloudinary = require('../config/cloudinary');
const { authMiddleware } = require('./auth');

// Dossier uploads local (fallback)
function getUploadDir() {
    const uploadDir = path.join(__dirname, '..', 'public', 'uploads');
    if (!fs.existsSync(uploadDir)) {
        try { fs.mkdirSync(uploadDir, { recursive: true }); } catch(e) {}
    }
    return uploadDir;
}

// Multer en memoire pour Cloudinary
const storage = multer.memoryStorage();

const upload = multer({
    storage,
    limits: { fileSize: 10 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
        const allowed = /jpeg|jpg|png|gif|webp/;
        if (allowed.test(path.extname(file.originalname).toLowerCase()) && allowed.test(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('Seules les images sont autorisées'));
        }
    }
});

// Upload vers Cloudinary
async function uploadToCloudinary(buffer, folder = 'carentci') {
    return new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream(
            { folder, resource_type: 'image' },
            (error, result) => {
                if (error) reject(error);
                else resolve(result);
            }
        ).end(buffer);
    });
}

// Route upload image unique
router.post('/', authMiddleware, upload.single('image'), async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ success: false, message: 'Aucune image fournie' });
        const result = await uploadToCloudinary(req.file.buffer);
        res.json({
            success: true,
            message: 'Image uploadée avec succès',
            data: { imageUrl: result.secure_url, filename: result.public_id }
        });
    } catch (error) {
        console.error('Erreur upload:', error.message, error.http_code || '');
        res.status(500).json({ success: false, message: 'Erreur lors de l\'upload', error: error.message });
    }
});

// Route upload multiple images
router.post('/multiple', authMiddleware, upload.array('images', 50), async (req, res) => {
    try {
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ success: false, message: 'Aucune image fournie' });
        }
        const uploadedFiles = await Promise.all(
            req.files.map(async file => {
                const result = await uploadToCloudinary(file.buffer);
                return { imageUrl: result.secure_url, filename: result.public_id };
            })
        );
        res.json({
            success: true,
            message: `${req.files.length} image(s) uploadée(s) avec succès`,
            data: uploadedFiles
        });
    } catch (error) {
        console.error('Erreur upload multiple:', error.message, error.http_code || '');
        res.status(500).json({ success: false, message: 'Erreur lors de l\'upload', error: error.message });
    }
});

// Route pour lister les dossiers de voitures (local)
router.get('/voitures', (req, res) => {
    try {
        const voituresDir = path.join(getUploadDir(), 'VOITURES');
        if (!fs.existsSync(voituresDir)) return res.json({ success: true, data: [] });
        const folders = fs.readdirSync(voituresDir, { withFileTypes: true })
            .filter(d => d.isDirectory()).map(d => d.name).sort();
        res.json({ success: true, data: folders });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// Route pour lister les images d'un dossier voiture (local)
router.get('/voitures/:folder', (req, res) => {
    try {
        const folder = decodeURIComponent(req.params.folder);
        const folderPath = path.join(getUploadDir(), 'VOITURES', folder);
        if (!fs.existsSync(folderPath)) {
            return res.status(404).json({ success: false, message: 'Dossier non trouvé' });
        }
        const allowed = /\.(jpg|jpeg|png|gif|webp)$/i;
        const images = fs.readdirSync(folderPath)
            .filter(f => allowed.test(f))
            .map(f => `/uploads/VOITURES/${encodeURIComponent(folder)}/${encodeURIComponent(f)}`);
        res.json({ success: true, data: images });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

module.exports = { router, getUploadDir };
