import { useEffect } from 'react'
import { trackVisit } from '../api/config'

const SERVICES = [
  { icon: 'fa-key', title: 'Location de véhicules', desc: 'Large gamme de véhicules disponibles avec ou sans chauffeur, pour tous vos déplacements à Abidjan et à l\'intérieur du pays.', color: 'from-orange-500 to-orange-600' },
  { icon: 'fa-truck', title: 'Livraison à domicile', desc: 'Nous livrons votre véhicule directement à votre adresse. Frais de livraison : 10 000 FCFA.', color: 'from-blue-500 to-blue-600' },
  { icon: 'fa-shield-alt', title: 'Assurance incluse', desc: 'Tous nos véhicules sont assurés. Votre sécurité est notre priorité.', color: 'from-green-500 to-green-600' },
  { icon: 'fa-headset', title: 'Support 24/7', desc: 'Notre équipe est disponible à toute heure pour répondre à vos questions et résoudre vos problèmes.', color: 'from-purple-500 to-purple-600' },
  { icon: 'fa-tools', title: 'Maintenance', desc: 'Tous nos véhicules sont régulièrement entretenus et contrôlés pour garantir votre sécurité.', color: 'from-red-500 to-red-600' },
  { icon: 'fa-calendar-check', title: 'Disponibilité', desc: 'Vérifiez la disponibilité en temps réel et réservez en quelques clics via WhatsApp.', color: 'from-yellow-500 to-yellow-600' },
]

export default function Services() {
  useEffect(() => { trackVisit('services') }, [])
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 pt-24 pb-16 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-black mb-4"><i className="fas fa-cogs text-orange-500 mr-3" />Nos Services</h1>
          <p className="text-gray-400 text-lg">Tout ce dont vous avez besoin pour vos déplacements</p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {SERVICES.map((s, i) => (
            <div key={i} className="bg-gray-800/50 rounded-2xl p-6 border border-gray-700 hover:border-orange-500/50 transition-all hover:scale-105">
              <div className={`bg-gradient-to-br ${s.color} w-14 h-14 rounded-xl flex items-center justify-center mb-4 shadow-lg`}>
                <i className={`fas ${s.icon} text-white text-2xl`} />
              </div>
              <h3 className="text-xl font-bold mb-3">{s.title}</h3>
              <p className="text-gray-400 leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
