const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// Regex simple pour valider email
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// ---------------------------------------------------------
// MIDDLEWARE D'AUTHENTIFICATION
// ---------------------------------------------------------
const authMiddleware = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader ||!authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ success: false, message: 'Token manquant ou mal formaté' });
        }

        const token = authHeader.split(' ')[1];

        if (!process.env.JWT_SECRET) {
            console.error('❌ ERREUR : JWT_SECRET manquant');
            return res.status(500).json({ success: false, message: 'Erreur de configuration serveur' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();

    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ success: false, message: 'Token expiré, veuillez vous reconnecter' });
        }
        return res.status(401).json({ success: false, message: 'Token invalide' });
    }
};

// ---------------------------------------------------------
// INSCRIPTION - Avec hash du mot de passe
// ---------------------------------------------------------
router.post('/register', async (req, res) => {
    if (process.env.NODE_ENV === 'production') {
        return res.status(403).json({ success: false, message: 'Inscription désactivée en production' });
    }

    try {
        const { email, password, role } = req.body;

        if (!email ||!password) {
            return res.status(400).json({ success: false, message: 'Email et mot de passe requis' });
        }

        const normalizedEmail = email.trim().toLowerCase();

        if (!EMAIL_REGEX.test(normalizedEmail)) {
            return res.status(400).json({ success: false, message: 'Format email invalide' });
        }

        if (password.length < 8) {
            return res.status(400).json({ success: false, message: 'Le mot de passe doit faire au moins 8 caractères' });
        }

        const supabase = req.supabase;

        // 1. Vérifier si l'utilisateur existe
        const { data: existingUser, error: checkError } = await supabase
          .from('users')
          .select('id')
          .eq('email', normalizedEmail)
          .maybeSingle();

        if (checkError) {
            console.error('Erreur check user:', checkError.message);
            return res.status(500).json({ success: false, message: 'Erreur serveur' });
        }

        if (existingUser) {
            return res.status(400).json({ success: false, message: 'Cet email est déjà utilisé' });
        }

        // 2. Hasher le mot de passe
        const hashedPassword = await bcrypt.hash(password, 10);

        // 3. Créer l'utilisateur
        const { data: newUser, error } = await supabase
          .from('users')
          .insert([{
                email: normalizedEmail,
                password: hashedPassword,
                role: role || 'user'
            }])
          .select('id, email, role')
          .single();

        if (error) {
            console.error('Erreur insert user:', error.message);
            return res.status(500).json({ success: false, message: 'Erreur lors de la création' });
        }

        res.status(201).json({
            success: true,
            message: 'Utilisateur créé avec succès',
            data: newUser
        });

    } catch (error) {
        console.error('Erreur inscription:', error);
        res.status(500).json({ success: false, message: 'Erreur lors de l\'inscription' });
    }
});

// ---------------------------------------------------------
// CONNEXION - Avec vérification bcrypt
// ---------------------------------------------------------
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email ||!password) {
            return res.status(400).json({ success: false, message: 'Email et mot de passe requis' });
        }

        const normalizedEmail = email.trim().toLowerCase();
        const supabase = req.supabase;

        // 1. Chercher l'utilisateur
        const { data: user, error } = await supabase
          .from('users')
          .select('*')
          .eq('email', normalizedEmail)
          .maybeSingle();

        if (error) {
            console.error('Erreur fetch user:', error.message);
            return res.status(500).json({ success: false, message: 'Erreur serveur' });
        }

        // 2. Vérifier existence + mot de passe
        if (!user ||!(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({
                success: false,
                message: 'Email ou mot de passe incorrect'
            });
        }

        // 3. Vérifier que JWT_SECRET existe
        if (!process.env.JWT_SECRET) {
            console.error('❌ ERREUR : JWT_SECRET manquant');
            return res.status(500).json({ success: false, message: 'Erreur de configuration serveur' });
        }

        // 4. Générer le token
        const token = jwt.sign(
            { id: user.id, email: user.email, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        // 5. Réponse
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
            message: 'Erreur serveur lors de la connexion'
        });
    }
});

// ---------------------------------------------------------
// PROFIL UTILISATEUR
// ---------------------------------------------------------
router.get('/me', authMiddleware, async (req, res) => {
    try {
        const supabase = req.supabase;

        const { data: user, error } = await supabase
          .from('users')
          .select('id, email, role, created_at')
          .eq('id', req.user.id)
          .maybeSingle();

        if (error) {
            console.error('Erreur fetch profil:', error.message);
            return res.status(500).json({ success: false, message: 'Erreur serveur' });
        }

        if (!user) {
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