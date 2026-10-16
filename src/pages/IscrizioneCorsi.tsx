import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { BookOpen, CheckCircle, GraduationCap, Users, Clock, Send, type LucideIcon } from "lucide-react";
import { useTranslation } from 'react-i18next';
import { motion } from "framer-motion";
import PageShell from "@/components/anteprima/PageShell";
import { CheckDot, GrowLine, PageHero, SectionIntro } from "@/components/anteprima/PageBlocks";
import { InteractiveCard, PressButton, Reveal, Stagger, StaggerItem } from "@/components/anteprima/primitives";
import { ShopPhoneLinks } from "@/components/ShopPhoneLinks";
import { addCourseRegistration } from "@/services/courseRegistrationService";
import { useToast } from "@/components/ui/use-toast";
import { sendAdminNotificationEmail, sendCourseRegistrationConfirmationEmail } from "@/utils/emailService";
import { sendWebsiteLead } from "@/lib/gestionaleLead";
import { openCourseSlots } from "@/data/courseSlots";

const IscrizioneCorsi = () => {
  const { t, i18n } = useTranslation();
  const { toast } = useToast();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const timeSlots = openCourseSlots(i18n.language);
  if (isSubmitted) {
    return (
      <PageShell>
        <PageHero
          title={t("courseRegistration.success.title")}
          subtitle={t("courseRegistration.success.description")}
          badge={
            <motion.div
              className="relative mb-6 inline-flex h-20 w-20 items-center justify-center rounded-full bg-green-500/20"
              initial={{ scale: 0, rotate: -30 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 260, damping: 14, delay: 0.2 }}
            >
              <span
                aria-hidden
                className="absolute inset-0 rounded-full ring-2 ring-green-400/40 motion-safe:animate-ping [animation-duration:2.4s] [animation-iteration-count:3]"
              />
              <CheckCircle className="h-10 w-10 text-green-400" />
            </motion.div>
          }
        >
          <div className="mx-auto max-w-2xl rounded-3xl border border-white/10 bg-white/5 p-6 text-left backdrop-blur-sm md:p-8">
            <p className="mb-4 font-semibold text-white">{t("courseRegistration.success.nextStepsTitle")}</p>
            <Stagger className="space-y-3" delay={0.5}>
              {[
                t("courseRegistration.success.step1"),
                t("courseRegistration.success.step2"),
                t("courseRegistration.success.step3"),
              ].map((step) => (
                <StaggerItem key={step}>
                  <p className="text-sm text-gray-300 md:text-base">{step}</p>
                </StaggerItem>
              ))}
            </Stagger>
          </div>
          <div className="mt-8">
            <PressButton
              variant="light"
              size="lg"
              onClick={() => window.location.href = '/'}
            >
              {t("courseRegistration.success.backHome")}
            </PressButton>
          </div>
        </PageHero>
      </PageShell>
    );
  }

  const features: { icon: LucideIcon; title: string; description: string }[] = [
    {
      icon: Users,
      title: t("courseRegistration.features.smallGroups.title"),
      description: t("courseRegistration.features.smallGroups.description"),
    },
    {
      icon: BookOpen,
      title: t("courseRegistration.features.practiceTheory.title"),
      description: t("courseRegistration.features.practiceTheory.description"),
    },
    {
      icon: Clock,
      title: t("courseRegistration.features.twoEvenings.title"),
      description: t("courseRegistration.features.twoEvenings.description"),
    },
  ];

  const modules = [
    { duration: "1h", key: "safety", items: 3 },
    { duration: "3h", key: "fdm", items: 4 },
    { duration: "3h", key: "sla", items: 4 },
    { duration: "1h", key: "techniques", items: 4 },
  ];

  const includes = [1, 2, 3, 4, 5, 6].map((n) => t(`courseRegistration.includes.item${n}`));

  return (
    <PageShell>
      <PageHero
        title={t("courseRegistration.hero.title")}
        subtitle={t("courseRegistration.hero.subtitle")}
        badge={
          <Reveal y={0} scale={0.6} delay={0.1} className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-full bg-brand-accent/20">
            <GraduationCap className="h-8 w-8 text-brand-accent" />
          </Reveal>
        }
        footer={
          <Stagger className="grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-6" delay={0.45}>
            {features.map(({ icon: Icon, title, description }) => (
              <StaggerItem key={title} className="h-full">
                <InteractiveCard
                  lift={6}
                  glow="rgba(61,157,255,0.25)"
                  className="h-full rounded-3xl border border-white/10 bg-white/5 backdrop-blur-sm transition-colors duration-300 hover:border-brand-accent/40"
                >
                  <div className="flex h-full flex-col items-center justify-center p-6 text-center md:min-h-[200px]">
                    <span className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-full bg-brand-accent/20 text-brand-accent transition-colors duration-300 group-hover:bg-brand-accent group-hover:text-white">
                      <Icon aria-hidden className="h-7 w-7 transition-transform duration-500 group-hover:scale-110" />
                    </span>
                    <h3 className="mb-2 text-xl font-bold text-white">{title}</h3>
                    <p className="text-sm text-gray-400">{description}</p>
                  </div>
                </InteractiveCard>
              </StaggerItem>
            ))}
          </Stagger>
        }
      />

        {/* Programma del corso */}
        <section className="bg-white py-16 md:py-24">
          <div className="container-custom">
            <div className="mx-auto max-w-6xl">
              <SectionIntro title={t("courseRegistration.program.title")} text={t("courseRegistration.program.subtitle")} />

              <Stagger className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-5">
                {modules.map((module) => (
                  <StaggerItem key={module.key} className="h-full">
                    <InteractiveCard
                      lift={6}
                      className="h-full rounded-3xl bg-[#E5DDD3]/45 p-5 ring-1 ring-brand-blue/5 transition-shadow duration-300 hover:shadow-xl md:p-6"
                    >
                      <div className="mb-4 flex items-center gap-3">
                        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-brand-accent text-lg font-bold text-white shadow-lg shadow-brand-accent/30 transition-transform duration-300 group-hover:-rotate-6 group-hover:scale-110">
                          {module.duration}
                        </span>
                        <h3 className="text-lg font-bold text-brand-blue">
                          {t(`courseRegistration.program.modules.${module.key}.title`)}
                        </h3>
                      </div>
                      <ul className="space-y-2 text-sm text-gray-700">
                        {Array.from({ length: module.items }, (_, index) => (
                          <li key={index} className="flex items-start gap-2.5">
                            <span aria-hidden className="mt-[0.45rem] h-1.5 w-1.5 shrink-0 rounded-full bg-brand-accent" />
                            {t(`courseRegistration.program.modules.${module.key}.item${index + 1}`)}
                          </li>
                        ))}
                      </ul>
                    </InteractiveCard>
                  </StaggerItem>
                ))}
              </Stagger>

              <Reveal>
                <div className="rounded-3xl bg-gradient-to-br from-brand-blue to-slate-900 p-6 text-white shadow-xl shadow-brand-blue/20 md:p-8">
                  <h3 className="mb-5 text-lg font-bold">{t("courseRegistration.includes.title")}</h3>
                  <Stagger className="grid grid-cols-1 gap-x-6 gap-y-3 text-sm text-gray-200 md:grid-cols-2" stagger={0.05}>
                    {includes.map((item) => (
                      <StaggerItem key={item}>
                        <div className="group flex items-center gap-3">
                          <CheckDot className="bg-brand-accent/20" />
                          {item}
                        </div>
                      </StaggerItem>
                    ))}
                  </Stagger>
                </div>
              </Reveal>
            </div>
          </div>
        </section>

        {/* Prezzo e iscrizione */}
        <section className="py-16 md:py-24" style={{ backgroundColor: '#E5DDD3' }}>
          <div className="container-custom">
            <div className="mx-auto max-w-5xl">
              {/* Prezzo in evidenza */}
              <Reveal y={24} className="relative mb-10">
                <motion.div
                  className="absolute -top-3 left-4 z-10 rounded-full bg-brand-orange px-4 py-1 text-xs font-bold uppercase text-white shadow-md"
                  initial={{ rotate: -8, scale: 0.8 }}
                  whileInView={{ rotate: 0, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ type: "spring", stiffness: 300, damping: 12, delay: 0.3 }}
                >
                  {t("courseRegistration.pricing.limitedSpots")}
                </motion.div>
                <div className="rounded-3xl border-2 border-brand-accent bg-white p-6 shadow-xl shadow-brand-accent/10 md:p-8">
                  <div className="text-center">
                    <p className="mb-3 mt-2 text-sm font-semibold text-gray-600">{t("courseRegistration.pricing.earlyBird")}</p>
                    <div className="mb-3 flex items-center justify-center gap-3">
                      <span className="relative text-2xl font-bold text-gray-400">
                        550
                        <GrowLine className="absolute -left-1 -right-1 top-1/2 -mt-px h-0.5 bg-gray-400" delay={0.5} />
                      </span>
                      <span className="text-5xl font-black text-brand-accent">450</span>
                      <span className="text-xl font-bold text-gray-700">CHF</span>
                    </div>
                    <p className="mb-3 text-sm font-semibold text-green-600">
                      {t("courseRegistration.pricing.savings")}
                    </p>
                    <div className="border-t border-gray-200 pt-3">
                      <p className="text-xs text-gray-500">
                        {t("courseRegistration.pricing.cta")}
                      </p>
                    </div>
                  </div>
                </div>
              </Reveal>

              {/* Form Iscrizione - Full Width */}
              <div className="rounded-3xl bg-white px-4 py-6 shadow-xl shadow-brand-blue/10 ring-1 ring-brand-blue/5 max-sm:[&_form_button]:text-base sm:p-6 md:p-10">
                <div className="text-center mb-8">
                  <h3 className="text-3xl font-bold text-brand-blue mb-2">{t("courseRegistration.form.title")}</h3>
                  <p className="text-gray-600 text-sm">
                    {t("courseRegistration.form.description")}
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
                    const paymentMethod = formData.get('paymentMethod') as string;
                    const message = formData.get('message') as string;
                    
                    try {
                      console.log('📝 Tentativo di salvataggio in Firestore...');
                      console.log('Dati da salvare:', { firstName, lastName, email, phone, timeSlot });
                      
                      // Prepara i dati - Firestore non accetta valori undefined
                      const registrationData: {
                        firstName: string;
                        lastName: string;
                        email: string;
                        phone: string;
                        timeSlot: string;
                        paymentMethod: string;
                        status: "pending";
                        message?: string;
                      } = {
                        firstName,
                        lastName,
                        email,
                        phone,
                        timeSlot,
                        paymentMethod,
                        status: 'pending',
                      };
                      
                      // Aggiungi message solo se non è vuoto
                      if (message && message.trim()) {
                        registrationData.message = message.trim();
                      }
                      
                      // Salva in Firestore - questo è il salvataggio principale
                      const registrationId = await addCourseRegistration(registrationData);
                      
                      console.log('✅ Salvato in Firestore con ID:', registrationId);

                      try {
                        await sendWebsiteLead({
                          kind: "course",
                          firstName,
                          lastName,
                          email,
                          phone,
                          subject: "Iscrizione corso base stampa 3D",
                          message: message?.trim() || "Iscrizione al corso base stampa 3D",
                          service: "corso",
                          extra: `SlotId: ${timeSlot}\nSlot: ${timeSlots.find((slot) => slot.value === timeSlot)?.label || timeSlot}\nPagamento: ${paymentMethod}\nID: ${registrationId}`,
                          botField: String(formData.get("bot-field") || ""),
                        });
                      } catch (leadError) {
                        console.error("Iscrizione non arrivata al gestionale:", leadError);
                      }

                      // Invia in automatico email al cliente + notifica admin
                      const selectedSlotLabel = timeSlots.find((slot) => slot.value === timeSlot)?.label || timeSlot;
                      const [userEmailSent, adminEmailSent] = await Promise.all([
                        sendCourseRegistrationConfirmationEmail({
                          userEmail: email,
                          firstName,
                          lastName,
                          timeSlot: selectedSlotLabel,
                          paymentMethod,
                          registrationId,
                        }),
                        sendAdminNotificationEmail({
                          type: 'new_course_registration',
                          details: `Nuova iscrizione corso da ${firstName} ${lastName}`,
                          userInfo:
                            `Email: ${email}\n` +
                            `Telefono: ${phone}\n` +
                            `Slot: ${selectedSlotLabel}\n` +
                            `Pagamento: ${paymentMethod}\n` +
                            `${message?.trim() ? `Note: ${message.trim()}\n` : ''}` +
                            `ID Iscrizione: ${registrationId}`,
                          courseData: {
                            participantName: `${firstName} ${lastName}`,
                            courseTitle: 'Corso Base Stampa 3D',
                            courseDate: selectedSlotLabel,
                            paymentMethod,
                            registrationCode: registrationId.slice(0, 8).toUpperCase(),
                          },
                        }),
                      ]);

                      if (!userEmailSent || !adminEmailSent) {
                        toast({
                          title: "Iscrizione salvata, ma invio email incompleto",
                          description: "Una o piu email automatiche non sono partite. Puoi reinviare la conferma dal pannello admin.",
                          variant: "destructive",
                        });
                      } else {
                        console.log('✅ Email automatiche inviate (cliente + admin)');
                      }
                      
                      // Invia anche a Netlify Forms come backup (solo in produzione)
                      // In locale questo fallirà con 404, ma non è un problema
                      try {
                        await fetch("/", {
                          method: "POST",
                          headers: { "Content-Type": "application/x-www-form-urlencoded" },
                          body: new URLSearchParams(
                            Array.from(formData.entries()).map(([key, value]) => [key, String(value)])
                          ).toString()
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
                        title: t("courseRegistration.form.errorTitle"),
                        description: error instanceof Error ? error.message : t("courseRegistration.form.errorDescription"),
                        variant: "destructive",
                      });
                    } finally {
                      setIsSubmitting(false);
                    }
                  }}
                >
                  <input type="hidden" name="form-name" value="iscrizione-corsi" />
                  <div className="hidden">
                    <Label htmlFor="bot-field">{t("courseRegistration.form.botFieldLabel")}</Label>
                    <Input id="bot-field" name="bot-field" />
                  </div>

                  {/* Nome e Cognome */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName" className="text-gray-700">{t("courseRegistration.form.firstNameLabel")}</Label>
                      <Input 
                        id="firstName" 
                        name="firstName" 
                        type="text" 
                        required 
                        placeholder={t("courseRegistration.form.firstNamePlaceholder")}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName" className="text-gray-700">{t("courseRegistration.form.lastNameLabel")}</Label>
                      <Input 
                        id="lastName" 
                        name="lastName" 
                        type="text" 
                        required 
                        placeholder={t("courseRegistration.form.lastNamePlaceholder")}
                      />
                    </div>
                  </div>

                  {/* Email e Telefono */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-gray-700">{t("courseRegistration.form.emailLabel")}</Label>
                      <Input 
                        id="email" 
                        name="email" 
                        type="email" 
                        required 
                        placeholder={t("courseRegistration.form.emailPlaceholder")}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone" className="text-gray-700">{t("courseRegistration.form.phoneLabel")}</Label>
                      <Input 
                        id="phone" 
                        name="phone" 
                        type="tel" 
                        required 
                        placeholder={t("courseRegistration.form.phonePlaceholder")}
                      />
                    </div>
                  </div>

                  {/* Slot Orario */}
                  <div className="space-y-2">
                    <Label htmlFor="timeSlot" className="text-gray-700">{t("courseRegistration.form.timeSlotLabel")}</Label>
                    <select
                      id="timeSlot"
                      name="timeSlot"
                      required
                      value={selectedSlot}
                      onChange={(e) => setSelectedSlot(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-accent focus:border-transparent"
                    >
                      <option value="">{t("courseRegistration.form.timeSlotPlaceholder")}</option>
                      {timeSlots.map((slot) => (
                        <option key={slot.value} value={slot.value}>
                          {slot.label}
                        </option>
                      ))}
                    </select>
                    <p className="text-xs text-gray-500">
                      {t("courseRegistration.form.timeSlotHelper")}
                    </p>
                  </div>

                  {/* Metodo di Pagamento */}
                  <div className="space-y-2">
                    <Label htmlFor="paymentMethod" className="text-gray-700">{t("courseRegistration.form.paymentMethodLabel")}</Label>
                    <select
                      id="paymentMethod"
                      name="paymentMethod"
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-accent focus:border-transparent"
                      defaultValue=""
                    >
                      <option value="" disabled>{t("courseRegistration.form.paymentMethodPlaceholder")}</option>
                      <option value="Bonifico bancario">{t("courseRegistration.form.paymentMethods.bankTransfer")}</option>
                      <option value="TWINT">{t("courseRegistration.form.paymentMethods.twint")}</option>
                      <option value="Contanti in sede">{t("courseRegistration.form.paymentMethods.cashOnSite")}</option>
                    </select>
                  </div>

                  {/* Note */}
                  <div className="space-y-2">
                    <Label htmlFor="message" className="text-gray-700">{t("courseRegistration.form.messageLabel")}</Label>
                    <Textarea 
                      id="message" 
                      name="message" 
                      rows={3}
                      placeholder={t("courseRegistration.form.messagePlaceholder")}
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
                        {t("courseRegistration.form.privacyConsent")}
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
                    {isSubmitting ? t("courseRegistration.form.submitting") : t("courseRegistration.form.submit")}
                  </Button>

                  <p className="text-xs text-center text-gray-500">
                    {t("courseRegistration.form.requiredFields")}
                  </p>
                </form>
              </div>

              {/* Contatti */}
              <Reveal className="mt-8">
                <div className="rounded-3xl bg-white/60 p-5 text-center text-sm text-gray-600 ring-1 ring-brand-blue/5 backdrop-blur-sm md:p-6">
                  <p className="font-semibold text-brand-blue mb-1">{t("courseRegistration.contact.title")}</p>
                  <p>
                    {t("courseRegistration.contact.prompt")}{" "}
                    <ShopPhoneLinks stacked={false} className="justify-center" linkClassName="text-brand-accent hover:underline font-semibold inline" />
                    {" "}{t("courseRegistration.contact.orEmail")}{" "}
                    <a href="mailto:info@3dmakes.ch" className="text-brand-accent hover:underline font-semibold">info@3dmakes.ch</a>
                  </p>
                </div>
              </Reveal>
            </div>
          </div>
        </section>
    </PageShell>
  );
};

export default IscrizioneCorsi;
