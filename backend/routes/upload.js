const express = require('express');
const multer = require('multer');

const router = express.Router();

// Configuration Multer : RAM (mémoire vive) pour la fluidité et éviter la saturation disque
const upload = multer({ 
    storage: multer.memoryStorage(),
    limits: { fileSize: 5 * 1024 * 1024 } // Sécurité : 5Mo max par image
});

router.post('/', upload.single('image'), async (req, res) => {
    try {
        const file = req.file;
        const supabase = req.supabase;

        // 1. Vérification des pré-requis
        if (!supabase) {
            throw new Error("Le client Supabase n'est pas initialisé sur le serveur.");
        }
        if (!file) {
            return res.status(400).json({ success: false, message: 'Aucun fichier détecté.' });
        }

        // 2. Nettoyage et génération du nom unique
        const cleanFileName = file.originalname.replace(/[^a-zA-Z0-9.\-]/g, "_");
        const fileName = `${Date.now()}-${cleanFileName}`;

        console.log(`📡 Tentative d'upload vers le bucket 'vehicules' : ${fileName}`);

        // 3. Envoi vers Supabase Storage
        const { data, error } = await supabase.storage
            .from('vehicules') 
            .upload(fileName, file.buffer, {
                contentType: file.mimetype,
                upsert: true
            });

        // Si Supabase renvoie une erreur
        if (error) {
            console.error("🚨 Erreur Supabase Storage:", error);
            return res.status(500).json({ success: false, message: error.message });
        }

        // 4. Génération de l'URL publique
        const { data: publicUrlData } = supabase.storage
            .from('vehicules')
            .getPublicUrl(fileName);

        console.log("✅ Image uploadée avec succès :", publicUrlData.publicUrl);

        res.json({ 
            success: true, 
            url: publicUrlData.publicUrl 
        });

    } catch (err) {
        console.error("💥 Crash critique Upload:", err.message);
        res.status(500).json({ 
            success: false, 
            message: "Erreur interne du serveur lors de l'upload.",
            error: err.message 
        });
    }
});

module.exports = { router };