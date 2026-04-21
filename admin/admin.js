const API_URL = (window.API_BASE_URL || 'http://localhost:5000') + '/api';
let token = localStorage.getItem('adminToken');
// Helper fetch authentifié (gère JSON et FormData)
function authFetch(url, options = {}) {
    const currentToken = localStorage.getItem('adminToken') || token || '';
    const isFormData = options.body instanceof FormData;
    const headers = isFormData
        ? { 'Authorization': 'Bearer ' + currentToken }
        : { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + currentToken, ...(options.headers || {}) };
    return fetch(url, { ...options, headers });
}


// Vérifier si connecté au chargement
document.addEventListener('DOMContentLoaded', () => {
    if (token) {
        showDashboard();
        initNotifications();
    } else {
        showLogin();
    }
});

// Afficher écran de connexion
function showLogin() {
    document.getElementById('loginScreen').classList.remove('hidden');
    document.getElementById('dashboard').classList.add('hidden');
}

// Afficher dashboard
function showDashboard() {
    document.getElementById('loginScreen').classList.add('hidden');
    document.getElementById('dashboard').classList.remove('hidden');
    showSection('overview');
    loadStats();
}

// Afficher une section
function showSection(section) {
    const sections = ['sectionOverview', 'sectionReservations', 'sectionVehicles', 'sectionStats', 'sectionPromoCodes'];
    const buttons = ['btnOverview', 'btnReservations', 'btnVehicles', 'btnStats', 'btnPromoCodes'];

    sections.forEach(id => { const el = document.getElementById(id); if (el) el.classList.add('hidden'); });
    buttons.forEach(id => { const el = document.getElementById(id); if (el) el.classList.remove('bg-white/20'); });

    if (section === 'overview') {
        const el = document.getElementById('sectionOverview'); if (el) el.classList.remove('hidden');
        const btn = document.getElementById('btnOverview'); if (btn) btn.classList.add('bg-white/20');
        loadOverview();
    } else if (section === 'reservations') {
        document.getElementById('sectionReservations').classList.remove('hidden');
        document.getElementById('btnReservations').classList.add('bg-white/20');
        loadReservations();
    } else if (section === 'vehicles') {
        document.getElementById('sectionVehicles').classList.remove('hidden');
        document.getElementById('btnVehicles').classList.add('bg-white/20');
        loadVehicles();
    } else if (section === 'stats') {
        const el = document.getElementById('sectionStats'); if (el) el.classList.remove('hidden');
        const btn = document.getElementById('btnStats'); if (btn) btn.classList.add('bg-white/20');
        loadVisitStats();
    } else if (section === 'promoCodes') {
        const el = document.getElementById('sectionPromoCodes'); if (el) el.classList.remove('hidden');
        const btn = document.getElementById('btnPromoCodes'); if (btn) btn.classList.add('bg-white/20');
        loadPromoCodes();
    }
}

// Connexion
document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    
    try {
        const response = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username: email, password })
        });
        
        const data = await response.json();
        
        if (data.success) {
            token = data.data.token;
            localStorage.setItem('adminToken', token);
            showDashboard();
        } else {
            alert('Erreur: ' + data.message);
        }
    } catch (error) {
        alert('Erreur de connexion');
        console.error(error);
    }
});

// Déconnexion
function logout() {
    localStorage.removeItem('adminToken');
    token = null;
    showLogin();
}

// Charger les statistiques
async function loadStats() {
    try {
        const response = await authFetch(`${API_URL}/reservations/stats`);
        if (response.status === 401) { localStorage.removeItem('adminToken'); token = null; showLogin(); return; }
        const data = await response.json();
        if (data.success && data.data) {
            document.getElementById('statTotal').textContent = data.data.total || 0;
            document.getElementById('statPending').textContent = data.data.pending || 0;
            document.getElementById('statConfirmed').textContent = data.data.confirmed || 0;
            document.getElementById('statRevenue').textContent = (data.data.total_revenue || 0).toLocaleString() + ' FCFA';
        }
    } catch (error) {
        console.error('Erreur chargement stats:', error);
    }
}

function filterReservations(status) {
    // Mettre à jour le select
    document.getElementById('filterStatus').value = status;

    // Mettre à jour le style des cartes
    const cards = { '': 'resCardAll', 'pending': 'resCardPending', 'confirmed': 'resCardConfirmed' };
    Object.entries(cards).forEach(([key, id]) => {
        const el = document.getElementById(id);
        if (!el) return;
        const ringColors = { '': 'ring-blue-400', 'pending': 'ring-yellow-400', 'confirmed': 'ring-green-400' };
        const isActive = key === status;
        el.classList.toggle(ringColors[key], isActive);
        el.classList.toggle('ring-transparent', !isActive);
        el.classList.toggle('scale-105', isActive);
        el.classList.toggle('shadow-xl', isActive);
    });

    loadReservations();
}

// Charger les réservations
async function loadReservations() {
    const status = document.getElementById('filterStatus').value;
    const url = status ? `${API_URL}/reservations?status=${status}` : `${API_URL}/reservations`;
    
    try {
        const response = await authFetch(url);
        if (response.status === 401) { localStorage.removeItem('adminToken'); token = null; showLogin(); return; }
        const data = await response.json();
        const tbody = document.getElementById('reservationsTable');
        if (data.success && data.data && data.data.length > 0) {
            tbody.innerHTML = data.data.map(res => `
                <tr class="hover:bg-gray-50">
                    <td class="px-6 py-4 text-sm font-medium text-gray-900">
                        <div class="flex flex-col items-center gap-1">
                            <span>${res.id}</span>
                            ${res.vehicle_image_url
                                ? (() => {
                                    const src = res.vehicle_image_url.startsWith('http')
                                        ? res.vehicle_image_url
                                        : (window.API_BASE_URL || 'http://localhost:5000') + res.vehicle_image_url.split('/').map(s => encodeURIComponent(s)).join('/');
                                    return `<img src="${src}" alt="${res.vehicle_name}" class="w-14 h-10 object-cover rounded shadow" onerror="this.style.display='none';this.nextElementSibling.style.display='flex'"><div class="w-14 h-10 bg-gray-100 rounded shadow items-center justify-center hidden"><i class="fas fa-car text-gray-400 text-lg"></i></div>`;
                                  })()
                                : `<div class="w-14 h-10 bg-gray-100 rounded shadow flex items-center justify-center"><i class="fas fa-car text-gray-400 text-lg"></i></div>`
                            }
                        </div>
                    </td>
                    <td class="px-6 py-4 text-sm text-gray-900">${res.client_name}</td>
                    <td class="px-6 py-4 text-sm text-gray-900">
                        <a href="https://wa.me/${res.client_whatsapp}" target="_blank" class="text-green-600 hover:underline flex items-center space-x-1">
                            <i class="fab fa-whatsapp"></i>
                            <span>${res.client_whatsapp}</span>
                        </a>
                    </td>
                    <td class="px-6 py-4 text-sm text-gray-900">
                        ${res.vehicle_id ? `<a href="${(window.FRONTEND_URL || 'http://localhost:5173')}/vehicule/${res.vehicle_id}" target="_blank" class="text-orange-600 hover:underline font-semibold flex items-center gap-1"><i class="fas fa-external-link-alt text-xs"></i>${res.vehicle_name}</a>` : res.vehicle_name}
                        ${res.driver_type ? `<br><span class="text-xs text-gray-400">${res.driver_type === 'with' ? '<i class="fas fa-user-tie mr-1"></i>Avec chauffeur' : '<i class="fas fa-key mr-1"></i>Sans chauffeur'}</span>` : ''}
                    </td>
                    <td class="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                        ${res.created_at ? `<div>${formatDateLong(res.created_at)}</div><div class="text-xs text-gray-400"><i class="fas fa-clock mr-1"></i>${new Date(res.created_at).toLocaleTimeString('fr-FR', {hour:'2-digit', minute:'2-digit'})}</div>` : '—'}
                    </td>
                    <td class="px-6 py-4 text-sm text-gray-900">
                        ${formatDate(res.start_date)} → ${formatDate(res.end_date)}
                    </td>
                    <td class="px-6 py-4 text-sm font-semibold text-gray-900">${res.total_price.toLocaleString()} FCFA${res.promo_code ? `<br><span class="text-xs text-green-600 font-normal"><i class="fas fa-tag mr-1"></i>${res.promo_code} (-${(res.promo_discount||0).toLocaleString()} FCFA)</span>` : ''}</td>
                    <td class="px-6 py-4">
                        ${getStatusBadge(res.status)}
                    </td>
                    <td class="px-6 py-4 text-sm">
                        <select onchange="updateStatus(${res.id}, this.value)" class="p-2 border border-gray-300 rounded text-xs">
                            <option value="">Changer statut</option>
                            <option value="pending">En attente</option>
                            <option value="confirmed">Confirmer</option>
                            <option value="completed">Terminer</option>
                            <option value="cancelled">Annuler</option>
                            <option value="delete" class="text-red-600 font-bold">🗑️ Supprimer</option>
                        </select>
                    </td>
                </tr>
            `).join('');
        } else {
            tbody.innerHTML = `
                <tr>
                    <td colspan="9" class="px-6 py-8 text-center text-gray-500">
                        <i class="fas fa-inbox text-4xl mb-2"></i>
                        <p>Aucune réservation trouvée</p>
                    </td>
                </tr>
            `;
        }
    } catch (error) {
        console.error('Erreur chargement réservations:', error);
        const t = document.getElementById('reservationsTable');
        if (t) t.innerHTML = '<tr><td colspan="9" class="px-6 py-8 text-center text-red-500"><i class="fas fa-exclamation-triangle text-4xl mb-2"></i><p>Erreur de connexion au serveur</p></td></tr>';
    }
}

// Mettre à jour le statut
async function updateStatus(id, status) {
    if (!status) return;
    
    // Si c'est une suppression, demander confirmation
    if (status === 'delete') {
        if (!confirm('⚠️ Êtes-vous sûr de vouloir supprimer cette réservation ?\n\nCette action est irréversible !')) {
            loadReservations();
            return;
        }
        
        try {
            const response = await authFetch(`${API_URL}/reservations/${id}`, {
                method: 'DELETE'
            });
            
            const data = await response.json();
            
            if (data.success) {
                loadStats();
                loadReservations();
                alert('✅ Réservation supprimée avec succès');
            } else {
                alert('Erreur: ' + data.message);
            }
        } catch (error) {
            alert('Erreur lors de la suppression');
            console.error(error);
        }
        return;
    }
    
    // Récupérer les détails de la réservation avant de mettre à jour
    let reservationDetails = null;
    if (status === 'confirmed') {
        try {
            const resResponse = await authFetch(`${API_URL}/reservations/${id}`);
            const resData = await resResponse.json();
            if (resData.success) {
                reservationDetails = resData.data;
            }
        } catch (error) {
            console.error('Erreur récupération détails:', error);
        }
    }
    
    // Mise à jour du statut
    try {
        const response = await authFetch(`${API_URL}/reservations/${id}/status`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status })
        });
        
        const data = await response.json();
        
        if (data.success) {
            loadStats();
            loadReservations();
            
            // Si confirmé, envoyer message WhatsApp au client
            if (status === 'confirmed' && reservationDetails) {
                sendConfirmationToClient(reservationDetails);
            }
            
            alert('Statut mis à jour avec succès');
        } else {
            alert('Erreur: ' + data.message);
        }
    } catch (error) {
        alert('Erreur lors de la mise à jour');
        console.error(error);
    }
}

