import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import Sidebar from "./Sidebar";
import AddVehicleModal from "./AddVehicleModal";

/**
 * AdminLayout - Le conteneur "Ultra Premium" de la console.
 * Centralise la Sidebar et les modaux globaux.
 */
export default function AdminLayout({ children }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const [isModalOpen, setIsModalOpen] = useState(false);

  // --- LOGIQUE DE DÉTECTION URL ---
  // On surveille si l'URL contient ?action=new pour déclencher le modal
  useEffect(() => {
    if (searchParams.get("action") === "new") {
      setIsModalOpen(true);
    }
  }, [searchParams]);

  // Fonction pour fermer le modal et nettoyer l'URL proprement
  const handleCloseModal = () => {
    setIsModalOpen(false);
    // On réinitialise les paramètres de recherche sans recharger la page
    setSearchParams({});
  };

  return (
    <div className="flex min-h-screen bg-[#050505] text-white font-sans selection:bg-orange-500 selection:text-black">
      
      {/* 1. Barre de navigation latérale fixe */}
      <Sidebar />

      {/* 2. Zone de contenu principal */}
      <main className="flex-1 relative flex flex-col min-w-0 overflow-hidden">
        
        {/* ✅ CORRECTION : Suppression du lien externe noise.svg (Erreur 404) 
            Remplacé par un effet de blend CSS natif pour garder un aspect texturé */}
        <div className="absolute inset-0 opacity-[0.02] pointer-events-none bg-white/5 mix-blend-overlay"></div>

        {/* Conteneur du contenu avec défilement fluide */}
        <div className="flex-1 overflow-y-auto p-6 md:p-10 lg:p-12 custom-scrollbar">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </div>

        {/* Footer discret de la console */}
        <footer className="px-10 py-6 border-t border-white/5 bg-black/50 backdrop-blur-md flex justify-between items-center">
          <p className="text-[9px] text-gray-600 font-black uppercase tracking-[0.4em]">
            Console v2.0 • Chiffrement AES-256
          </p>
          <p className="text-[9px] text-gray-800 font-bold uppercase tracking-widest">
            © 2026 CarRent CI
          </p>
        </footer>
      </main>

      {/* 3. Modaux Globaux (Toujours au top du DOM) */}
      <AddVehicleModal 
        isOpen={isModalOpen} 
        onClose={handleCloseModal} 
      />
    </div>
  );
}