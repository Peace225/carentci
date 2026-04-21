import { useEffect } from 'react'
import ServiceLayout from '../../components/ServiceLayout'
import { trackVisit } from '../../api/config'

const STEPS = [
  { num: '01', icon: 'fa-calendar-check', title: 'Sélection', desc: 'Réservez votre véhicule d\'exception via notre showroom digital.' },
  { num: '02', icon: 'fa-map-marker-alt', title: 'Géolocalisation', desc: 'Précisez le lieu exact : résidence, hôtel ou terminal aéroportuaire.' },
  { num: '03', icon: 'fa-truck-loading', title: 'Convoyage', desc: 'Notre équipe assure le transfert sécurisé de votre véhicule.' },
  { num: '04', icon: 'fa-key', title: 'Mise en main', desc: 'Récupérez les clés après un état des lieux rapide et certifié.' },
]

export default function ServiceLivraison() {
  useEffect(() => { trackVisit('service-livraison.html') }, [])

  return (
    <ServiceLayout
      title={<>Livraison <span className="bg-gradient-to-r from-orange-400 to-orange-600 bg-clip-text text-transparent">VIP</span></>}
      subtitle="Votre temps est précieux. Nous livrons l'excellence à votre porte."
      icon="fa-map-marked-alt"
      image="https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=1200"
    >
      
      {/* SECTION 1 : LE PROTOCOLE (TIMELINE) */}
      <section className="relative py-20 px-6 overflow-hidden">
        <div className="absolute top-1/2 left-0 -translate-y-1/2 w-[500px] h-[500px] bg-orange-600/5 rounded-full blur-[120px] pointer-events-none" />
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-16 md:mb-24">
            <h2 className="text-[10px] font-bold tracking-[0.3em] uppercase text-orange-500 mb-4">Logistique</h2>
            <h3 className="text-3xl md:text-5xl font-black text-white tracking-tight">Le Protocole de <span className="text-orange-500 italic font-light">Mise à Disposition.</span></h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 relative">
            {/* Ligne de connexion (Desktop) */}
            <div className="hidden md:block absolute top-12 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
            
            {STEPS.map((s, i) => (
              <div key={i} className="group relative text-center">
                <div className="relative z-10 w-24 h-24 mx-auto mb-8 flex items-center justify-center">
                  {/* Cercle de fond */}
                  <div className="absolute inset-0 bg-[#0a0a0a] border border-white/10 rounded-full group-hover:border-orange-500/50 transition-all duration-500 shadow-2xl" />
                  {/* Numero flottant */}
                  <span className="absolute -top-2 -right-2 text-[10px] font-black text-orange-500 bg-black border border-orange-500/30 w-8 h-8 rounded-full flex items-center justify-center shadow-lg">
                    {s.num}
                  </span>
                  <i className={`fas ${s.icon} text-3xl text-gray-500 group-hover:text-orange-500 transition-colors duration-500`} />
                </div>
                
                <h4 className="text-xl font-bold text-white mb-3 tracking-wide">{s.title}</h4>
                <p className="text-gray-400 text-sm font-light leading-relaxed px-4">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 2 : CARTE (DASHBOARD STYLE) */}
      <section className="relative py-24 px-6 bg-white/[0.01] border-y border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-12 gap-16 items-center">
            
            <div className="lg:col-span-5 space-y-8">
              <div>
                <h2 className="text-[10px] font-bold tracking-[0.3em] uppercase text-orange-500 mb-4">Territoire</h2>
                <h3 className="text-3xl md:text-5xl font-black text-white tracking-tight leading-[1.1]">Rayon <br/><span className="text-orange-500 italic font-light">d'Intervention.</span></h3>
                <p className="mt-6 text-gray-400 font-light leading-relaxed">
                  Nous couvrons l'intégralité du territoire national avec une concentration stratégique sur les pôles économiques et balnéaires.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {['Abidjan (Toute zone)', 'Yamoussoukro', 'Assinie', 'San-Pédro', 'Bouaké', 'Grand-Bassam'].map((city, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/5 text-xs text-gray-300 font-medium tracking-wide">
                    <i className="fas fa-check text-orange-500" /> {city}
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:col-span-7">
              <div className="relative group">
                {/* Halo lumineux */}
                <div className="absolute -inset-1 bg-orange-500/20 rounded-[2rem] blur-xl opacity-0 group-hover:opacity-100 transition duration-700" />
                {/* Frame Carte */}
                <div className="relative rounded-[2rem] overflow-hidden border border-white/10 shadow-2xl bg-[#0a0a0a]">
                  <div className="p-4 border-b border-white/5 flex items-center gap-2">
                    <div className="flex gap-1.5">
                      <div className="w-2 h-2 rounded-full bg-red-500/50" />
                      <div className="w-2 h-2 rounded-full bg-yellow-500/50" />
                      <div className="w-2 h-2 rounded-full bg-green-500/50" />
                    </div>
                    <span className="text-[9px] text-gray-500 uppercase tracking-[0.2em] ml-2">Satellite / Real-time Tracking</span>
                  </div>
                  <iframe
                    title="Zones de livraison - Côte d'Ivoire"
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d4063657.0!2d-6.5!3d7.5!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xfc1ea5311959759%3A0xbe15b5b5b5b5b5b5!2sCôte%20d'Ivoire!5e0!3m2!1sfr!2sci!4v1700000000000!5m2!1sfr!2sci"
                    width="100%"
                    height="450"
                    className="grayscale contrast-125 opacity-80 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-1000"
                    style={{ border: 0 }}
                    loading="lazy"
                  />
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* SECTION 3 : AVANTAGES (LUXURY CARDS) */}
      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
             <h2 className="text-[10px] font-bold tracking-[0.3em] uppercase text-orange-500 mb-4">L'Engagement CarRent</h2>
             <h3 className="text-3xl font-bold text-white">L'Exigence Logistique</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: 'fa-bolt', title: 'Priorité Abidjan', desc: 'Livraison offerte et prioritaire dans tout Abidjan pour toute location de 3 jours minimum.' },
              { icon: 'fa-tachometer-fastest', title: 'Express 2H', desc: 'Délai moyen de mise à disposition constaté de 120 minutes pour les urgences urbaines.' },
              { icon: 'fa-user-shield', title: 'Expert Dédié', desc: 'Chaque remise de clés est effectuée par un convoyeur certifié pour une présentation technique du véhicule.' },
            ].map((a, i) => (
              <div key={i} className="group relative p-8 rounded-[2rem] bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] hover:border-orange-500/30 transition-all duration-500">
                <div className="absolute -inset-px bg-gradient-to-b from-orange-500/10 to-transparent rounded-[2rem] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="w-12 h-12 rounded-xl bg-orange-500/10 flex items-center justify-center mb-6 text-orange-500">
                  <i className={`fas ${a.icon} text-xl`} />
                </div>
                <h3 className="text-lg font-bold text-white mb-3 tracking-wide group-hover:text-orange-400 transition-colors">{a.title}</h3>
                <p className="text-gray-400 text-sm font-light leading-relaxed">{a.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CALL TO ACTION */}
      <section className="pb-24 px-6 text-center">
        <div className="max-w-3xl mx-auto p-12 rounded-[3rem] bg-gradient-to-b from-white/[0.03] to-transparent border border-white/5">
          <h3 className="text-2xl font-bold text-white mb-6">Besoin d'une livraison immédiate ?</h3>
          <a href="https://wa.me/2250779562825" className="inline-flex items-center gap-3 px-10 py-4 bg-orange-500 text-black font-black uppercase tracking-widest text-[10px] rounded-xl hover:bg-orange-400 transition-all shadow-[0_10px_30px_rgba(249,115,22,0.3)]">
             Solliciter un convoyage <i className="fas fa-truck" />
          </a>
        </div>
      </section>

    </ServiceLayout>
  )
}