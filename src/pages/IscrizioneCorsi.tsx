import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BookOpen, CheckCircle, GraduationCap, Users, Clock } from "lucide-react";
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
    { value: "6-7-marzo", label: "6-7 Marzo 2025 (Giovedì-Venerdì) - 17:30 - 21:30" },
    { value: "13-14-marzo", label: "13-14 Marzo 2025 (Giovedì-Venerdì) - 17:30 - 21:30" },
    { value: "20-21-marzo", label: "20-21 Marzo 2025 (Giovedì-Venerdì) - 17:30 - 21:30" },
    { value: "27-28-marzo", label: "27-28 Marzo 2025 (Giovedì-Venerdì) - 17:30 - 21:30" },
  ];

  if (isSubmitted) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow">
          <section className="py-16 md:py-20 bg-gradient-to-br from-blue-50 via-white to-purple-50">
            <div className="container-custom">
              <div className="max-w-2xl mx-auto text-center">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6 animate-bounce">
                  <CheckCircle className="w-10 h-10 text-green-600" />
                </div>
                <h1 className="heading-1 mb-4">Iscrizione Ricevuta!</h1>
                <p className="body-text mb-8">
                  Grazie per il tuo interesse! Abbiamo ricevuto la tua richiesta di iscrizione al Corso Base di Stampa 3D.
                  Ti contatteremo entro 24-48 ore per confermare la tua partecipazione allo slot selezionato e fornirti
                  tutti i dettagli necessari.
                </p>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
                  <p className="text-sm text-gray-700">
                    <strong>Cosa succede ora?</strong><br />
                    1. Riceverai un'email di conferma<br />
                    2. Ti contatteremo per confermare data e orario<br />
                    3. Ti invieremo il materiale preparatorio
                  </p>
                </div>
                <Button 
                  onClick={() => window.location.href = '/'}
                  className="bg-brand-accent hover:bg-brand-accent/90"
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
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-blue-50 via-white to-purple-50 py-12 md:py-16">
          <div className="container-custom">
            <div className="max-w-4xl mx-auto text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-brand-accent/10 rounded-full mb-6">
                <GraduationCap className="w-8 h-8 text-brand-accent" />
              </div>
              <h1 className="heading-1 mb-4">Corso Base Stampa 3D</h1>
              <p className="text-xl text-gray-600 mb-8">
                Impara le basi della stampa 3D, dalla modellazione alla stampa finale con esperti del settore
              </p>
            </div>
          </div>
        </section>

        {/* Caratteristiche dei corsi */}
        <section className="py-12 bg-white">
          <div className="container-custom">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-14 h-14 bg-blue-100 rounded-full mb-4">
                  <Users className="w-7 h-7 text-blue-600" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Piccoli Gruppi</h3>
                <p className="text-gray-600 text-sm">
                  Max 6 partecipanti per garantire attenzione personalizzata
                </p>
              </div>
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-14 h-14 bg-purple-100 rounded-full mb-4">
                  <BookOpen className="w-7 h-7 text-purple-600" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Pratica e Teoria</h3>
                <p className="text-gray-600 text-sm">
                  Approccio hands-on con progetti reali e materiale didattico
                </p>
              </div>
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-14 h-14 bg-green-100 rounded-full mb-4">
                  <Clock className="w-7 h-7 text-green-600" />
                </div>
                <h3 className="font-semibold text-lg mb-2">2 Giorni Consecutivi</h3>
                <p className="text-gray-600 text-sm">
                  8 ore totali distribuite su Giovedì e Venerdì sera (17:30 - 21:30)
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Form di Iscrizione */}
        <section className="py-16 md:py-20 bg-gray-50">
          <div className="container-custom">
            <div className="max-w-3xl mx-auto">
              <Card className="shadow-lg">
                <CardHeader className="bg-gradient-to-r from-brand-accent to-brand-blue text-white rounded-t-lg">
                  <CardTitle className="text-2xl">Modulo di Iscrizione</CardTitle>
                  <CardDescription className="text-blue-50">
                    Compila il modulo per iscriverti ai nostri corsi. Ti contatteremo per confermare la tua partecipazione.
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                  <form 
                    name="iscrizione-corsi" 
                    method="POST"
                    data-netlify="true" 
                    data-netlify-honeypot="bot-field"
                    className="space-y-6"
                    onSubmit={async (e) => {
                      e.preventDefault();
                      
                      if (isSubmitting) return;
                      setIsSubmitting(true);
                      
                      const formData = new FormData(e.target as HTMLFormElement);
                      const firstName = formData.get('firstName') as string;
                      const lastName = formData.get('lastName') as string;
                      const email = formData.get('email') as string;
                      const phone = formData.get('phone') as string;
                      const company = formData.get('company') as string;
                      const timeSlot = formData.get('timeSlot') as string;
                      const message = formData.get('message') as string;
                      
                      try {
                        // Salva in Firestore
                        await addCourseRegistration({
                          firstName,
                          lastName,
                          email,
                          phone,
                          company: company || undefined,
                          timeSlot,
                          message: message || undefined,
                          status: 'pending',
                        });
                        
                        // Submit form data to Netlify
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
                    {/* Campo nascosto per Netlify */}
                    <input type="hidden" name="form-name" value="iscrizione-corsi" />
                    
                    {/* Honeypot per spam protection */}
                    <div className="hidden">
                      <Label htmlFor="bot-field">Non compilare questo campo</Label>
                      <Input id="bot-field" name="bot-field" />
                    </div>

                    {/* Nome e Cognome */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="firstName">Nome *</Label>
                        <Input 
                          id="firstName" 
                          name="firstName" 
                          type="text" 
                          required 
                          placeholder="Il tuo nome"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastName">Cognome *</Label>
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
                        <Label htmlFor="email">Email *</Label>
                        <Input 
                          id="email" 
                          name="email" 
                          type="email" 
                          required 
                          placeholder="tuoemail@esempio.com"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">Telefono *</Label>
                        <Input 
                          id="phone" 
                          name="phone" 
                          type="tel" 
                          required 
                          placeholder="+41 XX XXX XX XX"
                        />
                      </div>
                    </div>

                    {/* Azienda (opzionale) */}
                    <div className="space-y-2">
                      <Label htmlFor="company">Azienda (opzionale)</Label>
                      <Input 
                        id="company" 
                        name="company" 
                        type="text" 
                        placeholder="Nome della tua azienda"
                      />
                    </div>

                    {/* Selezione Slot Orario */}
                    <div className="space-y-2">
                      <Label htmlFor="timeSlot">Seleziona Date e Orario *</Label>
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
                        Il corso si tiene su 2 giorni consecutivi (8 ore totali). Posti limitati a 6 partecipanti.
                      </p>
                    </div>

                    {/* Note / Messaggi */}
                    <div className="space-y-2">
                      <Label htmlFor="message">Note / Domande (opzionale)</Label>
                      <Textarea 
                        id="message" 
                        name="message" 
                        rows={4}
                        placeholder="Hai domande specifiche sul corso? Scrivi qui..."
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
                          className="mt-1"
                        />
                        <Label htmlFor="privacy" className="text-sm text-gray-700 cursor-pointer">
                          Acconsento al trattamento dei miei dati personali secondo la Privacy Policy di 3D Makes *
                        </Label>
                      </div>
                    </div>

                    {/* Submit Button */}
                    <Button 
                      type="submit" 
                      className="w-full bg-brand-accent hover:bg-brand-accent/90 text-lg py-6"
                      disabled={isSubmitting}
                    >
                      <GraduationCap className="w-5 h-5 mr-2" />
                      {isSubmitting ? "Invio in corso..." : "Invia Richiesta di Iscrizione"}
                    </Button>

                    <p className="text-xs text-center text-gray-500">
                      * Campi obbligatori
                    </p>
                  </form>
                </CardContent>
              </Card>

              {/* Info Aggiuntive */}
              <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
                <h3 className="font-semibold text-lg mb-3 text-blue-900">Informazioni sul Corso</h3>
                <ul className="space-y-2 text-sm text-blue-800">
                  <li>✓ Durata: 8 ore su 2 giorni (Giovedì e Venerdì, 17:30 - 21:30)</li>
                  <li>✓ Corso Base di Stampa 3D - adatto a principianti</li>
                  <li>✓ Max 6 partecipanti per garantire attenzione personalizzata</li>
                  <li>✓ Vengono forniti materiali didattici e accesso alle attrezzature</li>
                  <li>✓ Al termine del corso riceverai un attestato di partecipazione</li>
                  <li>✓ Possibilità di corsi personalizzati per aziende e gruppi</li>
                </ul>
              </div>

              {/* Contatti */}
              <div className="mt-6 text-center text-gray-600">
                <p className="text-sm">
                  Hai bisogno di maggiori informazioni? <br />
                  Contattaci al <a href="tel:+41762660396" className="text-brand-accent hover:underline font-semibold">+41 76 266 03 96</a> o via email a{" "}
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
