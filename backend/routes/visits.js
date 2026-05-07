const express = require('express');
const router = express.Router();
const db = require('../config/database'); // Ton pool pg
const { authMiddleware } = require('./auth');

// 1. Initialisation de la table (Syntaxe Postgres)
async function initVisitsTable() {
    try {
        // Table des visites
        await db.query(`
            CREATE TABLE IF NOT EXISTS page_visits (
                id SERIAL PRIMARY KEY,
                session_id TEXT,
                page TEXT NOT NULL,
                vehicle_id INTEGER,
                vehicle_name TEXT,
                vehicle_type TEXT,
                referrer TEXT,
                user_agent TEXT,
                ip_address TEXT,
                visited_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
            )
        `);

        // Index (Postgres utilise CREATE INDEX séparé)
        await db.query(`CREATE INDEX IF NOT EXISTS idx_page ON page_visits (page)`);
        await db.query(`CREATE INDEX IF NOT EXISTS idx_visited_at ON page_visits (visited_at)`);
        await db.query(`CREATE INDEX IF NOT EXISTS idx_session ON page_visits (session_id)`);

        // Migrations de colonnes (Postgres catch)
        try { await db.query(`ALTER TABLE page_visits ADD COLUMN IF NOT EXISTS vehicle_type TEXT`); } catch(e){}
        try { await db.query(`ALTER TABLE page_visits ADD COLUMN IF NOT EXISTS session_id TEXT`); } catch(e){}
        try { await db.query(`ALTER TABLE reservations ADD COLUMN IF NOT EXISTS session_id TEXT`); } catch(e){}

    } catch (err) {
        console.error('❌ Erreur Initialisation Visits:', err.message);
    }
}
initVisitsTable();

/**
 * 🛰️ POST /api/visits — Enregistrer une visite
 */
router.post('/', async (req, res) => {
    try {
        const { page, vehicle_id, vehicle_name, vehicle_type, referrer, session_id } = req.body;
        const ip = req.headers['x-forwarded-for']?.split(',')[0] || req.socket.remoteAddress || '';
        const ua = req.headers['user-agent'] || '';

        // Syntaxe PG : $1, $2 au lieu de ?
        const query = `
            INSERT INTO page_visits 
            (session_id, page, vehicle_id, vehicle_name, vehicle_type, referrer, user_agent, ip_address) 
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        `;
        const values = [
            session_id || null, 
            page || 'unknown', 
            vehicle_id || null, 
            vehicle_name || null, 
            vehicle_type || null, 
            referrer || null, 
            ua.substring(0, 500), 
            ip.substring(0, 50)
        ];

        await db.query(query, values);
        res.json({ success: true });
    } catch (e) {
        res.json({ success: false });
    }
});

/**
 * 📊 GET /api/visits/stats — Statistiques Admin
 */
router.get('/stats', authMiddleware, async (req, res) => {
    try {
        const { days = 30, vehicleType = 'all' } = req.query;
        const d = parseInt(days);

        // Filtre de type de véhicule
        let typeFilter = "";
        if (vehicleType === 'location') {
            typeFilter = "AND (pv.vehicle_type = 'location' OR pv.vehicle_type IS NULL)";
        } else if (vehicleType === 'vente') {
            typeFilter = "AND pv.vehicle_type = 'vente'";
        }

        // Requêtes Stats (Syntaxe Postgres : NOW() - INTERVAL 'X days')
        const totalRes = await db.query(`SELECT COUNT(*) as count FROM page_visits pv WHERE pv.visited_at >= NOW() - INTERVAL '${d} days' ${typeFilter}`);
        const todayRes = await db.query(`SELECT COUNT(*) as count FROM page_visits pv WHERE pv.visited_at::DATE = CURRENT_DATE ${typeFilter}`);
        const weekRes = await db.query(`SELECT COUNT(*) as count FROM page_visits pv WHERE pv.visited_at >= NOW() - INTERVAL '7 days' ${typeFilter}`);

        // Visites par page
        const byPageRes = await db.query(`
            SELECT page, COUNT(*) as visits
            FROM page_visits pv WHERE pv.visited_at >= NOW() - INTERVAL '${d} days' ${typeFilter}
            GROUP BY page ORDER BY visits DESC LIMIT 10
        `);

        // Top véhicules (tous)
        const topVehiclesRes = await db.query(`
            SELECT pv.vehicle_name, pv.vehicle_type, COUNT(*) as visits
            FROM page_visits pv
            WHERE pv.vehicle_id IS NOT NULL AND pv.visited_at >= NOW() - INTERVAL '${d} days' ${typeFilter}
            GROUP BY pv.vehicle_id, pv.vehicle_name, pv.vehicle_type ORDER BY visits DESC LIMIT 10
        `);

        // Visites par jour (Séries temporelles)
        const byDayRes = await db.query(`
            SELECT pv.visited_at::DATE as date, COUNT(*) as visits
            FROM page_visits pv WHERE pv.visited_at >= NOW() - INTERVAL '${d} days' ${typeFilter}
            GROUP BY pv.visited_at::DATE ORDER BY date ASC
        `);

        // Conversions (Jointure session_id)
        const convRes = await db.query(`
            SELECT 
                pv.session_id, pv.vehicle_name, pv.visited_at as visit_time,
                r.client_name, r.created_at as reservation_time, r.status
            FROM page_visits pv
            INNER JOIN reservations r ON r.session_id = pv.session_id
            WHERE pv.session_id IS NOT NULL AND pv.visited_at >= NOW() - INTERVAL '${d} days' ${typeFilter}
            ORDER BY r.created_at DESC LIMIT 50
        `);

        // Taux de conversion
        const uniqueSessionsRes = await db.query(`SELECT COUNT(DISTINCT session_id) FROM page_visits WHERE visited_at >= NOW() - INTERVAL '${d} days' ${typeFilter}`);
        const convertedSessionsRes = await db.query(`
            SELECT COUNT(DISTINCT pv.session_id) 
            FROM page_visits pv
            INNER JOIN reservations r ON r.session_id = pv.session_id
            WHERE pv.visited_at >= NOW() - INTERVAL '${d} days' ${typeFilter}
        `);

        const unique_sessions = parseInt(uniqueSessionsRes.rows[0].count);
        const converted_sessions = parseInt(convertedSessionsRes.rows[0].count);
        const conversion_rate = unique_sessions > 0 ? Math.round((converted_sessions / unique_sessions) * 100) : 0;

        res.json({ 
            success: true, 
            data: { 
                total: parseInt(totalRes.rows[0].count), 
                today: parseInt(todayRes.rows[0].count), 
                this_week: parseInt(weekRes.rows[0].count), 
                byPage: byPageRes.rows, 
                topVehicles: topVehiclesRes.rows, 
                byDay: byDayRes.rows, 
                conversions: convRes.rows, 
                conversion_rate,
                unique_sessions,
                converted_sessions
            } 
        });

    } catch (e) {
        console.error(e);
        res.status(500).json({ success: false, message: e.message });
    }
});

module.exports = router;