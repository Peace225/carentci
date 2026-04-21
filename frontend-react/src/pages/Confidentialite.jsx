import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { trackVisit } from '../api/config'

const LOGO = 'https://res.cloudinary.com/dev2r1wlo/image/upload/v1774859972/carentci/static/logo.png'

export default function Confidentialite() {
  useEffect(() => { trackVisit('confidentialite.html') }, [])

  const rights = [
    { title: 'Droit d\'Accès', desc: 'Consultez l\'intégralité des données vous concernant en un clic.', icon: 'fa-eye', color: 'blue' },
    { title: 'Rectification', desc: 'Mettez à jour vos informations pour une précision totale.', icon: 'fa-edit', color: 'indigo' },
    { title: 'Effacement', desc: 'Demandez la suppression définitive de votre empreinte digitale.', icon: 'fa-trash-alt', color: 'red' },
    { title: 'Opposition', desc: 'Gardez le contrôle sur l\'utilisation de vos données.', icon: 'fa-hand-paper', color: 'amber' },
  ];

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-blue-500/30">
      
      {/* BARRE DE NAVIGATION MINIMALISTE */}
      <nav className="bg-[#050505]/80 backdrop-blur-xl fixed w-full top-0 z-50 border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <Link to="/" className="hover:opacity-80 transition-opacity">
            <img src={LOGO} alt="CARENTCI.COM" className="h-10 md:h-12 w-auto object-contain" />
          </Link>
          <Link to="/" className="group flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 px-5 py-2 rounded-full transition-all">
            <i className="fas fa-arrow-left text-[10px] text-blue-500 group-hover:-translate-x-1 transition-transform" />
            <span className="text-[10px] font-bold uppercase tracking-widest">Retour à l'accueil</span>
          </Link>
        </div>
      </nav>

      {/* HERO SECTION : PROTECTION & CONFIANCE */}
      <header className="relative pt-48 pb-20 px-6 overflow-hidden">
        {/* Glow de fond indigo/bleu */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-5xl h-[500px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />
        
        <div className="max-w-4xl mx-auto relative z-10 text-center">
          <div className="inline-flex items-center gap-3 bg-blue-500/10 border border-blue-500/20 px-4 py-2 rounded-full mb-8 backdrop-blur-md">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,1)] animate-pulse" />
            <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-blue-400">Standard de Sécurité Bancaire</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-black tracking-tight mb-6 leading-[1.1]">
            Protection de la <br/>
            <span className="bg-gradient-to-r from-blue-400 via-indigo-500 to-blue-600 bg-clip-text text-transparent">Confidentialité.</span>
          </h1>
          <p className="text-gray-500 text-[11px] uppercase tracking-[0.3em] font-semibold">Dernière Mise à Jour : Avril 2026</p>
        </div>
      </header>

      {/* CONTENT SECTIONS */}
      <main className="pb-24 px-6">
        <div className="max-w-4xl mx-auto space-y-12">

          {/* ENGAGEMENT CARD */}
          <div className="relative group">
            <div className="absolute -inset-px bg-gradient-to-r from-blue-500/20 to-transparent rounded-[2.5rem] opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
            <div className="relative bg-[#0a0a0a] rounded-[2.5rem] p-8 md:p-12 border border-white/5 shadow-2xl overflow-hidden">
               <i className="fas fa-shield-check absolute -bottom-10 -right-10 text-[200px] text-white/[0.02] pointer-events-none" />
               <div className="relative z-10 flex flex-col md:flex-row gap-10 items-start">
                  <div className="w-20 h-20 rounded-3xl bg-blue-500/10 flex items-center justify-center flex-shrink-0 border border-blue-500/20 shadow-inner">
                    <i className="fas fa-fingerprint text-blue-500 text-3xl" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold mb-5 tracking-tight">Notre Manifeste</h2>
                    <p className="text-gray-400 font-light leading-relaxed text-base">
                      Chez <span className="text-white font-medium">CarRent CI</span>, la protection de vos données n'est pas une obligation légale, mais un standard de luxe. Nous appliquons des protocoles de chiffrement avancés pour garantir que votre vie privée reste... <span className="italic text-blue-400">privée</span>.
                    </p>
                  </div>
               </div>
            </div>
          </div>

          {/* DONNÉES COLLECTÉES (GRID) */}
          <section className="bg-white/[0.02] rounded-[2.5rem] p-8 md:p-12 border border-white/5 hover:border-white/10 transition-all duration-500">
            <div className="flex items-center gap-4 mb-12">
               <span className="text-[10px] font-black text-blue-500/40 uppercase tracking-[0.4em]">Section 01</span>
               <div className="h-px flex-1 bg-white/5" />
               <h2 className="text-xl font-bold uppercase tracking-widest text-white">Données Collectées</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Infos Personnelles */}
              <div className="relative p-8 rounded-3xl bg-black/40 border border-white/5 overflow-hidden group/item">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover/item:opacity-30 transition-opacity">
                  <i className="fas fa-user-shield text-4xl text-blue-500" />
                </div>
                <h3 className="text-blue-400 text-[10px] font-bold uppercase tracking-widest mb-6">Identité & Contact</h3>
                <ul className="space-y-4">
                  {['Patronyme complet', 'Signature numérique email', 'Liaison WhatsApp', 'Coordonnées de résidence'].map((t, i) => (
                    <li key={i} className="flex items-center gap-3 text-sm text-gray-300 font-light">
                      <i className="fas fa-circle text-[4px] text-blue-500" /> {t}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Documents */}
              <div className="relative p-8 rounded-3xl bg-black/40 border border-white/5 overflow-hidden group/item">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover/item:opacity-30 transition-opacity">
                  <i className="fas fa-file-invoice text-4xl text-indigo-500" />
                </div>
                <h3 className="text-indigo-400 text-[10px] font-bold uppercase tracking-widest mb-6">Pièces Officielles</h3>
                <ul className="space-y-4">
                  {['Titre de conduite certifié', 'Justificatif d\'identité', 'Preuves de domicile', 'Données de transaction chiffrées'].map((t, i) => (
                    <li key={i} className="flex items-center gap-3 text-sm text-gray-300 font-light">
                      <i className="fas fa-circle text-[4px] text-indigo-500" /> {t}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </section>

          {/* VOS DROITS (CARDS) */}
          <section className="bg-white/[0.02] rounded-[2.5rem] p-8 md:p-12 border border-white/5 hover:border-white/10 transition-all duration-500">
            <div className="flex items-center gap-4 mb-12">
               <span className="text-[10px] font-black text-blue-500/40 uppercase tracking-[0.4em]">Section 02</span>
               <div className="h-px flex-1 bg-white/5" />
               <h2 className="text-xl font-bold uppercase tracking-widest text-white">Droits & Souveraineté</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {rights.map((r, i) => (
                <div key={i} className="group/card relative p-6 rounded-2xl bg-black/20 border border-white/5 hover:border-blue-500/30 transition-all duration-500">
                  <div className="flex items-center gap-4 mb-3">
                    <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-blue-500 group-hover/card:bg-blue-500 group-hover/card:text-black transition-all">
                      <i className={`fas ${r.icon} text-sm`} />
                    </div>
                    <h3 className="font-bold text-sm tracking-wide text-white uppercase">{r.title}</h3>
                  </div>
                  <p className="text-gray-500 text-xs font-light leading-relaxed px-1">
                    {r.desc}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* FINAL CTA : DPO CONTACT */}
          <div className="relative rounded-[3rem] overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-indigo-700 to-blue-900 group-hover:scale-105 transition-transform duration-1000" />
            <div className="relative p-12 md:p-16 text-center">
              <div className="w-16 h-16 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center mx-auto mb-8 border border-white/20">
                <i className="fas fa-user-shield text-white text-2xl" />
              </div>
              <h3 className="text-3xl font-black mb-4 tracking-tight">Besoin d'exercer vos droits ?</h3>
              <p className="font-medium opacity-70 mb-10 max-w-sm mx-auto uppercase text-[10px] tracking-[0.2em] leading-relaxed text-white">Notre délégué à la protection des données est à votre disposition pour toute requête.</p>
              
              <a href="mailto:carentciv@gmail.com" 
                 className="inline-flex items-center gap-3 bg-white text-blue-900 px-10 py-4 rounded-xl font-black uppercase tracking-widest text-[10px] hover:bg-blue-50 transition-all shadow-[0_10px_30px_rgba(255,255,255,0.1)]">
                <i className="fas fa-paper-plane" /> Envoyer une demande
              </a>
            </div>
          </div>

        </div>
      </main>

      {/* MINI FOOTER */}
      <footer className="py-12 border-t border-white/5 text-center">
         <p className="text-[9px] text-gray-600 font-bold uppercase tracking-[0.5em]">Protection Certifiée — CarRent CI Logistique de Luxe</p>
      </footer>

    </div>
  )
}