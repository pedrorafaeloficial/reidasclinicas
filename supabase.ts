import { createClient } from '@supabase/supabase-js';

// No ambiente de execução do navegador/frontend, as variáveis costumam vir de process.env ou import.meta.env
// Usamos a lógica de fallback para garantir que a chave seja capturada de qualquer uma das fontes injetadas.
const supabaseUrl = 'https://vaiiopfowevcnebxksyi.supabase.co';
const supabaseKey = (typeof process !== 'undefined' ? (process.env.SUPABASE_ANON_KEY || process.env.API_KEY) : '') || '';

if (!supabaseKey) {
  console.error("Supabase Error: Chave de API não encontrada. Verifique as variáveis de ambiente.");
}

export const supabase = createClient(supabaseUrl, supabaseKey);