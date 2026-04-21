export default function ServicesSection() {
  const services = [
    {
      icon: "fa-car-side",
      title: "Location Sur-Mesure",
      desc: "Avec ou sans chauffeur, profitez d'une flexibilité totale pour vos déplacements professionnels ou personnels.",
      link: "/service-location"
    },
    {
      icon: "fa-clock",
      title: "Conciergerie 24/7",
      desc: "Une assistance dédiée disponible de jour comme de nuit pour répondre à la moindre de vos exigences.",
      link: "/service-disponibilite"
    },
    {
      icon: "fa-map-marked-alt",
      title: "Livraison VIP",
      desc: "Votre véhicule livré exactement où vous le désirez, à l'heure précise, partout en Côte d'Ivoire.",
      link: "/service-livraison"
    },
    {
      icon: "fa-cogs",
      title: "Entretien Chirurgical",
      desc: "Une flotte rigoureusement inspectée et maintenue par nos experts pour une fiabilité absolue.",
      link: "/service-maintenance"
    },
    {
      icon: "fa-headset",
      title: "Support Exclusif",
      desc: "Un chargé de clientèle unique vous accompagne de la réservation jusqu'à la restitution du véhicule.",
      link: "/service-support"
    },
    {
      icon: "fa-shield-alt",
      title: "Assurance Premium",
      desc: "Une couverture tous risques exhaustive pour une tranquillité d'esprit totale lors de vos trajets.",
      link: "/service-assurance"
    }
  ];

  return (
    <section id="services" className="relative py-16 md:py-24 px-4 bg-[#050505] overflow-hidden">
      {/* Background Glow Effects */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 w-64 md:w-96 h-64 md:h-96 bg-orange-600/5 rounded-full blur-[80px] md:blur-[100px] pointer-events-none" />
      <div className="absolute top-0 right-0 w-[300px] md:w-[500px] h-[300px] md:h-[500px] bg-white/5 rounded-full blur-[100px] md:blur-[120px] pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto">
        
        {/* En-tête de section */}
        <div className="text-center mb-12 md:mb-20">
          <div className="inline-flex items-center gap-2 px-3 md:px-4 py-1.5 md:py-2 rounded-full bg-orange-500/10 border border-orange-500/20 mb-4 md:mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-orange-500 shadow-[0_0_10px_rgba(249,115,22,1)] animate-pulse"></span>
            <span className="text-orange-500 text-[10px] md:text-xs font-bold tracking-widest uppercase">Prestations</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black mb-4 md:mb-6 text-white tracking-tight">
            Services <span className="bg-gradient-to-r from-orange-400 to-orange-600 bg-clip-text text-transparent">Premium</span>
          </h2>
          <p className="text-sm md:text-base lg:text-lg text-gray-400 max-w-2xl mx-auto font-light leading-relaxed">
            Au-delà du véhicule, nous vous offrons une expérience complète. Découvrez nos services pensés pour répondre à vos exigences les plus élevées.
          </p>
        </div>

        {/* Grille de Services */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6 lg:gap-8">
          {services.map((s, i) => (
            <a 
              key={i} 
              href={s.link} 
              className="group relative p-6 md:p-8 rounded-2xl md:rounded-[2rem] bg-white/[0.02] border border-white/5 backdrop-blur-md overflow-hidden hover:bg-white/[0.04] transition-all duration-500 block h-full flex flex-col"
            >
              {/* Effet de lueur au survol (Glow) */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 md:w-32 h-1 bg-gradient-to-r from-transparent via-orange-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 shadow-[0_0_20px_rgba(249,115,22,0.5)]" />
              
              {/* Icône Container */}
              <div className="w-12 h-12 md:w-16 md:h-16 rounded-xl md:rounded-2xl bg-gradient-to-br from-white/5 to-white/[0.01] border border-white/10 flex items-center justify-center mb-5 md:mb-6 group-hover:border-orange-500/30 group-hover:bg-orange-500/10 transition-all duration-500">
                <i className={`fas ${s.icon} text-xl md:text-2xl text-gray-400 group-hover:text-orange-500 transition-colors duration-500`} />
              </div>

              {/* Contenu */}
              <h3 className="text-lg md:text-xl font-bold text-white mb-2 md:mb-3 tracking-wide">{s.title}</h3>
              <p className="text-gray-400 font-light leading-relaxed text-xs md:text-sm mb-12 md:mb-16 flex-grow">
                {s.desc}
              </p>

              {/* Lien "En savoir plus" stylisé */}
              <div className="absolute bottom-6 md:bottom-8 left-6 md:left-8 right-6 md:right-8 flex items-center justify-between opacity-60 group-hover:opacity-100 transition-opacity duration-300">
                <span className="text-orange-500 text-[10px] md:text-xs font-bold uppercase tracking-widest">
                  Découvrir
                </span>
                <div className="w-6 h-6 md:w-8 md:h-8 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-orange-500 group-hover:text-black text-white transition-all duration-300">
                  <i className="fas fa-arrow-right text-[10px] md:text-sm -rotate-45 group-hover:rotate-0 transition-transform duration-300" />
                </div>
              </div>
            </a>
          ))}
        </div>

      </div>
    </section>
  );
}