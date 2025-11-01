import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import CartButton from '@/components/CartButton';
import { products } from '@/data/products';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

const Shop = () => {
  const { t, i18n } = useTranslation();
  const isItalian = i18n.language === 'it';

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      {/* Header con carrello */}
      <div className="bg-brand-blue text-white py-16">
        <div className="container-custom">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">
                {t('shop.title')}
              </h1>
              <p className="text-xl opacity-90">
                {t('shop.subtitle')}
              </p>
            </div>
            <div className="hidden md:block">
              <CartButton />
            </div>
          </div>
        </div>
      </div>

      {/* Carrello mobile fisso in alto */}
      <div className="md:hidden fixed top-20 right-4 z-30">
        <CartButton />
      </div>

      {/* Coming Soon con Tony */}
      <main className="flex-1 py-12 bg-gray-50">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center py-20">
            {/* Tony Video */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="mb-8"
            >
              <video 
                src="/tony si sdraia.mp4" 
                autoPlay
                loop
                muted
                playsInline
                className="w-80 h-80 mx-auto object-contain"
              >
                Your browser does not support the video tag.
              </video>
            </motion.div>

            {/* Coming Soon */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <h2 className="text-5xl md:text-6xl font-display font-bold text-brand-blue mb-4">
                {t('shop.comingSoon')}
              </h2>
              <p className="text-xl md:text-2xl text-gray-600 mb-8">
                {t('shop.comingSoonDescription')}
              </p>
              <p className="text-lg text-gray-500 mb-12">
                {t('shop.comingSoonSubtext')}
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  asChild 
                  size="lg"
                  className="bg-brand-accent hover:bg-brand-accent/90"
                >
                  <Link to="/calculator">
                    {t('nav.requestQuote')}
                  </Link>
                </Button>
                <Button 
                  asChild 
                  variant="outline"
                  size="lg"
                >
                  <Link to="/">
                    {t('notFound.backHome')}
                  </Link>
                </Button>
              </div>
            </motion.div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Shop;

