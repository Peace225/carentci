import { useState, useEffect, useCallback } from 'react';
import API_BASE_URL from "../../api/config";

export default function AdminClients() {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(new Date());

  // 1. RÉCUPÉRATION DES LEADS (PROSPECTS VENTE) - VERSION SÉCURISÉE
  const fetchLeads = useCallback(async (silent = false) => {
    try {
      if (!silent) setLoading(true);
      setIsSyncing(true);

      const token = localStorage.getItem('adminToken');
      const res = await fetch(`${API_BASE_URL}/api/leads`, {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        }
      });
      
      // ✅ SÉCURITÉ : Vérifier si la réponse est bien du JSON avant de parser
      const contentType = res.headers.get("content-type");
      if (!res.ok || !contentType || !contentType.includes("application/json")) {
        console.error("Le serveur a renvoyé une erreur ou du HTML au lieu de JSON");
        return;
      }

      const data = await res.json();
      
      if (data.success) {
        setLeads(data.data);
        setLastUpdate(new Date());
      }
    } catch (err) {
      console.error("CRM Sync Error:", err);
    } finally {
      setLoading(false);
      setIsSyncing(false);
    }
  }, []);

  // 2. LOGIQUE TEMPS RÉEL (Polling 20s)
  useEffect(() => {
    fetchLeads();
    const crmPulse = setInterval(() => fetchLeads(true), 20000); 
    return () => clearInterval(crmPulse);
  }, [fetchLeads]);

  // 3. SUPPRESSION D'UN PROSPECT
  const handleDelete = async (id) => {
    if (!window.confirm("Supprimer ce prospect de la base de données ?")) return;
    try {
      const token = localStorage.getItem('adminToken');
      const res = await fetch(`${API_BASE_URL}/api/leads/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        setLeads(prev => prev.filter(l => l.id !== id));
      }
    } catch (err) {
      alert("Erreur lors de la suppression.");
    }
  };

  return (
    <div className="w-full animate-in fade-in duration-700">
      {/* pb-28 pour ne pas être caché par la barre mobile */}
      <main className="p-4 pb-28 md:p-10 md:pb-12">
        <div className="max-w-7xl mx-auto">
          
          {/* Header XXL Adaptatif */}
          <header className="mb-8 md:mb-12 flex flex-col lg:flex-row lg:items-end justify-between gap-6 md:gap-8">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <div className={`w-2 h-2 rounded-full ${isSyncing ? 'bg-blue-500 animate-ping' : 'bg-orange-500 animate-pulse'} shadow-[0_0_12px_rgba(249,115,22,0.6)]`}></div>
                <span className="text-[9px] md:text-[10px] text-gray-500 font-black uppercase tracking-[0.4em]">CRM & Acquisition Sales</span>
              </div>
              <h1 className="text-3xl md:text-5xl font-black uppercase tracking-tighter italic text-white leading-tight">
                Prospects <span className="text-blue-500">Vente</span>
              </h1>
              <p className="text-gray-500 text-[10px] md:text-xs font-bold uppercase tracking-widest opacity-60 italic">Suivi des intentions d'achat directes</p>
            </div>

            {/* Status Card - Responsive Stack */}
            <div className="bg-white/[0.02] border border-white/5 p-4 md:p-6 rounded-2xl md:rounded-[2rem] flex items-center justify-between md:justify-start gap-4 md:gap-6 backdrop-blur-xl">
              <div className="text-left md:text-right">
                <p className="text-[7px] md:text-[8px] text-gray-500 uppercase font-black tracking-[0.3em] mb-1">Dernier Refresh</p>
                <p className="text-[10px] md:text-xs text-white font-mono font-bold">{lastUpdate.toLocaleTimeString()}</p>
              </div>
              <div className="h-8 w-[1px] bg-white/10 hidden md:block"></div>
              <div>
                <p className="text-[7px] md:text-[8px] text-gray-500 uppercase font-black tracking-[0.3em] mb-1">Base active</p>
                <p className="text-[10px] md:text-xs text-blue-500 font-black">{leads.length} <span className="text-[8px] text-gray-600">Leads</span></p>
              </div>
            </div>
          </header>

          {loading ? (
            <div className="py-24 md:py-32 flex flex-col items-center justify-center space-y-6">
              <div className="relative">
                <div className="w-12 h-12 md:w-16 md:h-16 border-2 border-blue-500/10 border-t-blue-500 rounded-full animate-spin"></div>
              </div>
              <p className="text-blue-500 font-black uppercase text-[8px] md:text-[9px] tracking-[0.5em] animate-pulse">Initialisation CRM...</p>
            </div>
          ) : leads.length > 0 ? (
            <>
              {/* === VERSION DESKTOP (Tableau) === */}
              <div className="hidden md:block bg-[#0a0a0a] border border-white/5 rounded-[2.5rem] overflow-hidden shadow-2xl">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-white/[0.02] border-b border-white/5">
                      <th className="p-8 text-[10px] font-black text-gray-500 uppercase tracking-widest">Identité Client</th>
                      <th className="p-8 text-[10px] font-black text-gray-500 uppercase tracking-widest">Véhicule & Date</th>
                      <th className="p-8 text-[10px] font-black text-gray-500 uppercase tracking-widest text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {leads.map((lead) => (
                      <tr key={lead.id} className="group hover:bg-white/[0.01] transition-all duration-300">
                        <td className="p-8">
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-500 font-black text-[10px] uppercase italic">
                              {lead.name?.substring(0, 2)}
                            </div>
                            <div>
                              <p className="text-white font-black uppercase text-xs tracking-tight">{lead.name}</p>
                              <p className="text-orange-500 font-bold text-[10px] mt-1 tabular-nums">{lead.phone}</p>
                            </div>
                          </div>
                        </td>
                        <td className="p-8">
                          <p className="text-white font-black text-xs uppercase tracking-tighter leading-tight max-w-[200px]">{lead.vehicle_name}</p>
                          <p className="text-gray-500 text-[9px] font-bold uppercase mt-1">Soumis le {new Date(lead.created_at).toLocaleDateString()}</p>
                        </td>
                        <td className="p-8 text-right">
                          <div className="flex justify-end gap-2">
                             <a href={`https://wa.me/${lead.phone.replace(/\+/g, '').replace(/\s/g, '')}`} target="_blank" rel="noreferrer" className="p-3 bg-green-500/10 text-green-500 rounded-xl hover:bg-green-500 hover:text-white transition-all"><i className="fab fa-whatsapp"></i></a>
                             <button onClick={() => handleDelete(lead.id)} className="p-3 bg-red-500/10 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all"><i className="fas fa-trash-alt"></i></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* === VERSION MOBILE (Cartes Luxe) === */}
              <div className="md:hidden flex flex-col gap-5">
                {leads.map((lead) => (
                  <div key={lead.id} className="bg-[#0a0a0a] border border-white/10 rounded-[2rem] p-5 shadow-xl relative overflow-hidden active:scale-[0.98] transition-all">
                    
                    {/* Badge Statut */}
                    <div className="absolute top-0 right-0 px-4 py-1.5 bg-blue-600/10 rounded-bl-2xl border-l border-b border-white/5">
                        <span className="text-[7px] font-black text-blue-500 uppercase tracking-[0.2em]">Nouveau Prospect</span>
                    </div>

                    <div className="flex items-center gap-4 mb-5 mt-2">
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center text-white font-black text-sm shadow-lg">
                         {lead.name?.substring(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <h3 className="text-white font-black uppercase text-sm italic tracking-tight">{lead.name}</h3>
                        <p className="text-blue-400 font-bold text-[10px] mt-0.5 tabular-nums">{lead.phone}</p>
                      </div>
                    </div>

                    <div className="bg-white/[0.03] p-4 rounded-2xl mb-5 border border-white/5">
                      <p className="text-gray-500 text-[8px] font-black uppercase tracking-widest mb-2 flex items-center gap-2">
                        <i className="fas fa-car text-blue-500/50"></i> Véhicule convoité
                      </p>
                      <p className="text-white font-black text-[11px] uppercase italic tracking-tighter leading-tight mb-3">{lead.vehicle_name}</p>
                      <div className="flex items-baseline gap-1 pt-3 border-t border-white/5">
                        <p className="text-blue-500 font-black text-lg tabular-nums">{lead.price}</p>
                        <span className="text-[8px] text-gray-600 font-bold uppercase">XOF</span>
                      </div>
                    </div>

                    {/* Actions de contact mobile optimisées au pouce */}
                    <div className="flex gap-2">
                      <a 
                        href={`https://wa.me/${lead.phone.replace(/\+/g, '').replace(/\s/g, '')}`} 
                        target="_blank" 
                        rel="noreferrer"
                        className="flex-1 py-4 bg-green-600 text-white rounded-xl flex items-center justify-center gap-3 font-black uppercase text-[10px] tracking-widest active:scale-95 transition-all shadow-lg shadow-green-600/10"
                      >
                        <i className="fab fa-whatsapp text-sm"></i> Relancer Client
                      </a>
                      <button 
                        onClick={() => handleDelete(lead.id)} 
                        className="w-14 bg-red-500/5 text-red-500/40 rounded-xl flex items-center justify-center active:scale-95 transition-all border border-red-500/10"
                      >
                        <i className="fas fa-trash-alt text-sm"></i>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="relative group bg-[#0a0a0a] border border-white/5 rounded-[2.5rem] md:rounded-[3rem] p-12 md:p-24 text-center border-dashed hover:border-blue-500/20 transition-all duration-500">
              <div className="absolute inset-0 bg-gradient-to-b from-blue-500/[0.01] to-transparent pointer-events-none rounded-[3rem]"></div>
              <div className="relative z-10">
                <div className="w-20 h-20 md:w-28 md:h-28 bg-white/[0.02] border border-white/10 rounded-full flex items-center justify-center mx-auto mb-8 md:mb-10 group-hover:scale-110 transition-transform duration-700 shadow-2xl">
                  <i className="fas fa-bullseye text-4xl md:text-5xl text-gray-800 group-hover:text-blue-500 transition-colors"></i>
                </div>
                <h3 className="text-white font-black uppercase text-sm md:text-md tracking-[0.3em] mb-4 italic text-center">En attente de flux commercial</h3>
                <p className="text-gray-600 font-bold text-[9px] md:text-[10px] uppercase tracking-[0.2em] max-w-sm mx-auto leading-relaxed opacity-60">
                  Le tunnel de vente est en veille. Les prospects désirant acquérir un véhicule apparaîtront ici dès soumission de leur demande.
                </p>
              </div>
            </div>
          )}

        </div>
      </main>
    </div>
  );
}