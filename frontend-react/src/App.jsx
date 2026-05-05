import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { useEffect } from 'react';

// --- COMPOSANTS PUBLICS ---
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import VehicleDetails from './pages/VehicleDetails';
import Conditions from './pages/Conditions';
import Confidentialite from './pages/Confidentialite';
import Cookies from './pages/Cookies';
import FAQ from './pages/FAQ';
import Services from './pages/Services';
import ReservationDetails from './pages/ReservationDetails';
import MesReservations from './pages/MesReservations';
import NotFound from './pages/NotFound';

// Pages Services
import ServiceLocation from './pages/services/ServiceLocation';
import ServiceLivraison from './pages/services/ServiceLivraison';
import ServiceAssurance from './pages/services/ServiceAssurance';
import ServiceMaintenance from './pages/services/ServiceMaintenance';
import ServiceSupport from './pages/services/ServiceSupport';
import ServiceDisponibilite from './pages/services/ServiceDisponibilite';

// --- ESPACE ADMIN ---
import AdminLogin from "./pages/admin/AdminLogin";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminReservations from "./pages/admin/AdminReservations";
import AdminClients from "./pages/admin/AdminClients";
import AdminPromos from "./pages/admin/AdminPromos";
import AdminStats from "./pages/admin/AdminStats";

// Layout et Middleware
import AdminLayout from './pages/admin/AdminLayout'; // Le Layout qui contient Sidebar + Modal

// --- UTILITAIRES ---

// Remonte en haut de la page lors d'un changement d'URL
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0) }, [pathname]);
  return null;
}

// Structure de base pour le site public
function Layout({ children }) {
  return (
    <>
      <Navbar />
      <main>{children}</main>
      <Footer />
    </>
  );
}

// Le Gardien : Vérifie si l'admin est connecté
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('adminToken');
  if (!token) {
    return <Navigate to="/admin/login" replace />;
  }
  return children;
};

// --- COMPOSANT PRINCIPAL ---

export default function App() {
  return (
    <>
      <ScrollToTop /> 
      
      <Routes>
        {/* ==========================================
            ROUTES PUBLIQUES (CLIENTS)
            ========================================== */}
        <Route path="/" element={<Layout><Home /></Layout>} />
        <Route path="/vehicule/:id" element={<VehicleDetails />} />
        <Route path="/reservation-details" element={<ReservationDetails />} />
        <Route path="/mes-reservations" element={<MesReservations />} />
        <Route path="/conditions" element={<Conditions />} />
        <Route path="/confidentialite" element={<Confidentialite />} />
        <Route path="/cookies" element={<Cookies />} />
        <Route path="/faq" element={<FAQ />} />
        <Route path="/services" element={<Layout><Services /></Layout>} />
        
        {/* Détails Services */}
        <Route path="/service-location" element={<ServiceLocation />} />
        <Route path="/service-livraison" element={<ServiceLivraison />} />
        <Route path="/service-assurance" element={<ServiceAssurance />} />
        <Route path="/service-maintenance" element={<ServiceMaintenance />} />
        <Route path="/service-support" element={<ServiceSupport />} />
        <Route path="/service-disponibilite" element={<ServiceDisponibilite />} />
        
        {/* ==========================================
            ROUTES ADMINISTRATEUR (SÉCURISÉES)
            ========================================== */}
        
        {/* Page de connexion (sans sidebar) */}
        <Route path="/admin/login" element={<AdminLogin />} />

        {/* 
            Utilisation du AdminLayout pour centraliser :
            - La Sidebar fixe
            - Le Modal d'ajout de véhicule (via ?action=new)
        */}
        <Route 
          path="/admin" 
          element={
            <ProtectedRoute>
              <AdminLayout><AdminDashboard /></AdminLayout>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/admin/reservations" 
          element={<ProtectedRoute><AdminLayout><AdminReservations /></AdminLayout></ProtectedRoute>} 
        />
        <Route 
          path="/admin/clients" 
          element={<ProtectedRoute><AdminLayout><AdminClients /></AdminLayout></ProtectedRoute>} 
        />
        <Route 
          path="/admin/promos" 
          element={<ProtectedRoute><AdminLayout><AdminPromos /></AdminLayout></ProtectedRoute>} 
        />
        <Route 
          path="/admin/stats" 
          element={<ProtectedRoute><AdminLayout><AdminStats /></AdminLayout></ProtectedRoute>} 
        />
        
        {/* ==========================================
            GESTION DES ERREURS
            ========================================== */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}