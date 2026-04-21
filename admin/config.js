const API_BASE_URL = (
    window.location.hostname === 'localhost' ||
    window.location.hostname === '127.0.0.1' ||
    window.location.protocol === 'file:'
) ? 'http://localhost:5000'
  : 'https://www.carentci.com';

window.API_BASE_URL = API_BASE_URL;

const FRONTEND_URL = (
    window.location.hostname === 'localhost' ||
    window.location.hostname === '127.0.0.1' ||
    window.location.protocol === 'file:'
) ? 'http://localhost:5173'
  : 'https://www.carentci.com';

window.FRONTEND_URL = FRONTEND_URL;
