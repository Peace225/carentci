import { useQuery } from "@tanstack/react-query";
import API_BASE_URL from "../../api/config";

/**
 * Logique de récupération sécurisée des statistiques.
 */
const fetchStats = async () => {
  const token = localStorage.getItem('adminToken');
  const response = await fetch(`${API_BASE_URL}/api/stats`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  
  if (!response.ok) throw new Error("Échec de la synchronisation des données");
  const result = await response.json();
  return result.success ? result.data : result;
};

export default function AdminStats() {
  // Synchronisation automatique toutes les 10 secondes
  const { data: stats, isLoading, isRefetching } = useQuery({
    queryKey: ["admin-stats"],
    queryFn: fetchStats,
    refetchInterval: 10000, 
    refetchOnWindowFocus: true
  });

  // Injection des KPIs avec fallback pour éviter les sauts d'interface
  const kpis = [
    { 
      label: "Chiffre d'Affaires", 
      value: stats?.totalRevenue ? `${stats.totalRevenue.toLocaleString('fr-FR')} F` : "0 F", 
      trend: stats?.revenueTrend || "+0%", 
      icon: "fa-wallet", 
      color: "text-green-500",
      bg: "bg-green-500/5"
    },
    { 
      label: "Taux d'Occupation", 
      value: stats?.occupancyRate ? `${stats.occupancyRate}%` : "0%", 
      trend: stats?.occupancyTrend || "+0%", 
      icon: "fa-chart-pie", 
      color: "text-blue-500",
      bg: "bg-blue-500/5"
    },
    { 
      label: "Nouveaux Clients", 
      value: stats?.newClientsCount || "0", 
      trend: stats?.clientsTrend || "+0%", 
      icon: "fa-user-plus", 
      color: "text-orange-500",
      bg: "bg-orange-500/5"
    },
    { 
      label: "Flotte en Service", 
      value: stats?.activeVehicles ? `${stats.activeVehicles}/${stats.totalVehicles || 0}` : "0/0", 
      trend: "LIVE", 
      icon: "fa-car", 
      color: "text-purple-500",
      bg: "bg-purple-500/5"
    }
  ];

  const chartData = stats?.revenueHistory || [0, 0, 0, 0, 0, 0, 0];
  const maxVal = Math.max(...chartData, 10000); // Seuil minimal pour l'échelle

  return (
    <div className="w-full animate-in fade-in slide-in-from-bottom-4 duration-1000">
      <main className="p-4 md:p-10">
        <div className="max-w-7xl mx-auto">
          
          {/* HEADER ANALYTICS XXL */}
          <header className="mb-16 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <div className={`w-2.5 h-2.5 rounded-full shadow-[0_0_15px_rgba(249,115,22,0.6)] ${isRefetching ? 'bg-blue-400 animate-ping' : 'bg-green-500 animate-pulse'}`}></div>
                <span className="text-[10px] text-gray-500 font-black uppercase tracking-[0.5em] italic">
                  {isRefetching ? "Mise à jour Cloud..." : "Flux de données Live"}
                </span>
              </div>
              <h1 className="text-5xl md:text-6xl font-black uppercase tracking-tighter italic text-white leading-none">
                Statistiques <span className="text-orange-500">Globales</span>
              </h1>
              <p className="text-gray-600 text-[11px] font-bold uppercase tracking-widest mt-4 opacity-80">
                Rapports financiers et opérationnels de CarRent CI • Abidjan
              </p>
            </div>

            <div className="bg-white/[0.02] border border-white/5 px-8 py-4 rounded-[2rem] flex items-center gap-4 backdrop-blur-xl">
              <div className="text-right">
                <p className="text-[9px] text-gray-600 uppercase font-black tracking-widest mb-1">Dernière Synchro</p>
                <p className="text-xs text-white font-mono font-bold tracking-tighter italic">
                  {new Date().toLocaleTimeString()}
                </p>
              </div>
              <div className={`w-10 h-10 rounded-xl border border-white/10 flex items-center justify-center ${isRefetching ? 'animate-spin border-t-orange-500' : ''}`}>
                <i className="fas fa-sync-alt text-[10px] text-gray-500"></i>
              </div>
            </div>
          </header>

          {/* KPI GRID */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {kpis.map((kpi, i) => (
              <div key={i} className="group relative bg-[#0a0a0a] border border-white/5 p-10 rounded-[3rem] shadow-2xl transition-all duration-700 hover:border-orange-500/30 hover:-translate-y-2 overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-white/[0.02] to-transparent pointer-events-none"></div>
                
                <div className="flex justify-between items-start mb-8 relative z-10">
                  <div className={`w-14 h-14 rounded-2xl ${kpi.bg} flex items-center justify-center transition-all duration-500 group-hover:scale-110 group-hover:shadow-[0_0_20px_rgba(249,115,22,0.1)] ${kpi.color}`}>
                    <i className={`fas ${kpi.icon} text-2xl`}></i>
                  </div>
                  <span className={`text-[10px] font-black px-4 py-2 rounded-full uppercase tracking-widest italic ${kpi.trend.includes('+') ? 'text-green-500 bg-green-500/10 border border-green-500/10' : 'text-gray-500 bg-white/5 border border-white/10'}`}>
                    {kpi.trend}
                  </span>
                </div>

                <p className="text-[10px] font-black text-gray-600 uppercase tracking-[0.3em] mb-3">{kpi.label}</p>
                <h3 className={`text-4xl font-black text-white italic tracking-tighter transition-all duration-500 ${isLoading ? 'opacity-20 blur-sm' : 'opacity-100 blur-0'}`}>
                  {kpi.value}
                </h3>
              </div>
            ))}
          </div>

          {/* BAR CHART XXL */}
          <div className="bg-[#0a0a0a] border border-white/5 rounded-[4rem] p-12 md:p-16 shadow-2xl relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-b from-orange-500/[0.02] to-transparent pointer-events-none"></div>

            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-20 relative z-10 gap-6">
              <div>
                <h3 className="font-black uppercase tracking-[0.3em] text-lg text-white italic">Flux de Trésorerie Semainier</h3>
                <p className="text-[11px] text-gray-600 font-bold uppercase tracking-[0.2em] mt-2 italic opacity-60">Volume des transactions • 7 derniers jours</p>
              </div>
              <div className="flex items-center gap-4 bg-white/[0.03] px-6 py-3 rounded-2xl border border-white/5 backdrop-blur-md">
                <span className="w-2.5 h-2.5 rounded-full bg-orange-500 shadow-[0_0_12px_rgba(249,115,22,0.8)] animate-pulse"></span>
                <span className="text-[10px] text-white font-black uppercase tracking-widest italic">Live Revenue Feed</span>
              </div>
            </div>
            
            <div className="h-96 flex items-end gap-4 md:gap-8 relative z-10">
              {chartData.map((val, i) => {
                const heightPercentage = (val / maxVal) * 100;

                return (
                  <div key={i} className="flex-1 flex flex-col items-center gap-8 group/bar h-full">
                    <div className="w-full relative flex flex-col justify-end h-full">
                      {/* Tooltip on hover */}
                      <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-white text-black text-[10px] font-black px-4 py-2 rounded-xl opacity-0 group-hover/bar:opacity-100 transition-all duration-500 transform translate-y-4 group-hover/bar:translate-y-0 shadow-2xl whitespace-nowrap z-20">
                        {val.toLocaleString('fr-FR')} FCFA
                      </div>
                      
                      {/* Bar */}
                      <div 
                        style={{ height: `${Math.max(heightPercentage, 5)}%` }} 
                        className="w-full bg-gradient-to-t from-orange-600/20 via-orange-500 to-orange-400 rounded-3xl group-hover/bar:to-white group-hover/bar:shadow-[0_0_40px_rgba(249,115,22,0.3)] transition-all duration-700 relative cursor-pointer"
                      >
                        <div className="absolute top-0 left-0 w-full h-full bg-white opacity-0 group-hover/bar:opacity-10 transition-opacity rounded-3xl"></div>
                      </div>
                    </div>
                    <span className="text-[11px] text-gray-700 font-black uppercase tracking-tighter italic group-hover/bar:text-orange-500 transition-colors">
                      {6-i === 0 ? "Aujourd'hui" : `J-${6-i}`}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </main>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #222; border-radius: 10px; }
      `}</style>
    </div>
  );
}