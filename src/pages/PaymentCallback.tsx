import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Loader2, CheckCircle, XCircle } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { checkSumUpPaymentStatus } from '@/services/sumupService';
import { updateShopOrderPaymentStatus } from '@/services/shopOrderService';

const PaymentCallback = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState<'loading' | 'success' | 'failed'>('loading');
  
  const orderId = searchParams.get('orderId');
  const checkoutId = searchParams.get('checkout_id') || searchParams.get('id');
  const mode = searchParams.get('mode'); // 'test' se è modalità test

  useEffect(() => {
    const verifyPayment = async () => {
      if (!orderId) {
        setStatus('failed');
        return;
      }

      try {
        // Modalità test - simula successo
        if (mode === 'test') {
          await new Promise(resolve => setTimeout(resolve, 2000)); // Simula delay
          await updateShopOrderPaymentStatus(orderId, 'paid');
          setStatus('success');
          return;
        }

        // Modalità reale - verifica con SumUp
        if (checkoutId) {
          const paymentStatus = await checkSumUpPaymentStatus(checkoutId);
          
          if (paymentStatus.status === 'paid') {
            // Aggiorna lo stato del pagamento nel database
            await updateShopOrderPaymentStatus(orderId, 'paid');
            setStatus('success');
          } else {
            setStatus('failed');
          }
        } else {
          setStatus('failed');
        }
      } catch (error) {
        console.error('Error verifying payment:', error);
        setStatus('failed');
      }
    };

    verifyPayment();
  }, [orderId, checkoutId, mode]);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 flex items-center justify-center bg-gray-50 py-12">
        <div className="container-custom max-w-md">
          {status === 'loading' && (
            <div className="text-center">
              <Loader2 className="h-16 w-16 animate-spin text-brand-accent mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-2">Verifica Pagamento...</h2>
              <p className="text-gray-600">
                Attendere prego, stiamo verificando il tuo pagamento.
              </p>
            </div>
          )}

          {status === 'success' && (
            <div className="text-center">
              <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-2 text-green-700">Pagamento Confermato!</h2>
              <p className="text-gray-600 mb-6">
                Il tuo pagamento è stato processato con successo.
              </p>
              <div className="space-y-3">
                <Button
                  onClick={() => navigate(`/shop/order-success/${orderId}`)}
                  className="w-full bg-brand-accent hover:bg-brand-accent/90"
                  size="lg"
                >
                  Visualizza Ordine
                </Button>
                <Button
                  onClick={() => navigate('/shop')}
                  variant="outline"
                  className="w-full"
                >
                  Torna allo Shop
                </Button>
              </div>
            </div>
          )}

          {status === 'failed' && (
            <div className="text-center">
              <XCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-2 text-red-700">Pagamento Fallito</h2>
              <p className="text-gray-600 mb-6">
                Si è verificato un problema durante il pagamento.
                Puoi riprovare o contattarci per assistenza.
              </p>
              <div className="space-y-3">
                <Button
                  onClick={() => navigate('/shop/checkout')}
                  className="w-full bg-brand-accent hover:bg-brand-accent/90"
                  size="lg"
                >
                  Riprova Pagamento
                </Button>
                <Button
                  onClick={() => navigate('/shop')}
                  variant="outline"
                  className="w-full"
                >
                  Torna allo Shop
                </Button>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default PaymentCallback;

