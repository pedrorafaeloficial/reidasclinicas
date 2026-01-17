
import React, { useState, useEffect } from 'react';
import { Clinica } from '../types';
import { CONTACT_WHATSAPP } from '../constants';
import { supabase } from '../supabase';

interface DossierPageProps {
  clinic: Clinica;
  isAdmin: boolean;
  onBack: () => void;
  onUpdate: (updatedClinic: Clinica) => void;
}

const ESTADOS_BRASIL = [
  "AC", "AL", "AP", "AM", "BA", "CE", "DF", "ES", "GO", "MA", "MT", "MS", "MG", 
  "PA", "PB", "PR", "PE", "PI", "RJ", "RN", "RS", "RO", "RR", "SC", "SP", "SE", "TO"
];

const compressImage = (base64: string, maxWidth = 800, quality = 0.6): Promise<string> => {
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

export const DossierPage: React.FC<DossierPageProps> = ({ clinic, isAdmin, onBack, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [viewerIndex, setViewerIndex] = useState<number | null>(null);
  
  const locationParts = clinic.localizacao.split(', ');
  const initialCidade = locationParts[0] || '';
  const initialEstado = locationParts[1] || 'SP';

  const formatCurrency = (val: number | string) => {
    const number = typeof val === 'number' ? val : Number(String(val).replace(/\D/g, "")) / 100;
    return number.toLocaleString('pt-BR', { minimumFractionDigits: 2 });
  };

  const [editForm, setEditForm] = useState({
    ...clinic,
    cidade: initialCidade,
    estado: initialEstado,
    precoFormatado: formatCurrency(clinic.preco),
    faturamentoFormatado: formatCurrency(clinic.faturamentoMensal)
  });

  const [gallery, setGallery] = useState<string[]>(
    (clinic as any).fotos && Array.isArray((clinic as any).fotos) ? (clinic as any).fotos : [clinic.imagem]
  );

  useEffect(() => {
    setEditForm({
      ...clinic,
      cidade: clinic.localizacao.split(', ')[0] || '',
      estado: clinic.localizacao.split(', ')[1] || 'SP',
      precoFormatado: formatCurrency(clinic.preco),
      faturamentoFormatado: formatCurrency(clinic.faturamentoMensal)
    });
    setGallery((clinic as any).fotos && Array.isArray((clinic as any).fotos) ? (clinic as any).fotos : [clinic.imagem]);
  }, [clinic]);

  const handleCurrencyInput = (field: 'precoFormatado' | 'faturamentoFormatado', value: string) => {
    const cleanValue = value.replace(/\D/g, "");
    const numberValue = Number(cleanValue) / 100;
    const formatted = numberValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 });
    setEditForm(prev => ({ ...prev, [field]: formatted }));
  };

  const parseCurrency = (formatted: string) => {
    return Number(formatted.replace(/\./g, '').replace(',', '.'));
  };

  const handleFileGallery = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (gallery.length >= 30) {
        alert("Limite de 30 fotos atingido.");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64 = reader.result as string;
        const compressed = await compressImage(base64);
        setGallery(prev => [...prev, compressed]);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    setLoading(true);
    const precoFinal = parseCurrency(editForm.precoFormatado);
    const faturamentoFinal = parseCurrency(editForm.faturamentoFormatado);
    const localizacaoFinal = `${editForm.cidade}, ${editForm.estado}`;

    try {
      const updateData: any = {
        nome: editForm.nome,
        localizacao: localizacaoFinal,
        preco: precoFinal,
        faturamento_mensal: faturamentoFinal,
        descricao: editForm.descricao,
        imagem: gallery[0] || editForm.imagem,
        fotos: gallery 
      };

      const { error } = await supabase
        .from('clinicas')
        .update(updateData)
        .eq('id', clinic.id);

      if (error) {
        if (error.message.includes('column "fotos" of relation "clinicas" does not exist')) {
          throw new Error("A coluna 'fotos' não foi encontrada no banco.");
        }
        throw error;
      }
      
      onUpdate({ ...clinic, ...updateData, faturamentoMensal: faturamentoFinal });
      setIsEditing(false);
      alert('Dossiê atualizado com sucesso!');
    } catch (err) {
      alert('Erro: ' + (err as any).message);
    } finally {
      setLoading(false);
    }
  };

  const removePhoto = (index: number) => {
    if (gallery.length <= 1) return alert('A clínica deve ter pelo menos uma foto.');
    setGallery(prev => prev.filter((_, i) => i !== index));
  };

  const nextImage = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (viewerIndex !== null) {
      setViewerIndex((viewerIndex + 1) % gallery.length);
    }
  };

  const prevImage = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (viewerIndex !== null) {
      setViewerIndex((viewerIndex - 1 + gallery.length) % gallery.length);
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen pb-20 animate-in fade-in duration-500">
      {/* Lightbox Viewer */}
      {viewerIndex !== null && (
        <div 
          className="fixed inset-0 z-[200] bg-black/95 flex items-center justify-center p-4 animate-in fade-in duration-300"
          onClick={() => setViewerIndex(null)}
        >
          <button className="absolute top-6 right-6 text-white/50 hover:text-white transition-colors z-[210]">
            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
          
          <button 
            onClick={prevImage}
            className="absolute left-6 top-1/2 -translate-y-1/2 text-white/30 hover:text-white hover:scale-110 transition-all p-4 z-[210]"
          >
            <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
          </button>

          <div className="relative max-w-5xl w-full h-full flex items-center justify-center">
            <img 
              src={gallery[viewerIndex]} 
              className="max-w-full max-h-[85vh] object-contain shadow-2xl rounded-lg animate-in zoom-in-95 duration-300" 
              alt="Visualização"
              onClick={(e) => e.stopPropagation()}
            />
            <div className="absolute bottom-[-40px] left-1/2 -translate-x-1/2 text-white/60 font-black text-xs uppercase tracking-widest">
              Foto {viewerIndex + 1} de {gallery.length}
            </div>
          </div>

          <button 
            onClick={nextImage}
            className="absolute right-6 top-1/2 -translate-y-1/2 text-white/30 hover:text-white hover:scale-110 transition-all p-4 z-[210]"
          >
            <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
          </button>
        </div>
      )}

      <div className="bg-white border-b border-slate-200 sticky top-16 z-30">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <button onClick={onBack} className="flex items-center text-slate-600 hover:text-[#2563eb] font-semibold transition-colors">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
            Voltar ao Catálogo
          </button>
          
          {isAdmin && (
            <button 
              onClick={() => setIsEditing(!isEditing)}
              className={`px-6 py-2 rounded-xl text-sm font-black transition-all ${isEditing ? 'bg-rose-50 text-rose-600 border border-rose-100' : 'bg-[#0f172a] text-white shadow-lg hover:bg-[#2563eb]'}`}
            >
              {isEditing ? 'CANCELAR EDIÇÃO' : 'EDITAR DOSSIÊ'}
            </button>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 mt-8 grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-8">
          <section className="bg-white rounded-[2.5rem] overflow-hidden shadow-sm border border-slate-200 group/hero">
            <div className="aspect-video w-full overflow-hidden bg-slate-100 relative">
              <img src={gallery[0] || clinic.imagem} alt={clinic.nome} className="w-full h-full object-cover" />
              
              {/* Botão Ampliar */}
              <button 
                onClick={() => setViewerIndex(0)}
                className="absolute inset-0 bg-black/20 opacity-0 group-hover/hero:opacity-100 transition-opacity flex items-center justify-center"
              >
                <div className="bg-white/90 backdrop-blur px-6 py-3 rounded-2xl flex items-center space-x-2 transform scale-90 group-hover/hero:scale-100 transition-transform duration-300 shadow-2xl">
                   <svg className="w-5 h-5 text-[#2563eb]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" /></svg>
                   <span className="text-xs font-black text-[#0f172a] uppercase tracking-widest">Ver em Tela Cheia</span>
                </div>
              </button>

              <div className="absolute bottom-6 left-6 bg-[#2563eb] text-white px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-xl pointer-events-none">
                {gallery.length} FOTOS DISPONÍVEIS
              </div>
            </div>
            <div className="p-10">
              {isEditing ? (
                <div className="space-y-6">
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Nome Comercial</label>
                    <input className="text-3xl font-black text-[#0f172a] w-full border-2 border-slate-100 p-4 rounded-2xl bg-white focus:border-[#2563eb] outline-none" value={editForm.nome} onChange={e => setEditForm({...editForm, nome: e.target.value})} />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <input className="w-full border-2 border-slate-100 p-4 rounded-2xl bg-white focus:border-[#2563eb] outline-none" value={editForm.cidade} onChange={e => setEditForm({...editForm, cidade: e.target.value})} />
                    <select className="w-full border-2 border-slate-100 p-4 rounded-2xl bg-white focus:border-[#2563eb] outline-none" value={editForm.estado} onChange={e => setEditForm({...editForm, estado: e.target.value})}>
                      {ESTADOS_BRASIL.map(uf => <option key={uf} value={uf}>{uf}</option>)}
                    </select>
                  </div>
                </div>
              ) : (
                <>
                  <h1 className="text-5xl font-black text-[#0f172a] mb-4 tracking-tight">{clinic.nome}</h1>
                  <p className="text-xl text-slate-500 font-medium flex items-center">
                    <svg className="w-6 h-6 mr-2 text-[#2563eb]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /></svg>
                    {clinic.localizacao}
                  </p>
                </>
              )}
            </div>
          </section>

          <section className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-slate-200">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-2xl font-black text-[#0f172a] tracking-tight">Galeria Detalhada</h3>
              {isEditing && (
                <label className="bg-[#2563eb] text-white px-6 py-3 rounded-xl text-xs font-black uppercase cursor-pointer hover:bg-[#1d4ed8] transition-all">
                  ADICIONAR FOTO
                  <input type="file" accept="image/*" className="hidden" onChange={handleFileGallery} />
                </label>
              )}
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {gallery.map((img, idx) => (
                <div 
                  key={idx} 
                  className="aspect-square rounded-3xl overflow-hidden border-2 border-slate-100 group relative shadow-sm hover:border-blue-200 transition-all cursor-pointer"
                  onClick={() => setViewerIndex(idx)}
                >
                  <img src={img} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={`Miniatura ${idx}`} />
                  <div className="absolute inset-0 bg-blue-600/0 group-hover:bg-blue-600/20 transition-colors flex items-center justify-center">
                     <svg className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                  </div>
                  {isEditing && (
                    <button 
                      onClick={(e) => { e.stopPropagation(); removePhoto(idx); }}
                      className="absolute top-3 right-3 bg-rose-500 text-white p-2 rounded-full shadow-xl opacity-0 group-hover:opacity-100 transition-opacity z-10"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                  )}
                </div>
              ))}
            </div>
          </section>

          <section className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-slate-200">
            <h3 className="text-2xl font-black text-[#0f172a] mb-8 pb-4 border-b-2 border-blue-50">Análise do Rei</h3>
            {isEditing ? (
              <textarea 
                className="w-full p-6 rounded-2xl border-2 border-slate-100 bg-white focus:border-[#2563eb] outline-none text-slate-600 leading-relaxed font-medium"
                rows={8}
                value={editForm.descricao}
                onChange={e => setEditForm({...editForm, descricao: e.target.value})}
              />
            ) : (
              <div className="text-slate-600 leading-relaxed text-lg font-medium whitespace-pre-line">
                {clinic.descricao}
              </div>
            )}
          </section>
        </div>

        <div className="space-y-8">
          <div className="bg-white p-10 rounded-[2.5rem] shadow-2xl border-4 border-[#2563eb] sticky top-36">
            <h4 className="text-[10px] font-black text-[#2563eb] uppercase tracking-[0.2em] mb-8">DADOS FINANCEIROS</h4>
            <div className="space-y-8">
              <div className="bg-blue-50/30 p-8 rounded-3xl border border-blue-100">
                <p className="text-blue-400 text-[10px] font-black uppercase mb-2">Valor de Venda</p>
                {isEditing ? (
                  <div className="flex items-center bg-white border-2 border-blue-100 rounded-xl px-4 py-2">
                    <span className="font-black text-blue-300 mr-2">R$</span>
                    <input className="text-2xl font-black text-[#2563eb] w-full outline-none bg-transparent" value={editForm.precoFormatado} onChange={e => handleCurrencyInput('precoFormatado', e.target.value)} />
                  </div>
                ) : (
                  <p className="text-4xl font-black text-[#2563eb]">R$ {formatCurrency(clinic.preco)}</p>
                )}
              </div>
              <div className="p-8 rounded-3xl border-2 border-slate-50 space-y-6">
                <div>
                  <p className="text-slate-400 text-[10px] font-black uppercase mb-2">Faturamento / Mês</p>
                  {isEditing ? (
                    <div className="flex items-center bg-white border-2 border-slate-100 rounded-xl px-4 py-2">
                       <span className="font-black text-slate-300 mr-2">R$</span>
                       <input className="text-xl font-black text-[#2563eb] w-full outline-none bg-transparent" value={editForm.faturamentoFormatado} onChange={e => handleCurrencyInput('faturamentoFormatado', e.target.value)} />
                    </div>
                  ) : (
                    <p className="text-2xl font-black text-[#2563eb]">R$ {formatCurrency(clinic.faturamentoMensal)}</p>
                  )}
                </div>
                <div>
                  <p className="text-slate-400 text-[10px] font-black uppercase mb-1">EBITDA Estimado</p>
                  <p className="text-xl font-black text-emerald-500">~ 25% AA</p>
                </div>
              </div>
              {!isEditing && (
                <button 
                  onClick={() => {
                    const customMsg = encodeURIComponent(`Olá! Vi o Dossiê da clínica ${clinic.nome} no site e quero os detalhes financeiros.`);
                    window.open(`https://wa.me/55${CONTACT_WHATSAPP}?text=${customMsg}`, '_blank');
                  }} 
                  className="w-full bg-[#2563eb] text-white py-6 rounded-3xl font-black text-lg hover:bg-[#1d4ed8] hover:scale-[1.02] transition-all shadow-2xl flex items-center justify-center space-x-3"
                >
                  <span>SOLICITAR NEGOCIAÇÃO</span>
                </button>
              )}
              {isEditing && (
                <button onClick={handleSave} disabled={loading} className="w-full bg-[#0f172a] text-white py-6 rounded-3xl font-black text-lg hover:bg-[#2563eb] transition-all flex items-center justify-center shadow-xl disabled:opacity-50">
                  {loading ? 'SALVANDO...' : 'SALVAR NO SISTEMA'}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
