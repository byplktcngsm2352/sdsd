import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, Upload, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { createListing, updateListing } from '@/lib/supabaseStorage';

const ListingForm = ({ listing, onClose }) => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    height: '',
    weight: '',
    condom: false,
    cover_photo_url: '',
    photos: [],
    phone_number: '',
    admin_approved: false
  });

  useEffect(() => {
    if (listing) {
      setFormData(listing);
    }
  }, [listing]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    // Validate phone number: only digits allowed
    if (name === 'phone_number') {
      const numericValue = value.replace(/\D/g, '');
      setFormData(prev => ({ ...prev, [name]: numericValue }));
      return;
    }

    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleFileUpload = (e, field) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (field === 'cover_photo_url') {
          setFormData(prev => ({ ...prev, cover_photo_url: reader.result }));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleMultipleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    const readers = files.map(file => {
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.readAsDataURL(file);
      });
    });

    Promise.all(readers).then(results => {
      setFormData(prev => ({
        ...prev,
        photos: [...prev.photos, ...results]
      }));
    });
  };

  const removePhoto = (index) => {
    setFormData(prev => ({
      ...prev,
      photos: prev.photos.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title || !formData.description || !formData.phone_number) {
      toast({
        title: 'Hata!',
        description: 'Lütfen zorunlu alanları doldurun.',
        variant: 'destructive',
      });
      return;
    }

    if (formData.phone_number.length < 10) {
      toast({
        title: 'Hata!',
        description: 'Telefon numarası en az 10 haneli olmalıdır.',
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);
    let result;

    if (listing) {
      result = await updateListing(listing.id, formData);
    } else {
      result = await createListing(formData);
    }

    setIsSubmitting(false);

    if (result.success) {
      toast({
        title: 'Başarılı!',
        description: listing ? 'İlan güncellendi.' : 'Yeni ilan oluşturuldu.',
      });
      onClose();
    } else {
      toast({
        title: 'Hata!',
        description: 'İşlem sırasında bir hata oluştu: ' + result.error,
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50 overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-gray-900 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-gray-800"
      >
        <div className="sticky top-0 bg-gray-900 border-b border-gray-800 p-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-white">
            {listing ? 'İlanı Düzenle' : 'Yeni İlan Oluştur'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <label className="block text-gray-300 mb-2 font-medium">
              Başlık <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full bg-gray-800 text-white border border-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-pink-500"
              required
            />
          </div>

          <div>
            <label className="block text-gray-300 mb-2 font-medium">
              Açıklama <span className="text-red-500">*</span>
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="4"
              className="w-full bg-gray-800 text-white border border-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-pink-500"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-300 mb-2 font-medium">Boy</label>
              <input
                type="text"
                name="height"
                value={formData.height}
                onChange={handleChange}
                placeholder="örn: 170 cm"
                className="w-full bg-gray-800 text-white border border-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-pink-500"
              />
            </div>
            <div>
              <label className="block text-gray-300 mb-2 font-medium">Kilo</label>
              <input
                type="text"
                name="weight"
                value={formData.weight}
                onChange={handleChange}
                placeholder="örn: 55 kg"
                className="w-full bg-gray-800 text-white border border-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-pink-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-gray-300 mb-2 font-medium">
              Telefon Numarası <span className="text-red-500">*</span>
              <span className="text-xs text-gray-500 ml-2">(Sadece rakam)</span>
            </label>
            <input
              type="text"
              name="phone_number"
              value={formData.phone_number}
              onChange={handleChange}
              placeholder="905551234567"
              className="w-full bg-gray-800 text-white border border-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-pink-500"
              required
            />
          </div>

          <div>
            <label className="block text-gray-300 mb-2 font-medium">
              Kapak Fotoğrafı
            </label>
            <div className="flex items-center gap-4">
              <label className="flex-1 bg-gray-800 border-2 border-dashed border-gray-700 rounded-lg p-4 text-center cursor-pointer hover:border-pink-500 transition-colors">
                <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                <span className="text-gray-400 text-sm">Fotoğraf Yükle</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileUpload(e, 'cover_photo_url')}
                  className="hidden"
                />
              </label>
              {formData.cover_photo_url && (
                <img
                  src={formData.cover_photo_url}
                  alt="Cover preview"
                  className="w-24 h-24 object-cover rounded-lg"
                />
              )}
            </div>
          </div>

          <div>
            <label className="block text-gray-300 mb-2 font-medium">
              Ek Fotoğraflar
            </label>
            <label className="bg-gray-800 border-2 border-dashed border-gray-700 rounded-lg p-4 text-center cursor-pointer hover:border-pink-500 transition-colors block">
              <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
              <span className="text-gray-400 text-sm">Birden fazla fotoğraf yükle</span>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleMultipleFileUpload}
                className="hidden"
              />
            </label>
            {formData.photos && formData.photos.length > 0 && (
              <div className="grid grid-cols-4 gap-2 mt-4">
                {formData.photos.map((photo, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={photo}
                      alt={`Photo ${index + 1}`}
                      className="w-full h-24 object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => removePhoto(index)}
                      className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex items-center gap-6">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                name="condom"
                checked={formData.condom}
                onChange={handleChange}
                className="w-5 h-5 rounded border-gray-700 text-pink-500 focus:ring-pink-500"
              />
              <span className="text-gray-300">Kondom Gerekli</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                name="admin_approved"
                checked={formData.admin_approved}
                onChange={handleChange}
                className="w-5 h-5 rounded border-gray-700 text-pink-500 focus:ring-pink-500"
              />
              <span className="text-gray-300">Admin Onaylı</span>
            </label>
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  İşleniyor...
                </>
              ) : (
                listing ? 'Güncelle' : 'Oluştur'
              )}
            </Button>
            <Button
              type="button"
              onClick={onClose}
              variant="outline"
              disabled={isSubmitting}
              className="flex-1 border-gray-700"
            >
              İptal
            </Button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default ListingForm;