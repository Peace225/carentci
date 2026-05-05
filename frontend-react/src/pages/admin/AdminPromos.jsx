// ❌ L'import Sidebar est supprimé car géré par AdminLayout

export default function AdminPromos() {
  return (
    // Structure légère : le Layout parent fournit déjà le flex et le fond sombre
    <div className="w-full animate-in fade-in duration-700">
      
      <main className="p-4 md:p-10">
        <div className="max-w-7xl mx-auto">
          
          {/* HEADER PREMIUM AVEC CTA */}
          <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(249,115,22,0.8)]"></div>
                <span className="text-[10px] text-gray-500 font-black uppercase tracking-[0.4em]">Growth & Conversion</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter italic text-white">
                Marketing <span className="text-orange-500">& Promos</span>
              </h1>
              <p className="text-gray-500 text-xs font-bold uppercase tracking-widest mt-2 opacity-60">
                Configuration des coupons de réduction et offres spéciales
              </p>
            </div>

            <button className="group relative bg-white text-black px-8 py-4 rounded-2xl font-black uppercase text-[11px] tracking-[0.2em] shadow-xl hover:bg-orange-500 hover:text-black transition-all duration-300 active:scale-95">
              <span className="relative z-10 flex items-center gap-3">
                <i className="fas fa-plus-circle transition-transform group-hover:rotate-90"></i>
                Créer un code
              </span>
            </button>
          </header>

          {/* EMPTY STATE - DESIGN XXL DASHED */}
          <div className="relative group bg-[#0a0a0a] border border-white/5 rounded-[3rem] p-24 text-center border-dashed hover:border-orange-500/20 transition-all duration-500 overflow-hidden">
            {/* Effet de halo interne */}
            <div className="absolute inset-0 bg-gradient-to-b from-orange-500/[0.03] to-transparent pointer-events-none"></div>
            
            <div className="relative z-10">
              <div className="w-24 h-24 bg-white/[0.03] border border-white/10 rounded-full flex items-center justify-center mx-auto mb-8 group-hover:scale-110 group-hover:border-orange-500/30 transition-all duration-500">
                <i className="fas fa-ticket-alt text-4xl text-gray-800 group-hover:text-orange-500 transition-colors"></i>
              </div>
              
              <h3 className="text-white font-black uppercase text-sm tracking-[0.3em] mb-3 italic">
                Campagne Inactive
              </h3>
              <p className="text-gray-600 font-bold text-[10px] uppercase tracking-widest max-w-sm mx-auto leading-relaxed">
                Aucun coupon de réduction n'est actuellement déployé sur la plateforme. Utilisez le bouton ci-dessus pour lancer une nouvelle offre.
              </p>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}