import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { CheckCircle, FileUp, Loader2, Send, UserPlus } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ShopPhoneLinks } from "@/components/ShopPhoneLinks";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { extractTextFromImage } from "@/lib/intake-ocr";
import { parseIntakeText, type ParsedIntake } from "@/lib/intake-parser";

const INTAKE_API = "https://clienti.3dmakes.ch/api/public/client-intake";

type ClientType = "privato" | "azienda";

const RegistrazioneCliente = () => {
  const { token } = useParams<{ token?: string }>();
  const { toast } = useToast();
  const fileRef = useRef<HTMLInputElement>(null);
  const [type, setType] = useState<ClientType>("privato");
  const [sending, setSending] = useState(false);
  const [parsing, setParsing] = useState(false);
  const [parsedFields, setParsedFields] = useState<string[]>([]);
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
          setLinkError(
            data.reason === "used"
              ? "Questo link è già stato usato."
              : "Questo link non è più valido.",
          );
          return;
        }
        if (data.form_type === "azienda" || data.form_type === "privato") {
          setType(data.form_type);
        }
      })
      .catch(() => {
        if (!cancelled) setLinkError("Non riesco a verificare il link. Riprova più tardi.");
      });
    return () => {
      cancelled = true;
    };
  }, [token]);

  const set =
    (k: keyof typeof f) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setF((p) => ({ ...p, [k]: e.target.value }));

  const applyParsed = (parsed: ParsedIntake) => {
    if (parsed.type) setType(parsed.type);
    const next = { ...f };
    const detected: string[] = [];
    if (parsed.type) detected.push("tipo cliente");
    const pairs: Array<[keyof typeof f, string | undefined, string]> = [
      ["company_name", parsed.company_name, "ragione sociale"],
      ["vat_number", parsed.vat_number, "partita IVA"],
      ["first_name", parsed.first_name, "nome"],
      ["last_name", parsed.last_name, "cognome"],
      ["email", parsed.email, "email"],
      ["phone", parsed.phone, "telefono"],
      ["address", parsed.address, "indirizzo"],
      ["zip", parsed.zip, "CAP"],
      ["city", parsed.city, "località"],
    ];
    for (const [key, value, label] of pairs) {
      if (!value) continue;
      next[key] = value;
      detected.push(label);
    }
    setF(next);
    setParsedFields(Array.from(new Set(detected)));
    return detected;
  };

  async function handleFile(file: File) {
    const isImage = file.type.startsWith("image/") || /\.(png|jpe?g|webp|gif|heic)$/i.test(file.name);
    if (!isImage) {
      toast({
        title: "Serve uno screenshot",
        description: "Carica una foto o uno screen della mail (PNG, JPG).",
        variant: "destructive",
      });
      return;
    }
    setParsing(true);
    try {
      const text = await extractTextFromImage(file);
      const parsed = parseIntakeText(text);
      const detected = applyParsed(parsed);
      if (detected.length === 0) {
        toast({
          title: "Nessun dato riconosciuto",
          description: "Controlla che nello screen si vedano nome, mail e indirizzo, oppure compila a mano.",
        });
      } else {
        toast({
          title: "Dati estratti",
          description: detected.join(", "),
        });
      }
    } catch {
      toast({
        title: "Lettura non riuscita",
        description: "Riprova con uno screen più nitido, o compila a mano.",
        variant: "destructive",
      });
    } finally {
      setParsing(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  }

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
        title: "Invio non riuscito",
        description: "Controlla i dati e riprova. Se continua, scrivici a info@3dmakes.ch.",
        variant: "destructive",
      });
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <section className="bg-gradient-to-br from-brand-blue to-slate-900 text-white py-16 md:py-24">
          <div className="container-custom max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center justify-center w-14 h-14 bg-brand-accent/20 rounded-full mb-6">
              <UserPlus className="w-7 h-7 text-brand-accent" />
            </div>
            <h1 className="heading-1 mb-4">Registrazione cliente</h1>
            <p className="text-white/80 text-lg">
              Compila i tuoi dati. Arrivano direttamente in anagrafica 3DMAKES.
            </p>
          </div>
        </section>

        <section className="py-16 md:py-20" style={{ backgroundColor: "#E5DDD3" }}>
          <div className="container-custom max-w-3xl mx-auto">
            {done ? (
              <div className="bg-white rounded-lg shadow-lg p-8 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-green-500 rounded-full mb-5">
                  <CheckCircle className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-brand-blue mb-2">Grazie, dati ricevuti</h2>
                <p className="text-gray-600">
                  Ti ricontattiamo noi. Per urgenze:{" "}
                  <a href="mailto:info@3dmakes.ch" className="text-brand-accent font-semibold hover:underline">
                    info@3dmakes.ch
                  </a>
                </p>
              </div>
            ) : linkError ? (
              <div className="bg-white rounded-lg shadow-lg p-8 text-center">
                <h2 className="text-2xl font-bold text-brand-blue mb-2">{linkError}</h2>
                <p className="text-gray-600">
                  Chiedi a 3DMAKES un nuovo link, oppure scrivi a{" "}
                  <a href="mailto:info@3dmakes.ch" className="text-brand-accent font-semibold hover:underline">
                    info@3dmakes.ch
                  </a>
                  .
                </p>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-lg p-6 md:p-8">
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold text-brand-blue mb-2">I tuoi dati</h2>
                  <p className="text-gray-600 text-sm">Privato o azienda: scegli e completa i campi.</p>
                </div>

                <form className="space-y-4" onSubmit={onSubmit}>
                  <div className="hidden">
                    <Label htmlFor="botField">Lascia vuoto</Label>
                    <Input id="botField" name="botField" value={f.botField} onChange={set("botField")} />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      type="button"
                      variant={type === "privato" ? "default" : "outline"}
                      className={type === "privato" ? "bg-brand-blue hover:bg-brand-blue/90" : ""}
                      onClick={() => setType("privato")}
                    >
                      Privato
                    </Button>
                    <Button
                      type="button"
                      variant={type === "azienda" ? "default" : "outline"}
                      className={type === "azienda" ? "bg-brand-blue hover:bg-brand-blue/90" : ""}
                      onClick={() => setType("azienda")}
                    >
                      Azienda
                    </Button>
                  </div>

                  <div className="rounded-lg border border-dashed border-gray-300 bg-gray-50 p-4">
                    <p className="text-sm font-semibold text-brand-blue">Carica uno screenshot della mail</p>
                    <p className="text-xs text-gray-600 mt-1">
                      Se nello screen ci sono ragione sociale, IVA, mail e indirizzo, li riempiamo noi.
                    </p>
                    <input
                      ref={fileRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) void handleFile(file);
                      }}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      className="mt-3 gap-2"
                      disabled={parsing}
                      onClick={() => fileRef.current?.click()}
                    >
                      {parsing ? <Loader2 className="w-4 h-4 animate-spin" /> : <FileUp className="w-4 h-4" />}
                      {parsing ? "Lettura in corso…" : "Seleziona screenshot"}
                    </Button>
                    {parsedFields.length > 0 ? (
                      <p className="mt-3 text-xs text-gray-600">Estratto: {parsedFields.join(", ")}</p>
                    ) : null}
                  </div>

                  {type === "azienda" ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2 sm:col-span-2">
                        <Label htmlFor="company_name" className="text-gray-700">
                          Ragione sociale
                        </Label>
                        <Input
                          id="company_name"
                          required
                          value={f.company_name}
                          onChange={set("company_name")}
                          placeholder="Es. Merk SA"
                        />
                      </div>
                      <div className="space-y-2 sm:col-span-2">
                        <Label htmlFor="vat_number" className="text-gray-700">
                          Partita IVA / IDE
                        </Label>
                        <Input id="vat_number" value={f.vat_number} onChange={set("vat_number")} />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="first_name" className="text-gray-700">
                          Nome referente
                        </Label>
                        <Input id="first_name" value={f.first_name} onChange={set("first_name")} />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="last_name" className="text-gray-700">
                          Cognome referente
                        </Label>
                        <Input id="last_name" value={f.last_name} onChange={set("last_name")} />
                      </div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="first_name" className="text-gray-700">
                          Nome
                        </Label>
                        <Input id="first_name" required value={f.first_name} onChange={set("first_name")} />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="last_name" className="text-gray-700">
                          Cognome
                        </Label>
                        <Input id="last_name" required value={f.last_name} onChange={set("last_name")} />
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-gray-700">
                        Email
                      </Label>
                      <Input id="email" type="email" required value={f.email} onChange={set("email")} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone" className="text-gray-700">
                        Telefono
                      </Label>
                      <Input id="phone" type="tel" required value={f.phone} onChange={set("phone")} />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="address" className="text-gray-700">
                      Indirizzo
                    </Label>
                    <Input id="address" value={f.address} onChange={set("address")} />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="zip" className="text-gray-700">
                        CAP
                      </Label>
                      <Input id="zip" value={f.zip} onChange={set("zip")} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="city" className="text-gray-700">
                        Località
                      </Label>
                      <Input id="city" value={f.city} onChange={set("city")} />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="notes" className="text-gray-700">
                      Note (facoltative)
                    </Label>
                    <Textarea id="notes" value={f.notes} onChange={set("notes")} rows={3} />
                  </div>

                  <Button
                    type="submit"
                    disabled={sending}
                    className="w-full bg-brand-blue hover:bg-brand-blue/90 gap-2"
                  >
                    <Send className="w-4 h-4" />
                    {sending ? "Invio in corso…" : "Invia registrazione"}
                  </Button>
                </form>
              </div>
            )}
          </div>
        </section>
      </main>
      <ShopPhoneLinks />
      <Footer />
    </div>
  );
};

export default RegistrazioneCliente;
