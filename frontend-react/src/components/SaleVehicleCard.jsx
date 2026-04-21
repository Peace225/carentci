import { useState } from 'react'
import SaleVehicleModal from './SaleVehicleModal'
import { trackVisit } from '../api/config'

export default function SaleVehicleCard({ vehicle }) {
  const [showModal, setShowModal] = useState(false)
  const { name, category, image, price, year, mileage, features } = vehicle

  function handleContact() {
    trackVisit('index', vehicle.id, vehicle.name, 'vente')
    const url = `${window.location.origin}/v/${vehicle.id}`
    const msg = `Bonjour, je suis intéressé par l'achat de ce véhicule:\n\n*${name}*\n*Prix:* ${price?.toLocaleString('fr-FR')} FCFA\n*Année:* ${year}\n*Kilométrage:* ${mileage}\n\n*Voir le véhicule:*\n${url}\n\nPouvez-vous me donner plus d'informations?`
    window.open(`https://wa.me/2250779562825?text=${encodeURIComponent(msg)}`, '_blank')
  }

  return (
    <>
      <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl overflow-hidden shadow-lg hover:scale-105 transition-all duration-300 border border-orange-500/20 hover:border-orange-500 animate-fadeInUp">
        <div className="relative overflow-hidden group">
          <img src={image} alt={name} className="w-full h-56 object-cover group-hover:scale-110 transition-transform duration-500" />
          <div className="absolute top-4 right-4 bg-orange-500 px-3 py-1 rounded-full text-sm font-bold uppercase">{category}</div>
          <div className="absolute top-4 left-4 bg-green-500 px-3 py-1 rounded-full text-sm font-bold flex items-center gap-1">
            <i className="fas fa-tag" />À VENDRE
          </div>
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
            <p className="text-white font-bold text-xl">{price?.toLocaleString('fr-FR')} FCFA</p>
          </div>
        </div>

        <div className="p-5">
          <h4 className="text-xl font-bold mb-2">{name}</h4>
          <div className="grid grid-cols-2 gap-2 mb-3 text-sm text-gray-400">
            <span><i className="fas fa-calendar text-orange-500 mr-1" />{year}</span>
            <span><i className="fas fa-tachometer-alt text-orange-500 mr-1" />{mileage} km</span>
          </div>
          <div className="flex flex-wrap gap-2 mb-4">
            {features.slice(0, 3).map((f, i) => (
              <span key={i} className="bg-orange-500/20 text-orange-500 px-2 py-1 rounded-full text-xs">
                <i className="fas fa-check mr-1" />{f}
              </span>
            ))}
            {features.length > 3 && <span className="bg-gray-700 text-gray-300 px-2 py-1 rounded-full text-xs">+{features.length - 3}</span>}
          </div>
          <div className="space-y-2">
            <button onClick={handleContact} className="w-full bg-gradient-to-r from-green-500 to-green-600 py-3 rounded-lg hover:from-green-600 hover:to-green-700 transition-all font-semibold flex items-center justify-center gap-2">
              <i className="fab fa-whatsapp text-lg" />Contacter pour acheter
            </button>
            <button onClick={() => { trackVisit('index', vehicle.id, vehicle.name, 'vente'); setShowModal(true) }} className="w-full bg-gradient-to-r from-orange-500 to-orange-600 py-2 rounded-lg hover:from-orange-600 hover:to-orange-700 transition-all text-sm font-semibold">
              <i className="fas fa-info-circle mr-1" />Voir détails
            </button>
          </div>
        </div>
      </div>

      {showModal && <SaleVehicleModal vehicle={vehicle} onClose={() => setShowModal(false)} />}
    </>
  )
}
