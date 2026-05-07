import { useState, useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import API_BASE_URL from '../../api/config';

export default function AddVehicleModal({ isOpen, onClose }) {
  const queryClient = useQueryClient();
  const [loading, setLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false); // Nouvel état pour le popup premium
  const [images, setImages] = useState([]); 
  const [previews, setPreviews] = useState([]); 

  const [formData, setFormData] = useState({
    type: 'location',
    marque: '',
    modele: '',
    categorie: 'suv',
    annee: new Date().getFullYear(),
    transmission: 'Automatique',
    carburant: 'Essence',
    kilometrage: 0,
    prix: '',
    stock: 1,
    description: ''
  });

  useEffect(() => {
    return () => previews.forEach(url => URL.revokeObjectURL(url));
  }, [previews]);

  if (!isOpen) return null;

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (images.length + files.length > 5) {
      alert("Limite atteinte : 5 images maximum.");
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
    const token = localStorage.getItem('adminToken');
    const uploadedUrls = [];

    try {
      // 1. UPLOAD DES IMAGES
      for (const file of images) {
        const uploadData = new FormData();
        uploadData.append('image', file);

        const uploadRes = await fetch(`${API_BASE_URL}/api/upload`, {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${token}` },
          body: uploadData
        });

        const uploadResult = await uploadRes.json();
        if (uploadResult.success) {
          uploadedUrls.push(uploadResult.url);
        } else {
          throw new Error("Échec de l'upload d'une image");
        }
      }

      // 2. PRÉPARATION DES DONNÉES
      const vehiclePayload = {
        name: `${formData.marque} ${formData.modele}`,
        brand: formData.marque,
        model: formData.modele,
        year: parseInt(formData.annee),
        category: formData.type,
        status: 'available',
        images: uploadedUrls,
        description: formData.description,
        specifications: {
          transmission: formData.transmission,
          fuel: formData.carburant,
          mileage: formData.kilometrage,
          category_type: formData.categorie
        }
      };

      if (formData.type === 'location') {
        vehiclePayload.price_per_day = parseFloat(formData.prix);
      } else {
        vehiclePayload.sale_price = parseFloat(formData.prix);
      }

      // 3. ENREGISTREMENT DB
      const response = await fetch(`${API_BASE_URL}/api/vehicles`, {
        method: 'POST',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json' 
        },
        body: JSON.stringify(vehiclePayload)
      });

      if (response.ok) {
        queryClient.invalidateQueries(['rental']);
        queryClient.invalidateQueries(['sale']);
        
        // 🚀 DÉCLENCHEMENT DU POPUP PREMIUM
        setIsSuccess(true);
        
        // Fermeture automatique après 2.5 secondes
        setTimeout(() => {
          setImages([]); 
          setPreviews([]);
          setIsSuccess(false);
          setFormData({
            type: 'location', marque: '', modele: '', categorie: 'suv', 
            annee: new Date().getFullYear(), transmission: 'Automatique', 
            carburant: 'Essence', kilometrage: 0, prix: '', stock: 1, description: ''
          });
          onClose();
        }, 2500);
      }
    } catch (error) {
      console.error("Erreur complète :", error);
      alert("Une erreur est survenue lors de la création.");
    } finally {
      setLoading(false);
    }
  };

  const years = Array.from(new Array(20), (val, index) => new Date().getFullYear() - index);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/95 backdrop-blur-md transition-opacity">
      <div className="bg-[#0a0a0a] border border-white/10 w-full max-w-5xl max-h-[90vh] overflow-hidden rounded-[2.5rem] flex flex-col shadow-2xl relative">
        
        {/* ========================================== */}
        {/* ÉCRAN DE SUCCÈS PREMIUM (OVERLAY)          */}
        {/* ========================================== */}
        {isSuccess && (
          <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-[#0a0a0a] bg-opacity-95 backdrop-blur-xl animate-fade-in">
            <div className="w-32 h-32 mb-8 rounded-full bg-orange-500/10 border-2 border-orange-500/20 flex items-center justify-center shadow-[0_0_50px_rgba(249,115,22,0.15)] animate-bounce-short">
              <i className="fas fa-check text-5xl text-orange-500 drop-shadow-lg"></i>
            </div>
            <h2 className="text-4xl font-black uppercase tracking-tighter italic text-white mb-4">
              Configuration <span className="text-orange-500">Validée</span>
            </h2>
            <p className="text-[10px] text-gray-400 uppercase tracking-[0.3em] font-bold">
              Le véhicule est en ligne sur le catalogue
            </p>
          </div>
        )}

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
        <form onSubmit={handleSubmit} className={`overflow-y-auto p-8 space-y-10 custom-scrollbar ${isSuccess ? 'opacity-0' : 'opacity-100'} transition-opacity duration-500`}>
          
          {/* UPLOAD IMAGES */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {previews.map((src, index) => (
              <div key={index} className="relative group aspect-square rounded-2xl overflow-hidden border border-white/10 bg-white/5">
                <img src={src} className="w-full h-full object-cover" alt="Preview" />
                <button type="button" onClick={() => removeImage(index)} className="absolute inset-0 bg-red-600/80 text-white opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <i className="fas fa-trash"></i>
                </button>
              </div>
            ))}
            {images.length < 5 && (
              <label className="aspect-square rounded-2xl border-2 border-dashed border-white/10 hover:border-orange-500/50 flex flex-col items-center justify-center cursor-pointer group transition-all">
                <input type="file" multiple accept="image/*" className="hidden" onChange={handleImageChange} />
                <i className="fas fa-camera text-gray-600 group-hover:text-orange-500 mb-2 text-xl"></i>
                <span className="text-[8px] font-black text-gray-600 uppercase tracking-widest">Ajouter</span>
              </label>
            )}
          </div>

          {/* SÉLECTEUR DE TYPE */}
          <div className="flex p-1.5 bg-white/[0.03] rounded-2xl border border-white/5 w-full md:w-1/2 mx-auto">
            {['location', 'vente'].map((t) => (
              <button key={t} type="button" onClick={() => setFormData({...formData, type: t})}
                className={`flex-1 py-3.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all duration-500 ${formData.type === t ? 'bg-orange-500 text-black shadow-lg shadow-orange-500/20' : 'text-gray-500 hover:text-white'}`}>
                {t === 'location' ? '🚗 Location' : '💎 Vente'}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {/* IDENTITÉ */}
            <div className="space-y-4">
              <h3 className="text-[10px] font-black text-white/40 uppercase tracking-[0.3em] border-b border-white/5 pb-3">Identité du produit</h3>
              <div className="grid grid-cols-2 gap-4">
                <input type="text" placeholder="MARQUE" required className="input-premium" value={formData.marque} onChange={(e) => setFormData({...formData, marque: e.target.value})} />
                <input type="text" placeholder="MODÈLE" required className="input-premium" value={formData.modele} onChange={(e) => setFormData({...formData, modele: e.target.value})} />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <select className="select-premium" value={formData.categorie} onChange={(e) => setFormData({...formData, categorie: e.target.value})}>
                  <option value="suv">SUV / Baroudeur</option>
                  <option value="berline">Berline de Luxe</option>
                  <option value="luxe">Prestige XXL</option>
                  <option value="4x4">4x4 Tout-terrain</option>
                  <option value="pickup">Pick-up Travail</option>
                  <option value="mariage">Cérémonie / Mariage</option>
                </select>
                <select className="select-premium" value={formData.annee} onChange={(e) => setFormData({...formData, annee: e.target.value})}>
                  {years.map(year => <option key={year} value={year}>{year}</option>)}
                </select>
              </div>
            </div>

            {/* SPÉCIFICATIONS */}
            <div className="space-y-4">
              <h3 className="text-[10px] font-black text-white/40 uppercase tracking-[0.3em] border-b border-white/5 pb-3">Spécifications techniques</h3>
              <div className="grid grid-cols-2 gap-4">
                <select className="select-premium" value={formData.transmission} onChange={(e) => setFormData({...formData, transmission: e.target.value})}>
                  <option value="Automatique">Boîte Auto</option>
                  <option value="Manuel">Boîte Manuelle</option>
                </select>
                <select className="select-premium" value={formData.carburant} onChange={(e) => setFormData({...formData, carburant: e.target.value})}>
                  <option value="Essence">Essence</option>
                  <option value="Gasoil">Gasoil / Diesel</option>
                  <option value="Hybride">Hybride</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <input type="number" placeholder="KM" required className="input-premium" value={formData.kilometrage} onChange={(e) => setFormData({...formData, kilometrage: e.target.value})} />
                <input type="number" placeholder="UNITÉS" min={1} required className="input-premium" value={formData.stock} onChange={(e) => setFormData({...formData, stock: e.target.value})} />
              </div>
            </div>

            {/* PRIX ET DESCRIPTION */}
            <div className="col-span-1 md:col-span-2 space-y-4 border-t border-white/5 pt-8">
               <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                 <div>
                    <label className="text-[9px] font-black text-orange-500 uppercase tracking-widest ml-2 mb-3 block">
                      {formData.type === 'location' ? 'Tarif Journalier (XOF)' : 'Prix de Vente Net (XOF)'}
                    </label>
                    <input type="number" required placeholder="0" className="input-premium text-orange-500 text-2xl font-black h-24 border-orange-500/20 bg-orange-500/5" value={formData.prix} onChange={(e) => setFormData({...formData, prix: e.target.value})} />
                 </div>
                 
                 <div className="col-span-1 md:col-span-2">
                    <label className="text-[9px] font-black text-gray-600 uppercase tracking-widest ml-2 mb-3 block">Notes & Options Premium</label>
                    <textarea placeholder="Détails, options, état général..." className="input-premium h-24 resize-none normal-case font-medium" value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})}></textarea>
                 </div>
               </div>
            </div>
          </div>

          {/* ACTIONS */}
          <div className="pt-8 border-t border-white/5 flex gap-6">
            <button type="button" onClick={onClose} className="btn-secondary">Annuler</button>
            <button type="submit" disabled={loading} className="btn-primary">
              {loading ? <i className="fas fa-circle-notch animate-spin mr-3"></i> : <i className="fas fa-check-circle mr-3"></i>}
              {loading ? 'Traitement Cloud...' : 'Publier au Catalogue'}
            </button>
          </div>
        </form>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .input-premium, .select-premium { 
          width: 100%; background: rgba(255, 255, 255, 0.02); 
          border: 1px solid rgba(255, 255, 255, 0.05); border-radius: 1.25rem; 
          padding: 1.15rem 1.5rem; color: white; font-size: 11px; font-weight: 800;
          text-transform: uppercase; outline: none; transition: 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .input-premium:focus { border-color: rgba(249, 115, 22, 0.5); background: rgba(249, 115, 22, 0.02); }
        .btn-primary { 
          flex: 2; background: #f97316; color: black; padding: 1.4rem; 
          border-radius: 1.25rem; font-weight: 900; text-transform: uppercase; 
          font-size: 11px; letter-spacing: 0.2em; transition: 0.5s;
          box-shadow: 0 10px 30px rgba(249, 115, 22, 0.2);
        }
        .btn-primary:hover:not(:disabled) { background: white; transform: translateY(-3px); }
        .btn-secondary { 
          flex: 1; border: 1px solid rgba(255, 255, 255, 0.1); color: white; 
          padding: 1.4rem; border-radius: 1.25rem; font-weight: 900; 
          text-transform: uppercase; font-size: 11px; transition: 0.4s;
        }
        .btn-secondary:hover { background: white; color: black; }
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #222; border-radius: 10px; }
        
        /* Animations du Modal Success */
        @keyframes fadeIn { from { opacity: 0; backdrop-filter: blur(0px); } to { opacity: 1; backdrop-filter: blur(16px); } }
        @keyframes bounceShort { 0% { transform: scale(0.8); opacity: 0; } 50% { transform: scale(1.1); } 100% { transform: scale(1); opacity: 1; } }
        .animate-fade-in { animation: fadeIn 0.4s ease-out forwards; }
        .animate-bounce-short { animation: bounceShort 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards; }
      `}} />
    </div>
  );
}