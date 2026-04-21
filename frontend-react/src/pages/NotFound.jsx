import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center px-4">
      <div className="text-center max-w-lg">
        {/* Icône voiture cassée */}
        <div className="relative mb-8">
          <div className="text-9xl font-black text-orange-500/20 select-none">404</div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="bg-orange-500/10 border border-orange-500/30 rounded-full w-24 h-24 flex items-center justify-center">
              <i className="fas fa-car-crash text-orange-500 text-4xl" />
            </div>
          </div>
        </div>

        <h1 className="text-3xl font-black text-white mb-3">Page introuvable</h1>
        <p className="text-gray-400 mb-8 leading-relaxed">
          Cette page n'existe pas ou a été déplacée.<br />
          Revenez à l'accueil pour trouver votre véhicule.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            to="/"
            className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-8 py-3 rounded-xl font-bold hover:from-orange-600 hover:to-orange-700 transition-all shadow-lg flex items-center justify-center gap-2"
          >
            <i className="fas fa-home" />
            Retour à l'accueil
          </Link>
          <Link
            to="/#vehicules-location"
            className="bg-gray-800 border border-gray-700 text-gray-300 px-8 py-3 rounded-xl font-bold hover:bg-gray-700 transition-all flex items-center justify-center gap-2"
          >
            <i className="fas fa-car text-orange-500" />
            Voir les véhicules
          </Link>
        </div>

        <p className="text-gray-600 text-sm mt-8">
          Besoin d'aide ?{' '}
          <a href="https://wa.me/2250779562825" target="_blank" rel="noreferrer" className="text-green-500 hover:underline">
            <i className="fab fa-whatsapp mr-1" />Contactez-nous
          </a>
        </p>
      </div>
    </div>
  )
}
