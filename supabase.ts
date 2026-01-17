import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://vaiiopfowevcnebxksyi.supabase.co';

/**
 * IMPORTANTE: Para o Supabase-js funcionar corretamente, a chave ANON deve ser o JWT puro.
 * Chaves que começam com 'sb_publishable_...' são identificadores de plataforma e causam erro 401.
 */
const rawKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZhaWlvcGZvd2V2Y25lYnhrc3lpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzcwMzY5MzksImV4cCI6MjA1MjYxMjkzOX0.sb_publishable_cliKdbxwxQUIlc738hON-A_eeIYn0gs';

// Extrai apenas a parte JWT (que geralmente começa com eyJ e termina antes do prefixo de plataforma)
const cleanKey = rawKey.includes('sb_publishable_') 
  ? rawKey.split('sb_publishable_')[0].trim() || rawKey // Tenta pegar o JWT antes do prefixo se colado
  : rawKey;

// Se a extração simples falhar, garantimos que pegamos a parte JWT correta
const finalKey = cleanKey.startsWith('eyJ') ? cleanKey : rawKey.split('sb_publishable_').pop()?.trim() || rawKey;

// Em última instância, o token fornecido pelo usuário tem o JWT no início.
// O token correto é: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZhaWlvcGZvd2V2Y25lYnhrc3lpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzcwMzY5MzksImV4cCI6MjA1MjYxMjkzOX0
const jwtOnly = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZhaWlvcGZvd2V2Y25lYnhrc3lpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzcwMzY5MzksImV4cCI6MjA1MjYxMjkzOX0';

export const supabase = createClient(supabaseUrl, jwtOnly, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true
  },
  global: {
    headers: {
      'apikey': jwtOnly,
      'Authorization': `Bearer ${jwtOnly}`
    }
  }
});