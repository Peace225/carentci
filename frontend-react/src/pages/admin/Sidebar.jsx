import { Link, useLocation, useNavigate } from 'react-router-dom';

export default function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();

  // Gestion de la déconnexion
  const handleLogout = () => {
    if (window.confirm("Voulez-vous vraiment vous déconnecter de la console ?")) {
      localStorage.removeItem('adminToken');
      navigate('/admin/login');
    }
  };

  const menuItems = [
    { name: "Flotte", path: "/admin", icon: "fa-car" },
    { name: "Réservations", path: "/admin/reservations", icon: "fa-calendar-check" },
    { name: "Clients", path: "/admin/clients", icon: "fa-users" },
    { name: "Promos", path: "/admin/promos", icon: "fa-ticket-alt" },
    { name: "Stats", path: "/admin/stats", icon: "fa-chart-line" }
  ];

  return (
    <>
      {/* ========================================== */}
      {/* VERSION DESKTOP (Barre Latérale Gauche)    */}
      {/* ========================================== */}
      <aside className="hidden md:flex w-72 border-r border-white/5 bg-[#050505] flex-col sticky top-0 h-screen z-40">
        
        {/* Branding XXL */}
        <div className="p-10">
          <Link to="/" className="group block">
            <h2 className="text-2xl font-black tracking-tighter text-orange-500 transition-all group-hover:tracking-normal uppercase italic">
              CARENT<span className="text-white">.CI</span>
            </h2>
            <div className="flex items-center gap-2 mt-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
              </span>
              <p className="text-[9px] text-gray-600 uppercase tracking-[0.4em] font-black">Console Active</p>
            </div>
          </Link>
        </div>

        {/* Bouton Action Principale */}
        <div className="px-6 mb-10">
          <button 
            onClick={() => navigate('/admin?action=new')} 
            className="w-full bg-orange-500 hover:bg-white text-black py-4.5 rounded-2xl font-black uppercase text-[10px] tracking-[0.2em] shadow-[0_10px_30px_rgba(249,115,22,0.2)] transition-all duration-500 flex items-center justify-center gap-3 group active:scale-95"
          >
            <i className="fas fa-plus-circle text-sm group-hover:rotate-180 transition-transform duration-700"></i>
            Ajouter Véhicule
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 space-y-1.5">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`relative group w-full flex items-center gap-4 px-6 py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-500 ${
                  isActive
                    ? "bg-orange-500/5 text-orange-500 border border-orange-500/10 shadow-[0_0_25px_rgba(249,115,22,0.03)]"
                    : "text-gray-500 hover:text-white hover:bg-white/[0.02]"
                }`}
              >
                {isActive && (
                  <div className="absolute left-0 w-1 h-6 bg-orange-500 rounded-full shadow-[0_0_15px_rgba(249,115,22,0.8)]"></div>
                )}
                <i className={`fas ${item.icon} text-sm transition-all duration-500 ${isActive ? "text-orange-500 scale-110" : "group-hover:text-white"}`}></i>
                <span className="flex-1">{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Profil & Logout */}
        <div className="p-6 mt-auto">
          <div className="bg-white/[0.02] border border-white/5 rounded-[2rem] p-5 mb-4 backdrop-blur-md">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-orange-700 flex items-center justify-center shadow-lg">
                <i className="fas fa-user-shield text-black text-sm"></i>
              </div>
              <div className="min-w-0">
                <p className="text-[8px] text-orange-500/50 uppercase font-black tracking-widest mb-0.5">Autorisé</p>
                <p className="text-[11px] font-black text-white truncate uppercase italic tracking-tighter">Admin Principal</p>
              </div>
            </div>
          </div>
          <button 
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-3 py-4 rounded-xl text-[10px] font-black uppercase tracking-[0.3em] text-red-500/60 hover:text-red-500 hover:bg-red-500/5 transition-all duration-500 border border-transparent hover:border-red-500/10"
          >
            <i className="fas fa-power-off text-xs"></i>
            Déconnexion
          </button>
        </div>
      </aside>

      {/* ========================================== */}
      {/* VERSION MOBILE (Barre de navigation en bas)*/}
      {/* ========================================== */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#0a0a0a]/90 backdrop-blur-xl border-t border-white/10 px-6 py-4 pb-safe flex justify-between items-center shadow-[0_-10px_40px_rgba(0,0,0,0.5)]">
        
        {menuItems.slice(0, 4).map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center gap-1.5 transition-all duration-300 ${
                isActive ? "text-orange-500" : "text-gray-500 hover:text-white"
              }`}
            >
              <div className={`p-2 rounded-xl transition-all duration-300 ${isActive ? 'bg-orange-500/10' : ''}`}>
                <i className={`fas ${item.icon} text-lg ${isActive ? 'scale-110' : ''}`}></i>
              </div>
              {/* Petit point indicateur sous l'icône active (style iOS) */}
              <div className={`w-1 h-1 rounded-full transition-all duration-300 ${isActive ? 'bg-orange-500' : 'bg-transparent'}`}></div>
            </Link>
          );
        })}

        {/* Bouton Menu / Profil / Logout pour mobile */}
        <button 
          onClick={handleLogout}
          className="flex flex-col items-center gap-1.5 text-gray-500 hover:text-red-500 transition-colors"
        >
          <div className="p-2 rounded-xl">
            <i className="fas fa-power-off text-lg"></i>
          </div>
          <div className="w-1 h-1 rounded-full bg-transparent"></div>
        </button>

        {/* Bouton flottant "Ajouter Véhicule" (Fab Button) pour Mobile */}
        {location.pathname === '/admin' && (
          <button 
            onClick={() => navigate('/admin?action=new')}
            className="absolute -top-14 right-6 w-14 h-14 bg-orange-500 text-black rounded-full shadow-[0_10px_25px_rgba(249,115,22,0.4)] flex items-center justify-center text-xl font-black active:scale-90 transition-transform"
          >
            <i className="fas fa-plus"></i>
          </button>
        )}
      </nav>

      {/* ⚠️ IMPORTANT : Ajoute ce padding en bas de ton conteneur principal (AdminLayout) sur mobile 
        pour que le contenu ne soit pas caché par la nouvelle barre du bas.
        Ex: className="pb-24 md:pb-0" 
      */}
    </>
  );
}