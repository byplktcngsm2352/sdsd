import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { MessageCircle } from 'lucide-react';
import ListingCard from '@/components/ListingCard';
import Footer from '@/components/Footer';
import { getListings, getSettings } from '@/lib/supabaseStorage';
import { getCanonicalUrl } from '@/lib/seoUtils';

const HomePage = () => {
  const [adminApprovedListings, setAdminApprovedListings] = useState([]);
  const [normalListings, setNormalListings] = useState([]);
  const [telegramLink, setTelegramLink] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [allListings, settings] = await Promise.all([
          getListings(),
          getSettings()
        ]);
        
        const approved = allListings.filter(listing => listing.admin_approved);
        const normal = allListings.filter(listing => !listing.admin_approved);
        
        setAdminApprovedListings(approved);
        setNormalListings(normal);
        setTelegramLink(settings.telegram_link);
      } catch (error) {
        console.error("Error loading homepage data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleCTAClick = () => {
    if (telegramLink) {
      window.open(telegramLink, '_blank');
    } else {
      window.open('https://t.me/elazigescort_admin', '_blank');
    }
  };

  const CTAButton = () => (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={handleCTAClick}
      className="w-full max-w-md mx-auto bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white font-bold py-4 px-8 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-200 flex items-center justify-center gap-2"
    >
      <MessageCircle className="w-6 h-6" />
      İlan vermek için tıklayınız
    </motion.button>
  );

  const pageTitle = "Elazığ Kaliteli Escort Elazığ'daki Gerçek Escortlarla Burda Tanışabilir Görüşüp Unutulmayacak Bir Gece Yaşayabilirsiniz.";
  const pageDescription = "Elazığ Kaliteli Escort Elazığ'daki Gerçek Escortlarla Burda Tanışabilir Görüşüp Unutulmayacak Bir Gece Yaşayabilirsiniz.";
  const canonicalUrl = getCanonicalUrl('/');

  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": "Elazığ Escort Platformu",
    "description": pageDescription,
    "url": canonicalUrl,
    "areaServed": [
      { "@type": "City", "name": "Merkez" },
      { "@type": "City", "name": "Kovancılar" },
      { "@type": "City", "name": "Karakoçan" },
      { "@type": "City", "name": "Baskil" },
      { "@type": "City", "name": "Ağın" },
      { "@type": "City", "name": "Palü" },
      { "@type": "City", "name": "Elazığ" }
    ]
  };

  return (
    <div className="min-h-screen bg-black flex flex-col">
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
        <meta name="keywords" content="Elazığ escort, Elazığ kaliteli escort, gerçek escort, Elazığ escort bayan, escort Elazığ" />
        <link rel="canonical" href={canonicalUrl} />
        
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDescription} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={canonicalUrl} />
        
        <script type="application/ld+json">
          {JSON.stringify(localBusinessSchema)}
        </script>
      </Helmet>

      <div className="container mx-auto px-4 py-12 flex-grow">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-purple-500 to-rose-500 mb-6 tracking-tight">
            Elazığ Escort
          </h1>
          <p className="text-gray-400 max-w-2xl mx-auto mb-8 text-lg">
            Admin Onaylı İlanlar Görüşülüp Onaylanan ilanlardir. Sitemizde dolandırıcıya Yer Yok
          </p>
          <CTAButton />
        </div>

        {isLoading ? (
          <div className="text-center text-gray-400 py-12">Yükleniyor...</div>
        ) : (
          <>
            {/* Admin Approved Section */}
            <section className="mb-16">
              <motion.h2
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-3xl font-bold text-white border-l-4 border-pink-500 pl-4 mb-8"
              >
                Admin Onaylı <span className="text-pink-500">Escortlar</span>
              </motion.h2>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-6">
                {adminApprovedListings.map((listing, index) => (
                  <motion.div
                    key={listing.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <ListingCard listing={listing} />
                  </motion.div>
                ))}
              </div>

              {adminApprovedListings.length === 0 && (
                <p className="text-gray-400 text-center py-8">
                  Henüz onaylanmış ilan bulunmamaktadır.
                </p>
              )}
            </section>

            {/* Normal Listings Section */}
            <section>
              <motion.h2
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-3xl font-bold text-gray-300 border-l-4 border-gray-600 pl-4 mb-8"
              >
                Normal Vitrin
              </motion.h2>

              <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-2 gap-4 md:gap-8">
                {normalListings.map((listing, index) => (
                  <motion.div
                    key={listing.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <ListingCard listing={listing} />
                  </motion.div>
                ))}
              </div>

              {normalListings.length === 0 && (
                <p className="text-gray-400 text-center py-8">
                  Henüz normal ilan bulunmamaktadır.
                </p>
              )}

              <div className="mt-12">
                <CTAButton />
              </div>
            </section>
          </>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default HomePage;