import { useState, useRef, useEffect } from "react"

const LOCALITES_CI = [
  "Abidjan","Abobo","Adjamé","Attécoubé","Cocody","Koumassi","Marcory","Plateau","Port-Bouët","Treichville","Yopougon","Bingerville","Anyama","Songon","Jacqueville",
  "Yamoussoukro","Bouaké","Daloa","San-Pédro","Korhogo","Man","Gagnoa","Abengourou","Divo","Soubré","Bondoukou","Odienné","Séguéla","Touba","Ferkessédougou","Katiola","Dimbokro",
  "Agboville","Adzopé","Aboisso","Grand-Bassam","Sassandra","Tabou","Guiglo","Duékoué","Bangolo","Danané","Biankouma","Issia","Vavoua","Bouaflé","Sinfra","Oumé","Lakota",
  "Tiassalé","Sikensi","Taabo","Toumodi","Didiévi","Bocanda","Bongouanou","M'Batto","Arrah","Daoukro","Tanda","Nassian","Koun-Fao","Transua","Bouna","Doropo","Tehini",
  "Boundiali","Tengrela","Kouto","Gbon","Mankono","Kounahiri","Kani","Dianra","Minignan","Madinani","Gbéléban","Samatiguila","Ouangolodougou","Kong","Niakara",
  "Dabakala","Niakaramandougou","Tafiré","Béoumi","Sakassou","Botro","M'Bahiakro","Zuénoula","Kouibly","Facobly","Méagui","Buyo","Gueyo","Grabo","Fresco","Guitry",
  "Grand-Lahou","Dabou","Alépé","Bonoua","Adiaké","Tiapoum","Ayamé","Bianouan","Agnibilékrou","Zaranou","Bettié","Tiébissou","Djékanou","Bodokro",
  "Assinie","Grand-Drewin","Noé","Taï","Zagné","Diégonéfla","Sipilou","Logoualé","Zouan-Hounien","Koro","Worofla","Booko","Siempurgo","Sinématiali","Dikodougou",
  "M'Bengué","Niellé","Ouangolodougou","Zoukougbeu","Bonon","Ouragahio","Gnagbodougnoa","Djouroutou","Néko","Kouassi-Kouassikro","Yakassé-Attobrou"
].sort()

