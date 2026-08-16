import { createClient } from "@supabase/supabase-js";
const SUPABASE_URL=import.meta.env.VITE_SUPABASE_URL;
const MY_API_KEY=import.meta.env.VITE_MY_API_KEY;

// console.log("SUPABASE URL:", supabaseURL);
// console.log("SUPABASE KEY:", myAPIkey);



export const myDatabase=createClient(supabaseURL, myAPIkey)