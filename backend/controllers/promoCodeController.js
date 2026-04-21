const PromoCode = require('../models/PromoCode');

// Valider un code promo
exports.validatePromoCode = async (req, res) => {
    try {
        const { code, client_whatsapp } = req.body;
        
        if (!code || !client_whatsapp) {
            return res.status(400).json({
                success: false,
                message: 'Code promo et numéro WhatsApp requis'
            });
        }
        
        const promoCode = await PromoCode.validate(code, client_whatsapp);
        
        if (!promoCode) {
            return res.json({
                success: false,
                message: 'Code promo invalide, expiré ou déjà utilisé'
            });
        }
        
        res.json({
            success: true,
            data: {
                code: promoCode.code,
                discount_percentage: promoCode.discount_percentage
            }
        });
        
    } catch (error) {
        console.error('Erreur validation code promo:', error);
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la validation du code promo'
        });
    }
};

// Récupérer les codes promo d'un client
exports.getClientPromoCodes = async (req, res) => {
    try {
        const { whatsapp } = req.params;
        
        const promoCodes = await PromoCode.getByWhatsapp(whatsapp);
        
        res.json({
            success: true,
            data: promoCodes
        });
        
    } catch (error) {
        console.error('Erreur récupération codes promo:', error);
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la récupération des codes promo'
        });
    }
};

// Récupérer tous les codes promo (admin)
exports.getAllPromoCodes = async (req, res) => {
    try {
        const codes = await PromoCode.getAll();
        res.json({ success: true, data: codes });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Créer un code promo (admin)
exports.createPromoCode = async (req, res) => {
    try {
        const { client_whatsapp, discount_percentage, expires_at, custom_code } = req.body;
        if (!client_whatsapp) {
            return res.status(400).json({ success: false, message: 'Numéro WhatsApp requis' });
        }
        const discount = parseInt(discount_percentage) || 10;
        if (discount < 1 || discount > 100) {
            return res.status(400).json({ success: false, message: 'Réduction entre 1 et 100%' });
        }
        const result = await PromoCode.createAdmin(client_whatsapp, discount, expires_at || null, custom_code || null);
        res.status(201).json({ success: true, data: result });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Modifier un code promo (admin)
exports.updatePromoCode = async (req, res) => {
    try {
        const { id } = req.params;
        const { discount_percentage, expires_at, is_used } = req.body;
        const updated = await PromoCode.update(id, { discount_percentage, expires_at, is_used });
        if (!updated) return res.status(404).json({ success: false, message: 'Code non trouvé' });
        res.json({ success: true, message: 'Code promo mis à jour' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Supprimer un code promo (admin)
exports.deletePromoCode = async (req, res) => {
    try {
        const { id } = req.params;
        const deleted = await PromoCode.deleteById(id);
        if (!deleted) return res.status(404).json({ success: false, message: 'Code non trouvé' });
        res.json({ success: true, message: 'Code promo supprimé' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = exports;
