const Reservation = require('../models/Reservation');
const Vehicle = require('../models/Vehicle');
const { broadcastNotification } = require('../routes/notifications');

// Créer une nouvelle réservation
exports.createReservation = async (req, res) => {
    try {
        const {
            client_name,
            client_whatsapp,
            vehicle_id,
            start_date,
            start_time,
            end_date,
            end_time,
            pickup_location,
            with_driver,
            driver_type,
            message,
            quantity,
            session_id,
            promo_code
        } = req.body;

        // Validation des champs obligatoires
        if (!client_name || !client_name.trim()) {
            return res.status(400).json({ success: false, message: 'Le nom du client est requis' });
        }
        if (!client_whatsapp || !/^[\d\s\+\-]{8,20}$/.test(client_whatsapp.trim())) {
            return res.status(400).json({ success: false, message: 'Numéro WhatsApp invalide' });
        }
        if (!start_date || !end_date) {
            return res.status(400).json({ success: false, message: 'Les dates sont requises' });
        }

        // Validation des dates
        const startDateTime = new Date(start_date);
        const endDateTime = new Date(end_date);
        if (isNaN(startDateTime.getTime()) || isNaN(endDateTime.getTime())) {
            return res.status(400).json({ success: false, message: 'Format de date invalide' });
        }
        if (endDateTime <= startDateTime) {
            return res.status(400).json({ success: false, message: 'La date de fin doit être après la date de début' });
        }

        // Validation quantité
        const qty = parseInt(quantity) || 1;
        if (qty < 1) {
            return res.status(400).json({ success: false, message: 'La quantité doit être au moins 1' });
        }

        let total_price = 0;
        const days = Math.ceil((endDateTime - startDateTime) / (1000 * 60 * 60 * 24));
        
        // Si un véhicule est sélectionné, vérifier et calculer le prix
        if (vehicle_id) {
            const vehicle = await Vehicle.getById(vehicle_id);
            if (!vehicle) {
                return res.status(404).json({ success: false, message: 'Véhicule non trouvé' });
            }
            
            const isAvailable = await Vehicle.checkAvailability(vehicle_id, start_date, end_date);
            if (!isAvailable) {
                return res.status(400).json({ success: false, message: 'Ce véhicule n\'est pas disponible pour ces dates' });
            }
            
            // Validation autorisations sans chauffeur
            if (driver_type === 'without') {
                const horsAbidjan = with_driver === true || with_driver === 'true';
                if (horsAbidjan && !vehicle.autorise_sans_chauffeur_hors_abidjan) {
                    return res.status(400).json({ success: false, message: 'Ce véhicule n\'est pas autorisé sans chauffeur hors Abidjan.' });
                }
                if (!horsAbidjan && !vehicle.autorise_sans_chauffeur_abidjan) {
                    return res.status(400).json({ success: false, message: 'Ce véhicule n\'est pas autorisé sans chauffeur dans Abidjan.' });
                }
            }
            
            const pricePerDay = with_driver ? vehicle.price_with_driver : vehicle.price_without_driver;
            total_price = pricePerDay * days * qty;
        }

        // Valider et appliquer le code promo
        let promo_discount = 0;
        let validated_promo = null;
        if (promo_code && promo_code.trim()) {
            const PromoCode = require('../models/PromoCode');
            const promo = await PromoCode.validate(promo_code.trim(), client_whatsapp.trim());
            if (promo) {
                promo_discount = Math.round(total_price * promo.discount_percentage / 100);
                total_price = total_price - promo_discount;
                validated_promo = promo_code.trim();
                // Marquer le code comme utilisé
                await PromoCode.markAsUsed(promo_code.trim());
            }
        }
        
        const reservationId = await Reservation.create({
            client_name: client_name.trim(),
            client_whatsapp: client_whatsapp.trim(),
            vehicle_id,
            start_date,
            start_time,
            end_date,
            end_time,
            pickup_location: pickup_location ? pickup_location.trim() : '',
            with_driver,
            driver_type: driver_type || null,
            total_price,
            message: message ? message.trim() : '',
            quantity: qty,
            session_id: session_id || null,
            promo_code: validated_promo,
            promo_discount
        });
        
        res.status(201).json({
            success: true,
            message: 'Réservation créée avec succès',
            data: { id: reservationId, total_price, days, promo_discount }
        });

        broadcastNotification({
            type: 'new_reservation',
            title: `Nouvelle réservation #${reservationId}`,
            body: `${client_name.trim()} - ${total_price.toLocaleString('fr-FR')} FCFA`,
            reservationId,
            client_name: client_name.trim(),
            total_price,
            timestamp: new Date().toISOString()
        });
        
    } catch (error) {
        console.error('Erreur création réservation:', error);
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la création de la réservation'
        });
    }
};

