import { createClient } from "@supabase/supabase-js";
const supabaseURL='https://sjzqjdqfgrupsdtuiqso.supabase.co'
const myAPIkey='sb_publishable_GsxFoALvDzfhHBXnV1T-EA_S20mF3VG'
export const myDatabase=createClient(supabaseURL,myAPIkey)