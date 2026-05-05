import { useState } from "react"
import { Link } from "react-router-dom" // Pour la navigation vers les détails

export default function VehicleCard({ vehicle }) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  
  // LOGIQUE MERN : Si images est une chaîne JSON venant de MySQL, on la parse
  const getImages = () => {
    try {
      if (Array.isArray(vehicle?.images)) return vehicle.images
      if (typeof vehicle?.images === 'string') return JSON.parse(vehicle.images)
    } catch (e) {
      console.error("Erreur parsing images", e)
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

  const displayPrice = (vehicle?.prix || 0).toLocaleString('fr-FR')

  return (
    <div className="relative group bg-white/[0.02] border border-white/10 rounded-[2rem] overflow-hidden hover:bg-white/[0.04] hover:border-orange-500/30 transition-all duration-500 flex flex-col shadow-2xl">
      
      {/* --- CARROUSEL D'IMAGES --- */}
      <div className="relative w-full h-64 overflow-hidden bg-[#0a0a0a]">
        <img 
          src={images[currentImageIndex]} 
          alt={`${vehicle?.marque} ${vehicle?.modele}`} 
          className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" 
        />
        
        {/* Overlay dégradé pour la lisibilité des badges */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30" />

        {images.length > 1 && (
          <>
            <button onClick={prevImage} className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center rounded-full bg-black/20 backdrop-blur-md text-white opacity-0 group-hover:opacity-100 transition-all hover:bg-orange-500 z-10 border border-white/10">
              <i className="fas fa-chevron-left text-xs"></i>
            </button>
            <button onClick={nextImage} className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center rounded-full bg-black/20 backdrop-blur-md text-white opacity-0 group-hover:opacity-100 transition-all hover:bg-orange-500 z-10 border border-white/10">
              <i className="fas fa-chevron-right text-xs"></i>
            </button>
          </>
        )}

        {/* Badges d'état XXL */}
        <div className="absolute top-4 left-4 flex flex-col gap-2 z-20">
          <span className="bg-white/10 backdrop-blur-xl border border-white/20 text-white text-[9px] font-black px-3 py-1.5 rounded-full uppercase tracking-[0.2em] shadow-xl">
            {vehicle?.categorie || "PRESTIGE"}
          </span>
          {vehicle?.chauffeurObligatoire && (
            <span className="bg-orange-500 text-black text-[9px] font-black px-3 py-1.5 rounded-full shadow-[0_0_20px_rgba(249,115,22,0.4)] animate-pulse uppercase tracking-wider">
              <i className="fas fa-user-tie mr-1.5"></i> {vehicle.badgeInfo || "Chauffeur Inclus"}
            </span>
          )}
        </div>
      </div>

      {/* --- CONTENU --- */}
      <div className="p-7 flex-1 flex flex-col">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-2xl font-black text-white uppercase tracking-tighter italic">
              {vehicle?.marque} <span className="text-orange-500">{vehicle?.modele}</span>
            </h3>
            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-[0.3em] mt-1">Série {vehicle?.annee || '2024'}</p>
          </div>
        </div>
        
        {/* Specs minimalistes */}
        <div className="flex gap-3 mb-8">
          <div className="flex-1 bg-white/[0.03] border border-white/5 p-3 rounded-2xl text-center">
            <i className="fas fa-cogs text-orange-500/50 text-[10px] mb-1 block"></i>
            <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">{vehicle?.transmission?.substring(0, 4)}</span>
          </div>
          <div className="flex-1 bg-white/[0.03] border border-white/5 p-3 rounded-2xl text-center">
            <i className="fas fa-gas-pump text-orange-500/50 text-[10px] mb-1 block"></i>
            <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">{vehicle?.carburant?.substring(0, 3)}</span>
          </div>
          <div className="flex-1 bg-white/[0.03] border border-white/5 p-3 rounded-2xl text-center">
            <i className="fas fa-tachometer-alt text-orange-500/50 text-[10px] mb-1 block"></i>
            <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">KM {vehicle?.kilometrage || '0'}</span>
          </div>
        </div>

        {/* --- FOOTER CARD --- */}
        <div className="mt-auto pt-6 border-t border-white/5 flex items-center justify-between">
          <div>
            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-black text-white tracking-tighter">{displayPrice}</span>
              <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">FCFA</span>
            </div>
            <p className="text-[9px] text-orange-500 font-black uppercase tracking-[0.2em] mt-1">Tarif Journalier</p>
          </div>

          <Link 
            to={`/vehicule/${vehicle?.id}`}
            className="w-14 h-14 bg-orange-500 hover:bg-white text-black rounded-2xl flex items-center justify-center transition-all duration-500 group-hover:rotate-[-5deg] shadow-xl shadow-orange-500/10"
          >
            <i className="fas fa-arrow-right text-lg"></i>
          </Link>
        </div>
      </div>
    </div>
  )
}