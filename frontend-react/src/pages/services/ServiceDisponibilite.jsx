import { useEffect } from 'react'
import ServiceLayout from '../../components/ServiceLayout'
import { trackVisit } from '../../api/config'

export default function ServiceDisponibilite() {
  useEffect(() => { trackVisit('service-disponibilite.html') }, [])

  const contactFeatures = [
    { icon: 'fa-phone-plus', title: 'Ligne Prioritaire', desc: 'Une assistance vocale directe pour une réactivité immédiate sans attente.' },
    { icon: 'fab fa-whatsapp', title: 'Conciergerie Digitale', desc: 'Échangez en temps réel avec nos conseillers via notre canal WhatsApp sécurisé.' },
    { icon: 'fa-headset', title: 'Gestionnaire Dédié', desc: 'Un interlocuteur unique pour orchestrer vos réservations et imprévus.' },
  ];

  return (
    <ServiceLayout
      title={<>Disponibilité <span className="bg-gradient-to-r from-orange-400 to-orange-600 bg-clip-text text-transparent">Sans Limite</span></>}
      subtitle="Le luxe n'attend pas. Notre équipe non plus."
      icon="fa-clock"
      image="https://res.cloudinary.com/dev2r1wlo/image/upload/v1774827635/carentci/static/plateau3.jpg"
    >
      
      {/* SECTION 1 : ENGAGEMENT (EDITORIAL SPLIT) */}
      <section className="relative py-20 md:py-24 px-6 overflow-hidden">
        {/* Glow de fond */}
        <div className="absolute top-1/2 left-0 -translate-y-1/2 w-[500px] h-[500px] bg-orange-600/5 rounded-full blur-[120px] pointer-events-none" />

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid lg:grid-cols-12 gap-16 items-center">
            
            {/* Image avec cadre Premium */}
            <div className="lg:col-span-6 relative group order-2 lg:order-1">
              <div className="absolute -inset-4 bg-orange-500/10 rounded-[2.5rem] blur-2xl group-hover:bg-orange-500/20 transition-all duration-700" />
              <div className="relative rounded-[2rem] overflow-hidden border border-white/10 shadow-2xl aspect-[4/3] lg:aspect-auto lg:h-[550px]">
                <img 
                  src="https://res.cloudinary.com/dev2r1wlo/image/upload/v1774827636/carentci/static/telechargement2.jpg" 
                  alt="Service Client Premium" 
                  className="w-full h-full object-cover scale-105 group-hover:scale-100 transition-transform duration-1000" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent opacity-60" />
              </div>
            </div>

            {/* Contenu Texte */}
            <div className="lg:col-span-6 space-y-10 order-1 lg:order-2">
              <div>
                <h2 className="text-[10px] font-bold tracking-[0.3em] uppercase text-orange-500 mb-4">Support & Réactivité</h2>
                <h3 className="text-3xl md:text-5xl font-black text-white tracking-tight leading-[1.1]">
                  Une présence <br/>
                  <span className="text-orange-500 italic font-light">à chaque instant.</span>
                </h3>
                <p className="mt-6 text-gray-400 font-light leading-relaxed max-w-lg">
                  Parce que vos exigences ne connaissent pas de fuseaux horaires, CarRent CI redéfinit le standard de l'assistance automobile.
                </p>
              </div>

              <div className="space-y-8">
                {contactFeatures.map((f, i) => (
                  <div key={i} className="group flex items-start gap-6">
                    <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center flex-shrink-0 group-hover:bg-orange-500/10 group-hover:border-orange-500/30 transition-all duration-500">
                      <i className={`${f.icon.startsWith('fab') ? f.icon : 'fas ' + f.icon} text-orange-500 text-lg`} />
                    </div>
                    <div>
                      <h4 className="text-lg font-bold text-white mb-1 tracking-wide group-hover:text-orange-400 transition-colors">{f.title}</h4>
                      <p className="text-gray-400 text-sm font-light leading-relaxed">{f.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* SECTION 2 : HORAIRES (MINIMALIST TABLE) */}
      <section className="relative py-20 px-6 bg-white/[0.01] border-y border-white/5">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-[10px] font-bold tracking-[0.3em] uppercase text-orange-500 mb-4">Le Temps en continu</h2>
            <h3 className="text-2xl md:text-4xl font-bold text-white">Engagement de Continuité</h3>
          </div>

          <div className="relative group">
            {/* Halo derrière la carte */}
            <div className="absolute -inset-1 bg-gradient-to-r from-orange-500/20 to-transparent rounded-[2rem] blur-xl opacity-50 group-hover:opacity-100 transition duration-500" />
            
            <div className="relative bg-[#0a0a0a]/80 backdrop-blur-2xl rounded-[2rem] p-8 md:p-12 border border-white/10 shadow-2xl">
              <div className="divide-y divide-white/5">
                {[
                  { d: 'Lundi au Vendredi', t: '24h/24' },
                  { d: 'Samedi & Dimanche', t: '24h/24' },
                  { d: 'Jours Fériés', t: '24h/24' }
                ].map((item, i) => (
                  <div key={i} className="flex justify-between items-center py-6 group/row">
                    <span className="text-gray-400 font-light text-base md:text-xl group-hover/row:text-white transition-colors">{item.d}</span>
                    <div className="flex items-center gap-3">
                      <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse shadow-[0_0_10px_rgba(249,115,22,1)]" />
                      <span className="text-white font-black text-lg md:text-2xl tracking-tighter">{item.t}</span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-12 p-6 rounded-2xl bg-orange-500/5 border border-orange-500/20 flex flex-col md:flex-row items-center gap-4 text-center md:text-left transition-all hover:bg-orange-500/10">
                <div className="w-12 h-12 rounded-full bg-orange-500 flex items-center justify-center flex-shrink-0 shadow-lg">
                  <i className="fas fa-bolt text-black text-lg" />
                </div>
                <div>
                  <p className="text-white font-bold text-sm uppercase tracking-widest">Alerte Urgence</p>
                  <p className="text-gray-400 text-xs font-light">Service de dépannage et remplacement de véhicule actif sans interruption.</p>
                </div>
                <a href="tel:+2250779562825" className="md:ml-auto px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-white text-[10px] font-black uppercase tracking-widest transition-all">
                  Appel d'urgence
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER CTA (RE-USEABLE STYLE) */}
      <section className="py-24 text-center px-6">
        <div className="max-w-3xl mx-auto space-y-8">
          <h3 className="text-2xl md:text-4xl font-black text-white">Une exigence, un départ <br/><span className="text-orange-500">maintenant ?</span></h3>
          <p className="text-gray-400 font-light">Nos chauffeurs et conseillers sont déjà prêts. Contactez notre ligne VIP.</p>
          <div className="flex flex-wrap justify-center gap-4">
            <a href="https://wa.me/2250779562825" className="px-8 py-4 bg-orange-500 text-black font-black uppercase tracking-widest text-[10px] rounded-xl hover:bg-orange-400 transition-all shadow-xl">
               Ouvrir WhatsApp
            </a>
            <a href="tel:+2250779562825" className="px-8 py-4 bg-white/5 border border-white/10 text-white font-black uppercase tracking-widest text-[10px] rounded-xl hover:bg-white/10 transition-all">
               Appeler Directement
            </a>
          </div>
        </div>
      </section>

    </ServiceLayout>
  )
}