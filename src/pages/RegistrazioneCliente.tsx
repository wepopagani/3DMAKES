import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { CheckCircle, Send } from "lucide-react";
import { useTranslation } from "react-i18next";
import { ShopPhoneLinks } from "@/components/ShopPhoneLinks";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import {
  accountPanel,
  areaClass,
  fieldClass,
  labelClass,
  primaryButtonClass,
} from "@/components/anteprima/accountUi";
import { PageHero } from "@/components/anteprima/PageBlocks";
import PageShell from "@/components/anteprima/PageShell";
import { cn } from "@/lib/utils";

const INTAKE_API = "https://clienti.3dmakes.ch/api/public/client-intake";

type ClientType = "privato" | "azienda";

const RegistrazioneCliente = () => {
  const { token } = useParams<{ token?: string }>();
  const { t } = useTranslation();
  const { toast } = useToast();
  const [type, setType] = useState<ClientType>("privato");
  const [sending, setSending] = useState(false);
  const [done, setDone] = useState(false);
  const [linkError, setLinkError] = useState("");
  const [f, setF] = useState({
    first_name: "",
    last_name: "",
    company_name: "",
    vat_number: "",
    email: "",
    phone: "",
    address: "",
    zip: "",
    city: "",
    notes: "",
    botField: "",
  });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (!token) return;
    let cancelled = false;
    fetch(`${INTAKE_API}?token=${encodeURIComponent(token)}`)
      .then((r) => r.json())
      .then((data: { valid?: boolean; form_type?: string; reason?: string }) => {
        if (cancelled) return;
        if (!data.valid) {
          setLinkError(data.reason === "used" ? t("clientIntake.linkUsed") : t("clientIntake.linkInvalid"));
          return;
        }
        if (data.form_type === "azienda" || data.form_type === "privato") {
          setType(data.form_type);
        }
      })
      .catch(() => {
        if (!cancelled) setLinkError(t("clientIntake.linkCheck"));
      });
    return () => {
      cancelled = true;
    };
  }, [token, t]);

  const set =
    (k: keyof typeof f) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setF((p) => ({ ...p, [k]: e.target.value }));

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (sending || linkError) return;
    setSending(true);
    try {
      const res = await fetch(INTAKE_API, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          type,
          token: token || undefined,
          ...f,
        }),
      });
      const data = (await res.json().catch(() => ({}))) as { ok?: boolean };
      if (!res.ok || !data.ok) throw new Error("submit_failed");
      setDone(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch {
      toast({
        title: t("clientIntake.failTitle"),
        description: t("clientIntake.failBody"),
        variant: "destructive",
      });
    } finally {
      setSending(false);
    }
  }

  const choice = (id: ClientType, label: string) => (
    <button
      type="button"
      onClick={() => setType(id)}
      className={cn(
        "h-11 rounded-full text-sm font-semibold transition-colors",
        type === id ? "bg-brand-blue text-white" : "text-brand-blue hover:bg-white"
      )}
    >
      {label}
    </button>
  );

  return (
    <PageShell>
      <PageHero eyebrow={t("clientIntake.eyebrow")} title={t("clientIntake.title")} subtitle={t("clientIntake.subtitle")} />

      <section className="bg-[#E5DDD3] py-12 md:py-20">
        <div className="container-custom max-w-3xl">
          {done ? (
            <div className={cn(accountPanel, "px-6 py-12 text-center md:px-10")}>
              <span className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-brand-accent text-white">
                <CheckCircle className="h-8 w-8" />
              </span>
              <h2 className="font-display text-3xl font-extrabold text-brand-blue">{t("clientIntake.thanksTitle")}</h2>
              <p className="mt-3 text-brand-blue/70">{t("clientIntake.thanksBody")}</p>
              <div className="mt-6 flex flex-col items-center gap-3">
                <ShopPhoneLinks
                  stacked
                  nameClassName="text-brand-blue/80"
                  linkClassName="font-semibold text-brand-accent hover:underline"
                />
                <a href="mailto:info@3dmakes.ch" className="font-semibold text-brand-accent hover:underline">
                  info@3dmakes.ch
                </a>
              </div>
            </div>
          ) : linkError ? (
            <div className={cn(accountPanel, "px-6 py-12 text-center md:px-10")}>
              <h2 className="font-display text-3xl font-extrabold text-brand-blue">{linkError}</h2>
              <p className="mt-3 text-brand-blue/70">
                {t("clientIntake.linkHelp")}{" "}
                <a href="mailto:info@3dmakes.ch" className="font-semibold text-brand-accent hover:underline">
                  info@3dmakes.ch
                </a>
                .
              </p>
            </div>
          ) : (
            <div className={cn(accountPanel, "p-6 md:p-10")}>
              <div className="mb-8 text-center">
                <h2 className="font-display text-3xl font-extrabold text-brand-blue">{t("clientIntake.formTitle")}</h2>
                <p className="mt-2 text-sm text-brand-blue/70">{t("clientIntake.formHint")}</p>
              </div>

              <form className="space-y-4" onSubmit={onSubmit}>
                <div className="hidden" aria-hidden>
                  <Label htmlFor="botField">Lascia vuoto</Label>
                  <Input id="botField" name="botField" tabIndex={-1} autoComplete="off" value={f.botField} onChange={set("botField")} />
                </div>

                <div className="grid grid-cols-2 gap-1 rounded-full bg-[#F7F4F0] p-1">
                  {choice("privato", t("clientIntake.private"))}
                  {choice("azienda", t("clientIntake.company"))}
                </div>

                {type === "azienda" ? (
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="space-y-2 sm:col-span-2">
                      <Label htmlFor="company_name" className={labelClass}>
                        {t("clientIntake.companyName")}
                      </Label>
                      <Input id="company_name" required value={f.company_name} onChange={set("company_name")} className={fieldClass} />
                    </div>
                    <div className="space-y-2 sm:col-span-2">
                      <Label htmlFor="vat_number" className={labelClass}>
                        {t("clientIntake.vat")}
                      </Label>
                      <Input id="vat_number" value={f.vat_number} onChange={set("vat_number")} className={fieldClass} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="first_name" className={labelClass}>
                        {t("clientIntake.contactFirst")}
                      </Label>
                      <Input id="first_name" value={f.first_name} onChange={set("first_name")} className={fieldClass} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="last_name" className={labelClass}>
                        {t("clientIntake.contactLast")}
                      </Label>
                      <Input id="last_name" value={f.last_name} onChange={set("last_name")} className={fieldClass} />
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="first_name" className={labelClass}>
                        {t("clientIntake.firstName")}
                      </Label>
                      <Input id="first_name" required value={f.first_name} onChange={set("first_name")} className={fieldClass} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="last_name" className={labelClass}>
                        {t("clientIntake.lastName")}
                      </Label>
                      <Input id="last_name" required value={f.last_name} onChange={set("last_name")} className={fieldClass} />
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="email" className={labelClass}>
                      {t("clientIntake.email")}
                    </Label>
                    <Input id="email" type="email" required value={f.email} onChange={set("email")} className={fieldClass} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone" className={labelClass}>
                      {t("clientIntake.phone")}
                    </Label>
                    <Input id="phone" type="tel" required value={f.phone} onChange={set("phone")} className={fieldClass} />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address" className={labelClass}>
                    {t("clientIntake.address")}
                  </Label>
                  <Input id="address" value={f.address} onChange={set("address")} className={fieldClass} />
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="zip" className={labelClass}>
                      {t("clientIntake.zip")}
                    </Label>
                    <Input id="zip" value={f.zip} onChange={set("zip")} className={fieldClass} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="city" className={labelClass}>
                      {t("clientIntake.city")}
                    </Label>
                    <Input id="city" value={f.city} onChange={set("city")} className={fieldClass} />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notes" className={labelClass}>
                    {t("clientIntake.notes")}
                  </Label>
                  <Textarea id="notes" value={f.notes} onChange={set("notes")} rows={3} className={areaClass} />
                </div>

                <Button type="submit" disabled={sending} className={`mt-2 w-full ${primaryButtonClass}`}>
                  <Send className="h-4 w-4" />
                  {sending ? t("clientIntake.sending") : t("clientIntake.submit")}
                </Button>
              </form>
            </div>
          )}
        </div>
      </section>
    </PageShell>
  );
};

export default RegistrazioneCliente;
