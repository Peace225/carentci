// Service Worker pour notifications admin CarRent CI
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', e => e.waitUntil(self.clients.claim()));

// Recevoir un message du script admin pour afficher une notification
self.addEventListener('message', event => {
    if (event.data && event.data.type === 'SHOW_NOTIFICATION') {
        const { title, body, reservationId } = event.data;
        self.registration.showNotification(title, {
            body: body,
            icon: '/favicon.ico',
            badge: '/favicon.ico',
            tag: `reservation-${reservationId}`,
            requireInteraction: true,
            data: { reservationId }
        });
    }
});

// Clic sur la notification → ouvrir l'admin
self.addEventListener('notificationclick', event => {
    event.notification.close();
    event.waitUntil(
        clients.matchAll({ type: 'window', includeUncontrolled: true }).then(windowClients => {
            for (const client of windowClients) {
                if (client.url.includes('admin.html')) {
                    return client.focus();
                }
            }
            return clients.openWindow('/admin.html');
        })
    );
});
