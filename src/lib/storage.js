
// localStorage-based data storage for listings
// This simulates Supabase operations and will be migrated to Supabase later

const LISTINGS_KEY = 'listings';
const ADMIN_CREDENTIALS = {
  username: 'kirve2323',
  password: 'kirve190523'
};

// Generate UUID
const generateId = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
};

// Get all listings
export const getListings = () => {
  try {
    const listings = localStorage.getItem(LISTINGS_KEY);
    return listings ? JSON.parse(listings) : [];
  } catch (error) {
    console.error('Error getting listings:', error);
    return [];
  }
};

// Get single listing by ID
export const getListing = (id) => {
  const listings = getListings();
  return listings.find(listing => listing.id === id);
};

// Create listing
export const createListing = (listingData) => {
  try {
    const listings = getListings();
    const newListing = {
      ...listingData,
      id: generateId(),
      created_at: new Date().toISOString()
    };
    listings.push(newListing);
    localStorage.setItem(LISTINGS_KEY, JSON.stringify(listings));
    return { success: true, data: newListing };
  } catch (error) {
    console.error('Error creating listing:', error);
    return { success: false, error: error.message };
  }
};

// Update listing
export const updateListing = (id, listingData) => {
  try {
    const listings = getListings();
    const index = listings.findIndex(listing => listing.id === id);
    if (index === -1) {
      return { success: false, error: 'Listing not found' };
    }
    listings[index] = {
      ...listings[index],
      ...listingData,
      id,
      created_at: listings[index].created_at
    };
    localStorage.setItem(LISTINGS_KEY, JSON.stringify(listings));
    return { success: true, data: listings[index] };
  } catch (error) {
    console.error('Error updating listing:', error);
    return { success: false, error: error.message };
  }
};

// Delete listing
export const deleteListing = (id) => {
  try {
    const listings = getListings();
    const filtered = listings.filter(listing => listing.id !== id);
    localStorage.setItem(LISTINGS_KEY, JSON.stringify(filtered));
    return { success: true };
  } catch (error) {
    console.error('Error deleting listing:', error);
    return { success: false, error: error.message };
  }
};

// Validate admin credentials
export const validateAdminCredentials = (username, password) => {
  return username === ADMIN_CREDENTIALS.username && 
         password === ADMIN_CREDENTIALS.password;
};

// Initialize with example listing
export const initializeExampleData = () => {
  const listings = getListings();
  if (listings.length === 0) {
    const exampleListing = {
      id: generateId(),
      title: 'Ayşe - VIP Eskort',
      description: 'Merhabalar, ben Ayşe. 25 yaşındayım ve profesyonel eskort hizmeti sunuyorum. Temiz, bakımlı ve güler yüzlü biriyim. Sadece ciddi ve saygılı müşterilerle görüşüyorum.',
      height: '170 cm',
      weight: '55 kg',
      condom: true,
      cover_photo_url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=600&fit=crop',
      photos: [
        'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=800&h=1200&fit=crop',
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&h=1200&fit=crop',
        'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=800&h=1200&fit=crop'
      ],
      phone_number: '905551234567',
      admin_approved: true,
      telegram_link: 'https://t.me/example_contact',
      created_at: new Date().toISOString()
    };
    localStorage.setItem(LISTINGS_KEY, JSON.stringify([exampleListing]));
  }
};
