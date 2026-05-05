const express = require('express');
const router = express.Router();
const vehicleController = require('../controllers/vehicleController');
const multer = require('multer');
const path = require('path');
const { authMiddleware } = require('../middleware/auth');

// Configuration Multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'public/uploads/'),
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, 'vehicule-' + uniqueSuffix + path.extname(file.originalname));
    }
});
const upload = multer({ storage });

// ROUTES PUBLIQUES
router.get('/', vehicleController.getAllVehicles);
router.get('/type/:type', vehicleController.getVehiclesByType);
router.get('/category/:category', vehicleController.getVehiclesByCategory);
router.get('/:id', vehicleController.getVehicleById);
router.get('/:id/availability', vehicleController.checkAvailability); // Ligne 31

// ROUTES ADMIN
router.post('/', authMiddleware, upload.array('images', 5), vehicleController.createVehicle);
router.put('/:id', authMiddleware, vehicleController.updateVehicle);
router.patch('/:id/stock', authMiddleware, vehicleController.updateStock);
router.patch('/:id/sold', authMiddleware, vehicleController.updateSoldStatus);
router.delete('/:id', authMiddleware, vehicleController.deleteVehicle);

module.exports = router;