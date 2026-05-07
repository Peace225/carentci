import { useState, useEffect, useCallback } from 'react';
import API_BASE_URL from "../../api/config";

export default function AdminPromos() {
  const [promos, setPromos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // 1. RÉCUPÉRATION SÉCURISÉE
  const fetchPromos = useCallback(async (silent = false) => {
    try {
      if (!silent) setLoading(true);
      setIsSyncing(true);

      const token = localStorage.getItem('adminToken');
      const res = await fetch(`${API_BASE_URL}/api/promo-codes`, {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        }
      });
      
      const contentType = res.headers.get("content-type");
      if (!res.ok || !contentType || !contentType.includes("application/json")) {
        return;
      }

      const data = await res.json();
      if (data.success) {
        setPromos(data.data);
        setLastUpdate(new Date());
      }
    } catch (err) {
      console.error("Marketing Sync Error:", err);
    } finally {
      setLoading(false);
      setIsSyncing(false);
    }
  }, []);

  // 2. POLLING 20s
  useEffect(() => {
    fetchPromos();
    const promoPulse = setInterval(() => fetchPromos(true), 20000); 
    return () => clearInterval(promoPulse);
  }, [fetchPromos]);

  // 3. SUPPRESSION
  const handleDelete = async (id) => {
    if (!window.confirm("Archiver définitivement ce code promo ?")) return;
    try {
      const token = localStorage.getItem('adminToken');
      const res = await fetch(`${API_BASE_URL}/api/promo-codes/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        setPromos(prev => prev.filter(p => p.id !== id));
      }
    } catch (err) {
      alert("Erreur lors de la suppression.");
    }
  };

  return (
    <div className="w-full animate-in fade-in duration-700">
      <main className="p-4 pb-28 md:p-10 md:pb-12">
        <div className="max-w-7xl mx-auto">
          
          {/* HEADER PREMIUM ADAPTATIF */}
          <header className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-10 gap-8">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <div className={`w-2 h-2 rounded-full ${isSyncing ? 'bg-blue-500 animate-ping' : 'bg-orange-500 animate-pulse'} shadow-[0_0_12px_rgba(249,115,22,0.6)]`}></div>
                <span className="text-[9px] md:text-[10px] text-gray-500 font-black uppercase tracking-[0.4em]">Growth & Conversion</span>
              </div>
              <h1 className="text-3xl md:text-5xl font-black uppercase tracking-tighter italic text-white leading-tight">
                Marketing <span className="text-orange-500">& Promos</span>
              </h1>
              <div className="flex items-center gap-4 mt-2">
                 <p className="text-gray-500 text-[9px] md:text-[10px] font-bold uppercase tracking-widest opacity-60">Configuration des offres</p>
                 <div className="h-1 w-1 bg-gray-800 rounded-full"></div>
                 <p className="text-white font-mono text-[8px] md:text-[9px] uppercase tracking-widest opacity-80">Sync: {lastUpdate.toLocaleTimeString()}</p>
              </div>
            </div>

            {/* Bouton optimisé pour le pouce sur mobile */}
            <button 
              onClick={() => setIsCreateModalOpen(true)}
              className="w-full lg:w-auto group bg-white text-black px-8 py-4.5 md:py-5 rounded-2xl font-black uppercase text-[10px] md:text-[11px] tracking-[0.2em] shadow-2xl hover:bg-orange-500 transition-all duration-500 active:scale-95 flex items-center justify-center gap-3"
            >
              <i className="fas fa-plus-circle transition-transform group-hover:rotate-180 duration-700"></i>
              Créer un code
            </button>
          </header>

          {loading ? (
            <div className="py-24 md:py-32 flex flex-col items-center justify-center space-y-6">
              <div className="w-12 h-12 md:w-14 md:h-14 border-2 border-orange-500/10 border-t-orange-500 rounded-full animate-spin"></div>
              <p className="text-orange-500 font-black uppercase text-[8px] md:text-[9px] tracking-[0.5em] animate-pulse text-center">Scanning Marketing Vault...</p>
            </div>
          ) : promos.length > 0 ? (
            /* LISTE DES COUPONS (GRID ADAPTATIF) */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
              {promos.map((promo) => (
                <div key={promo.id} className="group relative bg-[#0a0a0a] border border-white/5 rounded-[2rem] md:rounded-[2.5rem] p-6 md:p-8 hover:border-orange-500/30 transition-all duration-500 overflow-hidden shadow-xl active:scale-[0.98]">
                  
                  {/* Filigrane discret */}
                  <div className="absolute -top-2 -right-2 opacity-[0.03] group-hover:opacity-[0.07] transition-opacity rotate-12">
                    <i className="fas fa-ticket-alt text-8xl text-white"></i>
                  </div>

                  <div className="relative z-10">
                    <div className="flex justify-between items-start mb-6">
                      <div className="bg-orange-500 text-black px-3 py-1.5 rounded-lg font-black text-[9px] md:text-[10px] uppercase tracking-widest shadow-lg shadow-orange-500/10">
                        -{promo.discount_value}{promo.discount_type === 'percentage' ? '%' : ' XOF'}
                      </div>
                      <button 
                        onClick={() => handleDelete(promo.id)}
                        className="w-9 h-9 rounded-full bg-white/5 flex items-center justify-center text-gray-500 hover:text-red-500 transition-all active:bg-red-500/10"
                      >
                        <i className="fas fa-trash-alt text-xs"></i>
                      </button>
                    </div>

                    <h3 className="text-white font-black text-xl md:text-2xl uppercase tracking-tighter mb-1 italic">
                      {promo.code}
                    </h3>
                    <p className="text-gray-500 text-[9px] md:text-[10px] font-bold uppercase tracking-widest mb-6 min-h-[30px] leading-relaxed">
                      {promo.description || "Offre promotionnelle active"}
                    </p>

                    <div className="space-y-3 pt-6 border-t border-white/5">
                      <div className="flex justify-between items-center">
                        <span className="text-[8px] md:text-[9px] text-gray-600 font-black uppercase tracking-widest">Utilisations</span>
                        <span className="text-white font-mono text-[10px] md:text-xs font-bold bg-white/5 px-2 py-0.5 rounded">
                          {promo.usage_count} <span className="opacity-30 mx-1">/</span> {promo.usage_limit || '∞'}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-[8px] md:text-[9px] text-gray-600 font-black uppercase tracking-widest">Validité</span>
                        <span className="text-orange-500 font-mono text-[10px] md:text-xs italic font-bold">
                          {promo.expiry_date ? new Date(promo.expiry_date).toLocaleDateString() : 'ILLIMITÉ'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* EMPTY STATE SOPHISTIQUÉ */
            <div className="relative group bg-[#0a0a0a] border border-white/5 rounded-[2.5rem] md:rounded-[3rem] p-12 md:p-24 text-center border-dashed hover:border-orange-500/20 transition-all duration-500">
              <div className="absolute inset-0 bg-gradient-to-b from-orange-500/[0.02] to-transparent pointer-events-none rounded-[3rem]"></div>
              <div className="relative z-10">
                <div className="w-20 h-20 md:w-24 md:h-24 bg-white/[0.02] border border-white/10 rounded-full flex items-center justify-center mx-auto mb-8 group-hover:scale-110 transition-all duration-500 shadow-2xl">
                  <i className="fas fa-ticket-alt text-3xl md:text-4xl text-gray-800 group-hover:text-orange-500 transition-colors"></i>
                </div>
                <h3 className="text-white font-black uppercase text-sm md:text-md tracking-[0.3em] mb-4 italic">Campagne Inactive</h3>
                <p className="text-gray-600 font-bold text-[9px] md:text-[10px] uppercase tracking-widest max-w-sm mx-auto leading-relaxed opacity-60">
                  Aucun coupon n'est actuellement déployé. Appuyez sur le bouton "Créer" pour lancer une offre.
                </p>
              </div>
            </div>
          )}

        </div>
      </main>
    </div>
  );
}