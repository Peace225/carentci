import { useCart } from '../context/CartContext'
import { useNavigate } from 'react-router-dom'

export default function CartModal({ onClose }) {
  const { cart, removeFromCart, clearCart } = useCart()
  const navigate = useNavigate()

  function goToVehicle(id) {
    onClose()
    navigate(`/vehicule/${id}`)
  }

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl max-w-lg w-full border border-orange-500/30 overflow-hidden">

        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-gray-700">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-orange-500 to-orange-600 w-10 h-10 rounded-xl flex items-center justify-center">
              <i className="fas fa-shopping-cart text-white" />
            </div>
            <div>
              <h3 className="text-lg font-black text-white">Mon Panier</h3>
              <p className="text-orange-500 text-xs font-semibold">{cart.length} véhicule{cart.length > 1 ? 's' : ''}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-white text-xl hover:rotate-90 transition-transform duration-300">
            <i className="fas fa-times" />
          </button>
        </div>

        {/* Contenu */}
        <div className="max-h-96 overflow-y-auto p-4">
          {cart.length === 0 ? (
            <div className="text-center py-12">
              <i className="fas fa-shopping-cart text-5xl text-gray-600 mb-4 block" />
              <p className="text-gray-400 text-lg font-semibold">Votre panier est vide</p>
              <button onClick={onClose} className="mt-4 text-orange-500 hover:underline text-sm">
                Continuer mes achats
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {cart.map(item => (
                <div key={item.id} className="flex items-center gap-3 bg-gray-700/50 rounded-xl p-3 hover:bg-gray-700 transition-all">
                  <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded-lg flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-sm truncate">{item.name}</p>
                    <p className="text-orange-500 text-xs font-semibold capitalize">{item.category}</p>
                    {item.priceWithout > 0 && (
                      <p className="text-gray-400 text-xs">{item.priceWithout?.toLocaleString('fr-FR')} FCFA/jour</p>
                    )}
                  </div>
                  <div className="flex flex-col gap-2 flex-shrink-0">
                    <button onClick={() => goToVehicle(item.id)}
                      className="bg-orange-500 hover:bg-orange-600 text-white px-3 py-1.5 rounded-lg text-xs font-bold transition-all">
                      Réserver
                    </button>
                    <button onClick={() => removeFromCart(item.id)}
                      className="bg-red-500/20 hover:bg-red-500/40 text-red-400 px-3 py-1.5 rounded-lg text-xs font-bold transition-all">
                      <i className="fas fa-trash mr-1" />Retirer
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {cart.length > 0 && (
          <div className="p-4 border-t border-gray-700 space-y-2">
            <div className="bg-orange-500/10 border border-orange-500/30 rounded-xl p-3 text-center">
              <p className="text-orange-400 text-xs">
                <i className="fas fa-info-circle mr-1" />
                Cliquez sur "Réserver" pour effectuer la réservation de chaque véhicule
              </p>
            </div>
            <button onClick={clearCart}
              className="w-full bg-gray-700 hover:bg-gray-600 text-gray-300 py-2.5 rounded-xl text-sm font-semibold transition-all flex items-center justify-center gap-2">
              <i className="fas fa-trash" />Vider le panier
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
