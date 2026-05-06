const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();

// Middleware CORS corrigé pour la production
app.use(cors({
    origin: function(origin, callback) {
        const allowed = [
            'https://carentci.vercel.app', // Ton site officiel sur Vercel
            'http://localhost:5173',       // Développement local (Vite)
            'http://localhost:3000',       // Développement local (CRA)
            'http://127.0.0.1:5000'
        ];
        // Autorise les requêtes sans origine (comme Postman ou les outils de monitoring)
        // et les origines présentes dans la liste autorisée
        if (!origin || allowed.includes(origin)) {
            callback(null, true);
        } else {
            // En production, on accepte tout si besoin, mais la liste ci-dessus est plus sûre
            callback(null, true); 
        }
    },
    credentials: true
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Servir le frontend buildé (React) et l'admin
app.use(express.static(path.join(__dirname, '..', 'frontend-react', 'dist')));
app.use('/admin', express.static(path.join(__dirname, '..', 'admin')));

// Rediriger / vers le frontend React
app.get('/', (req, res) => {
    const distIndex = path.join(__dirname, '..', 'frontend-react', 'dist', 'index.html');
    const fs = require('fs');
    if (fs.existsSync(distIndex)) {
        res.sendFile(distIndex);
    } else {
        res.json({ status: 'API running', message: 'Frontend not built.' });
    }
});

// Import des Routes
const reservationRoutes = require('./routes/reservations');
const vehicleRoutes = require('./routes/vehicles');
const authRoutes = require('./routes/auth');
const { router: uploadRoutes, getUploadDir } = require('./routes/upload');
const promoCodeRoutes = require('./routes/promoCodes');
const { router: notificationRoutes } = require('./routes/notifications');
const visitsRoutes = require('./routes/visits');
const overviewRoutes = require('./routes/overview');
const shareRoutes = require('./routes/share');

// Utilisation des Routes
app.use('/api/reservations', reservationRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/vehicles', vehicleRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/promo-codes', promoCodeRoutes);
app.use('/api/visits', visitsRoutes);
app.use('/api/overview', overviewRoutes);
app.use('/v', shareRoutes);

// Health check pour Render
app.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Servir les fichiers uploadés
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

// Port dynamique pour Render (process.env.PORT est obligatoire)
const PORT = process.env.PORT || 5000;
app.listen(PORT, async () => {
    console.log(`Serveur démarré sur le port ${PORT}`);
    
    try {
        const db = require('./config/database');
        
        // --- MIGRATIONS AUTOMATIQUES ---
        
        // 1. Colonne images
        const [cols] = await db.query(`SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'vehicles' AND COLUMN_NAME = 'images'`);
        if (cols.length === 0) {
            await db.query(`ALTER TABLE vehicles ADD COLUMN images JSON DEFAULT NULL`);
            console.log('Colonne images ajoutée');
        } else {
            console.log('Colonne images OK');
        }

        // 2. Colonne is_sold
        try {
            await db.query(`ALTER TABLE vehicles ADD COLUMN is_sold TINYINT(1) DEFAULT 0`);
            console.log('Colonne is_sold ajoutée');
        } catch(e) { console.log('Colonne is_sold OK'); }

        // 3. Colonnes réservations (driver_type, promo, etc.)
        const migrationCols = [
            { col: 'driver_type', sql: `ALTER TABLE reservations ADD COLUMN driver_type VARCHAR(20) DEFAULT NULL` },
            { col: 'promo_code', sql: `ALTER TABLE reservations ADD COLUMN promo_code VARCHAR(50) DEFAULT NULL` },
            { col: 'promo_discount', sql: `ALTER TABLE reservations ADD COLUMN promo_discount INT(11) DEFAULT 0` },
        ];
        for (const m of migrationCols) {
            try {
                const [c] = await db.query(`SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'reservations' AND COLUMN_NAME = '${m.col}'`);
                if (c.length === 0) { 
                    await db.query(m.sql); 
                    console.log(`Colonne ${m.col} ajoutée`); 
                } else { 
                    console.log(`Colonne ${m.col} OK`); 
                }
            } catch(e) { console.log(`Migration ${m.col}:`, e.message); }
        }
        
        console.log('✅ Base de données prête et synchronisée');
    } catch (e) {
        console.error('❌ Erreur lors des migrations:', e.message);
    }
});