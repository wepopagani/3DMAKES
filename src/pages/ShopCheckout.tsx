import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/firebase/AuthContext';
import { useCart } from '@/contexts/CartContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SumUpPayment from '@/components/SumUpPayment';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { ArrowLeft, Package, Truck, Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';
import { createShopOrder } from '@/services/shopOrderService';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/firebase/config';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '@/firebase/config';

const ShopCheckout = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { items, getTotalPrice, clearCart } = useCart();
  
  const [loading, setLoading] = useState(false);
  const [deliveryMethod, setDeliveryMethod] = useState<'shipping' | 'pickup'>('pickup');
  const [createAccount, setCreateAccount] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [currentStep, setCurrentStep] = useState<'form' | 'payment'>('form');
  const [pendingOrderId, setPendingOrderId] = useState<string | null>(null);
  
  // Form data
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: currentUser?.email || '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
    notes: '',
    password: '',
    confirmPassword: ''
  });

  // Se il carrello è vuoto, redirect allo shop
  useEffect(() => {
    if (items.length === 0) {
      navigate('/shop');
    }
  }, [items, navigate]);

  // Se utente già loggato, pre-compila email
  useEffect(() => {
    if (currentUser?.email) {
      setFormData(prev => ({ ...prev, email: currentUser.email || '' }));
    }
  }, [currentUser]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.phone) {
      toast.error(t('checkout.fillAllFields'));
      return false;
    }

    if (deliveryMethod === 'shipping') {
      if (!formData.address || !formData.city || !formData.postalCode) {
        toast.error(t('checkout.fillShippingAddress'));
        return false;
      }
    }

    if (createAccount && !currentUser) {
      if (!formData.password || formData.password.length < 6) {
        toast.error(t('auth.passwordMinLength'));
        return false;
      }
      if (formData.password !== formData.confirmPassword) {
        toast.error(t('auth.confirmPasswordError'));
        return false;
      }
    }

    return true;
  };

  const handleCreateAccount = async (email: string, password: string) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Crea documento utente in Firestore
      await setDoc(doc(db, 'users', user.uid), {
        email: email,
        firstName: formData.firstName,
        lastName: formData.lastName,
        phone: formData.phone,
        createdAt: new Date(),
        role: 'user'
      });

      toast.success(t('auth.accountCreatedSuccess'));
      return user.uid;
    } catch (error: any) {
      console.error('Error creating account:', error);
      if (error.code === 'auth/email-already-in-use') {
        toast.error(t('auth.emailInUse'));
      } else {
        toast.error(t('auth.registerError'));
      }
      throw error;
    }
  };

  const handleProceedToPayment = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      let userId = currentUser?.uid;

      // Se l'utente vuole creare un account e non è già loggato
      if (createAccount && !currentUser) {
        userId = await handleCreateAccount(formData.email, formData.password);
      }

      // Prepara i dati dell'ordine
      const orderData = {
        userId: userId || null,
        customerEmail: formData.email,
        customerName: `${formData.firstName} ${formData.lastName}`,
        customerPhone: formData.phone,
        deliveryMethod,
        shippingAddress: deliveryMethod === 'shipping' ? {
          address: formData.address,
          city: formData.city,
          postalCode: formData.postalCode,
        } : null,
        items: items.map(item => ({
          productId: item.productId,
          productName: item.name,
          price: item.price,
          quantity: item.quantity,
          image: item.image,
          customization: item.customization
        })),
        totalAmount: getTotalPrice() + (deliveryMethod === 'shipping' ? 9.90 : 0),
        notes: formData.notes,
        status: 'pending',
        paymentStatus: 'pending',
        createdAt: new Date()
      };

      // Salva l'ordine nel database
      const orderId = await createShopOrder(orderData);
      setPendingOrderId(orderId);

      // Passa allo step di pagamento
      setCurrentStep('payment');
      
      toast.success('Ordine creato! Procedi con il pagamento.');
    } catch (error) {
      console.error('Error creating order:', error);
      toast.error(t('checkout.orderError'));
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentSuccess = () => {
    // Svuota il carrello dopo pagamento riuscito
    clearCart();
    if (pendingOrderId) {
      navigate(`/shop/order-success/${pendingOrderId}`);
    }
  };

  const handlePaymentCancel = () => {
    setCurrentStep('form');
    toast.info('Pagamento annullato. Puoi modificare l\'ordine e riprovare.');
  };

  const totalPrice = getTotalPrice();

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="bg-brand-blue text-white py-12">
        <div className="container-custom">
          <Button
            variant="ghost"
            className="text-white hover:bg-white/20 mb-4"
            onClick={() => navigate('/shop')}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            {t('shop.backToShop')}
          </Button>
          <h1 className="text-4xl md:text-5xl font-display font-bold">
            {t('checkout.title')}
          </h1>
        </div>
      </div>

      <main className="flex-1 py-12 bg-gray-50">
        <div className="container-custom">
          {/* Step indicator */}
          <div className="flex items-center justify-center mb-8">
            <div className="flex items-center gap-4">
              <div className={`flex items-center gap-2 ${currentStep === 'form' ? 'text-brand-accent' : 'text-gray-400'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep === 'form' ? 'bg-brand-accent text-white' : 'bg-gray-200'}`}>
                  1
                </div>
                <span className="font-medium">Dati Ordine</span>
              </div>
              <div className="w-12 h-0.5 bg-gray-300"></div>
              <div className={`flex items-center gap-2 ${currentStep === 'payment' ? 'text-brand-accent' : 'text-gray-400'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep === 'payment' ? 'bg-brand-accent text-white' : 'bg-gray-200'}`}>
                  2
                </div>
                <span className="font-medium">Pagamento</span>
              </div>
            </div>
          </div>

          {currentStep === 'form' ? (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Colonna sinistra - Form */}
              <div className="lg:col-span-2 space-y-6">
              {/* Dati personali */}
              <Card>
                <CardHeader>
                  <CardTitle>{t('checkout.personalData')}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName">{t('checkout.firstName')} *</Label>
                      <Input
                        id="firstName"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="lastName">{t('checkout.lastName')} *</Label>
                      <Input
                        id="lastName"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      disabled={!!currentUser}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">{t('checkout.phone')} *</Label>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="+41 XX XXX XX XX"
                      required
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Metodo di consegna */}
              <Card>
                <CardHeader>
                  <CardTitle>{t('checkout.deliveryMethod')}</CardTitle>
                </CardHeader>
                <CardContent>
                  <RadioGroup value={deliveryMethod} onValueChange={(value: any) => setDeliveryMethod(value)}>
                    <div className="flex items-center space-x-3 border rounded-lg p-4 cursor-pointer hover:bg-gray-50">
                      <RadioGroupItem value="pickup" id="pickup" />
                      <Label htmlFor="pickup" className="flex-1 cursor-pointer">
                        <div className="flex items-center gap-2">
                          <Package className="h-5 w-5 text-brand-accent" />
                          <div>
                            <div className="font-semibold">{t('checkout.pickup')}</div>
                            <div className="text-sm text-gray-500">{t('checkout.pickupDescription')}</div>
                            <div className="text-xs text-gray-600 mt-1">
                              Via Cantonale 15, 6918 Figino, Svizzera
                            </div>
                          </div>
                        </div>
                      </Label>
                    </div>
                    
                    <div className="flex items-center space-x-3 border rounded-lg p-4 cursor-pointer hover:bg-gray-50">
                      <RadioGroupItem value="shipping" id="shipping" />
                      <Label htmlFor="shipping" className="flex-1 cursor-pointer">
                        <div className="flex items-center gap-2">
                          <Truck className="h-5 w-5 text-brand-accent" />
                          <div>
                            <div className="font-semibold">{t('checkout.shipping')}</div>
                            <div className="text-sm text-gray-500">{t('checkout.shippingDescription')}</div>
                          </div>
                        </div>
                      </Label>
                    </div>
                  </RadioGroup>

                  {/* Indirizzo di spedizione */}
                  {deliveryMethod === 'shipping' && (
                    <div className="mt-4 space-y-4 border-t pt-4">
                      <div>
                        <Label htmlFor="address">{t('checkout.address')} *</Label>
                        <Input
                          id="address"
                          name="address"
                          value={formData.address}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="city">{t('checkout.city')} *</Label>
                          <Input
                            id="city"
                            name="city"
                            value={formData.city}
                            onChange={handleInputChange}
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="postalCode">{t('checkout.postalCode')} *</Label>
                          <Input
                            id="postalCode"
                            name="postalCode"
                            value={formData.postalCode}
                            onChange={handleInputChange}
                            required
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Note aggiuntive */}
              <Card>
                <CardHeader>
                  <CardTitle>{t('checkout.notes')} ({t('checkout.optional')})</CardTitle>
                </CardHeader>
                <CardContent>
                  <textarea
                    name="notes"
                    value={formData.notes}
                    onChange={handleInputChange}
                    className="w-full border rounded-md p-3 min-h-[100px]"
                    placeholder={t('checkout.notesPlaceholder')}
                  />
                </CardContent>
              </Card>

              {/* Crea account (solo se non loggato) */}
              {!currentUser && (
                <Card>
                  <CardHeader>
                    <CardTitle>{t('checkout.createAccount')}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="createAccount"
                        checked={createAccount}
                        onCheckedChange={(checked) => setCreateAccount(checked as boolean)}
                      />
                      <Label htmlFor="createAccount" className="cursor-pointer">
                        {t('checkout.createAccountDescription')}
                      </Label>
                    </div>

                    {createAccount && (
                      <div className="space-y-4 border-t pt-4">
                        <div>
                          <Label htmlFor="password">{t('auth.password')} *</Label>
                          <div className="relative">
                            <Input
                              id="password"
                              name="password"
                              type={showPassword ? 'text' : 'password'}
                              value={formData.password}
                              onChange={handleInputChange}
                              required
                            />
                            <button
                              type="button"
                              onClick={() => setShowPassword(!showPassword)}
                              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                            >
                              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </button>
                          </div>
                          <p className="text-xs text-gray-500 mt-1">{t('auth.passwordMinLength')}</p>
                        </div>
                        <div>
                          <Label htmlFor="confirmPassword">{t('auth.confirmPassword')} *</Label>
                          <Input
                            id="confirmPassword"
                            name="confirmPassword"
                            type={showPassword ? 'text' : 'password'}
                            value={formData.confirmPassword}
                            onChange={handleInputChange}
                            required
                          />
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Colonna destra - Riepilogo ordine */}
            <div className="lg:col-span-1">
              <Card className="sticky top-24">
                <CardHeader>
                  <CardTitle>{t('checkout.orderSummary')}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Lista prodotti */}
                  <div className="space-y-3 border-b pb-4">
                    {items.map((item) => (
                      <div key={item.id} className="flex gap-3">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-16 h-16 object-cover rounded"
                        />
                        <div className="flex-1">
                          <p className="font-medium text-sm">{item.name}</p>
                          <p className="text-sm text-gray-500">
                            {item.quantity} x CHF {item.price.toFixed(2)}
                          </p>
                        </div>
                        <p className="font-semibold">
                          CHF {(item.price * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    ))}
                  </div>

                  {/* Totali */}
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>{t('checkout.subtotal')}</span>
                      <span>CHF {totalPrice.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>{t('checkout.shipping')}</span>
                      <span>
                        {deliveryMethod === 'pickup' 
                          ? t('checkout.free') 
                          : 'CHF 9.90'}
                      </span>
                    </div>
                    <div className="flex justify-between text-lg font-bold border-t pt-2">
                      <span>{t('checkout.total')}</span>
                      <span className="text-brand-accent">
                        CHF {(totalPrice + (deliveryMethod === 'shipping' ? 9.90 : 0)).toFixed(2)}
                      </span>
                    </div>
                  </div>

                  {/* Bottone procedi al pagamento */}
                  <Button
                    onClick={handleProceedToPayment}
                    disabled={loading}
                    className="w-full bg-brand-accent hover:bg-brand-accent/90"
                    size="lg"
                  >
                    {loading ? t('checkout.processing') : t('checkout.proceedToPayment')}
                  </Button>

                  <p className="text-xs text-gray-500 text-center">
                    Dopo la conferma verrai reindirizzato al pagamento sicuro SumUp
                  </p>
                </CardContent>
              </Card>
              </div>
            </div>
          ) : (
            /* Step 2: Pagamento */
            <div className="max-w-2xl mx-auto">
              <Button
                variant="ghost"
                onClick={() => setCurrentStep('form')}
                className="mb-6"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Torna ai dati ordine
              </Button>

              <SumUpPayment
                amount={totalPrice + (deliveryMethod === 'shipping' ? 9.90 : 0)}
                orderId={pendingOrderId || ''}
                description={`Ordine 3DMAKES - ${items.length} prodott${items.length === 1 ? 'o' : 'i'}`}
                customerEmail={formData.email}
                onSuccess={handlePaymentSuccess}
                onCancel={handlePaymentCancel}
              />

              {/* Riepilogo ordine durante pagamento */}
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle>Riepilogo Ordine</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {items.map((item, index) => (
                    <div key={index} className="flex gap-3">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-12 h-12 object-cover rounded"
                      />
                      <div className="flex-1">
                        <p className="text-sm font-medium">{item.name}</p>
                        <p className="text-xs text-gray-500">
                          {item.quantity} x CHF {item.price.toFixed(2)}
                        </p>
                      </div>
                    </div>
                  ))}
                  <div className="border-t pt-3 flex justify-between font-bold">
                    <span>Totale:</span>
                    <span className="text-brand-accent">
                      CHF {(totalPrice + (deliveryMethod === 'shipping' ? 9.90 : 0)).toFixed(2)}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ShopCheckout;

