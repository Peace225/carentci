// ⚠️ Les anciens imports MySQL (models/Reservation, models/Vehicle) ont été supprimés.
// Tout passe maintenant par le Cloud Supabase de manière ultra-rapide !

// 1. Créer une nouvelle réservation (Depuis le Frontend)
exports.createReservation = async (req, res) => {
    try {
        const supabase = req.supabase;
        
        // Le frontend envoie déjà les données formatées (customer_name, daily_price, etc.)
        const { data, error } = await supabase
            .from('reservations')
            .insert([req.body])
            .select();

        if (error) {
            console.error("Erreur Supabase:", error.message);
            throw error;
        }

        res.status(201).json({ 
            success: true, 
            message: 'Réservation créée avec succès',
            data: data[0] 
        });

    } catch (error) {
        console.error('Erreur création réservation:', error.message);
        res.status(500).json({ success: false, message: 'Erreur lors de la création de la réservation' });
    }
};

// 2. Récupérer toutes les réservations (Pour le Dashboard Admin)
exports.getAllReservations = async (req, res) => {
    try {
        const supabase = req.supabase;
        
        const { data, error } = await supabase
            .from('reservations')
            .select('*')
            .order('created_at', { ascending: false }); // Les plus récentes en premier

        if (error) throw error;

        res.json({ success: true, count: data.length, data });
        
    } catch (error) {
        console.error('Erreur récupération:', error.message);
        res.status(500).json({ success: false, message: 'Erreur lors de la récupération' });
    }
};

// 3. Récupérer une réservation par ID
exports.getReservationById = async (req, res) => {
    try {
        const supabase = req.supabase;
        const { id } = req.params;

        const { data, error } = await supabase
            .from('reservations')
            .select('*')
            .eq('id', id)
            .single();
        
        if (error) throw error;
        if (!data) return res.status(404).json({ success: false, message: 'Réservation non trouvée' });
        
        res.json({ success: true, data });
        
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// 4. Récupérer par numéro WhatsApp (Historique Client)
exports.getReservationsByWhatsapp = async (req, res) => {
    try {
        const supabase = req.supabase;
        const { whatsapp } = req.params;

        const { data, error } = await supabase
            .from('reservations')
            .select('*')
            .eq('customer_phone', whatsapp);
        
        if (error) throw error;
        
        res.json({ success: true, count: data.length, data });
        
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// 5. Mettre à jour le statut (Ex: de 'pending' à 'confirmed' depuis le Dashboard)
exports.updateReservationStatus = async (req, res) => {
    try {
        const supabase = req.supabase;
        const { id } = req.params;
        const { status } = req.body;
        
        const validStatuses = ['pending', 'confirmed', 'completed', 'cancelled'];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ success: false, message: 'Statut invalide' });
        }
        
        const { error } = await supabase
            .from('reservations')
            .update({ status: status })
            .eq('id', id);
        
        if (error) throw error;
        
        res.json({ success: true, message: 'Statut mis à jour avec succès' });
        
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// 6. Mettre à jour des informations (Édition libre)
exports.updateReservation = async (req, res) => {
    try {
        const supabase = req.supabase;
        const { id } = req.params;

        const { error } = await supabase
            .from('reservations')
            .update(req.body)
            .eq('id', id);
        
        if (error) throw error;
        
        res.json({ success: true, message: 'Réservation mise à jour avec succès' });
        
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// 7. Supprimer une réservation (Bouton Corbeille du Dashboard)
exports.deleteReservation = async (req, res) => {
    try {
        const supabase = req.supabase;
        const { id } = req.params;

        const { error } = await supabase
            .from('reservations')
            .delete()
            .eq('id', id);
        
        if (error) throw error;
        
        res.json({ success: true, message: 'Réservation supprimée avec succès' });
        
    } catch (error) {
        res.status(500).json({ success: false, message: 'Erreur lors de la suppression' });
    }
};

// 8. Obtenir les statistiques rapides (Pour les widgets du Dashboard)
exports.getStats = async (req, res) => {
    try {
        const supabase = req.supabase;
        
        const { data, error } = await supabase
            .from('reservations')
            .select('status, daily_price');
        
        if (error) throw error;
        
        const stats = {
            total: data.length,
            pending: data.filter(r => r.status === 'pending').length,
            confirmed: data.filter(r => r.status === 'confirmed').length,
            // Calcul basique du chiffre d'affaires sur les commandes terminées
            revenue: data.filter(r => r.status === 'completed').reduce((sum, r) => sum + Number(r.daily_price || 0), 0)
        };
        
        res.json({ success: true, data: stats });
        
    } catch (error) {
        res.status(500).json({ success: false, message: 'Erreur lors de la récupération des statistiques' });
    }
};