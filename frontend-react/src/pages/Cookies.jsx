import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { trackVisit } from '../api/config'

const LOGO = 'https://res.cloudinary.com/dev2r1wlo/image/upload/v1774859972/carentci/static/logo.png'

const COOKIE_TYPES = [
  { title: 'Essentiels', icon: 'fa-shield-check', color: 'indigo', badge: 'Obligatoire',
    desc: 'Indispensables au fonctionnement sécurisé de la plateforme.',
    items: ['Gestion de session chiffrée', 'Protocoles de sécurité', 'Panier de réservation'] },
  { title: 'Performance', icon: 'fa-analytics', color: 'blue', badge: 'Optionnel',
    desc: 'Mesurent l\'audience pour optimiser votre fluidité de navigation.',
    items: ['Analyses comportementales', 'Temps de réponse serveur', 'Statistiques de visite anonymes'] },
  { title: 'Fonctionnels', icon: 'fa-user-cog', color: 'purple', badge: 'Optionnel',
    desc: 'Mémorisent vos préférences pour une expérience sur-mesure.',
    items: ['Préférences linguistiques', 'Historique showroom', 'Véhicules favoris'] },
  { title: 'Publicitaires', icon: 'fa-target-laser', color: 'orange', badge: 'Optionnel',
    desc: 'Ajustent nos offres selon vos centres d\'intérêt.',
    items: ['Pixel de conversion', 'Remarketing ciblé', 'Annonces personnalisées'] },
]

