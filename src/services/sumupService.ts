/**
 * SumUp Payment Service
 * 
 * Documentazione: https://developer.sumup.com/
 * 
 * IMPORTANTE: Per usare SumUp devi:
 * 1. Creare account business su sumup.com
 * 2. Registrare app su https://developer.sumup.com/
 * 3. Ottenere: App ID, API Key, Merchant Code
 * 4. Configurare le variabili in .env
 */

// Configurazione SumUp dalle variabili d'ambiente
const SUMUP_CONFIG = {
  appId: import.meta.env.VITE_SUMUP_APP_ID || '',
  apiKey: import.meta.env.VITE_SUMUP_API_KEY || '',
  merchantCode: import.meta.env.VITE_SUMUP_MERCHANT_CODE || '',
  environment: import.meta.env.VITE_SUMUP_ENVIRONMENT || 'sandbox', // 'sandbox' o 'production'
};

// URL base API SumUp
const SUMUP_API_BASE = SUMUP_CONFIG.environment === 'production' 
  ? 'https://api.sumup.com'
  : 'https://api.sumup.com'; // SumUp usa lo stesso endpoint per sandbox e production

export interface SumUpPaymentData {
  amount: number;
  currency: string;
  orderId: string;
  description: string;
  returnUrl: string;
  customerEmail?: string;
}

/**
 * Crea un checkout SumUp
 * Restituisce l'URL dove reindirizzare l'utente per il pagamento
 */
export const createSumUpCheckout = async (paymentData: SumUpPaymentData): Promise<string> => {
  try {
    // Verifica che la configurazione SumUp sia presente
    if (!SUMUP_CONFIG.merchantCode) {
      console.warn('⚠️ SumUp non configurato. Usa modalità test.');
      // In modalità test, ritorna un URL simulato
      return createTestPaymentUrl(paymentData);
    }

    const response = await fetch(`${SUMUP_API_BASE}/v0.1/checkouts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${SUMUP_CONFIG.apiKey}`,
      },
      body: JSON.stringify({
        checkout_reference: paymentData.orderId,
        amount: paymentData.amount,
        currency: paymentData.currency,
        merchant_code: SUMUP_CONFIG.merchantCode,
        description: paymentData.description,
        return_url: paymentData.returnUrl,
        ...(paymentData.customerEmail && { customer_email: paymentData.customerEmail }),
      }),
    });

    if (!response.ok) {
      throw new Error(`SumUp API error: ${response.statusText}`);
    }

    const data = await response.json();
    
    // L'URL dove reindirizzare l'utente per il pagamento
    return data.checkout_url || data.id;
  } catch (error) {
    console.error('Error creating SumUp checkout:', error);
    throw error;
  }
};

/**
 * Verifica lo stato di un pagamento SumUp
 */
export const checkSumUpPaymentStatus = async (checkoutId: string): Promise<{
  status: 'pending' | 'paid' | 'failed';
  transactionId?: string;
}> => {
  try {
    if (!SUMUP_CONFIG.merchantCode) {
      // In modalità test
      return { status: 'paid', transactionId: 'test-transaction-' + Date.now() };
    }

    const response = await fetch(`${SUMUP_API_BASE}/v0.1/checkouts/${checkoutId}`, {
      headers: {
        'Authorization': `Bearer ${SUMUP_CONFIG.apiKey}`,
      },
    });

    if (!response.ok) {
      throw new Error(`SumUp API error: ${response.statusText}`);
    }

    const data = await response.json();
    
    return {
      status: data.status === 'PAID' ? 'paid' : data.status === 'FAILED' ? 'failed' : 'pending',
      transactionId: data.transaction_id,
    };
  } catch (error) {
    console.error('Error checking SumUp payment status:', error);
    throw error;
  }
};

/**
 * URL di test per sviluppo (quando SumUp non è configurato)
 */
function createTestPaymentUrl(paymentData: SumUpPaymentData): string {
  const baseUrl = window.location.origin;
  const params = new URLSearchParams({
    amount: paymentData.amount.toString(),
    currency: paymentData.currency,
    orderId: paymentData.orderId,
    mode: 'test'
  });
  
  // Simula un redirect a una pagina di pagamento test
  return `${baseUrl}/shop/payment-test?${params.toString()}`;
}

/**
 * Verifica se SumUp è configurato
 */
export const isSumUpConfigured = (): boolean => {
  return !!(SUMUP_CONFIG.merchantCode && SUMUP_CONFIG.apiKey);
};

/**
 * Ottieni configurazione SumUp (per debugging)
 */
export const getSumUpConfig = () => {
  return {
    configured: isSumUpConfigured(),
    environment: SUMUP_CONFIG.environment,
    hasAppId: !!SUMUP_CONFIG.appId,
    hasApiKey: !!SUMUP_CONFIG.apiKey,
    hasMerchantCode: !!SUMUP_CONFIG.merchantCode,
  };
};

