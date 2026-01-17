
import React, { useState } from 'react';
import { CONTACT_WHATSAPP, WHATSAPP_MESSAGE } from '../constants';
import { supabase } from '../supabase';

interface NavbarProps {
  isAdmin: boolean;
  onAdminLogin: (status: boolean) => void;
  currentPage: 'home' | 'catalog';
  onNavigate: (page: 'home' | 'catalog') => void;
}

export const Navbar: React.FC<NavbarProps> = ({ isAdmin, onAdminLogin, currentPage, onNavigate }) => {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleWhatsApp = (msg?: string) => {
    const text = msg ? encodeURIComponent(msg) : WHATSAPP_MESSAGE;
    window.open(`https://wa.me/55${CONTACT_WHATSAPP}?text=${text}`, '_blank');
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const { data, error } = await supabase
        .from('administradores')
        .select('*')
        .eq('email', email)
        .eq('senha', password)
        .single();

      if (data) {
        onAdminLogin(true);
        setShowLoginModal(false);
        onNavigate('catalog');
      } else {
        alert('Credenciais inválidas. Apenas administradores autorizados.');
      }
    } catch (err) {
      alert('Erro ao conectar com o servidor.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <nav className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-3 items-center h-28">
            
            {/* Esquerda: Navegação */}
            <div className="flex items-center space-x-8">
              <button 
                onClick={() => onNavigate('home')} 
                className={`text-xs font-black uppercase tracking-[0.2em] transition-colors ${currentPage === 'home' ? 'text-[#2563eb]' : 'text-slate-400 hover:text-[#2563eb]'}`}
              >
                Início
              </button>
              <button 
                onClick={() => onNavigate('catalog')} 
                className={`text-xs font-black uppercase tracking-[0.2em] transition-colors ${currentPage === 'catalog' ? 'text-[#2563eb]' : 'text-slate-400 hover:text-[#2563eb]'}`}
              >
                Catálogo de Clínicas
              </button>
            </div>

            {/* Centro: Logo (Aumentado em 100%) */}
            <div className="flex justify-center">
              <div 
                className="h-24 w-64 flex items-center justify-center cursor-pointer transition-transform hover:scale-105" 
                onClick={() => onNavigate('home')}
              >
                 <img 
                    src="https://agenciafoxon.com.br/wp-content/uploads/2026/01/Captura-de-tela-2026-01-16-234639.png" 
                    alt="Rei das Clínicas Logo" 
                    className="h-full w-full object-contain"
                    onError={(e) => {
                        e.currentTarget.src = "https://via.placeholder.com/150?text=REI";
                    }}
                 />
              </div>
            </div>

            {/* Direita: Ações */}
            <div className="flex items-center justify-end space-x-4">
              {!isAdmin ? (
                <button 
                  onClick={() => setShowLoginModal(true)}
                  className="hidden lg:block text-slate-300 hover:text-[#2563eb] text-[9px] font-black uppercase tracking-[0.2em] px-3 py-2 transition-all"
                >
                  Área Restrita
                </button>
              ) : (
                <button 
                  onClick={() => onAdminLogin(false)}
                  className="bg-rose-50 text-rose-600 border border-rose-100 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-rose-100 transition-all"
                >
                  Sair
                </button>
              )}
              
              <button 
                 className="bg-[#2563eb] text-white px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-[#1d4ed8] transition-all shadow-xl shadow-blue-100 flex items-center group"
                 onClick={() => handleWhatsApp()}
              >
                <span>Falar com o Rei</span>
                <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </button>
            </div>

          </div>
        </div>
      </nav>

      {showLoginModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-slate-900/80 backdrop-blur-md animate-in fade-in duration-300">
          <div 
            className="fixed inset-0 cursor-pointer"
            onClick={() => setShowLoginModal(false)}
          ></div>
          
          <div className="relative bg-white rounded-[3rem] w-full max-w-md shadow-[0_35px_60px_-15px_rgba(0,0,0,0.5)] overflow-hidden animate-in zoom-in-95 duration-300 my-auto">
            <div className="p-10 sm:p-14">
              <div className="flex justify-between items-start mb-10">
                <div className="flex items-center">
                    <img src="https://agenciafoxon.com.br/wp-content/uploads/2026/01/Captura-de-tela-2026-01-16-234639.png" alt="Logo" className="h-10 w-auto mr-3" />
                    <div>
                        <h2 className="text-2xl font-black text-[#0f172a] tracking-tight">Acesso Restrito</h2>
                        <p className="text-slate-500 text-xs mt-1">Identifique-se para gerenciar anúncios.</p>
                    </div>
                </div>
                <button 
                  onClick={() => setShowLoginModal(false)} 
                  className="bg-slate-100 p-3 rounded-full text-slate-400 hover:text-rose-500 transition-all"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <form onSubmit={handleLogin} className="space-y-6">
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3 ml-1">E-mail Administrativo</label>
                  <input 
                    type="email" 
                    required 
                    value={email} 
                    onChange={e => setEmail(e.target.value)} 
                    className="w-full px-6 py-5 rounded-2xl border-2 border-slate-100 focus:border-[#2563eb] focus:outline-none transition-all placeholder:text-slate-200 font-bold text-lg shadow-sm bg-white"
                    placeholder="exemplo@reidasclinicas.com.br"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3 ml-1">Chave de Segurança</label>
                  <input 
                    type="password" 
                    required 
                    value={password} 
                    onChange={e => setPassword(e.target.value)} 
                    className="w-full px-6 py-5 rounded-2xl border-2 border-slate-100 focus:border-[#2563eb] focus:outline-none transition-all placeholder:text-slate-200 font-bold text-lg shadow-sm bg-white"
                    placeholder="••••••••"
                  />
                </div>
                <button 
                  disabled={loading}
                  type="submit" 
                  className="w-full bg-[#0f172a] text-white py-6 rounded-2xl font-black text-lg hover:bg-[#2563eb] transition-all shadow-2xl flex items-center justify-center space-x-3 active:scale-[0.97] mt-4"
                >
                  {loading ? (
                    <svg className="animate-spin h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                  ) : (
                    <>
                      <span>ENTRAR AGORA</span>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
