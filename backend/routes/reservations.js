const express = require('express');
const router = express.Router();
const reservationController = require('../controllers/reservationController');
// ✅ CORRECTION : Le bon chemin vers le dossier middleware
const { authMiddleware } = require('../middleware/auth'); 

// ==========================================
// ROUTES PUBLIQUES (Client)
// ==========================================
router.post('/', reservationController.createReservation);
router.get('/whatsapp/:whatsapp', reservationController.getReservationsByWhatsapp);

// ==========================================
// ROUTES ADMIN PROTÉGÉES (Dashboard)
// ==========================================
router.get('/', authMiddleware, reservationController.getAllReservations);
router.get('/stats', authMiddleware, reservationController.getStats);
router.get('/:id', authMiddleware, reservationController.getReservationById);
router.patch('/:id/status', authMiddleware, reservationController.updateReservationStatus);
router.put('/:id', authMiddleware, reservationController.updateReservation);
router.delete('/:id', authMiddleware, reservationController.deleteReservation);

module.exports = router;