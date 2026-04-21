import { Routes, Route, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import VehicleDetails from './pages/VehicleDetails'
import Conditions from './pages/Conditions'
import Confidentialite from './pages/Confidentialite'
import Cookies from './pages/Cookies'
import FAQ from './pages/FAQ'
import Services from './pages/Services'
import ReservationDetails from './pages/ReservationDetails'
import MesReservations from './pages/MesReservations'
import NotFound from './pages/NotFound'
import ServiceLocation from './pages/services/ServiceLocation'
import ServiceLivraison from './pages/services/ServiceLivraison'
import ServiceAssurance from './pages/services/ServiceAssurance'
import ServiceMaintenance from './pages/services/ServiceMaintenance'
import ServiceSupport from './pages/services/ServiceSupport'
import ServiceDisponibilite from './pages/services/ServiceDisponibilite'

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => { window.scrollTo(0, 0) }, [pathname])
  return null
}

function Layout({ children }) {
  return (
    <>
      <Navbar />
      {children}
      <Footer />
    </>
  )
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<><ScrollToTop /><Layout><Home /></Layout></>} />
      <Route path="/vehicule/:id" element={<VehicleDetails />} />
      <Route path="/reservation-details" element={<ReservationDetails />} />
      <Route path="/mes-reservations" element={<MesReservations />} />
      <Route path="/conditions" element={<Conditions />} />
      <Route path="/confidentialite" element={<Confidentialite />} />
      <Route path="/cookies" element={<Cookies />} />
      <Route path="/faq" element={<FAQ />} />
      <Route path="/services" element={<Layout><Services /></Layout>} />
      <Route path="/service-location" element={<ServiceLocation />} />
      <Route path="/service-livraison" element={<ServiceLivraison />} />
      <Route path="/service-assurance" element={<ServiceAssurance />} />
      <Route path="/service-maintenance" element={<ServiceMaintenance />} />
      <Route path="/service-support" element={<ServiceSupport />} />
      <Route path="/service-disponibilite" element={<ServiceDisponibilite />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}
