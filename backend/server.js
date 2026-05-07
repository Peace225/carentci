const express = require('express');
const cors = require('cors');
require('dotenv').config();

// 1. Initialisation de Supabase (SDK)
const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

const app = express();

/**
 * MIDDLEWARES
 */
// Injection de Supabase dans les requêtes
app.use((req, res, next) => {
    req.supabase = supabase; 
    next();
});

// Configuration CORS 
const allowedOrigins = [
    'https://carentci.vercel.app',    // Ton URL Vercel
    'http://localhost:5173',          // Vite local
    'http://localhost:3000',
    'http://127.0.0.1:5000'
];

app.use(cors({
    origin: function(origin, callback) {
        // Autoriser les requêtes sans origine (comme Postman ou les appels internes)
        if (!origin || allowedOrigins.includes(origin) || process.env.NODE_ENV === 'development') {
            callback(null, true);
        } else {
            callback(new Error('Non autorisé par CORS'));
        }
    },
    credentials: true
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

/**
 * ROUTES DE SANTÉ (Pour Render)
 */
app.get('/', (req, res) => {
    res.json({ message: "🚀 CarentCI API est en ligne", mode: process.env.NODE_ENV });
});

app.get('/health', (req, res) => {
    res.json({ status: 'ok', engine: 'Supabase Cloud' });
});

/**
 * IMPORT & UTILISATION DES ROUTES API
 */
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

/**
 * GESTION D'ERREURS GLOBALE
 * On affiche plus de détails pour débugger Render
 */
app.use((err, req, res, next) => {
    console.error("❌ CRASH SYSTÈME :", err.stack);
    res.status(500).json({ 
        success: false, 
        message: "Erreur serveur interne", 
        error: err.message // On laisse l'erreur visible pour faciliter ton débuggage actuel
    });
});

/**
 * DÉMARRAGE
 */
const PORT = process.env.PORT || 5000;

app.listen(PORT, async () => {
    console.log(`\n==========================================`);
    console.log(`🚀 SERVEUR ACTIF : Port ${PORT}`);
    
    // Test SDK Supabase au démarrage
    try {
        const { error } = await supabase.from('vehicles').select('id').limit(1);
        if (error) throw error;
        console.log("✅ DB SDK : Connexion Supabase établie");
    } catch (dbErr) {
        console.log("🚨 DB SDK ERROR :", dbErr.message);
    }
    console.log(`==========================================\n`);
});