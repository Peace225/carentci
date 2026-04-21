import { useState, useRef, useEffect } from "react"
import { useQuery } from "@tanstack/react-query"
import VehicleCard from "./VehicleCard"
import SaleVehicleCard from "./SaleVehicleCard"
import { fetchRentalVehicles, fetchSaleVehicles } from "../api/vehicles"

const RENTAL_CATS = ["all","berline","luxe","suv","4x4","mariage","pickup","minibus"]
const SALE_CATS = ["all","berline","luxe","suv","4x4","pickup","minibus"]
const CAT_LABELS = { all:"Tous", berline:"Berline", luxe:"Luxe", suv:"SUV", "4x4":"4x4", mariage:"Mariage", pickup:"Pick-up", minibus:"Minibus" }
const PAGE_SIZE = 6

export default function ShowroomSection() {
  // Mode de la section : "rental" (Location) ou "sale" (Vente)
  const [mode, setMode] = useState("rental")

  // États pour la Location
  const [rentalFilter, setRentalFilter] = useState("all")
  const [rentalShown, setRentalShown] = useState(PAGE_SIZE)
  
  // États pour la Vente
  const [saleFilter, setSaleFilter] = useState("all")
  const [saleShown, setSaleShown] = useState(PAGE_SIZE)

  // Requêtes
  const { data: rentalVehicles = [], isLoading: loadingRental } = useQuery({ queryKey: ["rental-vehicles"], queryFn: fetchRentalVehicles })
  const { data: saleVehicles = [], isLoading: loadingSale } = useQuery({ queryKey: ["sale-vehicles"], queryFn: fetchSaleVehicles })

  // Filtrage
  const filteredRental = rentalFilter === "all" ? rentalVehicles : rentalVehicles.filter(v => v.category === rentalFilter)
  const visibleRental = filteredRental.slice(0, rentalShown)

  const filteredSale = saleFilter === "all" ? saleVehicles : saleVehicles.filter(v => v.category === saleFilter)
  const visibleSale = filteredSale.slice(0, saleShown)

  // Variables dynamiques selon le mode actif
  const isRental = mode === "rental"
  const isLoading = isRental ? loadingRental : loadingSale
  const activeCats = isRental ? RENTAL_CATS : SALE_CATS
  const activeFilter = isRental ? rentalFilter : saleFilter
  const setActiveFilter = isRental ? setRentalFilter : setSaleFilter
  const setActiveShown = isRental ? setRentalShown : setSaleShown

  return (
    <section id="showroom" className="relative py-16 md:py-24 px-4 bg-[#050505] overflow-hidden">
      {/* Halo de lumière en arrière-plan */}
      <div className={`absolute top-0 left-1/2 -translate-x-1/2 w-full md:w-[80%] h-[300px] md:h-[500px] rounded-full blur-[80px] md:blur-[120px] pointer-events-none transition-colors duration-1000 ${isRental ? 'bg-orange-600/5' : 'bg-white/5'}`} />

      <div className="relative z-10 max-w-7xl mx-auto">
        
        {/* Toggle Switch Premium (Ajusté pour mobile) */}
        <div className="flex justify-center mb-10 md:mb-16 w-full max-w-md mx-auto">
          <div className="inline-flex p-1.5 bg-white/[0.02] border border-white/10 rounded-full backdrop-blur-md shadow-2xl relative w-full sm:w-auto">
            <button 
              onClick={() => setMode("rental")}
              className={`relative z-10 flex-1 sm:flex-none px-4 sm:px-8 py-3 md:py-3.5 rounded-full text-[10px] sm:text-xs font-bold uppercase tracking-widest transition-all duration-500 ${isRental ? 'text-black' : 'text-gray-400 hover:text-white'}`}
            >
              Location
            </button>
            <button 
              onClick={() => setMode("sale")}
              className={`relative z-10 flex-1 sm:flex-none px-4 sm:px-8 py-3 md:py-3.5 rounded-full text-[10px] sm:text-xs font-bold uppercase tracking-widest transition-all duration-500 ${!isRental ? 'text-black' : 'text-gray-400 hover:text-white'}`}
            >
              Vente
            </button>
            
            {/* Pilule animée */}
            <div 
              className={`absolute top-1.5 bottom-1.5 w-[calc(50%-0.375rem)] bg-gradient-to-r from-orange-400 to-orange-500 rounded-full shadow-[0_0_20px_rgba(249,115,22,0.4)] transition-transform duration-500 ease-out`}
              style={{ transform: isRental ? 'translateX(0)' : 'translateX(100%)' }}
            />
          </div>
        </div>

        {/* En-tête dynamique */}
        <div className="text-center mb-10 md:mb-16 transition-all duration-500">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 md:px-4 md:py-2 rounded-full bg-orange-500/10 border border-orange-500/20 mb-4 md:mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-orange-500 shadow-[0_0_10px_rgba(249,115,22,1)] animate-pulse"></span>
            <span className="text-orange-500 text-[10px] md:text-xs font-bold tracking-widest uppercase">
              {isRental ? "Showroom Virtuel" : "Acquisition Premium"}
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black mb-4 md:mb-6 text-white tracking-tight">
            {isRental ? (
              <>Flotte <span className="bg-gradient-to-r from-orange-400 to-orange-600 bg-clip-text text-transparent">Location</span></>
            ) : (
              <>Nos Véhicules <span className="text-white">en Vente</span></>
            )}
          </h2>
          <p className="text-sm md:text-base lg:text-lg text-gray-400 max-w-xl mx-auto font-light leading-relaxed px-2 md:px-0">
            {isRental 
              ? "Découvrez une sélection rigoureuse de véhicules haut de gamme, entretenus avec une précision chirurgicale pour vous garantir un confort absolu."
              : "Trouvez le véhicule de vos rêves parmi notre sélection de voitures d'occasion expertisées et certifiées en excellent état."
            }
          </p>
        </div>

        {/* Statistiques Premium dynamiques (Scroll horizontal sur mobile) */}
        <div className="flex overflow-x-auto pb-6 mb-8 md:mb-16 -mx-4 px-4 md:mx-0 md:px-0 snap-x snap-mandatory md:grid md:grid-cols-3 gap-4 md:gap-6 max-w-4xl mx-auto custom-scrollbar">
          {(isRental ? [
            {v:"50+", l:"Véhicules Exclusifs", icon:"fa-car"},
            {v:"100%", l:"Couverture Tous Risques", icon:"fa-shield-alt"},
            {v:"24/7", l:"Conciergerie Dédiée", icon:"fa-headset"}
          ] : [
            {v:"30+", l:"Véhicules Certifiés", icon:"fa-check-double"},
            {v:"100%", l:"Garantie Incluse", icon:"fa-file-contract"},
            {v:"Négociables", l:"Prix Compétitifs", icon:"fa-handshake"}
          ]).map((s,i) => (
            <div key={i + mode} className="flex-none w-[80%] sm:w-[60%] md:w-auto snap-center flex flex-col items-center justify-center p-6 md:p-8 rounded-2xl md:rounded-[2rem] bg-white/[0.02] border border-white/5 backdrop-blur-md hover:bg-white/[0.04] hover:border-white/10 transition-all duration-500 group animate-fadeIn">
              <i className={`fas ${s.icon} text-2xl md:text-3xl text-orange-500/40 mb-3 md:mb-4 group-hover:text-orange-500 group-hover:scale-110 transition-all duration-300`} />
              <p className="text-2xl md:text-3xl lg:text-4xl font-black text-white mb-1.5 md:mb-2">{s.v}</p>
              <p className="text-gray-500 text-[10px] md:text-xs uppercase tracking-widest font-semibold">{s.l}</p>
            </div>
          ))}
        </div>

        {/* Filtres Catégories (Scroll horizontal sur mobile) */}
        <div className="relative mb-10 md:mb-16">
          {/* Masques de fondu pour indiquer le scroll sur mobile */}
          <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-[#050505] to-transparent z-10 md:hidden pointer-events-none"></div>
          <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-[#050505] to-transparent z-10 md:hidden pointer-events-none"></div>
          
          <div className="flex overflow-x-auto pb-4 -mx-4 px-4 md:mx-0 md:px-0 md:flex-wrap md:justify-center gap-2 md:gap-3 custom-scrollbar hide-scrollbar-mobile">
            {activeCats.map(cat => (
              <button key={cat} onClick={() => { setActiveFilter(cat); setActiveShown(PAGE_SIZE) }}
                className={`flex-none px-5 md:px-6 py-2.5 md:py-3 rounded-xl text-[10px] md:text-xs font-bold uppercase tracking-widest transition-all duration-300 border ${
                  activeFilter === cat 
                  ? "bg-orange-500 border-orange-400 text-black shadow-[0_0_15px_rgba(249,115,22,0.3)] md:shadow-[0_0_20px_rgba(249,115,22,0.3)] scale-[1.02] md:scale-105" 
                  : "bg-white/5 border-white/10 text-gray-400 hover:bg-white/10 hover:text-white hover:border-white/20"
                }`}>
                {CAT_LABELS[cat] || cat}
              </button>
            ))}
          </div>
        </div>

        {/* Grille de Véhicules */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-12 md:py-20 gap-4">
            <div className="w-10 h-10 md:w-12 md:h-12 border-4 border-white/10 border-t-orange-500 rounded-full animate-spin" />
            <p className="text-gray-500 text-[10px] md:text-sm uppercase tracking-widest font-semibold">
              {isRental ? "Préparation du showroom..." : "Recherche des véhicules..."}
            </p>
          </div>
        ) : (
          <>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 min-h-[300px] md:min-h-[400px]">
              {isRental ? (
                visibleRental.map(v => <VehicleCard key={v.id} vehicle={v} />)
              ) : (
                visibleSale.map(v => <SaleVehicleCard key={v.id} vehicle={v} />)
              )}
              
              {((isRental && filteredRental.length === 0) || (!isRental && filteredSale.length === 0)) && (
                <div className="col-span-full flex flex-col items-center justify-center py-16 md:py-20 bg-white/[0.02] border border-white/5 rounded-2xl md:rounded-[2rem] animate-fadeIn px-4 text-center">
                  <i className="fas fa-car-crash text-3xl md:text-4xl text-gray-700 mb-3 md:mb-4" />
                  <p className="text-gray-400 text-sm md:text-lg">Aucun véhicule disponible dans cette catégorie pour le moment.</p>
                </div>
              )}
            </div>

            {/* Bouton "Voir Plus" dynamique */}
            {((isRental && filteredRental.length > rentalShown) || (!isRental && filteredSale.length > saleShown)) && (
              <div className="text-center mt-12 md:mt-16 animate-fadeIn">
                <button onClick={() => setActiveShown(n => n + PAGE_SIZE)}
                  className="group relative inline-flex items-center justify-center gap-2 md:gap-3 px-6 md:px-8 py-3.5 md:py-4 bg-white/5 border border-white/10 rounded-xl text-white font-bold uppercase tracking-widest text-[10px] md:text-sm hover:bg-white/10 hover:border-orange-500/50 transition-all overflow-hidden w-full sm:w-auto">
                  <div className="absolute inset-0 bg-gradient-to-r from-orange-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <span className="relative">Dévoiler la suite</span>
                  <i className="fas fa-arrow-down relative group-hover:translate-y-1 transition-transform duration-300 text-xs" />
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Petit utilitaire CSS pour cacher la scrollbar sur mobile mais garder le scroll */}
      <style dangerouslySetInnerHTML={{__html: `
        .hide-scrollbar-mobile::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar-mobile {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}} />
    </section>
  )
}