
import { createClient } from '@supabase/supabase-js'
import env from 'dotenv'
env.config()
const supabaseUrl = 'https://ldwdsywvchkzpypopuex.supabase.co'
const supabaseKey = process.env.SUPABASE_KEY
const supabase = createClient(supabaseUrl, supabaseKey)
export default supabase