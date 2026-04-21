const db = require('../config/database');

class PromoCode {
    
    // Générer un code promo unique
    static generateCode() {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let code = 'CARRENT';
        for (let i = 0; i < 6; i++) {
            code += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return code;
    }
    
    // Créer un code promo pour un client
    static async create(clientWhatsapp, discountPercentage = 10) {
        try {
            let code = this.generateCode();
            
            // Vérifier que le code est unique
            let exists = true;
            while (exists) {
                const [rows] = await db.query('SELECT id FROM promo_codes WHERE code = ?', [code]);
                if (rows.length === 0) {
                    exists = false;
                } else {
                    code = this.generateCode();
                }
            }
            
            // Date d'expiration: 6 mois
            const expiresAt = new Date();
            expiresAt.setMonth(expiresAt.getMonth() + 6);
            
            const [result] = await db.query(
                `INSERT INTO promo_codes (code, client_whatsapp, discount_percentage, expires_at) 
                 VALUES (?, ?, ?, ?)`,
                [code, clientWhatsapp, discountPercentage, expiresAt]
            );
            
            return { id: result.insertId, code, discount_percentage: discountPercentage };
        } catch (error) {
            throw error;
        }
    }
    
    // Vérifier et récupérer un code promo
    static async validate(code, clientWhatsapp) {
        try {
            const [rows] = await db.query(
                `SELECT * FROM promo_codes 
                 WHERE code = ? AND client_whatsapp = ? AND is_used = FALSE 
                 AND (expires_at IS NULL OR expires_at > NOW())`,
                [code, clientWhatsapp]
            );
            
            return rows.length > 0 ? rows[0] : null;
        } catch (error) {
            throw error;
        }
    }
    
    // Marquer un code comme utilisé
    static async markAsUsed(code) {
        try {
            const [result] = await db.query(
                'UPDATE promo_codes SET is_used = TRUE, used_at = NOW() WHERE code = ?',
                [code]
            );
            return result.affectedRows > 0;
        } catch (error) {
            throw error;
        }
    }
    
    // Compter les réservations confirmées d'un client
    static async countCompletedReservations(clientWhatsapp) {
        try {
            const [rows] = await db.query(
                `SELECT COUNT(*) as count FROM reservations 
                 WHERE client_whatsapp = ? AND status = 'confirmed'`,
                [clientWhatsapp]
            );
            return rows[0].count;
        } catch (error) {
            throw error;
        }
    }
    
    // Vérifier si le client mérite un code promo
    static async checkAndGeneratePromo(clientWhatsapp) {
        try {
            const count = await this.countCompletedReservations(clientWhatsapp);
            
            // Tous les 5 réservations confirmées
            if (count > 0 && count % 5 === 0) {
                // Vérifier si un code non utilisé existe déjà
                const [existing] = await db.query(
                    'SELECT * FROM promo_codes WHERE client_whatsapp = ? AND is_used = FALSE',
                    [clientWhatsapp]
                );
                
                if (existing.length === 0) {
                    // Générer un nouveau code
                    return await this.create(clientWhatsapp, 10);
                }
            }
            
            return null;
        } catch (error) {
            throw error;
        }
    }
    
    // Récupérer les codes promo d'un client
    static async getByWhatsapp(clientWhatsapp) {
        try {
            const [rows] = await db.query(
                'SELECT * FROM promo_codes WHERE client_whatsapp = ? ORDER BY created_at DESC',
                [clientWhatsapp]
            );
            return rows;
        } catch (error) {
            throw error;
        }
    }

    // Récupérer tous les codes promo (admin)
    static async getAll() {
        try {
            const [rows] = await db.query(
                'SELECT * FROM promo_codes ORDER BY created_at DESC'
            );
            return rows;
        } catch (error) {
            throw error;
        }
    }

    // Créer un code promo depuis l'admin (avec code personnalisé optionnel)
    static async createAdmin(clientWhatsapp, discountPercentage = 10, expiresAt = null, customCode = null) {
        try {
            let code = customCode ? customCode.toUpperCase() : this.generateCode();
            // Vérifier unicité
            const [existing] = await db.query('SELECT id FROM promo_codes WHERE code = ?', [code]);
            if (existing.length > 0) throw new Error('Ce code existe déjà');

            const expiry = expiresAt || (() => {
                const d = new Date(); d.setMonth(d.getMonth() + 6); return d;
            })();

            const [result] = await db.query(
                `INSERT INTO promo_codes (code, client_whatsapp, discount_percentage, expires_at) VALUES (?, ?, ?, ?)`,
                [code, clientWhatsapp, discountPercentage, expiry]
            );
            return { id: result.insertId, code, discount_percentage: discountPercentage, client_whatsapp: clientWhatsapp };
        } catch (error) {
            throw error;
        }
    }

    // Mettre à jour un code promo (admin)
    static async update(id, data) {
        try {
            const { discount_percentage, expires_at, is_used } = data;
            const [result] = await db.query(
                `UPDATE promo_codes SET discount_percentage = COALESCE(?, discount_percentage), expires_at = COALESCE(?, expires_at), is_used = COALESCE(?, is_used) WHERE id = ?`,
                [discount_percentage || null, expires_at || null, is_used !== undefined ? is_used : null, id]
            );
            return result.affectedRows > 0;
        } catch (error) {
            throw error;
        }
    }

    // Supprimer un code promo (admin)
    static async deleteById(id) {
        try {
            const [result] = await db.query('DELETE FROM promo_codes WHERE id = ?', [id]);
            return result.affectedRows > 0;
        } catch (error) {
            throw error;
        }
    }
}

module.exports = PromoCode;
