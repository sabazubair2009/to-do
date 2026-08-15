import { createClient } from "@supabase/supabase-js";
const supabaseURL=import.meta.env.VITE_SUPABASE_URL;
const myAPIkey=import.meta.env.VITE_MY_API_KEY;

// console.log("SUPABASE URL:", supabaseURL);
// console.log("SUPABASE KEY:", myAPIkey);



export const myDatabase=createClient(supabaseURL, myAPIkey)