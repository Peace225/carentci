// backend/controllers/promoCodeController.js

// 1. Récupérer tous les codes
exports.getAllPromoCodes = async (req, res) => {
    try {
        const { data, error } = await req.supabase
            .from('promo_codes')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw error;
        res.json({ success: true, data });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// 2. Créer un code
exports.createPromoCode = async (req, res) => {
    try {
        const { data, error } = await req.supabase
            .from('promo_codes')
            .insert([req.body])
            .select();

        if (error) throw error;
        res.status(201).json({ success: true, data: data[0] });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// 3. Supprimer un code
exports.deletePromoCode = async (req, res) => {
    try {
        const { id } = req.params;
        const { error } = await req.supabase
            .from('promo_codes')
            .delete()
            .eq('id', id);

        if (error) throw error;
        res.json({ success: true, message: "Code promo supprimé" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};