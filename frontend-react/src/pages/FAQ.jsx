import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { trackVisit } from '../api/config'

const LOGO = 'https://res.cloudinary.com/dev2r1wlo/image/upload/v1774859972/carentci/static/logo.png'

const FAQS = {
  location: {
    title: 'Location & Protocoles', icon: 'fa-car-side', color: 'text-orange-500',
    items: [
      { q: 'Quels documents sont nécessaires pour la souscription ?', a: 'Une expérience de conduite de 2 ans minimum est requise. Vous devrez présenter un permis de conduire valide, une pièce d\'identité officielle (CNI ou Passeport) et un justificatif de résidence récent.' },
      { q: 'Quelle est l\'unité de location minimale ?', a: 'Le standard CarRent CI est fixé à une durée minimale de 48 heures (2 jours). Des tarifs privilèges sont appliqués pour les locations de moyenne et longue durée.' },
      { q: 'La politique de carburant est-elle transparente ?', a: 'Absolument. Nos véhicules sont livrés avec le plein de carburant. Pour une fluidité totale, ils doivent être restitués avec un niveau identique.' },
      { q: 'Le périmètre de circulation est-il restreint ?', a: 'Vous disposez d\'une liberté totale sur l\'ensemble du territoire national. Pour des trajets transfrontaliers (CEDEAO), un protocole spécifique et des documents additionnels sont requis.' },
    ]
  },
  vente: {
    title: 'Acquisition & Garanties', icon: 'fa-award', color: 'text-orange-400',
    items: [
      { q: 'Quelle est la portée de la garantie mécanique ?', a: 'Chaque véhicule acquis bénéficie d\'une garantie de sérénité de 6 mois couvrant les organes majeurs, ainsi qu\'un historique de maintenance certifié.' },
      { q: 'Existe-t-il des programmes de financement ?', a: 'Nous proposons des solutions d\'étalement de paiement personnalisées jusqu\'à 12 mensualités, sous réserve de validation de votre dossier de crédit.' },
      { q: 'Puis-je solliciter un essai routier privé ?', a: 'L\'excellence s\'apprécie au volant. Contactez votre conseiller pour organiser une mise à disposition privée du véhicule de votre choix.' },
    ]
  },
  paiement: {
    title: 'Finance & Règlement', icon: 'fa-shield-check', color: 'text-white',
    items: [
      { q: 'Quels sont les terminaux de paiement acceptés ?', a: 'Nous acceptons les règlements par carte bancaire, virements certifiés, ainsi que les solutions mobiles Wave et Orange Money (07 79 56 28 25).' },
      { q: 'Quelle est la structure de l\'acompte ?', a: 'Une confirmation de réservation nécessite un acompte de 35%. Le solde, accompagné du dépôt de garantie (caution), est finalisé lors de la remise des clés.' },
    ]
  }
}

function FAQItem({ q, a }) {
  const [open, setOpen] = useState(false)
  return (
    <div className={`group relative transition-all duration-500 rounded-[1.5rem] border ${open ? 'bg-white/[0.04] border-orange-500/30 shadow-2xl' : 'bg-white/[0.02] border-white/5 hover:border-white/10'}`}>
      <button onClick={() => setOpen(!open)} className="w-full p-6 md:p-8 text-left flex justify-between items-center gap-4">
        <span className={`text-base md:text-lg font-bold tracking-wide transition-colors duration-300 ${open ? 'text-orange-500' : 'text-white'}`}>{q}</span>
        <div className={`w-8 h-8 rounded-full flex items-center justify-center border transition-all duration-500 ${open ? 'bg-orange-500 border-orange-500 text-black rotate-180' : 'bg-white/5 border-white/10 text-gray-500'}`}>
          <i className="fas fa-chevron-down text-[10px]" />
        </div>
      </button>
      <div className={`overflow-hidden transition-all duration-500 ease-in-out ${open ? 'max-h-[300px] opacity-100' : 'max-h-0 opacity-0'}`}>
        <div className="px-8 pb-8 text-gray-400 font-light leading-relaxed text-sm md:text-base border-t border-white/5 pt-4">
          {a}
        </div>
      </div>
    </div>
  )
}