// Envoyer message de confirmation au client
function sendConfirmationToClient(reservation) {
    // Formater le numéro WhatsApp
    let clientWhatsapp = reservation.client_whatsapp.trim().replace(/\s/g, '').replace(/-/g, '');
    if (clientWhatsapp.startsWith('0')) {
        clientWhatsapp = '225' + clientWhatsapp;
    } else if (!clientWhatsapp.startsWith('225')) {
        clientWhatsapp = '225' + clientWhatsapp;
    }
    
    // Calculer la durée
    const startDate = new Date(reservation.start_date);
    const endDate = new Date(reservation.end_date);
    const days = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));
    
    // Créer le message de confirmation
    const siteUrl = 'https://www.carentci.com';
    const vehicleUrl = reservation.vehicle_id ? `${siteUrl}/v/${reservation.vehicle_id}` : '';
    const confirmationMessage = `
*RESERVATION CONFIRMEE #${reservation.id}*

Bonjour *${reservation.client_name}*,

Excellente nouvelle! Votre réservation a été confirmée!

*RECAPITULATIF:*

*Véhicule:* ${reservation.vehicle_name}${vehicleUrl ? `\n\n*Voir le véhicule:*\n${vehicleUrl}` : ''}
*Du:* ${formatDateLong(reservation.start_date)}
*Au:* ${formatDateLong(reservation.end_date)}
*Durée:* ${days} jour${days > 1 ? 's' : ''}
*Lieu de livraison:* ${reservation.pickup_location}

*TOTAL GÉNÉRAL:* ${reservation.total_price.toLocaleString()} FCFA

*PROCHAINES ÉTAPES:*

1. Nous vous contacterons 24h avant pour confirmer l'heure et le lieu de livraison
2. Préparez une pièce d'identité valide
3. Le paiement se fera à la livraison du véhicule

*BESOIN D'AIDE?*
Contactez-nous sur WhatsApp: +225 0779562825

Merci de votre confiance!

_CARENTCI.COM - Location et vente de vehicule_
    `.trim();
    
    // Créer l'URL WhatsApp
    const whatsappUrl = `https://wa.me/${clientWhatsapp}?text=${encodeURIComponent(confirmationMessage)}`;
    
    // Afficher un popup pour envoyer le message
    const confirmDiv = document.createElement('div');
    confirmDiv.style.cssText = 'position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.8);display:flex;align-items:center;justify-content:center;z-index:10000;';
    confirmDiv.innerHTML = `
        <div style="background:white;padding:30px;border-radius:15px;max-width:500px;text-align:center;">
            <div style="font-size:50px;margin-bottom:20px;">✅</div>
            <h2 style="color:#333;margin-bottom:15px;">Réservation confirmée!</h2>
            <p style="color:#666;margin-bottom:25px;">Cliquez ci-dessous pour envoyer la confirmation au client:</p>
            <button id="sendConfirmMsg" style="background:#25D366;color:white;border:none;padding:15px 30px;border-radius:8px;font-size:16px;cursor:pointer;margin-bottom:10px;width:100%;">
                📱 Envoyer confirmation à ${reservation.client_name} (${clientWhatsapp})
            </button>
            <button id="skipConfirmMsg" style="background:#666;color:white;border:none;padding:10px 20px;border-radius:8px;font-size:14px;cursor:pointer;width:100%;">
                Fermer
            </button>
        </div>
    `;
    document.body.appendChild(confirmDiv);
    
    // Bouton pour envoyer
    document.getElementById('sendConfirmMsg').addEventListener('click', function() {
        window.open(whatsappUrl, '_blank');
        document.body.removeChild(confirmDiv);
    });
    
    // Bouton pour fermer
    document.getElementById('skipConfirmMsg').addEventListener('click', function() {
        document.body.removeChild(confirmDiv);
    });
}

// Formater la date en format long
function formatDateLong(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' });
}

// Badge de statut
function getStatusBadge(status) {
    const badges = {
        pending: '<span class="px-3 py-1 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-800">En attente</span>',
        confirmed: '<span class="px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800">Confirmée</span>',
        completed: '<span class="px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800">Terminée</span>',
        cancelled: '<span class="px-3 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-800">Annulée</span>'
    };
    return badges[status] || status;
}

// Formater la date
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' });
}

// Export CSV
function exportCSV() {
    const status = document.getElementById('filterStatus').value;
    const url = status ? `${API_URL}/reservations?status=${status}` : `${API_URL}/reservations`;
    authFetch(url).then(r => r.json()).then(data => {
        if (!data.success || !data.data.length) return alert('Aucune réservation à exporter');
        const headers = ['ID', 'Client', 'WhatsApp', 'Véhicule', 'Réservé le', 'Date début', 'Date fin', 'Prix (FCFA)', 'Statut'];
        const rows = data.data.map(r => [
            r.id,
            r.client_name,
            r.client_whatsapp,
            r.vehicle_name,
            r.created_at ? new Date(r.created_at).toLocaleString('fr-FR') : '',
            r.start_date ? new Date(r.start_date).toLocaleDateString('fr-FR') : '',
            r.end_date ? new Date(r.end_date).toLocaleDateString('fr-FR') : '',
            r.total_price,
            r.status
        ]);
        const csv = [headers, ...rows].map(row => row.map(v => `"${String(v).replace(/"/g, '""')}"`).join(',')).join('\n');
        const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = `reservations_${new Date().toISOString().slice(0,10)}.csv`;
        a.click();
    });
}

// Export PDF
function exportPDF() {
    const status = document.getElementById('filterStatus').value;
    const url = status ? `${API_URL}/reservations?status=${status}` : `${API_URL}/reservations`;
    authFetch(url).then(r => r.json()).then(data => {
        if (!data.success || !data.data.length) return alert('Aucune réservation à exporter');
        const win = window.open('', '_blank');
        const rows = data.data.map(r => `
            <tr>
                <td>${r.id}</td>
                <td>${r.client_name}</td>
                <td>${r.client_whatsapp}</td>
                <td>${r.vehicle_name}</td>
                <td>${r.created_at ? new Date(r.created_at).toLocaleString('fr-FR') : '—'}</td>
                <td>${r.start_date ? new Date(r.start_date).toLocaleDateString('fr-FR') : ''} → ${r.end_date ? new Date(r.end_date).toLocaleDateString('fr-FR') : ''}</td>
                <td>${r.total_price.toLocaleString()} FCFA</td>
                <td>${r.status}</td>
            </tr>`).join('');
        win.document.write(`<!DOCTYPE html><html><head><meta charset="utf-8"><title>Réservations CarRent CI</title>
        <style>body{font-family:Arial,sans-serif;font-size:12px;padding:20px}h1{color:#f97316;margin-bottom:20px}table{width:100%;border-collapse:collapse}th{background:#f97316;color:white;padding:8px;text-align:left}td{padding:6px 8px;border-bottom:1px solid #eee}tr:nth-child(even){background:#fafafa}@media print{button{display:none}}</style>
        </head><body>
        <h1>📋 Réservations CarRent CI — ${new Date().toLocaleDateString('fr-FR')}</h1>
        <table><thead><tr><th>ID</th><th>Client</th><th>WhatsApp</th><th>Véhicule</th><th>Réservé le</th><th>Dates</th><th>Prix</th><th>Statut</th></tr></thead>
        <tbody>${rows}</tbody></table>
        <br><button onclick="window.print()" style="background:#f97316;color:white;border:none;padding:10px 20px;border-radius:6px;cursor:pointer;font-size:14px">🖨️ Imprimer / Enregistrer en PDF</button>
        </body></html>`);
        win.document.close();
    });
}

// Actualiser automatiquement toutes les 30 secondes
setInterval(() => {
    if (!document.getElementById('dashboard').classList.contains('hidden')) {
        loadStats();
        loadReservations();
    }
}, 30000);


// =========================
// GESTION DES VÉHICULES (CRUD)
// =========================

// Charger les véhicules
async function loadVehicles() {
    try {
        const response = await authFetch(`${API_URL}/vehicles`);
        const data = await response.json();
        
        const grid = document.getElementById('vehiclesGrid');
        
        if (data.success && data.data.length > 0) {
            allVehiclesCache = data.data;
            
            const totalVehicles = allVehiclesCache.length;
            const locationVehicles = allVehiclesCache.filter(v => v.type === 'location').length;
            const saleVehicles = allVehiclesCache.filter(v => v.type === 'vente').length;
            const lowStockVehicles = allVehiclesCache.filter(v => v.stock <= (v.stock_alert_threshold || 1)).length;
            
            document.getElementById('totalVehicles').textContent = totalVehicles;
            document.getElementById('locationVehicles').textContent = locationVehicles;
            document.getElementById('saleVehicles').textContent = saleVehicles;
            document.getElementById('lowStockVehicles').textContent = lowStockVehicles;
            
            renderVehiclesGrid(allVehiclesCache);
        } else {
            allVehiclesCache = [];
            document.getElementById('totalVehicles').textContent = '0';
            document.getElementById('locationVehicles').textContent = '0';
            document.getElementById('saleVehicles').textContent = '0';
            document.getElementById('lowStockVehicles').textContent = '0';
            grid.innerHTML = `
                <div class="col-span-3 text-center py-12 text-gray-500">
                    <i class="fas fa-car text-5xl mb-4"></i>
                    <p>Aucun véhicule trouvé</p>
                </div>
            `;
        }
    } catch (error) {
        console.error('Erreur chargement véhicules:', error);
    }
}

let allVehiclesCache = [];
let activeFilter = 'all';

