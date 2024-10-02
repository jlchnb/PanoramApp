import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://cahknhdjedgxbphjdjce.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNhaGtuaGRqZWRneGJwaGpkamNlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjcyMTgxNDUsImV4cCI6MjA0Mjc5NDE0NX0.vaZoOCadVVS_JhPHGSAfrX4Fr3yM529mfAzRcgKUAcs'; // Asegúrate de que esta sea la clave correcta

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
