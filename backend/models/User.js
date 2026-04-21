const db = require('../config/database');
const bcrypt = require('bcryptjs');

class User {
    
    // Créer un nouvel utilisateur
    static async create(userData) {
        try {
            const { name, email, password, role } = userData;
            
            // Hasher le mot de passe
            const hashedPassword = await bcrypt.hash(password, 10);
            
            const [result] = await db.query(
                'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
                [name, email, hashedPassword, role || 'admin']
            );
            
            return result.insertId;
        } catch (error) {
            throw error;
        }
    }
    
    // Trouver un utilisateur par email
    static async findByEmail(email) {
        try {
            const [rows] = await db.query(
                'SELECT * FROM users WHERE email = ?',
                [email]
            );
            return rows[0];
        } catch (error) {
            throw error;
        }
    }

    // Trouver un utilisateur par nom
    static async findByName(name) {
        try {
            const [rows] = await db.query(
                'SELECT * FROM users WHERE name = ?',
                [name]
            );
            return rows[0];
        } catch (error) {
            throw error;
        }
    }
    
    // Trouver un utilisateur par ID
    static async findById(id) {
        try {
            const [rows] = await db.query(
                'SELECT id, name, email, role, created_at FROM users WHERE id = ?',
                [id]
            );
            return rows[0];
        } catch (error) {
            throw error;
        }
    }
    
    // Vérifier le mot de passe
    static async verifyPassword(plainPassword, hashedPassword) {
        return await bcrypt.compare(plainPassword, hashedPassword);
    }
    
    // Récupérer tous les utilisateurs
    static async getAll() {
        try {
            const [rows] = await db.query(
                'SELECT id, name, email, role, created_at FROM users ORDER BY created_at DESC'
            );
            return rows;
        } catch (error) {
            throw error;
        }
    }
    
    // Mettre à jour un utilisateur
    static async update(id, userData) {
        try {
            const { name, email, role } = userData;
            
            const [result] = await db.query(
                'UPDATE users SET name = ?, email = ?, role = ? WHERE id = ?',
                [name, email, role, id]
            );
            
            return result.affectedRows > 0;
        } catch (error) {
            throw error;
        }
    }
    
    // Supprimer un utilisateur
    static async delete(id) {
        try {
            const [result] = await db.query(
                'DELETE FROM users WHERE id = ?',
                [id]
            );
            return result.affectedRows > 0;
        } catch (error) {
            throw error;
        }
    }
}

module.exports = User;
