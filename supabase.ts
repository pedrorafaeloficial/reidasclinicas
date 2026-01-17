
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://vaiiopfowevcnebxksyi.supabase.co';
const supabaseAnonKey = 'sb_publishable_cliKdbxwxQUIlc738hON-A_eeIYn0gs';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
