const jwt = require('jsonwebtoken');
const { supabase } = require('../config/supabase');
const bcrypt = require('bcryptjs');

exports.login = async (req, res) => {
    const { email, password } = req.body;
    
    console.log('[LOGIN] Tentative:', email);

    if (!email || !password) {
        return res.status(400).json({ success: false, message: 'Email et mot de passe requis' });
    }

    try {
        const { data: user, error } = await supabase
            .from('users')
            .select('*')
            .eq('email', email)
            .maybeSingle();

        if (error) {
            console.error('[LOGIN] Erreur Supabase:', error);
            return res.status(500).json({ success: false, message: 'Erreur serveur' });
        }

        if (!user) {
            console.log('[LOGIN] User introuvable');
            return res.status(401).json({ success: false, message: 'Email ou mot de passe incorrect' });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        
        if (!isPasswordValid) {
            console.log('[LOGIN] Mot de passe invalide');
            return res.status(401).json({ success: false, message: 'Email ou mot de passe incorrect' });
        }

        if (user.role !== 'admin') {
            console.log('[LOGIN] Rôle refusé:', user.role);
            return res.status(403).json({ success: false, message: 'Accès refusé' });
        }

        const token = jwt.sign(
            { id: user.id, email: user.email, role: user.role }, 
            process.env.JWT_SECRET, 
            { expiresIn: '24h' }
        );

        console.log('[LOGIN] Succès pour:', email);
        
        return res.json({
            success: true,
            message: "Connexion réussie",
            token: token
        });

    } catch (error) {
        console.error('[LOGIN] Catch error:', error);
        res.status(500).json({ success: false, message: "Erreur serveur" });
    }
};