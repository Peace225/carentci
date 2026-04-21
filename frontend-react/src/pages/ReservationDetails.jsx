import { useState, useEffect } from 'react'
import { useSearchParams, Link } from 'react-router-dom'

export default function ReservationDetails() {
  const [params] = useSearchParams()
  const [showDetails, setShowDetails] = useState(false)
  const [animateOut, setAnimateOut] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimateOut(true)
      setTimeout(() => setShowDetails(true), 800) // Délai pour l'animation de sortie
    }, 3500)
    return () => clearTimeout(timer)
  }, [])

  const data = {
    id: params.get('id') || 'REQ-0000',
    client: params.get('client') || 'Non renseigné',
    whatsapp: params.get('whatsapp') || '-',
    vehicle: params.get('vehicle') || '-',
    quantity: params.get('quantity') || '1',
    startDate: params.get('startDate') || '-',
    endDate: params.get('endDate') || '-',
    days: params.get('days') || '0',
    locationType: params.get('locationType') === 'avec' ? "Tarification Hors Abidjan" : 'Tarification Zone Abidjan',
    pickup: params.get('pickup') || '-',
    totalPrice: parseInt(params.get('totalPrice') || 0).toLocaleString('fr-FR'),
    pricePerDay: parseInt(params.get('pricePerDay') || 0).toLocaleString('fr-FR'),
    message: params.get('message') || '',
  }

  // ==========================================
  // ÉCRAN 1 : OVERLAY DE VALIDATION PREMIUM
  // ==========================================
  if (!showDetails) {
    return (
      <div 
        className={`fixed inset-0 z-50 bg-[#050505] flex items-center justify-center p-4 transition-opacity duration-700 ${animateOut ? 'opacity-0' : 'opacity-100'}`}
        onClick={() => { setAnimateOut(true); setTimeout(() => setShowDetails(true), 500) }}
      >
        {/* Lumière d'ambiance */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] md:w-[500px] h-[300px] md:h-[500px] bg-orange-600/10 rounded-full blur-[100px] pointer-events-none" />
        
        <div className="relative z-10 flex flex-col items-center text-center cursor-pointer">
          {/* Cercle de validation animé */}
          <div className="relative w-24 h-24 md:w-32 md:h-32 mb-8 flex items-center justify-center">
            <div className="absolute inset-0 border border-white/10 rounded-full"></div>
            <div className="absolute inset-0 border-t-2 border-orange-500 rounded-full animate-spin"></div>
            <i className="fas fa-check text-2xl md:text-4xl text-orange-500"></i>
          </div>

          <p className="text-orange-500 text-[10px] md:text-xs font-bold uppercase tracking-widest mb-4">Transmission Réussie</p>
          <h1 className="text-2xl md:text-4xl font-light text-white tracking-wide mb-8">Votre dossier a été validé.</h1>

          {/* Carte Privilège "Bonus" */}
          <div className="bg-gradient-to-r from-white/[0.05] to-transparent border border-white/10 rounded-2xl p-4 md:p-6 flex items-center gap-4 md:gap-5 backdrop-blur-md max-w-sm w-full">
            <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-orange-500/10 border border-orange-500/30 flex items-center justify-center flex-shrink-0">
              <i className="fas fa-crown text-orange-500 text-sm md:text-base" />
            </div>
            <div className="text-left">
              <p className="text-white text-[10px] md:text-xs font-bold uppercase tracking-widest mb-1">Avantage Privilège</p>
              <p className="text-gray-400 text-[10px] md:text-xs font-light">100 points de fidélité crédités sur votre profil.</p>
            </div>
          </div>

          <p className="text-gray-600 text-[10px] uppercase tracking-widest mt-12 animate-pulse">Cliquer pour voir le reçu</p>
        </div>
      </div>
    )
  }

  // ==========================================
  // ÉCRAN 2 : LE REÇU DE RÉSERVATION
  // ==========================================
  return (
    <div className="min-h-screen bg-[#050505] py-24 px-4 flex items-center justify-center relative overflow-hidden">
      {/* Background Ambient Lights */}
      <div className="absolute top-0 left-0 w-[400px] h-[400px] bg-orange-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-white/[0.02] rounded-full blur-[120px] pointer-events-none" />

      <div className="relative z-10 w-full max-w-4xl">
        
        {/* Bouton Retour */}
        <Link to="/" className="inline-flex items-center gap-2 text-gray-500 hover:text-white transition-colors mb-8 group">
          <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-white/10 transition-colors">
            <i className="fas fa-arrow-left text-[10px]" />
          </div>
          <span className="text-[10px] font-bold uppercase tracking-widest">Retour à l'accueil</span>
        </Link>

        {/* Reçu Principal */}
        <div className="bg-[#0a0a0a]/80 backdrop-blur-2xl rounded-[2rem] border border-white/10 shadow-2xl overflow-hidden relative">
          
          {/* Filigrane (Watermark) */}
          <div className="absolute -top-10 -right-10 text-[150px] text-white/[0.02] pointer-events-none">
            <i className="fas fa-file-signature" />
          </div>

          {/* En-tête du reçu */}
          <div className="p-8 md:p-12 border-b border-white/5 flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-500/10 border border-green-500/20 mb-4">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                <span className="text-green-400 text-[9px] font-bold tracking-widest uppercase">Réservation Confirmée</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-black text-white tracking-tight mb-2">Dossier Client</h2>
              <p className="text-gray-500 text-xs font-light">Réf: <span className="text-white font-mono">{data.id}</span></p>
            </div>
            
            <div className="w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center flex-shrink-0">
              <i className="fas fa-car text-orange-500 text-xl md:text-2xl" />
            </div>
          </div>

          {/* Corps du reçu (Grilles de données) */}
          <div className="p-8 md:p-12 grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16">
            
            {/* Bloc 1 : Souscripteur & Véhicule */}
            <div className="space-y-8">
              <div>
                <h4 className="text-gray-500 text-[10px] font-bold uppercase tracking-widest mb-4 border-b border-white/5 pb-2">Informations Souscripteur</h4>
                <div className="space-y-4">
                  <div>
                    <p className="text-gray-600 text-[9px] uppercase tracking-widest mb-1">Nom complet</p>
                    <p className="text-white text-sm font-medium">{data.client}</p>
                  </div>
                  <div>
                    <p className="text-gray-600 text-[9px] uppercase tracking-widest mb-1">Contact WhatsApp</p>
                    <p className="text-white text-sm font-medium">{data.whatsapp}</p>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-gray-500 text-[10px] font-bold uppercase tracking-widest mb-4 border-b border-white/5 pb-2">Véhicule Sélectionné</h4>
                <div className="space-y-4">
                  <div>
                    <p className="text-gray-600 text-[9px] uppercase tracking-widest mb-1">Modèle</p>
                    <p className="text-orange-400 text-sm font-bold">{data.vehicle}</p>
                  </div>
                  <div>
                    <p className="text-gray-600 text-[9px] uppercase tracking-widest mb-1">Quantité</p>
                    <p className="text-white text-sm font-medium">{data.quantity} unité{data.quantity > 1 ? 's' : ''}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Bloc 2 : Logistique */}
            <div className="space-y-8">
              <div>
                <h4 className="text-gray-500 text-[10px] font-bold uppercase tracking-widest mb-4 border-b border-white/5 pb-2">Période de Location</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-gray-600 text-[9px] uppercase tracking-widest mb-1">Départ</p>
                    <p className="text-white text-sm font-medium">{data.startDate}</p>
                  </div>
                  <div>
                    <p className="text-gray-600 text-[9px] uppercase tracking-widest mb-1">Retour</p>
                    <p className="text-white text-sm font-medium">{data.endDate}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-gray-600 text-[9px] uppercase tracking-widest mb-1">Durée Totale</p>
                    <p className="text-white text-sm font-medium">{data.days} jour{data.days > 1 ? 's' : ''}</p>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-gray-500 text-[10px] font-bold uppercase tracking-widest mb-4 border-b border-white/5 pb-2">Paramètres Logistiques</h4>
                <div className="space-y-4">
                  <div>
                    <p className="text-gray-600 text-[9px] uppercase tracking-widest mb-1">Zone de tarification</p>
                    <p className="text-white text-sm font-medium">{data.locationType}</p>
                  </div>
                  <div>
                    <p className="text-gray-600 text-[9px] uppercase tracking-widest mb-1">Point de livraison</p>
                    <p className="text-white text-sm font-medium">{data.pickup}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Message optionnel */}
            {data.message && (
              <div className="col-span-1 md:col-span-2 mt-2">
                <h4 className="text-gray-500 text-[10px] font-bold uppercase tracking-widest mb-3 border-b border-white/5 pb-2">Directives Particulières</h4>
                <p className="text-gray-300 text-xs font-light italic leading-relaxed bg-white/[0.02] p-4 rounded-xl border border-white/5">
                  "{data.message}"
                </p>
              </div>
            )}
          </div>

          {/* Bloc de Facturation Total */}
          <div className="bg-gradient-to-r from-white/[0.02] to-white/[0.05] border-t border-white/10 p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest mb-1">Montant total estimé</p>
              <p className="text-gray-500 text-[10px] font-light">
                {data.pricePerDay} FCFA/jour × {data.days} jrs × {data.quantity} véh.
              </p>
            </div>
            
            <div className="text-center md:text-right">
              <span className="text-4xl md:text-5xl font-black bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
                {data.totalPrice} <span className="text-xl md:text-2xl text-orange-500">FCFA</span>
              </span>
            </div>
          </div>

        </div>

        <div className="text-center mt-8">
          <p className="text-gray-600 text-[10px] uppercase tracking-widest">
            Un conseiller vous contactera dans les plus brefs délais via WhatsApp.
          </p>
        </div>

      </div>
    </div>
  )
}