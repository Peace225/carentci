const jwt = require('jsonwebtoken');

/**
 * Middleware de sécurité Ultra-Premium
 * Protège les accès aux actions sensibles (POST, PUT, DELETE).
 */
const authMiddleware = (req, res, next) => {
    try {
        // 1. Récupération du header 'Authorization'
        const authHeader = req.headers.authorization;

        // 2. Vérification rigoureuse du format
        // On bloque si le header est absent, mal formé, ou contient la chaîne "undefined"
        if (!authHeader || !authHeader.startsWith('Bearer ') || authHeader === 'Bearer undefined') {
            return res.status(401).json({ 
                success: false, 
                message: "Accès refusé. Session inexistante ou expirée." 
            });
        }

        // 3. Extraction du jeton
        const token = authHeader.split(' ')[1];

        if (!token) {
            return res.status(401).json({ 
                success: false, 
                message: "Jeton de sécurité manquant." 
            });
        }

        // 4. Vérification avec la clé secrète du .env
        const secretKey = process.env.JWT_SECRET || 'carrent_ci_secret_2026';
        
        // Utilisation de la méthode synchrone dans le try/catch
        const decoded = jwt.verify(token, secretKey);

        // 5. Injection des données dans la requête
        // On utilise 'admin' pour être cohérent avec le dashboard
        req.admin = decoded;
        req.user = decoded; // Compatibilité si tu utilises 'user' ailleurs

        // 6. Autorisation accordée : passage au contrôleur
        next();

    } catch (error) {
        // Gestion des logs pour le développeur (ne pas envoyer au client)
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ success: false, message: "Votre session a expiré." });
        }
        
        console.error("Erreur Auth Middleware :", error.message);
        
        return res.status(401).json({ 
            success: false, 
            message: "Signature de sécurité invalide." 
        });
    }
};

module.exports = { authMiddleware };