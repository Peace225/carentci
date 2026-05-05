const Vehicle = require('../models/Vehicle');
const db = require('../config/database');

// 1. Récupérer tous les véhicules actifs
exports.getAllVehicles = async (req, res) => {
    try {
        const vehicles = await Vehicle.getAll();
        // Filtrage pour ne montrer que les véhicules non archivés (is_active != 0)
        const activeVehicles = vehicles.filter(v => v.is_active !== 0);
        res.json({ success: true, count: activeVehicles.length, data: activeVehicles });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// 2. Récupérer par type
exports.getVehiclesByType = async (req, res) => {
    try {
        const vehicles = await Vehicle.getByType(req.params.type);
        const activeVehicles = vehicles.filter(v => v.is_active !== 0);
        res.json({ success: true, data: activeVehicles });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// 3. Récupérer par catégorie
exports.getVehiclesByCategory = async (req, res) => {
    try {
        const vehicles = await Vehicle.getByCategory(req.params.category);
        const activeVehicles = vehicles.filter(v => v.is_active !== 0);
        res.json({ success: true, data: activeVehicles });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// 4. Récupérer par ID
exports.getVehicleById = async (req, res) => {
    try {
        const vehicle = await Vehicle.getById(req.params.id);
        if (!vehicle) return res.status(404).json({ success: false, message: 'Véhicule non trouvé' });
        res.json({ success: true, data: vehicle });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// 5. Vérifier la disponibilité (Indispensable pour éviter le crash "Undefined")
exports.checkAvailability = async (req, res) => {
    try {
        const { start_date, end_date } = req.query;
        // Logique simplifiée : à adapter selon ton modèle
        res.json({ success: true, available: true });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// 6. Création (Admin)
exports.createVehicle = async (req, res) => {
    try {
        let imageUrls = [];
        if (req.files) imageUrls = req.files.map(file => `/uploads/${file.filename}`);
        const vehicleId = await Vehicle.create({ 
            ...req.body, 
            images: JSON.stringify(imageUrls), 
            is_active: 1 
        });
        res.status(201).json({ success: true, data: { id: vehicleId } });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// 7. Archivage (Soft Delete) - C'est ici que ton bouton "Supprimer" agit
exports.deleteVehicle = async (req, res) => {
    try {
        const { id } = req.params;
        // On utilise db.query directement car ton server.js montre qu'il supporte await
        await db.query("UPDATE vehicles SET is_active = 0 WHERE id = ?", [id]);
        res.json({ success: true, message: 'Véhicule archivé avec succès' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// 8. Mises à jour rapides
exports.updateVehicle = async (req, res) => { /* Ta logique de PUT ici */ res.json({success: true}); };
exports.updateStock = async (req, res) => { /* Ta logique de PATCH stock */ res.json({success: true}); };
exports.updateSoldStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { is_sold } = req.body;
        await db.query('UPDATE vehicles SET is_sold = ? WHERE id = ?', [is_sold ? 1 : 0, id]);
        res.json({ success: true, message: 'Statut de vente actualisé' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};