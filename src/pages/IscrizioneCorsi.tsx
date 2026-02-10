import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { BookOpen, CheckCircle, GraduationCap, Users, Clock, Send } from "lucide-react";
import { useTranslation } from 'react-i18next';
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { addCourseRegistration } from "@/services/courseRegistrationService";
import { useToast } from "@/components/ui/use-toast";

const IscrizioneCorsi = () => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showExtra, setShowExtra] = useState(false);

  // Slot disponibili - Giovedì e Venerdì dalle 17:30 alle 21:30 (2 giorni consecutivi)
  const timeSlots = [
    { value: "6-7-marzo", label: "6-7 Marzo 2025 (Giovedì-Venerdì) - 17:30 - 21:30" },
    { value: "13-14-marzo", label: "13-14 Marzo 2025 (Giovedì-Venerdì) - 17:30 - 21:30" },
    { value: "20-21-marzo", label: "20-21 Marzo 2025 (Giovedì-Venerdì) - 17:30 - 21:30" },
    { value: "27-28-marzo", label: "27-28 Marzo 2025 (Giovedì-Venerdì) - 17:30 - 21:30" },
  ];

  if (isSubmitted) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow bg-brand-blue">
          <section className="py-16 md:py-24">
            <div className="container-custom">
              <div className="max-w-2xl mx-auto text-center">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-green-500/20 rounded-full mb-6 animate-bounce">
                  <CheckCircle className="w-10 h-10 text-green-400" />
                </div>
                <h1 className="text-4xl md:text-5xl font-black text-white mb-4">Iscrizione Ricevuta!</h1>
                <p className="text-gray-300 text-lg mb-8">
                  Grazie per il tuo interesse! Abbiamo ricevuto la tua richiesta di iscrizione al Corso Base di Stampa 3D.
                  Ti contatteremo entro 24-48 ore per confermare la tua partecipazione allo slot selezionato e fornirti
                  tutti i dettagli necessari.
                </p>
                <div className="bg-white/5 border border-white/10 rounded-lg p-6 mb-8 backdrop-blur-sm">
                  <p className="text-sm text-gray-300">
                    <strong className="text-white">Cosa succede ora?</strong><br />
                    1. Riceverai un'email di conferma<br />
                    2. Ti contatteremo per confermare data e orario<br />
                    3. Ti invieremo il materiale preparatorio
                  </p>
                </div>
                <Button 
                  onClick={() => window.location.href = '/'}
                  variant="secondary"
                >
                  Torna alla Home
                </Button>
              </div>
            </div>
          </section>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        {/* Hero + Caratteristiche + Form - Tutto su sfondo brand-blue */}
        <section className="bg-brand-blue py-16 md:py-24">
          <div className="container-custom">

            {/* Titolo */}
            <div className="max-w-4xl mx-auto text-center mb-16">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-brand-accent/20 rounded-full mb-6">
                <GraduationCap className="w-8 h-8 text-brand-accent" />
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white mb-4">
                CORSO BASE STAMPA 3D
              </h1>
              <p className="text-lg md:text-xl text-gray-300">
                Impara le basi della stampa 3D, dalla modellazione alla stampa finale con esperti del settore
              </p>
            </div>

            {/* Caratteristiche - 3 card glassmorphism */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
              <div className="bg-white/5 p-6 rounded-lg border border-white/10 backdrop-blur-sm flex flex-col items-center justify-center min-h-[200px]">
                <div className="inline-flex items-center justify-center w-14 h-14 bg-brand-accent/20 rounded-full mb-4">
                  <Users className="w-7 h-7 text-brand-accent" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">PICCOLI GRUPPI</h3>
                <p className="text-gray-400 text-sm text-center">
                  Max 6 partecipanti per garantire attenzione personalizzata
                </p>
              </div>
              <div className="bg-white/5 p-6 rounded-lg border border-white/10 backdrop-blur-sm flex flex-col items-center justify-center min-h-[200px]">
                <div className="inline-flex items-center justify-center w-14 h-14 bg-brand-accent/20 rounded-full mb-4">
                  <BookOpen className="w-7 h-7 text-brand-accent" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">PRATICA E TEORIA</h3>
                <p className="text-gray-400 text-sm text-center">
                  Approccio hands-on con progetti reali e materiale didattico
                </p>
              </div>
              <div className="bg-white/5 p-6 rounded-lg border border-white/10 backdrop-blur-sm flex flex-col items-center justify-center min-h-[200px]">
                <div className="inline-flex items-center justify-center w-14 h-14 bg-brand-accent/20 rounded-full mb-4">
                  <Clock className="w-7 h-7 text-brand-accent" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">2 SERE CONSECUTIVE</h3>
                <p className="text-gray-400 text-sm text-center">
                  8 ore totali su Giovedì e Venerdì sera (17:30 - 21:30)
                </p>
              </div>
            </div>

          </div>
        </section>

        {/* Sezione COSA IMPARERAI + Form - Sfondo chiaro */}
        <section className="py-16 md:py-24" style={{ backgroundColor: '#E5DDD3' }}>
          <div className="container-custom">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto items-start">
              
              {/* Colonna sinistra - Info sul corso */}
              <div>
                <h2 className="text-3xl md:text-4xl font-black text-brand-blue mb-6">
                  COSA IMPARERAI
                </h2>
                <div className="space-y-4 mb-8">
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-brand-accent/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-brand-accent text-sm font-bold">1</span>
                    </div>
                    <p className="text-gray-700">Introduzione alle tecnologie di stampa 3D (FDM, SLA)</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-brand-accent/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-brand-accent text-sm font-bold">2</span>
                    </div>
                    <p className="text-gray-700">Basi di modellazione 3D e preparazione file</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-brand-accent/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-brand-accent text-sm font-bold">3</span>
                    </div>
                    <p className="text-gray-700">Configurazione slicer e parametri di stampa</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-brand-accent/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-brand-accent text-sm font-bold">4</span>
                    </div>
                    <p className="text-gray-700">Stampa pratica: dalla calibrazione al prodotto finito</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-brand-accent/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-brand-accent text-sm font-bold">5</span>
                    </div>
                    <p className="text-gray-700">Post-produzione e finitura dei pezzi</p>
                  </div>
                </div>

                {/* Info lista */}
                <div>
                  <h3 className="font-bold text-brand-blue mb-3">Dettagli</h3>
                  <ul className="space-y-2 text-sm text-gray-700">
                    <li className="flex items-center gap-2">
                      <span className="text-brand-accent font-bold">✓</span> Durata: 8 ore su 2 sere
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-brand-accent font-bold">✓</span> Orario: 17:30 - 21:30
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-brand-accent font-bold">✓</span> Adatto a principianti
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-brand-accent font-bold">✓</span> Materiale didattico incluso
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-brand-accent font-bold">✓</span> Attestato di partecipazione
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-brand-accent font-bold">✓</span> Corsi personalizzati per aziende
                    </li>
                  </ul>
                </div>

                {/* Contatti */}
                <div className="mt-6 text-gray-600 text-sm">
                  <p>
                    Domande? Contattaci al{" "}
                    <a href="tel:+41762660396" className="text-brand-accent hover:underline font-semibold">+41 76 266 03 96</a>
                    {" "}o via email a{" "}
                    <a href="mailto:info@3dmakes.ch" className="text-brand-accent hover:underline font-semibold">info@3dmakes.ch</a>
                  </p>
                </div>
              </div>

              {/* Colonna destra - Form */}
              <div className="bg-white rounded-lg shadow-lg p-6 md:p-8 lg:mt-14">
                <h3 className="text-2xl font-bold text-brand-blue mb-6">Iscriviti Ora</h3>
                <form 
                  name="iscrizione-corsi" 
                  method="POST"
                  data-netlify="true" 
                  data-netlify-honeypot="bot-field"
                  className="space-y-5"
                  onSubmit={async (e) => {
                    e.preventDefault();
                    
                    if (isSubmitting) return;
                    setIsSubmitting(true);
                    
                    const formData = new FormData(e.target as HTMLFormElement);
                    const firstName = formData.get('firstName') as string;
                    const lastName = formData.get('lastName') as string;
                    const email = formData.get('email') as string;
                    const phone = formData.get('phone') as string;
                      const timeSlot = formData.get('timeSlot') as string;
                      const message = formData.get('message') as string;
                    
                    try {
                      try {
                        await addCourseRegistration({
                          firstName,
                          lastName,
                          email,
                          phone,
                          timeSlot,
                          message: message || undefined,
                          status: 'pending',
                        });
                        console.log('✓ Salvato in Firestore');
                      } catch (firestoreError) {
                        console.warn('⚠️ Firestore non disponibile, solo Netlify:', firestoreError);
                      }
                      
                      await fetch("/", {
                        method: "POST",
                        headers: { "Content-Type": "application/x-www-form-urlencoded" },
                        body: new URLSearchParams(formData as any).toString()
                      });
                      
                      setIsSubmitted(true);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    } catch (error) {
                      console.error('Error:', error);
                      toast({
                        title: "Errore",
                        description: "Si è verificato un errore durante l'invio. Riprova.",
                        variant: "destructive",
                      });
                    } finally {
                      setIsSubmitting(false);
                    }
                  }}
                >
                  <input type="hidden" name="form-name" value="iscrizione-corsi" />
                  <div className="hidden">
                    <Label htmlFor="bot-field">Non compilare questo campo</Label>
                    <Input id="bot-field" name="bot-field" />
                  </div>

                  {/* Nome e Cognome */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName" className="text-gray-700">Nome *</Label>
                      <Input 
                        id="firstName" 
                        name="firstName" 
                        type="text" 
                        required 
                        placeholder="Il tuo nome"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName" className="text-gray-700">Cognome *</Label>
                      <Input 
                        id="lastName" 
                        name="lastName" 
                        type="text" 
                        required 
                        placeholder="Il tuo cognome"
                      />
                    </div>
                  </div>

                  {/* Email e Telefono */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-gray-700">Email *</Label>
                      <Input 
                        id="email" 
                        name="email" 
                        type="email" 
                        required 
                        placeholder="tuoemail@esempio.com"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone" className="text-gray-700">Telefono *</Label>
                      <Input 
                        id="phone" 
                        name="phone" 
                        type="tel" 
                        required 
                        placeholder="+41 XX XXX XX XX"
                      />
                    </div>
                  </div>

                  {/* Slot Orario - trigger per espandere */}
                  <div className="space-y-2">
                    <Label htmlFor="timeSlot" className="text-gray-700">Seleziona Date e Orario *</Label>
                    <select
                      id="timeSlot"
                      name="timeSlot"
                      required
                      value={selectedSlot}
                      onChange={(e) => { setSelectedSlot(e.target.value); setShowExtra(true); }}
                      onFocus={() => setShowExtra(true)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-accent focus:border-transparent"
                    >
                      <option value="">Seleziona uno slot disponibile</option>
                      {timeSlots.map((slot) => (
                        <option key={slot.value} value={slot.value}>
                          {slot.label}
                        </option>
                      ))}
                    </select>
                    <p className="text-xs text-gray-500">
                      2 giorni consecutivi (8 ore totali). Posti limitati a 6 partecipanti.
                    </p>
                  </div>

                  {/* Campi extra che appaiono quando si tocca lo slot */}
                  <div 
                    className={`space-y-5 transition-all duration-500 ease-in-out overflow-hidden ${
                      showExtra ? 'max-h-[800px] opacity-100' : 'max-h-0 opacity-0'
                    }`}
                  >
                    {/* Note */}
                    <div className="space-y-2">
                      <Label htmlFor="message" className="text-gray-700">Note / Domande (opzionale)</Label>
                      <Textarea 
                        id="message" 
                        name="message" 
                        rows={3}
                        placeholder="Hai domande specifiche sul corso?"
                      />
                    </div>

                    {/* Privacy */}
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                      <div className="flex items-start space-x-3">
                        <input 
                          type="checkbox" 
                          id="privacy" 
                          name="privacy" 
                          required
                          className="mt-1 accent-brand-accent"
                        />
                        <Label htmlFor="privacy" className="text-sm text-gray-600 cursor-pointer">
                          Acconsento al trattamento dei miei dati personali secondo la Privacy Policy di 3D Makes *
                        </Label>
                      </div>
                    </div>

                    {/* Submit */}
                    <Button 
                      type="submit" 
                      className="w-full bg-brand-accent hover:bg-brand-accent/80 text-white text-lg py-6"
                      disabled={isSubmitting}
                    >
                      <Send className="w-5 h-5 mr-2" />
                      {isSubmitting ? "Invio in corso..." : "Invia Richiesta di Iscrizione"}
                    </Button>

                    <p className="text-xs text-center text-gray-500">
                      * Campi obbligatori
                    </p>
                  </div>
                </form>
              </div>
            </div>

          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default IscrizioneCorsi;
