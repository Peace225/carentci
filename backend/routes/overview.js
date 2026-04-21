const express = require('express');
const router = express.Router();
const db = require('../config/database');
const { authMiddleware } = require('./auth');

router.get('/', authMiddleware, async (req, res) => {
    try {
        const [[{ today_reservations }]] = await db.query(
            'SELECT COUNT(*) as today_reservations FROM reservations WHERE DATE(created_at) = CURDATE()'
        );
        const [[{ week_reservations }]] = await db.query(
            'SELECT COUNT(*) as week_reservations FROM reservations WHERE created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)'
        );
        const [[{ month_revenue }]] = await db.query(
            'SELECT COALESCE(SUM(total_price), 0) as month_revenue FROM reservations WHERE status = \'confirmed\' AND MONTH(created_at) = MONTH(NOW()) AND YEAR(created_at) = YEAR(NOW())'
        );
        const [[{ prev_month_revenue }]] = await db.query(
            'SELECT COALESCE(SUM(total_price), 0) as prev_month_revenue FROM reservations WHERE status = \'confirmed\' AND MONTH(created_at) = MONTH(DATE_SUB(NOW(), INTERVAL 1 MONTH)) AND YEAR(created_at) = YEAR(DATE_SUB(NOW(), INTERVAL 1 MONTH))'
        );

        const revenue_growth = prev_month_revenue > 0
            ? Math.round(((month_revenue - prev_month_revenue) / prev_month_revenue) * 100)
            : (month_revenue > 0 ? 100 : 0);

        const [[{ pending }]] = await db.query(
            'SELECT COUNT(*) as pending FROM reservations WHERE status = \'pending\''
        );

        const [[topVehicle]] = await db.query(
            'SELECT v.name, COUNT(*) as count FROM reservations r LEFT JOIN vehicles v ON r.vehicle_id = v.id WHERE r.created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY) AND v.name IS NOT NULL GROUP BY r.vehicle_id, v.name ORDER BY count DESC LIMIT 1'
        );

        const [[{ sold_count }]] = await db.query(
            'SELECT COUNT(*) as sold_count FROM vehicles WHERE is_sold = 1 AND type = \'vente\''
        ).catch(() => [[{ sold_count: 0 }]]);

        const [lowStock] = await db.query(
            'SELECT name, stock, stock_alert_threshold FROM vehicles WHERE is_active = 1 AND stock <= stock_alert_threshold AND stock > 0 ORDER BY stock ASC LIMIT 5'
        );

        const [[{ out_of_stock }]] = await db.query(
            'SELECT COUNT(*) as out_of_stock FROM vehicles WHERE is_active = 1 AND stock = 0'
        );

        const [latest] = await db.query(
            'SELECT r.id, r.client_name, r.client_whatsapp, r.status, r.total_price, r.created_at, COALESCE(v.name, \'N/A\') as vehicle_name FROM reservations r LEFT JOIN vehicles v ON r.vehicle_id = v.id ORDER BY r.created_at DESC LIMIT 5'
        );

        const [[{ visits_today }]] = await db.query(
            'SELECT COUNT(*) as visits_today FROM page_visits WHERE DATE(visited_at) = CURDATE()'
        ).catch(() => [[{ visits_today: 0 }]]);

        const [revenueByDay] = await db.query(
            'SELECT DATE(created_at) as date, COALESCE(SUM(total_price), 0) as revenue FROM reservations WHERE status = \'confirmed\' AND created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY) GROUP BY DATE(created_at) ORDER BY date ASC'
        );

        res.json({
            success: true,
            data: {
                today_reservations, week_reservations, month_revenue, prev_month_revenue,
                revenue_growth, pending, topVehicle: topVehicle || null,
                lowStock, out_of_stock, latest, visits_today, revenueByDay,
                sold_count: sold_count || 0
            }
        });
    } catch (e) {
        console.error(e);
        res.status(500).json({ success: false, message: e.message });
    }
});

module.exports = router;
