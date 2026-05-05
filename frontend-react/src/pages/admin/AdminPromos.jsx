import Sidebar from "./Sidebar";

export default function AdminPromos() {
  return (
    <div className="flex min-h-screen bg-[#050505] text-white font-sans">
      <Sidebar />
      <main className="flex-1 p-6 md:p-10">
        <div className="max-w-7xl mx-auto">
          <header className="flex justify-between items-center mb-10">
            <div>
              <h1 className="text-3xl font-black uppercase tracking-tighter">
                Marketing <span className="text-orange-500">& Promos</span>
              </h1>
              <p className="text-gray-500 text-xs font-bold uppercase tracking-widest mt-1">Configuration des coupons de réduction</p>
            </div>
            <button className="bg-white text-black px-6 py-3 rounded-xl font-black uppercase text-[10px] tracking-widest">
              + Créer un code
            </button>
          </header>

          <div className="bg-[#0a0a0a] border border-white/5 rounded-[2.5rem] p-8 text-center border-dashed">
            <i className="fas fa-ticket-alt text-4xl text-gray-800 mb-4"></i>
            <p className="text-gray-500 font-bold uppercase text-xs tracking-widest">Aucune promotion active</p>
          </div>
        </div>
      </main>
    </div>
  );
}