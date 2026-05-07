const express = require('express');
const cors = require('cors');
require('dotenv').config();

const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

const app = express();

// Injecte Supabase dans req
app.use((req, res, next) => {
    req.supabase = supabase; 
    next();
});

// CORS : nettoie les espaces et utilise la variable d'env Render
const allowedOrigins = process.env.CORS_ORIGIN
    ? process.env.CORS_ORIGIN.split(',').map(origin => origin.trim())
    : [
        'http://localhost:5173',
        'http://localhost:3000'
    ];

app.use(cors({
    origin: function(origin, callback) {
        // Autorise Postman/curl sans origin
        if (!origin) return callback(null, true);
        
        if (allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            console.log(`CORS bloqué pour origin: ${origin}`);
            callback(null, false); // Ne crash plus
        }
    },
    credentials: true
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

app.get('/', (req, res) => {
    res.json({ message: "🚀 CarentCI API est en ligne" });
});

app.get('/health', (req, res) => {
    res.json({ status: 'ok', engine: 'Supabase Cloud' });
});

// Tes routes API
const authRoutes = require('./routes/auth');
const vehicleRoutes = require('./routes/vehicles');
const reservationRoutes = require('./routes/reservations');
const leadsRoutes = require('./routes/leads'); 
const promoCodeRoutes = require('./routes/promoCodes');
const { router: notificationRoutes } = require('./routes/notifications');
const visitsRoutes = require('./routes/visits');
const overviewRoutes = require('./routes/overview');
const shareRoutes = require('./routes/share');
const { router: uploadRoutes } = require('./routes/upload');

app.use('/api/auth', authRoutes);
app.use('/api/vehicles', vehicleRoutes);
app.use('/api/reservations', reservationRoutes);
app.use('/api/leads', leadsRoutes);      
app.use('/api/clients', leadsRoutes);
app.use('/api/promo-codes', promoCodeRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/visits', visitsRoutes);
app.use('/api/stats', overviewRoutes);    
app.use('/api/upload', uploadRoutes);
app.use('/v', shareRoutes);

// Gestion d'erreurs : ne log pas la stack complète en prod
app.use((err, req, res, next) => {
    console.error("❌ ERREUR:", err.message);
    res.status(err.status || 500).json({ 
        success: false, 
        message: err.message || "Erreur serveur interne"
    });
});

// Render force le port 10000
const PORT = process.env.PORT || 10000;

app.listen(PORT, async () => {
    console.log(`\n==========================================`);
    console.log(`🚀 SERVEUR ACTIF : Port ${PORT}`);
    console.log(`Allowed origins: ${allowedOrigins.join(', ')}`);
    try {
        const { error } = await supabase.from('vehicles').select('id').limit(1);
        if (error) throw error;
        console.log("✅ DB SDK : Connexion Supabase établie");
    } catch (dbErr) {
        console.log("🚨 DB SDK ERROR :", dbErr.message);
    }
    console.log(`==========================================\n`);
});