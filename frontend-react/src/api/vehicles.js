import API_BASE_URL from './config'

export async function fetchRentalVehicles() {
  const res = await fetch(`${API_BASE_URL}/api/vehicles/type/location`)
  const data = await res.json()
  if (!data.success) throw new Error(data.message)
  return data.data.map(v => ({
    id: v.id,
    name: v.name,
    category: v.category,
    image: v.image_url?.startsWith('http') ? v.image_url : `${API_BASE_URL}${v.image_url}`,
    images: (() => {
      try {
        const parsed = typeof v.images === 'string' ? JSON.parse(v.images) : v.images
        return Array.isArray(parsed) ? parsed.map(u => u.startsWith('http') ? u : `${API_BASE_URL}${u}`) : null
      } catch { return null }
    })(),
    priceWithout: v.price_without_driver,
    priceWith: v.price_with_driver,
    features: JSON.parse(v.features || '[]'),
    stock: v.stock || 0,
    stockAlertThreshold: v.stock_alert_threshold || 0,
    autoriseSansAbidjan: v.autorise_sans_chauffeur_abidjan !== 0,
    autoriseSansHorsAbidjan: v.autorise_sans_chauffeur_hors_abidjan !== 0,
    description: v.description || ''
  })).sort((a, b) => a.priceWithout - b.priceWithout)
}

export async function fetchSaleVehicles() {
  const res = await fetch(`${API_BASE_URL}/api/vehicles/type/vente`)
  const data = await res.json()
  if (!data.success) throw new Error(data.message)
  return data.data.map(v => ({
    id: v.id,
    name: v.name,
    category: v.category,
    image: v.image_url?.startsWith('http') ? v.image_url : `${API_BASE_URL}${v.image_url}`,
    price: v.sale_price,
    year: v.year,
    mileage: v.mileage,
    fuel: v.fuel_type,
    transmission: v.transmission,
    features: JSON.parse(v.features || '[]'),
    description: v.description || '',
    is_sold: v.is_sold == 1 ? 1 : 0
  })).sort((a, b) => {
    if (a.is_sold !== b.is_sold) return a.is_sold - b.is_sold
    return a.price - b.price
  })
}

export async function fetchVehicleById(id) {
  const res = await fetch(`${API_BASE_URL}/api/vehicles/${id}`)
  const data = await res.json()
  if (!data.success) throw new Error('Véhicule non trouvé')
  const v = data.data
  return {
    id: v.id,
    name: v.name,
    category: v.category,
    type: v.type,
    image: v.image_url?.startsWith('http') ? v.image_url : `${API_BASE_URL}${v.image_url}`,
    images: (() => {
      try {
        const parsed = typeof v.images === 'string' ? JSON.parse(v.images) : v.images
        return Array.isArray(parsed) ? parsed.map(u => u.startsWith('http') ? u : `${API_BASE_URL}${u}`) : null
      } catch { return null }
    })(),
    priceWithout: v.price_without_driver,
    priceWith: v.price_with_driver,
    features: JSON.parse(v.features || '[]'),
    stock: v.stock || 0,
    stockAlertThreshold: v.stock_alert_threshold || 0,
    autoriseSansAbidjan: v.autorise_sans_chauffeur_abidjan !== 0,
    autoriseSansHorsAbidjan: v.autorise_sans_chauffeur_hors_abidjan !== 0,
    description: v.description || ''
  }
}
