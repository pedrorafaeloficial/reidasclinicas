
import { createClient } from '@supabase/supabase-js';

// URL e Chave Pública Anon do seu projeto Supabase
const supabaseUrl = 'https://vaiiopfowevcnebxksyi.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZhaWlvcGZvd2V2Y25lYnhrc3lpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzcwMzY5MzksImV4cCI6MjA1MjYxMjkzOX0.sb_publishable_cliKdbxwxQUIlc738hON-A_eeIYn0gs';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  }
});
