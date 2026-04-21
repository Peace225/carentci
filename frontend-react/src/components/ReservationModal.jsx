import { useState, useEffect } from "react"
import { createReservation } from "../api/reservations"
import { validatePromoCode } from "../api/promoCodes"
import { getDiscount, formatPrice, formatDate } from "../utils/discount"
import { SESSION_ID } from "../api/config"

const DELIVERY_FEE = 10000
const DRIVER_FEE_PER_DAY = 10000

export default function ReservationModal({ vehicle, onClose }) {
  const [form, setForm] = useState({
    clientName: "", clientWhatsapp: "", startDate: "", endDate: "",
    startTime: "08:00", endTime: "08:00", locationType: "sans",
    driverType: "", destination: "", pickupLocation: "", quantity: 1, message: ""
  })
  const [conditionsAccepted, setConditionsAccepted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [promoCode, setPromoCode] = useState("")
  const [promoResult, setPromoResult] = useState(null)
  const [promoLoading, setPromoLoading] = useState(false)
  const [promoError, setPromoError] = useState("")
  const [driverWarning, setDriverWarning] = useState("")

  const today = new Date().toISOString().split("T")[0]

  const days = form.startDate && form.endDate
    ? Math.ceil((new Date(form.endDate) - new Date(form.startDate)) / (1000 * 60 * 60 * 24))
    : 0

  useEffect(() => {
    if (form.driverType === "without") {
      const horsAbidjan = form.locationType === "avec"
      const allowed = horsAbidjan
        ? vehicle.autoriseSansHorsAbidjan !== false
        : vehicle.autoriseSansAbidjan !== false
      if (!allowed) {
        setDriverWarning("Ce véhicule n'est pas autorisé sans chauffeur " + (horsAbidjan ? "hors Abidjan" : "à Abidjan") + ". Veuillez choisir Avec chauffeur.")
      } else {
        setDriverWarning("")
      }
    } else {
      setDriverWarning("")
    }
  }, [form.driverType, form.locationType, vehicle])

  const basePricePerDay = form.locationType === "avec" ? vehicle.priceWith : vehicle.priceWithout
  const driverFeeTotal = form.driverType === "with" ? DRIVER_FEE_PER_DAY * days : 0
  const pricePerDay = basePricePerDay + (form.driverType === "with" ? DRIVER_FEE_PER_DAY : 0)
  const discount = days >= 2 ? getDiscount(days) : 0
  const caution = form.driverType === "without" ? (form.locationType === "avec" ? 15000 : 10000) : 0
  const subtotal = days >= 2 ? (pricePerDay * days * form.quantity) - (discount * form.quantity) + DELIVERY_FEE + caution : 0
  const promoDiscount = promoResult ? Math.round(subtotal * promoResult.discount_percentage / 100) : 0
  const total = subtotal - promoDiscount

  function set(field, value) { setForm(f => ({ ...f, [field]: value })) }

  async function handlePromoValidate() {
    if (!promoCode.trim() || !form.clientWhatsapp.trim()) {
      setPromoError("Entrez votre WhatsApp et le code promo")
      return
    }
    setPromoLoading(true); setPromoError(""); setPromoResult(null)
    try {
      const res = await validatePromoCode(promoCode.trim(), form.clientWhatsapp.trim())
      if (res.success) { setPromoResult(res.data) }
      else { setPromoError(res.message || "Code invalide") }
    } catch { setPromoError("Erreur de validation") }
    finally { setPromoLoading(false) }
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (days < 2) return alert("Durée minimale : 2 jours")
    if (!conditionsAccepted) return alert("Veuillez accepter les conditions")
    if (form.quantity > vehicle.stock) return alert("Seulement " + vehicle.stock + " disponible(s)")
    if (driverWarning) return alert(driverWarning)
    setLoading(true)
    try {
      const res = await createReservation({
        client_name: form.clientName, client_whatsapp: form.clientWhatsapp,
        vehicle_id: vehicle.id, start_date: form.startDate, start_time: form.startTime,
        end_date: form.endDate, end_time: form.endTime, pickup_location: form.pickupLocation,
        with_driver: form.locationType === "avec", driver_type: form.driverType,
        quantity: form.quantity, message: form.message, session_id: SESSION_ID,
        promo_code: promoResult ? promoCode : null
      })
      if (res.success) {
        const vehicleUrl = window.location.origin + "/v/" + vehicle.id
        const priceLabel = form.locationType === "avec" ? "Prix Hors d'Abidjan" : "Prix Abidjan"
        const driverLabel = form.driverType === "with" ? "Avec chauffeur" : "Sans chauffeur"
        let priceDetails = "*MONTANT:* " + formatPrice(basePricePerDay * days * form.quantity)
        if (driverFeeTotal > 0) priceDetails += "\n*CHAUFFEUR:* " + formatPrice(driverFeeTotal)
        if (discount > 0) priceDetails += "\n*REMISE:* -" + formatPrice(discount * form.quantity)
        priceDetails += "\n*Livraison:* " + formatPrice(DELIVERY_FEE)
        if (caution > 0) priceDetails += "\n*Caution:* " + formatPrice(caution)
        if (promoDiscount > 0) priceDetails += "\n*Promo (" + promoResult.discount_percentage + "%):* -" + formatPrice(promoDiscount)
        const adminMsg = "*NOUVELLE RESERVATION " + res.data.id + "*\n\n*Client:* " + form.clientName + "\n*WhatsApp:* " + form.clientWhatsapp + "\n\n*Vehicule:* " + vehicle.name + "\n\n*Voir:*\n" + vehicleUrl + "\n\n*Du:* " + formatDate(form.startDate) + " à " + form.startTime + "\n*Au:* " + formatDate(form.endDate) + " à " + form.endTime + "\n*Duree:* " + days + " jour" + (days > 1 ? "s" : "") + "\n\n*" + priceLabel + "*\n*Type:* " + driverLabel + "\n*Destination:* " + (form.destination || "Non precisee") + "\n*Livraison:* " + form.pickupLocation + "\n\n" + priceDetails + "\n\n*TOTAL:* " + formatPrice(total) + "\n\n_www.carentci.com_"
        window.open("https://wa.me/2250779562825?text=" + encodeURIComponent(adminMsg), "_blank")
        onClose()
      } else { alert("Erreur : " + res.message) }
    } catch { alert("Erreur reseau") }
    finally { setLoading(false) }
  }

  return (
    <div className="fixed inset-0 bg-[#050505]/90 backdrop-blur-md z-50 flex items-center justify-center p-3 md:p-6" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="bg-[#0a0a0a] rounded-[1.5rem] md:rounded-[2rem] max-w-3xl w-full border border-white/10 relative max-h-[90vh] md:max-h-[95vh] flex flex-col overflow-hidden shadow-2xl">
        
        {/* Header Modal */}
        <div className="sticky top-0 z-20 bg-[#0a0a0a]/95 backdrop-blur-xl border-b border-white/5 p-4 md:p-6 flex items-center gap-4">
          <div className="bg-white/5 border border-white/10 w-12 h-12 md:w-14 md:h-14 rounded-xl flex items-center justify-center flex-shrink-0">
            <i className="fas fa-car text-orange-500 text-xl md:text-2xl" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-base md:text-xl font-bold text-white tracking-wide truncate">Réservation</h3>
            <p className="text-orange-500 font-semibold text-[10px] md:text-xs uppercase tracking-widest truncate">{vehicle.name}</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition-all flex-shrink-0">
            <i className="fas fa-times text-sm md:text-base" />
          </button>
        </div>

        {/* Corps Scrollable */}
        <div className="overflow-y-auto flex-1 p-4 md:p-6 custom-scrollbar">
          <form id="resForm" onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
            
            {/* Infos Client */}
            <div className="bg-white/[0.02] p-4 md:p-5 rounded-2xl border border-white/5">
              <h4 className="text-[10px] md:text-xs font-bold text-orange-500 mb-3 md:mb-4 uppercase tracking-widest flex items-center gap-2">
                <i className="fas fa-user-circle text-sm" /> Informations Client
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                <input required placeholder="Nom complet" value={form.clientName} onChange={e => set("clientName", e.target.value)} 
                  className="w-full px-4 py-2.5 md:py-3 rounded-xl bg-black/50 border border-white/10 focus:border-orange-500 outline-none text-white text-xs md:text-sm transition-colors" />
                <input required placeholder="WhatsApp (ex: 0700000000)" value={form.clientWhatsapp} onChange={e => set("clientWhatsapp", e.target.value)} 
                  className="w-full px-4 py-2.5 md:py-3 rounded-xl bg-black/50 border border-white/10 focus:border-orange-500 outline-none text-white text-xs md:text-sm transition-colors" />
              </div>
            </div>

            {/* Dates */}
            <div className="bg-white/[0.02] p-4 md:p-5 rounded-2xl border border-white/5">
              <h4 className="text-[10px] md:text-xs font-bold text-orange-500 mb-3 md:mb-4 uppercase tracking-widest flex items-center gap-2">
                <i className="fas fa-calendar-alt text-sm" /> Période de Location
              </h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
                <div className="col-span-2 md:col-span-1">
                  <label className="text-[10px] text-gray-400 mb-1.5 block uppercase tracking-wider font-semibold">Début</label>
                  <input required type="date" min={today} value={form.startDate} onChange={e => set("startDate", e.target.value)} 
                    className="w-full px-3 py-2.5 rounded-xl bg-black/50 border border-white/10 focus:border-orange-500 outline-none text-white text-xs [color-scheme:dark]" />
                </div>
                <div className="col-span-2 md:col-span-1">
                  <label className="text-[10px] text-gray-400 mb-1.5 block uppercase tracking-wider font-semibold">Fin</label>
                  <input required type="date" min={form.startDate || today} value={form.endDate} onChange={e => set("endDate", e.target.value)} 
                    className="w-full px-3 py-2.5 rounded-xl bg-black/50 border border-white/10 focus:border-orange-500 outline-none text-white text-xs [color-scheme:dark]" />
                </div>
                <div className="col-span-1">
                  <label className="text-[10px] text-gray-400 mb-1.5 block uppercase tracking-wider font-semibold">H. Dép.</label>
                  <input type="time" value={form.startTime} onChange={e => set("startTime", e.target.value)} 
                    className="w-full px-3 py-2.5 rounded-xl bg-black/50 border border-white/10 focus:border-orange-500 outline-none text-white text-xs [color-scheme:dark]" />
                </div>
                <div className="col-span-1">
                  <label className="text-[10px] text-gray-400 mb-1.5 block uppercase tracking-wider font-semibold">H. Ret.</label>
                  <input type="time" value={form.endTime} onChange={e => set("endTime", e.target.value)} 
                    className="w-full px-3 py-2.5 rounded-xl bg-black/50 border border-white/10 focus:border-orange-500 outline-none text-white text-xs [color-scheme:dark]" />
                </div>
              </div>
              {days > 0 && days < 2 && <div className="mt-3 p-2.5 bg-red-500/10 border border-red-500/20 rounded-xl"><p className="text-red-400 text-[11px] font-semibold text-center">Durée minimale requise : 2 jours</p></div>}
              {days >= 2 && <div className="mt-3 text-right"><span className="inline-block bg-white/5 border border-white/10 px-3 py-1 rounded-full text-white text-[10px] font-bold uppercase tracking-widest">{days} Jours validés</span></div>}
            </div>

            {/* Configuration */}
            <div className="bg-white/[0.02] p-4 md:p-5 rounded-2xl border border-white/5">
              <h4 className="text-[10px] md:text-xs font-bold text-orange-500 mb-3 md:mb-4 uppercase tracking-widest flex items-center gap-2">
                <i className="fas fa-cog text-sm" /> Paramètres
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4 mb-3">
                <div>
                  <label className="text-[10px] text-gray-400 mb-1.5 block uppercase tracking-wider font-semibold">Tarification</label>
                  <select value={form.locationType} onChange={e => set("locationType", e.target.value)} className="w-full px-4 py-2.5 md:py-3 rounded-xl bg-black/50 border border-white/10 focus:border-orange-500 outline-none text-white text-xs md:text-sm transition-colors cursor-pointer appearance-none">
                    <option value="sans" className="bg-[#111]">Zone Abidjan</option>
                    <option value="avec" className="bg-[#111]">Hors Abidjan</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] text-gray-400 mb-1.5 block uppercase tracking-wider font-semibold">Chauffeur</label>
                  <select required value={form.driverType} onChange={e => set("driverType", e.target.value)} className="w-full px-4 py-2.5 md:py-3 rounded-xl bg-black/50 border border-white/10 focus:border-orange-500 outline-none text-white text-xs md:text-sm transition-colors cursor-pointer appearance-none">
                    <option value="" className="bg-[#111]">À définir</option>
                    <option value="with" className="bg-[#111]">Avec Chauffeur Dédié</option>
                    <option value="without" className="bg-[#111]">Sans Chauffeur</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3 md:gap-4">
                <div>
                  <label className="text-[10px] text-gray-400 mb-1.5 block uppercase tracking-wider font-semibold text-center">Quantité ({vehicle.stock} max)</label>
                  <input type="number" min="1" max={vehicle.stock} value={form.quantity} onChange={e => set("quantity", parseInt(e.target.value))} 
                    className="w-full px-4 py-2 md:py-2.5 rounded-xl bg-orange-500/10 border border-orange-500/30 outline-none text-orange-400 font-bold text-sm text-center" />
                </div>
                <div>
                  <label className="text-[10px] text-gray-400 mb-1.5 block uppercase tracking-wider font-semibold text-center">Livraison</label>
                  <div className="w-full px-4 py-2 md:py-2.5 rounded-xl bg-white/5 border border-white/10 text-white font-bold text-xs md:text-sm text-center flex items-center justify-center h-[38px] md:h-[42px]">
                    {DELIVERY_FEE.toLocaleString("fr-FR")} FCFA
                  </div>
                </div>
              </div>

              {driverWarning && <div className="mt-3 p-3 bg-red-500/10 border border-red-500/20 rounded-xl"><p className="text-red-400 text-[11px] font-semibold">{driverWarning}</p></div>}
              {form.driverType === "with" && days >= 2 && <div className="mt-3 p-3 bg-white/5 border border-white/10 rounded-xl"><p className="text-gray-300 text-[11px]"><i className="fas fa-info-circle text-orange-500 mr-1.5" /> Forfait Chauffeur : <span className="font-bold text-white">{formatPrice(DRIVER_FEE_PER_DAY * days)}</span> (10 000 FCFA x {days} jrs)</p></div>}
              {form.driverType === "without" && <div className="mt-3 p-3 bg-white/5 border border-white/10 rounded-xl"><p className="text-gray-300 text-[11px]"><i className="fas fa-shield-alt text-orange-500 mr-1.5" /> Caution de garantie : <span className="font-bold text-white">{formatPrice(caution)}</span> (Restituée en fin de séjour)</p></div>}
            </div>

            {/* Logistique */}
            <div className="bg-white/[0.02] p-4 md:p-5 rounded-2xl border border-white/5">
              <h4 className="text-[10px] md:text-xs font-bold text-orange-500 mb-3 md:mb-4 uppercase tracking-widest flex items-center gap-2">
                <i className="fas fa-map-pin text-sm" /> Logistique
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4 mb-3 md:mb-4">
                <input required placeholder="Ville de destination" value={form.destination} onChange={e => set("destination", e.target.value)} list="dest-list" 
                  className="w-full px-4 py-2.5 md:py-3 rounded-xl bg-black/50 border border-white/10 focus:border-orange-500 outline-none text-white text-xs md:text-sm transition-colors" />
                <datalist id="dest-list">{["Abidjan","Yamoussoukro","Bouaké","Daloa","San-Pédro","Korhogo","Man","Abengourou","Grand-Bassam","Assinie"].map(c => <option key={c} value={c} />)}</datalist>
                <input required placeholder="Quartier de livraison" value={form.pickupLocation} onChange={e => set("pickupLocation", e.target.value)} 
                  className="w-full px-4 py-2.5 md:py-3 rounded-xl bg-black/50 border border-white/10 focus:border-orange-500 outline-none text-white text-xs md:text-sm transition-colors" />
              </div>
              <textarea placeholder="Directives particulières ou requêtes..." value={form.message} onChange={e => set("message", e.target.value)} rows={2} 
                className="w-full px-4 py-3 rounded-xl bg-black/50 border border-white/10 focus:border-orange-500 outline-none text-white text-xs md:text-sm transition-colors resize-none custom-scrollbar" />
            </div>

            {/* Code Promo */}
            <div className="bg-white/[0.02] p-4 md:p-5 rounded-2xl border border-white/5">
              <h4 className="text-[10px] md:text-xs font-bold text-orange-500 mb-3 md:mb-4 uppercase tracking-widest flex items-center gap-2">
                <i className="fas fa-ticket-alt text-sm" /> Avantage Privilège
              </h4>
              <div className="flex gap-2.5">
                <input placeholder="Saisir un code promo" value={promoCode} onChange={e => { setPromoCode(e.target.value.toUpperCase()); setPromoResult(null); setPromoError("") }} 
                  className="flex-1 px-4 py-2.5 md:py-3 rounded-xl bg-black/50 border border-white/10 focus:border-orange-500 outline-none text-white text-xs font-bold uppercase tracking-wider" />
                <button type="button" onClick={handlePromoValidate} disabled={promoLoading || !promoCode} 
                  className="px-5 py-2.5 md:py-3 bg-white/10 hover:bg-orange-500 border border-white/10 hover:border-orange-500 text-white rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all disabled:opacity-30 disabled:hover:bg-white/10">
                  {promoLoading ? <i className="fas fa-spinner fa-spin" /> : "Appliquer"}
                </button>
              </div>
              {promoResult && <div className="mt-3 p-2.5 bg-green-500/10 border border-green-500/20 rounded-xl"><p className="text-green-400 text-[11px] font-bold uppercase tracking-widest text-center">Avantage de {promoResult.discount_percentage}% validé</p></div>}
              {promoError && <p className="text-red-400 text-[10px] mt-2 text-center">{promoError}</p>}
            </div>

            {/* Conditions Générales (Rétractables / Scrollables) */}
            {form.driverType && (
              <div className="bg-black/50 rounded-2xl border border-white/5 overflow-hidden">
                <div className="flex items-center gap-2.5 px-4 md:px-5 py-3 md:py-4 bg-white/[0.02] border-b border-white/5">
                  <i className={`fas ${form.driverType === 'with' ? 'fa-user-tie' : 'fa-key'} text-gray-400`} />
                  <span className="text-white font-bold text-[10px] md:text-xs uppercase tracking-widest">
                    Règles — {form.driverType === 'with' ? 'Avec Chauffeur' : 'Sans Chauffeur'}
                  </span>
                </div>
                <div className="h-32 md:h-40 overflow-y-auto p-4 md:p-5 space-y-2.5 text-[11px] md:text-xs text-gray-400 font-light custom-scrollbar">
                  {form.driverType === 'with' ? (
                    <ul className="space-y-2">
                      <li className="flex gap-2"><i className="fas fa-angle-right text-orange-500 mt-0.5 flex-shrink-0" />Mise à disposition du chauffeur sur toute la période.</li>
                      <li className="flex gap-2"><i className="fas fa-angle-right text-orange-500 mt-0.5 flex-shrink-0" />Frais chauffeur (10 000 FCFA/jour) dus et non remboursables.</li>
                      <li className="flex gap-2"><i className="fas fa-angle-right text-orange-500 mt-0.5 flex-shrink-0" />Hébergement & restauration du chauffeur à la charge du client hors d'Abidjan.</li>
                      <li className="flex gap-2"><i className="fas fa-angle-right text-orange-500 mt-0.5 flex-shrink-0" />Minimum de facturation fixé à 2 jours pleins.</li>
                      <li className="flex gap-2"><i className="fas fa-angle-right text-orange-500 mt-0.5 flex-shrink-0" />Dommages exceptionnels à l'habitacle imputables au locataire.</li>
                      <li className="flex gap-2"><i className="fas fa-angle-right text-orange-500 mt-0.5 flex-shrink-0" />Politique d'annulation stricte applicable (Voir CGV).</li>
                    </ul>
                  ) : (
                    <ul className="space-y-2">
                      <li className="flex gap-2"><i className="fas fa-angle-right text-orange-500 mt-0.5 flex-shrink-0" />Exigence d'un permis valide (> 2 ans d'ancienneté) et âge minimal de 21 ans.</li>
                      <li className="flex gap-2"><i className="fas fa-angle-right text-orange-500 mt-0.5 flex-shrink-0" />Dépôt de garantie exigé à la remise des clés (10k-15k FCFA selon zone).</li>
                      <li className="flex gap-2"><i className="fas fa-angle-right text-orange-500 mt-0.5 flex-shrink-0" />Minimum de facturation fixé à 2 jours pleins.</li>
                      <li className="flex gap-2"><i className="fas fa-angle-right text-orange-500 mt-0.5 flex-shrink-0" />Responsabilité pleine et entière sur la mécanique et la carrosserie.</li>
                      <li className="flex gap-2"><i className="fas fa-angle-right text-orange-500 mt-0.5 flex-shrink-0" />Restitution avec niveau de carburant identique au départ.</li>
                      <li className="flex gap-2"><i className="fas fa-angle-right text-orange-500 mt-0.5 flex-shrink-0" />Sous-location strictement prohibée.</li>
                      <li className="flex gap-2"><i className="fas fa-angle-right text-orange-500 mt-0.5 flex-shrink-0" />Franchise accident incompressible de 100 000 FCFA.</li>
                    </ul>
                  )}
                </div>
              </div>
            )}

            {/* Acceptation */}
            <label className="flex items-start gap-3 md:gap-4 cursor-pointer bg-white/[0.02] p-4 md:p-5 rounded-2xl border border-white/5 hover:border-orange-500/30 transition-colors">
              <div className="relative flex-shrink-0 mt-0.5 md:mt-1">
                <input type="checkbox" checked={conditionsAccepted} onChange={e => setConditionsAccepted(e.target.checked)} className="sr-only" />
                <div className={`w-5 h-5 md:w-6 md:h-6 rounded-md border flex items-center justify-center transition-all ${conditionsAccepted ? 'bg-orange-500 border-orange-500' : 'bg-transparent border-gray-600'}`}>
                  {conditionsAccepted && <i className="fas fa-check text-black text-[10px] md:text-xs" />}
                </div>
              </div>
              <span className="text-[11px] md:text-xs text-gray-400 font-light leading-relaxed">
                Je confirme avoir pris connaissance des <a href="/conditions" target="_blank" rel="noreferrer" className="text-white font-semibold underline hover:text-orange-500 transition-colors">conditions de location</a> et m'engage à les respecter intégralement.
              </span>
            </label>

          </form>
        </div>

        {/* Footer Fixe */}
        <div className="sticky bottom-0 z-20 bg-[#0a0a0a]/95 backdrop-blur-xl border-t border-white/5 p-4 md:p-6">
          {days >= 2 && (
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-3 mb-4 md:mb-5">
              <div>
                <p className="text-gray-400 text-[10px] md:text-xs uppercase tracking-widest font-semibold mb-1">Montant total</p>
                {promoDiscount > 0 && <p className="text-orange-500 text-[10px] uppercase tracking-wider font-bold">Avantage -{formatPrice(promoDiscount)} inclus</p>}
              </div>
              <div className="text-2xl md:text-3xl font-black text-white">{formatPrice(total)}</div>
            </div>
          )}
          <button type="submit" form="resForm" disabled={loading || days < 2 || !conditionsAccepted || driverWarning !== ""}
            className="w-full relative group overflow-hidden rounded-xl disabled:opacity-40 disabled:cursor-not-allowed">
            <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-orange-400 transition-transform duration-300 group-hover:scale-105"></div>
            <div className="relative px-6 py-4 flex items-center justify-center gap-3 text-black font-black uppercase tracking-widest text-[11px] md:text-xs">
              {loading ? <i className="fas fa-spinner fa-spin text-base" /> : <i className="fab fa-whatsapp text-base" />}
              <span>{loading ? "Traitement..." : "Valider la réservation"}</span>
            </div>
          </button>
        </div>

      </div>
      
      <style dangerouslySetInnerHTML={{__html:`
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(249,115,22,0.5); }
      `}}/>
    </div>
  )
}