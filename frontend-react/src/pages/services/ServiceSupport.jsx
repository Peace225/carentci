import { useEffect } from 'react'
import ServiceLayout from '../../components/ServiceLayout'
import { trackVisit } from '../../api/config'

export default function ServiceSupport() {
  useEffect(() => { trackVisit('service-support.html') }, [])

  const contactCards = [
    { 
      href: 'tel:+2250779562825', 
      icon: 'fa-phone-office', 
      title: 'Ligne Directe', 
      value: '+225 07 79 56 28 25', 
      sub: 'Standard International • 07h - 22h', 
      theme: 'border-white/10 group-hover:border-orange-500/50' 
    },
    { 
      href: 'https://wa.me/2250779562825', 
      icon: 'fab fa-whatsapp', 
      title: 'Conciergerie Digitale', 
      value: 'WhatsApp Business', 
      sub: 'Réponse instantanée 24/7', 
      theme: 'border-green-500/30 bg-green-500/5 group-hover:border-green-500/60',
      isGreen: true
    },
    { 
      href: 'mailto:carentciv@gmail.com', 
      icon: 'fa-envelope-open-text', 
      title: 'Canal Officiel', 
      value: 'carentciv@gmail.com', 
      sub: 'Traitement prioritaire sous 24h', 
      theme: 'border-white/10 group-hover:border-orange-500/50' 
    },
  ];

  return (
    <ServiceLayout
      title={<>Support & <span className="bg-gradient-to-r from-orange-400 to-orange-600 bg-clip-text text-transparent">Conciergerie</span></>}
      subtitle="Un accompagnement sur-mesure pour une expérience sans couture."
      icon="fa-headset"
      image="https://images.unsplash.com/photo-1553877522-43269d4ea984?w=1200"
    >
      
      {/* SECTION 1 : MODES DE CONTACT (GRID LUXE) */}
      <section className="relative py-20 px-6 overflow-hidden">
        {/* Ambient Glow */}
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-orange-600/5 rounded-full blur-[120px] pointer-events-none" />

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-[10px] font-bold tracking-[0.3em] uppercase text-orange-500 mb-4">Moyens de Liaison</h2>
            <h3 className="text-3xl md:text-5xl font-black text-white tracking-tight">Une connexion <span className="text-orange-500 italic font-light">privilégiée.</span></h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            {contactCards.map((c, i) => (
              <a key={i} href={c.href} target={c.href.startsWith('http') ? '_blank' : undefined} rel="noreferrer"
                className={`group relative p-8 rounded-[2rem] bg-[#0a0a0a]/80 border backdrop-blur-xl transition-all duration-500 hover:-translate-y-2 ${c.theme}`}>
                
                {/* Icône Container */}
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-8 transition-all duration-500 ${c.isGreen ? 'bg-green-500/10 text-green-500 group-hover:bg-green-500 group-hover:text-black' : 'bg-white/5 text-gray-400 group-hover:bg-orange-500 group-hover:text-black'}`}>
                  <i className={`fas ${c.icon} text-2xl`} />
                </div>

                <h4 className="text-gray-500 text-[10px] font-bold uppercase tracking-widest mb-2">{c.title}</h4>
                <p className="text-white font-bold text-lg lg:text-xl mb-2 tracking-tight transition-colors group-hover:text-orange-400">
                  {c.value}
                </p>
                <p className="text-gray-500 text-xs font-light italic">{c.sub}</p>

                {/* Arrow indicator */}
                <div className="absolute bottom-8 right-8 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-x-2 group-hover:translate-x-0">
                  <i className={`fas fa-arrow-right ${c.isGreen ? 'text-green-500' : 'text-orange-500'}`} />
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 2 : ÉQUIPE & VISION (EDITORIAL LAYOUT) */}
      <section className="relative py-24 px-6 bg-white/[0.01] border-y border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-12 gap-16 items-center">
            
            {/* Image avec Overlay & Glow */}
            <div className="lg:col-span-6 relative group">
              <div className="absolute -inset-4 bg-orange-500/10 rounded-[2.5rem] blur-2xl opacity-50 group-hover:opacity-80 transition-all duration-700" />
              <div className="relative rounded-[2rem] overflow-hidden border border-white/10 shadow-2xl">
                <img 
                  src="https://res.cloudinary.com/dev2r1wlo/image/upload/v1774827634/carentci/static/equipe.webp" 
                  alt="L'équipe CarRent CI" 
                  className="w-full h-[500px] object-cover grayscale-[30%] group-hover:grayscale-0 transition-all duration-1000 scale-105 group-hover:scale-100" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent opacity-80" />
              </div>
            </div>

            {/* Contenu Texte & Stats */}
            <div className="lg:col-span-6 space-y-10">
              <div>
                <h2 className="text-[10px] font-bold tracking-[0.3em] uppercase text-orange-500 mb-4">Capital Humain</h2>
                <h3 className="text-3xl md:text-5xl font-black text-white tracking-tight leading-[1.1]">
                  L'excellence par <br/>
                  <span className="text-orange-500 italic font-light">l'engagement.</span>
                </h3>
                <p className="mt-6 text-gray-400 font-light leading-relaxed">
                  Notre équipe n'est pas qu'un service client ; c'est un collectif d'experts dévoués à la logistique de luxe, formés pour anticiper vos moindres besoins.
                </p>
              </div>

              {/* Stats Grid Refined */}
              <div className="grid grid-cols-2 gap-6">
                {[
                  { v: '05+', l: 'Conseillers Experts' },
                  { v: '1000+', l: 'Missions Réussies' },
                  { v: '24/7', l: 'Veille Opérationnelle' },
                  { v: '4.9/5', l: 'Indice de Satisfaction' }
                ].map((s, i) => (
                  <div key={i} className="group p-6 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-orange-500/30 transition-all duration-500">
                    <p className="text-2xl md:text-3xl font-black text-white mb-1 group-hover:text-orange-500 transition-colors">{s.v}</p>
                    <p className="text-gray-500 text-[10px] font-bold uppercase tracking-widest">{s.l}</p>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* SECTION 3 : PHILOSOPHIE (THREE COLUMNS) */}
      <section className="py-24 px-6 text-center">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-[10px] font-bold tracking-[0.3em] uppercase text-orange-500 mb-12">Nos Piliers de Service</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              { icon: 'fa-user-tie', title: 'Discrétion Absolue', desc: 'Une confidentialité totale garantie pour l\'ensemble de nos clients privilèges.' },
              { icon: 'fa-bolt', title: 'Réactivité Éclair', desc: 'Une capacité d\'intervention et de réponse mesurée en minutes, pas en heures.' },
              { icon: 'fa-award', title: 'Standard Premium', desc: 'Chaque interaction est régie par les codes du service haut de gamme.' },
            ].map((p, i) => (
              <div key={i} className="space-y-4">
                <i className={`fas ${p.icon} text-orange-500 text-2xl mb-2`} />
                <h4 className="text-lg font-bold text-white tracking-wide">{p.title}</h4>
                <p className="text-gray-400 text-sm font-light leading-relaxed">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CALL TO ACTION */}
      <section className="pb-24 px-6">
        <div className="max-w-5xl mx-auto relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-orange-500 to-orange-800 rounded-[3rem] blur-xl opacity-20 group-hover:opacity-40 transition duration-1000" />
          <div className="relative bg-[#0a0a0a] border border-white/10 rounded-[3rem] p-12 text-center overflow-hidden">
            {/* Background pattern */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '32px 32px'}} />
            
            <h3 className="text-2xl md:text-4xl font-black text-white mb-6 relative z-10">Votre confort est notre <br/><span className="text-orange-500">unique priorité.</span></h3>
            <p className="text-gray-400 font-light mb-10 max-w-lg mx-auto relative z-10">Un conseiller est prêt à orchestrer votre prochain trajet. Entrez dans l'univers CarRent CI.</p>
            
            <div className="flex flex-wrap justify-center gap-4 relative z-10">
              <a href="https://wa.me/2250779562825" className="px-10 py-4 bg-orange-500 text-black font-black uppercase tracking-widest text-[10px] rounded-xl hover:bg-orange-400 transition-all shadow-[0_10px_30px_rgba(249,115,22,0.3)]">
                 Contacter un conseiller
              </a>
            </div>
          </div>
        </div>
      </section>

    </ServiceLayout>
  )
}