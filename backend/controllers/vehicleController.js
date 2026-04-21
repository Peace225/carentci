const Vehicle = require('../models/Vehicle');

// Récupérer tous les véhicules
exports.getAllVehicles = async (req, res) => {
    try {
        const vehicles = await Vehicle.getAll();
        
        res.json({
            success: true,
            count: vehicles.length,
            data: vehicles
        });
        
    } catch (error) {
        console.error('Erreur récupération véhicules:', error);
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la récupération des véhicules',
            error: error.message
        });
    }
};

// Récupérer les véhicules par type (location ou vente)
exports.getVehiclesByType = async (req, res) => {
    try {
        const { type } = req.params;
        
        if (!['location', 'vente'].includes(type)) {
            return res.status(400).json({
                success: false,
                message: 'Type invalide. Utilisez "location" ou "vente"'
            });
        }
        
        const vehicles = await Vehicle.getByType(type);
        
        res.json({
            success: true,
            count: vehicles.length,
            data: vehicles
        });
        
    } catch (error) {
        console.error('Erreur récupération véhicules par type:', error);
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la récupération des véhicules',
            error: error.message
        });
    }
};

// Récupérer les véhicules par catégorie
exports.getVehiclesByCategory = async (req, res) => {
    try {
        const { category } = req.params;
        const vehicles = await Vehicle.getByCategory(category);
        
        res.json({
            success: true,
            count: vehicles.length,
            data: vehicles
        });
        
    } catch (error) {
        console.error('Erreur récupération véhicules:', error);
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la récupération des véhicules',
            error: error.message
        });
    }
};

// Récupérer un véhicule par ID
exports.getVehicleById = async (req, res) => {
    try {
        const { id } = req.params;
        const vehicle = await Vehicle.getById(id);
        
        if (!vehicle) {
            return res.status(404).json({
                success: false,
                message: 'Véhicule non trouvé'
            });
        }
        
        res.json({
            success: true,
            data: vehicle
        });
        
    } catch (error) {
        console.error('Erreur récupération véhicule:', error);
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la récupération du véhicule',
            error: error.message
        });
    }
};

// Créer un nouveau véhicule
exports.createVehicle = async (req, res) => {
    try {
        const vehicleId = await Vehicle.create(req.body);
        
        res.status(201).json({
            success: true,
            message: 'Véhicule créé avec succès',
            data: { id: vehicleId }
        });
        
    } catch (error) {
        console.error('Erreur création véhicule:', error);
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la création du véhicule',
            error: error.message
        });
    }
};

// Mettre à jour un véhicule
exports.updateVehicle = async (req, res) => {
    try {
        const { id } = req.params;
        const updated = await Vehicle.update(id, req.body);
        
        if (!updated) {
            return res.status(404).json({
                success: false,
                message: 'Véhicule non trouvé'
            });
        }
        
        res.json({
            success: true,
            message: 'Véhicule mis à jour avec succès'
        });
        
    } catch (error) {
        console.error('Erreur mise à jour véhicule:', error);
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la mise à jour du véhicule'
        });
    }
};

// Supprimer un véhicule
exports.deleteVehicle = async (req, res) => {
    try {
        const { id } = req.params;
        const deleted = await Vehicle.delete(id);
        
        if (!deleted) {
            return res.status(404).json({
                success: false,
                message: 'Véhicule non trouvé'
            });
        }
        
        res.json({
            success: true,
            message: 'Véhicule supprimé avec succès'
        });
        
    } catch (error) {
        console.error('Erreur suppression véhicule:', error);
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la suppression du véhicule',
            error: error.message
        });
    }
};

// Vérifier la disponibilité d'un véhicule
exports.checkAvailability = async (req, res) => {
    try {
        const { id } = req.params;
        const { start_date, end_date } = req.query;
        
        if (!start_date || !end_date) {
            return res.status(400).json({
                success: false,
                message: 'Les dates de début et de fin sont requises'
            });
        }
        
        const isAvailable = await Vehicle.checkAvailability(id, start_date, end_date);
        
        res.json({
            success: true,
            available: isAvailable
        });
        
    } catch (error) {
        console.error('Erreur vérification disponibilité:', error);
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la vérification de la disponibilité',
            error: error.message
        });
    }
};

// Mettre à jour le stock d'un véhicule
exports.updateStock = async (req, res) => {
    try {
        const { id } = req.params;
        const { stock } = req.body;
        
        if (stock === undefined || stock < 0) {
            return res.status(400).json({
                success: false,
                message: 'Le stock doit être un nombre positif'
            });
        }
        
        const updated = await Vehicle.updateStock(id, stock);
        
        if (!updated) {
            return res.status(404).json({
                success: false,
                message: 'Véhicule non trouvé'
            });
        }
        
        res.json({
            success: true,
            message: 'Stock mis à jour avec succès'
        });
        
    } catch (error) {
        console.error('Erreur mise à jour stock:', error);
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la mise à jour du stock',
            error: error.message
        });
    }
};

// Mettre à jour le statut vendu
exports.updateSoldStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { is_sold } = req.body;
        const db = require('../config/database');
        await db.query('UPDATE vehicles SET is_sold = ? WHERE id = ?', [is_sold ? 1 : 0, id]);
        res.json({ success: true, message: is_sold ? 'Véhicule marqué comme vendu' : 'Véhicule marqué comme disponible' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
