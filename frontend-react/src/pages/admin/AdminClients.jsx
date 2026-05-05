// ❌ Suppression de l'import Sidebar (déjà géré centralement par AdminLayout)

export default function AdminClients() {
  return (
    // Utilisation d'une structure légère, le fond et le positionnement sont gérés par le Layout
    <div className="w-full animate-in fade-in duration-700">
      
      <main className="p-4 md:p-10">
        <div className="max-w-7xl mx-auto">
          
          {/* Header XXL - Identité CarRent CI */}
          <header className="mb-12">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(249,115,22,0.8)]"></div>
              <span className="text-[10px] text-gray-500 font-black uppercase tracking-[0.4em]">CRM & Data Management</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter italic text-white">
              Répertoire <span className="text-orange-500">Clients</span>
            </h1>
            <p className="text-gray-500 text-xs font-bold uppercase tracking-widest mt-2 opacity-60">
              Base de données sécurisée des conducteurs premium
            </p>
          </header>

          {/* Empty State Sophistiqué */}
          <div className="relative group bg-[#0a0a0a] border border-white/5 rounded-[3rem] p-20 text-center border-dashed hover:border-orange-500/20 transition-all duration-500">
            {/* Effet de profondeur visuelle */}
            <div className="absolute inset-0 bg-gradient-to-b from-orange-500/[0.02] to-transparent pointer-events-none rounded-[3rem]"></div>
            
            <div className="relative z-10">
              <div className="w-24 h-24 bg-white/[0.03] border border-white/10 rounded-full flex items-center justify-center mx-auto mb-8 group-hover:scale-110 transition-transform duration-500">
                <i className="fas fa-users text-4xl text-gray-800 group-hover:text-orange-500 transition-colors"></i>
              </div>
              
              <h3 className="text-white font-black uppercase text-sm tracking-[0.2em] mb-3">
                Index Client Vide
              </h3>
              <p className="text-gray-600 font-bold text-[10px] uppercase tracking-widest max-w-xs mx-auto leading-relaxed">
                Aucun profil conducteur n'est actuellement enregistré dans le système. Les données clients seront synchronisées automatiquement après leur première réservation.
              </p>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}