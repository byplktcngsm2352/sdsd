import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Plus, Edit, Trash2, LogOut, Search, CheckCircle, XCircle, Save, Settings } from 'lucide-react';
import { useAdminAuth } from '@/contexts/AdminAuthContext';
import { useNavigate } from 'react-router-dom';
import { getListings, deleteListing, getSettings, updateSettings } from '@/lib/supabaseStorage';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import ListingForm from '@/components/admin/ListingForm';
import { getCanonicalUrl } from '@/lib/seoUtils';

const AdminDashboard = () => {
  const [listings, setListings] = useState([]);
  const [filteredListings, setFilteredListings] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingListing, setEditingListing] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Settings State
  const [telegramLink, setTelegramLink] = useState('');
  
  const { logout } = useAdminAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const loadData = async () => {
    setIsLoading(true);
    try {
      // Load Listings
      const data = await getListings();
      setListings(data);
      setFilteredListings(data);

      // Load Settings (now robust against missing table)
      const settings = await getSettings();
      setTelegramLink(settings.telegram_link || '');
    } catch (error) {
      console.error("Dashboard load error:", error);
      toast({
        title: 'Hata',
        description: 'Veriler yüklenirken bir sorun oluştu.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredListings(listings);
    } else {
      const filtered = listings.filter(listing =>
        listing.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredListings(filtered);
    }
  }, [searchQuery, listings]);

  const handleSettingsSave = async () => {
    if (!telegramLink) {
      toast({
        title: 'Uyarı',
        description: 'Telegram linki boş olamaz.',
        variant: 'destructive',
      });
      return;
    }

    const result = await updateSettings({ telegram_link: telegramLink });
    if (result.success) {
      toast({
        title: 'Başarılı!',
        description: result.note ? `Ayarlar kaydedildi (${result.note})` : 'Ayarlar güncellendi.',
      });
    } else {
      toast({
        title: 'Hata!',
        description: 'Ayarlar güncellenirken bir hata oluştu: ' + result.error,
        variant: 'destructive',
      });
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Bu ilanı silmek istediğinizden emin misiniz?')) {
      const result = await deleteListing(id);
      if (result.success) {
        toast({
          title: 'Başarılı!',
          description: 'İlan başarıyla silindi.',
        });
        loadData();
      } else {
        toast({
          title: 'Hata!',
          description: 'İlan silinirken bir hata oluştu.',
          variant: 'destructive',
        });
      }
    }
  };

  const handleEdit = (listing) => {
    setEditingListing(listing);
    setShowForm(true);
  };

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
    toast({
      title: 'Çıkış Yapıldı',
      description: 'Başarıyla çıkış yaptınız.',
    });
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingListing(null);
    loadData();
  };

  const pageTitle = "Elazığ Kaliteli Escort Elazığ'daki Gerçek Escortlarla Burda Tanışabilir Görüşüp Unutulmayacak Bir Gece Yaşayabilirsiniz.";
  const pageDescription = "Elazığ Kaliteli Escort Elazığ'daki Gerçek Escortlarla Burda Tanışabilir Görüşüp Unutulmayacak Bir Gece Yaşayabilirsiniz.";
  const canonicalUrl = getCanonicalUrl('admin/dashboard');

  return (
    <div className="min-h-screen bg-black pb-20">
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
        <meta name="robots" content="noindex, nofollow" />
        <link rel="canonical" href={canonicalUrl} />
      </Helmet>

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
          <h1 className="text-3xl font-bold text-white">Admin Paneli</h1>
          <div className="flex gap-3">
            <Button
              onClick={handleLogout}
              variant="outline"
              className="border-gray-700 text-gray-300 hover:text-white"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Çıkış
            </Button>
          </div>
        </div>

        {/* Global Settings Section */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Settings className="w-5 h-5 text-pink-500" />
            <h2 className="text-xl font-bold text-white">Genel Ayarlar</h2>
          </div>
          <div className="flex flex-col md:flex-row gap-4 items-end">
            <div className="flex-grow w-full">
              <label className="block text-gray-400 mb-2 text-sm font-medium">
                Telegram Linki (İlan Verme Butonu)
              </label>
              <input
                type="text"
                value={telegramLink}
                onChange={(e) => setTelegramLink(e.target.value)}
                placeholder="https://t.me/username"
                className="w-full bg-gray-800 text-white border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-pink-500"
              />
            </div>
            <Button
              onClick={handleSettingsSave}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              <Save className="w-4 h-4 mr-2" />
              Ayarları Kaydet
            </Button>
          </div>
        </div>

        {/* Listings Section */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
          <h2 className="text-xl font-bold text-white">İlanlar</h2>
          <Button
            onClick={() => setShowForm(true)}
            className="bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600"
          >
            <Plus className="w-4 h-4 mr-2" />
            Yeni İlan
          </Button>
        </div>

        {/* Search */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="İlan başlığına göre ara..."
              className="w-full bg-gray-900 text-white border border-gray-700 rounded-lg pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Listings Table */}
        <div className="bg-gray-900 rounded-xl overflow-hidden border border-gray-800">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-800 border-b border-gray-700">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Başlık</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Telefon</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Boy</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Kilo</th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-gray-300">Onaylı</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Tarih</th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-gray-300">İşlemler</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {isLoading ? (
                   <tr>
                     <td colSpan="7" className="px-6 py-8 text-center text-gray-400">
                       Yükleniyor...
                     </td>
                   </tr>
                ) : filteredListings.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="px-6 py-8 text-center text-gray-400">
                       {searchQuery ? 'Arama sonucu bulunamadı.' : 'Henüz ilan bulunmamaktadır.'}
                    </td>
                  </tr>
                ) : (
                  filteredListings.map((listing, index) => (
                    <motion.tr
                      key={listing.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="hover:bg-gray-800/50 transition-colors"
                    >
                      <td className="px-6 py-4 text-white">{listing.title}</td>
                      <td className="px-6 py-4 text-gray-300">{listing.phone_number}</td>
                      <td className="px-6 py-4 text-gray-300">{listing.height}</td>
                      <td className="px-6 py-4 text-gray-300">{listing.weight}</td>
                      <td className="px-6 py-4 text-center">
                        {listing.admin_approved ? (
                          <CheckCircle className="w-5 h-5 text-green-500 inline-block" />
                        ) : (
                          <XCircle className="w-5 h-5 text-gray-500 inline-block" />
                        )}
                      </td>
                      <td className="px-6 py-4 text-gray-300">
                        {new Date(listing.created_at).toLocaleDateString('tr-TR')}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center gap-2">
                          <Button
                            onClick={() => handleEdit(listing)}
                            size="sm"
                            variant="ghost"
                            className="text-blue-400 hover:text-blue-300 hover:bg-blue-900/20"
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            onClick={() => handleDelete(listing.id)}
                            size="sm"
                            variant="ghost"
                            className="text-red-400 hover:text-red-300 hover:bg-red-900/20"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </motion.tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Listing Form Modal */}
      {showForm && (
        <ListingForm
          listing={editingListing}
          onClose={handleFormClose}
        />
      )}
    </div>
  );
};

export default AdminDashboard;