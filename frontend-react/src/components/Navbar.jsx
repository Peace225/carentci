import { useState } from 'react'
import { createPortal } from 'react-dom'
import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import CartModal from './CartModal'

const LOGO = 'https://res.cloudinary.com/dev2r1wlo/image/upload/v1774859972/carentci/static/logo.png'

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [vehiclesOpen, setVehiclesOpen] = useState(false)
  const [cartOpen, setCartOpen] = useState(false)
  const { cart } = useCart()

  return (
    <header className="bg-black/95 fixed w-full z-50 backdrop-blur-md border-b border-white/5 shadow-2xl">
      <div className="max-w-7xl mx-auto px-4 py-2.5">
        <div className="flex items-center justify-between gap-4">

          {/* Logo */}
          <Link to="/" className="flex-shrink-0 hover:opacity-80 transition-opacity">
            <img src={LOGO} alt="CARENTCI.COM" className="h-10 md:h-12 w-auto object-contain" />
          </Link>

          {/* Nav Desktop */}
          <nav className="hidden lg:flex items-center justify-center flex-1 gap-2">
            <Link to="/" className="px-4 py-2 rounded-xl text-gray-300 hover:text-white hover:bg-white/5 transition-all flex items-center text-xs font-bold uppercase tracking-widest whitespace-nowrap">
              <i className="fas fa-home mr-2 text-orange-500" />Accueil
            </Link>

            {/* Dropdown Véhicules corrigé */}
            <div 
              className="relative group" 
              onMouseEnter={() => setVehiclesOpen(true)} 
              onMouseLeave={() => setVehiclesOpen(false)}
            >
              <button className="px-4 py-2 rounded-xl text-gray-300 hover:text-white hover:bg-white/5 transition-all flex items-center text-xs font-bold uppercase tracking-widest whitespace-nowrap">
                <i className="fas fa-car mr-2 text-orange-500" />
                Véhicules
                <i className={`fas fa-chevron-down ml-2 text-[10px] transition-transform duration-300 ${vehiclesOpen ? 'rotate-180 text-orange-500' : ''}`} />
              </button>
              
              {/* Menu déroulant */}
              <div 
                className={`absolute top-full left-0 pt-2 w-64 transition-all duration-300 origin-top ${
                  vehiclesOpen ? 'opacity-100 scale-y-100' : 'opacity-0 scale-y-0 pointer-events-none'
                }`}
              >
                <div className="bg-[#0a0a0a]/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/10 overflow-hidden">
                  <Link to="/#vehicules-location" className="block px-5 py-4 hover:bg-white/5 transition-all group/link border-b border-white/5">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-orange-500/10 flex items-center justify-center flex-shrink-0 group-hover/link:bg-orange-500 transition-colors">
                        <i className="fas fa-key text-orange-500 group-hover/link:text-black transition-colors" />
                      </div>
                      <div>
                        <span className="font-bold text-white text-xs uppercase tracking-widest block mb-0.5">Location</span>
                        <p className="text-[10px] text-gray-400 font-light">Louez un véhicule premium</p>
                      </div>
                    </div>
                  </Link>
                  <Link to="/#vehicules-vente" className="block px-5 py-4 hover:bg-white/5 transition-all group/link">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-orange-500/10 flex items-center justify-center flex-shrink-0 group-hover/link:bg-orange-500 transition-colors">
                        <i className="fas fa-tags text-orange-500 group-hover/link:text-black transition-colors" />
                      </div>
                      <div>
                        <span className="font-bold text-white text-xs uppercase tracking-widest block mb-0.5">Vente</span>
                        <p className="text-[10px] text-gray-400 font-light">Acquérez un véhicule certifié</p>
                      </div>
                    </div>
                  </Link>
                </div>
              </div>
            </div>

            <Link to="/#services" className="px-4 py-2 rounded-xl text-gray-300 hover:text-white hover:bg-white/5 transition-all flex items-center text-xs font-bold uppercase tracking-widest whitespace-nowrap">
              <i className="fas fa-concierge-bell mr-2 text-orange-500" />Services
            </Link>
            <Link to="/#temoignages" className="px-4 py-2 rounded-xl text-gray-300 hover:text-white hover:bg-white/5 transition-all flex items-center text-xs font-bold uppercase tracking-widest whitespace-nowrap">
              <i className="fas fa-star mr-2 text-orange-500" />Témoignages
            </Link>
            <Link to="/#contact" className="px-4 py-2 rounded-xl text-gray-300 hover:text-white hover:bg-white/5 transition-all flex items-center text-xs font-bold uppercase tracking-widest whitespace-nowrap">
              <i className="fas fa-envelope mr-2 text-orange-500" />Contact
            </Link>
            <Link to="/mes-reservations" className="px-4 py-2 rounded-xl text-gray-300 hover:text-white hover:bg-white/5 transition-all flex items-center text-xs font-bold uppercase tracking-widest whitespace-nowrap">
              <i className="fas fa-folder-open mr-2 text-orange-500" />Dossiers
            </Link>
          </nav>

          {/* Actions (Panier, Tél, Menu Mobile) */}
          <div className="flex items-center gap-3 flex-shrink-0">
            <a href="tel:+2250779562825" className="hidden xl:flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 px-4 py-2 rounded-xl transition-all whitespace-nowrap">
              <i className="fas fa-phone-alt text-orange-500 text-xs" />
              <span className="font-bold text-white text-xs tracking-widest">07 79 56 28 25</span>
            </a>
            
            {/* Bouton Panier Premium */}
            <button
              onClick={() => setCartOpen(true)}
              className="relative flex items-center justify-center w-10 h-10 md:w-auto md:h-auto md:px-4 md:py-2 bg-gradient-to-br from-orange-500 to-orange-600 hover:from-orange-400 hover:to-orange-500 rounded-xl transition-all shadow-[0_0_15px_rgba(249,115,22,0.3)] whitespace-nowrap"
            >
              <i className="fas fa-shopping-bag text-black md:mr-2" />
              <span className="hidden md:inline text-black text-xs font-black uppercase tracking-widest">Panier</span>
              {cart.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-white text-black text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center shadow-lg border-2 border-black">
                  {cart.length}
                </span>
              )}
            </button>

            {/* Hamburger Button Mobile */}
            <button className="lg:hidden w-10 h-10 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center text-white hover:bg-white/10 transition-colors" onClick={() => setMenuOpen(!menuOpen)}>
              <i className={`fas ${menuOpen ? 'fa-times' : 'fa-bars'}`} />
            </button>
          </div>
        </div>
      </div>

      {/* Cart Modal */}
      {cartOpen && createPortal(<CartModal onClose={() => setCartOpen(false)} />, document.body)}

      {/* Mobile menu Premium */}
      {menuOpen && (
        <div className="lg:hidden absolute top-full left-0 w-full bg-[#050505]/95 backdrop-blur-2xl border-t border-white/10 shadow-2xl">
          <nav className="flex flex-col p-4 space-y-1 max-w-7xl mx-auto">
            <Link to="/" onClick={() => setMenuOpen(false)} className="px-4 py-3.5 rounded-xl hover:bg-white/5 text-gray-300 hover:text-white transition-all flex items-center font-bold uppercase tracking-widest text-xs">
              <i className="fas fa-home mr-4 text-orange-500 w-4 text-center" />Accueil
            </Link>
            
            <div className="py-2 px-4 text-[10px] text-gray-600 font-bold uppercase tracking-widest">Véhicules</div>
            
            <Link to="/#vehicules-location" onClick={() => setMenuOpen(false)} className="px-4 py-3.5 rounded-xl bg-white/[0.02] hover:bg-white/5 text-gray-300 hover:text-white transition-all flex items-center font-bold uppercase tracking-widest text-xs ml-4 border border-white/5">
              <i className="fas fa-key mr-4 text-orange-500 w-4 text-center" />Location
            </Link>
            <Link to="/#vehicules-vente" onClick={() => setMenuOpen(false)} className="px-4 py-3.5 mt-1 rounded-xl bg-white/[0.02] hover:bg-white/5 text-gray-300 hover:text-white transition-all flex items-center font-bold uppercase tracking-widest text-xs ml-4 border border-white/5">
              <i className="fas fa-tags mr-4 text-orange-500 w-4 text-center" />Vente
            </Link>

            <div className="my-2 border-t border-white/5"></div>

            <Link to="/#services" onClick={() => setMenuOpen(false)} className="px-4 py-3.5 rounded-xl hover:bg-white/5 text-gray-300 hover:text-white transition-all flex items-center font-bold uppercase tracking-widest text-xs">
              <i className="fas fa-concierge-bell mr-4 text-orange-500 w-4 text-center" />Services
            </Link>
            <Link to="/mes-reservations" onClick={() => setMenuOpen(false)} className="px-4 py-3.5 rounded-xl hover:bg-white/5 text-gray-300 hover:text-white transition-all flex items-center font-bold uppercase tracking-widest text-xs">
              <i className="fas fa-folder-open mr-4 text-orange-500 w-4 text-center" />Mes Dossiers
            </Link>
          </nav>
        </div>
      )}
    </header>
  )
}