
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
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  // Caminho absoluto com timestamp para evitar cache do navegador se o arquivo foi substituído recentemente
  const logoUrl = "/assets/images/Logo.png?v=1.0";

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

  const toggleNavigate = (page: 'home' | 'catalog') => {
    onNavigate(page);
    setIsMenuOpen(false);
  };

  return (
    <>
      <nav className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20 lg:h-28">
            
            {/* Mobile: Botão Menu */}
            <div className="lg:hidden flex-1">
              <button 
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2 text-slate-600"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {isMenuOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>
            </div>

            {/* Desktop: Navegação Esquerda */}
            <div className="hidden lg:flex items-center space-x-8 flex-1">
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
                Catálogo
              </button>
            </div>

            {/* Centro: Logo */}
            <div className="flex justify-center flex-1">
              <div 
                className="h-12 lg:h-24 w-auto flex items-center justify-center cursor-pointer transition-transform hover:scale-105" 
                onClick={() => onNavigate('home')}
              >
                 <img 
                    src={logoUrl}
                    alt="Rei das Clínicas" 
                    className="h-full w-auto max-w-[200px] lg:max-w-[300px] object-contain"
                    style={{ display: 'block' }}
                 />
              </div>
            </div>

            {/* Direita: Ações */}
            <div className="flex items-center justify-end space-x-2 lg:space-x-4 flex-1">
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
                  className="hidden lg:block bg-rose-50 text-rose-600 border border-rose-100 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-rose-100 transition-all"
                >
                  Sair
                </button>
              )}
              
              <button 
                 className="bg-[#2563eb] text-white px-4 py-2 lg:px-6 lg:py-3 rounded-xl lg:rounded-2xl text-[10px] lg:text-xs font-black uppercase tracking-widest hover:bg-[#1d4ed8] transition-all shadow-lg lg:shadow-xl shadow-blue-100 flex items-center group whitespace-nowrap"
                 onClick={() => handleWhatsApp()}
              >
                <span className="hidden sm:inline">Falar com o Rei</span>
                <span className="sm:hidden">Contato</span>
                <svg className="w-3 h-3 lg:w-4 lg:h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        {isMenuOpen && (
          <div className="lg:hidden bg-white border-t border-slate-100 animate-in slide-in-from-top duration-300">
            <div className="px-4 pt-4 pb-6 space-y-4">
              <button 
                onClick={() => toggleNavigate('home')} 
                className={`block w-full text-left px-4 py-3 rounded-xl font-bold uppercase tracking-widest text-[11px] ${currentPage === 'home' ? 'bg-blue-50 text-blue-600' : 'text-slate-500'}`}
              >
                Início
              </button>
              <button 
                onClick={() => toggleNavigate('catalog')} 
                className={`block w-full text-left px-4 py-3 rounded-xl font-bold uppercase tracking-widest text-[11px] ${currentPage === 'catalog' ? 'bg-blue-50 text-blue-600' : 'text-slate-500'}`}
              >
                Catálogo de Clínicas
              </button>
              {!isAdmin ? (
                <button 
                  onClick={() => { setShowLoginModal(true); setIsMenuOpen(false); }}
                  className="block w-full text-left px-4 py-3 rounded-xl font-bold uppercase tracking-widest text-[11px] text-slate-300"
                >
                  Área Restrita
                </button>
              ) : (
                <button 
                  onClick={() => { onAdminLogin(false); setIsMenuOpen(false); }}
                  className="block w-full text-left px-4 py-3 rounded-xl font-bold uppercase tracking-widest text-[11px] text-rose-500"
                >
                  Sair do Painel
                </button>
              )}
            </div>
          </div>
        )}
      </nav>

      {showLoginModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-md animate-in fade-in duration-300">
          <div 
            className="fixed inset-0 cursor-pointer"
            onClick={() => setShowLoginModal(false)}
          ></div>
          
          <div className="relative bg-white rounded-[2.5rem] w-full max-w-md shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="p-8 lg:p-12">
              <div className="flex justify-between items-start mb-8">
                <div className="flex items-center">
                    <img 
                      src={logoUrl}
                      alt="Logo" 
                      className="h-10 w-auto mr-3 object-contain"
                    />
                    <div>
                        <h2 className="text-xl font-black text-[#0f172a] tracking-tight">Acesso Administrativo</h2>
                        <p className="text-slate-500 text-[10px] mt-1 uppercase tracking-wider font-bold">Painel de Controle</p>
                    </div>
                </div>
                <button 
                  onClick={() => setShowLoginModal(false)} 
                  className="bg-slate-100 p-2 rounded-full text-slate-400 hover:text-rose-500 transition-all"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </div>
              
              <form onSubmit={handleLogin} className="space-y-4 lg:space-y-6">
                <div>
                  <label className="block text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 ml-1">E-mail</label>
                  <input 
                    type="email" 
                    required 
                    value={email} 
                    onChange={e => setEmail(e.target.value)} 
                    className="w-full px-6 py-4 rounded-xl border-2 border-slate-100 focus:border-[#2563eb] focus:outline-none transition-all font-bold"
                    placeholder="admin@reidasclinicas.com"
                  />
                </div>
                <div>
                  <label className="block text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 ml-1">Senha</label>
                  <input 
                    type="password" 
                    required 
                    value={password} 
                    onChange={e => setPassword(e.target.value)} 
                    className="w-full px-6 py-4 rounded-xl border-2 border-slate-100 focus:border-[#2563eb] focus:outline-none transition-all font-bold"
                    placeholder="••••••••"
                  />
                </div>
                <button 
                  disabled={loading}
                  type="submit" 
                  className="w-full bg-[#0f172a] text-white py-5 rounded-xl font-black text-sm hover:bg-[#2563eb] transition-all shadow-xl flex items-center justify-center space-x-3 active:scale-[0.97]"
                >
                  {loading ? (
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                  ) : (
                    <>
                      <span>ENTRAR NO SISTEMA</span>
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
