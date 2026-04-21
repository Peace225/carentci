const db = require('../config/database');

class Reservation {
    
    // Créer une nouvelle réservation
    static async create(reservationData) {
        try {
            const {
                client_name,
                client_whatsapp,
                vehicle_id,
                start_date,
                start_time,
                end_date,
                end_time,
                pickup_location,
                with_driver,
                driver_type,
                total_price,
                message,
                quantity,
                session_id,
                promo_code,
                promo_discount
            } = reservationData;
            
            const [result] = await db.query(
                `INSERT INTO reservations 
                (client_name, client_whatsapp, vehicle_id, start_date, start_time, end_date, end_time, 
                 pickup_location, with_driver, driver_type, total_price, message, quantity, status, session_id, promo_code, promo_discount) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending', ?, ?, ?)`,
                [client_name, client_whatsapp, vehicle_id, start_date, start_time, end_date, end_time,
                 pickup_location, with_driver, driver_type || null, total_price, message, quantity || 1,
                 session_id || null, promo_code || null, promo_discount || 0]
            );
            
            return result.insertId;
        } catch (error) {
            throw error;
        }
    }
    
    // Récupérer toutes les réservations
    static async getAll(filters = {}) {
        try {
            let query = `
                SELECT r.*, 
                       COALESCE(v.name, 'Aucun véhicule') as vehicle_name, 
                       v.category as vehicle_category,
                       v.image_url as vehicle_image_url
                FROM reservations r
                LEFT JOIN vehicles v ON r.vehicle_id = v.id
                WHERE 1=1
            `;
            const params = [];
            
            if (filters.status) {
                query += ' AND r.status = ?';
                params.push(filters.status);
            }
            
            if (filters.startDate) {
                query += ' AND r.start_date >= ?';
                params.push(filters.startDate);
            }
            
            if (filters.endDate) {
                query += ' AND r.end_date <= ?';
                params.push(filters.endDate);
            }
            
            query += ' ORDER BY r.created_at DESC';
            
            const [rows] = await db.query(query, params);
            return rows;
        } catch (error) {
            throw error;
        }
    }
    
    // Récupérer une réservation par ID
    static async getById(id) {
        try {
            const [rows] = await db.query(
                `SELECT r.*, 
                        COALESCE(v.name, 'Aucun véhicule') as vehicle_name, 
                        v.category as vehicle_category, 
                        v.price_without_driver, 
                        v.price_with_driver
                 FROM reservations r
                 LEFT JOIN vehicles v ON r.vehicle_id = v.id
                 WHERE r.id = ?`,
                [id]
            );
            return rows[0];
        } catch (error) {
            throw error;
        }
    }
    
    // Récupérer les réservations par numéro WhatsApp
    static async getByWhatsapp(whatsapp) {
        try {
            const [rows] = await db.query(
                `SELECT r.*, v.name as vehicle_name, v.category as vehicle_category
                 FROM reservations r
                 LEFT JOIN vehicles v ON r.vehicle_id = v.id
                 WHERE r.client_whatsapp = ?
                 ORDER BY r.created_at DESC`,
                [whatsapp]
            );
            return rows;
        } catch (error) {
            throw error;
        }
    }
    
    // Mettre à jour le statut d'une réservation
    static async updateStatus(id, status) {
        try {
            const [result] = await db.query(
                'UPDATE reservations SET status = ?, updated_at = NOW() WHERE id = ?',
                [status, id]
            );
            return result.affectedRows > 0;
        } catch (error) {
            throw error;
        }
    }
    
    // Mettre à jour une réservation
    static async update(id, reservationData) {
        try {
            const {
                start_date,
                start_time,
                end_date,
                end_time,
                pickup_location,
                with_driver,
                total_price,
                message,
                status
            } = reservationData;
            
            const [result] = await db.query(
                `UPDATE reservations 
                 SET start_date = ?, start_time = ?, end_date = ?, end_time = ?, 
                     pickup_location = ?, with_driver = ?, total_price = ?, message = ?, 
                     status = ?, updated_at = NOW()
                 WHERE id = ?`,
                [start_date, start_time, end_date, end_time, pickup_location, with_driver, 
                 total_price, message, status, id]
            );
            
            return result.affectedRows > 0;
        } catch (error) {
            throw error;
        }
    }
    
    // Supprimer une réservation
    static async delete(id) {
        try {
            const [result] = await db.query(
                'DELETE FROM reservations WHERE id = ?',
                [id]
            );
            return result.affectedRows > 0;
        } catch (error) {
            throw error;
        }
    }
    
    // Statistiques des réservations
    static async getStats() {
        try {
            const [stats] = await db.query(`
                SELECT 
                    COUNT(*) as total,
                    SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) as pending,
                    SUM(CASE WHEN status = 'confirmed' THEN 1 ELSE 0 END) as confirmed,
                    SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) as completed,
                    SUM(CASE WHEN status = 'cancelled' THEN 1 ELSE 0 END) as cancelled,
                    SUM(CASE WHEN status = 'confirmed' THEN total_price ELSE 0 END) as total_revenue
                FROM reservations
            `);
            return stats[0];
        } catch (error) {
            throw error;
        }
    }
}

module.exports = Reservation;
