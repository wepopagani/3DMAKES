import { useState, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, ShoppingCart, Check, Play, Upload, X, Image as ImageIcon } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import CartButton from '@/components/CartButton';
import { getProductById } from '@/data/products';
import { useCart } from '@/contexts/CartContext';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const isItalian = i18n.language.startsWith('it'); // Gestisce sia 'it' che 'it-IT'
  const { addItem } = useCart();
  
  const product = getProductById(id || '');
  const [selectedImage, setSelectedImage] = useState(0);
  const [isAddedToCart, setIsAddedToCart] = useState(false);
  
  // Stati per personalizzazione
  const [customNotes, setCustomNotes] = useState('');
  const [customImages, setCustomImages] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">{t('shop.productNotFound')}</h2>
            <Button asChild>
              <Link to="/shop">{t('shop.backToShop')}</Link>
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    // Converti le immagini in base64 per salvarle nel carrello
    Array.from(files).forEach(file => {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Immagine troppo grande (max 5MB)');
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        setCustomImages(prev => [...prev, base64]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeCustomImage = (index: number) => {
    setCustomImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleAddToCart = () => {
    const cartItem: any = {
      id: product.id, // Sarà sovrascritto dal CartContext se personalizzato
      productId: product.id,
      name: isItalian ? product.name : product.nameEn,
      price: product.price,
      image: product.images[0],
    };

    // Se il prodotto è personalizzabile, aggiungi le customizzazioni
    if (product.customizable) {
      cartItem.customization = {
        notes: customNotes || undefined,
        referenceImages: customImages.length > 0 ? customImages : undefined
      };
    }

    addItem(cartItem);
    
    setIsAddedToCart(true);
    toast.success(t('shop.addedToCart'));
    
    // Reset personalizzazioni dopo l'aggiunta
    setCustomNotes('');
    setCustomImages([]);
    
    setTimeout(() => {
      setIsAddedToCart(false);
    }, 2000);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      {/* Carrello mobile fisso */}
      <div className="md:hidden fixed top-20 right-4 z-30">
        <CartButton />
      </div>

      {/* Header */}
      <div className="bg-brand-blue text-white py-8">
        <div className="container-custom">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              className="text-white hover:bg-white/20"
              onClick={() => navigate('/shop')}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              {t('shop.backToShop')}
            </Button>
            <div className="hidden md:block">
              <CartButton />
            </div>
          </div>
        </div>
      </div>

      <main className="flex-1 py-12 bg-gray-50">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Colonna sinistra - Gallery immagini/video */}
            <div className="space-y-4">
              {/* Immagine principale */}
              <motion.div
                key={selectedImage}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="aspect-square bg-white rounded-lg shadow-lg overflow-hidden"
              >
                {product.video && selectedImage === product.images.length ? (
                  <div className="relative w-full h-full">
                    <video
                      src={product.video}
                      controls
                      autoPlay
                      className="w-full h-full object-cover"
                    >
                      Your browser does not support the video tag.
                    </video>
                  </div>
                ) : (
                  <img
                    src={product.images[selectedImage]}
                    alt={isItalian ? product.name : product.nameEn}
                    className="w-full h-full object-cover"
                  />
                )}
              </motion.div>

              {/* Thumbnails */}
              <div className="grid grid-cols-4 gap-2">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                      selectedImage === index
                        ? 'border-brand-accent'
                        : 'border-transparent hover:border-gray-300'
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${isItalian ? product.name : product.nameEn} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
                
                {/* Video thumbnail */}
                {product.video && (
                  <button
                    onClick={() => setSelectedImage(product.images.length)}
                    className={`aspect-square rounded-lg overflow-hidden border-2 transition-all relative ${
                      selectedImage === product.images.length
                        ? 'border-brand-accent'
                        : 'border-transparent hover:border-gray-300'
                    }`}
                  >
                    <video
                      src={product.video}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                      <Play className="text-white h-6 w-6" fill="white" />
                    </div>
                  </button>
                )}
              </div>
            </div>

            {/* Colonna destra - Info prodotto */}
            <div className="bg-white p-8 rounded-lg shadow-lg">
              <div className="space-y-6">
                {/* Titolo e prezzo */}
                <div>
                  <div className="flex items-start gap-3 mb-4">
                    <h1 className="text-3xl md:text-4xl font-display font-bold flex-1">
                      {isItalian ? product.name : product.nameEn}
                    </h1>
                    {product.customizable && (
                      <span className="text-sm font-semibold bg-purple-100 text-purple-700 px-3 py-2 rounded-lg whitespace-nowrap">
                        ✨ Personalizzabile
                      </span>
                    )}
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-bold text-brand-accent">
                      CHF {product.price.toFixed(2)}
                    </span>
                    {product.inStock ? (
                      <span className="text-sm text-green-600 font-semibold bg-green-50 px-3 py-1 rounded-full">
                        {t('shop.inStock')}
                      </span>
                    ) : (
                      <span className="text-sm text-red-600 font-semibold bg-red-50 px-3 py-1 rounded-full">
                        {t('shop.outOfStock')}
                      </span>
                    )}
                  </div>
                </div>

                {/* Descrizione */}
                <div>
                  <h2 className="text-xl font-semibold mb-3">{t('shop.description')}</h2>
                  <p className="text-gray-700 leading-relaxed">
                    {isItalian ? product.description : product.descriptionEn}
                  </p>
                </div>

                {/* Caratteristiche */}
                <div>
                  <h2 className="text-xl font-semibold mb-3">{t('shop.features')}</h2>
                  <ul className="space-y-2">
                    {(isItalian ? product.features : product.featuresEn).map((feature, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <Check className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Sezione personalizzazione (solo per prodotti customizable) */}
                {product.customizable && (
                  <Card className="border-2 border-brand-accent/30 bg-brand-accent/5 p-6">
                    <div className="space-y-4">
                      <div className="flex items-center gap-2 mb-4">
                        <div className="h-8 w-1 bg-brand-accent rounded-full"></div>
                        <h2 className="text-xl font-semibold text-brand-accent">
                          {t('shop.customization')}
                        </h2>
                      </div>

                      {/* Upload immagini di riferimento */}
                      <div>
                        <Label className="text-base font-semibold mb-2 block">
                          {t('shop.referenceImages')} ({t('checkout.optional')})
                        </Label>
                        <p className="text-sm text-gray-600 mb-3">
                          {t('shop.uploadImagesDescription')}
                        </p>
                        
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="image/*"
                          multiple
                          onChange={handleImageUpload}
                          className="hidden"
                        />
                        
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => fileInputRef.current?.click()}
                          className="w-full border-dashed border-2 h-24 hover:bg-gray-50"
                        >
                          <Upload className="mr-2 h-5 w-5" />
                          {t('shop.uploadImages')}
                        </Button>

                        {/* Preview immagini caricate */}
                        {customImages.length > 0 && (
                          <div className="grid grid-cols-3 gap-2 mt-3">
                            {customImages.map((img, index) => (
                              <div key={index} className="relative group">
                                <img
                                  src={img}
                                  alt={`Reference ${index + 1}`}
                                  className="w-full h-24 object-cover rounded-lg border-2 border-gray-200"
                                />
                                <button
                                  onClick={() => removeCustomImage(index)}
                                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                  <X className="h-4 w-4" />
                                </button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Note personalizzazione */}
                      <div>
                        <Label htmlFor="customNotes" className="text-base font-semibold mb-2 block">
                          {t('shop.customizationNotes')} ({t('checkout.optional')})
                        </Label>
                        <p className="text-sm text-gray-600 mb-3">
                          {t('shop.customizationNotesDescription')}
                        </p>
                        <Textarea
                          id="customNotes"
                          value={customNotes}
                          onChange={(e) => setCustomNotes(e.target.value)}
                          placeholder={t('shop.customizationNotesPlaceholder')}
                          rows={4}
                          className="resize-none"
                        />
                      </div>
                    </div>
                  </Card>
                )}

                {/* Bottone aggiungi al carrello */}
                <Button
                  onClick={handleAddToCart}
                  disabled={!product.inStock || isAddedToCart}
                  className="w-full py-6 text-lg font-semibold bg-brand-accent hover:bg-brand-accent/90 disabled:opacity-50"
                  size="lg"
                >
                  {isAddedToCart ? (
                    <>
                      <Check className="mr-2 h-5 w-5" />
                      {t('shop.addedToCart')}
                    </>
                  ) : (
                    <>
                      <ShoppingCart className="mr-2 h-5 w-5" />
                      {product.inStock ? t('shop.addToCart') : t('shop.outOfStock')}
                    </>
                  )}
                </Button>

                {/* Info aggiuntive */}
                <div className="border-t pt-6 space-y-3 text-sm text-gray-600">
                  <p>✓ {t('shop.freeShipping')}</p>

                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ProductDetail;

