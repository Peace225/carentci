import { useState, useEffect, useCallback } from 'react';
import API_BASE_URL from "../../api/config";

export default function AdminReservations() {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [lastSync, setLastSync] = useState(new Date());

  // 1. FONCTION DE RÉCUPÉRATION
  const fetchReservations = useCallback(async (isSilent = false) => {
    try {
      if (!isSilent) setLoading(true);
      setIsRefreshing(true);

      const token = localStorage.getItem('adminToken');
      const res = await fetch(`${API_BASE_URL}/api/reservations`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      const data = await res.json();
      
      if (data.success) {
        setReservations(data.data);
        setLastSync(new Date());
      } else {
        throw new Error(data.message);
      }
    } catch (err) {
      console.error("Erreur Sync:", err);
      setError("Erreur de synchronisation en temps réel.");
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  // 2. LOGIQUE TEMPS RÉEL (Polling)
  useEffect(() => {
    fetchReservations();
    const liveInterval = setInterval(() => {
      fetchReservations(true);
    }, 15000); 

    return () => clearInterval(liveInterval);
  }, [fetchReservations]);

  // 3. LOGIQUE DE SUPPRESSION
  const handleDelete = async (id) => {
    if (!window.confirm("Supprimer définitivement cette réservation ?")) return;
    try {
      const token = localStorage.getItem('adminToken');
      const res = await fetch(`${API_BASE_URL}/api/reservations/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        setReservations(prev => prev.filter(r => r.id !== id));
      }
    } catch (err) {
      alert("Erreur lors de la suppression.");
    }
  };

  const getStatusStyle = (status) => {
    const styles = {
      pending: "bg-orange-500/10 text-orange-500 border-orange-500/20",
      confirmed: "bg-green-500/10 text-green-500 border-green-500/20",
      cancelled: "bg-red-500/10 text-red-500 border-red-500/20",
      completed: "bg-blue-500/10 text-blue-500 border-blue-500/20"
    };
    return styles[status] || styles.pending;
  };

  return (
    <div className="w-full animate-in fade-in duration-700">
      {/* ⚠️ pb-28 sur mobile pour laisser l'espace à la navbar du bas */}
      <main className="p-4 pb-28 md:p-10 md:pb-10">
        <div className="max-w-7xl mx-auto">
          
          {/* Header avec Indicateur de Synchro */}
          <header className="mb-8 md:mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className={`w-2 h-2 rounded-full shadow-[0_0_10px_rgba(249,115,22,0.8)] ${isRefreshing ? 'bg-blue-400 animate-ping' : 'bg-orange-500 animate-pulse'}`}></div>
                <span className="text-[10px] text-gray-500 font-black uppercase tracking-[0.4em]">
                  {isRefreshing ? 'Synchronisation Cloud...' : 'Flux Temps Réel Actif'}
                </span>
              </div>
              <h1 className="text-3xl md:text-5xl font-black uppercase tracking-tighter italic text-white">
                Suivi des <br className="md:hidden" />
                <span className="text-orange-500">Réservations</span>
              </h1>
            </div>

            <div className="bg-white/[0.02] border border-white/5 px-6 py-3 rounded-2xl flex items-center justify-between md:justify-start gap-4">
              <div className="text-left md:text-right">
                <p className="text-[8px] text-gray-500 uppercase font-black tracking-widest">Dernière mise à jour</p>
                <p className="text-[11px] text-white font-mono">{lastSync.toLocaleTimeString()}</p>
              </div>
              <div className={`w-8 h-8 rounded-full border border-white/10 flex items-center justify-center ${isRefreshing ? 'animate-spin border-t-orange-500' : ''}`}>
                <i className="fas fa-sync-alt text-[10px] text-gray-500"></i>
              </div>
            </div>
          </header>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="w-12 h-12 border-4 border-orange-500/20 border-t-orange-500 rounded-full animate-spin shadow-[0_0_20px_rgba(249,115,22,0.2)]"></div>
              <p className="text-orange-500 font-black uppercase text-[10px] tracking-widest mt-4 animate-pulse">Initialisation Supabase...</p>
            </div>
          ) : reservations.length > 0 ? (
            <>
              {/* ========================================== */}
              {/* VERSION DESKTOP (Tableau classique)        */}
              {/* ========================================== */}
              <div className="hidden md:block overflow-x-auto bg-[#0a0a0a] border border-white/5 rounded-[2rem] shadow-2xl backdrop-blur-sm custom-scrollbar">
                <table className="w-full text-left border-collapse whitespace-nowrap">
                  <thead>
                    <tr className="border-b border-white/5 bg-white/[0.02]">
                      <th className="p-6 text-[10px] font-black text-gray-500 uppercase tracking-widest">Client</th>
                      <th className="p-6 text-[10px] font-black text-gray-500 uppercase tracking-widest">Véhicule & Dates</th>
                      <th className="p-6 text-[10px] font-black text-gray-500 uppercase tracking-widest">Options & Trajet</th>
                      <th className="p-6 text-[10px] font-black text-gray-500 uppercase tracking-widest">Tarif / Jour</th>
                      <th className="p-6 text-[10px] font-black text-gray-500 uppercase tracking-widest">Statut</th>
                      <th className="p-6 text-[10px] font-black text-gray-500 uppercase tracking-widest text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {reservations.map((res) => (
                      <tr key={res.id} className="hover:bg-white/[0.01] transition-colors group">
                        <td className="p-6">
                          <div className="flex flex-col">
                            <span className="text-white font-black uppercase text-xs italic tracking-tight">{res.customer_name}</span>
                            <span className="text-orange-500/80 text-[10px] font-bold mt-1 tabular-nums">
                              <i className="fab fa-whatsapp mr-1"></i> {res.customer_phone}
                            </span>
                          </div>
                        </td>
                        <td className="p-6">
                          <div className="flex flex-col">
                            <span className="text-white font-black text-[11px] uppercase tracking-tighter">{res.vehicle_name}</span>
                            <span className="text-gray-500 font-bold text-[10px] mt-1 uppercase tracking-widest">
                              {new Date(res.start_date).toLocaleDateString()} — {new Date(res.end_date).toLocaleDateString()}
                            </span>
                          </div>
                        </td>
                        <td className="p-6">
                          <div className="flex flex-col gap-1">
                            <span className="text-gray-300 font-bold text-[10px] uppercase tracking-widest">
                              <i className="fas fa-map-marker-alt text-gray-500 mr-2"></i> {res.location}
                            </span>
                            <span className={`${res.driver_option === 'avec_chauffeur' ? 'text-orange-500' : 'text-gray-500'} font-bold text-[10px] uppercase tracking-widest`}>
                              <i className="fas fa-user-tie mr-2"></i> 
                              {res.driver_option === 'avec_chauffeur' ? 'Avec Chauffeur' : 'Sans Chauffeur'}
                            </span>
                          </div>
                        </td>
                        <td className="p-6">
                          <span className="text-white font-black text-sm">
                            {(res.daily_price || 0).toLocaleString('fr-FR')} <span className="text-[9px] text-gray-500 uppercase tracking-widest">FCFA</span>
                          </span>
                        </td>
                        <td className="p-6">
                          <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase border transition-all duration-500 ${getStatusStyle(res.status)}`}>
                            {res.status === 'pending' ? 'EN ATTENTE' : res.status}
                          </span>
                        </td>
                        <td className="p-6 text-right">
                          <button 
                            onClick={() => handleDelete(res.id)}
                            className="w-10 h-10 bg-red-500/5 text-red-500/40 border border-red-500/10 rounded-xl hover:bg-red-500 hover:text-white hover:border-red-500 transition-all duration-500 flex items-center justify-center ml-auto"
                          >
                            <i className="fas fa-trash-alt text-xs"></i>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* ========================================== */}
              {/* VERSION MOBILE (Grille de Cartes Premium)  */}
              {/* ========================================== */}
              <div className="md:hidden flex flex-col gap-5">
                {reservations.map((res) => (
                  <div key={res.id} className="bg-[#0a0a0a] border border-white/10 rounded-[2rem] p-6 relative overflow-hidden shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
                    
                    {/* En-tête de la carte : Client & Statut */}
                    <div className="flex justify-between items-start mb-5">
                      <div>
                        <h3 className="text-white font-black uppercase text-sm italic tracking-tight">{res.customer_name}</h3>
                        <a href={`https://wa.me/${res.customer_phone.replace(/\+/g, '')}`} target="_blank" rel="noreferrer" className="text-orange-500 font-bold text-[11px] mt-1 flex items-center tabular-nums hover:text-white transition-colors">
                          <i className="fab fa-whatsapp text-sm mr-1.5"></i> {res.customer_phone}
                        </a>
                      </div>
                      <span className={`px-3 py-1.5 rounded-full text-[8px] font-black uppercase border shadow-lg ${getStatusStyle(res.status)}`}>
                        {res.status === 'pending' ? 'EN ATTENTE' : res.status}
                      </span>
                    </div>

                    {/* Bloc central : Véhicule & Détails */}
                    <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-4 mb-5">
                      <p className="text-white font-black text-[13px] uppercase tracking-tighter mb-1.5">
                        {res.vehicle_name}
                      </p>
                      <p className="text-gray-400 font-bold text-[9px] uppercase tracking-widest mb-3">
                        <i className="far fa-calendar-alt mr-1.5"></i>
                        {new Date(res.start_date).toLocaleDateString()} — {new Date(res.end_date).toLocaleDateString()}
                      </p>
                      
                      <div className="flex flex-wrap gap-3 pt-3 border-t border-white/5">
                        <span className="bg-black/50 px-2.5 py-1.5 rounded-lg text-gray-300 font-bold text-[9px] uppercase tracking-widest flex items-center">
                          <i className="fas fa-map-marker-alt text-gray-500 mr-1.5"></i> {res.location}
                        </span>
                        <span className={`bg-black/50 px-2.5 py-1.5 rounded-lg ${res.driver_option === 'avec_chauffeur' ? 'text-orange-500' : 'text-gray-500'} font-bold text-[9px] uppercase tracking-widest flex items-center`}>
                          <i className="fas fa-user-tie mr-1.5"></i> 
                          {res.driver_option === 'avec_chauffeur' ? 'Avec Chauffeur' : 'Sans Chauffeur'}
                        </span>
                      </div>
                    </div>

                    {/* Footer de la carte : Prix & Actions */}
                    <div className="flex justify-between items-center mt-2">
                      <div>
                        <p className="text-[8px] text-gray-500 uppercase font-black tracking-widest mb-0.5">Tarif négocié</p>
                        <span className="text-orange-500 font-black text-xl">
                          {(res.daily_price || 0).toLocaleString('fr-FR')} 
                        </span>
                        <span className="text-[9px] text-gray-500 font-bold uppercase tracking-widest ml-1">FCFA / j</span>
                      </div>
                      <button 
                        onClick={() => handleDelete(res.id)}
                        className="w-12 h-12 bg-red-500/10 text-red-500 border border-red-500/20 rounded-2xl hover:bg-red-500 hover:text-white transition-all duration-300 flex items-center justify-center active:scale-95 shadow-lg shadow-red-500/5"
                      >
                        <i className="fas fa-trash-alt text-sm"></i>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="relative group bg-[#0a0a0a] border border-white/5 rounded-[3rem] p-12 md:p-20 text-center border-dashed hover:border-orange-500/20 transition-all duration-500 mt-8">
              <div className="absolute inset-0 bg-gradient-to-b from-orange-500/[0.01] to-transparent pointer-events-none rounded-[3rem]"></div>
              <div className="relative z-10">
                <div className="w-20 h-20 md:w-24 md:h-24 bg-white/[0.02] border border-white/10 rounded-full flex items-center justify-center mx-auto mb-6 md:mb-8 group-hover:scale-110 transition-transform duration-700">
                  <i className="fas fa-calendar-check text-3xl md:text-4xl text-gray-800 group-hover:text-orange-500 transition-colors"></i>
                </div>
                <h3 className="text-white font-black uppercase text-xs md:text-sm tracking-[0.2em] mb-3">En attente de flux</h3>
                <p className="text-gray-600 font-bold text-[9px] md:text-[10px] uppercase tracking-widest max-w-xs mx-auto leading-relaxed">
                  Le tunnel de réservation est à l'écoute. Les nouveaux contrats apparaîtront ici automatiquement.
                </p>
              </div>
            </div>
          )}

        </div>
      </main>
    </div>
  );
}