import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CreditCard, Loader2, AlertCircle, CheckCircle } from 'lucide-react';
import { createSumUpCheckout, isSumUpConfigured, getSumUpConfig } from '@/services/sumupService';
import { toast } from 'sonner';

interface SumUpPaymentProps {
  amount: number;
  orderId: string;
  description: string;
  customerEmail: string;
  onSuccess?: () => void;
  onCancel?: () => void;
}

const SumUpPayment = ({ 
  amount, 
  orderId, 
  description, 
  customerEmail,
  onSuccess,
  onCancel 
}: SumUpPaymentProps) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const sumupConfig = getSumUpConfig();
  const isConfigured = isSumUpConfigured();

  const handlePayment = async () => {
    setLoading(true);
    setError(null);

    try {
      const returnUrl = `${window.location.origin}/shop/payment-callback?orderId=${orderId}`;
      
      const checkoutUrl = await createSumUpCheckout({
        amount,
        currency: 'CHF',
        orderId,
        description,
        returnUrl,
        customerEmail,
      });

      // Reindirizza l'utente alla pagina di pagamento SumUp
      window.location.href = checkoutUrl;
      
    } catch (err) {
      console.error('Payment error:', err);
      setError('Errore durante la creazione del pagamento. Riprova.');
      toast.error('Errore nel processare il pagamento');
      setLoading(false);
    }
  };

  return (
    <Card className="border-2 border-brand-accent/30">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CreditCard className="h-5 w-5" />
          Pagamento con SumUp
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Info pagamento */}
        <div className="bg-gray-50 rounded-lg p-4 space-y-2">
          <div className="flex justify-between">
            <span className="text-gray-600">Importo:</span>
            <span className="font-bold text-lg">CHF {amount.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Ordine:</span>
            <span className="font-mono">#{orderId.slice(-8).toUpperCase()}</span>
          </div>
        </div>

        {/* Stato configurazione */}
        {!isConfigured && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 flex items-start gap-2">
            <AlertCircle className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm">
              <p className="font-semibold text-yellow-800">Modalità Test</p>
              <p className="text-yellow-700">
                SumUp non è configurato. Il pagamento verrà simulato.
                <br />
                <span className="text-xs">
                  Vedi <code className="bg-yellow-100 px-1 rounded">SUMUP_SETUP.md</code> per configurare.
                </span>
              </p>
            </div>
          </div>
        )}

        {isConfigured && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-3 flex items-start gap-2">
            <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm">
              <p className="font-semibold text-green-800">SumUp Configurato</p>
              <p className="text-green-700">
                Ambiente: <span className="font-mono">{sumupConfig.environment}</span>
              </p>
            </div>
          </div>
        )}

        {/* Metodi di pagamento supportati */}
        <div className="border-t pt-4">
          <p className="text-sm text-gray-600 mb-3">Metodi di pagamento accettati:</p>
          <div className="flex flex-wrap gap-2">
            <span className="text-xs bg-gray-100 px-3 py-1 rounded-full">💳 Visa</span>
            <span className="text-xs bg-gray-100 px-3 py-1 rounded-full">💳 Mastercard</span>
            <span className="text-xs bg-gray-100 px-3 py-1 rounded-full">💳 American Express</span>
            <span className="text-xs bg-gray-100 px-3 py-1 rounded-full">📱 Apple Pay</span>
            <span className="text-xs bg-gray-100 px-3 py-1 rounded-full">📱 Google Pay</span>
          </div>
        </div>

        {/* Errore */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-start gap-2">
            <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        {/* Bottoni */}
        <div className="flex gap-3 pt-4">
          <Button
            onClick={handlePayment}
            disabled={loading}
            className="flex-1 bg-brand-accent hover:bg-brand-accent/90"
            size="lg"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Reindirizzamento...
              </>
            ) : (
              <>
                <CreditCard className="mr-2 h-5 w-5" />
                Paga CHF {amount.toFixed(2)}
              </>
            )}
          </Button>
          {onCancel && (
            <Button
              onClick={onCancel}
              disabled={loading}
              variant="outline"
              size="lg"
            >
              Annulla
            </Button>
          )}
        </div>

        {/* Info sicurezza */}
        <p className="text-xs text-gray-500 text-center pt-2">
          🔒 Pagamento sicuro elaborato da SumUp.
          <br />
          I tuoi dati di pagamento sono protetti e crittografati.
        </p>
      </CardContent>
    </Card>
  );
};

export default SumUpPayment;

