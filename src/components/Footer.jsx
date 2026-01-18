import React, { useEffect, useState } from 'react';
import { MessageCircle } from 'lucide-react';
import { getSettings } from '@/lib/supabaseStorage';

const Footer = () => {
  const [telegramLink, setTelegramLink] = useState('');
  const currentYear = new Date().getFullYear();

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        // getSettings now handles errors and fallbacks internally
        const settings = await getSettings();
        setTelegramLink(settings.telegram_link);
      } catch (error) {
        console.error("Failed to fetch settings for footer", error);
        // Fallback if even the robust getSettings fails
        setTelegramLink('https://t.me/elazigescort_admin');
      }
    };
    fetchSettings();
  }, []);

  return (
    <footer className="bg-black border-t border-gray-900 pt-10 pb-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8 mb-8">
          {/* Brand */}
          <div className="text-center md:text-left">
            <h3 className="text-3xl font-bold bg-gradient-to-r from-pink-500 to-rose-500 bg-clip-text text-transparent">
              Elazığ Escort
            </h3>
          </div>

          {/* Contact */}
          <div className="text-center md:text-right space-y-2">
            <h4 className="text-white font-semibold text-lg">İletişim</h4>
            {telegramLink ? (
              <a
                href={telegramLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-pink-400 hover:text-pink-300 transition-colors text-md"
              >
                <MessageCircle className="w-5 h-5" />
                Telegram Destek Hattı
              </a>
            ) : (
              <p className="text-gray-500 text-sm">Telegram linki yapılandırılmamış.</p>
            )}
          </div>
        </div>

        {/* SEO Description */}
        <div className="border-t border-gray-900 pt-8 mb-6">
          <p className="text-gray-400 text-sm text-center max-w-3xl mx-auto">
            Elazığ Kaliteli Escort Elazığ'daki Gerçek Escortlarla Burda Tanışabilir Görüşüp Unutulmayacak Bir Gece Yaşayabilirsiniz.
          </p>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-900 pt-6 text-center">
          <p className="text-gray-600 text-sm">
            &copy; {currentYear} Elazığ Escort. Tüm hakları saklıdır. 
            Sitemizdeki içerikler 18 yaş ve üzeri yetişkinler içindir.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;