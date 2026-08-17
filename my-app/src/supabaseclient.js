import { createClient } from "@supabase/supabase-js";
const supabaseURL=import.meta.env.VITE_SUPABASE_URL;
const myAPIkey=import.meta.env.VITE_MY_API_KEY;




export const myDatabase=createClient(supabaseURL, myAPIkey)