export default function Cookies() {
  useEffect(() => { trackVisit('cookies.html') }, [])

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-indigo-500/30">
      
      {/* BARRE DE NAVIGATION MINIMALISTE */}
      <nav className="bg-[#050505]/80 backdrop-blur-xl fixed w-full top-0 z-50 border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <Link to="/" className="hover:opacity-80 transition-opacity">
            <img src={LOGO} alt="CARENTCI.COM" className="h-10 md:h-12 w-auto object-contain" />
          </Link>
          <Link to="/" className="group flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 px-5 py-2 rounded-full transition-all">
            <i className="fas fa-arrow-left text-[10px] text-indigo-400 group-hover:-translate-x-1 transition-transform" />
            <span className="text-[10px] font-bold uppercase tracking-widest">Retour à l'accueil</span>
          </Link>
        </div>
      </nav>

      {/* HERO SECTION : ARCHITECTURE DIGITALE */}
      <header className="relative pt-48 pb-20 px-6 overflow-hidden">
        {/* Glow de fond Indigo */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-5xl h-[500px] bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none" />
        
        <div className="max-w-4xl mx-auto relative z-10 text-center">
          <div className="inline-flex items-center gap-3 bg-indigo-500/10 border border-indigo-500/20 px-4 py-2 rounded-full mb-8 backdrop-blur-md">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,1)] animate-pulse" />
            <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-indigo-400">Architecture des Traceurs</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-black tracking-tight mb-6 leading-[1.1]">
            Gestion des <br/>
            <span className="bg-gradient-to-r from-indigo-400 via-purple-500 to-indigo-600 bg-clip-text text-transparent">Cookies.</span>
          </h1>
          <p className="text-gray-500 text-[11px] uppercase tracking-[0.3em] font-semibold">Standard de Transparence Digitale • 2026</p>
        </div>
      </header>

      {/* CONTENT SECTIONS */}
      <main className="pb-24 px-6">
        <div className="max-w-4xl mx-auto space-y-12">

          {/* DÉFINITION CARD */}
          <div className="relative group">
            <div className="absolute -inset-px bg-gradient-to-r from-indigo-500/20 to-transparent rounded-[2.5rem] opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
            <div className="relative bg-[#0a0a0a] rounded-[2.5rem] p-8 md:p-12 border border-white/5 shadow-2xl overflow-hidden">
               <i className="fas fa-cookie-bite absolute -bottom-10 -right-10 text-[200px] text-white/[0.02] pointer-events-none" />
               <div className="relative z-10 flex flex-col md:flex-row gap-10 items-start">
                  <div className="w-20 h-20 rounded-3xl bg-indigo-500/10 flex items-center justify-center flex-shrink-0 border border-indigo-500/20 shadow-inner">
                    <i className="fas fa-fingerprint text-indigo-500 text-3xl" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold mb-5 tracking-tight">Protocole d'Usage</h2>
                    <p className="text-gray-400 font-light leading-relaxed text-base">
                      Un traceur est une empreinte numérique temporaire déposée sur votre interface. Chez <span className="text-white font-medium">CarRent CI</span>, nous utilisons cette technologie pour orchestrer une expérience utilisateur sans friction et garantir la sécurité de vos transactions.
                    </p>
                  </div>
               </div>
            </div>
          </div>

          {/* TYPES DE COOKIES (GRID XXL) */}
          <section className="space-y-6">
            <div className="flex items-center gap-4 mb-8">
               <span className="text-[10px] font-black text-indigo-500/40 uppercase tracking-[0.4em]">Classification</span>
               <div className="h-px flex-1 bg-white/5" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {COOKIE_TYPES.map((ct, i) => (
                <div key={i} className="group/card relative p-8 rounded-[2rem] bg-white/[0.02] border border-white/5 hover:border-indigo-500/30 transition-all duration-500">
                  <div className="flex items-start justify-between mb-6">
                    <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-indigo-400 group-hover/card:bg-indigo-500 group-hover/card:text-black transition-all duration-500">
                      <i className={`fas ${ct.icon} text-xl`} />
                    </div>
                    <span className={`px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-widest border border-white/10 ${ct.badge === 'Obligatoire' ? 'bg-indigo-500/10 text-indigo-400' : 'bg-white/5 text-gray-500'}`}>
                      {ct.badge}
                    </span>
                  </div>
                  
                  <h3 className="text-lg font-bold text-white mb-3 uppercase tracking-wider">{ct.title}</h3>
                  <p className="text-gray-500 text-xs font-light mb-6 leading-relaxed">{ct.desc}</p>
                  
                  <ul className="space-y-2.5 border-t border-white/5 pt-6">
                    {ct.items.map((item, j) => (
                      <li key={j} className="flex items-center gap-3 text-[11px] text-gray-400 font-medium">
                        <i className="fas fa-check text-indigo-500 text-[8px]" /> {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>

          {/* DURÉE DE CONSERVATION (LUXURY TABLE) */}
          <section className="bg-white/[0.02] rounded-[2.5rem] p-8 md:p-12 border border-white/5">
            <div className="flex items-center gap-4 mb-10">
               <span className="text-[10px] font-black text-indigo-500/40 uppercase tracking-[0.4em]">Cycle de Vie</span>
               <div className="h-px flex-1 bg-white/5" />
               <h2 className="text-xl font-bold uppercase tracking-widest text-white">Persistance</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-6 rounded-2xl bg-black/40 border border-white/5 hover:bg-black/60 transition-colors">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-white font-bold text-sm tracking-wide uppercase">Session Volatile</h3>
                  <span className="text-[10px] font-black text-indigo-500">TEMPORAIRE</span>
                </div>
                <p className="text-gray-400 text-xs font-light leading-relaxed">Fichiers auto-supprimés dès l'interruption de votre connexion ou fermeture du navigateur.</p>
              </div>
              <div className="p-6 rounded-2xl bg-black/40 border border-white/5 hover:bg-black/60 transition-colors">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-white font-bold text-sm tracking-wide uppercase">Stockage Persistant</h3>
                  <span className="text-[10px] font-black text-indigo-500">13 MOIS MAX</span>
                </div>
                <p className="text-gray-400 text-xs font-light leading-relaxed">Données conservées sur votre terminal pour reconnaître vos préférences lors de vos prochains passages.</p>
              </div>
            </div>
          </section>

          {/* FINAL CTA : ASSISTANCE */}
          <div className="relative rounded-[3rem] overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 via-purple-700 to-indigo-900 group-hover:scale-105 transition-transform duration-1000" />
            <div className="relative p-12 md:p-16 text-center">
              <div className="w-16 h-16 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center mx-auto mb-8 border border-white/20">
                <i className="fas fa-shield-alt text-white text-2xl" />
              </div>
              <h3 className="text-3xl font-black mb-4 tracking-tight">Une interrogation technique ?</h3>
              <p className="font-medium opacity-70 mb-10 max-w-sm mx-auto uppercase text-[10px] tracking-[0.2em] leading-relaxed text-white">Nos experts en conformité digitale sont à votre entière disposition.</p>
              
              <a href="mailto:carentciv@gmail.com" 
                 className="inline-flex items-center gap-3 bg-white text-indigo-900 px-10 py-4 rounded-xl font-black uppercase tracking-widest text-[10px] hover:bg-indigo-50 transition-all shadow-2xl">
                <i className="fas fa-envelope-open" /> Solliciter un conseiller
              </a>
            </div>
          </div>

        </div>
      </main>

      {/* MINI FOOTER */}
      <footer className="py-12 border-t border-white/5 text-center">
         <p className="text-[9px] text-gray-600 font-bold uppercase tracking-[0.5em]">Transparence Certifiée — CarRent CI Excellence Digitale</p>
      </footer>

    </div>
  )
}