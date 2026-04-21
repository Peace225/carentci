import { useEffect } from 'react'
import ServiceLayout from '../../components/ServiceLayout'
import { trackVisit } from '../../api/config'

export default function ServiceMaintenance() {
  useEffect(() => { trackVisit('service-maintenance.html') }, [])

  const programs = [
    { 
      icon: 'fa-microchip', 
      title: 'Diagnostic Avancé', 
      desc: 'Chaque véhicule est soumis à un scan électronique complet après chaque mission pour détecter la moindre anomalie.' 
    },
    { 
      icon: 'fa-oil-can', 
      title: 'Standard Constructeur', 
      desc: 'Nous utilisons exclusivement des pièces d’origine et des fluides premium recommandés par les marques les plus prestigieuses.' 
    },
  ];

  return (
    <ServiceLayout
      title={<>Entretien <span className="bg-gradient-to-r from-orange-400 to-orange-600 bg-clip-text text-transparent">Chirurgical</span></>}
      subtitle="La performance de nos véhicules est le socle de votre sécurité."
      icon="fa-tools"
      image="https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=1200"
    >
      
      {/* SECTION 1 : PROGRAMME (DUAL CARDS XXL) */}
      <section className="relative py-20 px-6 overflow-hidden">
        {/* Glow de fond */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-orange-600/5 rounded-full blur-[120px] pointer-events-none" />

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-16 md:mb-24">
            <h2 className="text-[10px] font-bold tracking-[0.3em] uppercase text-orange-500 mb-4">Ingénierie</h2>
            <h3 className="text-3xl md:text-5xl font-black text-white tracking-tight">Un Programme de <span className="text-orange-500 italic font-light">Précision.</span></h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
            {programs.map((m, i) => (
              <div key={i} className="group relative p-10 rounded-[2.5rem] bg-white/[0.02] border border-white/5 backdrop-blur-md hover:bg-white/[0.04] hover:border-orange-500/30 transition-all duration-500">
                <div className="absolute -inset-px bg-gradient-to-b from-orange-500/10 to-transparent rounded-[2.5rem] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                <div className="w-16 h-16 rounded-2xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-500">
                  <i className={`fas ${m.icon} text-orange-500 text-3xl`} />
                </div>
                
                <h4 className="text-2xl font-bold text-white mb-4 tracking-wide group-hover:text-orange-400 transition-colors">{m.title}</h4>
                <p className="text-gray-400 font-light leading-relaxed text-sm md:text-base">
                  {m.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 2 : STANDARDS (EDITORIAL SPLIT) */}
      <section className="relative py-24 px-6 bg-white/[0.01] border-y border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-12 gap-16 items-center">
            
            <div className="lg:col-span-6 relative group order-2 lg:order-1">
              <div className="absolute -inset-4 bg-orange-500/10 rounded-[2.5rem] blur-2xl group-hover:bg-orange-500/20 transition-all duration-700" />
              <div className="relative rounded-[2rem] overflow-hidden border border-white/10 shadow-2xl">
                <img 
                  src="https://images.unsplash.com/photo-1625047509168-a7026f36de04?w=800" 
                  alt="Atelier de maintenance" 
                  className="w-full h-[500px] object-cover scale-105 group-hover:scale-100 transition-transform duration-1000" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent opacity-80" />
              </div>
            </div>

            <div className="lg:col-span-6 space-y-10 order-1 lg:order-2">
              <div>
                <h2 className="text-[10px] font-bold tracking-[0.3em] uppercase text-orange-500 mb-4">Qualité Certifiée</h2>
                <h3 className="text-3xl md:text-5xl font-black text-white tracking-tight leading-[1.1]">
                  L'Art de <br/>
                  <span className="text-orange-500 italic font-light">la Perfection.</span>
                </h3>
              </div>

              <div className="space-y-8">
                {[
                  { icon: 'fa-certificate', title: 'Contrôle en 120 Points', desc: 'Une inspection exhaustive touchant à la sécurité, à la mécanique et à l’esthétique.' },
                  { icon: 'fa-pump-soap', title: 'Spa Automobile', desc: 'Nettoyage cryogénique et désinfection totale de l’habitacle après chaque utilisation.' },
                  { icon: 'fa-clipboard-check', title: 'Carnet de Bord Digital', desc: 'Traçabilité complète des interventions accessible pour chaque véhicule de notre flotte.' },
                ].map((s, i) => (
                  <div key={i} className="group flex items-start gap-6">
                    <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center flex-shrink-0 group-hover:bg-orange-500 group-hover:text-black transition-all duration-500 text-orange-500">
                      <i className={`fas ${s.icon} text-lg`} />
                    </div>
                    <div>
                      <h4 className="text-lg font-bold text-white mb-1 tracking-wide group-hover:text-orange-400 transition-colors">{s.title}</h4>
                      <p className="text-gray-400 text-sm font-light leading-relaxed">{s.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* SECTION 3 : GARANTIES (HORIZONTAL SLEEK BAR) */}
      <section className="py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
             <h2 className="text-[10px] font-bold tracking-[0.3em] uppercase text-orange-500 mb-4">Nos Garanties</h2>
             <h3 className="text-3xl font-bold text-white tracking-tighter">Zéro Défaut, Zéro Compromis</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { icon: 'fa-calendar-star', title: 'Flotte de -24 Mois' },
              { icon: 'fa-tachometer-alt-average', title: 'Kilométrage Maîtrisé' },
              { icon: 'fa-file-shield', title: 'Historique Limpide' },
            ].map((g, i) => (
              <div key={i} className="group flex flex-col items-center p-8 rounded-3xl bg-white/[0.02] border border-white/10 hover:border-orange-500/30 transition-all duration-300 text-center">
                <i className={`fas ${g.icon} text-orange-500/40 text-3xl mb-4 group-hover:text-orange-500 group-hover:scale-110 transition-all duration-500`} />
                <h3 className="text-sm md:text-base font-bold text-white uppercase tracking-widest">{g.title}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CALL TO ACTION */}
      <section className="pb-24 px-6 text-center">
        <div className="max-w-3xl mx-auto p-12 rounded-[3rem] bg-gradient-to-b from-white/[0.03] to-transparent border border-white/5 backdrop-blur-sm">
          <p className="text-gray-400 font-light mb-8">
            Vous souhaitez plus de détails sur le suivi technique d'un véhicule spécifique ?
          </p>
          <a href="https://wa.me/2250779562825" className="inline-flex items-center gap-3 px-10 py-4 bg-orange-500 text-black font-black uppercase tracking-widest text-[10px] rounded-xl hover:bg-orange-400 transition-all shadow-[0_10px_30px_rgba(249,115,22,0.3)]">
             Consulter nos experts <i className="fas fa-headset" />
          </a>
        </div>
      </section>

    </ServiceLayout>
  )
}