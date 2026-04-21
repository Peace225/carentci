const express = require('express');
const router = express.Router();
const promoCodeController = require('../controllers/promoCodeController');
const { authMiddleware } = require('./auth');

// Routes publiques
router.post('/validate', promoCodeController.validatePromoCode);
router.get('/client/:whatsapp', promoCodeController.getClientPromoCodes);

// Routes admin protégées
router.get('/', authMiddleware, promoCodeController.getAllPromoCodes);
router.post('/', authMiddleware, promoCodeController.createPromoCode);
router.put('/:id', authMiddleware, promoCodeController.updatePromoCode);
router.delete('/:id', authMiddleware, promoCodeController.deletePromoCode);

module.exports = router;
