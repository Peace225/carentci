// FICHIER OBSOLÈTE
// On utilise maintenant Supabase SDK via req.supabase dans server.js
// Ce fichier existe juste pour éviter les crashs si un vieux import traîne

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

// Faux pool pour compatibilité, mais on l'utilise plus
const fakePool = {
    query: async () => {
        throw new Error('Utilise req.supabase au lieu de db.query. Ce fichier database.js est obsolète.');
    },
    connect: async () => {
        throw new Error('Utilise req.supabase au lieu de pool.connect. Ce fichier database.js est obsolète.');
    }
};

console.log('⚠️  database.js: Ce fichier est obsolète. Utilise Supabase SDK.');

module.exports = {
    query: fakePool.query,
    pool: fakePool,
    supabase // Au cas où, mais utilise req.supabase dans les routes
};