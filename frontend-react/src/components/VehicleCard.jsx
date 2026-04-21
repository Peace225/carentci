import { useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'

export default function VehicleCard({ vehicle }) {
  const navigate = useNavigate()
  const { addToCart, cart } = useCart()
  const { id, name, category, image, priceWithout, stock, stockAlertThreshold, features } = vehicle

  const isOutOfStock = stock <= 0
  const isLowStock = stock > 0 && stockAlertThreshold > 0 && stock <= stockAlertThreshold
  const isInCart = cart.some(v => v.id === id)

  const stockBadge = isOutOfStock
    ? { cls: 'bg-red-500', text: 'ÉPUISÉ', icon: 'fa-ban' }
    : isLowStock
    ? { cls: 'bg-orange-500', text: `⚡ Dernières dispo`, icon: 'fa-exclamation-circle' }
    : { cls: 'bg-green-500', text: `${stock} dispo`, icon: 'fa-check-circle' }

  return (
    <div
      className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl overflow-hidden shadow-lg hover:scale-105 transition-all duration-300 border border-orange-500/20 hover:border-orange-500 cursor-pointer animate-fadeInUp"
      onClick={() => navigate(`/vehicule/${id}`)}
    >
      <div className="relative overflow-hidden group">
        <img src={image} alt={name} className="w-full h-56 object-cover group-hover:scale-110 transition-transform duration-500" />
        <div className="absolute top-4 right-4 bg-orange-500 px-3 py-1 rounded-full text-sm font-bold uppercase">
          {category}
        </div>
        <div className={`absolute top-4 left-4 ${stockBadge.cls} px-3 py-1 rounded-full text-sm font-bold flex items-center gap-1`}>
          <i className={`fas ${stockBadge.icon}`} />{stockBadge.text}
        </div>
      </div>

      <div className="p-5">
        <h4 className="text-xl font-bold mb-3">{name}</h4>
        <div className="flex flex-wrap gap-2 mb-4">
          {features.slice(0, 3).map((f, i) => (
            <span key={i} className="bg-orange-500/20 text-orange-500 px-2 py-1 rounded-full text-xs">
              <i className="fas fa-check mr-1" />{f}
            </span>
          ))}
          {features.length > 3 && (
            <span className="bg-gray-700 text-gray-300 px-2 py-1 rounded-full text-xs">+{features.length - 3}</span>
          )}
        </div>

        {/* Prix Abidjan + Intérieur */}
        <div className="border border-orange-500/30 rounded-lg overflow-hidden mb-4">
          <div className="flex justify-between items-center px-3 py-2 bg-gray-800/50">
            <span className="text-gray-400 text-sm">Prix Abidjan</span>
            <span className="text-orange-500 font-bold text-lg">{vehicle.priceWithout != null ? vehicle.priceWithout.toLocaleString('fr-FR') + ' FCFA' : 'Sur demande'}</span>
          </div>
          <div className="flex justify-between items-center px-3 py-2 bg-gray-800/30 border-t border-orange-500/20">
            <span className="text-gray-400 text-sm">Prix à l'intérieur</span>
            <span className="text-orange-500 font-bold text-lg">{vehicle.priceWith != null ? vehicle.priceWith.toLocaleString('fr-FR') + ' FCFA' : 'Sur demande'}</span>
          </div>
          <p className="text-center text-gray-500 text-xs py-1">par jour</p>
        </div>
        <div className="space-y-2">
          <button
            className="w-full bg-gradient-to-r from-orange-500 to-orange-600 py-3 rounded-lg hover:from-orange-600 hover:to-orange-700 transition-all font-semibold shadow-lg"
            onClick={e => { e.stopPropagation(); navigate(`/vehicule/${id}`) }}
          >
            <i className="fas fa-calendar-check mr-2" />Réserver
          </button>
          <button
            className={`w-full py-2 rounded-lg transition-all text-sm font-semibold border ${isInCart ? 'bg-green-500/20 border-green-500/50 text-green-400 cursor-default' : 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 border-transparent text-white shadow-lg'}`}
            onClick={e => { e.stopPropagation(); if (!isInCart) addToCart({ id, name, category, image, priceWithout }) }}
          >
            {isInCart
              ? <><i className="fas fa-check mr-2" />Dans le panier</>
              : <><i className="fas fa-shopping-cart mr-2" />Ajouter au panier</>
            }
          </button>
          <button
            className="w-full bg-gray-700 hover:bg-gray-600 py-2 rounded-lg transition-all text-sm font-semibold border border-gray-600"
            onClick={e => { e.stopPropagation(); navigate(`/vehicule/${id}`) }}
          >
            <i className="fas fa-info-circle mr-2 text-orange-500" />Voir détails
          </button>
        </div>
      </div>
    </div>
  )
}
