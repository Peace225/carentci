const express = require('express');
const multer = require('multer');
const router = express.Router();

// Configuration Multer : RAM pour éviter les problèmes de droits d'écriture sur Render
const upload = multer({ 
    storage: multer.memoryStorage(),
    limits: { fileSize: 5 * 1024 * 1024 } // 5Mo max
});

router.post('/', upload.single('image'), async (req, res) => {
    try {
        const file = req.file;
        const supabase = req.supabase;

        // 1. Vérifications de base
        if (!file) {
            return res.status(400).json({ success: false, message: 'Aucun fichier détecté.' });
        }
        if (!supabase) {
            console.error("❌ Erreur : req.supabase est indéfini. Vérifie l'initialisation dans server.js");
            return res.status(500).json({ success: false, message: 'Erreur de configuration serveur (Supabase).' });
        }

        // 2. Nettoyage du nom de fichier (on enlève les accents et caractères spéciaux)
        const timestamp = Date.now();
        const cleanName = file.originalname
            .toLowerCase()
            .replace(/\s+/g, '-')           // remplace espaces par -
            .replace(/[^a-z0-9.-]/g, '');   // garde seulement lettres, chiffres, points et tirets
        const fileName = `${timestamp}-${cleanName}`;

        console.log(`📡 Tentative d'upload : ${fileName} vers le bucket 'vehicules'`);

        // 3. Envoi vers Supabase Storage
        // Utilisation du buffer directement
        const { data, error } = await supabase.storage
            .from('vehicules') 
            .upload(fileName, file.buffer, {
                contentType: file.mimetype,
                cacheControl: '3600',
                upsert: false
            });

        // 4. Gestion des erreurs spécifiques de Supabase
        if (error) {
            console.error("🚨 Erreur Supabase Storage détaillée :", JSON.stringify(error, null, 2));
            return res.status(500).json({ 
                success: false, 
                message: "Supabase a rejeté l'upload.",
                details: error.message 
            });
        }

        // 5. Récupération de l'URL publique
        const { data: publicUrlData } = supabase.storage
            .from('vehicules')
            .getPublicUrl(fileName);

        console.log("✅ Image uploadée avec succès :", publicUrlData.publicUrl);

        res.json({ 
            success: true, 
            url: publicUrlData.publicUrl 
        });

    } catch (err) {
        console.error("💥 Crash critique route Upload :", err);
        res.status(500).json({ 
            success: false, 
            message: "Crash du serveur lors de l'upload.",
            error: err.message 
        });
    }
});

// IMPORTANT : module.exports doit correspondre à ce que tu attends dans server.js
module.exports = { router };