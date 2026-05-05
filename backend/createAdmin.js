// Fichier : backend/createAdmin.js
const bcrypt = require('bcrypt');
const db = require('./config/database'); // Assurez-vous que le chemin vers votre BDD est correct

async function createSuperAdmin() {
    try {
        // 1. DÉFINISSEZ VOS IDENTIFIANTS ICI 👇
        const email = 'admin@carent.ci';
        const plainPassword = 'adminpassword2026'; 

        console.log('⏳ Création du Super Admin en cours...');

        // 2. Création de la table 'users' ou 'admins' (si elle n'existe pas)
        // Note : Adaptez le nom de la table ("users" ou "admins") selon ce qu'utilise votre authController
        await db.query(`
            CREATE TABLE IF NOT EXISTS users (
                id INT AUTO_INCREMENT PRIMARY KEY,
                email VARCHAR(255) UNIQUE NOT NULL,
                password VARCHAR(255) NOT NULL,
                role VARCHAR(50) DEFAULT 'admin',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);

        // 3. Cryptage (hachage) du mot de passe
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(plainPassword, saltRounds);

        // 4. Vérifier si cet admin existe déjà pour éviter les doublons
        const [existing] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
        
        if (existing.length > 0) {
            console.log(`⚠️ L'administrateur avec l'email ${email} existe déjà !`);
            process.exit(0);
        }

        // 5. Insertion dans la base de données
        await db.query(
            'INSERT INTO users (email, password, role) VALUES (?, ?, ?)',
            [email, hashedPassword, 'superadmin']
        );

        console.log('✅ SUCCÈS ! Super Admin créé.');
        console.log(`👉 Email : ${email}`);
        console.log(`👉 Mot de passe : ${plainPassword}`);
        
    } catch (error) {
        console.error('❌ Erreur lors de la création :', error);
    } finally {
        process.exit(); // Arrête le script une fois terminé
    }
}

createSuperAdmin();