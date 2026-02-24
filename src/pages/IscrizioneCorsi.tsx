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

  // Slot disponibili - Giovedì e Venerdì dalle 17:30 alle 21:30 (2 giorni consecutivi)
  const timeSlots = [
    { value: "5-6-marzo", label: "5-6 Marzo 2025 (Giovedì-Venerdì) - 17:30 - 21:30" },
    { value: "12-13-marzo", label: "12-13 Marzo 2025 (Giovedì-Venerdì) - 17:30 - 21:30" },
    { value: "26-27-marzo", label: "26-27 Marzo 2025 (Giovedì-Venerdì) - 17:30 - 21:30" },
    { value: "2-3-aprile", label: "2-3 Aprile 2025 (Giovedì-Venerdì) - 17:30 - 21:30" },
    { value: "9-10-aprile", label: "9-10 Aprile 2025 (Giovedì-Venerdì) - 17:30 - 21:30" },
    { value: "16-17-aprile", label: "16-17 Aprile 2025 (Giovedì-Venerdì) - 17:30 - 21:30" },
    { value: "23-24-aprile", label: "23-24 Aprile 2025 (Giovedì-Venerdì) - 17:30 - 21:30" },
    { value: "30-1-aprile", label: "30-1 Aprile 2025 (Giovedì-Venerdì) - 17:30 - 21:30" },
    { value: "7-8-maggio", label: "7-8 Maggio 2025 (Giovedì-Venerdì) - 17:30 - 21:30" },
    { value: "14-15-maggio", label: "14-15 Maggio 2025 (Giovedì-Venerdì) - 17:30 - 21:30" },
    { value: "21-22-maggio", label: "21-22 Maggio 2025 (Giovedì-Venerdì) - 17:30 - 21:30" },
    { value: "28-29-maggio", label: "28-29 Maggio 2025 (Giovedì-Venerdì) - 17:30 - 21:30" },
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

        {/* Sezione Programma del Corso - Full Width */}
        <section className="py-16 md:py-6" style={{ backgroundColor: '#E5DDD3' }}>
          <div className="container-custom">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-black text-brand-blue mb-3 text-center">
                PROGRAMMA DEL CORSO
              </h2>
              <p className="text-gray-600 mb-10 italic text-center text-lg">
                Dal setup alla stampa: metodo pratico, esempi reali.
              </p>
              
              {/* 4 Moduli in Griglia 2x2 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">
                
                {/* Modulo 1 - Sicurezza */}
                <div className="bg-white rounded-lg p-5 shadow-sm border border-gray-200">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 rounded-full bg-brand-accent flex items-center justify-center flex-shrink-0">
                      <span className="text-white text-lg font-bold">1h</span>
                    </div>
                    <h3 className="text-lg font-bold text-brand-blue">Sicurezza & DPI</h3>
                  </div>
                  <ul className="space-y-1.5 text-sm text-gray-700">
                    <li>• Rischi FDM/SLA e contatto materiali</li>
                    <li>• DPI: guanti, occhiali, mascherine</li>
                    <li>• Setup postazione sicura</li>
                  </ul>
                </div>

                {/* Modulo 2 - FDM */}
                <div className="bg-white rounded-lg p-5 shadow-sm border border-gray-200">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 rounded-full bg-brand-accent flex items-center justify-center flex-shrink-0">
                      <span className="text-white text-lg font-bold">3h</span>
                    </div>
                    <h3 className="text-lg font-bold text-brand-blue">Stampa FDM</h3>
                  </div>
                  <ul className="space-y-1.5 text-sm text-gray-700">
                    <li>• Materiali: PLA, PETG, TPU, ASA/ABS</li>
                    <li>• Hardware: nozzle, piatto, calibrazioni</li>
                    <li>• Slicing e supports</li>
                    <li>• Troubleshooting completo</li>
                  </ul>
                </div>

                {/* Modulo 3 - SLA */}
                <div className="bg-white rounded-lg p-5 shadow-sm border border-gray-200">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 rounded-full bg-brand-accent flex items-center justify-center flex-shrink-0">
                      <span className="text-white text-lg font-bold">3h</span>
                    </div>
                    <h3 className="text-lg font-bold text-brand-blue">Stampa SLA</h3>
                  </div>
                  <ul className="space-y-1.5 text-sm text-gray-700">
                    <li>• Resine: standard/tough/flexible</li>
                    <li>• Parametri: temperatura, esposizione</li>
                    <li>• Orientamento e supports</li>
                    <li>• Wash & cure workflow</li>
                  </ul>
                </div>

                {/* Modulo 4 - Tecniche */}
                <div className="bg-white rounded-lg p-5 shadow-sm border border-gray-200">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 rounded-full bg-brand-accent flex items-center justify-center flex-shrink-0">
                      <span className="text-white text-lg font-bold">1h</span>
                    </div>
                    <h3 className="text-lg font-bold text-brand-blue">Tecniche & Consigli</h3>
                  </div>
                  <ul className="space-y-1.5 text-sm text-gray-700">
                    <li>• FDM vs SLA: quando usare cosa</li>
                    <li>• Finiture e post-produzione</li>
                    <li>• Tolleranze e accoppiamenti</li>
                    <li>• Q&A pezzi reali</li>
                  </ul>
                </div>
              </div>

              {/* Dettagli Corso - Lista compatta */}
              <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                <h3 className="font-bold text-brand-blue mb-4 text-lg">📋 Cosa Include</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2 text-sm text-gray-700">
                  <div className="flex items-center gap-2">
                    <span className="text-brand-accent font-bold">✓</span> Durata: 8 ore su 2 sere
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-brand-accent font-bold">✓</span> Orario: 17:30 - 21:30
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-brand-accent font-bold">✓</span> Max 6 partecipanti
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-brand-accent font-bold">✓</span> Adatto a principianti
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-brand-accent font-bold">✓</span> Materiale didattico incluso
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-brand-accent font-bold">✓</span> Attestato di partecipazione
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Sezione Prezzo e Form - Su sfondo chiaro */}
        <section className="py-16 md:py-20" style={{ backgroundColor: '#E5DDD3' }}>
          <div className="container-custom">
            <div className="max-w-5xl mx-auto">
              
              {/* Prezzo in evidenza */}
              <div className="grid grid-cols-1 gap-6 mb-10">
                
                {/* Banner Offerta Limitata */}
                <div className="relative">
                  <div className="absolute -top-3 left-4 bg-red-600 text-white px-4 py-1 rounded-full text-xs font-bold uppercase shadow-md z-10">
                    Solo primi 12 posti
                  </div>
                  <div className="border-2 border-brand-accent rounded-lg p-6 bg-white shadow-md h-full">
                    <div className="text-center">
                      <p className="text-gray-600 text-sm font-semibold mb-3 mt-2">Prezzo Early Bird</p>
                      <div className="flex items-center justify-center gap-3 mb-3">
                        <span className="text-gray-400 line-through text-2xl font-bold">550</span>
                        <span className="text-brand-accent text-5xl font-black">450</span>
                        <span className="text-gray-700 text-xl font-bold">CHF</span>
                      </div>
                      <p className="text-green-600 font-semibold text-sm mb-3">
                        💰 Risparmi 100 CHF
                      </p>
                      <div className="border-t border-gray-200 pt-3">
                        <p className="text-xs text-gray-500">
                          ⚡ Posti limitati - Iscriviti ora!
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

              </div>

              {/* Form Iscrizione - Full Width */}
              <div className="bg-white rounded-lg shadow-lg p-6 md:p-8">
                <div className="text-center mb-8">
                  <h3 className="text-3xl font-bold text-brand-blue mb-2">Iscriviti Ora</h3>
                  <p className="text-gray-600 text-sm">
                    Compila il form e ti contatteremo entro 24-48 ore per confermare la tua partecipazione
                  </p>
                </div>
                <form 
                  name="iscrizione-corsi" 
                  method="POST"
                  data-netlify="true" 
                  data-netlify-honeypot="bot-field"
                  className="space-y-4"
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
                      console.log('📝 Tentativo di salvataggio in Firestore...');
                      console.log('Dati da salvare:', { firstName, lastName, email, phone, timeSlot });
                      
                      // Prepara i dati - Firestore non accetta valori undefined
                      const registrationData: any = {
                        firstName,
                        lastName,
                        email,
                        phone,
                        timeSlot,
                        status: 'pending',
                      };
                      
                      // Aggiungi message solo se non è vuoto
                      if (message && message.trim()) {
                        registrationData.message = message.trim();
                      }
                      
                      // Salva in Firestore - questo è il salvataggio principale
                      const registrationId = await addCourseRegistration(registrationData);
                      
                      console.log('✅ Salvato in Firestore con ID:', registrationId);
                      
                      // Invia anche a Netlify Forms come backup (solo in produzione)
                      // In locale questo fallirà con 404, ma non è un problema
                      try {
                        await fetch("/", {
                          method: "POST",
                          headers: { "Content-Type": "application/x-www-form-urlencoded" },
                          body: new URLSearchParams(formData as any).toString()
                        });
                        console.log('✅ Inviato anche a Netlify Forms');
                      } catch (netlifyError) {
                        console.log('⚠️ Netlify Forms non disponibile (normale in locale):', netlifyError);
                        // Non è un errore critico, continuiamo comunque
                      }
                      
                      setIsSubmitted(true);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    } catch (error) {
                      console.error('❌ Errore completo:', error);
                      toast({
                        title: "Errore durante l'iscrizione",
                        description: error instanceof Error ? error.message : "Si è verificato un errore durante l'invio. Riprova o contattaci direttamente.",
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

                  {/* Slot Orario */}
                  <div className="space-y-2">
                    <Label htmlFor="timeSlot" className="text-gray-700">Seleziona Date e Orario *</Label>
                    <select
                      id="timeSlot"
                      name="timeSlot"
                      required
                      value={selectedSlot}
                      onChange={(e) => setSelectedSlot(e.target.value)}
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
                </form>
              </div>

              {/* Contatti */}
              <div className="mt-8 text-center text-gray-600 text-sm bg-white/50 rounded-lg p-4">
                <p className="font-semibold text-brand-blue mb-1">Hai domande?</p>
                <p>
                  Contattaci al{" "}
                  <a href="tel:+41762660396" className="text-brand-accent hover:underline font-semibold">+41 76 266 03 96</a>
                  {" "}o via email{" "}
                  <a href="mailto:info@3dmakes.ch" className="text-brand-accent hover:underline font-semibold">info@3dmakes.ch</a>
                </p>
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
