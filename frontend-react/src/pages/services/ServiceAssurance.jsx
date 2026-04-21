import { useEffect } from 'react'
import ServiceLayout from '../../components/ServiceLayout'
import { trackVisit } from '../../api/config'

export default function ServiceAssurance() {
  useEffect(() => { trackVisit('service-assurance.html') }, [])

  const coverage = [
    { 
      icon: 'fa-shield-check', 
      title: 'Dommages Matériels', 
      desc: 'Une protection intégrale couvrant l\'ensemble de notre flotte contre les imprévus.', 
      items: ['Collisions & Accidents', 'Vandalisme', 'Catastrophes naturelles'] 
    },
    { 
      icon: 'fa-user-crown', 
      title: 'Protection Privilège', 
      desc: 'Une couverture santé et assistance premium pour le conducteur et ses passagers.', 
      items: ['Frais médicaux d\'urgence', 'Protection conducteur VIP', 'Assistance rapatriement'] 
    },
    { 
      icon: 'fa-handshake-alt', 
      title: 'Responsabilité Civile', 
      desc: 'Garantie maximale pour les dommages causés aux tiers, incluant l\'assistance juridique.', 
      items: ['Dommages corporels tiers', 'Dommages matériels tiers', 'Frais de défense inclus'] 
    },
  ];

  return (
    <ServiceLayout
      title={<>Assurance <span className="bg-gradient-to-r from-orange-400 to-orange-600 bg-clip-text text-transparent">Complète</span></>}
      subtitle="Exigez la sérénité absolue pour chacun de vos trajets."
      icon="fa-shield-alt"
      image="https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=1200"
    >
      {/* SECTION 1 : COUVERTURE (GRID XXL) */}
      <section className="relative py-20 px-6 overflow-hidden">
        {/* Ambient Lights */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-orange-600/5 rounded-full blur-[120px] pointer-events-none" />
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-[10px] font-bold tracking-[0.3em] uppercase text-orange-500 mb-4">Garanties Exclusives</h2>
            <h3 className="text-3xl md:text-5xl font-black text-white tracking-tight">Une couverture <span className="font-light italic text-gray-400">sans compromis.</span></h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {coverage.map((c, i) => (
              <div key={i} className="group relative p-8 rounded-[2rem] bg-white/[0.02] border border-white/5 backdrop-blur-md hover:bg-white/[0.04] hover:border-orange-500/30 transition-all duration-500 flex flex-col h-full">
                {/* Glow Effect on Hover */}
                <div className="absolute -inset-px bg-gradient-to-b from-orange-500/20 to-transparent rounded-[2rem] opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-white/5 to-transparent border border-white/10 flex items-center justify-center mb-8 group-hover:scale-110 group-hover:border-orange-500/50 transition-all duration-500 shadow-xl">
                  <i className={`fas ${c.icon} text-2xl text-gray-400 group-hover:text-orange-500 transition-colors duration-500`} />
                </div>

                <h3 className="text-xl font-bold text-white mb-4 tracking-wide group-hover:text-orange-400 transition-colors">{c.title}</h3>
                <p className="text-gray-400 font-light leading-relaxed text-sm mb-8 flex-grow">{c.desc}</p>
                
                <ul className="space-y-3 pt-6 border-t border-white/5">
                  {c.items.map((item, j) => (
                    <li key={j} className="flex items-center gap-3 text-xs text-gray-300 font-medium uppercase tracking-wider">
                      <i className="fas fa-check-circle text-orange-500 text-[10px]" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 2 : POURQUOI NOUS (SPLIT SECTION) */}
      <section className="relative py-24 px-6 bg-black/40">
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid lg:grid-cols-12 gap-16 items-center">
            
            {/* Image avec cadre Premium */}
            <div className="lg:col-span-5 relative group">
              <div className="absolute -inset-4 bg-orange-500/10 rounded-[2.5rem] blur-2xl group-hover:bg-orange-500/20 transition-all duration-700" />
              <div className="relative rounded-[2rem] overflow-hidden border border-white/10 shadow-2xl">
                <img src="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800" alt="Conciergerie Assurance" className="w-full h-[500px] object-cover scale-105 group-hover:scale-100 transition-transform duration-1000" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                <div className="absolute bottom-8 left-8 right-8">
                  <p className="text-white font-bold text-lg mb-1 tracking-wide">Assistance VIP</p>
                  <p className="text-orange-500 text-xs font-bold uppercase tracking-widest">Disponible 24h/24 & 7j/7</p>
                </div>
              </div>
            </div>

            {/* Liste des avantages éditoriale */}
            <div className="lg:col-span-7 space-y-12">
              <div>
                <h2 className="text-[10px] font-bold tracking-[0.3em] uppercase text-orange-500 mb-4">Standard d'excellence</h2>
                <h3 className="text-3xl md:text-5xl font-black text-white tracking-tight leading-[1.1]">La promesse d'une <br/><span className="text-orange-500 italic font-light">sécurité totale.</span></h3>
              </div>

              <div className="grid gap-8">
                {[
                  { icon: 'fa-umbrella', title: 'Protection Maximale', desc: 'Une couverture exhaustive qui s\'adapte à la valeur de chaque véhicule d\'exception.' },
                  { icon: 'fa-phone-office', title: 'Gestion de Sinistre Dédiée', desc: 'Un conseiller personnel prend en charge l\'intégralité des démarches administratives.' },
                  { icon: 'fa-file-shield', title: 'Transparence Contractuelle', desc: 'Aucune clause cachée. Nos contrats sont rédigés pour votre protection exclusive.' },
                ].map((a, i) => (
                  <div key={i} className="group flex items-start gap-6 p-6 rounded-2xl hover:bg-white/[0.02] transition-colors duration-300">
                    <div className="w-12 h-12 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center flex-shrink-0 group-hover:bg-orange-500 group-hover:text-black transition-all duration-500 text-orange-500">
                      <i className={`fas ${a.icon} text-xl`} />
                    </div>
                    <div>
                      <h4 className="text-lg font-bold text-white mb-2 tracking-wide group-hover:text-orange-400 transition-colors">{a.title}</h4>
                      <p className="text-gray-400 text-sm font-light leading-relaxed">{a.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* FOOTER CALL TO ACTION (Subtil) */}
      <section className="py-20 text-center px-6">
        <div className="max-w-3xl mx-auto p-12 rounded-[3rem] bg-gradient-to-b from-white/[0.03] to-transparent border border-white/5 backdrop-blur-sm">
          <i className="fas fa-info-circle text-orange-500 text-3xl mb-6" />
          <h3 className="text-2xl font-bold text-white mb-4">Une question sur nos garanties ?</h3>
          <p className="text-gray-400 font-light mb-8">Nos experts en assurance sont à votre disposition pour vous détailler les spécificités de chaque contrat.</p>
          <a href="https://wa.me/2250779562825" className="inline-flex items-center gap-3 px-8 py-4 bg-orange-500 text-black font-black uppercase tracking-widest text-xs rounded-xl hover:bg-orange-400 transition-all shadow-xl">
             Parler à un expert <i className="fas fa-arrow-right" />
          </a>
        </div>
      </section>
    </ServiceLayout>
  )
}