const express = require('express');
const router = express.Router();
const db = require('../config/database');
const { authMiddleware } = require('./auth');

// Créer la table si elle n'existe pas
async function initVisitsTable() {
    await db.query(`
        CREATE TABLE IF NOT EXISTS page_visits (
            id INT AUTO_INCREMENT PRIMARY KEY,
            session_id VARCHAR(64) DEFAULT NULL,
            page VARCHAR(100) NOT NULL,
            vehicle_id INT DEFAULT NULL,
            vehicle_name VARCHAR(255) DEFAULT NULL,
            vehicle_type VARCHAR(20) DEFAULT NULL,
            referrer VARCHAR(500) DEFAULT NULL,
            user_agent VARCHAR(500) DEFAULT NULL,
            ip_address VARCHAR(50) DEFAULT NULL,
            visited_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            INDEX idx_page (page),
            INDEX idx_visited_at (visited_at),
            INDEX idx_vehicle_id (vehicle_id),
            INDEX idx_session (session_id)
        )
    `);
    // Migration : ajouter session_id si absent dans page_visits
    try {
        await db.query(`ALTER TABLE page_visits ADD COLUMN session_id VARCHAR(64) DEFAULT NULL`);
        await db.query(`ALTER TABLE page_visits ADD INDEX idx_session (session_id)`);
    } catch(e) { /* colonne déjà présente */ }
    // Migration : ajouter vehicle_type si absent
    try {
        await db.query(`ALTER TABLE page_visits ADD COLUMN vehicle_type VARCHAR(20) DEFAULT NULL`);
    } catch(e) { /* déjà présent */ }

    // Migration : ajouter session_id dans reservations si absent
    try {
        await db.query(`ALTER TABLE reservations ADD COLUMN session_id VARCHAR(64) DEFAULT NULL`);
        await db.query(`ALTER TABLE reservations ADD INDEX idx_res_session (session_id)`);
        console.log('Migration: session_id ajouté à reservations');
    } catch(e) { /* colonne déjà présente */ }
}
initVisitsTable().catch(e => console.log('Visits table:', e.message));

// POST /api/visits — enregistrer une visite (public)
router.post('/', async (req, res) => {
    try {
        const { page, vehicle_id, vehicle_name, vehicle_type, referrer, session_id } = req.body;
        const ip = req.headers['x-forwarded-for']?.split(',')[0] || req.socket.remoteAddress || '';
        const ua = req.headers['user-agent'] || '';
        await db.query(
            'INSERT INTO page_visits (session_id, page, vehicle_id, vehicle_name, vehicle_type, referrer, user_agent, ip_address) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
            [session_id || null, page || 'unknown', vehicle_id || null, vehicle_name || null, vehicle_type || null, referrer || null, ua.substring(0, 500), ip.substring(0, 50)]
        );
        res.json({ success: true });
    } catch (e) {
        res.json({ success: false });
    }
});

