import { createClient } from '@supabase/supabase-js'

// Use anon key for local testing
const supabaseUrl = 'https://cgtlikaqzbamslwgcxlj.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNndGxpa2FxemJhbXNsd2djeGxqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODAyMzQ1MzQsImV4cCI6MjA5NTgxMDUzNH0.3udipH2tOhpw-5y_XIMml2vKj2hg2NdVaHar98s56jI'

export const supabaseAdmin = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

console.log('✅ Supabase client initialized with anon key')