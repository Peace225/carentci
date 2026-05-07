const express = require('express');
const router = express.Router();
const { authMiddleware } = require('./auth');

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

        const startDate = new Date();
        startDate.setDate(startDate.getDate() - d);
        const startDateISO = startDate.toISOString();

        const todayStart = new Date();
        todayStart.setHours(0, 0, 0, 0);
        const todayEnd = new Date();
        todayEnd.setHours(23, 59, 59, 999);

        const weekStartDate = new Date();
        weekStartDate.setDate(weekStartDate.getDate() - 7);

        // Helper pour appliquer le filtre vehicle_type
        const applyVehicleTypeFilter = (query) => {
            if (vehicleType === 'location') {
                return query.or('vehicle_type.eq.location,vehicle_type.is.null');
            } else if (vehicleType === 'vente') {
                return query.eq('vehicle_type', 'vente');
            }
            return query;
        };

        // 1. Total, Today, This Week
        let totalQuery = req.supabase.from('page_visits').select('*', { count: 'exact', head: true }).gte('visited_at', startDateISO);
        let todayQuery = req.supabase.from('page_visits').select('*', { count: 'exact', head: true }).gte('visited_at', todayStart.toISOString()).lte('visited_at', todayEnd.toISOString());
        let weekQuery = req.supabase.from('page_visits').select('*', { count: 'exact', head: true }).gte('visited_at', weekStartDate.toISOString());

        totalQuery = applyVehicleTypeFilter(totalQuery);
        todayQuery = applyVehicleTypeFilter(todayQuery);
        weekQuery = applyVehicleTypeFilter(weekQuery);

        const [totalRes, todayRes, weekRes] = await Promise.all([
            totalQuery,
            todayQuery,
            weekQuery
        ]);

        if (totalRes.error) throw totalRes.error;
        if (todayRes.error) throw todayRes.error;
        if (weekRes.error) throw weekRes.error;

        // 2. RPC calls
        const rpcParams = {
            start_date: startDateISO,
            vehicle_type_filter: vehicleType
        };

        const [
            { data: byPage, error: byPageErr },
            { data: topVehicles, error: topVehiclesErr },
            { data: byDay, error: byDayErr },
            { data: conversions, error: convErr }
        ] = await Promise.all([
            req.supabase.rpc('get_visits_by_page', rpcParams),
            req.supabase.rpc('get_top_vehicles', rpcParams),
            req.supabase.rpc('get_visits_by_day', rpcParams),
            req.supabase.rpc('get_conversions', rpcParams)
        ]);

        if (byPageErr) throw byPageErr;
        if (topVehiclesErr) throw topVehiclesErr;
        if (byDayErr) throw byDayErr;
        if (convErr) throw convErr;

        // 3. Taux de conversion - on compte les sessions uniques
        let uniqueSessionsQuery = req.supabase
           .from('page_visits')
           .select('session_id')
           .gte('visited_at', startDateISO)
           .not('session_id', 'is', null);

        uniqueSessionsQuery = applyVehicleTypeFilter(uniqueSessionsQuery);

        const { data: sessionsData, error: sessionsErr } = await uniqueSessionsQuery;
        if (sessionsErr) throw sessionsErr;

        const unique_sessions = new Set(sessionsData.map(s => s.session_id)).size;
        const converted_sessions = conversions? conversions.length : 0;
        const conversion_rate = unique_sessions > 0? Math.round((converted_sessions / unique_sessions) * 100) : 0;

        res.json({
            success: true,
            data: {
                total: totalRes.count || 0,
                today: todayRes.count || 0,
                this_week: weekRes.count || 0,
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