export default function HeroSection() {
  const [searchCity, setSearchCity] = useState("")
  const [cityDropdownOpen, setCityDropdownOpen] = useState(false)
  const cityRef = useRef(null)
  const [searchStartDate, setSearchStartDate] = useState("")
  const [searchEndDate, setSearchEndDate] = useState("")
  const [searchStartTime, setSearchStartTime] = useState("")
  const [searchEndTime, setSearchEndTime] = useState("")
  const [searchDriverType, setSearchDriverType] = useState("")

  const today = new Date().toISOString().split("T")[0]
  const searchDays = searchStartDate && searchEndDate ? Math.ceil((new Date(searchEndDate) - new Date(searchStartDate)) / (1000*60*60*24)) : 0

  useEffect(() => {
    function handleClickOutside(e) {
      if (cityRef.current && !cityRef.current.contains(e.target)) setCityDropdownOpen(false)
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  function handleSearch(e) {
    e.preventDefault()
    document.getElementById("vehicules-location")?.scrollIntoView({ behavior: "smooth" })
  }

  return (
    <section id="accueil" className="relative min-h-screen flex items-center justify-center overflow-hidden pt-28 pb-16 lg:pt-32 lg:pb-12">
      {/* Background & Overlays */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-cover bg-center bg-fixed transform scale-105" style={{backgroundImage:"url('https://images.unsplash.com/photo-1502877338535-766e1452684a?w=1920&q=80')"}} />
        <div className="absolute inset-0 bg-gradient-to-b from-black/95 via-black/70 to-black/95 lg:from-black/90 lg:via-black/60 lg:to-black/90" />
      </div>

      {/* Decorative ambient lights (Réduits sur mobile) */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none hidden md:block">
        <div className="absolute top-1/4 left-10 w-[300px] lg:w-[500px] h-[300px] lg:h-[500px] bg-orange-600/20 rounded-full blur-[100px] lg:blur-[120px]" />
        <div className="absolute bottom-1/4 right-10 w-[400px] lg:w-[600px] h-[400px] lg:h-[600px] bg-orange-500/10 rounded-full blur-[120px] lg:blur-[150px]" />
      </div>

      {/* Grid Pattern */}
      <div className="absolute inset-0 z-0 opacity-[0.02] lg:opacity-[0.03]" style={{backgroundImage:"linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)", backgroundSize:"30px 30px lg:40px lg:40px"}} />

      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 flex flex-col lg:flex-row items-center gap-10 lg:gap-20">
        
        {/* Left Content - Typography */}
        <div className="flex-1 text-center lg:text-left mt-4 lg:mt-0">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 lg:px-4 lg:py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md mb-6 lg:mb-8">
            <span className="flex h-1.5 w-1.5 lg:h-2 lg:w-2 rounded-full bg-orange-500 animate-pulse"></span>
            <span className="text-gray-300 text-[10px] lg:text-xs font-semibold tracking-widest uppercase">Service Premium CI</span>
          </div>
          
          {/* Typographie ajustée pour Mobile/Tablette/Desktop */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-[5.5rem] font-black mb-4 lg:mb-6 leading-[1.1] tracking-tight">
            <span className="block text-white">L'Excellence</span>
            <span className="block bg-gradient-to-r from-orange-300 via-orange-500 to-orange-600 bg-clip-text text-transparent pb-1 lg:pb-2">Automobile.</span>
          </h1>
          
          <p className="text-base sm:text-lg lg:text-xl text-gray-400 mb-8 lg:mb-10 font-light max-w-xl lg:max-w-2xl mx-auto lg:mx-0 leading-relaxed px-2 lg:px-0">
            Louez ou achetez des véhicules d'exception en <span className="text-white font-medium">Côte d'Ivoire</span>. Une flotte minutieusement sélectionnée pour un confort absolu.
          </p>
          
          {/* Statistiques (Passent en grille 3 colonnes sur mobile, flex sur desktop) */}
          <div className="grid grid-cols-3 lg:flex lg:flex-wrap lg:justify-start gap-4 lg:gap-8 text-gray-400 px-4 lg:px-0">
            <div className="flex flex-col items-center lg:items-start gap-0.5 lg:gap-1">
              <span className="text-white font-bold text-lg lg:text-xl">100%</span>
              <span className="text-[9px] lg:text-xs uppercase tracking-wider font-semibold text-orange-500">Assuré</span>
            </div>
            <div className="w-px h-10 lg:h-12 bg-white/10 hidden lg:block"></div>
            <div className="flex flex-col items-center lg:items-start gap-0.5 lg:gap-1 border-x border-white/10 lg:border-none px-2 lg:px-0">
              <span className="text-white font-bold text-lg lg:text-xl">24/7</span>
              <span className="text-[9px] lg:text-xs uppercase tracking-wider font-semibold text-orange-500">Assistance</span>
            </div>
            <div className="w-px h-10 lg:h-12 bg-white/10 hidden lg:block"></div>
            <div className="flex flex-col items-center lg:items-start gap-0.5 lg:gap-1">
              <span className="text-white font-bold text-lg lg:text-xl">+1000</span>
              <span className="text-[9px] lg:text-xs uppercase tracking-wider font-semibold text-orange-500">Clients</span>
            </div>
          </div>
        </div>

        {/* Right Content - Form (Ultra Premium Glassmorphism) */}
        <div className="w-full max-w-md md:max-w-lg relative group mt-8 lg:mt-0">
          <div className="absolute -inset-1 bg-gradient-to-r from-orange-500/30 to-orange-600/30 rounded-[2rem] lg:rounded-[2.5rem] blur-lg lg:blur-xl opacity-40 lg:opacity-50 group-hover:opacity-75 transition duration-500 hidden sm:block"></div>
          
          <div className="relative bg-[#0a0a0a]/80 lg:bg-[#0a0a0a]/60 backdrop-blur-2xl rounded-[1.5rem] lg:rounded-[2rem] p-6 lg:p-8 shadow-2xl border border-white/10">
            <div className="mb-6 lg:mb-8 text-center lg:text-left">
              <h3 className="text-xl lg:text-2xl font-bold text-white mb-1.5 lg:mb-2">Réservez votre véhicule</h3>
              <p className="text-xs lg:text-sm text-gray-400">Renseignez vos critères pour une offre sur mesure.</p>
            </div>

            <form onSubmit={handleSearch} className="space-y-4 lg:space-y-5">
              {/* Destination */}
              <div>
                <label className="block text-gray-400 text-[10px] lg:text-xs font-semibold uppercase tracking-wider mb-1.5 lg:mb-2">Destination</label>
                <div className="relative" ref={cityRef}>
                  <div className="absolute inset-y-0 left-3 lg:left-4 flex items-center pointer-events-none">
                    <i className="fas fa-map-marker-alt text-orange-500 text-sm" />
                  </div>
                  <input
                    type="text"
                    value={searchCity}
                    onChange={e => { setSearchCity(e.target.value); setCityDropdownOpen(true) }}
                    onFocus={() => setCityDropdownOpen(true)}
                    placeholder="Ex: Abidjan, Assinie..."
                    className="w-full pl-10 pr-3 py-3 lg:pl-11 lg:pr-4 lg:py-3.5 rounded-xl bg-white/5 border border-white/10 focus:border-orange-500 focus:bg-white/10 outline-none text-white text-xs lg:text-sm transition-all placeholder-gray-600"
                    autoComplete="off"
                  />
                  {cityDropdownOpen && (
                    <ul className="absolute z-50 w-full bg-[#111] border border-white/10 rounded-xl shadow-2xl max-h-48 lg:max-h-56 overflow-y-auto mt-2 py-2 custom-scrollbar">
                      {LOCALITES_CI
                        .filter(l => l.toLowerCase().includes(searchCity.toLowerCase()))
                        .slice(0, 20)
                        .map(loc => (
                          <li
                            key={loc}
                            onMouseDown={() => { setSearchCity(loc); setCityDropdownOpen(false) }}
                            className="px-3 py-2 lg:px-4 lg:py-2.5 text-xs lg:text-sm text-gray-300 hover:bg-white/5 hover:text-white cursor-pointer transition-colors flex items-center gap-2 lg:gap-3"
                          >
                            <i className="fas fa-location-arrow text-gray-600 text-[10px] lg:text-xs" />{loc}
                          </li>
                        ))
                      }
                      {LOCALITES_CI.filter(l => l.toLowerCase().includes(searchCity.toLowerCase())).length === 0 && (
                        <li className="px-3 py-2.5 lg:px-4 lg:py-3 text-xs lg:text-sm text-gray-500 italic text-center">Aucune localité trouvée</li>
                      )}
                    </ul>
                  )}
                </div>
              </div>

              {/* Dates */}
              <div className="grid grid-cols-2 gap-3 lg:gap-4">
                <div>
                  <label className="block text-gray-400 text-[10px] lg:text-xs font-semibold uppercase tracking-wider mb-1.5 lg:mb-2">Départ</label>
                  <input type="date" min={today} value={searchStartDate} onChange={e => setSearchStartDate(e.target.value)}
                    className="w-full px-3 py-3 lg:px-4 lg:py-3.5 rounded-xl bg-white/5 border border-white/10 focus:border-orange-500 focus:bg-white/10 outline-none text-white text-xs lg:text-sm transition-all [color-scheme:dark]" />
                </div>
                <div>
                  <label className="block text-gray-400 text-[10px] lg:text-xs font-semibold uppercase tracking-wider mb-1.5 lg:mb-2">Retour</label>
                  <input type="date" min={searchStartDate || today} value={searchEndDate} onChange={e => setSearchEndDate(e.target.value)}
                    className="w-full px-3 py-3 lg:px-4 lg:py-3.5 rounded-xl bg-white/5 border border-white/10 focus:border-orange-500 focus:bg-white/10 outline-none text-white text-xs lg:text-sm transition-all [color-scheme:dark]" />
                </div>
              </div>

              {searchDays === 1 && (
                <div className="flex items-center gap-2 p-2.5 lg:p-3 bg-red-500/10 border border-red-500/20 rounded-xl">
                  <i className="fas fa-exclamation-circle text-red-500 text-xs lg:text-sm" />
                  <p className="text-red-400 text-[10px] lg:text-xs font-medium">Réservation min. 2 jours</p>
                </div>
              )}

              {/* Heures */}
              <div className="grid grid-cols-2 gap-3 lg:gap-4">
                <div>
                  <label className="block text-gray-400 text-[10px] lg:text-xs font-semibold uppercase tracking-wider mb-1.5 lg:mb-2">Heure Dép.</label>
                  <input type="time" value={searchStartTime} onChange={e => setSearchStartTime(e.target.value)}
                    className="w-full px-3 py-3 lg:px-4 lg:py-3.5 rounded-xl bg-white/5 border border-white/10 focus:border-orange-500 focus:bg-white/10 outline-none text-white text-xs lg:text-sm transition-all [color-scheme:dark]" />
                </div>
                <div>
                  <label className="block text-gray-400 text-[10px] lg:text-xs font-semibold uppercase tracking-wider mb-1.5 lg:mb-2">Heure Ret.</label>
                  <input type="time" value={searchEndTime} onChange={e => setSearchEndTime(e.target.value)}
                    className="w-full px-3 py-3 lg:px-4 lg:py-3.5 rounded-xl bg-white/5 border border-white/10 focus:border-orange-500 focus:bg-white/10 outline-none text-white text-xs lg:text-sm transition-all [color-scheme:dark]" />
                </div>
              </div>

              {/* Type de location */}
              <div>
                <label className="block text-gray-400 text-[10px] lg:text-xs font-semibold uppercase tracking-wider mb-1.5 lg:mb-2">Formule</label>
                <select value={searchDriverType} onChange={e => setSearchDriverType(e.target.value)}
                  className="w-full px-3 py-3 lg:px-4 lg:py-3.5 rounded-xl bg-white/5 border border-white/10 focus:border-orange-500 focus:bg-white/10 outline-none text-white text-xs lg:text-sm transition-all appearance-none cursor-pointer">
                  <option value="" className="bg-gray-900">Sélectionnez une formule</option>
                  <option value="with" className="bg-gray-900">Avec chauffeur dédié</option>
                  <option value="without" className="bg-gray-900">Sans chauffeur</option>
                </select>
              </div>

              <button type="submit" className="relative w-full group overflow-hidden rounded-xl mt-2 lg:mt-4">
                <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-orange-400 transition-transform duration-300 group-hover:scale-105"></div>
                <div className="relative px-4 py-3.5 lg:px-6 lg:py-4 flex items-center justify-center gap-2 lg:gap-3 text-black font-black uppercase tracking-widest text-[11px] lg:text-sm">
                  <span>Rechercher</span>
                  <i className="fas fa-arrow-right transition-transform group-hover:translate-x-1" />
                </div>
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  )
}