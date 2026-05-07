const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    // Cette configuration est la plus stable pour Supabase et Render
    ssl: {
        rejectUnauthorized: false
    }
});

// Test de connexion
pool.connect((err, client, release) => {
    if (err) {
        console.error('❌ Erreur de connexion PostgreSQL (Supabase) :', err.message);
        return;
    }
    console.log('✅ Connecté à la base de données PostgreSQL (Supabase)');
    release();
});

module.exports = {
    query: (text, params) => pool.query(text, params),
    pool: pool
};