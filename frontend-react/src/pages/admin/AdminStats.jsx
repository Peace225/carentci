import { useQuery } from "@tanstack/react-query";
import API_BASE_URL from "../../api/config";

// --- LOGIQUE DE RÉCUPÉRATION ---
const fetchStats = async () => {
  const token = localStorage.getItem('adminToken');
  const response = await fetch(`${API_BASE_URL}/api/stats`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  if (!response.ok) throw new Error("Erreur lors de la récupération des stats");
  return response.json();
};

export default function AdminStats() {
  // Hook de synchronisation temps réel (polling toutes les 10s)
  const { data: stats, isLoading } = useQuery({
    queryKey: ["admin-stats"],
    queryFn: fetchStats,
    refetchInterval: 10000, // Mise à jour automatique toutes les 10 secondes
    refetchOnWindowFocus: true
  });

  // Définition des KPIs avec injection des data réelles ou fallbacks
  const kpis = [
    { 
      label: "Chiffre d'Affaires", 
      value: stats?.totalRevenue ? `${stats.totalRevenue.toLocaleString('fr-FR')} F` : "--- F", 
      trend: stats?.revenueTrend || "0%", 
      icon: "fa-wallet", 
      color: "text-green-500" 
    },
    { 
      label: "Taux d'Occupation", 
      value: stats?.occupancyRate ? `${stats.occupancyRate}%` : "---%", 
      trend: stats?.occupancyTrend || "0%", 
      icon: "fa-chart-pie", 
      color: "text-blue-500" 
    },
    { 
      label: "Nouveaux Clients", 
      value: stats?.newClientsCount || "0", 
      trend: stats?.clientsTrend || "0%", 
      icon: "fa-user-plus", 
      color: "text-orange-500" 
    },
    { 
      label: "Véhicules en Service", 
      value: stats?.activeVehicles ? `${stats.activeVehicles}/${stats.totalVehicles}` : "--/--", 
      trend: "LIVE", 
      icon: "fa-car", 
      color: "text-purple-500" 
    }
  ];

  // Données du graphique (7 derniers jours)
  const chartData = stats?.revenueHistory || [0, 0, 0, 0, 0, 0, 0];

  return (
    <div className="w-full animate-in fade-in duration-700">
      <main className="p-4 md:p-10">
        <div className="max-w-7xl mx-auto">
          
          {/* HEADER ANALYTICS */}
          <header className="mb-12">
            <div className="flex items-center gap-3 mb-2">
              <div className={`w-2 h-2 rounded-full animate-pulse shadow-[0_0_10px_rgba(249,115,22,0.8)] ${isLoading ? 'bg-orange-500' : 'bg-green-500'}`}></div>
              <span className="text-[10px] text-gray-500 font-black uppercase tracking-[0.4em]">
                {isLoading ? "Synchronisation..." : "Données en temps réel"}
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter italic text-white">
              Analyse des <span className="text-orange-500">Performances</span>
            </h1>
            <p className="text-gray-500 text-xs font-bold uppercase tracking-widest mt-2 opacity-60">
              Rapports financiers et opérationnels synchronisés
            </p>
          </header>

          {/* KPI GRID XXL */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {kpis.map((kpi, i) => (
              <div key={i} className="bg-[#0a0a0a] border border-white/5 p-8 rounded-[2.5rem] shadow-xl hover:border-orange-500/20 transition-all group">
                <div className="flex justify-between items-start mb-6">
                  <div className={`w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center transition-transform group-hover:scale-110 ${kpi.color}`}>
                    <i className={`fas ${kpi.icon} text-xl`}></i>
                  </div>
                  <span className={`text-[9px] font-black px-3 py-1.5 rounded-full uppercase tracking-tighter ${kpi.trend.includes('+') ? 'text-green-500 bg-green-500/10' : 'text-gray-500 bg-white/5'}`}>
                    {kpi.trend}
                  </span>
                </div>
                <p className="text-[10px] font-black text-gray-600 uppercase tracking-[0.2em] mb-2">{kpi.label}</p>
                <h3 className={`text-3xl font-black text-white italic tracking-tighter ${isLoading && 'animate-pulse'}`}>
                  {kpi.value}
                </h3>
              </div>
            ))}
          </div>

          {/* GRAPHIQUE DE REVENUS REEL */}
          <div className="bg-[#0a0a0a] border border-white/5 rounded-[3rem] p-10 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/5 blur-[100px] pointer-events-none"></div>

            <div className="flex justify-between items-center mb-16 relative z-10">
              <div>
                <h3 className="font-black uppercase tracking-[0.2em] text-sm text-white italic">Évolution des revenus</h3>
                <p className="text-[10px] text-gray-600 font-bold uppercase tracking-widest mt-1">7 derniers jours d'activité</p>
              </div>
              <div className="flex items-center gap-4 bg-white/5 px-4 py-2 rounded-full border border-white/5">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-orange-500 shadow-[0_0_8px_rgba(249,115,22,0.6)]"></span>
                  <span className="text-[9px] text-gray-400 font-black uppercase tracking-widest italic">Live Feed</span>
                </div>
              </div>
            </div>
            
            <div className="h-72 flex items-end gap-3 md:gap-6 relative z-10">
              {chartData.map((val, i) => {
                // Calcul de la hauteur relative (basé sur le max de la semaine)
                const maxVal = Math.max(...chartData, 1);
                const heightPercentage = (val / maxVal) * 100;

                return (
                  <div key={i} className="flex-1 flex flex-col items-center gap-6 group">
                    <div className="w-full relative flex flex-col justify-end h-full">
                      <div 
                        style={{ height: `${heightPercentage}%` }} 
                        className="w-full bg-gradient-to-t from-orange-600/30 to-orange-500 rounded-2xl group-hover:to-white transition-all duration-700 shadow-[0_0_30px_rgba(249,115,22,0.05)] relative"
                      >
                        <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-white text-black text-[9px] font-black px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                          {val.toLocaleString('fr-FR')} F
                        </div>
                      </div>
                    </div>
                    <span className="text-[10px] text-gray-700 font-black uppercase tracking-tighter">J-{6-i}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </main>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #333; border-radius: 10px; }
      `}</style>
    </div>
  );
}