import Sidebar from "./Sidebar";

export default function AdminClients() {
  return (
    <div className="flex min-h-screen bg-[#050505] text-white font-sans">
      <Sidebar />
      <main className="flex-1 p-6 md:p-10">
        <div className="max-w-7xl mx-auto">
          <header className="mb-10">
            <h1 className="text-3xl font-black uppercase tracking-tighter">
              Répertoire <span className="text-orange-500">Clients</span>
            </h1>
            <p className="text-gray-500 text-xs font-bold uppercase tracking-widest mt-1">Base de données des conducteurs premium</p>
          </header>

          <div className="bg-[#0a0a0a] border border-white/5 rounded-[2.5rem] p-8 text-center border-dashed">
            <i className="fas fa-users text-4xl text-gray-800 mb-4"></i>
            <p className="text-gray-500 font-bold uppercase text-xs tracking-widest">Votre liste de clients est actuellement vide</p>
          </div>
        </div>
      </main>
    </div>
  );
}