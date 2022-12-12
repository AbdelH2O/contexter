import { createClient } from '@supabase/supabase-js'
import { env } from '../env/client.mjs';

// Create a single supabase client for interacting with your database
const supabase = createClient(
    env.NEXT_PUBLIC_SUPABASE_URL,
    env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
);

export default supabase;