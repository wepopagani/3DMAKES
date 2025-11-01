import { useState, useEffect } from 'react';
import { getAllShopOrders, updateShopOrderStatus, updateShopOrderPaymentStatus, deleteShopOrder, ShopOrder } from '@/services/shopOrderService';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Package, Truck, Clock, CheckCircle, XCircle, Search, Mail, Phone, MapPin, Trash2 } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Timestamp } from 'firebase/firestore';
import { toast } from 'sonner';

const AdminShopOrders = () => {
  const [orders, setOrders] = useState<ShopOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<ShopOrder | null>(null);
  const [orderToDelete, setOrderToDelete] = useState<ShopOrder | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const allOrders = await getAllShopOrders();
      setOrders(allOrders);
    } catch (error) {
      console.error('Error fetching shop orders:', error);
      toast.error('Errore nel caricamento degli ordini');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (orderId: string, newStatus: ShopOrder['status']) => {
    try {
      await updateShopOrderStatus(orderId, newStatus);
      setOrders(orders.map(order => 
        order.id === orderId ? { ...order, status: newStatus } : order
      ));
      toast.success('Stato ordine aggiornato');
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error('Errore aggiornamento stato');
    }
  };

  const handlePaymentStatusUpdate = async (orderId: string, newPaymentStatus: ShopOrder['paymentStatus']) => {
    try {
      await updateShopOrderPaymentStatus(orderId, newPaymentStatus);
      setOrders(orders.map(order => 
        order.id === orderId ? { ...order, paymentStatus: newPaymentStatus } : order
      ));
      toast.success('Stato pagamento aggiornato');
    } catch (error) {
      console.error('Error updating payment status:', error);
      toast.error('Errore aggiornamento pagamento');
    }
  };

  const handleDeleteClick = (order: ShopOrder) => {
    setOrderToDelete(order);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!orderToDelete?.id) return;

    try {
      await deleteShopOrder(orderToDelete.id);
      setOrders(orders.filter(order => order.id !== orderToDelete.id));
      toast.success('Ordine eliminato con successo');
      setIsDeleteDialogOpen(false);
      setOrderToDelete(null);
    } catch (error) {
      console.error('Error deleting order:', error);
      toast.error('Errore durante l\'eliminazione dell\'ordine');
    }
  };

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
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const filteredOrders = orders.filter(order => {
    const searchLower = searchQuery.toLowerCase();
    return (
      order.customerName?.toLowerCase().includes(searchLower) ||
      order.customerEmail?.toLowerCase().includes(searchLower) ||
      order.id?.toLowerCase().includes(searchLower)
    );
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-accent"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Ordini Shop ({orders.length})</h2>
        <div className="flex gap-3 items-center">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              type="text"
              placeholder="Cerca ordini..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 w-64"
            />
          </div>
          <Button onClick={fetchOrders} variant="outline">
            Aggiorna
          </Button>
        </div>
      </div>

      {/* Statistiche rapide */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{orders.filter(o => o.status === 'pending').length}</div>
            <div className="text-sm text-gray-500">In Attesa</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{orders.filter(o => o.status === 'processing').length}</div>
            <div className="text-sm text-gray-500">In Preparazione</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{orders.filter(o => o.status === 'completed').length}</div>
            <div className="text-sm text-gray-500">Completati</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">
              CHF {orders.reduce((sum, o) => sum + o.totalAmount, 0).toFixed(2)}
            </div>
            <div className="text-sm text-gray-500">Totale Ordini</div>
          </CardContent>
        </Card>
      </div>

      {/* Lista ordini */}
      <div className="space-y-4">
        {filteredOrders.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <Package className="h-16 w-16 mx-auto text-gray-300 mb-4" />
              <h3 className="text-lg font-semibold mb-2">Nessun ordine trovato</h3>
              <p className="text-gray-500">
                {searchQuery ? 'Nessun ordine corrisponde alla ricerca' : 'Non ci sono ordini shop al momento'}
              </p>
            </CardContent>
          </Card>
        ) : (
          filteredOrders.map((order) => (
            <Card key={order.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">
                      Ordine #{order.id?.slice(-8).toUpperCase()}
                    </CardTitle>
                    <div className="flex items-center gap-2 mt-2 text-sm text-gray-500">
                      <Mail className="h-4 w-4" />
                      {order.customerEmail}
                    </div>
                  </div>
                  <div className="flex flex-col gap-2 items-end">
                    {getStatusBadge(order.status)}
                    {getPaymentBadge(order.paymentStatus)}
                    <span className="text-sm text-gray-500">{formatDate(order.createdAt)}</span>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Info cliente */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-b pb-4">
                    <div>
                      <p className="text-sm font-semibold text-gray-600">Cliente:</p>
                      <p className="font-medium">{order.customerName}</p>
                      <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                        <Phone className="h-3 w-3" />
                        {order.customerPhone}
                      </div>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-600">Consegna:</p>
                      {order.deliveryMethod === 'pickup' ? (
                        <div className="flex items-center gap-2">
                          <Package className="h-4 w-4 text-brand-accent" />
                          <span className="font-medium">Ritiro in negozio</span>
                        </div>
                      ) : (
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <Truck className="h-4 w-4 text-brand-accent" />
                            <span className="font-medium">Spedizione</span>
                          </div>
                          {order.shippingAddress && (
                            <div className="text-sm text-gray-600 ml-6">
                              <p>{order.shippingAddress.address}</p>
                              <p>{order.shippingAddress.postalCode} {order.shippingAddress.city}</p>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Prodotti */}
                  <div>
                    <p className="text-sm font-semibold text-gray-600 mb-2">Prodotti:</p>
                    <div className="space-y-2">
                      {order.items.map((item, index) => (
                        <div key={index} className="bg-gray-50 p-2 rounded">
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
                            <div className="mt-2 ml-15 bg-blue-50 border border-blue-200 rounded p-3">
                              <p className="text-xs font-semibold text-blue-800 mb-2">✨ Personalizzazione:</p>
                              {item.customization.notes && (
                                <div className="mb-2">
                                  <p className="text-xs text-blue-600 font-medium">Note:</p>
                                  <p className="text-xs text-blue-900">{item.customization.notes}</p>
                                </div>
                              )}
                              {item.customization.referenceImages && item.customization.referenceImages.length > 0 && (
                                <div>
                                  <p className="text-xs text-blue-600 font-medium mb-1">
                                    Immagini di riferimento ({item.customization.referenceImages.length}):
                                  </p>
                                  <div className="grid grid-cols-4 gap-1">
                                    {item.customization.referenceImages.map((img, imgIndex) => (
                                      <img
                                        key={imgIndex}
                                        src={img}
                                        alt={`Ref ${imgIndex + 1}`}
                                        className="w-full h-16 object-cover rounded border cursor-pointer hover:scale-110 transition-transform"
                                        onClick={() => window.open(img, '_blank')}
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

                  {/* Note */}
                  {order.notes && (
                    <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                      <p className="text-xs font-semibold text-amber-800 mb-1">Note cliente:</p>
                      <p className="text-sm text-amber-900">{order.notes}</p>
                    </div>
                  )}

                  {/* Totale e azioni */}
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-t pt-4 gap-4">
                    <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
                      <div>
                        <p className="text-sm text-gray-500">Stato Ordine:</p>
                        <Select
                          value={order.status}
                          onValueChange={(value: ShopOrder['status']) => 
                            order.id && handleStatusUpdate(order.id, value)
                          }
                        >
                          <SelectTrigger className="w-40">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pending">In Attesa</SelectItem>
                            <SelectItem value="processing">In Preparazione</SelectItem>
                            <SelectItem value="completed">Completato</SelectItem>
                            <SelectItem value="cancelled">Annullato</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Pagamento:</p>
                        <Select
                          value={order.paymentStatus}
                          onValueChange={(value: ShopOrder['paymentStatus']) => 
                            order.id && handlePaymentStatusUpdate(order.id, value)
                          }
                        >
                          <SelectTrigger className="w-32">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pending">In Attesa</SelectItem>
                            <SelectItem value="paid">Pagato</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="flex items-center justify-between md:justify-end gap-4 w-full md:w-auto">
                      <div className="text-right">
                        <p className="text-sm text-gray-500">Totale:</p>
                        <p className="text-2xl font-bold text-brand-accent">
                          CHF {order.totalAmount.toFixed(2)}
                        </p>
                      </div>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDeleteClick(order)}
                        className="flex items-center gap-2"
                      >
                        <Trash2 className="h-4 w-4" />
                        Elimina
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Dialog di conferma eliminazione */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Conferma Eliminazione</AlertDialogTitle>
            <AlertDialogDescription>
              Sei sicuro di voler eliminare questo ordine? 
              <br />
              <span className="font-semibold text-gray-900">
                Ordine #{orderToDelete?.id?.slice(-8).toUpperCase()}
              </span>
              <br />
              Cliente: <span className="font-semibold">{orderToDelete?.customerName}</span>
              <br /><br />
              <span className="text-red-600 font-semibold">
                Questa azione non può essere annullata.
              </span>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annulla</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              className="bg-red-600 hover:bg-red-700"
            >
              Elimina Ordine
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AdminShopOrders;

