import { useState } from 'react'
import { Link } from 'react-router-dom'

const LOGO = 'https://res.cloudinary.com/dev2r1wlo/image/upload/v1774859972/carentci/static/logo.png'

export default function Footer() {
  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)

  function handleNewsletter(e) {
    e.preventDefault()
    if (email) { setSubscribed(true); setEmail('') }
  }

  const socialLinks = [
    { icon: 'fab fa-facebook-f', href: 'https://facebook.com' },
    { icon: 'fab fa-instagram', href: 'https://instagram.com' },
    { icon: 'fab fa-whatsapp', href: 'https://wa.me/2250779562825' },
    { icon: 'fab fa-tiktok', href: 'https://tiktok.com' },
  ];

  const paymentMethods = [
    { label: 'Espèces', icon: 'fa-money-bill-wave' },
    { label: 'Orange Money', icon: 'fa-mobile-alt' },
    { label: 'Wave', icon: 'fa-wave-square' },
    { label: 'Virement', icon: 'fa-university' },
  ];

  return (
    <footer className="relative bg-[#050505] border-t border-white/5 pt-16 md:pt-20 pb-8 overflow-hidden z-10">
      {/* Éclairage d'ambiance (réduit sur mobile pour ne pas surcharger) */}
      <div className="absolute top-0 left-[-10%] md:left-1/4 w-[300px] md:w-[500px] h-[300px] md:h-[500px] bg-orange-600/5 rounded-full blur-[100px] md:blur-[150px] pointer-events-none" />
      <div className="absolute bottom-0 right-[-10%] md:right-1/4 w-[250px] md:w-[400px] h-[250px] md:h-[400px] bg-white/[0.02] rounded-full blur-[80px] md:blur-[120px] pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6">
        
        {/* Grille Principale Responsive (1 col Mobile, 12 cols Tablette/Desktop) */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-y-12 lg:gap-8 mb-12 md:mb-16">

          {/* COLONNE 1 - Marque & Contact (Pleine largeur Tablette, 4/12 Desktop) */}
          <div className="md:col-span-12 lg:col-span-4">
            <Link to="/" className="inline-block mb-4 md:mb-5">
              <img src={LOGO} alt="CARENTCI.COM" className="h-8 md:h-10 opacity-90 hover:opacity-100 transition-opacity" />
            </Link>
            <p className="text-gray-400 text-[11px] md:text-xs font-light leading-relaxed mb-6 max-w-sm">
              L'excellence automobile en Côte d'Ivoire. Location, vente et services de conciergerie premium pour une clientèle exigeante.
            </p>
            
            <div className="space-y-3 text-[11px] md:text-xs text-gray-400 font-light mb-6 md:mb-8">
              <a href="https://maps.google.com/?q=Yopougon+Toit+Rouge,+Abidjan" target="_blank" rel="noreferrer" className="flex items-center group">
                <i className="fas fa-map-marker-alt w-5 text-gray-600 group-hover:text-orange-500 transition-colors" />
                <span className="group-hover:text-white transition-colors">Yopougon Toit Rouge, Abidjan</span>
              </a>
              <p className="flex items-center">
                <i className="fas fa-clock w-5 text-gray-600" />
                <span>Lun - Dim : 07:00 - 22:00</span>
              </p>
              <a href="tel:+2250779562825" className="flex items-center group">
                <i className="fas fa-phone w-5 text-gray-600 group-hover:text-orange-500 transition-colors" />
                <span className="group-hover:text-white transition-colors">+225 07 79 56 28 25</span>
              </a>
              <a href="mailto:carentciv@gmail.com" className="flex items-center group">
                <i className="fas fa-envelope w-5 text-gray-600 group-hover:text-orange-500 transition-colors" />
                <span className="group-hover:text-white transition-colors">carentciv@gmail.com</span>
              </a>
            </div>

            {/* Réseaux sociaux */}
            <div className="flex gap-2.5">
              {socialLinks.map((s, i) => (
                <a key={i} href={s.href} target="_blank" rel="noreferrer"
                  className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center group hover:bg-orange-500/10 hover:border-orange-500/30 transition-all duration-300">
                  <i className={`${s.icon} text-gray-400 group-hover:text-orange-500 text-xs transition-colors duration-300`} />
                </a>
              ))}
            </div>
          </div>

          {/* COLONNE 2 - Prestations (6/12 Tablette, 2/12 Desktop) */}
          <div className="md:col-span-6 lg:col-span-2">
            <h4 className="text-white text-[9px] font-bold tracking-widest uppercase mb-5 md:mb-6">Prestations</h4>
            <ul className="space-y-3">
              {[
                { label: 'Location de véhicules', to: '/service-location' },
                { label: 'Livraison à domicile', to: '/service-livraison' },
                { label: 'Assurance complète', to: '/service-assurance' },
                { label: 'Support & Conciergerie', to: '/service-support' },
                { label: 'Entretien Chirurgical', to: '/service-maintenance' },
              ].map((item, i) => (
                <li key={i}>
                  <Link to={item.to} className="group flex items-center text-[11px] md:text-xs text-gray-400 font-light hover:text-white transition-colors">
                    <span className="w-0 overflow-hidden group-hover:w-3 transition-all duration-300 ease-out">
                      <i className="fas fa-minus text-[8px] text-orange-500" />
                    </span>
                    <span>{item.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* COLONNE 3 - Liens utiles (6/12 Tablette, 2/12 Desktop) */}
          <div className="md:col-span-6 lg:col-span-2">
            <h4 className="text-white text-[9px] font-bold tracking-widest uppercase mb-5 md:mb-6">Navigation</h4>
            <ul className="space-y-3">
              {[
                { label: 'Le Showroom', to: '/#vehicules-location' },
                { label: 'Acquisition', to: '/#vehicules-vente' },
                { label: 'Mes réservations', to: '/mes-reservations' },
                { label: 'Questions fréquentes', to: '/faq' },
                { label: 'Conditions générales', to: '/conditions' },
              ].map((item, i) => (
                <li key={i}>
                  <Link to={item.to} className="group flex items-center text-[11px] md:text-xs text-gray-400 font-light hover:text-white transition-colors">
                    <span className="w-0 overflow-hidden group-hover:w-3 transition-all duration-300 ease-out">
                      <i className="fas fa-minus text-[8px] text-orange-500" />
                    </span>
                    <span>{item.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* COLONNE 4 - Newsletter & Paiement (Pleine largeur Tablette, 4/12 Desktop) */}
          <div className="md:col-span-12 lg:col-span-4 mt-2 md:mt-0">
            <h4 className="text-white text-[9px] font-bold tracking-widest uppercase mb-4 md:mb-6">Accès Privilège</h4>
            <p className="text-gray-400 text-[11px] md:text-xs font-light mb-5 max-w-md">
              Abonnez-vous à notre liste confidentielle pour recevoir nos offres exclusives et les arrivages de nouveaux véhicules.
            </p>
            
            {subscribed ? (
              <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-3.5 flex items-center gap-3 w-full max-w-sm">
                <i className="fas fa-check-circle text-green-500 text-base" />
                <p className="text-green-400 text-[10px] font-semibold tracking-wide uppercase">Inscription confirmée</p>
              </div>
            ) : (
              <form onSubmit={handleNewsletter} className="relative group mb-8 max-w-sm">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-orange-500/20 to-transparent rounded-xl blur opacity-0 group-hover:opacity-100 transition duration-500"></div>
                <div className="relative flex items-center bg-[#0a0a0a] border border-white/10 rounded-xl p-1 overflow-hidden">
                  <input
                    type="email" required value={email} onChange={e => setEmail(e.target.value)}
                    placeholder="Votre adresse email"
                    className="w-full min-w-0 pl-3 pr-2 py-2 bg-transparent text-white text-[11px] md:text-xs font-light focus:outline-none placeholder-gray-600"
                  />
                  <button type="submit" className="flex-shrink-0 bg-white/5 hover:bg-orange-500 text-white hover:text-black px-4 md:px-5 py-2.5 rounded-lg font-bold text-[8px] md:text-[9px] uppercase tracking-widest transition-all duration-300">
                    S'inscrire
                  </button>
                </div>
              </form>
            )}

            {/* Moyens de paiement unifiés */}
            <div>
              <h5 className="text-gray-500 text-[8px] md:text-[9px] font-bold tracking-widest uppercase mb-3">Règlements acceptés</h5>
              <div className="flex flex-wrap gap-2">
                {paymentMethods.map((p, i) => (
                  <span key={i} className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-white/5 border border-white/10 text-gray-400 text-[8px] md:text-[9px] uppercase tracking-wider font-semibold cursor-default hover:border-orange-500/30 hover:text-orange-400 transition-colors duration-300">
                    <i className={`fas ${p.icon} text-[10px] md:text-xs`} />
                    {p.label}
                  </span>
                ))}
              </div>
            </div>
          </div>

        </div>

        {/* BARRE DU BAS (Adaptation Flex Row/Col) */}
        <div className="border-t border-white/5 pt-6 flex flex-col lg:flex-row items-center justify-between gap-5 text-center lg:text-left">
          <p className="text-[8px] md:text-[9px] text-gray-600 font-light uppercase tracking-widest order-2 lg:order-1">
            © {new Date().getFullYear()} CARENTCI.COM — L'Excellence Automobile
          </p>
          
          <div className="flex flex-wrap justify-center gap-4 md:gap-5 text-[8px] md:text-[9px] uppercase tracking-widest text-gray-500 font-semibold order-1 lg:order-2">
            <Link to="/conditions" className="hover:text-white transition-colors">CGV / CGU</Link>
            <Link to="/confidentialite" className="hover:text-white transition-colors">Confidentialité</Link>
            <Link to="/cookies" className="hover:text-white transition-colors">Cookies</Link>
          </div>
        </div>

      </div>
    </footer>
  )
}