// Récupérer toutes les réservations
exports.getAllReservations = async (req, res) => {
    try {
        const { status, startDate, endDate } = req.query;
        
        const filters = {};
        if (status) filters.status = status;
        if (startDate) filters.startDate = startDate;
        if (endDate) filters.endDate = endDate;
        
        const reservations = await Reservation.getAll(filters);
        
        res.json({
            success: true,
            count: reservations.length,
            data: reservations
        });
        
    } catch (error) {
        console.error('Erreur récupération réservations:', error);
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la récupération des réservations',
            error: error.message
        });
    }
};

// Récupérer une réservation par ID
exports.getReservationById = async (req, res) => {
    try {
        const { id } = req.params;
        const reservation = await Reservation.getById(id);
        
        if (!reservation) {
            return res.status(404).json({
                success: false,
                message: 'Réservation non trouvée'
            });
        }
        
        res.json({
            success: true,
            data: reservation
        });
        
    } catch (error) {
        console.error('Erreur récupération réservation:', error);
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la récupération de la réservation',
            error: error.message
        });
    }
};

// Récupérer les réservations par WhatsApp
exports.getReservationsByWhatsapp = async (req, res) => {
    try {
        const { whatsapp } = req.params;
        const reservations = await Reservation.getByWhatsapp(whatsapp);
        
        res.json({
            success: true,
            count: reservations.length,
            data: reservations
        });
        
    } catch (error) {
        console.error('Erreur récupération réservations:', error);
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la récupération des réservations',
            error: error.message
        });
    }
};

// Mettre à jour le statut d'une réservation
exports.updateReservationStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        
        const validStatuses = ['pending', 'confirmed', 'completed', 'cancelled'];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({
                success: false,
                message: 'Statut invalide'
            });
        }
        
        const updated = await Reservation.updateStatus(id, status);
        
        if (!updated) {
            return res.status(404).json({
                success: false,
                message: 'Réservation non trouvée'
            });
        }
        
        res.json({
            success: true,
            message: 'Statut mis à jour avec succès'
        });
        
    } catch (error) {
        console.error('Erreur mise à jour statut:', error);
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la mise à jour du statut',
            error: error.message
        });
    }
};

// Mettre à jour une réservation
exports.updateReservation = async (req, res) => {
    try {
        const { id } = req.params;
        const updated = await Reservation.update(id, req.body);
        
        if (!updated) {
            return res.status(404).json({
                success: false,
                message: 'Réservation non trouvée'
            });
        }
        
        res.json({
            success: true,
            message: 'Réservation mise à jour avec succès'
        });
        
    } catch (error) {
        console.error('Erreur mise à jour réservation:', error);
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la mise à jour de la réservation',
            error: error.message
        });
    }
};

// Supprimer une réservation
exports.deleteReservation = async (req, res) => {
    try {
        const { id } = req.params;
        const deleted = await Reservation.delete(id);
        
        if (!deleted) {
            return res.status(404).json({
                success: false,
                message: 'Réservation non trouvée'
            });
        }
        
        res.json({
            success: true,
            message: 'Réservation supprimée avec succès'
        });
        
    } catch (error) {
        console.error('Erreur suppression réservation:', error);
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la suppression de la réservation'
        });
    }
};

// Obtenir les statistiques
exports.getStats = async (req, res) => {
    try {
        const stats = await Reservation.getStats();
        
        res.json({
            success: true,
            data: stats
        });
        
    } catch (error) {
        console.error('Erreur récupération statistiques:', error);
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la récupération des statistiques'
        });
    }
};