const jwt = require('jsonwebtoken');

exports.login = async (req, res) => {
    const { email, password } = req.body;

    try {
        // 1. Vérification de l'utilisateur (Exemple simplifié)
        // Dans la réalité, compare avec ta base de données et utilise bcrypt pour le mot de passe
        if (email === "admin@carent.ci" && password === "ton_mot_de_passe_securise") {
            
            // 2. Définition du Payload (les données contenues dans le token)
            const payload = {
                id: 1,
                role: 'admin',
                name: 'Developpeur'
            };

            // 3. Création du Token
            // Utilise la clé secrète de ton fichier .env
            const token = jwt.sign(
                payload, 
                process.env.JWT_SECRET || 'carrent_ci_secret_2026', 
                { expiresIn: '24h' } // Le token expire après 24 heures
            );

            // 4. Envoi de la réponse avec le TOKEN
            return res.json({
                success: true,
                message: "Connexion réussie",
                token: token // C'est ce champ que le frontend va lire
            });
        }

        return res.status(401).json({ success: false, message: "Identifiants invalides" });

    } catch (error) {
        res.status(500).json({ success: false, message: "Erreur serveur" });
    }
};