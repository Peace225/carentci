import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API_BASE_URL from "../../api/config";

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // Si déjà connecté, on redirige direct au dashboard
  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (token) {
      navigate('/admin', { replace: true });
    }
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email.trim(),
          password
        })
      });

      const data = await response.json();
      console.log("Réponse authentification :", data);

      if (response.ok && data.success) {
        const token = data.token;
        const user = data.user;

        if (token) {
          localStorage.setItem('adminToken', token);
          localStorage.setItem('adminUser', JSON.stringify(user)); // On stocke aussi le user
          navigate('/admin', { replace: true });
        } else {
          setError("Le serveur n'a pas renvoyé de jeton de sécurité.");
        }
      } else {
        setError(data.message || 'Identifiants incorrects');
      }
    } catch (err) {
      console.error(err);
      setError('Impossible de joindre le serveur. Vérifiez votre connexion.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center p-4 font-sans">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w- h- bg-orange-600/10 blur- rounded-full pointer-events-none"></div>

      <div className="bg-[#0a0a0a] border border-white/5 rounded- p-10 max-w-md w-full relative z-10 shadow-2xl backdrop-blur-xl">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-black text-white tracking-tighter uppercase italic">
            CONSOLE <span className="text-orange-500">SYSTEM</span>
          </h1>
          <p className="text-gray-500 text- mt-2 uppercase tracking-[0.3em] font-bold">
            Authentification Ultra-Premium
          </p>
        </div>

        {error && (
          <div className="bg-red-500/5 border border-red-500/20 text-red-500 text- font-bold uppercase tracking-wider p-4 rounded-xl text-center mb-8 animate-shake">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2">
            <label className="block text- font-black text-gray-500 uppercase tracking-widest ml-1">Identifiant Admin</label>
            <input
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-white/[0.02] border border-white/5 rounded-2xl p-5 text-white focus:border-orange-500/50 focus:bg-white/[0.04] focus:outline-none transition-all duration-300 placeholder:text-gray-800"
              placeholder="contact@carent.ci"
            />
          </div>

          <div className="space-y-2">
            <label className="block text- font-black text-gray-500 uppercase tracking-widest ml-1">Clé d'accès</label>
            <div className="relative">
              <input
                type={showPassword? "text" : "password"}
                required
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-white/[0.02] border border-white/5 rounded-2xl p-5 pr-14 text-white focus:border-orange-500/50 focus:bg-white/[0.04] focus:outline-none transition-all duration-300 placeholder:text-gray-800"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-orange-500 transition-colors p-1"
                aria-label={showPassword? "Cacher le mot de passe" : "Afficher le mot de passe"}
              >
                {showPassword? (
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29m7.532 7.532l3.29 3.29M3 3l18 18" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full mt-4 bg-orange-500 hover:bg-white text-black py-5 rounded-2xl font-black uppercase text- tracking-[0.2em] transition-all duration-500 shadow-xl disabled:opacity-30 disabled:cursor-not-allowed group"
          >
            {isLoading? (
              <span className="flex items-center justify-center gap-2">
                <span className="w-4 h-4 border-2 border-black/20 border-t-black rounded-full animate-spin"></span>
                Synchronisation...
              </span>
            ) : 'Déverrouiller le système'}
          </button>
        </form>

        <p className="text-center mt-10 text- text-gray-700 font-bold uppercase tracking-[0.4em]">
          CarRent CI • Sécurité Chiffrée
        </p>
      </div>
    </div>
  );
}