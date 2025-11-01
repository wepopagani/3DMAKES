import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { CreditCard, Loader2, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const PaymentTest = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [countdown, setCountdown] = useState(3);
  const [autoRedirect, setAutoRedirect] = useState(true);
  
  const amount = searchParams.get('amount');
  const orderId = searchParams.get('orderId');
  const currency = searchParams.get('currency');

  useEffect(() => {
    if (!autoRedirect) return;

    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSuccess();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [autoRedirect]);

  const handleSuccess = () => {
    navigate(`/shop/payment-callback?orderId=${orderId}&mode=test&status=success`);
  };

  const handleFailed = () => {
    navigate(`/shop/payment-callback?orderId=${orderId}&mode=test&status=failed`);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto bg-yellow-100 w-16 h-16 rounded-full flex items-center justify-center mb-4">
            <CreditCard className="h-8 w-8 text-yellow-600" />
          </div>
          <CardTitle className="text-2xl">Pagamento Test SumUp</CardTitle>
          <p className="text-sm text-gray-600 mt-2">
            Questa è una simulazione di pagamento per sviluppo
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Dettagli pagamento */}
          <div className="bg-gray-50 rounded-lg p-4 space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">Importo:</span>
              <span className="font-bold text-xl">{currency} {amount}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Ordine:</span>
              <span className="font-mono">#{orderId?.slice(-8).toUpperCase()}</span>
            </div>
          </div>

          {/* Form carte test */}
          <div className="space-y-4">
            <div>
              <Label>Numero Carta (Test)</Label>
              <Input 
                defaultValue="4242 4242 4242 4242" 
                disabled
                className="bg-gray-50"
              />
              <p className="text-xs text-gray-500 mt-1">Carta di test - Successo automatico</p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Scadenza</Label>
                <Input defaultValue="12/25" disabled className="bg-gray-50" />
              </div>
              <div>
                <Label>CVV</Label>
                <Input defaultValue="123" disabled className="bg-gray-50" />
              </div>
            </div>
          </div>

          {/* Auto-redirect countdown */}
          {autoRedirect && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
              <Loader2 className="h-6 w-6 animate-spin text-blue-600 mx-auto mb-2" />
              <p className="text-sm text-blue-800">
                Pagamento automatico in {countdown} secondi...
              </p>
              <Button
                variant="link"
                size="sm"
                onClick={() => setAutoRedirect(false)}
                className="text-blue-600 mt-2"
              >
                Annulla auto-redirect
              </Button>
            </div>
          )}

          {/* Bottoni manuali */}
          {!autoRedirect && (
            <div className="space-y-3">
              <Button
                onClick={handleSuccess}
                className="w-full bg-green-600 hover:bg-green-700"
                size="lg"
              >
                ✅ Simula Pagamento Riuscito
              </Button>
              <Button
                onClick={handleFailed}
                variant="destructive"
                className="w-full"
                size="lg"
              >
                ❌ Simula Pagamento Fallito
              </Button>
            </div>
          )}

          {/* Info */}
          <div className="border-t pt-4">
            <p className="text-xs text-gray-500 text-center">
              ⚠️ <strong>Modalità Test</strong>
              <br />
              SumUp non è configurato. Configura le API keys in <code className="bg-gray-100 px-1 rounded">.env</code>
              <br />
              Vedi <code className="bg-gray-100 px-1 rounded">SUMUP_SETUP.md</code> per istruzioni.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentTest;

