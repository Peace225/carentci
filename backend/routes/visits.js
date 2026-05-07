const express = require('express');
const router = express.Router();
const { authMiddleware } = require('./auth');

// Plus besoin de initVisitsTable() ici.
// Crée la table direct dans Supabase Dashboard > SQL Editor
// Je te mets le SQL à la fin.

/**
 * 🛰️ POST /api/visits — Enregistrer une visite
 */
router.post('/', async (req, res) => {
    try {
        const { page, vehicle_id, vehicle_name, vehicle_type, referrer, session_id } = req.body;
        const ip = req.headers['x-forwarded-for']?.split(',')[0] || req.socket.remoteAddress || '';
        const ua = req.headers['user-agent'] || '';

        const { error } = await req.supabase
           .from('page_visits')
           .insert({
                session_id: session_id || null,
                page: page || 'unknown',
                vehicle_id: vehicle_id || null,
                vehicle_name: vehicle_name || null,
                vehicle_type: vehicle_type || null,
                referrer: referrer || null,
                user_agent: ua.substring(0, 500),
                ip_address: ip.substring(0, 50)
            });

        if (error) throw error;
        res.json({ success: true });
    } catch (e) {
        console.error('POST /visits error:', e.message);
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

        // Date de début pour le filtre
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - d);
        const startDateISO = startDate.toISOString();

        // Helper pour filtrer par type
        const buildQuery = (table) => {
            let query = req.supabase.from(table).select('*', { count: 'exact', head: false });
            query = query.gte('visited_at', startDateISO);

            if (vehicleType === 'location') {
                query = query.or('vehicle_type.eq.location,vehicle_type.is.null');
            } else if (vehicleType === 'vente') {
                query = query.eq('vehicle_type', 'vente');
            }
            return query;
        };

        // 1. Total, Today, This Week
        const todayISO = new Date().toISOString().split('T')[0];
        const weekStartDate = new Date();
        weekStartDate.setDate(weekStartDate.getDate() - 7);

        const [totalRes, todayRes, weekRes] = await Promise.all([
            buildQuery('page_visits').select('*', { count: 'exact', head: true }),
            req.supabase.from('page_visits').select('*', { count: 'exact', head: true })
               .gte('visited_at', `${todayISO}T00:00:00Z`)
               .lte('visited_at', `${todayISO}T23:59:59Z`)
               .match(vehicleType === 'location'? {} : vehicleType === 'vente'? { vehicle_type: 'vente' } : {}),
            buildQuery('page_visits').gte('visited_at', weekStartDate.toISOString()).select('*', { count: 'exact', head: true })
        ]);

        // 2. Visites par page - on utilise une RPC pour le GROUP BY
        const { data: byPage, error: byPageErr } = await req.supabase.rpc('get_visits_by_page', {
            start_date: startDateISO,
            vehicle_type_filter: vehicleType
        });
        if (byPageErr) throw byPageErr;

        // 3. Top véhicules
        const { data: topVehicles, error: topVehiclesErr } = await req.supabase.rpc('get_top_vehicles', {
            start_date: startDateISO,
            vehicle_type_filter: vehicleType
        });
        if (topVehiclesErr) throw topVehiclesErr;

        // 4. Visites par jour
        const { data: byDay, error: byDayErr } = await req.supabase.rpc('get_visits_by_day', {
            start_date: startDateISO,
            vehicle_type_filter: vehicleType
        });
        if (byDayErr) throw byDayErr;

        // 5. Conversions + taux
        const { data: conversions, error: convErr } = await req.supabase.rpc('get_conversions', {
            start_date: startDateISO,
            vehicle_type_filter: vehicleType
        });
        if (convErr) throw convErr;

        const unique_sessions = byDay.reduce((acc, cur) => acc + cur.unique_sessions, 0);
        const converted_sessions = conversions.length;
        const conversion_rate = unique_sessions > 0? Math.round((converted_sessions / unique_sessions) * 100) : 0;

        res.json({
            success: true,
            data: {
                total: totalRes.count,
                today: todayRes.count,
                this_week: weekRes.count,
                byPage: byPage || [],
                topVehicles: topVehicles || [],
                byDay: byDay || [],
                conversions: conversions || [],
                conversion_rate,
                unique_sessions,
                converted_sessions
            }
        });

    } catch (e) {
        console.error('GET /visits/stats error:', e);
        res.status(500).json({ success: false, message: e.message });
    }
});

module.exports = router;