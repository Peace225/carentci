const express = require('express');
const router = express.Router();
const db = require('../config/database');

// GET /v/:id — page de partage avec meta OG dynamiques
router.get('/:id', async (req, res) => {
    const { id } = req.params;
    const siteUrl = 'https://www.carentci.com';
    const defaultImage = 'https://res.cloudinary.com/dev2r1wlo/image/upload/v1774859972/carentci/static/logo.png';

    try {
        const [rows] = await db.query('SELECT * FROM vehicles WHERE id = ? AND is_active = 1', [id]);
        const v = rows[0];

        if (!v) {
            return res.redirect(`${siteUrl}/vehicle-details.html?id=${id}`);
        }

        const title = v.name + ' - CarRent CI';
        // S'assurer que l'image est une URL absolue et accessible publiquement
        let image = defaultImage;
        if (v.image_url) {
            if (v.image_url.startsWith('http')) {
                image = v.image_url;
            } else if (v.image_url.startsWith('/uploads')) {
                // Les images locales ne sont pas accessibles — utiliser le logo par défaut
                image = defaultImage;
            } else {
                image = 'https://www.carentci.com' + v.image_url;
            }
        }
        // Essayer aussi images[] si image principale non Cloudinary
        if (image === defaultImage && v.images) {
            try {
                const imgs = typeof v.images === 'string' ? JSON.parse(v.images) : v.images;
                const cloudinaryImg = Array.isArray(imgs) && imgs.find(u => u && u.startsWith('http'));
                if (cloudinaryImg) image = cloudinaryImg;
            } catch(e) {}
        }
        const pageUrl = `${siteUrl}/vehicle-details.html?id=${id}`;

        // Description selon le type
        let desc = '';
        if (v.type === 'vente') {
            const price = v.sale_price ? Number(v.sale_price).toLocaleString('fr-FR') + ' FCFA' : '';
            desc = v.name + (price ? ' — ' + price : '') + ' | À vendre sur CarRent CI';
        } else {
            const price = v.price_without_driver ? Number(v.price_without_driver).toLocaleString('fr-FR') + ' FCFA/jour' : '';
            desc = v.name + (price ? ' — À partir de ' + price : '') + ' | Location sur CarRent CI';
        }
        if (v.description) {
            desc = v.description.substring(0, 120).replace(/\n/g, ' ') + (v.description.length > 120 ? '...' : '');
        }

        // Page HTML minimaliste avec meta OG + redirect immédiate
        res.send(`<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${title}</title>
<meta property="og:title" content="${title}">
<meta property="og:description" content="${desc}">
<meta property="og:image" content="${image}">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:url" content="${siteUrl}/v/${id}">
<meta property="og:type" content="website">
<meta property="og:site_name" content="CarRent CI">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${title}">
<meta name="twitter:description" content="${desc}">
<meta name="twitter:image" content="${image}">
<meta http-equiv="refresh" content="0;url=${pageUrl}">
<link rel="canonical" href="${pageUrl}">
</head>
<body>
<script>window.location.replace('${pageUrl}');</script>
<p>Redirection en cours... <a href="${pageUrl}">Cliquer ici</a></p>
</body>
</html>`);
    } catch (e) {
        res.redirect(`${siteUrl}/vehicle-details.html?id=${id}`);
    }
});

module.exports = router;
