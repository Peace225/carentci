export default function SaleVehicleModal({ vehicle, onClose }) {
  const { id, name, price, year, mileage, features, description, image } = vehicle

  function handleContact() {
    const url = `${window.location.origin}/v/${id}`
    const msg = `Bonjour, je suis intéressé par l'achat de ce véhicule:\n\n*${name}*\n*Prix:* ${price?.toLocaleString('fr-FR')} FCFA\n*Année:* ${year}\n*Kilométrage:* ${mileage}\n\n*Voir le véhicule:*\n${url}\n\nPouvez-vous me donner plus d'informations?`
    window.open(`https://wa.me/2250779562825?text=${encodeURIComponent(msg)}`, '_blank')
  }

  function handleShare() {
    const url = `${window.location.origin}/v/${id}`
    const text = `Découvrez ${name} à ${price?.toLocaleString('fr-FR')} FCFA sur CarRent CI :\n${url}`
    if (navigator.share) {
      navigator.share({ title: name + ' - CarRent CI', url }).catch(() => window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank'))
    } else {
      window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank')
    }
  }

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl max-w-2xl w-full p-6 border border-orange-500/30 relative max-h-[90vh] overflow-y-auto">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white text-2xl hover:rotate-90 transition-transform duration-300">
          <i className="fas fa-times" />
        </button>

        <div className="mb-6">
          <img src={image} alt={name} className="w-full h-64 object-cover rounded-xl mb-4" />
          <h3 className="text-3xl font-bold mb-2">{name}</h3>
          <p className="text-4xl font-bold text-orange-500">{price?.toLocaleString('fr-FR')} FCFA</p>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-gray-800/50 p-4 rounded-lg">
            <i className="fas fa-calendar text-orange-500 mb-2 block" />
            <p className="text-gray-400 text-sm">Année</p>
            <p className="font-bold">{year}</p>
          </div>
          <div className="bg-gray-800/50 p-4 rounded-lg">
            <i className="fas fa-tachometer-alt text-orange-500 mb-2 block" />
            <p className="text-gray-400 text-sm">Kilométrage</p>
            <p className="font-bold">{mileage}</p>
          </div>
        </div>

        <div className="mb-6">
          <h4 className="font-bold text-lg mb-3"><i className="fas fa-list text-orange-500 mr-2" />Équipements</h4>
          <div className="grid grid-cols-2 gap-2">
            {features.map((f, i) => (
              <div key={i} className="flex items-center gap-2 text-gray-300">
                <i className="fas fa-check text-green-500" /><span>{f}</span>
              </div>
            ))}
          </div>
        </div>

        {description && (
          <div className="mb-6 bg-gray-800/50 p-4 rounded-lg border-l-4 border-orange-500">
            <h4 className="font-bold text-lg mb-3"><i className="fas fa-info-circle text-orange-500 mr-2" />À propos</h4>
            <p className="text-gray-300 text-sm leading-relaxed">{description}</p>
          </div>
        )}

        <div className="space-y-2">
          <button onClick={handleContact} className="w-full bg-gradient-to-r from-green-500 to-green-600 py-4 rounded-lg hover:from-green-600 hover:to-green-700 transition-all font-bold flex items-center justify-center gap-2">
            <i className="fab fa-whatsapp text-xl" />Contacter maintenant
          </button>
          <button onClick={handleShare} className="w-full bg-gradient-to-r from-blue-500 to-blue-600 py-3 rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all font-bold flex items-center justify-center gap-2">
            <i className="fas fa-share-alt" />Partager ce véhicule
          </button>
        </div>
      </div>
    </div>
  )
}
