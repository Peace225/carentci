const express = require('express');
const router = express.Router();
const vehicleController = require('../controllers/vehicleController');
const { authMiddleware } = require('../middleware/auth');

// ROUTES PUBLIQUES
router.get('/', vehicleController.getAllVehicles);
router.get('/type/:type', vehicleController.getVehiclesByType);
router.get('/category/:category', vehicleController.getVehiclesByCategory);
router.get('/:id', vehicleController.getVehicleById);
router.get('/:id/availability', vehicleController.checkAvailability);

// ROUTES ADMIN (Clean, sans multer car l'upload se fait via /api/upload)
router.post('/', authMiddleware, vehicleController.createVehicle);
router.put('/:id', authMiddleware, vehicleController.updateVehicle);
router.patch('/:id/stock', authMiddleware, vehicleController.updateStock);
router.patch('/:id/sold', authMiddleware, vehicleController.updateSoldStatus);
router.delete('/:id', authMiddleware, vehicleController.deleteVehicle);

module.exports = router;