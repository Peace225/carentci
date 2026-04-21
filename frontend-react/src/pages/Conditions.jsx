import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { trackVisit } from '../api/config'

const LOGO = 'https://res.cloudinary.com/dev2r1wlo/image/upload/v1774859972/carentci/static/logo.png'

export default function Conditions() {
  useEffect(() => { trackVisit('conditions.html') }, [])

  const sections = [
    { 
      num: '01', 
      title: 'Objet du Service', 
      content: (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <p className="text-gray-400 text-sm font-light leading-relaxed">
            CarRent CI propose une plateforme d'intermédiation et de gestion pour la mobilité haut de gamme. Nos services incluent :
          </p>
          <ul className="space-y-3">
            {['Location avec/sans chauffeur', 'Acquisition de véhicules certifiés', 'Conciergerie & Maintenance'].map((item, i) => (
              <li key={i} className="flex items-center gap-3 text-[11px] font-bold uppercase tracking-widest text-white">
                <i className="fas fa-minus text-orange-500 w-3" /> {item}
              </li>
            ))}
          </ul>
        </div>
      )
    },
    { 
      num: '02', 
      title: 'Protocoles de Location', 
      content: (
        <div className="space-y-8">
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white/[0.02] p-6 rounded-2xl border border-white/5">
              <h4 className="text-orange-500 text-[10px] font-bold uppercase tracking-[0.2em] mb-4">Éligibilité</h4>
              <ul className="space-y-3 text-sm text-gray-300 font-light">
                <li className="flex justify-between"><span>Âge minimum</span> <span className="text-white font-bold">21 ans</span></li>
                <li className="flex justify-between border-t border-white/5 pt-3"><span>Expérience conduite</span> <span className="text-white font-bold">2 ans min.</span></li>
                <li className="flex justify-between border-t border-white/5 pt-3"><span>Documents</span> <span className="text-white font-bold">ID / Passeport valide</span></li>
              </ul>
            </div>
            <div className="bg-white/[0.02] p-6 rounded-2xl border border-white/5">
              <h4 className="text-orange-500 text-[10px] font-bold uppercase tracking-[0.2em] mb-4">Engagement Horaire</h4>
              <p className="text-sm text-gray-300 font-light leading-relaxed">
                L'unité de location minimale est fixée à <span className="text-white font-bold">48 heures (2 jours)</span>. Toute fraction de journée entamée est considérée comme due selon les tarifs en vigueur.
              </p>
            </div>
          </div>
          
          <div className="pt-4">
            <h4 className="text-gray-500 text-[10px] font-bold uppercase tracking-[0.2em] mb-4">Barème des cautions (Dépôt de garantie)</h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { cat: 'Économique', val: '200.000 FCFA' },
                { cat: 'Premium', val: '500.000 FCFA' },
                { cat: 'Luxe / SUV', val: '1.000.000 FCFA' }
              ].map((c, i) => (
                <div key={i} className="px-4 py-3 bg-black/40 border border-white/10 rounded-xl text-center">
                  <p className="text-[9px] text-gray-500 uppercase mb-1">{c.cat}</p>
                  <p className="text-sm font-black text-white">{c.val}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )
    },
    { 
      num: '03', 
      title: 'Responsabilités & Assurances', 
      content: (
        <div className="grid md:grid-cols-2 gap-6">
          <div className="border-l-2 border-orange-500 pl-6 py-2">
            <h4 className="text-white font-bold text-lg mb-2">Garantie Locataire</h4>
            <p className="text-gray-400 text-xs font-light leading-relaxed">
              Le locataire assume la garde juridique du véhicule. Il s'engage à une utilisation conforme au code de la route et à la restitution du véhicule dans son état d'origine.
            </p>
          </div>
          <div className="border-l-2 border-blue-500 pl-6 py-2">
            <h4 className="text-white font-bold text-lg mb-2">Couverture Risques</h4>
            <p className="text-gray-400 text-xs font-light leading-relaxed">
              L'intégralité de la flotte bénéficie d'une assurance "Tous Risques". Une franchise fixe de <span className="text-white font-bold">100.000 FCFA</span> est applicable en cas de sinistre responsable.
            </p>
          </div>
        </div>
      )
    },
    { 
      num: '04', 
      title: 'Politique de Rétractation', 
      content: (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { label: '+7 jours', pct: '100%', sub: 'Remboursement Intégral', color: 'text-green-500', bg: 'bg-green-500/10' },
            { label: '3 à 7 jours', pct: '50%', sub: 'Frais de Dossier retenus', color: 'text-amber-500', bg: 'bg-amber-500/10' },
            { label: '-3 jours', pct: '0%', sub: 'Non Remboursable', color: 'text-red-500', bg: 'bg-red-500/10' }
          ].map((c, i) => (
            <div key={i} className={`${c.bg} p-6 rounded-[1.5rem] border border-white/5 text-center group hover:border-white/20 transition-all`}>
              <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-3">{c.label}</p>
              <p className={`text-4xl font-black ${c.color} mb-1`}>{c.pct}</p>
              <p className="text-[9px] uppercase font-medium text-gray-500">{c.sub}</p>
            </div>
          ))}
        </div>
      )
    }
  ];

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-orange-500/30">
      
      {/* NAVBAR PREMIUM */}
      <nav className="bg-[#050505]/80 backdrop-blur-xl fixed w-full top-0 z-50 border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <Link to="/" className="hover:opacity-80 transition-opacity">
            <img src={LOGO} alt="CARENTCI.COM" className="h-10 md:h-12 w-auto object-contain" />
          </Link>
          <Link to="/" className="group flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 px-5 py-2 rounded-full transition-all">
            <i className="fas fa-arrow-left text-[10px] text-orange-500 group-hover:-translate-x-1 transition-transform" />
            <span className="text-[10px] font-bold uppercase tracking-widest">Retour au Showroom</span>
          </Link>
        </div>
      </nav>

      {/* HERO SECTION */}
      <header className="relative pt-40 pb-20 px-6 overflow-hidden">
        {/* Glow de fond */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-[400px] bg-orange-600/10 rounded-full blur-[120px] pointer-events-none" />
        
        <div className="max-w-4xl mx-auto relative z-10 text-center">
          <div className="inline-flex items-center gap-3 bg-white/5 border border-white/10 px-4 py-2 rounded-full mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-orange-500 shadow-[0_0_10px_rgba(249,115,22,1)]" />
            <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-gray-300">Cadre Juridique Officiel</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-black tracking-tight mb-6">
            Conditions <br/><span className="bg-gradient-to-r from-orange-400 to-orange-600 bg-clip-text text-transparent">Générales.</span>
          </h1>
          <p className="text-gray-500 text-xs uppercase tracking-widest font-semibold">Révision 2026.V1 — Entrée en vigueur immédiate</p>
        </div>
      </header>

      {/* CONTENT SECTIONS */}
      <main className="pb-24 px-6">
        <div className="max-w-4xl mx-auto space-y-12">

          {/* INTRO BOX */}
          <div className="relative group">
            <div className="absolute -inset-px bg-gradient-to-r from-orange-500/20 to-transparent rounded-[2rem] opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
            <div className="relative bg-[#0a0a0a] rounded-[2rem] p-8 md:p-12 border border-white/5 shadow-2xl overflow-hidden">
               <i className="fas fa-file-contract absolute -bottom-10 -right-10 text-[180px] text-white/[0.02] pointer-events-none" />
               <div className="relative z-10 flex flex-col md:flex-row gap-8 items-start">
                  <div className="w-16 h-16 rounded-2xl bg-orange-500/10 flex items-center justify-center flex-shrink-0 border border-orange-500/20">
                    <i className="fas fa-info-circle text-orange-500 text-2xl" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold mb-4 tracking-tight">Introduction</h2>
                    <p className="text-gray-400 font-light leading-relaxed">
                      L'accès et l'utilisation des services de <span className="text-white font-medium">CarRent CI</span> impliquent l'acceptation pleine et entière de ce protocole. Ces conditions visent à garantir un standard d'excellence et une sécurité maximale pour l'ensemble de notre clientèle privilège.
                    </p>
                  </div>
               </div>
            </div>
          </div>

          {/* ARTICLES LOOP */}
          <div className="space-y-8">
            {sections.map((s) => (
              <div key={s.num} className="bg-white/[0.02] rounded-[2rem] p-8 md:p-12 border border-white/5 hover:border-white/10 transition-colors">
                <div className="flex items-center gap-4 mb-8">
                   <span className="text-5xl font-black text-white/5 tracking-tighter">{s.num}</span>
                   <div className="h-px flex-1 bg-white/5" />
                   <h2 className="text-xl font-bold uppercase tracking-widest text-orange-500">{s.title}</h2>
                </div>
                <div className="relative">
                  {s.content}
                </div>
              </div>
            ))}
          </div>

          {/* FINAL CTA BOX */}
          <div className="relative rounded-[2.5rem] overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-orange-600 group-hover:scale-105 transition-transform duration-700" />
            <div className="relative p-12 text-center text-black">
              <i className="fas fa-headset text-4xl mb-6 opacity-80" />
              <h3 className="text-3xl font-black mb-4 tracking-tight">Besoin d'un éclaircissement ?</h3>
              <p className="font-bold opacity-70 mb-8 max-w-sm mx-auto uppercase text-xs tracking-widest">Nos conseillers juridiques et experts clients sont à votre écoute 24/7.</p>
              
              <div className="flex flex-wrap justify-center gap-4">
                <a href="tel:+2250779562825" className="bg-black text-white px-8 py-4 rounded-xl font-black uppercase tracking-widest text-[10px] hover:bg-zinc-900 transition-all shadow-xl">
                  Ligne VIP
                </a>
                <a href="https://wa.me/2250779562825" className="bg-white text-black px-8 py-4 rounded-xl font-black uppercase tracking-widest text-[10px] hover:bg-gray-100 transition-all shadow-xl">
                  WhatsApp Conciergerie
                </a>
              </div>
            </div>
          </div>

        </div>
      </main>

      {/* FOOTER MINI */}
      <footer className="py-12 border-t border-white/5 text-center">
         <p className="text-[10px] text-gray-600 font-bold uppercase tracking-[0.4em]">© {new Date().getFullYear()} CarRent CI — L'excellence automobile</p>
      </footer>
    </div>
  )
}