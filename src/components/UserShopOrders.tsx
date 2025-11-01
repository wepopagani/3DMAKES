import { useEffect, useState } from 'react';
import { useAuth } from '@/firebase/AuthContext';
import { getUserShopOrders, ShopOrder } from '@/services/shopOrderService';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Package, Truck, Clock, CheckCircle, XCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Timestamp } from 'firebase/firestore';

const UserShopOrders = () => {
  const { currentUser } = useAuth();
  const { t } = useTranslation();
  const [orders, setOrders] = useState<ShopOrder[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!currentUser) return;

      try {
        const userOrders = await getUserShopOrders(currentUser.uid);
        setOrders(userOrders);
      } catch (error) {
        console.error('Error fetching shop orders:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [currentUser]);

  const getStatusBadge = (status: ShopOrder['status']) => {
    const statusMap = {
      pending: { label: 'In Attesa', color: 'bg-yellow-100 text-yellow-800', icon: Clock },
      processing: { label: 'In Preparazione', color: 'bg-blue-100 text-blue-800', icon: Package },
      completed: { label: 'Completato', color: 'bg-green-100 text-green-800', icon: CheckCircle },
      cancelled: { label: 'Annullato', color: 'bg-red-100 text-red-800', icon: XCircle }
    };

    const statusInfo = statusMap[status];
    const Icon = statusInfo.icon;

    return (
      <Badge className={`${statusInfo.color} flex items-center gap-1`}>
        <Icon className="h-3 w-3" />
        {statusInfo.label}
      </Badge>
    );
  };

  const getPaymentBadge = (paymentStatus: ShopOrder['paymentStatus']) => {
    return paymentStatus === 'paid' ? (
      <Badge className="bg-green-100 text-green-800">Pagato</Badge>
    ) : (
      <Badge className="bg-yellow-100 text-yellow-800">In Attesa</Badge>
    );
  };

  const formatDate = (date: Date | Timestamp) => {
    const dateObj = date instanceof Timestamp ? date.toDate() : date;
    return dateObj.toLocaleDateString('it-IT', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <p>{t('common.loading')}</p>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <Package className="h-16 w-16 mx-auto text-gray-300 mb-4" />
          <h3 className="text-lg font-semibold mb-2">Nessun ordine shop</h3>
          <p className="text-gray-500 mb-4">
            Non hai ancora effettuato ordini dal nostro shop.
          </p>
          <a
            href="/shop"
            className="inline-block px-6 py-2 bg-brand-accent text-white rounded-md hover:bg-brand-accent/90"
          >
            Vai allo Shop
          </a>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold mb-6">I Miei Ordini Shop</h2>
      
      {orders.map((order) => (
        <Card key={order.id} className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-lg">
                  Ordine #{order.id?.slice(-8).toUpperCase()}
                </CardTitle>
                <p className="text-sm text-gray-500 mt-1">
                  {formatDate(order.createdAt)}
                </p>
              </div>
              <div className="flex flex-col gap-2 items-end">
                {getStatusBadge(order.status)}
                {getPaymentBadge(order.paymentStatus)}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Prodotti */}
              <div>
                <p className="text-sm font-semibold text-gray-600 mb-2">Prodotti:</p>
                <div className="space-y-2">
                  {order.items.map((item, index) => (
                    <div key={index}>
                      <div className="flex gap-3 items-center">
                        <img
                          src={item.image}
                          alt={item.productName}
                          className="w-12 h-12 object-cover rounded"
                        />
                        <div className="flex-1">
                          <p className="text-sm font-medium">{item.productName}</p>
                          <p className="text-xs text-gray-500">
                            {item.quantity} x CHF {item.price.toFixed(2)}
                          </p>
                        </div>
                        <p className="font-semibold">
                          CHF {(item.price * item.quantity).toFixed(2)}
                        </p>
                      </div>
                      
                      {/* Mostra personalizzazioni se presenti */}
                      {item.customization && (
                        <div className="mt-2 ml-15 bg-blue-50 border border-blue-200 rounded p-2">
                          <p className="text-xs font-semibold text-blue-800 mb-1">✨ Personalizzato</p>
                          {item.customization.notes && (
                            <p className="text-xs text-blue-700">{item.customization.notes}</p>
                          )}
                          {item.customization.referenceImages && item.customization.referenceImages.length > 0 && (
                            <p className="text-xs text-blue-600 mt-1">
                              📸 {item.customization.referenceImages.length} {item.customization.referenceImages.length === 1 ? 'immagine' : 'immagini'} di riferimento
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Consegna */}
              <div className="border-t pt-3">
                <div className="flex items-center gap-2 text-sm">
                  {order.deliveryMethod === 'pickup' ? (
                    <>
                      <Package className="h-4 w-4 text-brand-accent" />
                      <span className="font-medium">Ritiro in negozio</span>
                    </>
                  ) : (
                    <>
                      <Truck className="h-4 w-4 text-brand-accent" />
                      <span className="font-medium">Spedizione</span>
                      {order.shippingAddress && (
                        <span className="text-gray-500">
                          - {order.shippingAddress.city}
                        </span>
                      )}
                    </>
                  )}
                </div>
              </div>

              {/* Totale */}
              <div className="border-t pt-3 flex justify-between items-center">
                <span className="font-semibold">Totale:</span>
                <span className="text-xl font-bold text-brand-accent">
                  CHF {order.totalAmount.toFixed(2)}
                </span>
              </div>

              {/* Note se presenti */}
              {order.notes && (
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-xs font-semibold text-gray-600 mb-1">Note:</p>
                  <p className="text-sm text-gray-700">{order.notes}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default UserShopOrders;

