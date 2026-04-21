import { useEffect } from "react"
import { trackVisit } from "../api/config"
import useHashScroll from "../hooks/useHashScroll"

// Importation des sections
import HeroSection from "../components/HeroSection"
import ShowroomSection from "../components/ShowroomSection"
import ServicesSection from "../components/ServicesSection"
import TestimonialsSection from "../components/TestimonialsSection"
import ContactSection from "../components/ContactSection"

export default function Home() {
  useHashScroll()

  useEffect(() => { 
    trackVisit("index.html") 
  }, [])

  return (
    <div className="relative min-h-screen bg-[#050505] selection:bg-orange-500/30 selection:text-orange-500">
      
      <HeroSection />
      <ShowroomSection />
      <ServicesSection />
      <TestimonialsSection />
      <ContactSection />

      {/* =========================================
          BOUTON WHATSAPP FLOTTANT (ULTRA PREMIUM)
          ========================================= */}
      <div className="fixed bottom-6 right-6 md:bottom-8 md:right-8 z-50 group">
        
        {/* Tooltip au survol (Visible uniquement sur Desktop) */}
        <div className="absolute right-full top-1/2 -translate-y-1/2 mr-4 opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none hidden md:block transform translate-x-4 group-hover:translate-x-0">
          <div className="bg-[#0a0a0a]/90 backdrop-blur-xl border border-white/10 text-white text-[10px] font-bold uppercase tracking-widest px-4 py-2.5 rounded-xl whitespace-nowrap shadow-2xl">
            Service Conciergerie
          </div>
        </div>

        {/* Halos lumineux animés */}
        <div className="absolute -inset-2 bg-green-500/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-pulse"></div>
        <div className="absolute inset-0 bg-green-500 rounded-full blur-md opacity-40 animate-ping" style={{ animationDuration: '3s' }}></div>

        {/* Bouton Principal */}
        <a 
          href="https://wa.me/2250779562825?text=Bonjour,%20je%20souhaite%20des%20informations%20sur%20vos%20véhicules." 
          target="_blank" 
          rel="noreferrer"
          className="relative flex items-center justify-center w-14 h-14 md:w-16 md:h-16 bg-gradient-to-br from-green-400 to-green-600 rounded-full shadow-[0_0_30px_rgba(34,197,94,0.4)] border border-green-300/50 hover:scale-110 transition-transform duration-300 z-10"
          aria-label="Contacter la conciergerie sur WhatsApp"
        >
          <i className="fab fa-whatsapp text-white text-3xl md:text-4xl drop-shadow-md" />
          
          {/* Pastille de notification (Optionnelle, pour inciter au clic) */}
          <span className="absolute top-0 right-0 flex h-3.5 w-3.5 md:h-4 md:w-4">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3.5 w-3.5 md:h-4 md:w-4 bg-red-500 border-2 border-[#050505]"></span>
          </span>
        </a>
      </div>
      
    </div>
  )
}