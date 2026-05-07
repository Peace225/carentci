const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

// 1. Initialisation de Supabase (SDK)
const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

const app = express();

/**
 * MIDDLEWARES
 */
app.use((req, res, next) => {
    req.supabase = supabase; 
    next();
});

const allowedOrigins = [
    'https://carentci.vercel.app',
    'http://localhost:5173',
    'http://localhost:3000',
    'http://127.0.0.1:5000'
];

app.use(cors({
    origin: function(origin, callback) {
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
 * IMPORT DES ROUTES
 */
// Note : Si ces fichiers utilisent DATABASE_URL, l'erreur vient d'eux
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

/**
 * UTILISATION DES ROUTES API
 */
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
 * ASSETS STATIQUES & FRONTEND
 */
app.use(express.static(path.join(__dirname, '..', 'frontend-react', 'dist')));

app.get('/health', (req, res) => {
    res.json({ status: 'ok', engine: 'Supabase', db_url: !!process.env.DATABASE_URL });
});

/**
 * GESTION D'ERREURS GLOBALE
 */
app.use((err, req, res, next) => {
    console.error("❌ CRASH SYSTÈME :", err.stack);
    res.status(500).json({ 
        success: false, 
        message: "Erreur serveur interne", 
        error: process.env.NODE_ENV === 'development' ? err.message : undefined 
    });
});

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'frontend-react', 'dist', 'index.html'));
});

/**
 * DÉMARRAGE & TESTS
 */
const PORT = process.env.PORT || 5000;

app.listen(PORT, async () => {
    console.log(`\n==========================================`);
    console.log(`🚀 SERVEUR ACTIF : Port ${PORT}`);
    
    // Test 1 : Vérification DATABASE_URL (PostgreSQL Direct)
    if (!process.env.DATABASE_URL) {
        console.log("⚠️  ALERTE : DATABASE_URL est manquante (nécessaire pour Visits/Migrations)");
    }

    // Test 2 : Vérification SDK Supabase
    try {
        const { error } = await supabase.from('vehicles').select('id').limit(1);
        if (error) throw error;
        console.log("✅ DB SDK : Supabase Cloud opérationnel");
    } catch (dbErr) {
        console.log("🚨 DB SDK ERROR :", dbErr.message);
    }
    console.log(`==========================================\n`);
});