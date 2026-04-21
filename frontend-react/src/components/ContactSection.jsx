import { useState } from "react"

export default function ContactSection() {
  const [contactForm, setContactForm] = useState({ name:"", email:"", phone:"", message:"" })
  const [contactSent, setContactSent] = useState(false)

  function handleContact(e) {
    e.preventDefault()
    const msg = "Bonjour CarRent CI,\n\nNom: " + contactForm.name + "\nEmail: " + contactForm.email + "\nTel: " + contactForm.phone + "\n\nMessage:\n" + contactForm.message
    window.open("https://wa.me/2250779562825?text=" + encodeURIComponent(msg), "_blank")
    setContactSent(true)
  }

  const contactLinks = [
    {icon:"fa-phone-alt", title:"Téléphone", val:"+225 07 79 56 28 25", href:"tel:+2250779562825"},
    {icon:"fa-envelope", title:"Email", val:"carentciv@gmail.com", href:"mailto:carentciv@gmail.com"},
    {icon:"fab fa-whatsapp", title:"WhatsApp", val:"+225 07 79 56 28 25", href:"https://wa.me/2250779562825"},
    {icon:"fa-map-marker-alt", title:"Siège", val:"Yopougon, Abidjan", href:"https://maps.google.com/?q=Yopougon+Abidjan"}
  ];

  const horaires = [
    {j:"Lundi - Vendredi", h:"07:00 - 22:00"},
    {j:"Samedi", h:"08:00 - 20:00"},
    {j:"Dimanche & Fériés", h:"09:00 - 18:00"}
  ];

  return (
    <section id="contact" className="relative py-16 md:py-24 px-4 bg-[#050505] overflow-hidden">
      {/* Éclairage d'ambiance (Ambient Glow) */}
      <div className="absolute top-0 left-[-10%] md:left-[-5%] w-[300px] md:w-[500px] h-[300px] md:h-[500px] bg-orange-600/10 rounded-full blur-[100px] md:blur-[150px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] md:right-[-5%] w-[300px] md:w-[600px] h-[300px] md:h-[600px] bg-white/[0.02] rounded-full blur-[100px] md:blur-[120px] pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto">
        
        {/* En-tête de section */}
        <div className="text-center mb-12 md:mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 mb-4 md:mb-6 backdrop-blur-md">
            <span className="w-1.5 h-1.5 rounded-full bg-orange-500 shadow-[0_0_10px_rgba(249,115,22,1)] animate-pulse"></span>
            <span className="text-gray-300 text-[10px] font-bold tracking-widest uppercase">Support & Conciergerie</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black mb-3 md:mb-5 text-white tracking-tight">
            Contactez <span className="bg-gradient-to-r from-orange-400 to-orange-600 bg-clip-text text-transparent">Nos Experts</span>
          </h2>
          <p className="text-sm md:text-base text-gray-400 max-w-2xl mx-auto font-light leading-relaxed">
            Une question, une exigence particulière ? Notre équipe se tient à votre entière disposition pour vous offrir une réponse sur-mesure.
          </p>
        </div>

        <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-stretch max-w-5xl lg:max-w-none mx-auto">
          
          {/* COLONNE GAUCHE : Formulaire Premium */}
          <div className="lg:col-span-7 relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-orange-500/20 to-transparent rounded-2xl md:rounded-[2.5rem] blur-lg md:blur-xl opacity-50 group-hover:opacity-70 transition duration-500 hidden md:block"></div>
            
            <div className="relative bg-[#0a0a0a]/80 backdrop-blur-2xl rounded-2xl md:rounded-[2rem] p-6 sm:p-8 md:p-10 border border-white/10 shadow-2xl h-full">
              <div className="mb-6 md:mb-8 border-b border-white/5 pb-4 md:pb-5">
                <h3 className="text-lg md:text-xl font-bold text-white mb-1 md:mb-1.5">Ligne Directe</h3>
                <p className="text-[11px] md:text-xs text-gray-400 font-light">Transmettez-nous vos coordonnées, un conseiller vous contactera dans les plus brefs délais.</p>
              </div>

              {contactSent ? (
                <div className="flex flex-col items-center justify-center py-8 md:py-10 text-center animate-fadeIn">
                  <div className="w-12 h-12 md:w-16 md:h-16 bg-green-500/10 border border-green-500/20 rounded-full flex items-center justify-center mb-4 md:mb-5 shadow-[0_0_30px_rgba(34,197,94,0.2)]">
                    <i className="fas fa-check text-xl md:text-2xl text-green-500" />
                  </div>
                  <p className="text-white font-bold text-base md:text-lg mb-1 md:mb-2">Transmission réussie</p>
                  <p className="text-gray-400 text-[11px] md:text-xs font-light mb-6 md:mb-8 max-w-xs md:max-w-sm px-4">Votre message a bien été préparé pour WhatsApp. Notre équipe va le réceptionner instantanément.</p>
                  <button 
                    onClick={() => setContactSent(false)} 
                    className="text-orange-500 text-[10px] font-bold uppercase tracking-widest hover:text-orange-400 transition-colors"
                  >
                    Nouvelle requête <i className="fas fa-redo ml-1.5" />
                  </button>
                </div>
              ) : (
                <form onSubmit={handleContact} className="space-y-4 md:space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-5">
                    {/* Nom */}
                    <div>
                      <label className="block text-gray-400 text-[10px] font-semibold uppercase tracking-widest mb-1.5 md:mb-2">Nom complet</label>
                      <input required placeholder="Ex: Jean Dupont" value={contactForm.name} onChange={e => setContactForm(f => ({...f, name:e.target.value}))}
                        className="w-full px-4 py-2.5 md:py-3 rounded-xl bg-white/5 border border-white/10 focus:border-orange-500 focus:bg-white/10 outline-none text-white text-xs md:text-sm transition-all placeholder-gray-600" />
                    </div>
                    {/* Téléphone */}
                    <div>
                      <label className="block text-gray-400 text-[10px] font-semibold uppercase tracking-widest mb-1.5 md:mb-2">Téléphone</label>
                      <input required placeholder="+225 07 00 00 00 00" value={contactForm.phone} onChange={e => setContactForm(f => ({...f, phone:e.target.value}))}
                        className="w-full px-4 py-2.5 md:py-3 rounded-xl bg-white/5 border border-white/10 focus:border-orange-500 focus:bg-white/10 outline-none text-white text-xs md:text-sm transition-all placeholder-gray-600" />
                    </div>
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-gray-400 text-[10px] font-semibold uppercase tracking-widest mb-1.5 md:mb-2">Adresse Email</label>
                    <input type="email" placeholder="contact@votre-domaine.com" value={contactForm.email} onChange={e => setContactForm(f => ({...f, email:e.target.value}))}
                      className="w-full px-4 py-2.5 md:py-3 rounded-xl bg-white/5 border border-white/10 focus:border-orange-500 focus:bg-white/10 outline-none text-white text-xs md:text-sm transition-all placeholder-gray-600" />
                  </div>

                  {/* Message */}
                  <div>
                    <label className="block text-gray-400 text-[10px] font-semibold uppercase tracking-widest mb-1.5 md:mb-2">Votre requête</label>
                    <textarea required rows={4} placeholder="Détaillez vos besoins (dates, type de véhicule, chauffeur...)" value={contactForm.message} onChange={e => setContactForm(f => ({...f, message:e.target.value}))}
                      className="w-full px-4 py-2.5 md:py-3 rounded-xl bg-white/5 border border-white/10 focus:border-orange-500 focus:bg-white/10 outline-none text-white text-xs md:text-sm transition-all placeholder-gray-600 resize-none custom-scrollbar" />
                  </div>

                  {/* Bouton Submit */}
                  <button type="submit" className="group relative w-full overflow-hidden rounded-xl mt-2 md:mt-4">
                    <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-orange-400 transition-transform duration-300 group-hover:scale-105"></div>
                    <div className="relative px-4 py-3 md:px-6 md:py-3.5 flex items-center justify-center gap-2.5 text-black font-black uppercase tracking-widest text-[11px] md:text-xs">
                      <i className="fab fa-whatsapp text-sm md:text-base" />
                      <span>Transmettre via WhatsApp</span>
                    </div>
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* COLONNE DROITE : Panneau d'informations unifié */}
          <div className="lg:col-span-5 relative group">
            <div className="absolute -inset-1 bg-gradient-to-l from-white/5 to-transparent rounded-2xl md:rounded-[2.5rem] blur-lg md:blur-xl opacity-50 group-hover:opacity-70 transition duration-500 hidden md:block"></div>
            
            <div className="relative bg-[#0a0a0a]/80 backdrop-blur-2xl rounded-2xl md:rounded-[2rem] p-6 sm:p-8 md:p-10 border border-white/10 shadow-2xl h-full flex flex-col">
              
              <div className="mb-6 md:mb-8 border-b border-white/5 pb-4 md:pb-5">
                <h3 className="text-lg md:text-xl font-bold text-white mb-1 md:mb-1.5">Coordonnées</h3>
                <p className="text-[11px] md:text-xs text-gray-400 font-light">Joignables à tout moment pour vous assister.</p>
              </div>

              {/* Liste de contacts */}
              <div className="flex flex-col gap-3 md:gap-5 mb-6 md:mb-8">
                {contactLinks.map((c, i) => (
                  <a key={i} href={c.href} target={c.href.startsWith("http") ? "_blank" : undefined}
                    className="group/link flex items-center gap-3 md:gap-4 p-2 md:p-3 rounded-xl hover:bg-white/[0.03] transition-colors duration-300">
                    <div className="w-8 h-8 md:w-10 md:h-10 flex-shrink-0 rounded-full bg-white/5 border border-white/10 flex items-center justify-center group-hover/link:bg-orange-500/10 group-hover/link:border-orange-500/30 transition-all duration-300">
                      <i className={`fas ${c.icon} text-gray-400 group-hover/link:text-orange-500 text-xs md:text-sm transition-colors duration-300`} />
                    </div>
                    <div className="overflow-hidden">
                      <h4 className="text-gray-500 text-[9px] uppercase tracking-widest font-bold mb-0.5">{c.title}</h4>
                      <p className="text-white font-semibold text-[11px] md:text-xs group-hover/link:text-orange-400 transition-colors truncate">{c.val}</p>
                    </div>
                  </a>
                ))}
              </div>

              {/* Séparateur */}
              <div className="w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent mb-6"></div>

              {/* Horaires intégrés dans la même carte */}
              <div className="mt-auto">
                <div className="flex items-center gap-2 md:gap-2.5 mb-4 md:mb-5">
                  <i className="fas fa-clock text-orange-500 text-xs md:text-sm" />
                  <h4 className="font-bold text-white text-xs md:text-sm tracking-wide">Heures d'Ouverture</h4>
                </div>
                <div className="space-y-2 md:space-y-2.5">
                  {horaires.map((h, i) => (
                    <div key={i} className="flex justify-between items-center group/hour">
                      <span className="text-gray-400 font-light text-[11px] md:text-xs">{h.j}</span>
                      <span className="text-white font-semibold text-[11px] md:text-xs group-hover/hour:text-orange-500 transition-colors">{h.h}</span>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  )
}