const { Pool } = require('pg');
require('dotenv').config();

/**
 * CONFIGURATION POSTGRESQL (SUPABASE)
 * On ajoute des options de pool pour plus de stabilité sur Render
 */
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false // Indispensable pour les certificats auto-signés de Supabase
    },
    // Paramètres de stabilité pour éviter les coupures de connexion
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
    keepAlive: true
});

// Test de connexion avec syntaxe moderne (Promise)
const connectDB = async () => {
    try {
        const client = await pool.connect();
        console.log('✅ DATABASE : Connexion PostgreSQL (Supabase) établie.');
        client.release();
    } catch (err) {
        console.error('❌ DATABASE ERROR : Impossible de se connecter à Supabase.');
        console.error('Détails :', err.message);
    }
};

connectDB();

module.exports = {
    query: (text, params) => pool.query(text, params),
    pool: pool
};