function renderVehiclesGrid(vehicles) {
    const grid = document.getElementById('vehiclesGrid');
    if (!vehicles.length) {
        grid.innerHTML = `<div class="col-span-3 text-center py-12 text-gray-500"><i class="fas fa-car text-5xl mb-4"></i><p>Aucun véhicule dans cette catégorie</p></div>`;
        return;
    }
    grid.innerHTML = vehicles.map(vehicle => {
        let priceInfo = '';
        if (vehicle.type === 'location') {
            priceInfo = `
                <p><i class="fas fa-tag text-orange-500 mr-2"></i>Sans chauffeur: ${vehicle.price_without_driver?.toLocaleString() || 'N/A'} FCFA</p>
                <p><i class="fas fa-tag text-orange-500 mr-2"></i>Avec chauffeur: ${vehicle.price_with_driver?.toLocaleString() || 'N/A'} FCFA</p>
            `;
        } else if (vehicle.type === 'vente') {
            priceInfo = `
                <p><i class="fas fa-dollar-sign text-purple-500 mr-2"></i>Prix: ${vehicle.sale_price?.toLocaleString() || 'N/A'} FCFA</p>
                <p><i class="fas fa-calendar text-purple-500 mr-2"></i>Année: ${vehicle.year || 'N/A'}</p>
                <p><i class="fas fa-tachometer-alt text-purple-500 mr-2"></i>${vehicle.mileage || 'N/A'}</p>
            `;
        }
        const typeBadge = vehicle.type === 'location'
            ? '<span class="px-2 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800 ml-2">Location</span>'
            : '<span class="px-2 py-1 rounded-full text-xs font-semibold bg-purple-100 text-purple-800 ml-2">Vente</span>';
        const lowStock = vehicle.stock <= (vehicle.stock_alert_threshold || 1);
        return `
            <div class="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 hover:scale-105 animate-fadeIn">
                <div class="relative overflow-hidden group">
                    <img src="${vehicle.image_url && vehicle.image_url.startsWith('http') ? vehicle.image_url : (window.API_BASE_URL || 'http://localhost:5000') + (vehicle.image_url || '')}" class="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-110">
                    ${lowStock ? `<div class="absolute top-2 right-2 bg-orange-500 text-white text-xs font-bold px-2 py-1 rounded-full"><i class="fas fa-exclamation-triangle mr-1"></i>Stock faible</div>` : ''}
                    ${vehicle.type === 'vente' ? `<div class="absolute top-2 left-2 ${vehicle.is_sold ? 'bg-red-600' : 'bg-green-500'} text-white text-xs font-bold px-3 py-1 rounded-full">${vehicle.is_sold ? '🔴 VENDU' : '🟢 DISPONIBLE'}</div>` : ''}
                    <div class="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
                <div class="p-6">
                    <div class="flex justify-between items-start mb-3">
                        <h3 class="text-xl font-bold text-gray-800">${vehicle.name}</h3>
                        <div class="flex flex-col items-end">
                            <span class="px-3 py-1 rounded-full text-xs font-semibold bg-orange-100 text-orange-800">${vehicle.category}</span>
                            ${typeBadge}
                        </div>
                    </div>
                    <div class="space-y-2 mb-4 text-sm text-gray-600">
                        ${priceInfo}
                        <p class="flex items-center justify-between">
                            <span><i class="fas fa-warehouse text-orange-500 mr-2"></i>Disponible:</span>
                            <span class="font-bold ${vehicle.stock > (vehicle.stock_alert_threshold || 1) ? 'text-green-600' : vehicle.stock > 0 ? 'text-orange-600' : 'text-red-600'}">
                                ${vehicle.stock <= 0 ? 'EPUISE' : vehicle.stock + ' ' + (vehicle.stock > 1 ? 'véhicules' : 'véhicule')}
                            </span>
                        </p>
                    </div>
                    <div class="flex space-x-2">
                        ${vehicle.type === 'vente' ? `
                        <button onclick="toggleSoldStatus(${vehicle.id}, ${vehicle.is_sold ? 1 : 0})"
                            class="flex-1 ${vehicle.is_sold ? 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700' : 'bg-gradient-to-r from-red-400 to-red-500 hover:from-red-500 hover:to-red-600'} text-white py-2 rounded-lg transition-all duration-300 text-sm shadow-md font-semibold">
                            ${vehicle.is_sold ? '<i class="fas fa-check-circle mr-1"></i>Marquer Disponible' : '<i class="fas fa-times-circle mr-1"></i>Marquer Vendu'}
                        </button>` : ''}
                        <button onclick='editVehicleById(${vehicle.id})'
                            class="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 text-white py-2 rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-300 transform hover:scale-105 text-sm shadow-md">
                            <i class="fas fa-edit mr-1"></i>Modifier
                        </button>
                        <button onclick="deleteVehicle(${vehicle.id}, '${vehicle.name}')"
                            class="flex-1 bg-gradient-to-r from-red-500 to-red-600 text-white py-2 rounded-lg hover:from-red-600 hover:to-red-700 transition-all duration-300 transform hover:scale-105 text-sm shadow-md">
                            <i class="fas fa-trash mr-1"></i>Supprimer
                        </button>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

function filterVehiclesGrid(filter) {
    activeFilter = filter;

    // Mettre à jour le style des cartes
    const cards = { all: 'statCardAll', location: 'statCardLocation', vente: 'statCardVente', lowstock: 'statCardLowstock' };
    Object.entries(cards).forEach(([key, id]) => {
        const el = document.getElementById(id);
        if (!el) return;
        el.classList.toggle('ring-white', key === filter);
        el.classList.toggle('ring-transparent', key !== filter);
        el.classList.toggle('scale-105', key === filter);
    });

    // Filtrer et afficher
    let filtered = allVehiclesCache;
    if (filter === 'location') filtered = allVehiclesCache.filter(v => v.type === 'location');
    else if (filter === 'vente') filtered = allVehiclesCache.filter(v => v.type === 'vente');
    else if (filter === 'lowstock') filtered = allVehiclesCache.filter(v => v.stock <= (v.stock_alert_threshold || 1));

    // Afficher le label du filtre actif
    let label = document.getElementById('activeFilterLabel');
    if (!label) {
        label = document.createElement('p');
        label.id = 'activeFilterLabel';
        label.className = 'text-sm text-gray-500 mb-3';
        document.getElementById('vehiclesGrid').before(label);
    }
    const labels = { all: null, location: 'Filtre : Location', vente: 'Filtre : Vente', lowstock: 'Filtre : Stock faible' };
    label.textContent = labels[filter] || '';

    renderVehiclesGrid(filtered);
}

// Ouvrir le modal (Ajouter)
function openVehicleModal() {
    const modal = document.getElementById('vehicleModal');
    const modalContent = document.getElementById('modalContent');
    
    // Afficher le modal
    modal.style.display = 'flex';
    modal.classList.remove('hidden');
    
    setTimeout(() => {
        modalContent.classList.remove('scale-95', 'opacity-0');
        modalContent.classList.add('scale-100', 'opacity-100');
    }, 10);
    
    document.getElementById('modalTitle').textContent = 'Ajouter un véhicule';
    document.getElementById('vehicleForm').reset();
    document.getElementById('vehicleId').value = '';
    document.getElementById('vehicleExistingImages').value = '';
    
    // Réinitialiser la bibliothèque
    biblioSelected = [];
    const biblioInput = document.getElementById('biblioSelectedImages');
    if (biblioInput) biblioInput.value = '';
    const grid = document.getElementById('folderImagesGrid');
    if (grid) grid.innerHTML = '';
    const folderSelect = document.getElementById('voitureFolder');
    if (folderSelect) folderSelect.value = '';
    switchImageTab('upload');
    
    // Réinitialiser les valeurs par défaut
    document.getElementById('vehicleStock').value = 3;
    document.getElementById('vehicleStockAlert').value = 1;
    document.getElementById('vehicleType').value = 'location';
    
    // Afficher les champs de location par défaut
    toggleVehicleTypeFields();
    
    // Rendre l'image obligatoire en ajout
    document.getElementById('vehicleImage').setAttribute('required', 'required');
}

// Basculer entre les champs de location et de vente
function toggleVehicleTypeFields() {
    const type = document.getElementById('vehicleType').value;
    const locationSection = document.getElementById('locationPriceSection');
    const saleSection = document.getElementById('salePriceSection');
    
    // Vérifier si c'est une location (avec ou sans chauffeur)
    const isLocation = type === 'location-avec' || type === 'location-sans';
    
    if (isLocation) {
        locationSection.classList.remove('hidden');
        saleSection.classList.add('hidden');
        document.getElementById('driverAuthSection').classList.remove('hidden');
        
        // Rendre les champs de location obligatoires
        document.getElementById('vehiclePriceWithout').setAttribute('required', 'required');
        document.getElementById('vehiclePriceWith').setAttribute('required', 'required');
        
        // Rendre les champs de vente optionnels
        document.getElementById('vehicleSalePrice').removeAttribute('required');
        document.getElementById('vehicleYear').removeAttribute('required');
        document.getElementById('vehicleMileage').removeAttribute('required');
        document.getElementById('vehicleFuelType').removeAttribute('required');
        document.getElementById('vehicleTransmission').removeAttribute('required');
    } else if (type === 'vente') {
        locationSection.classList.add('hidden');
        saleSection.classList.remove('hidden');
        document.getElementById('driverAuthSection').classList.add('hidden');
        
        // Rendre les champs de location optionnels
        document.getElementById('vehiclePriceWithout').removeAttribute('required');
        document.getElementById('vehiclePriceWith').removeAttribute('required');
        
        // Rendre les champs de vente obligatoires
        document.getElementById('vehicleSalePrice').setAttribute('required', 'required');
        document.getElementById('vehicleYear').setAttribute('required', 'required');
        document.getElementById('vehicleMileage').setAttribute('required', 'required');
        document.getElementById('vehicleFuelType').setAttribute('required', 'required');
        document.getElementById('vehicleTransmission').setAttribute('required', 'required');
    }
}

// Fermer le modal
function closeVehicleModal() {
    const modal = document.getElementById('vehicleModal');
    const modalContent = document.getElementById('modalContent');
    modalContent.classList.remove('scale-100', 'opacity-100');
    modalContent.classList.add('scale-95', 'opacity-0');
    setTimeout(() => {
        modal.classList.add('hidden');
        modal.style.display = 'none';
    }, 300);
}

// Modifier un véhicule
function editVehicleById(id) {
    const vehicle = allVehiclesCache.find(v => v.id === id);
    if (vehicle) editVehicle(vehicle);
}

function editVehicle(vehicle) {
    const modal = document.getElementById('vehicleModal');
    const modalContent = document.getElementById('modalContent');
    
    // Afficher le modal
    modal.style.display = 'flex';
    modal.classList.remove('hidden');
    
    setTimeout(() => {
        modalContent.classList.remove('scale-95', 'opacity-0');
        modalContent.classList.add('scale-100', 'opacity-100');
    }, 10);
    
    document.getElementById('modalTitle').textContent = 'Modifier le véhicule';
    
    document.getElementById('vehicleId').value = vehicle.id;
    document.getElementById('vehicleName').value = vehicle.name;
    document.getElementById('vehicleCategory').value = vehicle.category;
    document.getElementById('vehiclePriceWithout').value = vehicle.price_without_driver;
    document.getElementById('vehiclePriceWith').value = vehicle.price_with_driver;
    document.getElementById('vehicleImageUrl').value = vehicle.image_url;
    // Stocker les images existantes pour les conserver si pas de nouvel upload
    const existingImages = vehicle.images ? (typeof vehicle.images === 'string' ? JSON.parse(vehicle.images) : vehicle.images) : (vehicle.image_url ? [vehicle.image_url] : []);
    document.getElementById('vehicleExistingImages').value = JSON.stringify(existingImages);
    document.getElementById('vehicleStock').value = vehicle.stock || 3;
    document.getElementById('vehicleStockAlert').value = vehicle.stock_alert_threshold || 1;
    document.getElementById('vehicleDescription').value = vehicle.description || '';
    
    // Autorisations sans chauffeur
    document.getElementById('authAbidjan').checked = vehicle.autorise_sans_chauffeur_abidjan !== 0;
    document.getElementById('authHorsAbidjan').checked = vehicle.autorise_sans_chauffeur_hors_abidjan !== 0;
    
    const features = JSON.parse(vehicle.features || '[]');
    document.getElementById('vehicleFeatures').value = features.join(', ');
    
    // Rendre l'image optionnelle en modification
    document.getElementById('vehicleImage').removeAttribute('required');
}

// Soumettre le formulaire (Créer ou Modifier)
document.getElementById('vehicleForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const id = document.getElementById('vehicleId').value;
    const type = document.getElementById('vehicleType').value;
    const features = document.getElementById('vehicleFeatures').value
        .split(',')
        .map(f => f.trim())
        .filter(f => f);
    
    // Gérer l'upload de l'image
    const fileInput = document.getElementById('vehicleImage');
    let imageUrl = document.getElementById('vehicleImageUrl').value;
    let allImageUrls = [];
    
    // Récupérer les images existantes
    const existingImagesRaw = document.getElementById('vehicleExistingImages')?.value;
    let existingImages = [];
    if (existingImagesRaw) {
        try { existingImages = JSON.parse(existingImagesRaw); } catch(e) {}
    }
    
    // Vérifier si des images bibliothèque ont été sélectionnées
    const biblioRaw = document.getElementById('biblioSelectedImages')?.value;
    let biblioUrls = [];
    if (biblioRaw) {
        try { biblioUrls = JSON.parse(biblioRaw); } catch(e) {}
    }

    if (fileInput.files && fileInput.files.length > 0) {
        // Upload de nouveaux fichiers
        const formData = new FormData();
        Array.from(fileInput.files).forEach(file => {
            formData.append('images', file);
        });
        try {
            const uploadResponse = await authFetch(`${API_URL}/upload/multiple`, {
                method: 'POST',
                body: formData
            });
            const uploadData = await uploadResponse.json();
            if (uploadData.success && uploadData.data.length > 0) {
                const newUrls = uploadData.data.map(f => f.imageUrl);
                allImageUrls = newUrls;
                imageUrl = newUrls[0];
            } else {
                alert('Erreur lors de l\'upload de l\'image');
                return;
            }
        } catch (error) {
            alert('Erreur lors de l\'upload de l\'image');
            console.error(error);
            return;
        }
    } else if (biblioUrls.length > 0) {
        // Images sélectionnées depuis la bibliothèque
        allImageUrls = biblioUrls;
        imageUrl = biblioUrls[0];
    } else {
        // Pas de changement → conserver les images existantes
        allImageUrls = existingImages;
    }
    
    const vehicleData = {
        name: document.getElementById('vehicleName').value,
        category: document.getElementById('vehicleCategory').value,
        type: type,
        image_url: imageUrl,
        images: allImageUrls.length > 0 ? allImageUrls : null,
        features: features,
        description: document.getElementById('vehicleDescription').value,
        stock: parseInt(document.getElementById('vehicleStock').value) >= 0 ? parseInt(document.getElementById('vehicleStock').value) : 3,
        stock_alert_threshold: parseInt(document.getElementById('vehicleStockAlert').value) >= 0 ? parseInt(document.getElementById('vehicleStockAlert').value) : 1,
        is_active: 1,
        // Destinations
        dest_abidjan: document.getElementById('destAbidjan').checked ? 1 : 0,
        dest_interieur: document.getElementById('destInterieur').checked ? 1 : 0,
        // Autorisations sans chauffeur
        autorise_sans_chauffeur_abidjan: document.getElementById('authAbidjan').checked ? 1 : 0,
        autorise_sans_chauffeur_hors_abidjan: document.getElementById('authHorsAbidjan').checked ? 1 : 0
    };
    
    // Ajouter les champs selon le type
    const isLocation = type === 'location-avec' || type === 'location-sans';
    
    if (isLocation) {
        vehicleData.type = 'location'; // Enregistrer comme 'location' dans la base
        vehicleData.price_without_driver = parseInt(document.getElementById('vehiclePriceWithout').value) || null;
        vehicleData.price_with_driver = parseInt(document.getElementById('vehiclePriceWith').value) || null;
    } else if (type === 'vente') {
        vehicleData.sale_price = parseInt(document.getElementById('vehicleSalePrice').value) || null;
        vehicleData.year = parseInt(document.getElementById('vehicleYear').value) || null;
        vehicleData.mileage = document.getElementById('vehicleMileage').value || null;
        vehicleData.fuel_type = document.getElementById('vehicleFuelType').value || null;
        vehicleData.transmission = document.getElementById('vehicleTransmission').value || null;
    }
    
    console.log('📦 Données envoyées:', vehicleData);
    
    try {
        const url = id ? `${API_URL}/vehicles/${id}` : `${API_URL}/vehicles`;
        const method = id ? 'PUT' : 'POST';
        
        console.log(`🚀 Envoi ${method} vers ${url}`);
        
        const response = await authFetch(url, {
            method: method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(vehicleData)
        });
        
        const data = await response.json();
        
        console.log('✅ Réponse reçue:', data);
        
        if (data.success) {
            closeVehicleModal();
            loadVehicles();
            alert(id ? 'Véhicule modifié avec succès' : 'Véhicule ajouté avec succès');
        } else {
            alert('Erreur: ' + data.message);
        }
    } catch (error) {
        alert('Erreur lors de l\'enregistrement');
        console.error('❌ Erreur:', error);
    }
});

// Supprimer un véhicule
async function deleteVehicle(id, name) {
    if (!confirm(`Êtes-vous sûr de vouloir supprimer "${name}" ?`)) {
        return;
    }
    
    try {
        const response = await authFetch(`${API_URL}/vehicles/${id}`, {
            method: 'DELETE'
        });
        
        const data = await response.json();
        
        if (data.success) {
            loadVehicles();
            alert('Véhicule supprimé avec succès');
        } else {
            alert('Erreur: ' + data.message);
        }
    } catch (error) {
        alert('Erreur lors de la suppression');
        console.error(error);
    }
}


// =========================
// MODAL LISTE DES CLIENTS
// =========================
async function showClientsModal() {
    const modal = document.getElementById('clientsModal');
    const clientsList = document.getElementById('clientsList');
    
    modal.classList.remove('hidden');
    clientsList.innerHTML = '<div class="text-center py-8"><i class="fas fa-spinner fa-spin text-4xl text-blue-500"></i><p class="mt-4 text-gray-600">Chargement des clients...</p></div>';
    
    try {
        const response = await authFetch(`${API_URL}/reservations`);
        const data = await response.json();
        
        if (data.success && data.data.length > 0) {
            // Grouper les réservations par client
            const clientsMap = new Map();
            
            data.data.forEach(reservation => {
                const key = reservation.client_whatsapp;
                if (!clientsMap.has(key)) {
                    clientsMap.set(key, {
                        name: reservation.client_name,
                        whatsapp: reservation.client_whatsapp,
                        reservations: []
                    });
                }
                clientsMap.get(key).reservations.push(reservation);
            });
            
            // Afficher les clients
            clientsList.innerHTML = '';
            let clientNumber = 1;
            
            clientsMap.forEach((client, whatsapp) => {
                const totalReservations = client.reservations.length;
                const totalRevenue = client.reservations.reduce((sum, r) => sum + (r.total_price || 0), 0);
                
                const clientCard = document.createElement('div');
                clientCard.className = 'bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl p-6 border-2 border-blue-200 hover:shadow-lg transition-all';
                clientCard.innerHTML = `
                    <div class="flex justify-between items-start mb-4">
                        <div class="flex items-center space-x-4">
                            <div class="bg-blue-500 text-white w-12 h-12 rounded-full flex items-center justify-center font-bold text-xl">
                                ${clientNumber}
                            </div>
                            <div>
                                <h3 class="text-xl font-bold text-gray-800">${client.name}</h3>
                                <a href="https://wa.me/${client.whatsapp}" target="_blank" class="text-green-600 hover:text-green-700 flex items-center space-x-2">
                                    <i class="fab fa-whatsapp"></i>
                                    <span>${client.whatsapp}</span>
                                </a>
                            </div>
                        </div>
                        <div class="text-right">
                            <p class="text-sm text-gray-600">Total réservations</p>
                            <p class="text-2xl font-bold text-blue-600">${totalReservations}</p>
                        </div>
                    </div>
                    
                    <div class="grid md:grid-cols-2 gap-4 mb-4">
                        <div class="bg-white rounded-lg p-4">
                            <p class="text-sm text-gray-600 mb-1">Revenu total</p>
                            <p class="text-xl font-bold text-green-600">${totalRevenue.toLocaleString()} FCFA</p>
                        </div>
                        <div class="bg-white rounded-lg p-4">
                            <p class="text-sm text-gray-600 mb-1">Dernière réservation</p>
                            <p class="text-sm font-semibold text-gray-800">${formatDate(client.reservations[0].created_at)}</p>
                        </div>
                    </div>
                    
                    <button onclick="showClientDetails('${whatsapp}')" class="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition">
                        <i class="fas fa-eye mr-2"></i>Voir toutes les réservations
                    </button>
                `;
                
                clientsList.appendChild(clientCard);
                clientNumber++;
            });
        } else {
            clientsList.innerHTML = '<div class="text-center py-12"><i class="fas fa-users text-6xl text-gray-300 mb-4"></i><p class="text-gray-500 text-lg">Aucun client trouvé</p></div>';
        }
    } catch (error) {
        console.error('Erreur chargement clients:', error);
        clientsList.innerHTML = '<div class="text-center py-12"><i class="fas fa-exclamation-triangle text-6xl text-red-500 mb-4"></i><p class="text-red-500 text-lg">Erreur lors du chargement des clients</p></div>';
    }
}

function closeClientsModal() {
    document.getElementById('clientsModal').classList.add('hidden');
}

async function showClientDetails(whatsapp) {
    // Créer un modal pour afficher les détails du client
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-black/50 backdrop-blur-sm z-[60] flex items-center justify-center p-4';
    modal.innerHTML = `
        <div class="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl">
            <div class="bg-gradient-to-r from-green-500 to-green-600 text-white p-6 flex justify-between items-center">
                <div class="flex items-center space-x-3">
                    <i class="fas fa-user-circle text-3xl"></i>
                    <div>
                        <h2 class="text-2xl font-bold">Détails du client</h2>
                        <p class="text-sm text-green-100">WhatsApp: ${whatsapp}</p>
                    </div>
                </div>
                <button onclick="this.closest('.fixed').remove()" class="text-white hover:bg-white/20 p-2 rounded-lg transition">
                    <i class="fas fa-times text-2xl"></i>
                </button>
            </div>
            
            <div class="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
                <div id="clientDetailsContent" class="text-center py-8">
                    <i class="fas fa-spinner fa-spin text-4xl text-green-500"></i>
                    <p class="mt-4 text-gray-600">Chargement des réservations...</p>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    try {
        const response = await authFetch(`${API_URL}/reservations`);
        const data = await response.json();
        
        if (data.success) {
            const clientReservations = data.data.filter(r => r.client_whatsapp === whatsapp);
            
            if (clientReservations.length > 0) {
                const client = clientReservations[0];
                const totalRevenue = clientReservations.reduce((sum, r) => sum + (r.total_price || 0), 0);
                
                let html = `
                    <div class="bg-gradient-to-r from-green-50 to-green-100 rounded-xl p-6 mb-6 border-2 border-green-200">
                        <div class="flex items-center justify-between mb-4">
                            <div>
                                <h3 class="text-2xl font-bold text-gray-800">${client.client_name}</h3>
                                <a href="https://wa.me/${whatsapp}" target="_blank" class="text-green-600 hover:text-green-700 flex items-center space-x-2 mt-1">
                                    <i class="fab fa-whatsapp"></i>
                                    <span>${whatsapp}</span>
                                </a>
                            </div>
                            <div class="text-right">
                                <p class="text-sm text-gray-600">Total réservations</p>
                                <p class="text-3xl font-bold text-green-600">${clientReservations.length}</p>
                            </div>
                        </div>
                        <div class="bg-white rounded-lg p-4">
                            <p class="text-sm text-gray-600 mb-1">Revenu total généré</p>
                            <p class="text-2xl font-bold text-green-600">${totalRevenue.toLocaleString()} FCFA</p>
                        </div>
                    </div>
                    
                    <h4 class="text-xl font-bold text-gray-800 mb-4">
                        <i class="fas fa-list mr-2 text-green-500"></i>
                        Historique des réservations
                    </h4>
                    
                    <div class="space-y-4">
                `;
                
                clientReservations.forEach((reservation, index) => {
                    const statusColors = {
                        'pending': 'bg-yellow-100 text-yellow-800 border-yellow-300',
                        'confirmed': 'bg-green-100 text-green-800 border-green-300',
                        'completed': 'bg-blue-100 text-blue-800 border-blue-300',
                        'cancelled': 'bg-red-100 text-red-800 border-red-300'
                    };
                    
                    const statusLabels = {
                        'pending': 'En attente',
                        'confirmed': 'Confirmée',
                        'completed': 'Terminée',
                        'cancelled': 'Annulée'
                    };
                    
                    const statusClass = statusColors[reservation.status] || 'bg-gray-100 text-gray-800 border-gray-300';
                    const statusLabel = statusLabels[reservation.status] || reservation.status;
                    
                    html += `
                        <div class="bg-white rounded-xl p-6 border-2 border-gray-200 hover:shadow-lg transition-all">
                            <div class="flex justify-between items-start mb-4">
                                <div>
                                    <span class="text-sm font-semibold text-gray-500">Réservation #${reservation.id}</span>
                                    <h5 class="text-lg font-bold text-gray-800 mt-1">${reservation.vehicle_name || 'Véhicule non spécifié'}</h5>
                                </div>
                                <span class="px-3 py-1 rounded-full text-sm font-semibold border-2 ${statusClass}">
                                    ${statusLabel}
                                </span>
                            </div>
                            
                            <div class="grid md:grid-cols-2 gap-4 mb-4">
                                <div>
                                    <p class="text-sm text-gray-600">Dates</p>
                                    <p class="font-semibold text-gray-800">
                                        ${formatDate(reservation.start_date)} - ${formatDate(reservation.end_date)}
                                    </p>
                                </div>
                                <div>
                                    <p class="text-sm text-gray-600">Lieu de récupération</p>
                                    <p class="font-semibold text-gray-800">${reservation.pickup_location || 'Non spécifié'}</p>
                                </div>
                                <div>
                                    <p class="text-sm text-gray-600">Avec chauffeur</p>
                                    <p class="font-semibold text-gray-800">${reservation.with_driver ? 'Oui' : 'Non'}</p>
                                </div>
                                <div>
                                    <p class="text-sm text-gray-600">Prix total</p>
                                    <p class="font-bold text-green-600 text-lg">${(reservation.total_price || 0).toLocaleString()} FCFA</p>
                                </div>
                            </div>
                            
                            ${reservation.message ? `
                                <div class="bg-gray-50 rounded-lg p-3 mt-4">
                                    <p class="text-sm text-gray-600 mb-1">Message:</p>
                                    <p class="text-sm text-gray-800">${reservation.message}</p>
                                </div>
                            ` : ''}
                            
                            <div class="mt-4 text-xs text-gray-500">
                                Créée le ${formatDate(reservation.created_at)}
                            </div>
                        </div>
                    `;
                });
                
                html += '</div>';
                
                document.getElementById('clientDetailsContent').innerHTML = html;
            } else {
                document.getElementById('clientDetailsContent').innerHTML = `
                    <div class="text-center py-12">
                        <i class="fas fa-inbox text-6xl text-gray-300 mb-4"></i>
                        <p class="text-gray-500 text-lg">Aucune réservation trouvée pour ce client</p>
                    </div>
                `;
            }
        }
    } catch (error) {
        console.error('Erreur chargement détails client:', error);
        document.getElementById('clientDetailsContent').innerHTML = `
            <div class="text-center py-12">
                <i class="fas fa-exclamation-triangle text-6xl text-red-500 mb-4"></i>
                <p class="text-red-500 text-lg">Erreur lors du chargement des détails</p>
            </div>
        `;
    }
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' });
}

// =========================
// NOTIFICATIONS TEMPS RÉEL
// =========================
const API_NOTIF_URL = (window.API_BASE_URL || 'http://localhost:5000') + '/api/notifications';
let swRegistration = null;
let sseSource = null;

async function initNotifications() {
    // 1. Enregistrer le Service Worker
    if ('serviceWorker' in navigator) {
        try {
            swRegistration = await navigator.serviceWorker.register('/sw-admin.js');
            console.log('[NOTIF] Service Worker enregistré');
        } catch (e) {
            console.warn('[NOTIF] Service Worker non disponible:', e.message);
        }
    }

    // 2. Demander la permission de notifications
    if ('Notification' in window) {
        if (Notification.permission === 'default') {
            const permission = await Notification.requestPermission();
            console.log('[NOTIF] Permission:', permission);
        }
    }

    // 3. Se connecter au flux SSE
    connectSSE();
}

function connectSSE() {
    if (sseSource) sseSource.close();

    sseSource = new EventSource(`${API_NOTIF_URL}/subscribe`);

    sseSource.onopen = () => {
        console.log('[NOTIF] Connecté au flux de notifications');
        updateNotifStatus(true);
    };

    sseSource.onmessage = (event) => {
        try {
            const data = JSON.parse(event.data);
            if (data.type === 'new_reservation') {
                showAdminNotification(data);
                // Recharger la liste des réservations si on est sur cet onglet
                if (document.getElementById('reservationsSection') &&
                    !document.getElementById('reservationsSection').classList.contains('hidden')) {
                    loadReservations();
                    loadStats();
                }
            }
        } catch (e) {}
    };

    sseSource.onerror = () => {
        console.warn('[NOTIF] Connexion SSE perdue, reconnexion dans 5s...');
        updateNotifStatus(false);
        sseSource.close();
        setTimeout(connectSSE, 5000);
    };
}

function showAdminNotification(data) {
    const { title, body, reservationId } = data;

    // Notification native du navigateur (fonctionne même onglet en arrière-plan)
    if (Notification.permission === 'granted') {
        if (swRegistration) {
            // Via Service Worker (fonctionne onglet fermé si SW actif)
            swRegistration.showNotification(title, {
                body: body,
                icon: 'https://cdn-icons-png.flaticon.com/512/3774/3774278.png',
                badge: 'https://cdn-icons-png.flaticon.com/512/3774/3774278.png',
                tag: `reservation-${reservationId}`,
                requireInteraction: true,
                vibrate: [200, 100, 200]
            });
        } else {
            new Notification(title, { body, requireInteraction: true });
        }
    }

    // Bannière in-app en plus
    showInAppBanner(title, body, reservationId);
}

function showInAppBanner(title, body, reservationId) {
    // Supprimer l'ancienne bannière si elle existe
    const old = document.getElementById('notifBanner');
    if (old) old.remove();

    const banner = document.createElement('div');
    banner.id = 'notifBanner';
    banner.style.cssText = `
        position: fixed; top: 20px; right: 20px; z-index: 99999;
        background: #1a1a2e; color: white; border-left: 5px solid #f97316;
        border-radius: 12px; padding: 16px 20px; max-width: 360px;
        box-shadow: 0 8px 32px rgba(0,0,0,0.4);
        animation: slideInRight 0.4s ease;
        cursor: pointer;
    `;
    banner.innerHTML = `
        <style>
            @keyframes slideInRight {
                from { transform: translateX(120%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
        </style>
        <div style="display:flex;align-items:center;gap:12px;">
            <div style="font-size:28px;">🔔</div>
            <div style="flex:1;">
                <div style="font-weight:bold;font-size:15px;margin-bottom:4px;">${title}</div>
                <div style="font-size:13px;color:#ccc;">${body}</div>
            </div>
            <button onclick="document.getElementById('notifBanner').remove()"
                style="background:none;border:none;color:#999;font-size:18px;cursor:pointer;padding:0 4px;">✕</button>
        </div>
        <div style="margin-top:10px;display:flex;gap:8px;">
            <button onclick="showSection('reservations');document.getElementById('notifBanner').remove();"
                style="background:#f97316;color:white;border:none;padding:6px 14px;border-radius:6px;font-size:12px;cursor:pointer;font-weight:bold;">
                Voir la réservation
            </button>
        </div>
    `;
    document.body.appendChild(banner);

    // Auto-fermeture après 15s
    setTimeout(() => { if (banner.parentNode) banner.remove(); }, 15000);
}

function updateNotifStatus(connected) {
    let indicator = document.getElementById('notifIndicator');
    if (!indicator) return;
    indicator.style.background = connected ? '#22c55e' : '#ef4444';
    indicator.title = connected ? 'Notifications actives' : 'Notifications déconnectées';
}

// Lancer les notifications après connexion admin (hook sur le login)
document.getElementById('loginForm').addEventListener('submit', () => {
    setTimeout(initNotifications, 1000);
});

// =========================
// BIBLIOTHÈQUE D'IMAGES VOITURES
// =========================

let biblioSelected = []; // URLs sélectionnées depuis la bibliothèque

function switchImageTab(tab) {
    const tabUpload = document.getElementById('tabUpload');
    const tabBiblio = document.getElementById('tabBiblio');
    const panelUpload = document.getElementById('panelUpload');
    const panelBiblio = document.getElementById('panelBiblio');

    if (tab === 'upload') {
        tabUpload.className = 'flex-1 py-2 px-3 rounded-lg text-sm font-semibold bg-orange-500 text-white transition';
        tabBiblio.className = 'flex-1 py-2 px-3 rounded-lg text-sm font-semibold bg-gray-200 text-gray-700 transition';
        panelUpload.classList.remove('hidden');
        panelBiblio.classList.add('hidden');
    } else {
        tabBiblio.className = 'flex-1 py-2 px-3 rounded-lg text-sm font-semibold bg-orange-500 text-white transition';
        tabUpload.className = 'flex-1 py-2 px-3 rounded-lg text-sm font-semibold bg-gray-200 text-gray-700 transition';
        panelBiblio.classList.remove('hidden');
        panelUpload.classList.add('hidden');
        loadVoitureFolders();
    }
}

async function loadVoitureFolders() {
    const select = document.getElementById('voitureFolder');
    if (select.options.length > 1) return; // déjà chargé
    try {
        const res = await authFetch(`${API_URL}/upload/voitures`);
        const data = await res.json();
        if (data.success) {
            data.data.forEach(folder => {
                const opt = document.createElement('option');
                opt.value = folder;
                opt.textContent = folder;
                select.appendChild(opt);
            });
        }
    } catch (e) {
        console.error('Erreur chargement dossiers:', e);
    }
}

async function loadFolderImages() {
    const folder = document.getElementById('voitureFolder').value;
    const grid = document.getElementById('folderImagesGrid');
    grid.innerHTML = '';
    biblioSelected = [];
    document.getElementById('biblioSelectedImages').value = '';

    if (!folder) return;

    try {
        const res = await authFetch(`${API_URL}/upload/voitures/${encodeURIComponent(folder)}`);
        const data = await res.json();
        if (data.success) {
            data.data.forEach(url => {
                const fullUrl = `${window.API_BASE_URL || 'http://localhost:5000'}${url}`;
                const wrapper = document.createElement('div');
                wrapper.className = 'relative cursor-pointer rounded-lg overflow-hidden border-2 border-transparent hover:border-orange-400 transition';
                wrapper.dataset.url = url;
                wrapper.innerHTML = `
                    <img src="${fullUrl}" class="w-full h-20 object-cover" loading="lazy">
                    <div class="check-overlay hidden absolute inset-0 bg-orange-500/60 flex items-center justify-center">
                        <i class="fas fa-check-circle text-white text-2xl"></i>
                    </div>
                `;
                wrapper.addEventListener('click', () => toggleBiblioImage(wrapper, url));
                grid.appendChild(wrapper);
            });
        }
    } catch (e) {
        console.error('Erreur chargement images:', e);
    }
}

function toggleBiblioImage(wrapper, url) {
    const overlay = wrapper.querySelector('.check-overlay');
    const idx = biblioSelected.indexOf(url);
    if (idx === -1) {
        biblioSelected.push(url);
        overlay.classList.remove('hidden');
        wrapper.classList.add('border-orange-500');
    } else {
        biblioSelected.splice(idx, 1);
        overlay.classList.add('hidden');
        wrapper.classList.remove('border-orange-500');
    }
    document.getElementById('biblioSelectedImages').value = JSON.stringify(biblioSelected);

    // Mettre à jour le compteur
    const hint = document.getElementById('folderImagesHint');
    if (biblioSelected.length > 0) {
        hint.textContent = `${biblioSelected.length} image(s) sélectionnée(s) — La première sera l'image principale`;
        hint.className = 'text-xs text-orange-600 font-semibold mt-1';
    } else {
        hint.textContent = 'Cliquez sur les images pour les sélectionner (la première = image principale)';
        hint.className = 'text-xs text-gray-500 mt-1';
    }
}


// =========================
// STATISTIQUES DE VISITES
// =========================
async function loadVisitStats(days = 30) {
    const container = document.getElementById('visitStatsContent');
    if (!container) return;

    // Récupérer le filtre type véhicule
    const vehicleType = document.getElementById('vehicleTypeFilter')?.value || 'all';

    // Mettre à jour l'état actif des boutons de période
    document.querySelectorAll('#sectionStats .flex.gap-2 button').forEach(btn => {
        const btnDays = parseInt(btn.getAttribute('onclick').match(/\d+/)?.[0]);
        if (btnDays === days) {
            btn.className = 'px-4 py-2 bg-orange-500 text-white rounded-lg text-sm font-semibold';
        } else {
            btn.className = 'px-4 py-2 bg-gray-200 hover:bg-orange-500 hover:text-white rounded-lg text-sm font-semibold transition';
        }
    });

    container.innerHTML = '<div class="text-center py-12"><i class="fas fa-spinner fa-spin text-4xl text-orange-500"></i><p class="mt-3 text-gray-500">Chargement...</p></div>';

    try {
        const res = await authFetch(`${API_URL}/visits/stats?days=${days}&vehicleType=${vehicleType}`);
        const data = await res.json();
        if (!data.success) throw new Error(data.message);
        const { total, today, this_week, byPage, topVehicles, topLocation, topVente, byDay, conversions, conversion_rate, unique_sessions, converted_sessions } = data.data;

        // Graphique sparkline simple (barres CSS)
        const maxDay = Math.max(...byDay.map(d => d.visits), 1);
        const chartBars = byDay.map(d => {
            const h = Math.round((d.visits / maxDay) * 60);
            const dateLabel = new Date(d.date).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' });
            return `<div class="flex flex-col items-center" title="${dateLabel}: ${d.visits} visites">
                <span class="text-xs text-gray-400 mb-1">${d.visits}</span>
                <div class="bg-orange-500 rounded-t w-full" style="height:${h}px;min-height:4px;"></div>
                <span class="text-xs text-gray-400 mt-1 rotate-45 origin-left hidden md:block">${dateLabel}</span>
            </div>`;
        }).join('');

        container.innerHTML = `
            <!-- Cartes résumé -->
            <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <div onclick="filterVisitStats('all')" class="visit-stat-card cursor-pointer bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white shadow-lg transform hover:scale-105 transition-all ring-4 ring-transparent hover:ring-blue-300" data-filter="all">
                    <div class="flex items-center justify-between">
                        <div>
                            <p class="text-blue-100 text-sm font-semibold mb-1">Visites (${days}j)</p>
                            <p class="text-4xl font-black">${total}</p>
                        </div>
                        <div class="bg-white/20 w-14 h-14 rounded-xl flex items-center justify-center">
                            <i class="fas fa-eye text-2xl"></i>
                        </div>
                    </div>
                    <p class="text-blue-200 text-xs mt-2">Cliquer pour voir tout</p>
                </div>
                <div onclick="filterVisitStats('today')" class="visit-stat-card cursor-pointer bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white shadow-lg transform hover:scale-105 transition-all ring-4 ring-transparent hover:ring-green-300" data-filter="today">
                    <div class="flex items-center justify-between">
                        <div>
                            <p class="text-green-100 text-sm font-semibold mb-1">Aujourd'hui</p>
                            <p class="text-4xl font-black">${today}</p>
                        </div>
                        <div class="bg-white/20 w-14 h-14 rounded-xl flex items-center justify-center">
                            <i class="fas fa-calendar-day text-2xl"></i>
                        </div>
                    </div>
                    <p class="text-green-200 text-xs mt-2">Cliquer pour filtrer aujourd'hui</p>
                </div>
                <div onclick="filterVisitStats('week')" class="visit-stat-card cursor-pointer bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-white shadow-lg transform hover:scale-105 transition-all ring-4 ring-transparent hover:ring-purple-300" data-filter="week">
                    <div class="flex items-center justify-between">
                        <div>
                            <p class="text-purple-100 text-sm font-semibold mb-1">Cette semaine</p>
                            <p class="text-4xl font-black">${this_week}</p>
                        </div>
                        <div class="bg-white/20 w-14 h-14 rounded-xl flex items-center justify-center">
                            <i class="fas fa-calendar-week text-2xl"></i>
                        </div>
                    </div>
                    <p class="text-purple-200 text-xs mt-2">Cliquer pour filtrer cette semaine</p>
                </div>
                <div onclick="filterVisitStats('conversions')" class="visit-stat-card cursor-pointer bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl p-6 text-white shadow-lg transform hover:scale-105 transition-all ring-4 ring-transparent hover:ring-orange-300" data-filter="conversions">
                    <div class="flex items-center justify-between">
                        <div>
                            <p class="text-orange-100 text-sm font-semibold mb-1">Taux conversion</p>
                            <p class="text-4xl font-black">${conversion_rate}%</p>
                            <p class="text-orange-100 text-xs mt-1">${converted_sessions}/${unique_sessions} sessions</p>
                        </div>
                        <div class="bg-white/20 w-14 h-14 rounded-xl flex items-center justify-center">
                            <i class="fas fa-funnel-dollar text-2xl"></i>
                        </div>
                    </div>
                    <p class="text-orange-200 text-xs mt-2">Cliquer pour voir les conversions</p>
                </div>
            </div>

            <!-- Graphique visites par jour -->
            <div id="visitChartSection" class="bg-white rounded-xl shadow-lg p-6 mb-6">
                <h3 class="text-lg font-bold text-gray-800 mb-4"><i class="fas fa-chart-bar text-orange-500 mr-2"></i>Visites par jour</h3>
                <div class="flex items-end gap-1 h-20 overflow-x-auto pb-6">
                    ${chartBars || '<p class="text-gray-400 text-sm">Aucune donnée</p>'}
                </div>
            </div>

            <div class="grid md:grid-cols-2 gap-6 mb-6">
                <!-- Top véhicules -->
                <div id="visitVehiclesSection" class="bg-white rounded-xl shadow-lg p-6">
                    <h3 class="text-lg font-bold text-gray-800 mb-4"><i class="fas fa-car text-orange-500 mr-2"></i>Véhicules les plus consultés</h3>
                    ${topVehicles.length ? topVehicles.map((v, i) => `
                        <div class="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                            <div class="flex items-center gap-3">
                                <span class="w-6 h-6 rounded-full ${v.vehicle_type === 'vente' ? 'bg-orange-100 text-orange-600' : 'bg-blue-100 text-blue-600'} text-xs font-bold flex items-center justify-center">${i+1}</span>
                                <div>
                                    <span class="text-gray-700 font-medium text-sm">${v.vehicle_name || 'Inconnu'}</span>
                                    <span class="ml-2 text-xs px-1.5 py-0.5 rounded ${v.vehicle_type === 'vente' ? 'bg-orange-100 text-orange-600' : 'bg-blue-100 text-blue-600'}">${v.vehicle_type === 'vente' ? 'Vente' : 'Location'}</span>
                                </div>
                            </div>
                            <span class="${v.vehicle_type === 'vente' ? 'bg-orange-500' : 'bg-blue-500'} text-white text-xs font-bold px-2 py-1 rounded-full">${v.visits}</span>
                        </div>
                    `).join('') : '<p class="text-gray-400 text-sm text-center py-4"><i class="fas fa-inbox mr-2"></i>Aucune donnée</p>'}
                </div>

                <!-- Pages visitées -->
                <div id="visitPagesSection" class="bg-white rounded-xl shadow-lg p-6">
                    <h3 class="text-lg font-bold text-gray-800 mb-4"><i class="fas fa-file-alt text-orange-500 mr-2"></i>Pages visitées</h3>
                    ${byPage.length ? byPage.map((p, i) => `
                        <div class="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                            <div class="flex items-center gap-3">
                                <span class="w-6 h-6 rounded-full bg-blue-100 text-blue-600 text-xs font-bold flex items-center justify-center">${i+1}</span>
                                <span class="text-gray-700 font-medium text-sm">${p.page}</span>
                            </div>
                            <span class="bg-blue-500 text-white text-xs font-bold px-2 py-1 rounded-full">${p.visits}</span>
                        </div>
                    `).join('') : '<p class="text-gray-400 text-sm">Aucune donnée</p>'}
                </div>
            </div>

            <!-- Traçabilité : visites → réservations -->
            <div id="visitConvSection" class="bg-white rounded-xl shadow-lg p-6">
                <h3 class="text-lg font-bold text-gray-800 mb-4">
                    <i class="fas fa-route text-green-500 mr-2"></i>Traçabilité visite → réservation
                    <span class="ml-2 text-sm font-normal text-gray-400">(clients ayant visité puis réservé)</span>
                </h3>
                ${conversions.length ? `
                <div class="overflow-x-auto">
                    <table class="w-full text-sm">
                        <thead>
                            <tr class="bg-gray-50 text-gray-600 text-xs uppercase">
                                <th class="px-4 py-3 text-left">Client</th>
                                <th class="px-4 py-3 text-left">WhatsApp</th>
                                <th class="px-4 py-3 text-left">Véhicule consulté</th>
                                <th class="px-4 py-3 text-left">Visite</th>
                                <th class="px-4 py-3 text-left">Réservation #</th>
                                <th class="px-4 py-3 text-left">Statut</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${conversions.map(c => {
                                const statusColors = { pending: 'bg-yellow-100 text-yellow-800', confirmed: 'bg-green-100 text-green-800', completed: 'bg-blue-100 text-blue-800', cancelled: 'bg-red-100 text-red-800' };
                                const visitDate = new Date(c.visit_time).toLocaleDateString('fr-FR', { day:'2-digit', month:'short', hour:'2-digit', minute:'2-digit' });
                                return `<tr class="border-b border-gray-100 hover:bg-gray-50">
                                    <td class="px-4 py-3 font-semibold text-gray-800">${c.client_name}</td>
                                    <td class="px-4 py-3 text-gray-600">${c.client_whatsapp}</td>
                                    <td class="px-4 py-3 text-gray-700">${c.vehicle_name || '-'}</td>
                                    <td class="px-4 py-3 text-gray-500 text-xs">${visitDate}</td>
                                    <td class="px-4 py-3"><span class="font-bold text-orange-600">#${c.reservation_id}</span></td>
                                    <td class="px-4 py-3"><span class="px-2 py-1 rounded-full text-xs font-semibold ${statusColors[c.status] || 'bg-gray-100 text-gray-600'}">${c.status}</span></td>
                                </tr>`;
                            }).join('')}
                        </tbody>
                    </table>
                </div>` : '<p class="text-gray-400 text-sm text-center py-6"><i class="fas fa-info-circle mr-2"></i>Aucune conversion enregistrée pour cette période</p>'}
            </div>
        `;
    } catch (e) {
        container.innerHTML = `<div class="text-center py-12 text-red-500"><i class="fas fa-exclamation-triangle text-4xl mb-3"></i><p>${e.message}</p></div>`;
    }
}

// =========================
// FILTRE STATS DE VISITES
// =========================
// =========================
// FILTRE STATS DE VISITES
// =========================
function switchVehicleTab(tab) {
    const listLocation = document.getElementById('listLocation');
    const listVente = document.getElementById('listVente');
    if (!listLocation || !listVente) return;

    if (tab === 'location') {
        listLocation.classList.remove('hidden');
        listVente.classList.add('hidden');
    } else {
        listVente.classList.remove('hidden');
        listLocation.classList.add('hidden');
    }
}

function applyStatsFilter() {
    // Récupérer la période active
    const activeBtn = document.querySelector('#sectionStats .flex.gap-2 button.bg-orange-500');
    const days = activeBtn ? parseInt(activeBtn.getAttribute('onclick').match(/\d+/)?.[0]) || 30 : 30;
    loadVisitStats(days);
}

function filterVisitStats(filter) {
    // Mettre à jour l'état actif des cartes
    document.querySelectorAll('.visit-stat-card').forEach(card => {
        card.classList.remove('ring-white');
        card.style.opacity = card.dataset.filter === filter ? '1' : '0.6';
        if (card.dataset.filter === filter) {
            card.classList.add('ring-white');
        }
    });

    const chartSection = document.getElementById('visitChartSection');
    const vehiclesSection = document.getElementById('visitVehiclesSection');
    const pagesSection = document.getElementById('visitPagesSection');
    const convSection = document.getElementById('visitConvSection');

    if (filter === 'all') {
        if (chartSection) chartSection.style.display = '';
        if (vehiclesSection) vehiclesSection.style.display = '';
        if (pagesSection) pagesSection.style.display = '';
        if (convSection) convSection.style.display = '';
    } else if (filter === 'today') {
        if (chartSection) chartSection.style.display = 'none';
        if (vehiclesSection) vehiclesSection.style.display = '';
        if (pagesSection) pagesSection.style.display = '';
        if (convSection) convSection.style.display = 'none';
        loadVisitStats(1);
    } else if (filter === 'week') {
        if (chartSection) chartSection.style.display = '';
        if (vehiclesSection) vehiclesSection.style.display = '';
        if (pagesSection) pagesSection.style.display = '';
        if (convSection) convSection.style.display = 'none';
        loadVisitStats(7);
    } else if (filter === 'conversions') {
        if (chartSection) chartSection.style.display = 'none';
        if (vehiclesSection) vehiclesSection.style.display = 'none';
        if (pagesSection) pagesSection.style.display = 'none';
        if (convSection) {
            convSection.style.display = '';
            convSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }
}


// =========================
// VUE D'ENSEMBLE (OVERVIEW)
// =========================
async function loadOverview() {
    const container = document.getElementById('overviewContent');
    if (!container) return;
    container.innerHTML = '<div class="flex flex-col items-center justify-center py-24 gap-4"><div class="w-16 h-16 rounded-full bg-orange-100 flex items-center justify-center"><i class="fas fa-spinner fa-spin text-3xl text-orange-500"></i></div><p class="text-gray-400 font-medium">Chargement...</p></div>';
    try {
        const res = await authFetch(API_URL + '/overview');
        const json = await res.json();
        const d = json.data;
        const growthIcon = d.revenue_growth >= 0 ? 'fa-arrow-up' : 'fa-arrow-down';
        const growthBg = d.revenue_growth >= 0 ? 'bg-white/20 text-white' : 'bg-red-400/30 text-red-100';
        const alertCount = d.pending + d.out_of_stock + d.lowStock.length;

        // Graphique
        const maxRev = Math.max(...d.revenueByDay.map(function(x){ return Number(x.revenue); }), 1);
        let revBars = '';
        if (d.revenueByDay.length) {
            d.revenueByDay.forEach(function(x) {
                const pct = Math.max(Math.round((Number(x.revenue) / maxRev) * 100), 4);
                const lbl = new Date(x.date).toLocaleDateString('fr-FR', {day:'2-digit', month:'short'});
                const val = Number(x.revenue).toLocaleString('fr-FR');
                revBars += '<div class="flex flex-col items-center flex-1 group cursor-default">'
                    + '<div class="relative w-full flex flex-col justify-end" style="height:80px">'
                    + '<div class="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition whitespace-nowrap z-10">' + val + ' FCFA</div>'
                    + '<div class="w-full rounded-t-lg bg-gradient-to-t from-orange-600 to-orange-400 group-hover:from-orange-500 group-hover:to-yellow-400 transition-all" style="height:' + pct + '%"></div>'
                    + '</div><span class="text-xs text-gray-400 mt-2">' + lbl + '</span></div>';
            });
        } else { revBars = '<p class="text-gray-400 text-sm m-auto">Aucune donnée</p>'; }

        // Status badge
        function badge(s) {
            if (s === 'pending') return '<span class="px-2 py-0.5 rounded-full text-xs bg-amber-100 text-amber-700 font-bold border border-amber-200">En attente</span>';
            if (s === 'confirmed') return '<span class="px-2 py-0.5 rounded-full text-xs bg-emerald-100 text-emerald-700 font-bold border border-emerald-200">Confirmée</span>';
            if (s === 'completed') return '<span class="px-2 py-0.5 rounded-full text-xs bg-blue-100 text-blue-700 font-bold border border-blue-200">Terminée</span>';
            if (s === 'cancelled') return '<span class="px-2 py-0.5 rounded-full text-xs bg-red-100 text-red-700 font-bold border border-red-200">Annulée</span>';
            return '<span class="px-2 py-0.5 rounded-full text-xs bg-gray-100 text-gray-600">' + s + '</span>';
        }

        let html = '<style>.kpi-card{transition:transform .2s cubic-bezier(.34,1.56,.64,1),box-shadow .2s}.kpi-card:hover{transform:translateY(-6px) scale(1.02)}.ov-row{animation:ovFadeUp .4s ease both}@keyframes ovFadeUp{from{opacity:0;transform:translateY(18px)}to{opacity:1;transform:translateY(0)}}</style>';

        // KPI CARDS
        html += '<div class="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-6 ov-row">';
        html += '<div class="kpi-card relative overflow-hidden bg-gradient-to-br from-blue-500 to-blue-700 rounded-2xl p-5 text-white shadow-xl cursor-pointer" onclick="showSection(\'reservations\')">'
            + '<div class="absolute -right-5 -top-5 w-24 h-24 bg-white/10 rounded-full"></div>'
            + '<div class="relative z-10"><div class="flex items-center justify-between mb-4">'
            + '<div class="bg-white/20 w-11 h-11 rounded-xl flex items-center justify-center"><i class="fas fa-calendar-day text-xl"></i></div>'
            + '<span class="text-blue-200 text-xs bg-white/15 px-2 py-1 rounded-lg">Aujourd\'hui</span></div>'
            + '<p class="text-4xl font-black mb-1">' + d.today_reservations + '</p><p class="text-blue-200 text-sm">Réservations</p></div></div>';
        html += '<div class="kpi-card relative overflow-hidden bg-gradient-to-br from-violet-500 to-purple-700 rounded-2xl p-5 text-white shadow-xl cursor-pointer" onclick="showSection(\'reservations\')">'
            + '<div class="absolute -right-5 -top-5 w-24 h-24 bg-white/10 rounded-full"></div>'
            + '<div class="relative z-10"><div class="flex items-center justify-between mb-4">'
            + '<div class="bg-white/20 w-11 h-11 rounded-xl flex items-center justify-center"><i class="fas fa-calendar-week text-xl"></i></div>'
            + (d.pending > 0 ? '<span class="text-xs font-black bg-yellow-400 text-yellow-900 px-2 py-1 rounded-lg animate-pulse">' + d.pending + ' en attente</span>' : '<span class="text-purple-200 text-xs bg-white/15 px-2 py-1 rounded-lg">Cette semaine</span>')
            + '</div><p class="text-4xl font-black mb-1">' + d.week_reservations + '</p><p class="text-purple-200 text-sm">Réservations</p></div></div>';
        html += '<div class="kpi-card relative overflow-hidden bg-gradient-to-br from-emerald-500 to-green-700 rounded-2xl p-5 text-white shadow-xl">'
            + '<div class="absolute -right-5 -top-5 w-24 h-24 bg-white/10 rounded-full"></div>'
            + '<div class="relative z-10"><div class="flex items-center justify-between mb-4">'
            + '<div class="bg-white/20 w-11 h-11 rounded-xl flex items-center justify-center"><i class="fas fa-coins text-xl"></i></div>'
            + '<span class="text-xs font-bold ' + growthBg + ' px-2 py-1 rounded-lg"><i class="fas ' + growthIcon + ' mr-1"></i>' + Math.abs(d.revenue_growth) + '%</span>'
            + '</div><p class="text-2xl font-black mb-1">' + Number(d.month_revenue).toLocaleString('fr-FR') + '</p><p class="text-green-100 text-sm">Revenu ce mois (FCFA)</p></div></div>';
        html += '<div class="kpi-card relative overflow-hidden bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl p-5 text-white shadow-xl cursor-pointer" onclick="showSection(\'stats\')">'
            + '<div class="absolute -right-5 -top-5 w-24 h-24 bg-white/10 rounded-full"></div>'
            + '<div class="relative z-10"><div class="flex items-center justify-between mb-4">'
            + '<div class="bg-white/20 w-11 h-11 rounded-xl flex items-center justify-center"><i class="fas fa-eye text-xl"></i></div>'
            + '<span class="text-orange-100 text-xs bg-white/15 px-2 py-1 rounded-lg">Aujourd\'hui</span>'
            + '</div><p class="text-4xl font-black mb-1">' + d.visits_today + '</p><p class="text-orange-100 text-sm">Visites site</p></div></div>';

        // Card véhicules vendus (si > 0)
        if (d.sold_count > 0) {
            html += '<div class="kpi-card relative overflow-hidden bg-gradient-to-br from-red-600 to-red-800 rounded-2xl p-5 text-white shadow-xl cursor-pointer" onclick="showSection(\'vehicles\')">'
                + '<div class="absolute -right-5 -top-5 w-24 h-24 bg-white/10 rounded-full"></div>'
                + '<div class="relative z-10"><div class="flex items-center justify-between mb-4">'
                + '<div class="bg-white/20 w-11 h-11 rounded-xl flex items-center justify-center"><i class="fas fa-times-circle text-xl"></i></div>'
                + '<span class="text-red-200 text-xs bg-white/15 px-2 py-1 rounded-lg">Vente</span>'
                + '</div><p class="text-4xl font-black mb-1">' + d.sold_count + '</p><p class="text-red-100 text-sm">Véhicule(s) vendu(s)</p></div></div>';
        }
        html += '</div>';

        // GRAPHIQUE + ALERTES
        html += '<div class="grid lg:grid-cols-3 gap-5 mb-5 ov-row" style="animation-delay:.1s">';
        html += '<div class="lg:col-span-2 bg-white rounded-2xl p-6 shadow-sm border border-gray-100">'
            + '<div class="flex items-center justify-between mb-6"><div><h3 class="font-black text-gray-800 text-lg">Revenu confirmé</h3><p class="text-gray-400 text-sm mt-0.5">7 derniers jours</p></div>'
            + '<span class="bg-orange-50 text-orange-600 text-xs font-bold px-3 py-1.5 rounded-xl border border-orange-100">FCFA</span></div>'
            + '<div class="flex items-end gap-3 px-2" style="height:100px">' + revBars + '</div></div>';

        let alertsHtml = '';
        if (d.pending > 0) alertsHtml += '<div onclick="showSection(\'reservations\')" class="cursor-pointer flex items-center gap-3 p-3 bg-amber-50 rounded-xl hover:bg-amber-100 transition border border-amber-100 mb-2"><div class="bg-amber-100 w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"><i class="fas fa-clock text-amber-500"></i></div><div><p class="text-sm font-bold text-amber-800">' + d.pending + ' en attente</p><p class="text-xs text-amber-500">Traiter maintenant</p></div></div>';
        if (d.out_of_stock > 0) alertsHtml += '<div onclick="showSection(\'vehicles\')" class="cursor-pointer flex items-center gap-3 p-3 bg-red-50 rounded-xl hover:bg-red-100 transition border border-red-100 mb-2"><div class="bg-red-100 w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"><i class="fas fa-ban text-red-500"></i></div><div><p class="text-sm font-bold text-red-700">' + d.out_of_stock + ' épuisé(s)</p><p class="text-xs text-red-400">Stock à 0</p></div></div>';
        d.lowStock.forEach(function(v) { alertsHtml += '<div class="flex items-center gap-3 p-3 bg-orange-50 rounded-xl border border-orange-100 mb-2"><div class="bg-orange-100 w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"><i class="fas fa-exclamation-triangle text-orange-500"></i></div><div class="min-w-0"><p class="text-sm font-bold text-orange-700 truncate">' + v.name + '</p><p class="text-xs text-orange-400">' + v.stock + ' restant(s)</p></div></div>'; });
        if (alertCount === 0) alertsHtml = '<div class="flex items-center gap-3 p-3 bg-emerald-50 rounded-xl border border-emerald-100"><div class="bg-emerald-100 w-9 h-9 rounded-xl flex items-center justify-center"><i class="fas fa-check-circle text-emerald-500"></i></div><p class="text-sm font-bold text-emerald-700">Tout est en ordre</p></div>';

        html += '<div class="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">'
            + '<div class="flex items-center gap-3 mb-5"><div class="bg-red-50 w-9 h-9 rounded-xl flex items-center justify-center"><i class="fas fa-bell text-red-500"></i></div><h3 class="font-black text-gray-800">Alertes</h3>'
            + (alertCount > 0 ? '<span class="ml-auto bg-red-500 text-white text-xs font-black w-6 h-6 rounded-full flex items-center justify-center">' + alertCount + '</span>' : '')
            + '</div><div class="space-y-1 max-h-52 overflow-y-auto">' + alertsHtml + '</div></div>';
        html += '</div>';

        // RÉSERVATIONS + SIDEBAR
        html += '<div class="grid lg:grid-cols-3 gap-5 ov-row" style="animation-delay:.2s">';
        let rowsHtml = '';
        if (d.latest.length) {
            d.latest.forEach(function(r) {
                const init = r.client_name.charAt(0).toUpperCase();
                const dt = new Date(r.created_at).toLocaleDateString('fr-FR', {day:'2-digit',month:'short',hour:'2-digit',minute:'2-digit'});
                rowsHtml += '<div class="flex items-center justify-between px-6 py-4 hover:bg-gray-50 transition cursor-pointer" onclick="showSection(\'reservations\')">'
                    + '<div class="flex items-center gap-4"><div class="bg-gradient-to-br from-orange-400 to-orange-600 w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 shadow-md"><span class="text-white font-black text-base">' + init + '</span></div>'
                    + '<div><p class="font-bold text-gray-800">' + r.client_name + '</p><p class="text-xs text-gray-400 mt-0.5"><i class="fas fa-car mr-1 text-orange-400"></i>' + r.vehicle_name + ' · ' + dt + '</p></div></div>'
                    + '<div class="text-right flex-shrink-0">' + badge(r.status) + '<p class="text-xs font-bold text-gray-700 mt-1">' + Number(r.total_price).toLocaleString('fr-FR') + ' <span class="text-gray-400 font-normal">FCFA</span></p></div></div>';
            });
        } else { rowsHtml = '<div class="px-6 py-10 text-center text-gray-400"><i class="fas fa-inbox text-3xl mb-2"></i><p class="text-sm">Aucune réservation</p></div>'; }

        html += '<div class="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">'
            + '<div class="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gray-50"><div class="flex items-center gap-3"><div class="bg-orange-100 w-9 h-9 rounded-xl flex items-center justify-center"><i class="fas fa-list text-orange-500"></i></div><h3 class="font-black text-gray-800">Dernières réservations</h3></div>'
            + '<button onclick="showSection(\'reservations\')" class="text-xs text-orange-500 font-bold bg-orange-50 hover:bg-orange-100 px-3 py-1.5 rounded-xl transition border border-orange-100">Voir tout</button></div>'
            + '<div class="divide-y divide-gray-50">' + rowsHtml + '</div></div>';

        let sideHtml = '';
        if (d.topVehicle) {
            sideHtml += '<div class="relative overflow-hidden bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-2xl p-6 text-white shadow-xl">'
                + '<div class="absolute -right-8 -top-8 w-32 h-32 bg-orange-500/15 rounded-full"></div>'
                + '<div class="relative z-10"><div class="flex items-center gap-2 mb-4"><div class="bg-yellow-400/20 w-9 h-9 rounded-xl flex items-center justify-center"><i class="fas fa-trophy text-yellow-400"></i></div><p class="text-gray-300 text-xs font-bold uppercase tracking-widest">Top véhicule</p></div>'
                + '<p class="text-xl font-black leading-snug mb-3">' + d.topVehicle.name + '</p>'
                + '<span class="bg-orange-500/25 text-orange-300 text-xs font-bold px-3 py-1.5 rounded-xl border border-orange-500/20">' + d.topVehicle.count + ' réservation(s) ce mois</span></div></div>';
        }
        sideHtml += '<div class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">'
            + '<div class="px-5 py-4 border-b border-gray-100 bg-gray-50 flex items-center gap-3"><div class="bg-orange-100 w-9 h-9 rounded-xl flex items-center justify-center"><i class="fas fa-bolt text-orange-500"></i></div><h3 class="font-black text-gray-800">Actions rapides</h3></div>'
            + '<div class="p-3 space-y-1">'
            + '<button onclick="showSection(\'reservations\')" class="w-full text-left flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-blue-50 transition group"><div class="bg-blue-100 w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"><i class="fas fa-calendar-check text-blue-600 text-sm"></i></div><span class="text-sm font-semibold text-gray-700 group-hover:text-blue-600">Gérer les réservations</span><i class="fas fa-chevron-right text-gray-300 text-xs ml-auto"></i></button>'
            + '<button onclick="showSection(\'vehicles\'); setTimeout(openVehicleModal, 300)" class="w-full text-left flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-green-50 transition group"><div class="bg-green-100 w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"><i class="fas fa-plus text-green-600 text-sm"></i></div><span class="text-sm font-semibold text-gray-700 group-hover:text-green-600">Ajouter un véhicule</span><i class="fas fa-chevron-right text-gray-300 text-xs ml-auto"></i></button>'
            + '<button onclick="showSection(\'stats\')" class="w-full text-left flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-purple-50 transition group"><div class="bg-purple-100 w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"><i class="fas fa-chart-line text-purple-600 text-sm"></i></div><span class="text-sm font-semibold text-gray-700 group-hover:text-purple-600">Statistiques</span><i class="fas fa-chevron-right text-gray-300 text-xs ml-auto"></i></button>'
            + '</div></div>';

        html += '<div class="space-y-4">' + sideHtml + '</div>';
        html += '</div>';

        container.innerHTML = html;
    } catch(e) {
        container.innerHTML = '<div class="flex flex-col items-center justify-center py-24 gap-4"><div class="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center"><i class="fas fa-exclamation-triangle text-3xl text-red-500"></i></div><p class="text-red-500 font-bold">' + e.message + '</p></div>';
    }
}

// =========================
// STATUT VENDU
// =========================
async function toggleSoldStatus(id, currentStatus) {
    const newStatus = currentStatus ? 0 : 1;
    const label = newStatus ? 'vendu' : 'disponible';
    if (!confirm(`Marquer ce véhicule comme ${label} ?`)) return;
    try {
        const res = await authFetch(`${API_URL}/vehicles/${id}/sold`, {
            method: 'PATCH',
            body: JSON.stringify({ is_sold: newStatus })
        });
        const data = await res.json();
        if (data.success) {
            loadVehicles();
        } else {
            alert('Erreur : ' + data.message);
        }
    } catch(e) {
        alert('Erreur réseau');
    }
}


// =========================
// GESTION DES CODES PROMO
// =========================

async function loadPromoCodes() {
    const tbody = document.getElementById('promoCodesTable');
    if (!tbody) return;
    tbody.innerHTML = '<tr><td colspan="6" class="px-4 py-8 text-center text-gray-400"><i class="fas fa-spinner fa-spin text-2xl"></i></td></tr>';
    try {
        const res = await authFetch(`${API_URL}/promo-codes`);
        const data = await res.json();
        if (!data.success || !data.data.length) {
            tbody.innerHTML = '<tr><td colspan="6" class="px-4 py-8 text-center text-gray-400">Aucun code promo</td></tr>';
            return;
        }
        tbody.innerHTML = data.data.map(p => {
            const isExpired = p.expires_at && new Date(p.expires_at) < new Date();
            const statusBadge = p.is_used
                ? '<span class="px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-500 font-semibold">Utilisé</span>'
                : isExpired
                ? '<span class="px-2 py-1 rounded-full text-xs bg-red-100 text-red-600 font-semibold">Expiré</span>'
                : '<span class="px-2 py-1 rounded-full text-xs bg-green-100 text-green-700 font-semibold">Actif</span>';
            const expiry = p.expires_at ? new Date(p.expires_at).toLocaleDateString('fr-FR') : '—';
            return `<tr class="hover:bg-gray-50">
                <td class="px-4 py-3 font-mono font-bold text-orange-600">${p.code}</td>
                <td class="px-4 py-3 text-sm">
                    <a href="https://wa.me/${p.client_whatsapp}" target="_blank" class="text-green-600 hover:underline flex items-center gap-1">
                        <i class="fab fa-whatsapp"></i>${p.client_whatsapp}
                    </a>
                </td>
                <td class="px-4 py-3 text-sm font-bold text-orange-500">${p.discount_percentage}%</td>
                <td class="px-4 py-3 text-sm text-gray-500">${expiry}</td>
                <td class="px-4 py-3">${statusBadge}</td>
                <td class="px-4 py-3">
                    <div class="flex gap-2">
                        <button onclick="copyPromoCode('${p.code}')" class="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-lg text-xs font-semibold transition" title="Copier">
                            <i class="fas fa-copy"></i>
                        </button>
                        <button onclick="editPromoCode(${p.id}, '${p.client_whatsapp}', ${p.discount_percentage}, '${p.expires_at || ''}')" class="px-3 py-1 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg text-xs font-semibold transition">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button onclick="deletePromoCode(${p.id}, '${p.code}')" class="px-3 py-1 bg-red-100 hover:bg-red-200 text-red-600 rounded-lg text-xs font-semibold transition">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </td>
            </tr>`;
        }).join('');
    } catch(e) {
        tbody.innerHTML = `<tr><td colspan="6" class="px-4 py-8 text-center text-red-500">Erreur: ${e.message}</td></tr>`;
    }
}

function openPromoModal() {
    document.getElementById('promoModalTitle').textContent = 'Nouveau code promo';
    document.getElementById('promoId').value = '';
    document.getElementById('promoForm').reset();
    document.getElementById('promoDiscount').value = 10;
    document.getElementById('promoModal').style.display = 'flex';
    document.getElementById('promoModal').classList.remove('hidden');
}

function closePromoModal() {
    document.getElementById('promoModal').style.display = 'none';
    document.getElementById('promoModal').classList.add('hidden');
}

function editPromoCode(id, whatsapp, discount, expiry) {
    document.getElementById('promoModalTitle').textContent = 'Modifier le code promo';
    document.getElementById('promoId').value = id;
    document.getElementById('promoWhatsapp').value = whatsapp;
    document.getElementById('promoDiscount').value = discount;
    document.getElementById('promoExpiry').value = expiry ? expiry.split('T')[0] : '';
    document.getElementById('promoCustomCode').value = '';
    document.getElementById('promoModal').style.display = 'flex';
    document.getElementById('promoModal').classList.remove('hidden');
}

async function submitPromoForm(e) {
    e.preventDefault();
    const id = document.getElementById('promoId').value;
    const body = {
        client_whatsapp: document.getElementById('promoWhatsapp').value,
        discount_percentage: parseInt(document.getElementById('promoDiscount').value),
        expires_at: document.getElementById('promoExpiry').value || null,
        custom_code: document.getElementById('promoCustomCode').value || null
    };
    try {
        const url = id ? `${API_URL}/promo-codes/${id}` : `${API_URL}/promo-codes`;
        const method = id ? 'PUT' : 'POST';
        const res = await authFetch(url, { method, body: JSON.stringify(body) });
        const data = await res.json();
        if (data.success) {
            closePromoModal();
            loadPromoCodes();
            alert(id ? 'Code promo mis à jour' : `Code créé : ${data.data?.code || ''}`);
        } else {
            alert('Erreur : ' + data.message);
        }
    } catch(e) {
        alert('Erreur réseau');
    }
}

async function deletePromoCode(id, code) {
    if (!confirm(`Supprimer le code "${code}" ?`)) return;
    try {
        const res = await authFetch(`${API_URL}/promo-codes/${id}`, { method: 'DELETE' });
        const data = await res.json();
        if (data.success) { loadPromoCodes(); }
        else { alert('Erreur : ' + data.message); }
    } catch(e) { alert('Erreur réseau'); }
}

function copyPromoCode(code) {
    navigator.clipboard.writeText(code).then(() => alert(`Code "${code}" copié !`));
}
