import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { LogIn } from 'lucide-react';
import { useAdminAuth } from '@/contexts/AdminAuthContext';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { getCanonicalUrl } from '@/lib/seoUtils';

const AdminLogin = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { login, isAuthenticated } = useAdminAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  React.useEffect(() => {
    if (isAuthenticated) {
      navigate('/admin/dashboard');
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const result = login(username, password);
    
    if (result.success) {
      toast({
        title: 'Başarılı!',
        description: 'Admin paneline yönlendiriliyorsunuz...',
      });
      navigate('/admin/dashboard');
    } else {
      toast({
        title: 'Hata!',
        description: result.error,
        variant: 'destructive',
      });
    }
  };

  const pageTitle = "Elazığ Kaliteli Escort Elazığ'daki Gerçek Escortlarla Burda Tanışabilir Görüşüp Unutulmayacak Bir Gece Yaşayabilirsiniz.";
  const pageDescription = "Elazığ Kaliteli Escort Elazığ'daki Gerçek Escortlarla Burda Tanışabilir Görüşüp Unutulmayacak Bir Gece Yaşayabilirsiniz.";
  const canonicalUrl = getCanonicalUrl('admin/login');

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4">
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
        <meta name="robots" content="noindex, nofollow" />
        <link rel="canonical" href={canonicalUrl} />
      </Helmet>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md"
      >
        <div className="bg-gray-900 rounded-xl shadow-2xl p-8 border border-gray-800">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">Admin Paneli</h1>
            <p className="text-gray-400">Yönetim paneline giriş yapın</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-gray-300 mb-2 font-medium">
                Kullanıcı Adı
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-gray-800 text-white border border-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                placeholder="Kullanıcı adınızı girin"
                required
              />
            </div>

            <div>
              <label className="block text-gray-300 mb-2 font-medium">
                Şifre
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-gray-800 text-white border border-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                placeholder="Şifrenizi girin"
                required
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white font-bold py-3"
            >
              <LogIn className="w-5 h-5 mr-2" />
              Giriş Yap
            </Button>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default AdminLogin;