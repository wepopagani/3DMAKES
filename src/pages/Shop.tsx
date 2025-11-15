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
  const isItalian = i18n.language.startsWith('it'); // Gestisce sia 'it' che 'it-IT'

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

      {/* Griglia prodotti */}
      <main className="flex-1 py-12 bg-gray-50">
        <div className="container-custom">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <Link to={`/shop/${product.id}`}>
                  <div className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden group">
                    {/* Immagine prodotto */}
                    <div className="aspect-square overflow-hidden bg-gray-100">
                      <img
                        src={product.images[0]}
                        alt={isItalian ? product.name : product.nameEn}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    </div>
                    
                    {/* Info prodotto */}
                    <div className="p-4">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <h3 className="font-semibold text-lg line-clamp-2 group-hover:text-brand-accent transition-colors">
                          {isItalian ? product.name : product.nameEn}
                        </h3>
                        {product.customizable && (
                          <span className="text-xs font-semibold bg-purple-100 text-purple-700 px-2 py-1 rounded whitespace-nowrap">
                            ✨ Custom
                          </span>
                        )}
                      </div>
                      <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                        {isItalian ? product.description : product.descriptionEn}
                      </p>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-2xl font-bold text-brand-accent">
                          CHF {product.price.toFixed(2)}
                        </span>
                        {product.inStock ? (
                          <span className="text-xs text-green-600 font-semibold bg-green-50 px-2 py-1 rounded">
                            {t('shop.inStock')}
                          </span>
                        ) : (
                          <span className="text-xs text-red-600 font-semibold bg-red-50 px-2 py-1 rounded">
                            {t('shop.outOfStock')}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>

          {/* Messaggio se non ci sono prodotti */}
          {products.length === 0 && (
            <div className="text-center py-20">
              <p className="text-gray-500 text-lg">{t('shop.noProducts')}</p>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Shop;

