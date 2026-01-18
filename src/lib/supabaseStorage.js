import { supabase } from '@/lib/customSupabaseClient';

// --- Helper: Map DB columns (Turkish) to App properties (English) ---
const mapListingFromDB = (dbListing) => ({
  id: dbListing.id,
  title: dbListing.bayan,
  description: dbListing.aciklama,
  phone_number: dbListing.telefon,
  cover_photo_url: dbListing.resim_url,
  admin_approved: dbListing.onaylandi,
  height: dbListing.boy || '',
  weight: dbListing.kilo || '',
  condom: dbListing.kondom || false,
  photos: dbListing.resimler || [],
  created_at: dbListing.created_at,
  // Extra fields that might be useful
  city: dbListing.sehir,
  age: dbListing.yas,
  services: dbListing.hizmetler,
  price: dbListing.fiyat
});

const mapListingToDB = (appListing) => ({
  bayan: appListing.title,
  aciklama: appListing.description,
  telefon: appListing.phone_number,
  resim_url: appListing.cover_photo_url,
  onaylandi: appListing.admin_approved,
  boy: appListing.height,
  kilo: appListing.weight,
  kondom: appListing.condom,
  resimler: appListing.photos,
  // Default/Optional
  sehir: appListing.city || 'Elazığ',
  updated_at: new Date().toISOString()
});

// --- Settings ---
export const getSettings = async () => {
  const DEFAULT_LINK = 'https://t.me/elazigescort_admin';
  const DEFAULT_USERNAME = 'elazigescort_admin';

  try {
    // 1. Try fetching from Supabase
    const { data, error } = await supabase
      .from('settings')
      .select('*')
      .limit(1)
      .maybeSingle();

    // If successful, return DB data and cache it
    if (!error && data) {
      const username = data.telegram_username || DEFAULT_USERNAME;
      const link = username.startsWith('http') 
        ? username 
        : `https://t.me/${username.replace('@', '')}`;
      
      // Cache to localStorage for fallback
      localStorage.setItem('site_settings_telegram', link);
      return { telegram_link: link, raw_username: username };
    }

    // 2. If DB fails or is empty, try LocalStorage fallback
    console.warn('Settings table empty or not found, checking localStorage fallback.');
    const localLink = localStorage.getItem('site_settings_telegram');
    if (localLink) {
      return { telegram_link: localLink, raw_username: localLink };
    }

    // 3. Final fallback to hardcoded default
    return { telegram_link: DEFAULT_LINK, raw_username: DEFAULT_USERNAME };

  } catch (error) {
    console.error('Error fetching settings (using fallback):', error);
    const localLink = localStorage.getItem('site_settings_telegram');
    return { 
      telegram_link: localLink || DEFAULT_LINK, 
      raw_username: localLink || DEFAULT_USERNAME 
    };
  }
};

export const updateSettings = async (settingsData) => {
  try {
    // 1. Always save to localStorage first (immediate fallback)
    localStorage.setItem('site_settings_telegram', settingsData.telegram_link);

    // Extract username from link if necessary
    let username = settingsData.telegram_link;
    if (username.includes('t.me/')) {
      username = username.split('t.me/')[1].replace('/', '');
    }

    // 2. Try to update Supabase
    const { data: existing, error: fetchError } = await supabase.from('settings').select('id').limit(1);

    // If table doesn't exist, we consider it a "partial success" since we saved to localStorage
    if (fetchError) {
      console.warn("Settings table missing in DB, saved to localStorage only.");
      return { success: true, note: "Saved locally only (DB table missing)" };
    }

    let error;
    if (existing && existing.length > 0) {
      const { error: updateError } = await supabase
        .from('settings')
        .update({ telegram_username: username, updated_at: new Date().toISOString() })
        .eq('id', existing[0].id);
      error = updateError;
    } else {
      const { error: insertError } = await supabase
        .from('settings')
        .insert([{ telegram_username: username }]);
      error = insertError;
    }

    if (error) throw error;
    return { success: true };
  } catch (error) {
    console.error('Error updating settings:', error);
    // Return success because we at least saved it to localStorage
    return { success: true, note: "Saved locally only (DB Error)" };
  }
};

// --- Listings ---
export const getListings = async () => {
  try {
    const { data, error } = await supabase
      .from('listings')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data.map(mapListingFromDB);
  } catch (error) {
    console.error('Error fetching listings:', error);
    return [];
  }
};

export const getListing = async (id) => {
  try {
    const { data, error } = await supabase
      .from('listings')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return mapListingFromDB(data);
  } catch (error) {
    console.error('Error fetching listing:', error);
    return null;
  }
};

export const createListing = async (listingData) => {
  try {
    const dbData = mapListingToDB(listingData);
    const { data, error } = await supabase
      .from('listings')
      .insert([dbData])
      .select()
      .single();

    if (error) throw error;
    return { success: true, data: mapListingFromDB(data) };
  } catch (error) {
    console.error('Error creating listing:', error);
    return { success: false, error: error.message };
  }
};

export const updateListing = async (id, listingData) => {
  try {
    const dbData = mapListingToDB(listingData);
    const { data, error } = await supabase
      .from('listings')
      .update(dbData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return { success: true, data: mapListingFromDB(data) };
  } catch (error) {
    console.error('Error updating listing:', error);
    return { success: false, error: error.message };
  }
};

export const deleteListing = async (id) => {
  try {
    const { error } = await supabase
      .from('listings')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return { success: true };
  } catch (error) {
    console.error('Error deleting listing:', error);
    return { success: false, error: error.message };
  }
};

// --- Categories ---
export const getCategories = async () => {
  try {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
};

export const createCategory = async (categoryData) => {
  try {
    const { data, error } = await supabase
      .from('categories')
      .insert([categoryData])
      .select();
    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error('Error creating category:', error);
    return { success: false, error: error.message };
  }
};

export const updateCategory = async (id, categoryData) => {
  try {
    const { data, error } = await supabase
      .from('categories')
      .update(categoryData)
      .eq('id', id)
      .select();
    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error('Error updating category:', error);
    return { success: false, error: error.message };
  }
};

export const deleteCategory = async (id) => {
  try {
    const { error } = await supabase
      .from('categories')
      .delete()
      .eq('id', id);
    if (error) throw error;
    return { success: true };
  } catch (error) {
    console.error('Error deleting category:', error);
    return { success: false, error: error.message };
  }
};