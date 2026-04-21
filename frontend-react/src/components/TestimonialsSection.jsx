export default function TestimonialsSection() {
  const testimonials = [
    {
      initials: "AK",
      name: "Adjoua Kouassi",
      since: "Cliente vérifiée • 2024",
      text: "Un service d'une perfection rare. J'ai loué un SUV de luxe pour mon mariage et chaque détail, de la ponctualité à l'état clinique du véhicule, était irréprochable.",
      model: "Range Rover Sport",
      theme: {
        border: "hover:border-amber-500/40",
        quote: "group-hover:text-amber-500/10",
        avatarBg: "from-amber-500 to-orange-600",
        avatarGlow: "bg-amber-500",
        tagBorder: "border-amber-500/30",
        tagText: "text-amber-400",
        icon: "text-amber-500"
      }
    },
    {
      initials: "KY",
      name: "Kouamé Yao",
      since: "Client VIP • 2023",
      text: "L'excellence à l'état pur. L'équipe fait preuve d'un professionnalisme absolu. C'est aujourd'hui mon unique partenaire pour mes déplacements d'affaires.",
      model: "Mercedes Classe S",
      theme: {
        border: "hover:border-blue-500/40",
        quote: "group-hover:text-blue-500/10",
        avatarBg: "from-blue-500 to-indigo-600",
        avatarGlow: "bg-blue-500",
        tagBorder: "border-blue-500/30",
        tagText: "text-blue-400",
        icon: "text-blue-500"
      }
    },
    {
      initials: "MT",
      name: "Marie Traoré",
      since: "Cliente vérifiée • 2024",
      text: "Une conciergerie automobile de très haut niveau. Disponibles 24/7, ils ont su anticiper mes besoins avec une réactivité et une courtoisie exceptionnelles.",
      model: "BMW X6",
      theme: {
        border: "hover:border-emerald-500/40",
        quote: "group-hover:text-emerald-500/10",
        avatarBg: "from-emerald-500 to-teal-600",
        avatarGlow: "bg-emerald-500",
        tagBorder: "border-emerald-500/30",
        tagText: "text-emerald-400",
        icon: "text-emerald-500"
      }
    },
  ];

  const stats = [
    { v: "1000+", l: "Clients Privilèges", color: "from-orange-400 to-amber-500" },
    { v: "4.9/5", l: "Note d'Excellence", color: "from-amber-300 to-yellow-500" },
    { v: "98%", l: "Taux de Fidélité", color: "from-emerald-400 to-teal-500" },
    { v: "24/7", l: "Assistance VIP", color: "from-blue-400 to-indigo-500" }
  ];

  return (
    <section id="temoignages" className="relative py-16 md:py-24 px-4 bg-[#050505] overflow-hidden">
      {/* Éclairage d'ambiance luxueux (Ambient Lights) - Tailles réduites sur mobile */}
      <div className="absolute bottom-[-10%] right-[-5%] w-[300px] md:w-[600px] h-[300px] md:h-[600px] bg-amber-600/10 rounded-full blur-[100px] md:blur-[150px] pointer-events-none" />
      <div className="absolute top-[10%] left-[-5%] w-[300px] md:w-[500px] h-[300px] md:h-[500px] bg-indigo-600/10 rounded-full blur-[80px] md:blur-[120px] pointer-events-none" />
      <div className="absolute top-[40%] left-[40%] w-[200px] md:w-[300px] h-[200px] md:h-[300px] bg-emerald-600/5 rounded-full blur-[60px] md:blur-[100px] pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto">
        
        {/* En-tête de section */}
        <div className="text-center mb-12 md:mb-20">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 md:px-4 md:py-2 rounded-full bg-white/5 border border-white/10 mb-4 md:mb-6 backdrop-blur-md">
            <span className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-orange-400 to-pink-500 shadow-[0_0_10px_rgba(249,115,22,0.8)] animate-pulse"></span>
            <span className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent text-[10px] md:text-xs font-bold tracking-widest uppercase">Livre d'Or</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black mb-4 md:mb-6 text-white tracking-tight">
            L'Écho de <span className="bg-gradient-to-r from-orange-400 via-amber-500 to-orange-600 bg-clip-text text-transparent">l'Excellence</span>
          </h2>
          <p className="text-sm md:text-base lg:text-lg text-gray-400 max-w-2xl mx-auto font-light leading-relaxed">
            La confiance de nos clients est notre plus grande réussite. Découvrez les retours d'expérience de ceux qui exigent le meilleur.
          </p>
        </div>

        {/* Grille des Témoignages : Scroll horizontal sur mobile, Grid sur desktop */}
        <div className="flex overflow-x-auto pb-8 mb-8 md:mb-16 -mx-4 px-4 md:mx-0 md:px-0 snap-x snap-mandatory md:grid md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-8 custom-scrollbar hide-scrollbar-mobile">
          {testimonials.map((t, i) => (
            <div key={i} className={`flex-none w-[85%] sm:w-[70%] md:w-auto snap-center flex flex-col group relative p-6 md:p-8 rounded-2xl md:rounded-[2rem] bg-white/[0.02] border border-white/5 backdrop-blur-md ${t.theme.border} transition-all duration-500 overflow-hidden`}>
              
              {/* Reflet coloré au fond de la carte */}
              <div className={`absolute -bottom-20 -right-20 w-32 md:w-40 h-32 md:h-40 ${t.theme.avatarGlow} rounded-full blur-[60px] md:blur-[80px] opacity-0 group-hover:opacity-20 transition-opacity duration-700 pointer-events-none`} />

              {/* Filigrane Guillemets XXL coloré */}
              <i className={`fas fa-quote-right absolute top-4 md:top-6 right-6 md:right-8 text-5xl md:text-7xl text-white/[0.02] ${t.theme.quote} transition-colors duration-500 pointer-events-none`} />

              {/* Étoiles aux couleurs adaptatives */}
              <div className="flex items-center gap-1 md:gap-1.5 mb-6 md:mb-8 relative z-10">
                {[1, 2, 3, 4, 5].map(j => (
                  <i key={j} className={`fas fa-star ${t.theme.icon} text-xs md:text-sm opacity-80 group-hover:opacity-100 transition-opacity`} />
                ))}
              </div>

              {/* Contenu du témoignage */}
              <p className="text-gray-300 text-sm md:text-base leading-relaxed mb-8 md:mb-10 font-light italic relative z-10 flex-grow">
                "{t.text}"
              </p>

              {/* Footer de la carte (Client info) */}
              <div className="flex items-center gap-3 md:gap-4 mt-auto border-t border-white/5 pt-5 md:pt-6 relative z-10">
                <div className="relative flex-shrink-0">
                  <div className={`absolute inset-0 ${t.theme.avatarGlow} rounded-full blur-md opacity-20 group-hover:opacity-60 transition-opacity duration-500`} />
                  <div className={`relative w-10 h-10 md:w-12 md:h-12 rounded-full bg-gradient-to-br ${t.theme.avatarBg} border border-white/20 flex items-center justify-center font-black text-white text-sm tracking-wider shadow-lg`}>
                    {t.initials}
                  </div>
                </div>
                <div className="overflow-hidden">
                  <p className="font-bold text-white text-xs md:text-sm tracking-wide truncate">{t.name}</p>
                  <p className="text-gray-500 text-[10px] md:text-xs font-semibold mt-0.5 md:mt-1 flex items-center gap-1.5 truncate">
                    <i className={`fas fa-shield-check ${t.theme.icon} opacity-80 flex-shrink-0`} /> {t.since}
                  </p>
                </div>
              </div>

              {/* Tag du véhicule loué coloré (Visible sur Desktop au survol, Toujours visible & statique sur Mobile) */}
              <div className="absolute top-4 md:top-0 right-4 md:right-8 md:-translate-y-1/2 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-all duration-500 transform md:translate-y-4 md:group-hover:-translate-y-1/2 z-20">
                <span className={`bg-[#0a0a0a] border ${t.theme.tagBorder} ${t.theme.tagText} text-[8px] md:text-[10px] font-bold uppercase tracking-widest px-2 md:px-3 py-1 md:py-1.5 rounded-full shadow-2xl block`}>
                  {t.model}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Panneau Unifié des Statistiques avec dégradés métallisés */}
        <div className="relative p-0.5 md:p-1 rounded-[1.5rem] md:rounded-[2rem] bg-gradient-to-r from-white/5 via-white/10 to-white/5">
          <div className="bg-[#0a0a0a]/90 backdrop-blur-2xl rounded-[1.4rem] md:rounded-[1.8rem] p-6 md:p-12 shadow-2xl border border-black">
            
            {/* Grille 2x2 sur Mobile, 4 colonnes sur Desktop */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-y-6 gap-x-4 md:gap-0 md:divide-x divide-white/5">
              {stats.map((s, i) => (
                <div key={i} className={`text-center group flex flex-col justify-center
                  ${i < 2 ? 'mb-6 pb-6 md:mb-0 md:pb-0 border-b md:border-b-0 border-white/5' : ''} 
                  ${i % 2 === 0 ? 'pr-4 border-r md:border-r-0 border-white/5' : 'pl-4'} 
                  md:px-4 md:border-none`}>
                  <p className={`text-2xl sm:text-3xl lg:text-5xl font-black bg-gradient-to-br ${s.color} bg-clip-text text-transparent mb-1.5 md:mb-3 group-hover:scale-105 md:group-hover:scale-110 transition-transform duration-500`}>
                    {s.v}
                  </p>
                  <p className="text-gray-400 text-[9px] md:text-xs uppercase tracking-widest font-semibold group-hover:text-white transition-colors">
                    {s.l}
                  </p>
                </div>
              ))}
            </div>
            
          </div>
        </div>

      </div>

      {/* CSS pour cacher la barre de défilement sur mobile */}
      <style dangerouslySetInnerHTML={{__html: `
        .hide-scrollbar-mobile::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar-mobile {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}} />
    </section>
  );
}