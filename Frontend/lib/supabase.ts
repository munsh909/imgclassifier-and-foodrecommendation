import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://tnzvolsaeczczyekomox.supabase.co'
const supabaseAnonKey = 'yJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRuenZvbHNhZWN6Y3p5ZWtvbW94Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM1ODM3MDAsImV4cCI6MjA2OTE1OTcwMH0.AiGsSJui0ajWoFsgaTkQHkabR5CwnLiEAzIPURAdFME'

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
})