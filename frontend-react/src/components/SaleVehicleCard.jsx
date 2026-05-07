import { useState } from "react";
import API_BASE_URL from '../api/config';

export default function SaleVehicleCard({ vehicle }) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isInCart, setIsInCart] = useState(false);
  const [showToast, setShowToast] = useState(false);

  // --- ÉTATS POUR LE MODAL D'ACHAT ---
  const [isBuyModalOpen, setIsBuyModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  
  const [buyerInfo, setBuyerInfo] = useState({
    name: '',
    phone: '',
    message: 'Je souhaite obtenir plus d\'informations pour l\'acquisition de ce véhicule.'
  });

  const getImages = () => {
    try {
      if (Array.isArray(vehicle?.images)) return vehicle.images;
      if (typeof vehicle?.images === 'string') return JSON.parse(vehicle.images);
    } catch (e) { console.error("Erreur images", e); }
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

  const displayKm = (vehicle?.specifications?.mileage || vehicle?.kilometrage || 0).toLocaleString('fr-FR');
  const rawPrice = vehicle?.sale_price || vehicle?.prix || 0;
  const displayPrice = rawPrice.toLocaleString('fr-FR');

  const toggleCart = () => {
    setIsInCart(!isInCart);
    if (!isInCart) {
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    }
  };

  const handleBuySubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const vehicleFullName = `${vehicle?.brand || vehicle?.marque} ${vehicle?.model || vehicle?.modele}`;

    try {
      const leadData = {
        name: buyerInfo.name,
        phone: buyerInfo.phone,
        vehicle_name: vehicleFullName,
        price: displayPrice,
        message: buyerInfo.message,
        status: 'nouveau'
      };

      await fetch(`${API_BASE_URL}/api/leads`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(leadData)
      });

      const WHATSAPP_NUMBER = "2250102030405"; 
      const waMessage = `*DEMANDE D'ACQUISITION VÉHICULE* 💎\n\n*Modèle :* ${vehicleFullName}\n*Prix :* ${displayPrice} FCFA\n\n*👤 CLIENT :* ${buyerInfo.name}\n*Contact :* ${buyerInfo.phone}\n\n*Message :* ${buyerInfo.message}`;

      setIsSubmitting(false);
      setIsSuccess(true);

      setTimeout(() => {
        window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(waMessage)}`, '_blank');
        setIsSuccess(false);
        setIsBuyModalOpen(false);
        setBuyerInfo({ name: '', phone: '', message: 'Je souhaite obtenir plus d\'informations...' });
      }, 1500);

    } catch (error) {
      console.error("Erreur validation:", error);
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {/* TOAST NOTIFICATION - Adapté Mobile */}
      {showToast && (
        <div className="fixed top-6 md:top-10 left-1/2 -translate-x-1/2 z-[300] bg-blue-600 text-white px-5 py-3 rounded-xl md:rounded-2xl font-black uppercase text-[9px] md:text-[10px] tracking-widest shadow-2xl animate-slide-down flex items-center gap-3 border border-white/10 w-[90%] md:w-auto justify-center">
          <i className="fas fa-cart-plus"></i>
          Ajouté à la sélection
        </div>
      )}

      <div className="relative group bg-white/[0.02] border border-white/10 rounded-[2rem] md:rounded-[2.5rem] overflow-hidden hover:bg-white/[0.04] hover:border-blue-500/30 transition-all duration-500 flex flex-col shadow-2xl">
        
        {/* IMAGE : Hauteur responsive (h-52 sur mobile, h-64 sur desktop) */}
        <div className="relative w-full h-52 md:h-64 overflow-hidden bg-[#0a0a0a]">
          <img src={images[currentImageIndex]} alt="Vehicle" className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20" />
          
          {images.length > 1 && (
            <>
              <button onClick={prevImage} className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 md:w-10 md:h-10 flex items-center justify-center rounded-full bg-black/20 backdrop-blur-md text-white opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-all hover:bg-blue-500 z-10 border border-white/10">
                <i className="fas fa-chevron-left text-[10px]"></i>
              </button>
              <button onClick={nextImage} className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 md:w-10 md:h-10 flex items-center justify-center rounded-full bg-black/20 backdrop-blur-md text-white opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-all hover:bg-blue-500 z-10 border border-white/10">
                <i className="fas fa-chevron-right text-[10px]"></i>
              </button>
            </>
          )}

          <div className="absolute top-4 left-4 z-20">
            <span className="bg-blue-600 text-white text-[8px] md:text-[9px] font-black px-3 py-1.5 md:px-4 md:py-2 rounded-full uppercase tracking-[0.2em] shadow-lg">Vente Prestige</span>
          </div>
        </div>

        {/* CONTENU : Padding réduit sur mobile (p-5) */}
        <div className="p-5 md:p-7 flex-1 flex flex-col">
          <div className="mb-4">
            <h3 className="text-xl md:text-2xl font-black text-white uppercase tracking-tighter italic leading-tight">
              {vehicle?.brand || vehicle?.marque} <span className="text-blue-500">{vehicle?.model || vehicle?.modele}</span>
            </h3>
            <p className="text-[9px] md:text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-1 italic opacity-60">Série {vehicle?.year || vehicle?.annee || '2026'}</p>
          </div>
          
          {/* GRILLE SPECS */}
          <div className="grid grid-cols-2 gap-2 md:gap-3 mb-6 md:mb-8">
            <div className="bg-white/[0.03] border border-white/5 p-2.5 md:p-3 rounded-xl md:rounded-2xl">
              <p className="text-[7px] md:text-[8px] text-gray-500 font-black uppercase mb-1">Moteur</p>
              <span className="text-[9px] md:text-[10px] font-bold text-white uppercase tracking-wider truncate block">
                <i className="fas fa-gas-pump text-blue-500 mr-1.5 md:mr-2"></i>{vehicle?.specifications?.fuel || vehicle?.carburant || 'Essence'}
              </span>
            </div>
            <div className="bg-white/[0.03] border border-white/5 p-2.5 md:p-3 rounded-xl md:rounded-2xl">
              <p className="text-[7px] md:text-[8px] text-gray-500 font-black uppercase mb-1">Parcours</p>
              <span className="text-[9px] md:text-[10px] font-bold text-white uppercase tracking-wider block">
                <i className="fas fa-tachometer-alt text-blue-500 mr-1.5 md:mr-2"></i>{displayKm} KM
              </span>
            </div>
          </div>

          {/* FOOTER : Alignement responsive */}
          <div className="mt-auto pt-5 md:pt-6 border-t border-white/5 flex flex-wrap items-center justify-between gap-3">
            <div className="flex-1 min-w-max">
              <p className="text-[8px] md:text-[9px] text-blue-500 font-black uppercase tracking-[0.2em] mb-0.5">Prix de cession</p>
              <div className="flex items-baseline gap-1">
                <span className="text-xl md:text-2xl font-black text-white tracking-tighter">{displayPrice}</span>
                <span className="text-[8px] md:text-[9px] text-gray-500 font-bold uppercase">FCFA</span>
              </div>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button 
                onClick={toggleCart}
                className={`w-12 h-12 md:w-14 md:h-14 rounded-xl md:rounded-2xl flex items-center justify-center transition-all duration-500 border ${isInCart ? 'bg-blue-600 border-blue-600 text-white shadow-[0_0_20px_rgba(37,99,235,0.3)]' : 'bg-white/5 border-white/10 text-gray-400 hover:border-white/30'}`}
              >
                <i className={`fas fa-cart-shopping text-base md:text-lg ${isInCart ? 'animate-pulse' : ''}`}></i>
              </button>
              
              <button 
                onClick={() => setIsBuyModalOpen(true)}
                className="flex-1 sm:flex-none px-5 md:px-7 py-3.5 md:py-4 bg-white hover:bg-blue-600 text-black hover:text-white rounded-xl md:rounded-2xl font-black uppercase text-[9px] md:text-[10px] tracking-[0.15em] md:tracking-[0.2em] transition-all duration-300 shadow-xl active:scale-95"
              >
                Acheter
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* MODAL : Plein écran sur mobile */}
      {isBuyModalOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-2 md:p-4 bg-black/95 backdrop-blur-xl animate-fade-in custom-scrollbar overflow-y-auto">
          <div className="bg-[#0a0a0a] border border-white/10 w-full max-w-md rounded-[2rem] md:rounded-[2.5rem] overflow-hidden relative shadow-2xl flex flex-col my-4 md:my-8">
            
            {isSuccess && (
              <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-[#0a0a0a]/95 backdrop-blur-md">
                <div className="w-20 h-20 md:w-24 md:h-24 mb-6 rounded-full bg-blue-500/10 border-2 border-blue-500/20 flex items-center justify-center animate-bounce-short">
                  <i className="fas fa-check-circle text-3xl md:text-4xl text-blue-500"></i>
                </div>
                <h2 className="text-xl md:text-2xl font-black uppercase tracking-tighter italic text-white text-center px-4">Demande Reçue</h2>
                <p className="text-[8px] md:text-[9px] text-gray-400 uppercase tracking-widest mt-2">Redirection WhatsApp...</p>
              </div>
            )}

            <div className="p-5 md:p-6 border-b border-white/5 flex justify-between items-center bg-blue-900/10">
              <h2 className="text-base md:text-lg font-black uppercase tracking-tighter text-white italic truncate pr-4">
                Acquisition <span className="text-blue-500">{vehicle?.model || vehicle?.modele}</span>
              </h2>
              <button onClick={() => setIsBuyModalOpen(false)} className="w-8 h-8 rounded-full bg-white/5 text-gray-400 hover:text-white transition-colors flex-shrink-0">
                <i className="fas fa-times text-xs"></i>
              </button>
            </div>

            <form onSubmit={handleBuySubmit} className="p-6 md:p-8 space-y-5 md:space-y-6">
              <div>
                <label className="text-[8px] md:text-[9px] font-black text-gray-500 uppercase tracking-[0.2em] ml-2 mb-2 block">Identité</label>
                <input type="text" placeholder="Nom complet" required className="buy-input" value={buyerInfo.name} onChange={(e) => setBuyerInfo({...buyerInfo, name: e.target.value})} />
              </div>
              <div>
                <label className="text-[8px] md:text-[9px] font-black text-gray-500 uppercase tracking-[0.2em] ml-2 mb-2 block">WhatsApp</label>
                <input type="tel" placeholder="+225 00 00 00 00" required className="buy-input" value={buyerInfo.phone} onChange={(e) => setBuyerInfo({...buyerInfo, phone: e.target.value})} />
              </div>
              <div>
                <label className="text-[8px] md:text-[9px] font-black text-gray-500 uppercase tracking-[0.2em] ml-2 mb-2 block">Note (Optionnel)</label>
                <textarea className="buy-input h-20 md:h-24 resize-none" value={buyerInfo.message} onChange={(e) => setBuyerInfo({...buyerInfo, message: e.target.value})}></textarea>
              </div>

              <button type="submit" disabled={isSubmitting} className="w-full py-4 md:py-5 bg-white hover:bg-blue-600 text-black hover:text-white rounded-xl md:rounded-2xl font-black uppercase text-[10px] md:text-[11px] tracking-[0.15em] md:tracking-[0.2em] transition-all shadow-lg active:scale-95 flex items-center justify-center gap-3">
                {isSubmitting ? (
                  <><i className="fas fa-circle-notch animate-spin"></i> Transmission...</>
                ) : (
                  <><i className="fab fa-whatsapp text-lg"></i> Contacter un conseiller</>
                )}
              </button>
            </form>
          </div>
        </div>
      )}

      <style dangerouslySetInnerHTML={{ __html: `
        .buy-input { 
          width: 100%; background: rgba(255, 255, 255, 0.03); 
          border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 0.75rem; 
          padding: 0.9rem md:padding: 1.1rem; color: white; font-size: 11px; outline: none; transition: 0.3s; 
        }
        @media (min-width: 768px) { .buy-input { border-radius: 1rem; } }
        .buy-input:focus { border-color: #2563eb; background: rgba(37, 99, 235, 0.02); }
        @keyframes slideDown { from { transform: translate(-50%, -100%); opacity: 0; } to { transform: translate(-50%, 0); opacity: 1; } }
        .animate-slide-down { animation: slideDown 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards; }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        .animate-fade-in { animation: fadeIn 0.3s ease-out forwards; }
        @keyframes bounceShort { 0% { transform: scale(0.8); } 50% { transform: scale(1.1); } 100% { transform: scale(1); } }
        .animate-bounce-short { animation: bounceShort 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards; }
      `}} />
    </>
  );
}