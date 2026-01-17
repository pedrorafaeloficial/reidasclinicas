import React, { useState } from 'react';
import { Clinica } from '../types';
import { CONTACT_WHATSAPP } from '../constants';

interface CatalogPageProps {
  isAdmin: boolean;
  clinics: Clinica[];
  onAddClinic: (clinic: Omit<Clinica, 'id'>) => void;
  onRemoveClinic: (id: string) => void;
  onViewDossier: (clinic: Clinica) => void;
}

const ESTADOS_BRASIL = [
  "AC", "AL", "AP", "AM", "BA", "CE", "DF", "ES", "GO", "MA", "MT", "MS", "MG", 
  "PA", "PB", "PR", "PE", "PI", "RJ", "RN", "RS", "RO", "RR", "SC", "SP", "SE", "TO"
];

const ESPECIALIDADES_SUGERIDAS = [
  "Odontologia", "Dermatologia", "Estética", "Ginecologia", "Cardiologia", 
  "Ortopedia", "Oftalmologista", "Pediatria", "Fisioterapia", "Psicologia", 
  "Veterinária", "Laboratório", "Hospital", "Pronto Socorro"
];

const compressImage = (base64: string, maxWidth = 800, quality = 0.7): Promise<string> => {
  return new Promise((resolve) => {
    const img = new Image();
    img.src = base64;
    img.onload = () => {
      const canvas = document.createElement('canvas');
      let width = img.width;
      let height = img.height;
      if (width > maxWidth) {
        height = Math.round((height * maxWidth) / width);
        width = maxWidth;
      }
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      ctx?.drawImage(img, 0, 0, width, height);
      resolve(canvas.toDataURL('image/jpeg', quality));
    };
    img.onerror = () => resolve(base64);
  });
};

