import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  console.log('🔧 Creating Supabase client...')
  
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  console.log('🔍 Environment variables check:', {
    url: supabaseUrl ? `${supabaseUrl.substring(0, 20)}...` : '❌ Missing',
    key: supabaseAnonKey ? `${supabaseAnonKey.substring(0, 20)}...` : '❌ Missing'
  })

  if (!supabaseUrl || !supabaseAnonKey) {
    console.error('❌ Missing Supabase environment variables!')
    throw new Error('Missing Supabase environment variables. Please check your .env.local file.')
  }

  console.log('✅ Environment variables found, creating client...')
  const client = createBrowserClient(supabaseUrl, supabaseAnonKey)
  console.log('✅ Supabase client created successfully')
  
  return client
}
