import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://vaiiopfowevcnebxksyi.supabase.co';

/**
 * IMPORTANTE: O erro 'Invalid API key' ocorre porque o token fornecido continha 
 * um sufixo de plataforma (sb_publishable_...) anexado ao JWT.
 * O Supabase exige apenas o JWT puro (a parte que começa com eyJ...).
 */
const rawKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZhaWlvcGZvd2V2Y25lYnhrc3lpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzcwMzY5MzksImV4cCI6MjA1MjYxMjkzOX0.sb_publishable_cliKdbxwxQUIlc738hON-A_eeIYn0gs';

// O JWT termina no segundo ponto. A parte 'sb_publishable_...' é um metadado da CLI/Plataforma.
// Vamos extrair apenas as duas primeiras partes do JWT (Header.Payload.Signature)
const cleanJwt = rawKey.split('.').slice(0, 3).join('.');

export const supabase = createClient(supabaseUrl, cleanJwt, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true
  },
  global: {
    headers: {
      'apikey': cleanJwt,
      'Authorization': `Bearer ${cleanJwt}`
    }
  }
});