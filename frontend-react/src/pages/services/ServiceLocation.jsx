import { useEffect } from 'react'
import ServiceLayout from '../../components/ServiceLayout'
import { trackVisit } from '../../api/config'

export default function ServiceLocation() {
  useEffect(() => { trackVisit('service-location.html') }, [])

  const formulas = [
    { 
      icon: 'fa-key', 
      title: 'Liberté Absolue', 
      subtitle: 'Sans Chauffeur',
      desc: 'Prenez les commandes de nos véhicules d\'exception et profitez d\'une autonomie totale pour vos déplacements.', 
      img: 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=800',
      features: ['Liberté d\'itinéraire illimitée', 'Discrétion totale garantie', 'Véhicules de dernière génération', 'Assurance Premium incluse'] 
    },
    { 
      icon: 'fa-user-tie', 
      title: 'Sérénité Totale', 
      subtitle: 'Avec Chauffeur',
      desc: 'Laissez-vous conduire par nos experts de la route. Un service sur-mesure pour vos événements ou rendez-vous d\'affaires.', 
      img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800',
      features: ['Chauffeurs bilingues & courtois', 'Ponctualité rigoureuse', 'Gestion du stationnement & trafic', 'Service VIP & Conciergerie'] 
    },
  ];

  return (
    <ServiceLayout
      title={<>Expériences de <span className="bg-gradient-to-r from-orange-400 to-orange-600 bg-clip-text text-transparent">Conduite</span></>}
      subtitle="La flexibilité au service de votre exigence."
      icon="fa-car"
      image="https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=1200"
    >
      
      {/* SECTION 1 : LES FORMULES (EDITORIAL CARDS) */}
      <section className="relative py-20 px-6 overflow-hidden">
        {/* Glow de fond */}
        <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-orange-600/5 rounded-full blur-[120px] pointer-events-none" />

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-16 md:mb-24">
            <h2 className="text-[10px] font-bold tracking-[0.3em] uppercase text-orange-500 mb-4">Nos Formules</h2>
            <h3 className="text-3xl md:text-5xl font-black text-white tracking-tight">Choisissez votre <span className="text-orange-500 italic font-light">standing.</span></h3>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-16">
            {formulas.map((f, i) => (
              <div key={i} className="group relative bg-[#0a0a0a]/80 backdrop-blur-2xl rounded-[2.5rem] border border-white/10 overflow-hidden hover:border-orange-500/30 transition-all duration-700 shadow-2xl">
                
                {/* Image Section avec Overlay */}
                <div className="relative h-72 md:h-80 overflow-hidden">
                  <img src={f.img} alt={f.title} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent" />
                  <div className="absolute top-6 right-6">
                    <div className="bg-black/60 backdrop-blur-md border border-white/10 w-12 h-12 rounded-full flex items-center justify-center text-orange-500">
                      <i className={`fas ${f.icon} text-xl`} />
                    </div>
                  </div>
                </div>

                {/* Content Section */}
                <div className="p-8 md:p-12">
                  <p className="text-orange-500 text-[10px] font-bold uppercase tracking-[0.2em] mb-2">{f.subtitle}</p>
                  <h4 className="text-2xl md:text-4xl font-black text-white mb-6 tracking-tight">{f.title}</h4>
                  <p className="text-gray-400 font-light leading-relaxed mb-10 text-sm md:text-base">
                    {f.desc}
                  </p>

                  <ul className="space-y-4 mb-10">
                    {f.features.map((feat, j) => (
                      <li key={j} className="flex items-center gap-4 text-xs md:text-sm text-gray-300 font-medium">
                        <div className="w-5 h-5 rounded-full bg-orange-500/10 border border-orange-500/20 flex items-center justify-center flex-shrink-0">
                          <i className="fas fa-check text-orange-500 text-[8px]" />
                        </div>
                        {feat}
                      </li>
                    ))}
                  </ul>

                  <a href="#contact" className="inline-flex items-center gap-3 text-white text-[10px] font-bold uppercase tracking-widest group-hover:text-orange-500 transition-colors">
                    Réserver cette formule <i className="fas fa-arrow-right text-xs transition-transform group-hover:translate-x-2" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 2 : ENGAGEMENT QUALITÉ (MINIMALIST GRID) */}
      <section className="relative py-24 px-6 bg-white/[0.01] border-y border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-[10px] font-bold tracking-[0.3em] uppercase text-orange-500 mb-4">Standard d'excellence</h2>
            <h3 className="text-2xl md:text-4xl font-bold text-white">Pourquoi nous choisir</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-20">
            {[
              { icon: 'fa-shield-check', title: 'Sécurité Maximale', desc: 'Protocoles de désinfection et contrôles mécaniques avant chaque remise de clés.' },
              { icon: 'fa-badge-dollar', title: 'Tarification Claire', desc: 'Des tarifs premium transparents sans frais cachés pour une gestion simplifiée.' },
              { icon: 'fa-concierge-bell', title: 'Service 24/7', desc: 'Une assistance dédiée à votre disposition pour toute demande de dernière minute.' },
            ].map((a, i) => (
              <div key={i} className="text-center group">
                <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-orange-500 group-hover:border-orange-500 transition-all duration-500 shadow-xl">
                  <i className={`fas ${a.icon} text-2xl text-gray-400 group-hover:text-black transition-colors duration-500`} />
                </div>
                <h4 className="text-lg font-bold text-white mb-3 tracking-wide group-hover:text-orange-400 transition-colors">{a.title}</h4>
                <p className="text-gray-400 text-sm font-light leading-relaxed px-4">
                  {a.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CALL TO ACTION FINAL */}
      <section className="py-24 text-center px-6 overflow-hidden relative">
         {/* Ambient Glow */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-orange-600/10 rounded-full blur-[100px] pointer-events-none" />
        
        <div className="max-w-3xl mx-auto relative z-10">
          <h3 className="text-3xl md:text-5xl font-black text-white mb-8 tracking-tighter">Prêt pour un départ <br/><span className="text-orange-500 italic font-light">d'exception ?</span></h3>
          <p className="text-gray-400 font-light mb-12 max-w-lg mx-auto">Contactez notre conciergerie pour une offre personnalisée ou une réservation immédiate.</p>
          <div className="flex flex-wrap justify-center gap-6">
            <a href="https://wa.me/2250779562825" className="px-10 py-5 bg-orange-500 text-black font-black uppercase tracking-widest text-[10px] rounded-xl hover:bg-orange-400 transition-all shadow-[0_10px_40px_rgba(249,115,22,0.3)]">
               Réserver via WhatsApp
            </a>
            <a href="tel:+2250779562825" className="px-10 py-5 bg-white/5 border border-white/10 text-white font-black uppercase tracking-widest text-[10px] rounded-xl hover:bg-white/10 transition-all">
               Appeler l'Agence
            </a>
          </div>
        </div>
      </section>

    </ServiceLayout>
  )
}