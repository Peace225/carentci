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
    
    // ==========================================
    // CRÉER UN NOUVEAU VÉHICULE (Corrigé avec les bonnes colonnes)
    // ==========================================
    static async create(vehicleData) {
        try {
            // On récupère les variables exactes envoyées par React et le Controller
            const { 
                marque, modele, annee, category, transmission, 
                carburant, kilometrage, prix, sale_price, type, images 
            } = vehicleData;
            
            const [result] = await db.query(
                `INSERT INTO vehicles (
                    marque, modele, annee, category, transmission, 
                    carburant, kilometrage, prix, sale_price, type, 
                    images, is_active, is_sold
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1, 0)`,
                [
                    marque, 
                    modele, 
                    annee || null, 
                    category || 'suv', 
                    transmission || null, 
                    carburant || null, 
                    kilometrage || 0, 
                    prix || 0, 
                    sale_price || 0, 
                    type || 'location', 
                    images // Déjà transformé en JSON.stringify dans le controller
                ]
            );
            
            return result.insertId;
        } catch (error) {
            throw error;
        }
    }

    // ==========================================
    // METTRE À JOUR UN VÉHICULE (Corrigé avec les bonnes colonnes)
    // ==========================================
    static async update(id, vehicleData) {
        try {
            const { 
                marque, modele, annee, category, transmission, 
                carburant, kilometrage, prix, sale_price, type, images, is_active 
            } = vehicleData;
            
            // Si de nouvelles images sont fournies, on met à jour la colonne, sinon on garde les anciennes
            let query = `UPDATE vehicles SET 
                         marque = ?, modele = ?, annee = ?, category = ?, 
                         transmission = ?, carburant = ?, kilometrage = ?, 
                         prix = ?, sale_price = ?, type = ?, is_active = ?`;
            
            let values = [
                marque, modele, annee, category, transmission, 
                carburant, kilometrage, prix, sale_price, type, 
                is_active !== undefined ? is_active : 1
            ];

            if (images) {
                query += `, images = ?`;
                values.push(images);
            }

            query += ` WHERE id = ?`;
            values.push(id);

            const [result] = await db.query(query, values);
            
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
    
    // Mettre à jour le stock (si vous avez gardé la colonne stock)
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