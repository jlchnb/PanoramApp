// src/app/services/supabase.ts

import { createClient } from '@supabase/supabase-js';

// Reemplaza con tu URL y clave anónima
const supabaseUrl = 'https://cahknhdjedgxbphjdjce.supabase.co'; // Tu URL de Supabase
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'; // Tu clave anónima

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
