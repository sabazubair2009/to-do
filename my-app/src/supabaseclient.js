import { createClient } from "@supabase/supabase-js";
const SUPABASE_URL=import.meta.env.VITE_SUPABASE_URL;
const MY_API_KEY=import.meta.env.VITE_MY_API_KEY;
export const myDatabase=createClient(SUPABASE_URL, MY_API_KEY)