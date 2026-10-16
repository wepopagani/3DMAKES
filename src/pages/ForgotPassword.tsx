import { useState } from "react";
import { sendPasswordResetEmail } from "firebase/auth";
import { Link } from "react-router-dom";
import { ArrowLeft, Mail } from "lucide-react";
import { useTranslation } from "react-i18next";
import { auth } from "@/firebase/config";
import { toast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AuthFrame, fieldClass, labelClass, primaryButtonClass, textLinkClass } from "@/components/anteprima/accountUi";

const ForgotPassword = () => {
  const { t } = useTranslation();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await sendPasswordResetEmail(auth, email);
      setEmailSent(true);
      toast({
        title: t("auth.resetEmailSent"),
        description: t("auth.resetEmailSentDesc"),
      });
    } catch (error: any) {
      console.error("Errore durante l'invio dell'email di reset:", error);

      let errorMessage = t("auth.loginError");
      if (error.code === "auth/user-not-found") {
        errorMessage = t("auth.emailNotFound");
      } else if (error.code === "auth/invalid-email") {
        errorMessage = t("auth.invalidEmail");
      } else if (error.code === "auth/too-many-requests") {
        errorMessage = t("auth.tooManyAttempts");
      }

      toast({
        title: t("common.error"),
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (emailSent) {
    return (
      <AuthFrame title={t("auth.resetEmailSent")} lede={t("auth.resetEmailSentDesc")}>
        <div className="mb-6 flex justify-center">
          <span className="flex h-14 w-14 items-center justify-center rounded-full bg-brand-accent/15 text-brand-accent">
            <Mail className="h-6 w-6" />
          </span>
        </div>
        <Button asChild className={`w-full ${primaryButtonClass}`}>
          <Link to="/login">
            <ArrowLeft className="h-4 w-4" />
            {t("auth.backToLogin")}
          </Link>
        </Button>
      </AuthFrame>
    );
  }

  return (
    <AuthFrame title={t("auth.resetPasswordTitle")} lede={t("auth.resetPasswordDesc")}>
      <form className="space-y-5" onSubmit={handleSubmit}>
        <div>
          <Label htmlFor="email" className={labelClass}>
            {t("auth.email")}
          </Label>
          <Input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={`mt-1.5 ${fieldClass}`}
          />
        </div>
        <Button type="submit" disabled={loading} className={`w-full ${primaryButtonClass}`}>
          {loading ? t("common.loading") : t("auth.sendResetEmail")}
        </Button>
        <p className="text-center text-sm">
          <Link to="/login" className={`inline-flex items-center gap-2 ${textLinkClass}`}>
            <ArrowLeft className="h-4 w-4" />
            {t("auth.backToLogin")}
          </Link>
        </p>
      </form>
    </AuthFrame>
  );
};

export default ForgotPassword;
