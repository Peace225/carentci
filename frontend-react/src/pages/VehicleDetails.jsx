import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { createPortal } from 'react-dom'
import { fetchVehicleById } from '../api/vehicles'
import { createReservation } from '../api/reservations'
import { getDiscount, formatPrice, formatDate } from '../utils/discount'
import { trackVisit } from '../api/config'
import ReservationModal from '../components/ReservationModal'

export default function VehicleDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [showModal, setShowModal] = useState(false)
  const [currentImg, setCurrentImg] = useState(0)
  const [zoomOpen, setZoomOpen] = useState(false)

  const { data: vehicle, isLoading, error } = useQuery({
    queryKey: ['vehicle', id],
    queryFn: () => fetchVehicleById(id)
  })

  useEffect(() => {
    if (vehicle) trackVisit('vehicle-details.html', vehicle.id, vehicle.name, vehicle.type || 'location')
  }, [vehicle])

  if (isLoading) return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center pt-20">
      <i className="fas fa-spinner fa-spin text-5xl text-orange-500" />
    </div>
  )

  if (error || !vehicle) return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center pt-20">
      <div className="text-center">
        <i className="fas fa-exclamation-triangle text-5xl text-red-500 mb-4 block" />
        <p className="text-xl font-bold mb-4">Véhicule non trouvé</p>
        <button onClick={() => navigate('/')} className="bg-orange-500 px-6 py-3 rounded-lg font-bold">Retour</button>
      </div>
    </div>
  )

  const images = (vehicle.images && vehicle.images.length > 1) ? vehicle.images : [vehicle.image]
  const isOutOfStock = vehicle.stock <= 0

  function shareVehicle() {
    const url = `${window.location.origin}/v/${id}`
    if (navigator.share) {
      navigator.share({ title: vehicle.name + ' - CarRent CI', url }).catch(() => {})
    } else {
      window.open(`https://wa.me/?text=${encodeURIComponent(`Découvrez ${vehicle.name} sur CarRent CI :\n${url}`)}`, '_blank')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white">
      {/* Navbar simple */}
      <header className="bg-black/95 fixed w-full z-50 backdrop-blur-md border-b border-orange-500/20 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
          <a href="/" className="flex items-center">
            <img src="https://res.cloudinary.com/dev2r1wlo/image/upload/v1774859972/carentci/static/logo.png" alt="CarRent CI" className="h-14 w-auto object-contain" />
          </a>
          <div className="flex items-center gap-3">
            <button onClick={() => navigate(-1)} className="px-4 py-2 bg-gray-800/50 rounded-lg hover:bg-gray-800 transition-all border border-gray-700">
              <i className="fas fa-arrow-left mr-2" />Retour
            </button>
            <a href="https://wa.me/2250779562825" className="flex items-center gap-2 bg-gradient-to-r from-green-500 to-green-600 px-4 py-2 rounded-lg font-semibold text-sm">
              <i className="fab fa-whatsapp text-lg" /><span className="hidden sm:inline">WhatsApp</span>
            </a>
            <button onClick={shareVehicle} className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-blue-600 px-4 py-2 rounded-lg font-semibold text-sm">
              <i className="fas fa-share-alt text-lg" /><span className="hidden sm:inline">Partager</span>
            </button>
          </div>
        </div>
      </header>

      <main className="pt-24 pb-20">
        <div className="max-w-6xl mx-auto px-6">

          {/* Carousel */}
          <div className="mb-8">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl group">
              <div className="relative h-96 cursor-zoom-in" onClick={() => setZoomOpen(true)}>
                <img src={images[currentImg]} alt={vehicle.name} className="w-full h-full object-cover transition-opacity duration-500" />
                {/* Bouton zoom */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all flex items-center justify-center">
                  <span className="opacity-0 group-hover:opacity-100 transition-all bg-black/60 text-white px-4 py-2 rounded-full text-sm font-semibold flex items-center gap-2">
                    <i className="fas fa-search-plus" />Cliquer pour zoomer
                  </span>
                </div>
              </div>
              {images.length > 1 && (
                <>
                  <button onClick={e => { e.stopPropagation(); setCurrentImg(i => (i - 1 + images.length) % images.length) }}
                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white w-12 h-12 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all">
                    <i className="fas fa-chevron-left text-xl" />
                  </button>
                  <button onClick={e => { e.stopPropagation(); setCurrentImg(i => (i + 1) % images.length) }}
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white w-12 h-12 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all">
                    <i className="fas fa-chevron-right text-xl" />
                  </button>
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                    {images.map((_, i) => (
                      <button key={i} onClick={e => { e.stopPropagation(); setCurrentImg(i) }}
                        className={`rounded-full transition-all ${i === currentImg ? 'w-8 h-3 bg-orange-500' : 'w-3 h-3 bg-white/50'}`} />
                    ))}
                  </div>
                </>
              )}
              <div className="absolute top-4 right-4 bg-orange-500 px-4 py-2 rounded-full text-sm font-bold uppercase z-10">
                {vehicle.category}
              </div>
              <div className={`absolute top-4 left-4 px-4 py-2 rounded-full text-sm font-bold flex items-center gap-2 z-10 ${isOutOfStock ? 'bg-red-500' : 'bg-green-500'}`}>
                <i className={`fas ${isOutOfStock ? 'fa-ban' : 'fa-check-circle'}`} />
                {isOutOfStock ? 'ÉPUISÉ' : `${vehicle.stock} disponible${vehicle.stock > 1 ? 's' : ''}`}
              </div>
            </div>
            {/* Miniatures */}
            {images.length > 1 && (
              <div className="flex gap-2 mt-3 overflow-x-auto pb-1">
                {images.map((img, i) => (
                  <img key={i} src={img} alt={`${vehicle.name} ${i+1}`}
                    onClick={() => setCurrentImg(i)}
                    className={`h-16 w-24 object-cover rounded-lg cursor-pointer flex-shrink-0 transition-all border-2 ${i === currentImg ? 'border-orange-500 opacity-100' : 'border-transparent opacity-60 hover:opacity-100'}`}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Lightbox zoom */}
          {zoomOpen && createPortal(
            <div className="fixed inset-0 z-[9999] bg-black/95 flex items-center justify-center p-4"
              onClick={() => setZoomOpen(false)}>
              <button className="absolute top-4 right-4 text-white text-3xl hover:text-orange-500 transition-colors z-10"
                onClick={() => setZoomOpen(false)}>
                <i className="fas fa-times" />
              </button>
              {images.length > 1 && (
                <>
                  <button onClick={e => { e.stopPropagation(); setCurrentImg(i => (i - 1 + images.length) % images.length) }}
                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 text-white w-12 h-12 rounded-full flex items-center justify-center z-10">
                    <i className="fas fa-chevron-left text-xl" />
                  </button>
                  <button onClick={e => { e.stopPropagation(); setCurrentImg(i => (i + 1) % images.length) }}
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 text-white w-12 h-12 rounded-full flex items-center justify-center z-10">
                    <i className="fas fa-chevron-right text-xl" />
                  </button>
                </>
              )}
              <img src={images[currentImg]} alt={vehicle.name}
                className="max-w-full max-h-full object-contain rounded-xl shadow-2xl"
                onClick={e => e.stopPropagation()}
              />
              <p className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/60 text-sm">
                {currentImg + 1} / {images.length} — Cliquer en dehors pour fermer
              </p>
            </div>,
            document.body
          )}

          {/* Infos */}
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            <div className="md:col-span-2">
              <h1 className="text-4xl font-bold mb-4">{vehicle.name}</h1>

              <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 mb-6 border border-orange-500/20">
                <h3 className="text-xl font-bold mb-4 text-orange-500"><i className="fas fa-tag mr-2" />Tarifs de location</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 bg-gray-800/50 rounded-lg">
                    <span className="text-gray-300">Prix Abidjan</span>
                    <span className="text-2xl font-bold text-orange-500">{formatPrice(vehicle.priceWithout)}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-800/50 rounded-lg">
                    <span className="text-gray-300">Prix Hors d'Abidjan</span>
                    <span className="text-2xl font-bold text-orange-500">{formatPrice(vehicle.priceWith)}</span>
                  </div>
                  <p className="text-sm text-gray-400 text-center">par jour</p>
                </div>
              </div>

              <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 border border-orange-500/20 mb-6">
                <h3 className="text-xl font-bold mb-4 text-orange-500"><i className="fas fa-list mr-2" />Équipements</h3>
                <div className="grid grid-cols-2 gap-3">
                  {vehicle.features.map((f, i) => (
                    <div key={i} className="flex items-center gap-2 text-gray-300 bg-gray-800/50 p-3 rounded-lg">
                      <i className="fas fa-check text-green-500" /><span>{f}</span>
                    </div>
                  ))}
                </div>
              </div>

              {vehicle.description && (
                <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 border border-orange-500/20">
                  <h3 className="text-xl font-bold mb-4 text-orange-500"><i className="fas fa-info-circle mr-2" />À propos</h3>
                  <div className="text-gray-300 leading-relaxed space-y-2">
                    {vehicle.description.split('\n').filter(Boolean).map((p, i) => <p key={i}>{p}</p>)}
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar réservation */}
            <div>
              <div className="bg-gradient-to-br from-orange-500/10 to-orange-600/10 rounded-xl p-6 border-2 border-orange-500/30 sticky top-24">
                <h3 className="text-2xl font-bold mb-4 text-center">
                  <i className="fas fa-calendar-check text-orange-500 mr-2" />Réserver
                </h3>
                <div className="space-y-4 mb-6">
                  <div className="bg-gray-800/50 p-4 rounded-lg">
                    <p className="text-sm text-gray-400 mb-1">Disponibilité</p>
                    <p className={`text-lg font-bold ${isOutOfStock ? 'text-red-500' : 'text-green-500'}`}>
                      <i className={`fas ${isOutOfStock ? 'fa-ban' : 'fa-check-circle'} mr-2`} />
                      {isOutOfStock ? 'Indisponible' : `${vehicle.stock} disponible${vehicle.stock > 1 ? 's' : ''}`}
                    </p>
                  </div>
                  <div className="bg-gray-800/50 p-4 rounded-lg">
                    <p className="text-sm text-gray-400 mb-1">Catégorie</p>
                    <p className="text-lg font-bold capitalize">{vehicle.category}</p>
                  </div>
                </div>
                <button
                  onClick={() => !isOutOfStock && setShowModal(true)}
                  disabled={isOutOfStock}
                  className={`w-full py-4 rounded-lg font-bold text-lg flex items-center justify-center gap-2 transition-all ${
                    isOutOfStock
                      ? 'bg-gray-700 cursor-not-allowed opacity-50'
                      : 'bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 shadow-lg hover:shadow-orange-500/50'
                  }`}
                >
                  <i className="fas fa-calendar-check" />Réserver maintenant
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      {showModal && <ReservationModal vehicle={vehicle} onClose={() => setShowModal(false)} />}
    </div>
  )
}
