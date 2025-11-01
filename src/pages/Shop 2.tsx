import { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ProductCard from '@/components/shop/ProductCard';
import CartButton from '@/components/shop/CartButton';
import Cart from '@/components/shop/Cart';
import { products } from '@/data/products';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

const Shop = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Header con carrello */}
      <div className="bg-gradient-to-r from-brand-blue to-brand-accent text-white py-12">
        <div className="container-custom">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">
                Shop 3DMAKES
              </h1>
              <p className="text-lg md:text-xl opacity-90">
                Prodotti innovativi stampati in 3D per i tuoi animali
              </p>
            </div>
            <div className="hidden md:block">
              <CartButton />
            </div>
          </div>
        </div>
      </div>

      {/* Barra di ricerca e filtri */}
      <div className="border-b bg-background/80 backdrop-blur-sm sticky top-16 z-30">
        <div className="container-custom py-4">
          <div className="flex items-center gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Cerca prodotti..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="md:hidden ml-auto">
              <CartButton />
            </div>
          </div>
          
          {/* Placeholder per categorie (predisposto per il futuro) */}
          {/* <div className="flex gap-2 mt-4">
            <Button variant="outline" size="sm">Tutti</Button>
            <Button variant="outline" size="sm">Ciotole</Button>
            <Button variant="outline" size="sm">Accessori</Button>
            <Button variant="outline" size="sm">Gadget</Button>
          </div> */}
        </div>
      </div>

      {/* Griglia prodotti */}
      <div className="container-custom py-12">
        {filteredProducts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">
              Nessun prodotto trovato
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>

      <Cart />
      <Footer />
    </div>
  );
};

export default Shop;

