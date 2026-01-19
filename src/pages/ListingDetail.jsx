import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { ArrowLeft, ChevronLeft, ChevronRight, MessageCircle, Phone } from 'lucide-react';
import { getListing } from '@/lib/supabaseStorage';
import { Button } from '@/components/ui/button';
import Footer from '@/components/Footer';
import { getCanonicalUrl } from '@/lib/seoUtils';

const ListingDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [listing, setListing] = useState(null);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);

  useEffect(() => {
    const fetchListing = async () => {
      try {
        const data = await getListing(id);
        setListing(data);
      } catch (error) {
        console.error("Failed to fetch listing", error);
      } finally {
        setLoading(false);
      }
    };
    fetchListing();
  }, [id]);

  const minSwipeDistance = 50;

  const onTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe && listing?.photos) {
      nextPhoto();
    }
    if (isRightSwipe && listing?.photos) {
      prevPhoto();
    }
  };

  const nextPhoto = () => {
    if (listing?.photos) {
      setCurrentPhotoIndex((prev) => 
        prev === listing.photos.length - 1 ? 0 : prev + 1
      );
    }
  };

  const prevPhoto = () => {
    if (listing?.photos) {
      setCurrentPhotoIndex((prev) => 
        prev === 0 ? listing.photos.length - 1 : prev - 1
      );
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-xl">Yükleniyor...</div>
      </div>
    );
  }

  if (!listing) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <p className="text-white text-xl mb-4">İlan bulunamadı</p>
          <Button onClick={() => navigate('/')} variant="outline">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Ana Sayfaya Dön
          </Button>
        </div>
      </div>
    );
  }

  // Generate dynamic metadata values
  const pageTitle = "Elazığ Kaliteli Escort Elazığ'daki Gerçek Escortlarla Burda Tanışabilir Görüşüp Unutulmayacak Bir Gece Yaşayabilirsiniz.";
  const pageDescription = "Elazığ Kaliteli Escort Elazığ'daki Gerçek Escortlarla Burda Tanışabilir Görüşüp Unutulmayacak Bir Gece Yaşayabilirsiniz.";
  
  const canonicalUrl = getCanonicalUrl(`listing/${listing.id}`);

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": listing.title,
    "description": listing.description,
    "provider": {
      "@type": "Person",
      "name": listing.title,
      "telephone": listing.phone_number,
      "image": listing.cover_photo_url
    },
    "areaServed": {
      "@type": "City",
      "name": location
    },
    "serviceType": "Escort Service",
    "offers": {
      "@type": "Offer",
      "availability": "https://schema.org/InStock"
    }
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
        <meta property="og:image" content={listing.cover_photo_url} />
        <meta property="og:type" content="profile" />
        <meta property="og:url" content={canonicalUrl} />
        
        <script type="application/ld+json">
          {JSON.stringify(serviceSchema)}
        </script>
      </Helmet>

      <div className="container mx-auto px-4 py-8 max-w-4xl flex-grow">
        <Button 
          onClick={() => navigate('/')} 
          variant="ghost" 
          className="mb-6 text-white hover:text-pink-400"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Geri Dön
        </Button>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-900 rounded-xl overflow-hidden shadow-2xl"
        >
          {/* Photo Gallery */}
          <div className="relative h-96 md:h-[600px] bg-gray-800">
            <div
              onTouchStart={onTouchStart}
              onTouchMove={onTouchMove}
              onTouchEnd={onTouchEnd}
              className="w-full h-full"
            >
              <img
                src={listing.photos?.[currentPhotoIndex] || listing.cover_photo_url}
                alt={`${listing.title} - Photo ${currentPhotoIndex + 1}`}
                className="w-full h-full object-cover"
              />
            </div>

            {listing.photos && listing.photos.length > 1 && (
              <>
                <button
                  onClick={prevPhoto}
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-all duration-200"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                  onClick={nextPhoto}
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-all duration-200"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>

                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                  {listing.photos.map((_, index) => (
                    <div
                      key={index}
                      className={`w-2 h-2 rounded-full transition-all duration-200 ${
                        index === currentPhotoIndex ? 'bg-white w-6' : 'bg-white/50'
                      }`}
                    />
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Details */}
          <div className="p-6 md:p-8">
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
              {listing.title}
            </h1>
            
            {/* Display Phone Number */}
            <div className="mb-6 flex items-center gap-3 text-lg md:text-xl font-medium text-pink-400">
              <Phone className="w-6 h-6" />
              <span>{listing.phone_number}</span>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-gray-800 p-4 rounded-lg">
                <p className="text-gray-400 text-sm">Boy</p>
                <p className="text-white font-semibold">{listing.height}</p>
              </div>
              <div className="bg-gray-800 p-4 rounded-lg">
                <p className="text-gray-400 text-sm">Kilo</p>
                <p className="text-white font-semibold">{listing.weight}</p>
              </div>
              <div className="bg-gray-800 p-4 rounded-lg col-span-2">
                <p className="text-gray-400 text-sm">Kondom</p>
                <p className="text-white font-semibold">
                  {listing.condom ? 'Gerek Var' : 'Gerek Yok'}
                </p>
              </div>
            </div>

            <div className="mb-6">
              <h2 className="text-xl font-semibold text-white mb-3">Açıklama</h2>
              <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">
                {listing.description}
              </p>
            </div>

            {/* Action Buttons: Call and WhatsApp */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Button
                onClick={() => window.open(`tel:${listing.phone_number}`, '_self')}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-6 text-lg"
              >
                <Phone className="w-5 h-5 mr-2" />
                Telefon Ara
              </Button>
              <Button
                onClick={() => {
                  const message = encodeURIComponent('Selam Elazığhub sitesinde ilanını gördüm seninle görüşmek istiyorum şartların nelerdir');
                  window.open(`https://wa.me/${listing.phone_number}?text=${message}`, '_blank');
                }}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-6 text-lg"
              >
                <MessageCircle className="w-5 h-5 mr-2" />
                WhatsApp ile İletişime Geç
              </Button>
            </div>
          </div>
        </motion.div>
      </div>

      <Footer />
    </div>
  );
};

export default ListingDetail;