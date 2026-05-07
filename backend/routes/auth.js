const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');

// ---------------------------------------------------------
// MIDDLEWARE D'AUTHENTIFICATION (À placer en haut pour qu'il soit disponible)
// ---------------------------------------------------------
const authMiddleware = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        
        if (!token) {
            return res.status(401).json({ success: false, message: 'Token manquant' });
        }
        
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'cle_secrete_de_secours_au_cas_ou');
        req.user = decoded;
        next();
        
    } catch (error) {
        return res.status(401).json({ success: false, message: 'Token invalide ou expiré' });
    }
};

// ---------------------------------------------------------
// INSCRIPTION (Désactivée en production)
// ---------------------------------------------------------
router.post('/register', async (req, res) => {
    if (process.env.NODE_ENV === 'production') {
        return res.status(403).json({ success: false, message: 'Inscription désactivée en production' });
    }
    
    try {
        const { email, password, role } = req.body;
        const supabase = req.supabase; // Récupéré depuis server.js
        
        // 1. Vérifier si l'utilisateur existe déjà
        const { data: existingUser } = await supabase
            .from('users')
            .select('id')
            .eq('email', email)
            .single();

        if (existingUser) {
            return res.status(400).json({ success: false, message: 'Cet email est déjà utilisé' });
        }
        
        // 2. Créer l'utilisateur
        const { data: newUser, error } = await supabase
            .from('users')
            .insert([{ email, password, role: role || 'admin' }])
            .select()
            .single();
            
        if (error) throw error;
        
        res.status(201).json({
            success: true,
            message: 'Utilisateur créé avec succès',
            data: { id: newUser.id }
        });
        
    } catch (error) {
        console.error('Erreur inscription:', error);
        res.status(500).json({ success: false, message: 'Erreur lors de l\'inscription', error: error.message });
    }
});

// ---------------------------------------------------------
// CONNEXION
// ---------------------------------------------------------
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const supabase = req.supabase; // Récupéré depuis server.js

        // 1. Chercher l'utilisateur par son email ET vérifier le mot de passe
        const { data: user, error } = await supabase
            .from('users')
            .select('*')
            .eq('email', email)
            .single();

        // 2. Vérification existence et mot de passe (comparaison directe pour l'instant)
        if (error || !user || user.password !== password) {
            return res.status(401).json({
                success: false,
                message: 'Email ou mot de passe incorrect'
            });
        }

        // 3. Générer le token JWT
        const token = jwt.sign(
            { id: user.id, email: user.email, role: user.role },
            process.env.JWT_SECRET || 'cle_secrete_de_secours_au_cas_ou',
            { expiresIn: '7d' } // Le token est valable 7 jours
        );

        // 4. Réponse pour le frontend (le format correspond exactement à ce qu'attend AdminLogin.jsx)
        res.json({
            success: true,
            message: 'Connexion réussie',
            token: token,
            user: {
                id: user.id,
                email: user.email,
                role: user.role
            }
        });

    } catch (error) {
        console.error('Erreur connexion:', error);
        res.status(500).json({
            success: false,
            message: 'Erreur serveur lors de la connexion',
            error: error.message
        });
    }
});

// ---------------------------------------------------------
// PROFIL UTILISATEUR (Route protégée)
// ---------------------------------------------------------
router.get('/me', authMiddleware, async (req, res) => {
    try {
        const supabase = req.supabase;
        
        // On récupère les infos sauf le mot de passe
        const { data: user, error } = await supabase
            .from('users')
            .select('id, email, role, created_at')
            .eq('id', req.user.id)
            .single();
        
        if (error || !user) {
            return res.status(404).json({ success: false, message: 'Utilisateur non trouvé' });
        }
        
        res.json({
            success: true,
            data: user
        });
        
    } catch (error) {
        console.error('Erreur profil:', error);
        res.status(500).json({ success: false, message: 'Erreur lors de la récupération du profil' });
    }
});

module.exports = router;
module.exports.authMiddleware = authMiddleware;