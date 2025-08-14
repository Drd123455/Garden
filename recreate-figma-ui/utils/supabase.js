import { createClient } from '@supabase/supabase-js'

let supabaseClient = null

const getSupabaseClient = () => {
  // Only create client if it doesn't exist and we're in the browser
  if (!supabaseClient && typeof window !== 'undefined') {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    // Debug logging for production troubleshooting
    console.log('Supabase Config Check:', {
      hasUrl: !!supabaseUrl,
      hasKey: !!supabaseAnonKey,
      urlLength: supabaseUrl?.length || 0,
      keyLength: supabaseAnonKey?.length || 0,
      environment: process.env.NODE_ENV,
      isBrowser: typeof window !== 'undefined'
    })

    if (!supabaseUrl || !supabaseAnonKey) {
      const error = `Missing Supabase environment variables:
        NEXT_PUBLIC_SUPABASE_URL: ${supabaseUrl ? 'SET' : 'MISSING'}
        NEXT_PUBLIC_SUPABASE_ANON_KEY: ${supabaseAnonKey ? 'SET' : 'MISSING'}
        
        Please check your Vercel environment variables and redeploy.`
      console.error(error)
      throw new Error(error)
    }

    supabaseClient = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true
      }
    })
  }

  return supabaseClient
}

export default getSupabaseClient
