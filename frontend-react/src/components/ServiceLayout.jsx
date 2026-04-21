import { Link } from 'react-router-dom'

const LOGO = 'https://res.cloudinary.com/dev2r1wlo/image/upload/v1774859972/carentci/static/logo.png'

export default function ServiceLayout({ title, subtitle, icon, accentColor = 'orange', image, children }) {
  return (
    <div className="min-h-screen bg-black text-white">
      <header className="bg-gray-900 border-b border-gray-800 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <Link to="/"><img src={LOGO} alt="CarRent CI" className="h-14 w-auto object-contain" /></Link>
          <Link to="/" className="text-gray-400 hover:text-orange-500 transition-all">
            <i className="fas fa-arrow-left mr-2" />Retour
          </Link>
        </div>
      </header>

      <section className="relative py-20 px-6 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-orange-500/10 to-transparent" />
        <div className="max-w-7xl mx-auto relative z-10 text-center">
          <div className="bg-orange-500/10 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
            <i className={`fas ${icon} text-orange-500 text-4xl`} />
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-6">{title}</h1>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">{subtitle}</p>
        </div>
      </section>

      {image && (
        <section className="px-6 mb-16">
          <div className="max-w-7xl mx-auto">
            <img src={image} alt={title} className="w-full h-96 object-cover rounded-3xl shadow-2xl" />
          </div>
        </section>
      )}

      {children}

      <section className="px-6 mb-20">
        <div className="max-w-4xl mx-auto bg-gradient-to-r from-orange-500 to-orange-600 p-12 rounded-3xl text-center">
          <h2 className="text-4xl font-bold mb-4">Prêt à réserver ?</h2>
          <p className="text-xl mb-8 opacity-90">Contactez-nous dès maintenant</p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/" className="bg-white text-orange-500 px-8 py-4 rounded-xl font-bold hover:bg-gray-100 transition-all">
              <i className="fas fa-car mr-2" />Voir nos véhicules
            </Link>
            <a href="https://wa.me/2250779562825" className="bg-green-500 text-white px-8 py-4 rounded-xl font-bold hover:bg-green-600 transition-all">
              <i className="fab fa-whatsapp mr-2" />WhatsApp
            </a>
          </div>
        </div>
      </section>

      <footer className="bg-gray-900 border-t border-gray-800 py-8">
        <div className="max-w-7xl mx-auto px-6 text-center text-gray-400">
          <p>© {new Date().getFullYear()} CarRent CI. Tous droits réservés.</p>
        </div>
      </footer>
    </div>
  )
}
