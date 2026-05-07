import { useState, useMemo } from "react"
import { useQuery } from "@tanstack/react-query"
import VehicleCard from "./VehicleCard"
import SaleVehicleCard from "./SaleVehicleCard"
import { fetchRentalVehicles, fetchSaleVehicles } from "../api/vehicles"

const BRANDS = ["BAIC", "Bestune", "BMW", "Changan", "Chery", "Chevrolet", "Ford", "GAC", "Great Wall", "Haval", "Honda", "Hyundai", "Isuzu", "Jetour", "Kaiyi", "Kia", "Mazda", "Mercedes", "MG", "Mitsubishi", "Nissan", "Range Rover", "Soueast", "Suzuki", "Toyota"]
const VEHICLE_TYPES = ["berline", "luxe", "suv", "4x4", "mariage", "pickup", "minibus"]
const PAGE_SIZE = 6

export default function ShowroomSection() {
  const [mode, setMode] = useState("rental") // "rental" ou "sale"
  const [rentalShown, setRentalShown] = useState(PAGE_SIZE)
  const [saleShown, setSaleShown] = useState(PAGE_SIZE)

  const [filters, setFilters] = useState({
    marque: "all",
    typeVehicule: "",
    annee: "",
    transmission: "", 
    carburant: "", 
    kilometrageMax: "",
    prixMax: "",
    zone: "Abidjan" 
  })

  const isRental = mode === "rental"

  // 1. Fetching des données avec TanStack Query
  const { data: rentals = [], isLoading: loadingRental } = useQuery({ 
    queryKey: ["rental"], 
    queryFn: fetchRentalVehicles 
  })
  
  const { data: sales = [], isLoading: loadingSale } = useQuery({ 
    queryKey: ["sale"], 
    queryFn: fetchSaleVehicles 
  })

  // 2. Logique de filtrage mémorisée pour la performance
  const filteredVehicles = useMemo(() => {
    const rawData = isRental ? rentals : sales
    
    let result = rawData.filter(v => {
      // Correspondance avec les noms de colonnes de ton backend/Supabase
      const vMarque = v.brand || v.marque;
      const vType = v.specifications?.category_type || v.categorie || v.type;
      const vAnnee = v.year || v.annee;
      const vTrans = v.specifications?.transmission || v.transmission;
      const vCarb = v.specifications?.fuel || v.carburant;
      const vKm = v.specifications?.mileage || v.kilometrage || 0;
      
      // Gestion des prix selon location ou vente (Supabase columns)
      const vPrix = isRental ? (v.price_per_day || v.prix) : (v.sale_price || v.prix);

      const matchMarque = filters.marque === "all" || vMarque === filters.marque
      const matchType = !filters.typeVehicule || vType?.toLowerCase() === filters.typeVehicule.toLowerCase()
      const matchAnnee = !filters.annee || vAnnee?.toString() === filters.annee
      const matchTrans = !filters.transmission || vTrans === filters.transmission
      const matchCarb = !filters.carburant || vCarb === filters.carburant
      const matchKm = !filters.kilometrageMax || vKm <= parseInt(filters.kilometrageMax)
      const matchPrix = !filters.prixMax || (vPrix || 0) <= parseInt(filters.prixMax)
      
      return matchMarque && matchType && matchAnnee && matchTrans && matchCarb && matchKm && matchPrix
    })

    // Logique métier spécifique à la Location (Zone & Chauffeur)
    if (isRental && filters.zone === "Hors Abidjan") {
      return result.map(v => ({
        ...v,
        prixOriginal: v.price_per_day || v.prix,
        prix: (v.price_per_day || v.prix || 0) + 10000,
        chauffeurObligatoire: true,
        badgeInfo: "Chauffeur inclus"
      }))
    }

    return result
  }, [isRental, rentals, sales, filters])

  const visibleVehicles = filteredVehicles.slice(0, isRental ? rentalShown : saleShown)

  const handleFilterChange = (e) => {
    const { name, value } = e.target
    setFilters(prev => ({ ...prev, [name]: value }))
    isRental ? setRentalShown(PAGE_SIZE) : setSaleShown(PAGE_SIZE)
  }

  const resetFilters = () => {
    setFilters({marque: "all", typeVehicule: "", annee: "", transmission: "", carburant: "", kilometrageMax: "", prixMax: "", zone: "Abidjan"})
  }

  return (
    <section id="showroom" className="relative py-20 px-4 bg-[#050505] transition-colors duration-700">
      {/* Background Glow */}
      <div className={`absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-[500px] rounded-full blur-[120px] pointer-events-none opacity-20 transition-colors duration-1000 ${isRental ? 'bg-orange-600' : 'bg-blue-600'}`} />

      <div className="relative z-10 max-w-7xl mx-auto">
        
        {/* Switch Mode Location/Vente */}
        <div className="flex justify-center mb-16">
          <div className="inline-flex p-1 bg-white/5 border border-white/10 rounded-full backdrop-blur-xl">
            <button 
              onClick={() => { setMode("rental"); resetFilters(); }}
              className={`px-10 py-3.5 rounded-full text-xs font-black uppercase tracking-[0.2em] transition-all duration-500 ${isRental ? 'bg-orange-500 text-black shadow-lg shadow-orange-500/20' : 'text-gray-400 hover:text-white'}`}
            >
              Location
            </button>
            <button 
              onClick={() => { setMode("sale"); resetFilters(); }}
              className={`px-10 py-3.5 rounded-full text-xs font-black uppercase tracking-[0.2em] transition-all duration-500 ${!isRental ? 'bg-white text-black shadow-lg shadow-white/20' : 'text-gray-400 hover:text-white'}`}
            >
              Vente
            </button>
          </div>
        </div>

        {/* Titre Dynamique */}
        <div className="text-center mb-12">
           <h2 className="text-4xl md:text-6xl font-black text-white tracking-tighter uppercase italic">
            {isRental ? "Flotte" : "Catalogue"} <span className={isRental ? "text-orange-500" : "text-blue-500"}>{isRental ? "Premium" : "Prestige"}</span>
          </h2>
          <p className="text-gray-500 text-[10px] md:text-xs font-bold uppercase tracking-[0.5em] mt-4">
            {isRental ? "Mobilité XXL à Abidjan" : "Investissez dans l'excellence"}
          </p>
        </div>

        {/* Filtre par Marques (Scrollable) */}
        <div className="flex gap-3 overflow-x-auto pb-8 mb-4 hide-scrollbar select-none">
          <button
            onClick={() => setFilters(p => ({...p, marque: 'all'}))}
            className={`px-8 py-3.5 rounded-2xl text-[10px] font-black uppercase tracking-widest border transition-all ${filters.marque === 'all' ? 'bg-orange-500 border-orange-500 text-black' : 'bg-white/5 border-white/10 text-gray-400 hover:border-white/20'}`}
          >
            Toutes
          </button>
          {BRANDS.map(brand => (
            <button
              key={brand}
              onClick={() => setFilters(p => ({...p, marque: brand}))}
              className={`px-8 py-3.5 rounded-2xl text-[10px] font-black uppercase tracking-widest border transition-all whitespace-nowrap ${filters.marque === brand ? 'bg-orange-500 border-orange-500 text-black' : 'bg-white/5 border-white/10 text-gray-400 hover:border-white/20'}`}
            >
              {brand}
            </button>
          ))}
        </div>

        {/* Panneau de Filtres Secondaires */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 bg-white/[0.02] border border-white/10 p-6 rounded-[2rem] mb-12">
          {isRental && (
            <div className="col-span-full mb-2 flex flex-col md:flex-row gap-4 items-center justify-between bg-white/5 p-4 rounded-2xl border border-white/5">
              <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Périmètre de circulation :</span>
              <div className="flex bg-black p-1 rounded-xl">
                <button onClick={() => setFilters(p => ({...p, zone: 'Abidjan'}))} className={`px-6 py-2 rounded-lg text-[10px] font-black uppercase transition-all ${filters.zone === 'Abidjan' ? 'bg-white text-black' : 'text-gray-500'}`}>Abidjan</button>
                <button onClick={() => setFilters(p => ({...p, zone: 'Hors Abidjan'}))} className={`px-6 py-2 rounded-lg text-[10px] font-black uppercase transition-all ${filters.zone === 'Hors Abidjan' ? 'bg-orange-500 text-black' : 'text-gray-500'}`}>Hors Abidjan</button>
              </div>
            </div>
          )}
          
          <select name="typeVehicule" value={filters.typeVehicule} onChange={handleFilterChange} className="select-premium">
            <option value="">Type</option>
            {VEHICLE_TYPES.map(t => <option key={t} value={t}>{t.toUpperCase()}</option>)}
          </select>
          <input name="annee" type="number" placeholder="ANNÉE" value={filters.annee} onChange={handleFilterChange} className="input-premium" />
          <select name="transmission" value={filters.transmission} onChange={handleFilterChange} className="select-premium">
            <option value="">Transmission</option>
            <option value="Automatique">AUTO</option>
            <option value="Manuel">MANUEL</option>
          </select>
          <select name="carburant" value={filters.carburant} onChange={handleFilterChange} className="select-premium">
            <option value="">Carburant</option>
            <option value="Essence">ESSENCE</option>
            <option value="Gasoil">GASOIL</option>
          </select>
          <input name="prixMax" type="number" placeholder="PRIX MAX" value={filters.prixMax} onChange={handleFilterChange} className="input-premium col-span-1 lg:col-span-2" />
        </div>

        {/* Grille de résultats */}
        {loadingRental || loadingSale ? (
          <div className="h-64 flex items-center justify-center">
            <div className="w-12 h-12 border-4 border-orange-500/20 border-t-orange-500 rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 min-h-[400px]">
            {visibleVehicles.length > 0 ? (
              visibleVehicles.map(v => (
                isRental 
                  ? <VehicleCard key={v.id} vehicle={v} /> 
                  : <SaleVehicleCard key={v.id} vehicle={v} />
              ))
            ) : (
              <div className="col-span-full py-20 text-center border-2 border-dashed border-white/5 rounded-[3rem]">
                <p className="text-gray-600 font-black uppercase tracking-widest italic">Aucun véhicule disponible pour ces critères</p>
                <button onClick={resetFilters} className="mt-4 text-orange-500 text-[10px] font-black uppercase underline">Réinitialiser les filtres</button>
              </div>
            )}
          </div>
        )}

        {/* Pagination */}
        {filteredVehicles.length > visibleVehicles.length && (
          <div className="mt-20 text-center">
            <button 
              onClick={() => isRental ? setRentalShown(p => p + PAGE_SIZE) : setSaleShown(p => p + PAGE_SIZE)}
              className="px-12 py-5 bg-white text-black rounded-2xl font-black uppercase text-[11px] tracking-[0.3em] hover:bg-orange-500 transition-all active:scale-95 shadow-xl"
            >
              Découvrir plus de modèles
            </button>
          </div>
        )}
      </div>

      {/* CORRECTION DU WARNING JSX */}
      <style dangerouslySetInnerHTML={{ __html: `
        .select-premium, .input-premium {
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 1rem;
          padding: 1rem;
          color: white;
          font-size: 10px;
          font-weight: 900;
          letter-spacing: 0.1em;
          outline: none;
          transition: all 0.3s;
        }
        .select-premium:focus, .input-premium:focus {
          border-color: #f97316;
          background: rgba(255, 255, 255, 0.06);
        }
        .hide-scrollbar::-webkit-scrollbar { display: none; }
      `}} />
    </section>
  )
}