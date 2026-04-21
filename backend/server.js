const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors({
    origin: function(origin, callback) {
        const allowed = [
            'https://spirited-freedom-production-b17b.up.railway.app',
            'http://localhost:5000',
            'http://localhost:3000',
            'http://127.0.0.1:5000'
        ];
        // Autoriser: pas d'origine (file://, Postman, mobile) et origines connues
        if (!origin || allowed.includes(origin)) {
            callback(null, true);
        } else {
            callback(null, true); // En prod Railway, accepter toutes les origines pour l'admin
        }
    },
    credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Servir le frontend buildé (React) et l'admin
app.use(express.static(path.join(__dirname, '..', 'frontend-react', 'dist')));
app.use('/admin', express.static(path.join(__dirname, '..', 'admin')));

// Rediriger / vers le frontend React buildé
app.get('/', (req, res) => {
    const distIndex = path.join(__dirname, '..', 'frontend-react', 'dist', 'index.html');
    const fs = require('fs');
    if (fs.existsSync(distIndex)) {
        res.sendFile(distIndex);
    } else {
        res.json({ status: 'API running', message: 'Frontend not built. Run: cd frontend-react && npm run build' });
    }
});

// Routes
const reservationRoutes = require('./routes/reservations');
const vehicleRoutes = require('./routes/vehicles');
const authRoutes = require('./routes/auth');
const { router: uploadRoutes, getUploadDir } = require('./routes/upload');
const promoCodeRoutes = require('./routes/promoCodes');
const { router: notificationRoutes } = require('./routes/notifications');
const visitsRoutes = require('./routes/visits');
const overviewRoutes = require('./routes/overview');
const shareRoutes = require('./routes/share');

app.use('/api/reservations', reservationRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/vehicles', vehicleRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/promo-codes', promoCodeRoutes);
app.use('/api/visits', visitsRoutes);
app.use('/api/overview', overviewRoutes);
app.use('/v', shareRoutes);

// Health check
app.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Debug Cloudinary (temporaire)
app.get('/debug-cloudinary', (req, res) => {
    res.json({
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME ? 'SET' : 'MISSING',
        api_key: process.env.CLOUDINARY_API_KEY ? 'SET' : 'MISSING',
        api_secret: process.env.CLOUDINARY_API_SECRET ? 'SET' : 'MISSING'
    });
});

// Servir les uploads depuis le dossier détecté dynamiquement
app.use('/uploads', express.static(getUploadDir()));

// Gestion des erreurs 404
app.use((req, res) => {
    res.status(404).json({ success: false, message: 'Route non trouvée' });
});

// Gestion des erreurs globales
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        success: false,
        message: 'Erreur serveur',
        error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, async () => {
    console.log(`Serveur démarré sur le port ${PORT}`);
    console.log(`URL: http://localhost:${PORT}`);
    
    // Migration automatique : ajouter colonne images si elle n'existe pas
    try {
        const db = require('./config/database');
        // Verifier si la colonne existe avant de l'ajouter
        const [cols] = await db.query(`SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'vehicles' AND COLUMN_NAME = 'images'`);
        if (cols.length === 0) {
            await db.query(`ALTER TABLE vehicles ADD COLUMN images JSON DEFAULT NULL`);
            console.log('Colonne images ajoutée');
        } else {
            console.log('Colonne images OK');
        }
        // Migration is_sold
        try {
            await db.query(`ALTER TABLE vehicles ADD COLUMN is_sold TINYINT(1) DEFAULT 0`);
            console.log('Colonne is_sold ajoutée');
        } catch(e) { console.log('Colonne is_sold OK'); }

        // Migration driver_type, promo_code, promo_discount dans reservations
        const migrationCols = [
            { col: 'driver_type', sql: `ALTER TABLE reservations ADD COLUMN driver_type VARCHAR(20) DEFAULT NULL` },
            { col: 'promo_code', sql: `ALTER TABLE reservations ADD COLUMN promo_code VARCHAR(50) DEFAULT NULL` },
            { col: 'promo_discount', sql: `ALTER TABLE reservations ADD COLUMN promo_discount INT(11) DEFAULT 0` },
        ];
        for (const m of migrationCols) {
            try {
                const [c] = await db.query(`SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'reservations' AND COLUMN_NAME = '${m.col}'`);
                if (c.length === 0) { await db.query(m.sql); console.log(`Colonne ${m.col} ajoutée`); }
                else { console.log(`Colonne ${m.col} OK`); }
            } catch(e) { console.log(`Migration ${m.col}:`, e.message); }
        }
    } catch (e) {
        console.log('Migration images:', e.message);
    }
});
