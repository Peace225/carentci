const jwt = require('jsonwebtoken');

/**
 * Middleware JWT Ultra-Premium
 * Protège POST, PUT, DELETE, PATCH
 */
const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  // 1. Vérif format Bearer - espace corrigé
  if (!authHeader ||!authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      message: "Accès refusé. Authentification requise."
    });
  }

  // 2. Extraction token
  const token = authHeader.split(' ')[1];

  if (!token || token === 'undefined' || token === 'null') {
    return res.status(401).json({
      success: false,
      message: "Jeton de sécurité manquant."
    });
  }

  // 3. Vérif que JWT_SECRET existe - pas de fallback en prod
  const secretKey = process.env.JWT_SECRET;
  if (!secretKey) {
    console.error("FATAL: JWT_SECRET non défini dans les variables d'env");
    return res.status(500).json({
      success: false,
      message: "Erreur serveur. Configuration invalide."
    });
  }

  try {
    // 4. Vérification du token
    const decoded = jwt.verify(token, secretKey);

    // 5. Injection dans req pour les contrôleurs
    req.admin = decoded;
    req.user = decoded;

    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: "Votre session a expiré. Reconnectez-vous."
      });
    }

    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: "Signature de sécurité invalide."
      });
    }

    console.error("Erreur Auth Middleware:", error.message);
    return res.status(401).json({
      success: false,
      message: "Authentification échouée."
    });
  }
};

module.exports = { authMiddleware };