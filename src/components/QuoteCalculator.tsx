import React, { useState, useCallback, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { Card, CardContent } from "@/components/ui/card";
import { ModelViewerPreventivo } from "@/components/ModelViewer";
import { useAuth } from "@/firebase/AuthContext";
import { useTranslation } from 'react-i18next';
import { db, storage } from "@/firebase/config";
import { collection, addDoc, Timestamp } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth } from "@/firebase/config";
import { doc, setDoc } from "firebase/firestore";
import { CheckCircle, Upload, Eye, EyeOff } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { useNavigate } from "react-router-dom";
import { sendAdminNotificationEmail } from "@/utils/emailService";

// Costanti per i limiti e configurazioni
const MAX_FILE_SIZE = 100 * 1024 * 1024; // 100MB

const QuoteCalculator = () => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Stato del file
  const [file, setFile] = useState<File | null>(null);
  const [fileType, setFileType] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [modelDims, setModelDims] = useState<{ x: number; y: number; z: number } | null>(null);
  
  // Stato del form
  const [formData, setFormData] = useState({
    nome: "",
    cognome: "",
    email: "",
    telefono: "",
    password: "",
    wantsAccount: false,
    notes: "",
    quantity: 1
  });
  
  // Stato per la sottomissione
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Pre-compila i dati se l'utente è loggato
  useEffect(() => {
    if (currentUser) {
      setFormData(prev => ({
        ...prev,
        email: currentUser.email || "",
        nome: currentUser.displayName?.split(' ')[0] || "",
        cognome: currentUser.displayName?.split(' ').slice(1).join(' ') || "",
      }));
    }
  }, [currentUser]);

  // Handler per il caricamento del file
  const processFile = (f: File) => {
    setError(null);
    setIsLoading(true);
    
    if (f.size > MAX_FILE_SIZE) {
      setError(`File troppo grande (max ${Math.round(MAX_FILE_SIZE/1024/1024)}MB). Per file più grandi, contattaci.`);
        setIsLoading(false);
        return;
      }
      
    const ext = f.name.split(".").pop()?.toLowerCase() ?? "";
    
    console.log("File caricato:", f.name, "Tipo:", ext, "Dimensione:", f.size);
    
    setFileType(ext);
    setFile(f);
      
      toast({
      title: "File caricato",
      description: `${f.name} caricato con successo`,
      variant: "default",
      });
      
      setIsLoading(false);
  };

  // Handler per l'input file tradizionale
  const handleFileChange = useCallback(
    (evt: React.ChangeEvent<HTMLInputElement>) => {
      const f = evt.target.files?.[0];
      if (f) {
        processFile(f);
      }
    },
    []
  );

  // Handlers per drag & drop
  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDragEnter = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      processFile(files[0]);
    }
  }, []);

  // Handler per i campi del form
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseInt(value) || 1 : value
    }));
  };

  // Handler per la checkbox
  const handleWantsAccountChange = (checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      wantsAccount: checked
    }));
  };

  // Funzione per caricare il file su Firebase Storage
  const uploadFileToStorage = async (file: File): Promise<string> => {
    const timestamp = Date.now();
    const safeFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
    const storagePath = `quote-requests/${timestamp}_${safeFileName}`;
    const storageRef = ref(storage, storagePath);
    
    await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(storageRef);
    
    return downloadURL;
  };

  // Funzione per creare un account (se richiesto)
  const createAccount = async () => {
    if (!formData.wantsAccount || !formData.password) {
      return null;
    }

    if (formData.password.length < 6) {
      throw new Error("La password deve essere di almeno 6 caratteri");
    }

    try {
      // Crea l'utente
      const userCredential = await createUserWithEmailAndPassword(
        auth, 
        formData.email, 
        formData.password
      );
      const user = userCredential.user;

      // Aggiorna il profilo dell'utente
      await updateProfile(user, {
        displayName: `${formData.nome} ${formData.cognome}`
      });

      // Salva i dati aggiuntivi in Firestore
      await setDoc(doc(db, "users", user.uid), {
        nome: formData.nome,
        cognome: formData.cognome,
        email: formData.email,
        telefono: formData.telefono,
        createdAt: new Date(),
        isAdmin: false
      });

      return user;
    } catch (err: any) {
      if (err.code === "auth/email-already-in-use") {
        throw new Error("Email già in uso. Effettua il login o usa un'altra email.");
      } else if (err.code === "auth/invalid-email") {
        throw new Error("Email non valida");
      } else {
        throw new Error("Errore durante la creazione dell'account: " + err.message);
      }
    }
  };

  // Funzione per sottomettere la richiesta di preventivo
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validazioni
    if (!file) {
      setError("Carica un file per richiedere un preventivo");
      return;
    }
    
    if (!formData.nome || !formData.cognome || !formData.email || !formData.telefono) {
      setError("Compila tutti i campi obbligatori");
      return;
    }

    if (formData.wantsAccount && !currentUser && !formData.password) {
      setError("Inserisci una password per creare l'account");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      // 1. Se l'utente vuole creare un account e non è loggato, crealo
      let userId = currentUser?.uid;
      if (formData.wantsAccount && !currentUser) {
        const newUser = await createAccount();
        userId = newUser?.uid;
      }

      // 2. Carica il file su Firebase Storage
      const fileUrl = await uploadFileToStorage(file);

      // 3. Crea il documento della richiesta di preventivo
      const quoteRequest = {
        nome: formData.nome,
        cognome: formData.cognome,
        email: formData.email,
        telefono: formData.telefono,
        fileName: file.name,
        fileUrl: fileUrl,
        fileType: fileType,
        fileDimensions: modelDims,
        notes: formData.notes,
        quantity: formData.quantity,
        status: 'pending',
        createdAt: Timestamp.now(),
        userId: userId || null,
        hasAccount: !!userId,
      };

      await addDoc(collection(db, 'quoteRequests'), quoteRequest);

      // 4. Invia email di notifica all'admin
      try {
        await sendAdminNotificationEmail({
          type: 'new_quote_request',
          details: `Nuova richiesta di preventivo da ${formData.nome} ${formData.cognome}`,
          userInfo: `
            Cliente: ${formData.nome} ${formData.cognome}
            Email: ${formData.email}
            Telefono: ${formData.telefono}
            File: ${file.name}
            Quantità richiesta: ${formData.quantity}
            ${formData.notes ? `Note: ${formData.notes}` : ''}
            ${userId ? 'Utente con account registrato' : 'Utente senza account'}
          `
        });
        console.log('Email di notifica admin inviata');
      } catch (emailError) {
        console.error('Errore invio email admin:', emailError);
        // Non blocchiamo l'operazione se l'email fallisce
      }

      // 5. Mostra successo
      setSubmitSuccess(true);
          
          toast({
        title: "Richiesta inviata con successo!",
        description: "Ti contatteremo entro 24 ore per il preventivo",
            variant: "default",
          });

      // Se ha creato un account, reindirizza alla dashboard dopo 3 secondi
      if (formData.wantsAccount && userId) {
        setTimeout(() => {
          navigate('/dashboard');
        }, 3000);
      }

    } catch (err: any) {
      console.error("Errore durante l'invio:", err);
      setError(err.message || "Errore durante l'invio della richiesta");
      
      toast({
        title: "Errore",
        description: err.message || "Errore durante l'invio della richiesta",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // Se la richiesta è stata inviata con successo, mostra il messaggio di conferma
  if (submitSuccess) {
    return (
      <div className="space-y-8 px-0 max-w-full mx-auto">
        <div className="bg-white rounded-lg shadow-md border border-gray-100 overflow-hidden w-full">
          <div className="p-8 md:p-12">
            <div className="text-center space-y-6">
              <div className="flex justify-center">
                <div className="rounded-full bg-green-100 p-6">
                  <CheckCircle className="h-16 w-16 text-green-600" />
                </div>
              </div>
              
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-3">
                  Richiesta inviata con successo!
                </h2>
                <p className="text-xl text-gray-600 mb-6">
                  Ti contatteremo entro 24 ore per fornirti un preventivo personalizzato
                </p>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <h3 className="font-semibold text-blue-900 mb-2">📧 Controlla la tua email</h3>
                <p className="text-blue-800">
                  Riceverai una conferma a <strong>{formData.email}</strong>
                </p>
              </div>

              {formData.wantsAccount && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                  <h3 className="font-semibold text-green-900 mb-2">✅ Account creato</h3>
                  <p className="text-green-800 mb-4">
                    Il tuo account è stato creato con successo. Sarai reindirizzato alla dashboard...
                  </p>
                </div>
              )}

              <div className="pt-6 space-y-3">
                <Button 
                  onClick={() => navigate('/dashboard')}
                  className="w-full"
                  size="lg"
                >
                  Vai alla Dashboard
                </Button>
                <Button 
                  onClick={() => {
                    setSubmitSuccess(false);
                    setFile(null);
                    setFormData({
                      nome: "",
                      cognome: "",
                      email: "",
                      telefono: "",
                      password: "",
                      wantsAccount: false,
                      notes: "",
                      quantity: 1
                    });
                  }}
                  variant="outline"
                  className="w-full"
                >
                  Nuova richiesta
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 px-0 max-w-full mx-auto">
      <div className="bg-white rounded-lg shadow-md border border-gray-100 overflow-hidden w-full">
        <div className="p-4 md:p-6 lg:p-8">
          <h3 className="text-2xl font-semibold mb-6">Richiedi un preventivo</h3>
          
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Sezione caricamento file */}
            <div className="space-y-4">
              <h4 className="text-lg font-medium">1. Carica il tuo file</h4>
              
              <Card 
                className={`h-[450px] flex flex-col items-center justify-center border-2 ${isDragging ? 'border-brand-accent bg-brand-accent/5' : 'border-dashed'} relative`}
                onDragOver={handleDragOver}
                onDragEnter={handleDragEnter}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                <CardContent className="flex flex-col items-center justify-center h-full w-full p-6">
                  {isLoading ? (
                    <div className="flex flex-col items-center justify-center h-full">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-blue"></div>
                      <p className="mt-4 text-brand-gray">Caricamento...</p>
                    </div>
                  ) : file ? (
                    <div className="w-full h-full">
                      <ModelViewerPreventivo 
                        file={file} 
                        fileType={fileType} 
                        onDimensions={(dims) => setModelDims(dims)}
                        scaleFactor={1}
                      />
                      <div className="absolute bottom-2 left-0 right-0 text-center bg-white/70 p-2 backdrop-blur-sm">
                        <p className="text-brand-blue font-medium">{file?.name}</p>
                        {modelDims && (
                        <p className="text-xs text-gray-500">
                            Dimensioni: {modelDims.x.toFixed(2)}×{modelDims.y.toFixed(2)}×{modelDims.z.toFixed(2)} mm
                          </p>
                        )}
                        <Button 
                          type="button"
                          variant="outline" 
                          size="sm" 
                          className="mt-2"
                          onClick={triggerFileInput}
                        >
                          Cambia file
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="text-brand-blue text-4xl mb-4">
                        <Upload className="h-20 w-20" />
                      </div>
                      <p className="text-xl font-medium text-brand-blue mb-2">Carica il tuo file</p>
                      <p className="text-sm text-gray-500 text-center mb-4">
                        Trascina e rilascia il file qui
                        <br />
                        <span className="text-xs text-brand-accent">
                          Accettiamo tutti i formati di file (STL, OBJ, STEP, DXF, ecc.)
                        </span>
                      </p>
                      <Button type="button" onClick={triggerFileInput}>
                        Seleziona file
                      </Button>
                    </>
                  )}
                </CardContent>
              </Card>

              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="*"
                className="hidden"
              />
            </div>
            
            {/* Sezione dati contatto */}
            <div className="space-y-4">
              <h4 className="text-lg font-medium">2. I tuoi dati di contatto</h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="nome">Nome *</Label>
                  <Input
                    id="nome"
                    name="nome"
                    type="text"
                    required
                    value={formData.nome}
                    onChange={handleInputChange}
                    disabled={!!currentUser}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="cognome">Cognome *</Label>
                  <Input
                    id="cognome"
                    name="cognome"
                    type="text"
                    required
                    value={formData.cognome}
                    onChange={handleInputChange}
                    disabled={!!currentUser}
                    className="mt-1"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleInputChange}
                  disabled={!!currentUser}
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="telefono">Telefono *</Label>
                <Input
                  id="telefono"
                  name="telefono"
                  type="tel"
                  required
                  value={formData.telefono}
                  onChange={handleInputChange}
                  className="mt-1"
                  placeholder="+41 XX XXX XX XX"
                />
              </div>

              <div>
                <Label htmlFor="quantity">Quantità richiesta *</Label>
                <Input
                  id="quantity"
                  name="quantity"
                  type="number"
                  min="1"
                  required
                  value={formData.quantity}
                  onChange={handleInputChange}
                  className="mt-1"
                  placeholder="Numero di pezzi desiderati"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Indica quanti pezzi desideri realizzare
                </p>
              </div>

              <div>
                <Label htmlFor="notes">Note aggiuntive</Label>
                <Textarea
                  id="notes"
                  name="notes"
                  value={formData.notes}
                  onChange={handleInputChange}
                  className="mt-1"
                  placeholder="Inserisci eventuali note, richieste specifiche o dettagli aggiuntivi..."
                  rows={4}
                />
                <p className="text-xs text-gray-500 mt-1">
                  Specifica colori, materiali preferiti, finiture o altre richieste particolari
                </p>
              </div>
            </div>

            {/* Sezione creazione account (solo se non loggato) */}
            {!currentUser && (
              <div className="space-y-4 p-6 bg-gray-50 rounded-lg border border-gray-200">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="wantsAccount"
                    checked={formData.wantsAccount}
                    onCheckedChange={handleWantsAccountChange}
                  />
                  <Label 
                    htmlFor="wantsAccount"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                  >
                    Crea un account per accedere all'area clienti
                  </Label>
                </div>

                {formData.wantsAccount && (
                  <div className="mt-4 space-y-4">
                    <div className="bg-blue-50 border border-blue-200 rounded p-3">
                      <p className="text-sm text-blue-800">
                        💡 Con un account potrai vedere tutti i tuoi ordini, messaggi e file in un unico posto
                      </p>
                    </div>
                    
                    <div>
                      <Label htmlFor="password">Password *</Label>
                      <div className="relative mt-1">
                        <Input
                          id="password"
                          name="password"
                          type={showPassword ? "text" : "password"}
                          required={formData.wantsAccount}
                          value={formData.password}
                          onChange={handleInputChange}
                          className="pr-10"
                          placeholder="Minimo 6 caratteri"
                        />
                        <button
                          type="button"
                          className="absolute inset-y-0 right-0 pr-3 flex items-center"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? (
                            <EyeOff className="h-4 w-4 text-gray-400 hover:text-gray-600" />
                          ) : (
                            <Eye className="h-4 w-4 text-gray-400 hover:text-gray-600" />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

              {/* Messaggio informativo */}
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-blue-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-blue-800">
                    Ti contatteremo entro 24 ore
                    </h3>
                    <div className="mt-2 text-sm text-blue-700">
                      <p>
                      Dopo aver ricevuto la tua richiesta, il nostro team analizzerà il file e ti invierà 
                      un preventivo personalizzato entro 24 ore lavorative. Riceverai una notifica via email.
                    </p>
                  </div>
                </div>
              </div>
            </div>
              
              {/* Errore */}
              {error && (
              <div className="p-4 bg-red-50 rounded-lg border border-red-100">
                  <p className="text-red-700">
                  <span className="font-semibold">Errore:</span> {error}
                  </p>
                </div>
              )}

            {/* Bottone invio */}
              <Button 
              type="submit"
              disabled={isSubmitting || !file}
              className="w-full"
              size="lg"
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                  Invio in corso...
                    </>
              ) : (
                'Invia richiesta preventivo'
              )}
              </Button>
          </form>
        </div>
      </div>
      
      {/* Sezione informativa */}
      <div className="bg-white rounded-lg shadow-md border border-gray-100 overflow-hidden">
        <div className="p-6 md:p-8">
          <h3 className="text-2xl font-semibold mb-8">Come funziona</h3>
          
          <ul className="space-y-6">
            <li className="flex">
              <div className="flex-shrink-0 h-10 w-10 flex items-center justify-center rounded-full bg-brand-accent/10 text-brand-accent mr-4">
                1
              </div>
              <div>
                <h4 className="font-semibold mb-1">Carica il tuo file</h4>
                <p className="text-brand-gray">
                  Carica qualsiasi tipo di file (STL, OBJ, STEP, DXF, PDF, ecc.). 
                  Accettiamo tutti i formati più comuni per stampa 3D e taglio laser.
                </p>
              </div>
            </li>
            <li className="flex">
              <div className="flex-shrink-0 h-10 w-10 flex items-center justify-center rounded-full bg-brand-accent/10 text-brand-accent mr-4">
                2
              </div>
              <div>
                <h4 className="font-semibold mb-1">Compila i tuoi dati</h4>
                <p className="text-brand-gray">
                  Inserisci i tuoi dati di contatto. Opzionalmente, puoi creare un account 
                  per tenere traccia dei tuoi progetti e ordini.
                </p>
              </div>
            </li>
            <li className="flex">
              <div className="flex-shrink-0 h-10 w-10 flex items-center justify-center rounded-full bg-brand-accent/10 text-brand-accent mr-4">
                3
              </div>
              <div>
                <h4 className="font-semibold mb-1">Ricevi il preventivo</h4>
                <p className="text-brand-gray">
                  Entro 24 ore lavorative riceverai un preventivo personalizzato via email,
                  con tutti i dettagli su costi, tempi di produzione e opzioni disponibili.
                </p>
              </div>
            </li>
            <li className="flex">
              <div className="flex-shrink-0 h-10 w-10 flex items-center justify-center rounded-full bg-brand-accent/10 text-brand-accent mr-4">
                4
              </div>
              <div>
                <h4 className="font-semibold mb-1">Conferma e produzione</h4>
                <p className="text-brand-gray">
                  Se il preventivo ti soddisfa, conferma l'ordine. Inizieremo immediatamente
                  la produzione e potrai seguire lo stato in tempo reale.
                </p>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default QuoteCalculator;