export default function FAQ() {
  const [filter, setFilter] = useState('all')
  useEffect(() => { trackVisit('faq.html') }, [])

  const categories = [
    { key: 'all', label: 'Toutes les catégories', icon: 'fa-grid-2' },
    { key: 'location', label: 'Location VIP', icon: 'fa-car-side' },
    { key: 'vente', label: 'Vente & Luxe', icon: 'fa-award' },
    { key: 'paiement', label: 'Finance', icon: 'fa-credit-card' },
  ]

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-orange-500/30">
      
      {/* NAVBAR GLASSMORPHISM */}
      <nav className="bg-[#050505]/80 backdrop-blur-xl fixed w-full top-0 z-50 border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <Link to="/" className="hover:opacity-80 transition-opacity">
            <img src={LOGO} alt="CARENTCI.COM" className="h-10 md:h-12 w-auto object-contain" />
          </Link>
          <Link to="/" className="group flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 px-5 py-2 rounded-xl transition-all">
            <i className="fas fa-home text-[10px] text-orange-500" />
            <span className="text-[10px] font-bold uppercase tracking-widest">Retour Accueil</span>
          </Link>
        </div>
      </nav>

      {/* HERO : CENTRE D'AIDE EDITORIAL */}
      <header className="relative pt-48 pb-20 px-6 overflow-hidden">
        {/* Glow de fond */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-5xl h-[400px] bg-orange-600/10 rounded-full blur-[120px] pointer-events-none" />
        
        <div className="max-w-4xl mx-auto relative z-10 text-center">
          <div className="inline-flex items-center gap-3 bg-white/5 border border-white/10 px-4 py-2 rounded-full mb-8 backdrop-blur-md">
            <span className="w-1.5 h-1.5 rounded-full bg-orange-500 shadow-[0_0_10px_rgba(249,115,22,1)] animate-pulse" />
            <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-gray-300">Support & Conciergerie</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-black tracking-tight mb-6 leading-[1.1]">
            Questions <br/><span className="bg-gradient-to-r from-orange-400 to-orange-600 bg-clip-text text-transparent">Fréquentes.</span>
          </h1>
          <p className="text-gray-500 text-[11px] uppercase tracking-[0.3em] font-semibold">Trouvez des réponses immédiates à vos exigences.</p>
        </div>
      </header>

      {/* FILTRES & CONTENU */}
      <main className="pb-24 px-6">
        <div className="max-w-4xl mx-auto">
          
          {/* SÉLECTEUR DE CATÉGORIE PREMIUM */}
          <div className="flex flex-wrap justify-center gap-3 mb-20">
            {categories.map(c => (
              <button key={c.key} onClick={() => setFilter(c.key)}
                className={`px-6 py-3 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all duration-300 border ${
                  filter === c.key 
                  ? 'bg-orange-500 border-orange-500 text-black shadow-[0_10px_20px_rgba(249,115,22,0.2)]' 
                  : 'bg-white/5 border-white/10 text-gray-400 hover:border-white/20 hover:text-white'
                }`}>
                <i className={`fas ${c.icon} ${filter === c.key ? 'text-black' : 'text-orange-500'} mr-2.5`} />
                {c.label}
              </button>
            ))}
          </div>

          {/* LISTE DES FAQS */}
          <div className="space-y-16">
            {Object.entries(FAQS).map(([key, section]) => (
              (filter === 'all' || filter === key) && (
                <div key={key} className="animate-fadeIn">
                  <div className="flex items-center gap-4 mb-8">
                     <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center border border-orange-500/20">
                        <i className={`fas ${section.icon} text-orange-500`} />
                     </div>
                     <h2 className="text-xl md:text-2xl font-black uppercase tracking-tight text-white">{section.title}</h2>
                     <div className="h-px flex-1 bg-white/5" />
                  </div>
                  
                  <div className="space-y-4">
                    {section.items.map((item, i) => <FAQItem key={i} {...item} />)}
                  </div>
                </div>
              )
            ))}
          </div>

          {/* FINAL CTA BOX */}
          <div className="relative mt-24 rounded-[2.5rem] overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-red-600 group-hover:scale-105 transition-transform duration-700" />
            <div className="relative p-10 md:p-16 text-center">
              <i className="fas fa-headset text-4xl text-black mb-8 opacity-80" />
              <h3 className="text-3xl md:text-4xl font-black text-black mb-4 tracking-tight">Une interrogation persistante ?</h3>
              <p className="font-bold text-black/70 mb-10 max-w-sm mx-auto uppercase text-xs tracking-widest leading-relaxed">
                Nos conseillers privés sont à votre disposition 24/7 pour orchestrer votre mobilité.
              </p>
              
              <div className="flex flex-wrap justify-center gap-4">
                <a href="tel:+2250779562825" className="bg-black text-white px-8 py-4 rounded-xl font-black uppercase tracking-widest text-[10px] hover:bg-zinc-900 transition-all shadow-xl">
                  Ligne Directe
                </a>
                <a href="https://wa.me/2250779562825" className="bg-white text-black px-8 py-4 rounded-xl font-black uppercase tracking-widest text-[10px] hover:bg-gray-100 transition-all shadow-xl">
                  Conciergerie WhatsApp
                </a>
              </div>
            </div>
          </div>

        </div>
      </main>

      {/* MINI FOOTER */}
      <footer className="py-12 border-t border-white/5 text-center">
         <p className="text-[9px] text-gray-600 font-bold uppercase tracking-[0.4em]">© {new Date().getFullYear()} CarRent CI — Intelligence Automobile</p>
      </footer>

    </div>
  )
}