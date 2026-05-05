import { useState, useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchRentalVehicles, fetchSaleVehicles } from "../../api/vehicles";
// ❌ Suppression de l'import Sidebar (géré par AdminLayout)
import API_BASE_URL from "../../api/config"; 

export default function AdminDashboard() {
  const queryClient = useQueryClient();
  // Note : isModalOpen peut rester ici si tu veux le contrôler localement, 
  // mais il est préférable d'utiliser le bouton de la Sidebar qui pointe vers ?action=new
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedIds, setSelectedIds] = useState([]);
  const [shouldPoll, setShouldPoll] = useState(true);

  // --- RÉCUPÉRATION DES DONNÉES ---
  const { data: rentals = [], isLoading: load1, error: error1 } = useQuery({ 
    queryKey: ["rental"], 
    queryFn: fetchRentalVehicles,
    refetchInterval: shouldPoll ? 5000 : false,
    retry: 1,
  });

  const { data: sales = [], isLoading: load2, error: error2 } = useQuery({ 
    queryKey: ["sale"], 
    queryFn: fetchSaleVehicles,
    refetchInterval: shouldPoll ? 5000 : false, 
    retry: 1,
  });

  useEffect(() => {
    if (error1?.message?.includes("401") || error2?.message?.includes("401")) {
      setShouldPoll(false);
    }
  }, [error1, error2]);

  const allVehicles = [...rentals, ...sales];
  const isLoading = load1 || load2;

  // --- LOGIQUE DE SÉLECTION ---
  const toggleSelectAll = () => {
    if (selectedIds.length === allVehicles.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(allVehicles.map(v => v.id));
    }
  };

  const toggleSelectOne = (id) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  // --- ARCHIVAGE SÉCURISÉ ---
  const archiveVehicles = async (ids) => {
    if (!window.confirm(`Voulez-vous archiver ${ids.length} véhicule(s) ?`)) return;

    try {
      const token = localStorage.getItem('adminToken');
      
      const responses = await Promise.all(ids.map(id => 
        fetch(`${API_BASE_URL}/api/vehicles/${id}`, {
          method: 'DELETE',
          headers: { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        })
      ));

      const unauthorized = responses.some(res => res.status === 401);
      if (unauthorized) {
        alert("Session expirée. Veuillez vous reconnecter.");
        setShouldPoll(false);
        return;
      }

      if (responses.every(res => res.ok)) {
        setSelectedIds([]); 
        queryClient.invalidateQueries({ queryKey: ["rental"] });
        queryClient.invalidateQueries({ queryKey: ["sale"] });
      } else {
        alert("Une erreur est survenue lors de l'archivage.");
      }
      
    } catch (error) {
      console.error("Erreur réseau :", error);
      alert("Connexion au serveur impossible. Vérifiez le backend.");
    }
  };

  return (
    // ❌ On enlève "flex min-h-screen" et le fond noir car AdminLayout s'en occupe déjà
    <div className="w-full animate-in fade-in duration-500">
      
      {/* ❌ La Sidebar a été supprimée d'ici pour éviter le doublon visible sur c_2.PNG */}

      <div className="max-w-7xl mx-auto">
        
        {/* HEADER DYNAMIQUE */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
          <div>
            <h1 className="text-4xl font-black uppercase tracking-tighter italic">
              CONSOLE <span className="text-orange-500">LIVE</span>
            </h1>
            <div className="flex items-center gap-2 mt-1">
              <span className="relative flex h-2 w-2">
                <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${shouldPoll ? 'bg-green-400' : 'bg-red-400'} opacity-75`}></span>
                <span className={`relative inline-flex rounded-full h-2 w-2 ${shouldPoll ? 'bg-green-500' : 'bg-red-500'}`}></span>
              </span>
              <p className="text-gray-500 text-[10px] font-black uppercase tracking-widest">
                {shouldPoll ? "Base de données synchronisée" : "Synchronisation interrompue"}
              </p>
            </div>
          </div>

          {selectedIds.length > 0 ? (
            <div className="flex items-center gap-4 bg-orange-500 text-black px-6 py-3 rounded-2xl animate-pulse">
              <span className="font-black text-xs uppercase">{selectedIds.length} sélectionnés</span>
              <button 
                onClick={() => archiveVehicles(selectedIds)}
                className="bg-black text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase hover:bg-red-600 transition-all"
              >
                Archiver la sélection
              </button>
            </div>
          ) : (
            <button 
              onClick={() => setIsModalOpen(true)} 
              className="bg-orange-500 hover:bg-white text-black px-8 py-4 rounded-2xl font-black uppercase text-xs tracking-widest transition-all shadow-[0_0_40px_rgba(249,115,22,0.2)]"
            >
              + Nouveau Véhicule
            </button>
          )}
        </div>

        {/* TABLEAU DES VÉHICULES */}
        <div className="bg-[#0a0a0a] border border-white/5 rounded-[2.5rem] overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-white/[0.03] text-[10px] uppercase font-black tracking-widest text-gray-500 border-b border-white/5">
                  <th className="px-8 py-6 w-10 text-center">
                    <input 
                      type="checkbox" 
                      onChange={toggleSelectAll}
                      checked={selectedIds.length === allVehicles.length && allVehicles.length > 0}
                      className="w-5 h-5 accent-orange-500 cursor-pointer rounded"
                    />
                  </th>
                  <th className="px-8 py-6">Fiche Véhicule</th>
                  <th className="px-8 py-6 text-center">Opération</th>
                  <th className="px-8 py-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {isLoading && allVehicles.length === 0 ? (
                  <tr><td colSpan="4" className="text-center py-24 text-gray-700 font-black uppercase text-xl animate-pulse">Initialisation...</td></tr>
                ) : (
                  allVehicles.map((v) => (
                    <tr key={v.id} className={`hover:bg-white/[0.02] transition-colors group ${selectedIds.includes(v.id) ? 'bg-orange-500/5' : ''}`}>
                      <td className="px-8 py-6 text-center">
                        <input 
                          type="checkbox" 
                          checked={selectedIds.includes(v.id)}
                          onChange={() => toggleSelectOne(v.id)}
                          className="w-5 h-5 accent-orange-500 cursor-pointer rounded"
                        />
                      </td>
                      
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-5">
                          <div className="w-16 h-16 bg-white/5 rounded-2xl border border-white/10 flex items-center justify-center overflow-hidden">
                            {v.image ? (
                              <img 
                                src={v.image} 
                                className="w-full h-full object-cover" 
                                alt="" 
                                onError={(e) => { 
                                  e.target.onerror = null; 
                                  e.target.src = "https://placehold.co/150x150?text=Auto"; 
                                }}
                              />
                            ) : (
                              <span className="text-[10px] text-gray-600 font-black text-center">N/A</span>
                            )}
                          </div>
                          <div>
                            <div className="font-black text-white text-base uppercase leading-tight">
                              {v.marque} <span className="text-orange-500">{v.modele}</span>
                            </div>
                            <div className="text-[10px] text-gray-600 font-bold uppercase mt-1">
                              {v.annee} • {v.fuel || v.carburant}
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="px-8 py-6 text-center">
                        <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase border ${v.type === 'location' ? 'border-blue-500/30 text-blue-400 bg-blue-500/5' : 'border-purple-500/30 text-purple-400 bg-purple-500/5'}`}>
                          {v.type}
                        </span>
                      </td>

                      <td className="px-8 py-6 text-right">
                        <div className="opacity-0 group-hover:opacity-100 transition-all duration-300 flex justify-end gap-3">
                          <button 
                            onClick={() => archiveVehicles([v.id])} 
                            className="w-10 h-10 rounded-xl bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-all flex items-center justify-center shadow-lg"
                            title="Archiver"
                          >
                            <i className="fas fa-archive text-xs" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}