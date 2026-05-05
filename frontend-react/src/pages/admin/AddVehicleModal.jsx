import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import API_BASE_URL from '../../api/config';

export default function AddVehicleModal({ isOpen, onClose }) {
  const queryClient = useQueryClient();
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState([]); 
  const [previews, setPreviews] = useState([]); 

  const [formData, setFormData] = useState({
    type: 'location', // location ou vente
    marque: '',
    modele: '',
    categorie: 'suv', // Correspond aux filtres du showroom
    annee: new Date().getFullYear(),
    transmission: 'Automatique',
    carburant: 'Essence',
    kilometrage: 0,
    prix: '',
    stock: 1,
    description: ''
  });

  if (!isOpen) return null;

  // Gestion des images (Max 5)
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (images.length + files.length > 5) {
      alert("Limite atteinte : 5 images maximum par véhicule.");
      return;
    }
    setImages([...images, ...files]);
    setPreviews([...previews, ...files.map(f => URL.createObjectURL(f))]);
  };

  const removeImage = (index) => {
    setImages(images.filter((_, i) => i !== index));
    setPreviews(previews.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (images.length === 0) return alert("Veuillez ajouter au moins une photo.");
    
    setLoading(true);
    const data = new FormData();
    Object.keys(formData).forEach(key => data.append(key, formData[key]));
    images.forEach(file => data.append('images', file));

    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`${API_BASE_URL}/api/vehicles`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: data 
      });

      if (response.ok) {
        queryClient.invalidateQueries(['rental']);
        queryClient.invalidateQueries(['sale']);
        setImages([]); setPreviews([]);
        onClose();
      }
    } catch (error) {
      console.error("Erreur d'upload :", error);
    } finally {
      setLoading(false);
    }
  };

  // Liste des années pour le select (de l'année actuelle jusqu'à il y a 20 ans)
  const currentYear = new Date().getFullYear();
  const years = Array.from(new Array(20), (val, index) => currentYear - index);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/95 backdrop-blur-md">
      <div className="bg-[#0a0a0a] border border-white/10 w-full max-w-5xl max-h-[90vh] overflow-hidden rounded-[2.5rem] flex flex-col shadow-2xl">
        
        {/* HEADER */}
        <div className="p-8 border-b border-white/5 flex justify-between items-center bg-white/[0.02]">
          <div>
            <h2 className="text-2xl font-black uppercase tracking-tighter italic text-white">
              Configuration <span className="text-orange-500">Véhicule</span>
            </h2>
            <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold mt-1">
              Galerie : {images.length} / 5 slots utilisés
            </p>
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-white transition-colors">
            <i className="fas fa-times text-xl"></i>
          </button>
        </div>

        {/* FORMULAIRE */}
        <form onSubmit={handleSubmit} className="overflow-y-auto p-8 space-y-10 custom-scrollbar">
          
          {/* UPLOAD IMAGES (5 MAX) */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {previews.map((src, index) => (
              <div key={index} className="relative group aspect-square rounded-2xl overflow-hidden border border-white/10">
                <img src={src} className="w-full h-full object-cover" alt="Preview" />
                <button type="button" onClick={() => removeImage(index)} className="absolute inset-0 bg-red-600/80 text-white opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <i className="fas fa-trash"></i>
                </button>
              </div>
            ))}
            {images.length < 5 && (
              <label className="aspect-square rounded-2xl border-2 border-dashed border-white/10 hover:border-orange-500/50 flex flex-col items-center justify-center cursor-pointer group">
                <input type="file" multiple accept="image/*" className="hidden" onChange={handleImageChange} />
                <i className="fas fa-camera text-gray-600 group-hover:text-orange-500 mb-2"></i>
                <span className="text-[8px] font-black text-gray-600 uppercase">Ajouter</span>
              </label>
            )}
          </div>

          {/* SÉLECTEUR DE TYPE */}
          <div className="flex p-1 bg-white/5 rounded-2xl border border-white/5 w-full md:w-1/2 mx-auto">
            {['location', 'vente'].map((t) => (
              <button key={t} type="button" onClick={() => setFormData({...formData, type: t})}
                className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${formData.type === t ? 'bg-orange-500 text-black' : 'text-gray-500 hover:text-white'}`}>
                {t}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            
            {/* IDENTITÉ DU VÉHICULE */}
            <div className="space-y-4">
              <h3 className="text-xs font-black text-white uppercase tracking-widest border-b border-white/10 pb-2">Identité</h3>
              <div className="grid grid-cols-2 gap-4">
                <input type="text" placeholder="MARQUE (ex: BMW)" required className="input-premium" onChange={(e) => setFormData({...formData, marque: e.target.value})} />
                <input type="text" placeholder="MODÈLE (ex: X5)" required className="input-premium" onChange={(e) => setFormData({...formData, modele: e.target.value})} />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <select className="select-premium" onChange={(e) => setFormData({...formData, categorie: e.target.value})}>
                  <option value="suv">SUV</option>
                  <option value="berline">Berline</option>
                  <option value="luxe">Luxe</option>
                  <option value="4x4">4x4</option>
                  <option value="pickup">Pick-up</option>
                  <option value="minibus">Minibus</option>
                  <option value="mariage">Mariage</option>
                </select>
                <select className="select-premium" value={formData.annee} onChange={(e) => setFormData({...formData, annee: e.target.value})}>
                  {years.map(year => <option key={year} value={year}>{year}</option>)}
                </select>
              </div>
            </div>

            {/* CARACTÉRISTIQUES TECHNIQUES */}
            <div className="space-y-4">
              <h3 className="text-xs font-black text-white uppercase tracking-widest border-b border-white/10 pb-2">Spécifications</h3>
              <div className="grid grid-cols-2 gap-4">
                <select className="select-premium" value={formData.transmission} onChange={(e) => setFormData({...formData, transmission: e.target.value})}>
                  <option value="Automatique">Boîte Automatique</option>
                  <option value="Manuel">Boîte Manuelle</option>
                </select>
                <select className="select-premium" value={formData.carburant} onChange={(e) => setFormData({...formData, carburant: e.target.value})}>
                  <option value="Essence">Essence</option>
                  <option value="Gasoil">Gasoil / Diesel</option>
                  <option value="Electrique">100% Électrique</option>
                  <option value="Hybride">Hybride</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <input type="number" placeholder="KILOMÉTRAGE" required className="input-premium" onChange={(e) => setFormData({...formData, kilometrage: e.target.value})} />
                <input type="number" placeholder="STOCK DISPO" defaultValue={1} min={1} required className="input-premium" onChange={(e) => setFormData({...formData, stock: e.target.value})} />
              </div>
            </div>

            {/* PRIX ET DESCRIPTION (Pleine largeur en dessous) */}
            <div className="col-span-1 md:col-span-2 space-y-4 border-t border-white/5 pt-6">
               <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                 {/* Prix */}
                 <div className="col-span-1">
                    <label className="text-[10px] font-black text-orange-500 uppercase tracking-widest ml-2 mb-2 block">
                      {formData.type === 'location' ? 'Tarif Jour (XOF)' : 'Prix de Vente (XOF)'}
                    </label>
                    <input type="number" required placeholder="0" className="input-premium text-orange-500 text-xl font-black h-24" onChange={(e) => setFormData({...formData, prix: e.target.value})} />
                 </div>
                 
                 {/* Description */}
                 <div className="col-span-1 md:col-span-2">
                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-2 mb-2 block">Informations Additionnelles</label>
                    <textarea placeholder="Décrivez les options, l'état du véhicule..." className="input-premium h-24 resize-none" onChange={(e) => setFormData({...formData, description: e.target.value})}></textarea>
                 </div>
               </div>
            </div>
          </div>

          {/* BOUTONS D'ACTION */}
          <div className="pt-8 border-t border-white/5 flex gap-4">
            <button type="button" onClick={onClose} className="btn-secondary">Annuler</button>
            <button type="submit" disabled={loading} className="btn-primary">
              {loading ? <i className="fas fa-spinner animate-spin mr-2"></i> : null}
              {loading ? 'Création en cours...' : 'Ajouter au catalogue'}
            </button>
          </div>
        </form>
      </div>

      <style jsx>{`
        .input-premium, .select-premium { 
          width: 100%; 
          background: rgba(255, 255, 255, 0.02); 
          border: 1px solid rgba(255, 255, 255, 0.08); 
          border-radius: 1rem; 
          padding: 1rem 1.25rem; 
          color: white; 
          font-size: 11px; 
          font-weight: 700;
          text-transform: uppercase;
          outline: none; 
          transition: 0.3s; 
          appearance: none;
        }
        .select-premium option { background: #0a0a0a; color: white; }
        .input-premium:focus, .select-premium:focus { border-color: #f97316; background: rgba(255, 255, 255, 0.05); }
        .btn-primary { flex: 2; background: #f97316; color: black; padding: 1.25rem; border-radius: 1rem; font-weight: 900; text-transform: uppercase; font-size: 11px; letter-spacing: 0.1em; transition: 0.3s; }
        .btn-primary:hover { background: white; transform: translateY(-2px); }
        .btn-secondary { flex: 1; border: 1px solid rgba(255, 255, 255, 0.1); color: white; padding: 1.25rem; border-radius: 1rem; font-weight: 900; text-transform: uppercase; font-size: 11px; letter-spacing: 0.1em; transition: 0.3s; }
        .btn-secondary:hover { background: rgba(255, 255, 255, 0.05); }
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #333; border-radius: 10px; }
      `}</style>
    </div>
  );
}