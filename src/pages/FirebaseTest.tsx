import React, { useState } from 'react';
import { useAuth } from '@/firebase/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useTranslation } from 'react-i18next';
import {
  sendWelcomeEmail,
  sendAdminNotificationEmail,
  sendCourseRegistrationConfirmationEmail
} from '@/utils/emailService';
import emailjs from '@emailjs/browser';

const FirebaseTest = () => {
  const { t } = useTranslation();
  const { currentUser, userData, loading } = useAuth();
  const [emailLoading, setEmailLoading] = useState(false);
  const [emailStatus, setEmailStatus] = useState<string>('');

    const testWelcomeEmail = async () => {
    if (!currentUser || !userData) return;
    
    setEmailLoading(true);
    setEmailStatus('Invio email di benvenuto...');
    
    try {
      const success = await sendWelcomeEmail({
        email: currentUser.email || '',
        nome: userData.nome || 'Test',
        cognome: userData.cognome || 'User'
      });
      
      setEmailStatus(success ? '✅ Email di benvenuto inviata con successo!' : '❌ Errore nell\'invio dell\'email di benvenuto');
    } catch (error) {
      setEmailStatus(`❌ Errore: ${error}`);
    } finally {
      setEmailLoading(false);
    }
  };

  const testAdminEmail = async () => {
    setEmailLoading(true);
    setEmailStatus('Invio notifica admin...');
    
    try {
      const success = await sendAdminNotificationEmail({
        type: 'new_order',
        details: 'Test di notifica admin dal FirebaseTest',
        userInfo: `Cliente: ${userData?.nome || ''} ${userData?.cognome || ''} (${currentUser?.email || 'test@example.com'})`
      });
      
      setEmailStatus(success ? '✅ Notifica admin inviata con successo!' : '❌ Errore nell\'invio della notifica admin');
    } catch (error) {
      setEmailStatus(`❌ Errore: ${error}`);
    } finally {
      setEmailLoading(false);
    }
  };

  const testCourseRegistrationEmail = async () => {
    if (!currentUser || !userData) return;

    setEmailLoading(true);
    setEmailStatus('Invio email conferma iscrizione corso...');

    try {
      const success = await sendCourseRegistrationConfirmationEmail({
        userEmail: currentUser.email || '',
        firstName: userData.nome || 'Test',
        lastName: userData.cognome || 'User',
        timeSlot: '16-17 Aprile 2026 (Giovedi-Venerdi) - 17:30 - 21:30',
        paymentMethod: 'TWINT',
        registrationId: `test-course-${Date.now()}`
      });

      setEmailStatus(success ? '✅ Email conferma iscrizione corso inviata con successo!' : '❌ Errore nell\'invio email conferma iscrizione corso');
    } catch (error) {
      setEmailStatus(`❌ Errore: ${error}`);
    } finally {
      setEmailLoading(false);
    }
  };

  const testSimpleEmail = async () => {
    setEmailLoading(true);
    setEmailStatus('Test connessione EmailJS...');
    
    try {
      // Inizializza EmailJS
      emailjs.init('y0Ulz-qSVjiET74Lx');
      
      // Test molto semplice con il template Order Confirmation
      const result = await emailjs.send(
        'service_z5mjon2',
        'template_rg7rn3i', 
        {
          email: 'info@3dmakes.ch',
          to_name: 'Test User',
          from_name: '3DMAKES Test',
          order_id: 'TEST_123',
          order_details: 'Test Order Details',
          quote_price: '25.00 CHF',
          delivery_date: '3-5 giorni'
        },
        'y0Ulz-qSVjiET74Lx'
      );
      
      console.log('EmailJS Response:', result);
      setEmailStatus(`✅ Test semplice riuscito! Status: ${result.status}, Text: ${result.text}`);
    } catch (error: any) {
      console.error('Errore test semplice:', error);
      setEmailStatus(`❌ Errore test semplice: ${error.text || error.message || error}`);
    } finally {
      setEmailLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">{t('common.loading')}</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6">Firebase Test</h1>
      
      <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4 mb-6">
        <h2 className="text-lg font-semibold text-yellow-800 mb-2">{t('firebaseTest.developerNotes')}</h2>
        <ul className="list-disc list-inside text-yellow-700 text-sm space-y-1">
          <li>{t('firebaseTest.firestoreRules')}</li>
          <li>{t('firebaseTest.adminEmail')}</li>
          <li>{t('firebaseTest.storageRules')}</li>
        </ul>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>{t('firebaseTest.authStatus')}</CardTitle>
            <CardDescription>{t('firebaseTest.currentAuthState')}</CardDescription>
          </CardHeader>
          <CardContent>
            {currentUser ? (
              <div className="space-y-2">
                <p><strong>UID:</strong> {currentUser.uid}</p>
                <p><strong>{t('auth.email')}:</strong> {currentUser.email}</p>
                <p><strong>{t('firebaseTest.displayName')}:</strong> {currentUser.displayName || 'N/A'}</p>
                <p><strong>{t('firebaseTest.emailVerified')}:</strong> {currentUser.emailVerified ? t('common.yes') : t('common.no')}</p>
              </div>
            ) : (
              <p>{t('firebaseTest.notAuthenticated')}</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t('firebaseTest.firestoreData')}</CardTitle>
            <CardDescription>{t('firebaseTest.userDataFromFirestore')}</CardDescription>
          </CardHeader>
          <CardContent>
            {userData ? (
              <div className="space-y-2">
                <p><strong>{t('common.name')}:</strong> {userData.nome || 'N/A'}</p>
                <p><strong>{t('auth.surname')}:</strong> {userData.cognome || 'N/A'}</p>
                <p><strong>{t('auth.email')}:</strong> {userData.email || 'N/A'}</p>
                <p><strong>{t('common.phone')}:</strong> {userData.telefono || 'N/A'}</p>
                <p><strong>Admin:</strong> {userData.isAdmin ? t('common.yes') : t('common.no')}</p>
              </div>
            ) : (
              <p>{t('firebaseTest.noUserData')}</p>
            )}
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Test EmailJS</CardTitle>
            <CardDescription>Testa l'invio di email tramite EmailJS</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex flex-wrap gap-2">
                <Button 
                  onClick={testWelcomeEmail} 
                  disabled={emailLoading || !currentUser || !userData}
                  variant="outline"
                >
                  Test Email Benvenuto
                </Button>
                <Button 
                  onClick={testAdminEmail} 
                  disabled={emailLoading}
                  variant="outline"
                >
                  Test Notifica Admin
                </Button>
                <Button 
                  onClick={testCourseRegistrationEmail}
                  disabled={emailLoading || !currentUser || !userData}
                  variant="outline"
                >
                  Test Conferma Iscrizione Corso
                </Button>
                <Button 
                  onClick={testSimpleEmail} 
                  disabled={emailLoading}
                  variant="outline"
                >
                  Test Connessione EmailJS
                </Button>
              </div>
              
              {emailStatus && (
                <div className={`p-3 rounded-md text-sm ${
                  emailStatus.includes('✅') 
                    ? 'bg-green-50 text-green-800 border border-green-200' 
                    : emailStatus.includes('❌')
                    ? 'bg-red-50 text-red-800 border border-red-200'
                    : 'bg-blue-50 text-blue-800 border border-blue-200'
                }`}>
                  {emailStatus}
                </div>
              )}
              
              <div className="text-xs text-gray-500 space-y-1">
                <p><strong>Service ID:</strong> service_z5mjon2</p>
                <p><strong>Template Welcome:</strong> template_xq7429h</p>
                <p><strong>Template Corso:</strong> template_rg7rn3i</p>
                <p><strong>Public Key:</strong>y0Ulz-qSVjiET74Lx</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default FirebaseTest; 