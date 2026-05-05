import { Link, useLocation, useNavigate } from 'react-router-dom';

export default function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();

  // Gestion de la déconnexion avec nettoyage du localStorage
  const handleLogout = () => {
    if (window.confirm("Voulez-vous vraiment vous déconnecter de la console ?")) {
      localStorage.removeItem('adminToken');
      navigate('/admin/login');
    }
  };

  const menuItems = [
    { 
      name: "Flotte Automobile", 
      path: "/admin", 
      icon: "fa-car" 
    },
    { 
      name: "Réservations", 
      path: "/admin/reservations", 
      icon: "fa-calendar-check" 
    },
    { 
      name: "Clients", 
      path: "/admin/clients", 
      icon: "fa-users" 
    },
    { 
      name: "Codes Promo", 
      path: "/admin/promos", 
      icon: "fa-ticket-alt" 
    },
    { 
      name: "Statistiques", 
      path: "/admin/stats", 
      icon: "fa-chart-line" 
    }
  ];

  return (
    <aside className="w-64 border-r border-white/10 bg-black flex flex-col sticky top-0 h-screen z-40">
      
      {/* Branding XXL - Identité CarRent CI */}
      <div className="p-8">
        <Link to="/" className="group">
          <h2 className="text-xl font-black tracking-tighter text-orange-500 transition-transform group-hover:scale-105 uppercase">
            CARENT<span className="text-white">.CI</span>
          </h2>
          <div className="flex items-center gap-2 mt-1">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
            <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Système Actif</p>
          </div>
        </Link>
      </div>

      {/* --- BOUTON AJOUT RAPIDE (ACTION PRINCIPALE) --- */}
      {/* La navigation vers /admin?action=new permet d'ouvrir le modal via l'URL */}
      <div className="px-4 mb-8">
        <button 
          onClick={() => navigate('/admin?action=new')} 
          className="w-full bg-orange-500 text-black py-4 rounded-2xl font-black uppercase text-[10px] tracking-[0.2em] shadow-[0_0_20px_rgba(249,115,22,0.3)] hover:bg-white transition-all flex items-center justify-center gap-3 group active:scale-95"
        >
          <i className="fas fa-plus-circle text-sm group-hover:rotate-90 transition-transform"></i>
          Ajouter Véhicule
        </button>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-4 space-y-2">
        {menuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all duration-300 ${
              location.pathname === item.path
                ? "bg-white/5 text-orange-500 border border-orange-500/20 shadow-[0_0_20px_rgba(249,115,22,0.05)]"
                : "text-gray-500 hover:text-white hover:bg-white/5"
            }`}
          >
            <i className={`fas ${item.icon} w-5 text-center ${location.pathname === item.path ? "text-orange-500" : ""}`}></i>
            {item.name}
          </Link>
        ))}
      </nav>

      {/* Footer / User Profile & Logout */}
      <div className="p-4 border-t border-white/5">
        <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-4 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-orange-500/10 border border-orange-500/20 flex items-center justify-center">
              <i className="fas fa-user-shield text-orange-500 text-xs"></i>
            </div>
            <div className="overflow-hidden">
              <p className="text-[9px] text-gray-500 uppercase font-black tracking-tighter mb-0.5">Administrateur</p>
              <p className="text-[11px] font-bold text-white truncate uppercase">Super Admin</p>
            </div>
          </div>
        </div>
        
        <button 
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-[10px] font-black uppercase tracking-widest text-red-500 hover:bg-red-500/10 transition-all duration-300"
        >
          <i className="fas fa-sign-out-alt w-5 text-center"></i>
          Déconnexion
        </button>
      </div>
    </aside>
  );
}