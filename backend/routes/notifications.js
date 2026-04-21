const express = require('express');
const router = express.Router();

// Liste des admins connectés via SSE
const clients = new Set();

// Diffuser une notification à tous les admins connectés
function broadcastNotification(data) {
    const payload = `data: ${JSON.stringify(data)}\n\n`;
    clients.forEach(client => {
        try { client.write(payload); } catch (e) { clients.delete(client); }
    });
    console.log(`[NOTIF] Envoyée à ${clients.size} admin(s):`, data.title);
}

// GET /api/notifications/subscribe — l'admin s'abonne ici (SSE)
router.get('/subscribe', (req, res) => {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.flushHeaders();

    // Confirmation de connexion
    res.write(`data: ${JSON.stringify({ type: 'connected', message: 'Notifications actives' })}\n\n`);
    clients.add(res);
    console.log(`[NOTIF] Admin connecté. Total: ${clients.size}`);

    // Ping toutes les 25s pour garder la connexion vivante
    const keepAlive = setInterval(() => {
        try { res.write(': ping\n\n'); } catch (e) { clearInterval(keepAlive); }
    }, 25000);

    req.on('close', () => {
        clients.delete(res);
        clearInterval(keepAlive);
        console.log(`[NOTIF] Admin déconnecté. Total: ${clients.size}`);
    });
});

module.exports = { router, broadcastNotification };
