import { createClient } from "@supabase/supabase-js";
import { getEnvVar } from "./env";

const SUPABASE_URL = getEnvVar("SUPABASE_URL");
const SUPABASE_ANON_KEY = getEnvVar("SUPABASE_ANON_KEY");

// Create a Supabase client instance using the environment variables
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export default supabase;
