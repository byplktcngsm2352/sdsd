import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://xtizutucwdcjgyojmupw.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh0aXp1dHVjd2Rjamd5b2ptdXB3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg1ODMwNDMsImV4cCI6MjA4NDE1OTA0M30.96ycRYF24pWK0inBqx2Kq2aWmTqpzti-xU5U8xcsTko';

const customSupabaseClient = createClient(supabaseUrl, supabaseAnonKey);

export default customSupabaseClient;

export { 
    customSupabaseClient,
    customSupabaseClient as supabase,
};