// GET /api/visits/stats — statistiques (admin)
router.get('/stats', authMiddleware, async (req, res) => {
    try {
        const { days = 30, vehicleType = 'all' } = req.query;
        const d = parseInt(days);
        const since = `DATE_SUB(NOW(), INTERVAL ${d} DAY)`;
        const typeFilter = vehicleType === 'location' ? `AND (pv.vehicle_type = 'location' OR pv.vehicle_type IS NULL)`
                         : vehicleType === 'vente' ? `AND pv.vehicle_type = 'vente'`
                         : '';

        const [[{ total }]] = await db.query(`SELECT COUNT(*) as total FROM page_visits pv WHERE pv.visited_at >= ${since} ${typeFilter}`);
        const [[{ today }]] = await db.query(`SELECT COUNT(*) as today FROM page_visits pv WHERE DATE(pv.visited_at) = CURDATE() ${typeFilter}`);
        const [[{ this_week }]] = await db.query(`SELECT COUNT(*) as this_week FROM page_visits pv WHERE pv.visited_at >= DATE_SUB(NOW(), INTERVAL 7 DAY) ${typeFilter}`);

        // Visites par page
        const [byPage] = await db.query(`
            SELECT page, COUNT(*) as visits
            FROM page_visits pv WHERE pv.visited_at >= ${since} ${typeFilter}
            GROUP BY page ORDER BY visits DESC LIMIT 10
        `);

        // Top véhicules consultés — tous
        const [topVehicles] = await db.query(`
            SELECT pv.vehicle_name, pv.vehicle_type, COUNT(*) as visits
            FROM page_visits pv
            WHERE pv.vehicle_id IS NOT NULL AND pv.visited_at >= ${since} ${typeFilter}
            GROUP BY pv.vehicle_id, pv.vehicle_name, pv.vehicle_type ORDER BY visits DESC LIMIT 10
        `);

        // Top véhicules location
        const [topLocation] = await db.query(`
            SELECT pv.vehicle_name, COUNT(*) as visits
            FROM page_visits pv
            WHERE pv.vehicle_id IS NOT NULL AND pv.visited_at >= ${since}
            AND (pv.vehicle_type = 'location' OR pv.vehicle_type IS NULL)
            GROUP BY pv.vehicle_id, pv.vehicle_name ORDER BY visits DESC LIMIT 10
        `);

        // Top véhicules vente
        const [topVente] = await db.query(`
            SELECT pv.vehicle_name, COUNT(*) as visits
            FROM page_visits pv
            WHERE pv.vehicle_id IS NOT NULL AND pv.visited_at >= ${since}
            AND pv.vehicle_type = 'vente'
            GROUP BY pv.vehicle_id, pv.vehicle_name ORDER BY visits DESC LIMIT 10
        `);

        // Visites par jour
        const [byDay] = await db.query(`
            SELECT DATE(pv.visited_at) as date, COUNT(*) as visits
            FROM page_visits pv WHERE pv.visited_at >= ${since} ${typeFilter}
            GROUP BY DATE(pv.visited_at) ORDER BY date ASC
        `);

        // Traçabilité : visites liées à une réservation (via session_id)
        const [conversions] = await db.query(`
            SELECT 
                pv.session_id,
                pv.vehicle_name,
                pv.visited_at as visit_time,
                r.client_name,
                r.client_whatsapp,
                r.created_at as reservation_time,
                r.id as reservation_id,
                r.status
            FROM page_visits pv
            INNER JOIN reservations r ON CONVERT(r.session_id USING utf8mb4) = CONVERT(pv.session_id USING utf8mb4)
            WHERE pv.session_id IS NOT NULL
              AND pv.visited_at >= ${since}
              ${typeFilter}
            ORDER BY r.created_at DESC
            LIMIT 50
        `);

        // Taux de conversion
        const [[{ unique_sessions }]] = await db.query(`
            SELECT COUNT(DISTINCT session_id) as unique_sessions 
            FROM page_visits pv WHERE pv.visited_at >= ${since} AND pv.session_id IS NOT NULL ${typeFilter}
        `);
        const [[{ converted_sessions }]] = await db.query(`
            SELECT COUNT(DISTINCT pv.session_id) as converted_sessions
            FROM page_visits pv
            INNER JOIN reservations r ON CONVERT(r.session_id USING utf8mb4) = CONVERT(pv.session_id USING utf8mb4)
            WHERE pv.visited_at >= ${since} AND pv.session_id IS NOT NULL ${typeFilter}
        `);
        const conversion_rate = unique_sessions > 0 ? Math.round((converted_sessions / unique_sessions) * 100) : 0;

        res.json({ success: true, data: { total, today, this_week, byPage, topVehicles, topLocation, topVente, byDay, conversions, conversion_rate, unique_sessions, converted_sessions } });
    } catch (e) {
        console.error(e);
        res.status(500).json({ success: false, message: e.message });
    }
});

module.exports = router;
