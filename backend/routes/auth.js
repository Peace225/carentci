const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Inscription (désactivée en production)
router.post('/register', async (req, res) => {
    if (process.env.NODE_ENV === 'production') {
        return res.status(403).json({ success: false, message: 'Inscription désactivée' });
    }
    try {
        const { name, email, password, role } = req.body;
        
        // Vérifier si l'utilisateur existe déjà
        const existingUser = await User.findByEmail(email);
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: 'Cet email est déjà utilisé'
            });
        }
        
        // Créer l'utilisateur
        const userId = await User.create({ name, email, password, role });
        
        res.status(201).json({
            success: true,
            message: 'Utilisateur créé avec succès',
            data: { id: userId }
        });
        
    } catch (error) {
        console.error('Erreur inscription:', error);
        res.status(500).json({
            success: false,
            message: 'Erreur lors de l\'inscription',
            error: error.message
        });
    }
});

// Connexion (CORRIGÉ : Utilise l'email au lieu du username)
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // 1. Chercher l'utilisateur par son email
        const user = await User.findByEmail(email);
        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Email ou mot de passe incorrect'
            });
        }

        // 2. Vérifier le mot de passe
        const isValidPassword = await User.verifyPassword(password, user.password);
        if (!isValidPassword) {
            return res.status(401).json({
                success: false,
                message: 'Email ou mot de passe incorrect'
            });
        }

        // 3. Générer le token JWT avec une clé de secours au cas où le .env n'est pas chargé
        const token = jwt.sign(
            { id: user.id, email: user.email, role: user.role },
            process.env.JWT_SECRET || 'cle_secrete_de_secours_au_cas_ou',
            { expiresIn: '7d' }
        );

        res.json({
            success: true,
            message: 'Connexion réussie',
            data: {
                token,
                user: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    role: user.role
                }
            }
        });

    } catch (error) {
        console.error('Erreur connexion:', error);
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la connexion',
            error: error.message
        });
    }
});

// Middleware d'authentification
const authMiddleware = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        
        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'Token manquant'
            });
        }
        
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'cle_secrete_de_secours_au_cas_ou');
        req.user = decoded;
        next();
        
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: 'Token invalide'
        });
    }
};

// Profil utilisateur
router.get('/me', authMiddleware, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'Utilisateur non trouvé'
            });
        }
        
        res.json({
            success: true,
            data: user
        });
        
    } catch (error) {
        console.error('Erreur profil:', error);
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la récupération du profil',
            error: error.message
        });
    }
});

module.exports = router;
module.exports.authMiddleware = authMiddleware;