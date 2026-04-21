import { useState } from 'react'
import { Link } from 'react-router-dom'
import API_BASE_URL from '../api/config'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

// Badges de statut Premium
const STATUS_LABELS = {
  pending: { label: 'En attente', cls: 'bg-amber-500/10 text-amber-500 border-amber-500/20', icon: 'fa-hourglass-half' },
  confirmed: { label: 'Confirmée', cls: 'bg-green-500/10 text-green-400 border-green-500/20', icon: 'fa-check-circle' },
  completed: { label: 'Terminée', cls: 'bg-white/5 text-gray-300 border-white/10', icon: 'fa-flag-checkered' },
  cancelled: { label: 'Annulée', cls: 'bg-red-500/10 text-red-400 border-red-500/20', icon: 'fa-times-circle' },
}

export default function MesReservations() {
  const [whatsapp, setWhatsapp] = useState('')
  const [reservations, setReservations] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSearch(e) {
    e.preventDefault()
    if (!whatsapp.trim()) return
    setLoading(true); setError(''); setReservations(null)
    try {
      const res = await fetch(`${API_BASE_URL}/api/reservations/whatsapp/${encodeURIComponent(whatsapp.trim())}`)
      const data = await res.json()
      if (data.success) {
        setReservations(data.data)
      } else {
        setError(data.message || 'Erreur lors de la recherche')
      }
    } catch {
      setError('Erreur de connexion au serveur')
    } finally {
      setLoading(false)
    }
  }

  function formatDate(d) {
    if (!d) return '—'
    return new Date(d).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' })
  }

  return (
    <>
      <Navbar />
      
      <main className="relative min-h-screen bg-[#050505] pt-32 pb-24 overflow-hidden">
        {/* Éclairage d'ambiance (Ambient Glow) */}
        <div className="absolute top-[10%] left-[-10%] w-[500px] h-[500px] bg-orange-600/10 rounded-full blur-[150px] pointer-events-none" />
        <div className="absolute bottom-[-10%] right-[-5%] w-[600px] h-[600px] bg-white/[0.02] rounded-full blur-[120px] pointer-events-none" />

        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6">
          
          {/* En-tête */}
          <div className="text-center mb-12 md:mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 mb-6 backdrop-blur-md">
              <span className="w-1.5 h-1.5 rounded-full bg-orange-500 shadow-[0_0_10px_rgba(249,115,22,1)] animate-pulse"></span>
              <span className="text-gray-300 text-[10px] font-bold tracking-widest uppercase">Espace Client</span>
            </div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-black mb-4 text-white tracking-tight">
              Vos <span className="bg-gradient-to-r from-orange-400 to-orange-600 bg-clip-text text-transparent">Réservations</span>
            </h1>
            <p className="text-sm md:text-base text-gray-400 max-w-lg mx-auto font-light leading-relaxed">
              Consultez le statut de vos dossiers en cours en saisissant le numéro utilisé lors de votre réservation.
            </p>
          </div>

          {/* Formulaire de Recherche */}
          <div className="max-w-2xl mx-auto mb-16 relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-orange-500/20 to-transparent rounded-[2rem] blur-lg opacity-50 group-hover:opacity-70 transition duration-500"></div>
            
            <form onSubmit={handleSearch} className="relative bg-[#0a0a0a]/80 backdrop-blur-2xl rounded-2xl md:rounded-[1.5rem] p-6 border border-white/10 shadow-2xl">
              <label className="block text-gray-400 text-[10px] font-semibold uppercase tracking-widest mb-3">
                <i className="fab fa-whatsapp text-orange-500 mr-2" />Numéro WhatsApp
              </label>
              <div className="flex flex-col sm:flex-row gap-3 md:gap-4">
                <input
                  type="tel"
                  value={whatsapp}
                  onChange={e => setWhatsapp(e.target.value)}
                  placeholder="Ex: 0700000000"
                  required
                  className="flex-1 px-4 py-3.5 rounded-xl bg-black/50 border border-white/10 focus:border-orange-500 outline-none text-white text-sm transition-all placeholder-gray-600"
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-white/5 hover:bg-orange-500 border border-white/10 hover:border-orange-500 text-white hover:text-black px-8 py-3.5 rounded-xl font-bold uppercase tracking-widest text-[10px] md:text-xs transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 sm:w-auto w-full"
                >
                  {loading ? <i className="fas fa-spinner fa-spin" /> : "Rechercher"}
                </button>
              </div>
              {error && (
                <div className="mt-4 p-3 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-2">
                  <i className="fas fa-exclamation-circle text-red-500 text-sm" />
                  <p className="text-red-400 text-xs font-medium">{error}</p>
                </div>
              )}
            </form>
          </div>

          {/* Résultats */}
          {reservations !== null && (
            reservations.length === 0 ? (
              <div className="text-center py-16 bg-white/[0.02] rounded-[2rem] border border-white/5 backdrop-blur-md animate-fadeIn">
                <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6">
                  <i className="fas fa-search text-2xl text-gray-500" />
                </div>
                <p className="text-white text-lg font-bold mb-2">Aucun dossier trouvé</p>
                <p className="text-gray-400 text-sm font-light">Vérifiez le numéro WhatsApp saisi.</p>
              </div>
            ) : (
              <div className="space-y-6 md:space-y-8 animate-fadeIn">
                <div className="flex items-center gap-3 border-b border-white/10 pb-4">
                  <span className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-orange-500 text-xs font-bold border border-white/10">{reservations.length}</span>
                  <p className="text-white text-xs font-bold tracking-widest uppercase">Dossier{reservations.length > 1 ? 's' : ''} en cours</p>
                </div>

                {reservations.map(r => {
                  const status = STATUS_LABELS[r.status] || { label: r.status, cls: 'bg-white/5 text-gray-400 border-white/10', icon: 'fa-info-circle' }
                  const days = r.start_date && r.end_date
                    ? Math.ceil((new Date(r.end_date) - new Date(r.start_date)) / (1000 * 60 * 60 * 24))
                    : 0

                  return (
                    <div key={r.id} className="group bg-white/[0.02] rounded-[1.5rem] md:rounded-[2rem] border border-white/5 hover:border-orange-500/30 hover:bg-white/[0.03] transition-all duration-500 overflow-hidden">
                      
                      {/* En-tête de la carte */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 md:px-8 md:py-6 border-b border-white/5 bg-black/20">
                        <div>
                          <p className="text-gray-500 text-[10px] uppercase tracking-widest mb-1 font-semibold">Référence du dossier</p>
                          <p className="text-white font-mono text-sm md:text-base">#{r.id}</p>
                        </div>
                        <span className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-[10px] md:text-xs font-bold uppercase tracking-widest border ${status.cls} self-start sm:self-auto`}>
                          <i className={`fas ${status.icon}`} /> {status.label}
                        </span>
                      </div>

                      {/* Corps de la carte */}
                      <div className="p-5 md:p-8">
                        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-6">
                          
                          {/* Infos Véhicule & Logistique (Prend 8 colonnes) */}
                          <div className="md:col-span-8 space-y-6">
                            <div>
                              <p className="text-gray-500 text-[10px] uppercase tracking-widest mb-1.5 font-semibold">Modèle réservé</p>
                              <h3 className="font-bold text-white text-lg md:text-xl">{r.vehicle_name}</h3>
                            </div>

                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 md:gap-6">
                              <div>
                                <p className="text-gray-500 text-[9px] uppercase tracking-widest mb-1">Du</p>
                                <p className="text-gray-300 text-xs md:text-sm font-medium">{formatDate(r.start_date)}</p>
                              </div>
                              <div>
                                <p className="text-gray-500 text-[9px] uppercase tracking-widest mb-1">Au</p>
                                <p className="text-gray-300 text-xs md:text-sm font-medium">{formatDate(r.end_date)}</p>
                              </div>
                              <div className="col-span-2 sm:col-span-1">
                                <p className="text-gray-500 text-[9px] uppercase tracking-widest mb-1">Durée</p>
                                <p className="text-gray-300 text-xs md:text-sm font-medium">{days} jour{days > 1 ? 's' : ''}</p>
                              </div>
                            </div>

                            {r.pickup_location && (
                              <div className="flex items-start gap-3 bg-black/40 p-4 rounded-xl border border-white/5">
                                <i className="fas fa-map-marker-alt text-orange-500 mt-0.5" />
                                <div>
                                  <p className="text-gray-500 text-[9px] uppercase tracking-widest mb-0.5 font-semibold">Lieu de livraison</p>
                                  <p className="text-gray-300 text-xs">{r.pickup_location}</p>
                                </div>
                              </div>
                            )}

                            {/* Alertes conditionnelles de statut */}
                            {r.status === 'pending' && (
                              <div className="border-l-2 border-amber-500 pl-4 py-1">
                                <p className="text-amber-400 text-[10px] md:text-xs font-light">
                                  Votre réservation est en cours d'analyse. Un conseiller vous confirmera la disponibilité sous peu.
                                </p>
                              </div>
                            )}
                            {r.status === 'confirmed' && (
                              <div className="border-l-2 border-green-500 pl-4 py-1">
                                <p className="text-green-400 text-[10px] md:text-xs font-light">
                                  Validation réussie. Préparez une pièce d'identité valide pour la remise des clés.
                                </p>
                              </div>
                            )}
                          </div>

                          {/* Infos Tarification & Actions (Prend 4 colonnes) */}
                          <div className="md:col-span-4 flex flex-col justify-between border-t md:border-t-0 md:border-l border-white/5 pt-6 md:pt-0 md:pl-6 gap-6">
                            <div>
                              <p className="text-gray-500 text-[10px] uppercase tracking-widest mb-2 font-semibold">Total Estimé</p>
                              <p className="text-3xl md:text-4xl font-black bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent mb-2">
                                {r.total_price?.toLocaleString('fr-FR')} <span className="text-base text-orange-500">FCFA</span>
                              </p>
                              {r.promo_code && (
                                <p className="text-green-400 text-[10px] uppercase tracking-widest font-semibold flex items-center gap-1.5">
                                  <i className="fas fa-tag" /> Code {r.promo_code} appliqué
                                </p>
                              )}
                            </div>

                            <div className="flex flex-col gap-3">
                              {r.vehicle_id && (
                                <Link
                                  to={`/vehicule/${r.vehicle_id}`}
                                  className="w-full text-center py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-[10px] md:text-xs font-bold uppercase tracking-widest text-white transition-all"
                                >
                                  Fiche Véhicule
                                </Link>
                              )}
                              <a
                                href={`https://wa.me/2250779562825?text=${encodeURIComponent(`Bonjour, je souhaite un suivi sur mon dossier de réservation #${r.id}`)}`}
                                target="_blank"
                                rel="noreferrer"
                                className="w-full flex items-center justify-center gap-2 py-3 bg-green-500/10 hover:bg-green-500/20 border border-green-500/20 rounded-xl text-[10px] md:text-xs font-bold uppercase tracking-widest text-green-400 transition-all"
                              >
                                <i className="fab fa-whatsapp text-sm" /> Contacter
                              </a>
                            </div>
                          </div>
                          
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            )
          )}
        </div>
      </main>
      
      <Footer />
    </>
  )
}