// On supprime les vieux imports MySQL (Vehicle et db)
// Tout passera désormais par req.supabase injecté dans server.js

// 1. Récupérer tous les véhicules actifs
exports.getAllVehicles = async (req, res) => {
    try {
        const supabase = req.supabase;
        const { data, error } = await supabase
            .from('vehicles')
            .select('*')
            .neq('status', 'archived') // On exclut les archivés
            .order('created_at', { ascending: false });

        if (error) throw error;
        res.json({ success: true, count: data.length, data });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// 2. Récupérer par type (Location ou Vente)
exports.getVehiclesByType = async (req, res) => {
    try {
        const supabase = req.supabase;
        const { data, error } = await supabase
            .from('vehicles')
            .select('*')
            .eq('category', req.params.type) // 'category' contient 'location' ou 'vente'
            .neq('status', 'archived');

        if (error) throw error;
        res.json({ success: true, data });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// 3. Récupérer par catégorie (SUV, Berline, etc.)
exports.getVehiclesByCategory = async (req, res) => {
    try {
        const supabase = req.supabase;
        const { data, error } = await supabase
            .from('vehicles')
            .select('*')
            .neq('status', 'archived');

        if (error) throw error;
        // Filtrage en JS sur le champ JSONB 'specifications'
        const filtered = data.filter(v => v.specifications && v.specifications.category_type === req.params.category);
        res.json({ success: true, data: filtered });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// 4. Récupérer par ID
exports.getVehicleById = async (req, res) => {
    try {
        const supabase = req.supabase;
        const { data, error } = await supabase
            .from('vehicles')
            .select('*')
            .eq('id', req.params.id)
            .single();

        if (error) throw error;
        if (!data) return res.status(404).json({ success: false, message: 'Véhicule non trouvé' });
        
        res.json({ success: true, data });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// 5. Vérifier la disponibilité (Dummy pour le moment)
exports.checkAvailability = async (req, res) => {
    res.json({ success: true, available: true });
};

// 6. CRÉATION (Le fameux POST de l'Admin)
exports.createVehicle = async (req, res) => {
    try {
        const supabase = req.supabase;
        const vehicleData = req.body;

        const { data, error } = await supabase
            .from('vehicles')
            .insert([vehicleData])
            .select();

        if (error) throw error;
        res.status(201).json({ success: true, data: data[0] });
    } catch (error) {
        console.error("Erreur DB création véhicule :", error.message);
        res.status(500).json({ success: false, message: error.message });
    }
};

// 7. Archivage (Soft Delete - Bouton "Supprimer")
exports.deleteVehicle = async (req, res) => {
    try {
        const supabase = req.supabase;
        const { id } = req.params;

        // On passe le statut à 'archived' au lieu de le détruire
        const { error } = await supabase
            .from('vehicles')
            .update({ status: 'archived' })
            .eq('id', id);

        if (error) throw error;
        res.json({ success: true, message: 'Véhicule archivé avec succès' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// 8. Mises à jour (Vendu, Stock, etc.)
exports.updateVehicle = async (req, res) => { 
    try {
        const supabase = req.supabase;
        const { error } = await supabase.from('vehicles').update(req.body).eq('id', req.params.id);
        if (error) throw error;
        res.json({success: true, message: 'Véhicule mis à jour'});
    } catch(error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.updateStock = async (req, res) => { res.json({success: true}); };

exports.updateSoldStatus = async (req, res) => {
    try {
        const supabase = req.supabase;
        const { id } = req.params;
        const { is_sold } = req.body;
        
        const { error } = await supabase
            .from('vehicles')
            .update({ status: is_sold ? 'sold' : 'available' })
            .eq('id', id);

        if (error) throw error;
        res.json({ success: true, message: 'Statut de vente actualisé' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};