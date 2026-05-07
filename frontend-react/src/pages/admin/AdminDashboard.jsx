import { useState, useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchRentalVehicles, fetchSaleVehicles } from "../../api/vehicles";
import API_BASE_URL from "../../api/config"; 
import AddVehicleModal from "./AddVehicleModal";

export default function AdminDashboard() {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedIds, setSelectedIds] = useState([]);
  const [shouldPoll, setShouldPoll] = useState(true);
  const [lastSync, setLastSync] = useState(new Date());

  // --- RÉCUPÉRATION DES DONNÉES ---
  const { data: rentals = [], isLoading: load1, error: error1, isRefetching: refetch1 } = useQuery({ 
    queryKey: ["rental"], 
    queryFn: fetchRentalVehicles,
    refetchInterval: shouldPoll ? 5000 : false,
  });

  const { data: sales = [], isLoading: load2, error: error2, isRefetching: refetch2 } = useQuery({ 
    queryKey: ["sale"], 
    queryFn: fetchSaleVehicles,
    refetchInterval: shouldPoll ? 5000 : false, 
  });

  useEffect(() => {
    if (error1 || error2) setLastSync(new Date());
  }, [error1, error2, refetch1, refetch2]);

  const allVehicles = [...rentals, ...sales];
  const isLoading = load1 || load2;
  const isSyncing = refetch1 || refetch2;

  // --- LOGIQUE SÉLECTION ---
  const toggleSelectAll = () => {
    setSelectedIds(selectedIds.length === allVehicles.length ? [] : allVehicles.map(v => v.id));
  };

  const toggleSelectOne = (id) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]);
  };

  // --- ARCHIVAGE ---
  const archiveVehicles = async (ids) => {
    if (!window.confirm(`Confirmer l'archivage de ${ids.length} véhicule(s) ?`)) return;
    try {
      const token = localStorage.getItem('adminToken');
      await Promise.all(ids.map(id => 
        fetch(`${API_BASE_URL}/api/vehicles/${id}`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${token}` }
        })
      ));
      setSelectedIds([]); 
      queryClient.invalidateQueries({ queryKey: ["rental"] });
      queryClient.invalidateQueries({ queryKey: ["sale"] });
    } catch (error) {
      alert("Erreur lors de l'archivage.");
    }
  };

  return (
    <div className="w-full animate-in fade-in slide-in-from-bottom-4 duration-1000">
      {/* pb-28 pour éviter que la barre de navigation mobile ne cache le bouton d'ajout */}
      <div className="max-w-7xl mx-auto p-4 pb-28 md:p-10">
        
        {/* HEADER RESPONSIVE */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-6">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div className={`w-2 h-2 rounded-full shadow-[0_0_10px_rgba(249,115,22,0.6)] ${isSyncing ? 'bg-blue-400 animate-ping' : 'bg-green-500'}`}></div>
              <span className="text-[9px] text-gray-500 font-black uppercase tracking-[0.4em]">
                {isSyncing ? "Sync Cloud..." : "Flotte Live"}
              </span>
            </div>
            <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter italic text-white leading-none">
              Console <span className="text-orange-500">Flotte</span>
            </h1>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            {selectedIds.length > 0 ? (
              <button 
                onClick={() => archiveVehicles(selectedIds)}
                className="flex-1 md:flex-none bg-red-600 text-white px-6 py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-xl animate-pulse"
              >
                Archiver ({selectedIds.length})
              </button>
            ) : (
              <button 
                onClick={() => setIsModalOpen(true)} 
                className="flex-1 md:flex-none bg-orange-500 hover:bg-white text-black px-8 py-4 md:py-5 rounded-2xl font-black uppercase text-[10px] tracking-[0.2em] transition-all shadow-lg active:scale-95 flex items-center justify-center"
              >
                <i className="fas fa-plus-circle mr-3"></i> Nouveau
              </button>
            )}
          </div>
        </header>

        {isLoading && allVehicles.length === 0 ? (
          <div className="py-40 text-center">
            <div className="w-12 h-12 border-2 border-orange-500/20 border-t-orange-500 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-orange-500 font-black uppercase text-[10px] tracking-widest">Chargement Flotte...</p>
          </div>
        ) : allVehicles.length > 0 ? (
          <>
            {/* --- VERSION TABLEAU (Desktop) --- */}
            <div className="hidden md:block bg-[#0a0a0a] border border-white/5 rounded-[2.5rem] overflow-hidden shadow-2xl">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-white/[0.03] text-[10px] uppercase font-black tracking-[0.2em] text-gray-500 border-b border-white/5">
                    <th className="px-8 py-6 w-16 text-center">
                      <input type="checkbox" onChange={toggleSelectAll} checked={selectedIds.length === allVehicles.length} className="w-4 h-4 accent-orange-500" />
                    </th>
                    <th className="px-6 py-6">Véhicule</th>
                    <th className="px-6 py-6 text-center">Opération</th>
                    <th className="px-6 py-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {allVehicles.map((v) => (
                    <tr key={v.id} className="hover:bg-white/[0.01] transition-colors group">
                      <td className="px-8 py-6 text-center">
                        <input type="checkbox" checked={selectedIds.includes(v.id)} onChange={() => toggleSelectOne(v.id)} className="w-4 h-4 accent-orange-500" />
                      </td>
                      <td className="px-6 py-6">
                        <div className="flex items-center gap-5">
                          <div className="w-16 h-16 bg-white/5 rounded-2xl border border-white/10 overflow-hidden">
                            <img src={v.image || "/placeholder.jpg"} className="w-full h-full object-cover" alt="" />
                          </div>
                          <div>
                            <p className="font-black text-white text-lg uppercase italic">{v.marque} <span className="text-orange-500">{v.modele}</span></p>
                            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-1">{v.annee} • {v.prix?.toLocaleString()} XOF</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-6 text-center">
                        <span className={`px-4 py-1.5 rounded-full text-[8px] font-black uppercase tracking-widest border ${v.type === 'location' ? 'border-blue-500/30 text-blue-400 bg-blue-500/5' : 'border-purple-500/30 text-purple-400 bg-purple-500/5'}`}>
                          {v.type}
                        </span>
                      </td>
                      <td className="px-6 py-6 text-right">
                        <button onClick={() => archiveVehicles([v.id])} className="w-10 h-10 rounded-xl bg-red-500/5 text-red-500/40 hover:bg-red-600 hover:text-white transition-all"><i className="fas fa-trash-alt text-xs"></i></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* --- VERSION CARTES (Mobile) --- */}
            <div className="md:hidden flex flex-col gap-4">
              {allVehicles.map((v) => (
                <div key={v.id} className={`bg-[#0a0a0a] border rounded-[2rem] p-4 transition-all ${selectedIds.includes(v.id) ? 'border-orange-500/50 bg-orange-500/5' : 'border-white/5'}`}>
                  <div className="flex gap-4">
                    <div className="relative">
                      <div className="w-20 h-20 bg-white/5 rounded-2xl overflow-hidden border border-white/10">
                        <img src={v.image || "/placeholder.jpg"} className="w-full h-full object-cover" alt="" />
                      </div>
                      <input 
                        type="checkbox" 
                        checked={selectedIds.includes(v.id)} 
                        onChange={() => toggleSelectOne(v.id)} 
                        className="absolute -top-2 -left-2 w-6 h-6 accent-orange-500 border-2 border-black rounded-full" 
                      />
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <span className={`text-[7px] font-black uppercase px-2 py-0.5 rounded-md border ${v.type === 'location' ? 'border-blue-500/30 text-blue-400' : 'border-purple-500/30 text-purple-400'}`}>
                          {v.type}
                        </span>
                        <button onClick={() => archiveVehicles([v.id])} className="text-red-500/40 p-1"><i className="fas fa-trash-alt text-xs"></i></button>
                      </div>
                      <p className="font-black text-white text-sm uppercase italic mt-1">{v.marque} <span className="text-orange-500">{v.modele}</span></p>
                      <p className="text-[10px] text-gray-500 font-bold mt-0.5">{v.annee}</p>
                      <p className="text-orange-500/80 font-black text-xs mt-2">{v.prix?.toLocaleString()} <span className="text-[8px] text-gray-600">XOF</span></p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="bg-[#0a0a0a] border border-dashed border-white/10 rounded-[3rem] p-20 text-center">
            <i className="fas fa-car-side text-4xl text-gray-800 mb-4 block"></i>
            <p className="text-gray-500 font-black uppercase text-[10px] tracking-widest">Aucun véhicule dans le hangar</p>
          </div>
        )}
      </div>

      <AddVehicleModal 
        isOpen={isModalOpen} 
        onClose={() => {
          setIsModalOpen(false);
          queryClient.invalidateQueries(["rental"]);
          queryClient.invalidateQueries(["sale"]);
        }} 
      />
    </div>
  );
}