export const CatalogPage: React.FC<CatalogPageProps> = ({ isAdmin, clinics, onAddClinic, onRemoveClinic, onViewDossier }) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    nome: '',
    estado: 'SP',
    cidade: '',
    preco: '',
    faturamentoMensal: '',
    descricao: '',
    especialidades: [] as string[],
    novaEspecialidade: '',
    imagemBase64: ''
  });

  const handleInterest = (nomeClinica: string) => {
    const text = encodeURIComponent(`Olá tenho interesse na clinica ${nomeClinica}`);
    window.open(`https://wa.me/55${CONTACT_WHATSAPP}?text=${text}`, '_blank');
  };

  const formatCurrency = (value: string) => {
    const cleanValue = value.replace(/\D/g, "");
    const numberValue = Number(cleanValue) / 100;
    return numberValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 });
  };

  const handleCurrencyInput = (field: 'preco' | 'faturamentoMensal', value: string) => {
    const formatted = formatCurrency(value);
    setFormData(prev => ({ ...prev, [field]: formatted }));
  };

  const parseCurrencyToNumber = (formattedValue: string) => {
    if (!formattedValue) return 0;
    return Number(formattedValue.replace(/\./g, '').replace(',', '.'));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const compressed = await compressImage(reader.result as string);
        setFormData(prev => ({ ...prev, imagemBase64: compressed }));
      };
      reader.readAsDataURL(file);
    }
  };

  const toggleEspecialidade = (spec: string) => {
    setFormData(prev => ({
      ...prev,
      especialidades: prev.especialidades.includes(spec)
        ? prev.especialidades.filter(s => s !== spec)
        : [...prev.especialidades, spec]
    }));
  };

  const addCustomEspecialidade = () => {
    if (formData.novaEspecialidade.trim() && !formData.especialidades.includes(formData.novaEspecialidade.trim())) {
      setFormData(prev => ({
        ...prev,
        especialidades: [...prev.especialidades, formData.novaEspecialidade.trim()],
        novaEspecialidade: ''
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.imagemBase64) return alert("Por favor, suba uma foto da clínica.");
    
    setUploading(true);
    const newClinic: Omit<Clinica, 'id'> = {
      nome: formData.nome,
      localizacao: `${formData.cidade}, ${formData.estado}`,
      preco: parseCurrencyToNumber(formData.preco),
      faturamentoMensal: parseCurrencyToNumber(formData.faturamentoMensal),
      descricao: formData.descricao,
      imagem: formData.imagemBase64,
      especialidades: formData.especialidades.length > 0 ? formData.especialidades : ["Geral"]
    };
    
    await onAddClinic(newClinic);
    setUploading(false);
    setShowAddModal(false);
    setFormData({ nome: '', estado: 'SP', cidade: '', preco: '', faturamentoMensal: '', descricao: '', especialidades: [], novaEspecialidade: '', imagemBase64: '' });
  };

  return (
    <div className="py-12 px-4 max-w-7xl mx-auto animate-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-12">
        <div>
          <h1 className="text-5xl font-black text-[#0f172a] tracking-tight leading-none">Oportunidades do Rei</h1>
          <p className="text-slate-500 mt-3 font-medium text-lg">As melhores clínicas selecionadas a dedo pelo Brasil.</p>
        </div>
        
        {isAdmin && (
          <button 
            onClick={() => setShowAddModal(true)}
            className="mt-4 md:mt-0 bg-[#2563eb] text-white px-8 py-4 rounded-[1.5rem] font-black text-sm uppercase tracking-widest hover:bg-[#1d4ed8] transition-all flex items-center shadow-2xl shadow-blue-100 active:scale-95"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
            CADASTRAR CLÍNICA
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        {clinics.length === 0 ? (
          <div className="col-span-full py-20 text-center">
            <p className="text-slate-400 text-xl font-medium italic">O Rei está garimpando novas clínicas para você...</p>
          </div>
        ) : clinics.map((clinic) => (
          <div key={clinic.id} className="group bg-white rounded-[3rem] border-2 border-slate-100 overflow-hidden hover:border-blue-100 hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.1)] transition-all flex flex-col h-full">
            <div className="relative h-64 overflow-hidden">
               <img 
                 src={clinic.imagem} 
                 alt={clinic.nome} 
                 className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" 
               />
               <div className="absolute top-6 left-6 bg-white/95 backdrop-blur-md px-4 py-1.5 rounded-full text-[10px] font-black text-[#2563eb] shadow-xl uppercase tracking-[0.15em]">
                  {clinic.especialidades?.[0] || 'Geral'}
               </div>
               {isAdmin && (
                 <button 
                  onClick={(e) => { e.stopPropagation(); onRemoveClinic(clinic.id); }}
                  className="absolute top-6 right-6 bg-rose-500 text-white p-3 rounded-full hover:bg-rose-600 shadow-2xl z-10 transition-transform hover:scale-110"
                 >
                   <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                 </button>
               )}
            </div>
            
            <div className="p-10 flex flex-col flex-grow">
               <h3 className="text-2xl font-black text-[#0f172a] leading-tight mb-2 tracking-tight group-hover:text-[#2563eb] transition-colors">{clinic.nome}</h3>
               <p className="text-slate-400 font-bold text-sm mb-6 flex items-center">
                 <svg className="w-4 h-4 mr-1 text-[#2563eb]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /></svg>
                 {clinic.localizacao}
               </p>
               
               <div className="grid grid-cols-2 gap-6 mb-8 pt-8 border-t-2 border-slate-50">
                 <div>
                   <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest mb-2">Asking Price</p>
                   <p className="text-xl font-black text-[#0f172a]">R$ {Number(clinic.preco).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                 </div>
                 <div>
                   <p className="text-[9px] font-black text-blue-300 uppercase tracking-widest mb-2">Revenue / m</p>
                   <p className="text-xl font-black text-[#2563eb]">R$ {Number(clinic.faturamentoMensal).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                 </div>
               </div>

               <div className="space-y-3 mt-auto">
                 <button 
                   className="w-full bg-[#0f172a] text-white py-4 rounded-2xl font-black hover:bg-slate-800 transition-all text-[10px] uppercase tracking-[0.2em] shadow-lg active:scale-95"
                   onClick={() => onViewDossier(clinic)}
                 >
                   ACESSAR DOSSIÊ COMPLETO
                 </button>
                 <button 
                   className="w-full bg-[#2563eb] text-white py-4 rounded-2xl font-black hover:bg-[#1d4ed8] transition-all text-[10px] uppercase tracking-[0.2em] shadow-xl shadow-blue-100 flex items-center justify-center space-x-2 active:scale-95"
                   onClick={() => handleInterest(clinic.nome)}
                 >
                   <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                   <span>TENHO INTERESSE</span>
                 </button>
               </div>
            </div>
          </div>
        ))}
      </div>

      {showAddModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-md overflow-y-auto">
          <div 
            className="fixed inset-0 cursor-pointer"
            onClick={() => setShowAddModal(false)}
          ></div>
          <div className="relative bg-white rounded-[3rem] w-full max-w-2xl shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] overflow-hidden animate-in zoom-in-95 duration-300 my-auto">
            <div className="p-10 md:p-14 max-h-[90vh] overflow-y-auto custom-scrollbar">
              <div className="flex justify-between items-center mb-10 sticky top-0 bg-white z-10 pb-4 border-b border-slate-50">
                <div>
                  <h2 className="text-4xl font-black text-[#0f172a] tracking-tight">Novo Anúncio</h2>
                  <p className="text-slate-500 font-medium mt-1">Insira os dados da clínica para o catálogo do Rei.</p>
                </div>
                <button onClick={() => setShowAddModal(false)} className="bg-slate-100 p-3 rounded-full text-slate-400 hover:text-rose-500 transition-colors">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-8 mt-4">
                <div>
                  <label className="block text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3 ml-1">Foto da Clínica (Arquivo Local)</label>
                  <div className="mt-2 flex flex-col items-center justify-center border-2 border-dashed border-slate-200 rounded-3xl p-6 hover:border-[#2563eb] transition-all bg-white group">
                    {formData.imagemBase64 ? (
                      <div className="relative w-full aspect-video rounded-2xl overflow-hidden">
                        <img src={formData.imagemBase64} className="w-full h-full object-cover" />
                        <button type="button" onClick={() => setFormData(prev => ({...prev, imagemBase64: ''}))} className="absolute top-2 right-2 bg-rose-500 text-white p-2 rounded-full shadow-lg">
                           <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                        </button>
                      </div>
                    ) : (
                      <label className="flex flex-col items-center justify-center cursor-pointer w-full h-full py-10">
                        <svg className="w-12 h-12 text-slate-300 group-hover:text-[#2563eb] transition-colors mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                        <span className="text-slate-400 font-bold text-sm">Clique para subir a foto principal</span>
                        <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
                      </label>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3 ml-1">Nome da Clínica</label>
                  <input required value={formData.nome} onChange={e => setFormData({...formData, nome: e.target.value})} className="w-full px-6 py-5 rounded-2xl border-2 border-slate-100 focus:border-[#2563eb] focus:outline-none bg-white transition-all text-slate-700 font-bold shadow-sm" placeholder="Ex: Clínica Alpha Saúde" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3 ml-1">Estado (UF)</label>
                    <select required value={formData.estado} onChange={e => setFormData({...formData, estado: e.target.value})} className="w-full px-6 py-5 rounded-2xl border-2 border-slate-100 focus:border-[#2563eb] focus:outline-none bg-white transition-all text-slate-700 font-bold appearance-none shadow-sm">
                      {ESTADOS_BRASIL.map(uf => <option key={uf} value={uf}>{uf}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3 ml-1">Cidade</label>
                    <input required value={formData.cidade} onChange={e => setFormData({...formData, cidade: e.target.value})} className="w-full px-6 py-5 rounded-2xl border-2 border-slate-100 focus:border-[#2563eb] focus:outline-none bg-white transition-all text-slate-700 font-bold shadow-sm" placeholder="Ex: São Paulo" />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3 ml-1">Preço de Venda (R$)</label>
                    <input required value={formData.preco} onChange={e => handleCurrencyInput('preco', e.target.value)} className="w-full px-6 py-5 rounded-2xl border-2 border-slate-100 focus:border-[#2563eb] focus:outline-none bg-white transition-all text-[#0f172a] font-black shadow-sm" placeholder="0,00" />
                  </div>
                  <div>
                    <label className="block text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3 ml-1">Faturamento (R$)</label>
                    <input required value={formData.faturamentoMensal} onChange={e => handleCurrencyInput('faturamentoMensal', e.target.value)} className="w-full px-6 py-5 rounded-2xl border-2 border-slate-100 focus:border-[#2563eb] focus:outline-none bg-white transition-all text-[#2563eb] font-black shadow-sm" placeholder="0,00" />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3 ml-1">Segmentos / Especialidades</label>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {ESPECIALIDADES_SUGERIDAS.map(spec => (
                      <button key={spec} type="button" onClick={() => toggleEspecialidade(spec)} className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border-2 ${formData.especialidades.includes(spec) ? 'bg-[#2563eb] text-white border-[#2563eb] shadow-lg' : 'bg-white text-slate-400 border-slate-100 hover:border-blue-200'}`}>
                        {spec}
                      </button>
                    ))}
                  </div>
                  <div className="flex space-x-2">
                    <input value={formData.novaEspecialidade} onChange={e => setFormData({...formData, novaEspecialidade: e.target.value})} onKeyPress={e => e.key === 'Enter' && (e.preventDefault(), addCustomEspecialidade())} className="flex-grow px-6 py-4 rounded-xl border-2 border-slate-100 focus:border-[#2563eb] outline-none bg-white text-sm font-bold shadow-sm" placeholder="Outra especialidade..." />
                    <button type="button" onClick={addCustomEspecialidade} className="bg-[#2563eb] text-white px-6 rounded-xl font-black text-[10px] uppercase hover:bg-[#1d4ed8] transition-all shadow-md">ADD</button>
                  </div>
                </div>

                <button type="submit" disabled={uploading} className="w-full bg-[#2563eb] text-white py-6 rounded-3xl font-black text-xl hover:bg-[#1d4ed8] transition-all shadow-2xl shadow-blue-100 mt-6 active:scale-95 uppercase tracking-widest disabled:opacity-50 flex items-center justify-center">
                  {uploading ? (
                    <>
                      <svg className="animate-spin h-6 w-6 mr-3 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                      PROCESSANDO...
                    </>
                  ) : 'PUBLICAR ANÚNCIO AGORA'}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};