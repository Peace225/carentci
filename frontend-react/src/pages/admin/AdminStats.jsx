import Sidebar from "./Sidebar";

export default function AdminStats() {
  const kpis = [
    { label: "Chiffre d'Affaires", value: "2.450.000 F", trend: "+12%", icon: "fa-wallet", color: "text-green-500" },
    { label: "Taux d'Occupation", value: "85%", trend: "+5%", icon: "fa-chart-pie", color: "text-blue-500" },
    { label: "Nouveaux Clients", value: "24", trend: "+18%", icon: "fa-user-plus", color: "text-orange-500" },
    { label: "Véhicules en Service", value: "12/15", trend: "Stable", icon: "fa-car", color: "text-purple-500" }
  ];

  return (
    <div className="flex min-h-screen bg-[#050505] text-white font-sans">
      <Sidebar />
      <main className="flex-1 p-6 md:p-10">
        <div className="max-w-7xl mx-auto">
          <header className="mb-10">
            <h1 className="text-3xl font-black uppercase tracking-tighter">
              Analyse des <span className="text-orange-500">Performances</span>
            </h1>
            <p className="text-gray-500 text-[10px] font-black uppercase tracking-[0.3em] mt-1">Rapports financiers et opérationnels</p>
          </header>

          {/* KPI Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
            {kpis.map((kpi, i) => (
              <div key={i} className="bg-[#0a0a0a] border border-white/5 p-6 rounded-[2rem] shadow-xl hover:border-orange-500/20 transition-all">
                <div className="flex justify-between items-start mb-4">
                  <div className={`w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center ${kpi.color}`}>
                    <i className={`fas ${kpi.icon}`}></i>
                  </div>
                  <span className="text-[10px] font-black text-green-500 bg-green-500/10 px-2 py-1 rounded-lg">{kpi.trend}</span>
                </div>
                <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">{kpi.label}</p>
                <h3 className="text-2xl font-black text-white">{kpi.value}</h3>
              </div>
            ))}
          </div>

          {/* Graphique de démo (Placeholder visuel) */}
          <div className="bg-[#0a0a0a] border border-white/5 rounded-[2.5rem] p-10 shadow-2xl">
            <div className="flex justify-between items-center mb-10">
              <h3 className="font-black uppercase tracking-widest text-sm">Évolution des revenus (7 derniers jours)</h3>
              <div className="flex gap-2">
                <span className="w-3 h-3 rounded-full bg-orange-500"></span>
                <span className="text-[10px] text-gray-500 font-black uppercase">Location</span>
              </div>
            </div>
            
            <div className="h-64 flex items-end gap-4">
              {[40, 70, 45, 90, 65, 80, 100].map((h, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-4 group">
                  <div 
                    style={{ height: `${h}%` }} 
                    className="w-full bg-gradient-to-t from-orange-600/20 to-orange-500 rounded-t-xl group-hover:to-white transition-all duration-500 shadow-[0_0_20px_rgba(249,115,22,0.1)]"
                  ></div>
                  <span className="text-[10px] text-gray-600 font-bold">J-{6-i}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}