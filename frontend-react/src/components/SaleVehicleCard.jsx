import { useState } from "react"
import { Link } from "react-router-dom"

export default function SaleVehicleCard({ vehicle }) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  
  // LOGIQUE MERN : Gestion du format JSON (MySQL) ou Array (MongoDB)
  const getImages = () => {
    try {
      if (Array.isArray(vehicle?.images)) return vehicle.images
      if (typeof vehicle?.images === 'string') return JSON.parse(vehicle.images)
    } catch (e) {
      console.error("Erreur parsing images vente", e)
    }
    return vehicle?.image ? [vehicle.image] : ["/placeholder-car.jpg"]
  }

  const images = getImages()

  // Navigation Carrousel
  const nextImage = (e) => {
    e.preventDefault(); e.stopPropagation()
    setCurrentImageIndex((prev) => (prev + 1) % images.length)
  }

  const prevImage = (e) => {
    e.preventDefault(); e.stopPropagation()
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length)
  }

  const displayKm = (vehicle?.kilometrage || 0).toLocaleString('fr-FR')
  const displayPrice = (vehicle?.prix || vehicle?.sale_price || 0).toLocaleString('fr-FR')

  return (
    <div className="relative group bg-white/[0.02] border border-white/10 rounded-[2.5rem] overflow-hidden hover:bg-white/[0.04] hover:border-blue-500/30 transition-all duration-500 flex flex-col shadow-2xl">
      
      {/* --- CARROUSEL D'IMAGES --- */}
      <div className="relative w-full h-64 overflow-hidden bg-[#0a0a0a]">
        <img 
          src={images[currentImageIndex]} 
          alt={`${vehicle?.marque} ${vehicle?.modele}`} 
          className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" 
        />
        
        {/* Overlay pour le contraste */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20" />

        {images.length > 1 && (
          <>
            <button onClick={prevImage} className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center rounded-full bg-black/20 backdrop-blur-md text-white opacity-0 group-hover:opacity-100 transition-all hover:bg-blue-500 z-10 border border-white/10">
              <i className="fas fa-chevron-left text-xs"></i>
            </button>
            <button onClick={nextImage} className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center rounded-full bg-black/20 backdrop-blur-md text-white opacity-0 group-hover:opacity-100 transition-all hover:bg-blue-500 z-10 border border-white/10">
              <i className="fas fa-chevron-right text-xs"></i>
            </button>
          </>
        )}

        {/* Badge Vente Premium */}
        <div className="absolute top-5 left-5 z-20">
          <span className="bg-blue-600 text-white text-[9px] font-black px-4 py-2 rounded-full uppercase tracking-[0.2em] shadow-lg flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></span>
            Disponible à la vente
          </span>
        </div>
      </div>

      {/* --- INFOS VÉHICULE --- */}
      <div className="p-7 flex-1 flex flex-col">
        <div className="mb-4">
          <h3 className="text-2xl font-black text-white uppercase tracking-tighter italic">
            {vehicle?.marque} <span className="text-blue-500">{vehicle?.modele}</span>
          </h3>
          <div className="flex items-center gap-2 mt-1">
            <i className="fas fa-shield-alt text-blue-500 text-[10px]"></i>
            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Certification Prestige</p>
          </div>
        </div>
        
        {/* Specs techniques */}
        <div className="grid grid-cols-2 gap-3 mb-8">
          <div className="bg-white/[0.03] border border-white/5 p-3 rounded-2xl">
            <p className="text-[8px] text-gray-500 font-black uppercase mb-1">État Moteur</p>
            <span className="text-[10px] font-bold text-white uppercase tracking-wider">
              <i className="fas fa-gas-pump text-blue-500 mr-2"></i>{vehicle?.carburant}
            </span>
          </div>
          <div className="bg-white/[0.03] border border-white/5 p-3 rounded-2xl">
            <p className="text-[8px] text-gray-500 font-black uppercase mb-1">Kilométrage</p>
            <span className="text-[10px] font-bold text-white uppercase tracking-wider">
              <i className="fas fa-tachometer-alt text-blue-500 mr-2"></i>{displayKm} KM
            </span>
          </div>
        </div>

        {/* --- PRIX ET ACTION --- */}
        <div className="mt-auto pt-6 border-t border-white/5 flex items-center justify-between">
          <div>
            <p className="text-[9px] text-blue-500 font-black uppercase tracking-[0.2em] mb-1">Prix de cession</p>
            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-black text-white tracking-tighter">{displayPrice}</span>
              <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">FCFA</span>
            </div>
          </div>

          <Link 
            to={`/vehicule/${vehicle?.id}`}
            className="w-14 h-14 bg-white hover:bg-blue-600 text-black hover:text-white rounded-2xl flex items-center justify-center transition-all duration-500 shadow-xl"
          >
            <i className="fas fa-shopping-bag text-lg"></i>
          </Link>
        </div>
      </div>
    </div>
  )
}