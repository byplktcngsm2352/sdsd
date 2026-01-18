
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const ListingCard = ({ listing }) => {
  const navigate = useNavigate();

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
      onClick={() => navigate(`/listing/${listing.id}`)}
      className="relative aspect-[3/4] w-full rounded-2xl overflow-hidden cursor-pointer shadow-lg hover:shadow-2xl transition-shadow duration-200 group bg-gray-900 border border-gray-800"
    >
      <img
        src={listing.cover_photo_url}
        alt={listing.title}
        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        loading="lazy"
      />
      
      {/* Enhanced Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent opacity-90" />
      
      {/* Content Container */}
      <div className="absolute bottom-0 left-0 right-0 p-6 flex flex-col justify-end h-full pointer-events-none">
        <div className="space-y-2">
          {/* Title */}
          <h3 className="text-white text-2xl font-bold drop-shadow-lg leading-tight">
            {listing.title}
          </h3>
          
          {/* Optional: Add location or short badge if available in listing data, otherwise keep minimal */}
          {listing.location && (
             <span className="inline-block px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs font-medium text-white">
               {listing.location}
             </span>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default ListingCard;
