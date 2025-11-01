import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { CheckCircle, Package, ArrowRight } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { getShopOrderById, ShopOrder } from '@/services/shopOrderService';
import { useAuth } from '@/firebase/AuthContext';

const ShopOrderSuccess = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const { t } = useTranslation();
  const { currentUser } = useAuth();
  const [order, setOrder] = useState<ShopOrder | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      if (!orderId) return;
      
      try {
        const orderData = await getShopOrderById(orderId);
        setOrder(orderData);
      } catch (error) {
        console.error('Error fetching order:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <p>{t('common.loading')}</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <p className="text-xl mb-4">{t('checkout.orderNotFound')}</p>
            <Button asChild>
              <Link to="/shop">{t('shop.backToShop')}</Link>
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 py-12 bg-gray-50">
        <div className="container-custom max-w-3xl">
          {/* Success Icon */}
          <div className="text-center mb-8">
            <CheckCircle className="h-24 w-24 text-green-500 mx-auto mb-4" />
            <h1 className="text-4xl font-display font-bold mb-2">
              {t('checkout.orderSuccess')}
            </h1>
            <p className="text-gray-600 text-lg">
              {t('checkout.orderSuccessDescription')}
            </p>
          </div>

          {/* Dettagli ordine */}
          <Card className="mb-6">
            <CardContent className="p-6 space-y-6">
              {/* Numero ordine */}
              <div className="border-b pb-4">
                <p className="text-sm text-gray-500">{t('checkout.orderNumber')}</p>
                <p className="text-2xl font-bold text-brand-accent">#{order.id?.slice(-8).toUpperCase()}</p>
              </div>

              {/* Email conferma */}
              <div>
                <p className="text-sm text-gray-500 mb-2">{t('checkout.confirmationEmail')}</p>
                <p className="font-medium">{order.customerEmail}</p>
                <p className="text-sm text-gray-600 mt-1">
                  {t('checkout.confirmationEmailDescription')}
                </p>
              </div>

              {/* Metodo di consegna */}
              <div>
                <p className="text-sm text-gray-500 mb-2">{t('checkout.deliveryMethod')}</p>
                {order.deliveryMethod === 'pickup' ? (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-center gap-2 text-blue-700 font-medium mb-2">
                      <Package className="h-5 w-5" />
                      {t('checkout.pickup')}
                    </div>
                    <p className="text-sm text-blue-600">
                      Via Cantonale 15<br />
                      6918 Figino, Svizzera<br />
                      Tel: +41 76 266 03 96
                    </p>
                    <p className="text-sm text-blue-700 mt-2 font-medium">
                      {t('checkout.pickupReady')}
                    </p>
                  </div>
                ) : (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="flex items-center gap-2 text-green-700 font-medium mb-2">
                      <Package className="h-5 w-5" />
                      {t('checkout.shipping')}
                    </div>
                    <p className="text-sm text-green-600">
                      {order.shippingAddress?.address}<br />
                      {order.shippingAddress?.postalCode} {order.shippingAddress?.city}
                    </p>
                    <p className="text-sm text-green-700 mt-2 font-medium">
                      {t('checkout.shippingEstimate')}
                    </p>
                  </div>
                )}
              </div>

              {/* Prodotti */}
              <div>
                <p className="text-sm text-gray-500 mb-3">{t('checkout.orderedItems')}</p>
                <div className="space-y-3">
                  {order.items.map((item, index) => (
                    <div key={index} className="border-b pb-3 last:border-b-0 last:pb-0">
                      <div className="flex gap-3">
                        <img
                          src={item.image}
                          alt={item.productName}
                          className="w-16 h-16 object-cover rounded"
                        />
                        <div className="flex-1">
                          <p className="font-medium">{item.productName}</p>
                          <p className="text-sm text-gray-500">
                            {item.quantity} x CHF {item.price.toFixed(2)}
                          </p>
                        </div>
                        <p className="font-semibold">
                          CHF {(item.price * item.quantity).toFixed(2)}
                        </p>
                      </div>
                      
                      {/* Mostra personalizzazioni se presenti */}
                      {item.customization && (
                        <div className="mt-2 bg-blue-50 border border-blue-200 rounded p-3">
                          <p className="text-sm font-semibold text-blue-800 mb-2">✨ Personalizzazione</p>
                          {item.customization.notes && (
                            <div className="mb-2">
                              <p className="text-xs text-blue-600 font-medium">Note:</p>
                              <p className="text-sm text-blue-900">{item.customization.notes}</p>
                            </div>
                          )}
                          {item.customization.referenceImages && item.customization.referenceImages.length > 0 && (
                            <div>
                              <p className="text-xs text-blue-600 font-medium mb-1">
                                Immagini di riferimento:
                              </p>
                              <div className="grid grid-cols-4 gap-1">
                                {item.customization.referenceImages.map((img, imgIndex) => (
                                  <img
                                    key={imgIndex}
                                    src={img}
                                    alt={`Ref ${imgIndex + 1}`}
                                    className="w-full h-16 object-cover rounded border"
                                  />
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Totale */}
              <div className="border-t pt-4">
                <div className="flex justify-between text-xl font-bold">
                  <span>{t('checkout.total')}</span>
                  <span className="text-brand-accent">CHF {order.totalAmount.toFixed(2)}</span>
                </div>
                <p className="text-sm text-gray-500 mt-2">
                  {t('checkout.paymentPending')}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Prossimi passi */}
          <Card className="mb-6">
            <CardContent className="p-6">
              <h3 className="font-semibold text-lg mb-4">{t('checkout.nextSteps')}</h3>
              <ol className="space-y-3">
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-brand-accent text-white rounded-full flex items-center justify-center text-sm font-bold">1</span>
                  <p className="text-gray-700">{t('checkout.step1')}</p>
                </li>
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-brand-accent text-white rounded-full flex items-center justify-center text-sm font-bold">2</span>
                  <p className="text-gray-700">{t('checkout.step2')}</p>
                </li>
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-brand-accent text-white rounded-full flex items-center justify-center text-sm font-bold">3</span>
                  <p className="text-gray-700">{t('checkout.step3')}</p>
                </li>
              </ol>
            </CardContent>
          </Card>

          {/* Call to action */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {currentUser ? (
              <Button asChild size="lg" className="bg-brand-accent hover:bg-brand-accent/90">
                <Link to="/dashboard">
                  {t('checkout.viewInDashboard')}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            ) : (
              <Button asChild size="lg" className="bg-brand-accent hover:bg-brand-accent/90">
                <Link to="/register">
                  {t('checkout.createAccountToTrack')}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            )}
            <Button asChild variant="outline" size="lg">
              <Link to="/shop">{t('shop.continueShopping')}</Link>
            </Button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ShopOrderSuccess;

