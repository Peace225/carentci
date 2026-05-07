const express = require('express');
const router = express.Router();
const leadController = require('../controllers/leadController');
const { authMiddleware } = require('../middleware/auth');

// Public : Créer un prospect
router.post('/', leadController.createLead);

// Admin : Voir et Supprimer
router.get('/', authMiddleware, leadController.getAllLeads);
router.patch('/:id/status', authMiddleware, leadController.updateLeadStatus);
router.delete('/:id', authMiddleware, leadController.deleteLead);

module.exports = router;