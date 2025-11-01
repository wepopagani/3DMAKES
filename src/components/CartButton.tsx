import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingCart, X, Trash2, Plus, Minus } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { Button } from '@/components/ui/button';
import { useTranslation } from 'react-i18next';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

const CartButton = () => {
  const navigate = useNavigate();
  const { items, removeItem, updateQuantity, getTotalItems, getTotalPrice, clearCart } = useCart();
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);

  const totalItems = getTotalItems();
  const totalPrice = getTotalPrice();
  
  const handleCheckout = () => {
    setIsOpen(false);
    navigate('/shop/checkout');
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button 
          variant="default" 
          className="relative bg-brand-accent hover:bg-brand-accent/90 text-white shadow-lg"
        >
          <ShoppingCart className="h-5 w-5" />
          {totalItems > 0 && (
            <span className="absolute -top-2 -right-2 bg-white text-brand-accent border-2 border-brand-accent text-xs rounded-full h-6 w-6 flex items-center justify-center font-bold">
              {totalItems}
            </span>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-lg">
        <SheetHeader>
          <SheetTitle className="flex items-center justify-between">
            <span>{t('shop.cart')}</span>
            {items.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearCart}
                className="text-red-500 hover:text-red-700 hover:bg-red-50"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                {t('shop.clearCart')}
              </Button>
            )}
          </SheetTitle>
        </SheetHeader>

        <div className="mt-8 flex flex-col h-[calc(100vh-200px)]">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center flex-1 text-center">
              <ShoppingCart className="h-16 w-16 text-gray-300 mb-4" />
              <p className="text-gray-500">{t('shop.emptyCart')}</p>
            </div>
          ) : (
            <>
              <div className="flex-1 overflow-y-auto space-y-4">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-4 border-b pb-4">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-20 h-20 object-cover rounded-md"
                    />
                    <div className="flex-1">
                      <h4 className="font-semibold text-sm">{item.name}</h4>
                      <p className="text-brand-accent font-bold">CHF {item.price.toFixed(2)}</p>
                      
                      {/* Mostra personalizzazioni se presenti */}
                      {item.customization && (
                        <div className="mt-2 text-xs bg-blue-50 border border-blue-200 rounded p-2">
                          <p className="font-semibold text-blue-800 mb-1">✨ Personalizzato</p>
                          {item.customization.notes && (
                            <p className="text-blue-700 line-clamp-2">{item.customization.notes}</p>
                          )}
                          {item.customization.referenceImages && item.customization.referenceImages.length > 0 && (
                            <p className="text-blue-600 mt-1">
                              📸 {item.customization.referenceImages.length} {item.customization.referenceImages.length === 1 ? 'immagine' : 'immagini'}
                            </p>
                          )}
                        </div>
                      )}
                      
                      <div className="flex items-center gap-2 mt-2">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="w-8 text-center font-semibold">{item.quantity}</span>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 ml-auto text-red-500 hover:text-red-700 hover:bg-red-50"
                          onClick={() => removeItem(item.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t pt-4 mt-4 space-y-4">
                <div className="flex justify-between items-center text-lg font-bold">
                  <span>{t('shop.total')}</span>
                  <span className="text-brand-accent">CHF {totalPrice.toFixed(2)}</span>
                </div>
                
                <Button 
                  className="w-full bg-brand-accent hover:bg-brand-accent/90"
                  onClick={handleCheckout}
                >
                  {t('shop.checkout')}
                </Button>
              </div>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default CartButton;

