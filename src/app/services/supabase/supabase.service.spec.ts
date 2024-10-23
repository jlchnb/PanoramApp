import { Injectable } from '@angular/core';
import { createClient } from '@supabase/supabase-js';

@Injectable({
  providedIn: 'root',
})
export class SupabaseService {
  private supabaseUrl = 'https://<your-supabase-url>';
  private supabaseKey = 'YOUR_ANON_KEY';
  public supabase = createClient(this.supabaseUrl, this.supabaseKey);

  constructor() {}
}
