import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://vaiiopfowevcnebxksyi.supabase.co';

// Graças à configuração do Vite, process.env.API_KEY será substituído pelo valor real
// no momento da construção do projeto.
const apiKey = process.env.API_KEY;

if (!apiKey) {
  console.error("ERRO CRÍTICO: API_KEY não encontrada. Verifique as variáveis de ambiente.");
}

export const supabase = createClient(supabaseUrl, apiKey || '');