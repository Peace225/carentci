const express = require('express');
const router = express.Router();
const promoCodeController = require('../controllers/promoCodeController');
const { authMiddleware } = require('../middleware/auth');

// Toutes les routes sont protégées par le middleware admin
router.get('/', authMiddleware, promoCodeController.getAllPromoCodes);
router.post('/', authMiddleware, promoCodeController.createPromoCode);
router.delete('/:id', authMiddleware, promoCodeController.deletePromoCode);

module.exports = router;