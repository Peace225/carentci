import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // NETTOYAGE AU MONTAGE : On s'assure qu'aucun vieux badge ne traîne
  useEffect(() => {
    localStorage.removeItem('adminToken');
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();
      
      // LOG DE DÉBOGAGE : Pour voir exactement ce que ton serveur renvoie
      console.log("Réponse authentification :", data);

      if (response.ok && data.success) {
        // RÉCUPÉRATION SÉCURISÉE DU TOKEN
        // On vérifie les deux formats courants : data.token OU data.data.token
        const token = data.token || (data.data && data.data.token);

        if (token) {
          localStorage.setItem('adminToken', token);
          // Redirection vers le Dashboard avec un état propre
          navigate('/admin', { replace: true });
        } else {
          setError("Le serveur n'a pas renvoyé de jeton de sécurité.");
        }
      } else {
        setError(data.message || 'Identifiants incorrects');
      }
    } catch (err) {
      setError('Impossible de joindre le serveur (Vérifiez le port 5000)');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center p-4 font-sans">
      {/* Halo lumineux dynamique */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-orange-600/10 blur-[120px] rounded-full pointer-events-none"></div>

      <div className="bg-[#0a0a0a] border border-white/5 rounded-[2rem] p-10 max-w-md w-full relative z-10 shadow-2xl backdrop-blur-xl">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-black text-white tracking-tighter uppercase italic">
            CONSOLE <span className="text-orange-500">SYSTEM</span>
          </h1>
          <p className="text-gray-500 text-[10px] mt-2 uppercase tracking-[0.3em] font-bold">
            Authentification Ultra-Premium
          </p>
        </div>

        {error && (
          <div className="bg-red-500/5 border border-red-500/20 text-red-500 text-[11px] font-bold uppercase tracking-wider p-4 rounded-xl text-center mb-8 animate-shake">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2">
            <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Identifiant Admin</label>
            <input 
              type="email" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-white/[0.02] border border-white/5 rounded-2xl p-5 text-white focus:border-orange-500/50 focus:bg-white/[0.04] focus:outline-none transition-all duration-300 placeholder:text-gray-800"
              placeholder="admin@carrent.ci"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Clé d'accès</label>
            <input 
              type="password" 
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-white/[0.02] border border-white/5 rounded-2xl p-5 text-white focus:border-orange-500/50 focus:bg-white/[0.04] focus:outline-none transition-all duration-300 placeholder:text-gray-800"
              placeholder="••••••••"
            />
          </div>

          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full mt-4 bg-orange-500 hover:bg-white text-black py-5 rounded-2xl font-black uppercase text-[11px] tracking-[0.2em] transition-all duration-500 shadow-xl disabled:opacity-30 disabled:cursor-not-allowed group"
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="w-4 h-4 border-2 border-black/20 border-t-black rounded-full animate-spin italic"></span>
                Synchronisation...
              </span>
            ) : 'Déverrouiller le système'}
          </button>
        </form>

        <p className="text-center mt-10 text-[9px] text-gray-700 font-bold uppercase tracking-[0.4em]">
          CarRent CI • Sécurité Chiffrée
        </p>
      </div>
    </div>
  );
}