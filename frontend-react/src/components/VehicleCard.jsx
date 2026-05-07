import { useState } from "react";
// ✅ CORRECTION 1 : L'import de l'API est maintenant activé !
import API_BASE_URL from '../api/config';

export default function VehicleCard({ vehicle }) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  // États pour le modal
  const [isRentModalOpen, setIsRentModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // État du formulaire de réservation
  const [booking, setBooking] = useState({
    startDate: '',
    startTime: '08:00',
    endDate: '',
    endTime: '18:00',
    location: 'Abidjan', // 'Abidjan' ou 'Hors Abidjan'
    driver: 'sans_chauffeur', // 'sans_chauffeur' ou 'avec_chauffeur'
    name: '',
    phone: ''
  });

  const getImages = () => {
    try {
      if (Array.isArray(vehicle?.images)) return vehicle.images;
      if (typeof vehicle?.images === 'string') return JSON.parse(vehicle.images);
    } catch (e) {
      console.error("Erreur parsing images", e);
    }
    return vehicle?.image ? [vehicle.image] : ["/placeholder-car.jpg"];
  };

  const images = getImages();

  const nextImage = (e) => {
    e.preventDefault(); e.stopPropagation();
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = (e) => {
    e.preventDefault(); e.stopPropagation();
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  // --- LOGIQUE DE PRIX DYNAMIQUE ---
  const basePrice = vehicle?.price_per_day || vehicle?.prix || 0;
  const displayCardPrice = basePrice.toLocaleString('fr-FR');
  const isHorsAbidjan = booking.location === 'Hors Abidjan';
  const dynamicPrice = isHorsAbidjan ? basePrice + 10000 : basePrice;

  const handleLocationChange = (loc) => {
    if (loc === 'Hors Abidjan') {
      setBooking({ ...booking, location: loc, driver: 'avec_chauffeur' });
    } else {
      setBooking({ ...booking, location: loc });
    }
  };

  const handleRentSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // 1. PRÉPARATION DES DONNÉES (SUPABASE)
      const reservationData = {
        vehicle_id: vehicle.id,
        vehicle_name: `${vehicle?.brand || vehicle?.marque} ${vehicle?.model || vehicle?.modele}`,
        customer_name: booking.name,
        customer_phone: booking.phone,
        start_date: booking.startDate,
        start_time: booking.startTime,
        end_date: booking.endDate,
        end_time: booking.endTime,
        location: booking.location,
        driver_option: booking.driver,
        daily_price: dynamicPrice,
        status: 'pending'
      };

      // ✅ CORRECTION 2 : Le fetch est décommenté, la donnée part au Dashboard !
      await fetch(`${API_BASE_URL}/api/reservations`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(reservationData)
      });

      // 2. GÉNÉRATION DU TICKET WHATSAPP
      // ⚠️ REMPLACE PAR TON VRAI NUMÉRO (Sans le +, avec l'indicatif 225)
      const WHATSAPP_NUMBER = "2250102030405"; 

      const waMessage = `*NOUVELLE DEMANDE DE RÉSERVATION* 🚗💎\n\n`
        + `*Véhicule :* ${vehicle?.brand || vehicle?.marque} ${vehicle?.model || vehicle?.modele}\n`
        + `*Tarif journalier :* ${dynamicPrice.toLocaleString('fr-FR')} FCFA\n\n`
        + `*👤 CLIENT*\n`
        + `*Nom :* ${booking.name}\n`
        + `*Contact :* ${booking.phone}\n\n`
        + `*📝 DÉTAILS DU TRAJET*\n`
        + `*Lieu :* ${booking.location}\n`
        + `*Chauffeur :* ${booking.driver === 'avec_chauffeur' ? '✅ Inclus' : '❌ Non inclus'}\n`
        + `*Départ :* ${booking.startDate} à ${booking.startTime}\n`
        + `*Retour :* ${booking.endDate} à ${booking.endTime}`;

      const encodedMessage = encodeURIComponent(waMessage);
      const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`;

      // 3. ANIMATION DE SUCCÈS ET REDIRECTION IMMÉDIATE
      setIsSubmitting(false);
      setIsSuccess(true);
      
      // Chronomètre ultra-court (1 seconde) pour garder la dynamique temps réel
      setTimeout(() => {
        window.open(whatsappUrl, '_blank');
        setIsSuccess(false);
        setIsRentModalOpen(false);
        setBooking({
          startDate: '', startTime: '08:00', endDate: '', endTime: '18:00',
          location: 'Abidjan', driver: 'sans_chauffeur', name: '', phone: ''
        });
      }, 1000);

    } catch (error) {
      console.error("Erreur lors de la réservation :", error);
      alert("Une erreur est survenue lors de la validation.");
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div className="relative group bg-white/[0.02] border border-white/10 rounded-[2rem] overflow-hidden hover:bg-white/[0.04] hover:border-orange-500/30 transition-all duration-500 flex flex-col shadow-2xl">
        
        {/* --- CARROUSEL D'IMAGES --- */}
        <div className="relative w-full h-64 overflow-hidden bg-[#0a0a0a]">
          <img 
            src={images[currentImageIndex]} 
            alt={`${vehicle?.brand || vehicle?.marque} ${vehicle?.model || vehicle?.modele}`} 
            className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30" />

          {images.length > 1 && (
            <>
              <button onClick={prevImage} className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center rounded-full bg-black/20 backdrop-blur-md text-white opacity-0 group-hover:opacity-100 transition-all hover:bg-orange-500 z-10 border border-white/10">
                <i className="fas fa-chevron-left text-xs"></i>
              </button>
              <button onClick={nextImage} className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center rounded-full bg-black/20 backdrop-blur-md text-white opacity-0 group-hover:opacity-100 transition-all hover:bg-orange-500 z-10 border border-white/10">
                <i className="fas fa-chevron-right text-xs"></i>
              </button>
            </>
          )}

          <div className="absolute top-4 left-4 flex flex-col gap-2 z-20">
            <span className="bg-white/10 backdrop-blur-xl border border-white/20 text-white text-[9px] font-black px-3 py-1.5 rounded-full uppercase tracking-[0.2em] shadow-xl">
              {vehicle?.specifications?.category_type || vehicle?.categorie || "PRESTIGE"}
            </span>
            {vehicle?.chauffeurObligatoire && (
              <span className="bg-orange-500 text-black text-[9px] font-black px-3 py-1.5 rounded-full shadow-[0_0_20px_rgba(249,115,22,0.4)] animate-pulse uppercase tracking-wider">
                <i className="fas fa-user-tie mr-1.5"></i> {vehicle.badgeInfo || "Chauffeur Inclus"}
              </span>
            )}
          </div>
        </div>

        {/* --- CONTENU DE LA CARTE --- */}
        <div className="p-7 flex-1 flex flex-col">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-2xl font-black text-white uppercase tracking-tighter italic">
                {vehicle?.brand || vehicle?.marque} <span className="text-orange-500">{vehicle?.model || vehicle?.modele}</span>
              </h3>
              <p className="text-[10px] text-gray-500 font-bold uppercase tracking-[0.3em] mt-1">Série {vehicle?.year || vehicle?.annee || '2026'}</p>
            </div>
          </div>
          
          <div className="flex gap-3 mb-8">
            <div className="flex-1 bg-white/[0.03] border border-white/5 p-3 rounded-2xl text-center">
              <i className="fas fa-cogs text-orange-500/50 text-[10px] mb-1 block"></i>
              <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">
                {(vehicle?.specifications?.transmission || vehicle?.transmission || 'Auto').substring(0, 4)}
              </span>
            </div>
            <div className="flex-1 bg-white/[0.03] border border-white/5 p-3 rounded-2xl text-center">
              <i className="fas fa-gas-pump text-orange-500/50 text-[10px] mb-1 block"></i>
              <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">
                {(vehicle?.specifications?.fuel || vehicle?.carburant || 'Essence').substring(0, 3)}
              </span>
            </div>
            <div className="flex-1 bg-white/[0.03] border border-white/5 p-3 rounded-2xl text-center">
              <i className="fas fa-tachometer-alt text-orange-500/50 text-[10px] mb-1 block"></i>
              <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">
                KM {vehicle?.specifications?.mileage || vehicle?.kilometrage || '0'}
              </span>
            </div>
          </div>

          <div className="mt-auto pt-6 border-t border-white/5 flex items-center justify-between">
            <div>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-black text-white tracking-tighter">{displayCardPrice}</span>
                <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">FCFA</span>
              </div>
              <p className="text-[9px] text-orange-500 font-black uppercase tracking-[0.2em] mt-1">Tarif Journalier</p>
            </div>

            {/* SEUL BOUTON RESTANT : LOUER */}
            <button 
              onClick={() => setIsRentModalOpen(true)}
              className="px-8 py-4 bg-orange-500 hover:bg-white text-black rounded-2xl font-black uppercase text-[10px] tracking-[0.2em] transition-all duration-300 shadow-[0_5px_20px_rgba(249,115,22,0.2)] hover:shadow-[0_5px_20px_rgba(255,255,255,0.3)] active:scale-95"
            >
              Louer
            </button>
          </div>
        </div>
      </div>

      {/* ========================================== */}
      {/* MODAL DE RÉSERVATION AVANCÉ                */}
      {/* ========================================== */}
      {isRentModalOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/95 backdrop-blur-xl animate-fade-in custom-scrollbar overflow-y-auto">
          <div className="bg-[#0a0a0a] border border-white/10 w-full max-w-xl rounded-[2.5rem] overflow-hidden relative shadow-2xl flex flex-col my-8">
            
            {isSuccess && (
              <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-[#0a0a0a]/90 backdrop-blur-md">
                <div className="w-24 h-24 mb-6 rounded-full bg-green-500/10 border-2 border-green-500/20 flex items-center justify-center animate-bounce-short">
                  <i className="fas fa-check text-4xl text-green-500"></i>
                </div>
                <h2 className="text-2xl font-black uppercase tracking-tighter italic text-white mb-2">Demande Envoyée</h2>
                <p className="text-[10px] text-gray-400 uppercase tracking-widest text-center px-8">Ouverture de WhatsApp...</p>
              </div>
            )}

            {/* Header Modal */}
            <div className="p-6 border-b border-white/5 flex justify-between items-center bg-white/[0.02]">
              <div>
                <h2 className="text-lg font-black uppercase tracking-tighter italic text-white">
                  Réserver <span className="text-orange-500">{vehicle?.model || vehicle?.modele}</span>
                </h2>
                <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold mt-1">
                  Configuration sur mesure
                </p>
              </div>
              <button onClick={() => setIsRentModalOpen(false)} className="w-8 h-8 flex items-center justify-center rounded-full bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 transition-colors">
                <i className="fas fa-times"></i>
              </button>
            </div>

            {/* Formulaire Intégral */}
            <form onSubmit={handleRentSubmit} className={`p-6 md:p-8 space-y-6 ${isSuccess ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}>
              
              {/* SECTION 1: LIEU & CHAUFFEUR */}
              <div className="space-y-4 bg-white/[0.02] p-5 rounded-3xl border border-white/5">
                <div className="flex flex-col gap-2">
                  <label className="text-[9px] font-black text-gray-500 uppercase tracking-widest ml-2">Périmètre de circulation</label>
                  <div className="flex p-1 bg-black rounded-2xl border border-white/5">
                    <button type="button" onClick={() => handleLocationChange('Abidjan')} className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase transition-all ${booking.location === 'Abidjan' ? 'bg-orange-500 text-black' : 'text-gray-500 hover:text-white'}`}>
                      Abidjan
                    </button>
                    <button type="button" onClick={() => handleLocationChange('Hors Abidjan')} className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase transition-all ${booking.location === 'Hors Abidjan' ? 'bg-orange-500 text-black' : 'text-gray-500 hover:text-white'}`}>
                      Hors Abidjan
                    </button>
                  </div>
                </div>

                <div className="flex flex-col gap-2 pt-2">
                  <label className="text-[9px] font-black text-gray-500 uppercase tracking-widest ml-2 flex justify-between">
                    <span>Option Chauffeur</span>
                    {isHorsAbidjan && <span className="text-orange-500 animate-pulse">Obligatoire Hors Abidjan</span>}
                  </label>
                  <div className="flex p-1 bg-black rounded-2xl border border-white/5">
                    <button type="button" onClick={() => setBooking({...booking, driver: 'sans_chauffeur'})} disabled={isHorsAbidjan} className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase transition-all ${booking.driver === 'sans_chauffeur' ? 'bg-white text-black' : 'text-gray-600'} ${isHorsAbidjan ? 'opacity-30 cursor-not-allowed' : 'hover:text-white'}`}>
                      Sans Chauffeur
                    </button>
                    <button type="button" onClick={() => setBooking({...booking, driver: 'avec_chauffeur'})} className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase transition-all ${booking.driver === 'avec_chauffeur' ? 'bg-white text-black' : 'text-gray-500 hover:text-white'}`}>
                      Avec Chauffeur
                    </button>
                  </div>
                </div>
              </div>

              {/* SECTION 2: DATES & HEURES */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[9px] font-black text-gray-500 uppercase tracking-widest ml-2 mb-2 block">Départ le</label>
                  <div className="flex gap-2">
                    <input type="date" required className="modal-input flex-[2]" value={booking.startDate} onChange={(e) => setBooking({...booking, startDate: e.target.value})} />
                    <input type="time" required className="modal-input flex-1 px-2 text-center" value={booking.startTime} onChange={(e) => setBooking({...booking, startTime: e.target.value})} />
                  </div>
                </div>
                <div>
                  <label className="text-[9px] font-black text-gray-500 uppercase tracking-widest ml-2 mb-2 block">Retour le</label>
                  <div className="flex gap-2">
                    <input type="date" required className="modal-input flex-[2]" value={booking.endDate} onChange={(e) => setBooking({...booking, endDate: e.target.value})} />
                    <input type="time" required className="modal-input flex-1 px-2 text-center" value={booking.endTime} onChange={(e) => setBooking({...booking, endTime: e.target.value})} />
                  </div>
                </div>
              </div>

              {/* SECTION 3: CONTACT */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-[9px] font-black text-gray-500 uppercase tracking-widest ml-2 mb-2 block">Nom complet</label>
                  <input type="text" placeholder="Votre nom" required className="modal-input" value={booking.name} onChange={(e) => setBooking({...booking, name: e.target.value})} />
                </div>
                <div>
                  <label className="text-[9px] font-black text-gray-500 uppercase tracking-widest ml-2 mb-2 block">Téléphone (WhatsApp)</label>
                  <input type="tel" placeholder="+225 00 00 00 00" required className="modal-input" value={booking.phone} onChange={(e) => setBooking({...booking, phone: e.target.value})} />
                </div>
              </div>

              {/* RÉCAPITULATIF PRIX & SOUMISSION */}
              <div className="pt-6 border-t border-white/5">
                <div className="flex justify-between items-end mb-4 px-2">
                  <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Tarif Configuré</span>
                  <div className="text-right">
                    <span className="text-2xl font-black text-orange-500">{dynamicPrice.toLocaleString('fr-FR')}</span>
                    <span className="text-[10px] text-gray-500 font-bold ml-1">FCFA / j</span>
                  </div>
                </div>
                <button type="submit" disabled={isSubmitting} className="w-full py-5 bg-orange-500 hover:bg-white text-black rounded-2xl font-black uppercase text-[11px] tracking-[0.2em] transition-all duration-300 shadow-[0_10px_30px_rgba(249,115,22,0.2)] active:scale-95 flex items-center justify-center gap-3">
                  {isSubmitting ? (
                    <><i className="fas fa-circle-notch animate-spin"></i> Transmission...</>
                  ) : (
                    <><i className="fab fa-whatsapp text-lg"></i> Envoyer la demande</>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style dangerouslySetInnerHTML={{ __html: `
        .modal-input { 
          width: 100%; background: rgba(255, 255, 255, 0.03); 
          border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 1rem; 
          padding: 1rem 1.25rem; color: white; font-size: 11px; font-weight: 700;
          outline: none; transition: all 0.3s;
        }
        .modal-input:focus { border-color: #f97316; background: rgba(249, 115, 22, 0.03); }
        .modal-input::-webkit-calendar-picker-indicator { filter: invert(1); opacity: 0.5; cursor: pointer; }
        
        @keyframes fadeIn { from { opacity: 0; backdrop-filter: blur(0px); } to { opacity: 1; backdrop-filter: blur(16px); } }
        @keyframes bounceShort { 0% { transform: scale(0.8); opacity: 0; } 50% { transform: scale(1.1); } 100% { transform: scale(1); opacity: 1; } }
        .animate-fade-in { animation: fadeIn 0.3s ease-out forwards; }
        .animate-bounce-short { animation: bounceShort 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards; }
      `}} />
    </>
  );
}