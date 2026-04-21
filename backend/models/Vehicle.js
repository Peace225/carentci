const db = require('../config/database');

class Vehicle {
    
    // Récupérer tous les véhicules
    static async getAll() {
        try {
            const [rows] = await db.query(
                'SELECT * FROM vehicles WHERE is_active = 1 ORDER BY created_at DESC'
            );
            return rows;
        } catch (error) {
            throw error;
        }
    }
    
    // Récupérer les véhicules par type (location ou vente)
    static async getByType(type) {
        try {
            const orderBy = type === 'vente' 
                ? 'ORDER BY is_sold ASC, sale_price ASC'
                : 'ORDER BY created_at DESC';
            const [rows] = await db.query(
                `SELECT * FROM vehicles WHERE type = ? AND is_active = 1 ${orderBy}`,
                [type]
            );
            return rows;
        } catch (error) {
            throw error;
        }
    }
    
    // Récupérer les véhicules par catégorie
    static async getByCategory(category) {
        try {
            const [rows] = await db.query(
                'SELECT * FROM vehicles WHERE category = ? AND is_active = 1',
                [category]
            );
            return rows;
        } catch (error) {
            throw error;
        }
    }
    
    // Récupérer un véhicule par ID
    static async getById(id) {
        try {
            const [rows] = await db.query(
                'SELECT * FROM vehicles WHERE id = ?',
                [id]
            );
            return rows[0];
        } catch (error) {
            throw error;
        }
    }
    
    // Créer un nouveau véhicule
    static async create(vehicleData) {
        try {
            const { 
                name, category, type, 
                price_without_driver, price_with_driver, 
                sale_price, year, mileage, fuel_type, transmission,
                features, image_url, images, stock, stock_alert_threshold, description,
                autorise_sans_chauffeur_abidjan, autorise_sans_chauffeur_hors_abidjan
            } = vehicleData;
            
            const [result] = await db.query(
                `INSERT INTO vehicles (
                    name, category, type, 
                    price_without_driver, price_with_driver, 
                    sale_price, year, mileage, fuel_type, transmission,
                    features, image_url, images, stock, stock_alert_threshold, description,
                    autorise_sans_chauffeur_abidjan, autorise_sans_chauffeur_hors_abidjan
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                [
                    name, category, type || 'location',
                    price_without_driver || null, price_with_driver || null,
                    sale_price || null, year || null, mileage || null, fuel_type || null, transmission || null,
                    JSON.stringify(features || []), image_url,
                    images ? JSON.stringify(images) : null,
                    stock !== undefined && stock !== null ? stock : 3,
                    stock_alert_threshold !== undefined && stock_alert_threshold !== null ? stock_alert_threshold : 1,
                    description || '',
                    autorise_sans_chauffeur_abidjan !== undefined ? autorise_sans_chauffeur_abidjan : 1,
                    autorise_sans_chauffeur_hors_abidjan !== undefined ? autorise_sans_chauffeur_hors_abidjan : 1
                ]
            );
            
            return result.insertId;
        } catch (error) {
            throw error;
        }
    }
    // Mettre à jour un véhicule
    // Mettre à jour un véhicule
    static async update(id, vehicleData) {
        try {
            const { 
                name, category, type,
                price_without_driver, price_with_driver, 
                sale_price, year, mileage, fuel_type, transmission,
                features, image_url, images, is_active, stock, stock_alert_threshold, description,
                autorise_sans_chauffeur_abidjan, autorise_sans_chauffeur_hors_abidjan
            } = vehicleData;
            
            const [result] = await db.query(
                `UPDATE vehicles 
                 SET name = ?, category = ?, type = ?,
                     price_without_driver = ?, price_with_driver = ?, 
                     sale_price = ?, year = ?, mileage = ?, fuel_type = ?, transmission = ?,
                     features = ?, image_url = ?, images = ?, is_active = ?, 
                     stock = ?, stock_alert_threshold = ?, description = ?,
                     autorise_sans_chauffeur_abidjan = ?, autorise_sans_chauffeur_hors_abidjan = ?
                 WHERE id = ?`,
                [
                    name, category, type || 'location',
                    price_without_driver || null, price_with_driver || null,
                    sale_price || null, year || null, mileage || null, fuel_type || null, transmission || null,
                    JSON.stringify(features || []), image_url,
                    images ? JSON.stringify(images) : null,
                    is_active,
                    stock !== undefined && stock !== null ? stock : 3,
                    stock_alert_threshold !== undefined && stock_alert_threshold !== null ? stock_alert_threshold : 1,
                    description || '',
                    autorise_sans_chauffeur_abidjan !== undefined ? autorise_sans_chauffeur_abidjan : 1,
                    autorise_sans_chauffeur_hors_abidjan !== undefined ? autorise_sans_chauffeur_hors_abidjan : 1,
                    id
                ]
            );
            
            return result.affectedRows > 0;
        } catch (error) {
            throw error;
        }
    }
    
    // Supprimer un véhicule (soft delete)
    static async delete(id) {
        try {
            const [result] = await db.query(
                'UPDATE vehicles SET is_active = 0 WHERE id = ?',
                [id]
            );
            return result.affectedRows > 0;
        } catch (error) {
            throw error;
        }
    }
    
    // Vérifier la disponibilité d'un véhicule
    static async checkAvailability(vehicleId, startDate, endDate) {
        try {
            const [rows] = await db.query(
                `SELECT COUNT(*) as count FROM reservations 
                 WHERE vehicle_id = ? 
                 AND status IN ('pending', 'confirmed')
                 AND (
                     (start_date <= ? AND end_date >= ?) OR
                     (start_date <= ? AND end_date >= ?) OR
                     (start_date >= ? AND end_date <= ?)
                 )`,
                [vehicleId, startDate, startDate, endDate, endDate, startDate, endDate]
            );
            
            return rows[0].count === 0;
        } catch (error) {
            throw error;
        }
    }
    
    // Mettre à jour le stock d'un véhicule
    static async updateStock(id, stock) {
        try {
            const [result] = await db.query(
                'UPDATE vehicles SET stock = ? WHERE id = ?',
                [stock, id]
            );
            return result.affectedRows > 0;
        } catch (error) {
            throw error;
        }
    }
}

module.exports = Vehicle;
