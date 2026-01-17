
import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { LandingPage } from './pages/LandingPage';
import { CatalogPage } from './pages/CatalogPage';
import { DossierPage } from './pages/DossierPage';
import { Clinica } from './types';
import { INITIAL_CLINICS, CONTACT_WHATSAPP_FORMATTED } from './constants';
import { supabase } from './supabase';

const App: React.FC = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [currentPage, setCurrentPage] = useState<'home' | 'catalog' | 'dossier'>('home');
  const [selectedClinic, setSelectedClinic] = useState<Clinica | null>(null);
  const [clinics, setClinics] = useState<Clinica[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchClinics();
  }, []);

  const fetchClinics = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('clinicas')
        .select('*')
        .order('id', { ascending: false });

      if (error) {
        console.error('Erro Supabase:', error.message);
        if (error.message.includes('API key')) {
          console.error('DICA: Verifique se a ANON_KEY no arquivo supabase.ts está correta e completa.');
        }
        setClinics(INITIAL_CLINICS);
      } else if (data && data.length > 0) {
        const mappedData = data.map((item: any) => ({
          ...item,
          faturamentoMensal: item.faturamento_mensal || item.faturamentoMensal,
          fotos: Array.isArray(item.fotos) ? item.fotos : [item.imagem]
        }));
        setClinics(mappedData);
      } else {
        setClinics(INITIAL_CLINICS);
      }
    } catch (err) {
      console.error('Erro inesperado ao buscar clínicas:', err);
      setClinics(INITIAL_CLINICS);
    } finally {
      setLoading(false);
    }
  };

  const navigate = (page: 'home' | 'catalog' | 'dossier') => {
    setCurrentPage(page);
    if (page !== 'dossier') setSelectedClinic(null);
    window.scrollTo(0, 0);
  };

  const openDossier = (clinic: Clinica) => {
    setSelectedClinic(clinic);
    setCurrentPage('dossier');
    window.scrollTo(0, 0);
  };

  const updateClinicLocally = (updated: Clinica) => {
    setClinics(prev => prev.map(c => c.id === updated.id ? updated : c));
    setSelectedClinic(updated);
  };

  const addClinic = async (newClinic: Omit<Clinica, 'id'>) => {
    try {
      const payload: any = {
        nome: newClinic.nome,
        localizacao: newClinic.localizacao,
        preco: newClinic.preco,
        faturamento_mensal: newClinic.faturamentoMensal,
        descricao: newClinic.descricao,
        imagem: newClinic.imagem,
        especialidades: newClinic.especialidades
      };

      const { data, error } = await supabase
        .from('clinicas')
        .insert([{ ...payload, fotos: [newClinic.imagem] }])
        .select();

      if (error) {
        if (error.message.includes('column "fotos"')) {
           const { data: retryData, error: retryError } = await supabase
            .from('clinicas')
            .insert([payload])
            .select();
            
           if (retryError) throw retryError;
           if (retryData) handleSuccess(retryData[0]);
        } else {
          throw error;
        }
      } else if (data) {
        handleSuccess(data[0]);
      }
    } catch (err: any) {
      console.error('Erro ao cadastrar:', err);
      alert(`Erro: ${err.message}`);
    }
  };

  const handleSuccess = (savedItem: any) => {
    const savedClinic = { 
      ...savedItem, 
      faturamentoMensal: savedItem.faturamento_mensal,
      fotos: savedItem.fotos || [savedItem.imagem]
    };
    setClinics(prev => [savedClinic, ...prev]);
    alert('Clínica cadastrada com sucesso!');
  };

  const removeClinic = async (id: string) => {
    if (!confirm('Tem certeza que deseja remover este anúncio?')) return;
    try {
      const { error } = await supabase.from('clinicas').delete().eq('id', id);
      if (!error) {
        setClinics(prev => prev.filter(c => c.id !== id));
      } else {
        alert('Erro ao deletar: ' + error.message);
      }
    } catch (err) {
      console.error('Erro na deleção:', err);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar 
        isAdmin={isAdmin} 
        onAdminLogin={setIsAdmin} 
        currentPage={currentPage === 'dossier' ? 'catalog' : currentPage} 
        onNavigate={navigate} 
      />
      
      <main className="flex-grow">
        {currentPage === 'home' && <LandingPage onStartBrowsing={() => navigate('catalog')} />}
        {currentPage === 'catalog' && (
          <div className={loading ? "opacity-50 pointer-events-none" : ""}>
            <CatalogPage 
              isAdmin={isAdmin} 
              clinics={clinics} 
              onAddClinic={addClinic}
              onRemoveClinic={removeClinic}
              onViewDossier={openDossier}
            />
          </div>
        )}
        {currentPage === 'dossier' && selectedClinic && (
          <DossierPage 
            clinic={selectedClinic} 
            isAdmin={isAdmin} 
            onBack={() => navigate('catalog')} 
            onUpdate={updateClinicLocally}
          />
        )}
      </main>

      <footer className="bg-slate-900 text-slate-400 py-12 px-4 border-t border-slate-800">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 text-center md:text-left">
          <div className="col-span-1 md:col-span-2">
            <span className="text-xl font-bold text-white uppercase tracking-tighter">REI DAS CLÍNICAS</span>
            <p className="mt-4 max-w-sm mx-auto md:mx-0">
              A maior autoridade em compra e venda de clínicas no Brasil. Segurança, transparência e as melhores negociações do mercado.
            </p>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-widest">Links</h4>
            <ul className="space-y-2 text-sm">
              <li><button onClick={() => navigate('home')}>Início</button></li>
              <li><button onClick={() => navigate('catalog')}>Ver Clínicas</button></li>
              <li><a href="#" className="hover:text-white transition-colors">Privacidade</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-widest">Contato</h4>
            <ul className="space-y-2 text-sm">
              <li>WhatsApp: {CONTACT_WHATSAPP_FORMATTED}</li>
              <li>São Paulo - SP</li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-slate-800 text-center text-xs">
          &copy; {new Date().getFullYear()} Rei das Clínicas. Todos os direitos reservados.
        </div>
      </footer>
    </div>
  );
};

export default App;
