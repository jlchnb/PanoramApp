import { Injectable } from '@angular/core';
import { createClient } from '@supabase/supabase-js';

@Injectable({
  providedIn: 'root',
})
export class SupabaseService {
  private supabaseUrl = 'https://<your-supabase-url>'; // Reemplaza con tu URL de Supabase
  private supabaseKey = 'YOUR_ANON_KEY'; // Reemplaza con tu clave anónima
  public supabase = createClient(this.supabaseUrl, this.supabaseKey);

  constructor() {}
}
