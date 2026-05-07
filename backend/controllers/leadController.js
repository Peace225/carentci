/**
 * Lead Controller - Gestion des prospects de vente
 * Architecture : Supabase + Node.js
 */

// 1. Créer un nouveau prospect (Public)
// Appelé par le composant SaleVehicleCard côté client
exports.createLead = async (req, res) => {
    try {
        const supabase = req.supabase;
        const leadData = req.body;

        // Insertion dans Supabase
        const { data, error } = await supabase
            .from('leads')
            .insert([leadData])
            .select();

        if (error) throw error;

        res.status(201).json({
            success: true,
            message: "Intention d'achat enregistrée avec succès",
            data: data[0]
        });
    } catch (error) {
        console.error("🚨 Error creating lead:", error.message);
        res.status(500).json({ 
            success: false, 
            message: "Erreur lors de l'enregistrement du prospect" 
        });
    }
};

// 2. Récupérer tous les prospects (Admin)
// Utilisé pour l'onglet "Clients / Ventes" du Dashboard
exports.getAllLeads = async (req, res) => {
    try {
        const supabase = req.supabase;

        const { data, error } = await supabase
            .from('leads')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw error;

        res.json({
            success: true,
            count: data.length,
            data: data
        });
    } catch (error) {
        console.error("🚨 Error fetching leads:", error.message);
        res.status(500).json({ 
            success: false, 
            message: "Impossible de récupérer les prospects" 
        });
    }
};

// 3. Mettre à jour le statut d'un prospect (Admin)
// Ex: Passer de 'nouveau' à 'en_cours' ou 'vendu'
exports.updateLeadStatus = async (req, res) => {
    try {
        const supabase = req.supabase;
        const { id } = req.params;
        const { status } = req.body;

        const { data, error } = await supabase
            .from('leads')
            .update({ status: status })
            .eq('id', id)
            .select();

        if (error) throw error;

        res.json({
          success: true,
          message: "Statut du prospect mis à jour",
          data: data[0]
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// 4. Supprimer un prospect (Admin)
exports.deleteLead = async (req, res) => {
    try {
        const supabase = req.supabase;
        const { id } = req.params;

        const { error } = await supabase
            .from('leads')
            .delete()
            .eq('id', id);

        if (error) throw error;

        res.json({
            success: true,
            message: "Prospect supprimé définitivement"
        });
    } catch (error) {
        console.error("🚨 Error deleting lead:", error.message);
        res.status(500).json({ 
            success: false, 
            message: "Erreur lors de la suppression" 
        });
    }
};