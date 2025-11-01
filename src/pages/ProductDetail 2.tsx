import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import CartButton from '@/components/shop/CartButton';
import Cart from '@/components/shop/Cart';
import { getProductById } from '@/data/products';
import { useShop } from '@/contexts/ShopContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, Check, Minus, Plus, ShoppingCart } from 'lucide-react';

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart } = useShop();
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);

  const product = id ? getProductById(id) : undefined;

  if (!product) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container-custom py-12 text-center">
          <h1 className="text-2xl font-bold mb-4">Prodotto non trovato</h1>
          <Button onClick={() => navigate('/shop')}>
            Torna allo Shop
          </Button>
        </div>
        <Footer />
      </div>
    );
  }

  const handleAddToCart = () => {
    addToCart(product, quantity);
  };

  const decrementQuantity = () => {
    if (quantity > 1) setQuantity(quantity - 1);
  };

  const incrementQuantity = () => {
    if (quantity < product.stock) setQuantity(quantity + 1);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Header con back button e carrello */}
      <div className="border-b bg-background/80 backdrop-blur-sm sticky top-16 z-30">
        <div className="container-custom py-4">
          <div className="flex items-center justify-between">
            <Button variant="ghost" onClick={() => navigate('/shop')}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Torna allo Shop
            </Button>
            <CartButton />
          </div>
        </div>
      </div>

      <div className="container-custom py-12">
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Colonna sinistra: Immagini/Video */}
          <div>
            {/* Immagine principale */}
            <div className="aspect-square mb-4 rounded-lg overflow-hidden bg-gray-100">
              <img
                src={product.images[selectedImage]}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Thumbnails */}
            {product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-4">
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
                      alt={`${product.name} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}

            {/* Video (se presente) */}
            {product.videos && product.videos.length > 0 && (
              <div className="mt-4">
                <video
                  controls
                  className="w-full rounded-lg"
                  src={product.videos[0]}
                />
              </div>
            )}
          </div>

          {/* Colonna destra: Info prodotto */}
          <div>
            <div className="mb-4">
              {product.featured && (
                <Badge variant="secondary" className="mb-2">
                  In evidenza
                </Badge>
              )}
              <h1 className="text-4xl font-display font-bold mb-2">
                {product.name}
              </h1>
              {product.stock > 0 ? (
                <Badge variant="outline" className="text-green-600 border-green-600">
                  <Check className="h-3 w-3 mr-1" />
                  Disponibile
                </Badge>
              ) : (
                <Badge variant="destructive">Esaurito</Badge>
              )}
            </div>

            <div className="mb-6">
              <div className="text-4xl font-bold text-brand-accent mb-2">
                CHF {product.price.toFixed(2)}
              </div>
              <p className="text-muted-foreground">IVA inclusa</p>
            </div>

            <p className="text-lg mb-8">{product.description}</p>

            {/* Quantità e aggiungi al carrello */}
            <Card className="mb-8">
              <CardContent className="pt-6">
                <div className="flex items-center gap-4 mb-4">
                  <label className="font-semibold">Quantità:</label>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={decrementQuantity}
                      disabled={quantity <= 1}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <span className="w-12 text-center font-semibold text-lg">
                      {quantity}
                    </span>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={incrementQuantity}
                      disabled={quantity >= product.stock}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  {product.stock <= 10 && product.stock > 0 && (
                    <span className="text-sm text-orange-600">
                      Solo {product.stock} disponibili
                    </span>
                  )}
                </div>

                <Button
                  size="lg"
                  className="w-full"
                  onClick={handleAddToCart}
                  disabled={product.stock === 0}
                >
                  <ShoppingCart className="h-5 w-5 mr-2" />
                  Aggiungi al carrello
                </Button>
              </CardContent>
            </Card>

            {/* Tabs con dettagli e caratteristiche */}
            <Tabs defaultValue="details" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="details">Dettagli</TabsTrigger>
                <TabsTrigger value="features">Caratteristiche</TabsTrigger>
              </TabsList>
              
              <TabsContent value="details" className="mt-4">
                <Card>
                  <CardContent className="pt-6">
                    {product.details && product.details.length > 0 ? (
                      <dl className="space-y-3">
                        {product.details.map((detail, index) => (
                          <div key={index} className="flex justify-between py-2 border-b last:border-0">
                            <dt className="font-semibold text-muted-foreground">
                              {detail.label}
                            </dt>
                            <dd className="font-medium">{detail.value}</dd>
                          </div>
                        ))}
                      </dl>
                    ) : (
                      <p className="text-muted-foreground">Nessun dettaglio disponibile</p>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="features" className="mt-4">
                <Card>
                  <CardContent className="pt-6">
                    {product.features && product.features.length > 0 ? (
                      <ul className="space-y-3">
                        {product.features.map((feature, index) => (
                          <li key={index} className="flex items-start gap-3">
                            <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-muted-foreground">Nessuna caratteristica disponibile</p>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>

      <Cart />
      <Footer />
    </div>
  );
};

export default ProductDetail;

