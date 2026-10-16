import { useState } from "react";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { useTranslation } from "react-i18next";
import { auth, db } from "@/firebase/config";
import { toast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/firebase/AuthContext";
import {
  AuthFrame,
  AuthOr,
  GoogleGlyph,
  fieldClass,
  labelClass,
  primaryButtonClass,
  quietButtonClass,
  textLinkClass,
} from "@/components/anteprima/accountUi";

const Register = () => {
  const { t } = useTranslation();
  const { logInWithGoogle } = useAuth();
  const [formData, setFormData] = useState({
    nome: "",
    cognome: "",
    email: "",
    telefono: "",
    password: "",
    confermaPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (formData.password !== formData.confermaPassword) {
      setError(t("auth.confirmPasswordError"));
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError(t("auth.passwordMinLength"));
      setLoading(false);
      return;
    }

    if (!formData.nome || !formData.cognome || !formData.email) {
      setError(t("auth.requiredFields"));
      setLoading(false);
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
      const user = userCredential.user;

      await updateProfile(user, {
        displayName: `${formData.nome} ${formData.cognome}`,
      });

      await setDoc(doc(db, "users", user.uid), {
        nome: formData.nome,
        cognome: formData.cognome,
        email: formData.email,
        telefono: formData.telefono,
        createdAt: new Date(),
        isAdmin: false,
      });

      toast({
        title: t("auth.registrationComplete"),
        description: t("auth.accountCreated"),
      });

      navigate("/dashboard");
    } catch (err: any) {
      console.error("Errore durante la registrazione:", err);
      if (err.code === "auth/email-already-in-use") {
        setError(t("auth.emailInUse"));
      } else if (err.code === "auth/invalid-email") {
        setError(t("auth.invalidEmail"));
      } else {
        setError(t("auth.registerError"));
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignup = async () => {
    setLoading(true);
    setError("");

    try {
      await logInWithGoogle();

      toast({
        title: t("auth.registrationComplete"),
        description: t("auth.accountCreated"),
      });

      navigate("/dashboard");
    } catch (error: any) {
      console.error("Errore durante la registrazione con Google:", error);

      if (error.code === "auth/popup-closed-by-user") {
        setError(t("auth.popupClosed"));
      } else if (error.code === "auth/popup-blocked") {
        setError(t("auth.popupBlocked"));
      } else {
        setError(t("auth.registerError"));
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthFrame
      wide
      title={t("auth.register")}
      lede={
        <>
          {t("auth.hasAccount")}{" "}
          <Link to="/login" className={textLinkClass}>
            {t("auth.login")}
          </Link>
        </>
      }
    >
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <Label htmlFor="nome" className={labelClass}>
              {t("auth.firstName")} *
            </Label>
            <Input id="nome" name="nome" type="text" required value={formData.nome} onChange={handleChange} className={`mt-1.5 ${fieldClass}`} />
          </div>
          <div>
            <Label htmlFor="cognome" className={labelClass}>
              {t("auth.surname")} *
            </Label>
            <Input id="cognome" name="cognome" type="text" required value={formData.cognome} onChange={handleChange} className={`mt-1.5 ${fieldClass}`} />
          </div>
        </div>

        <div>
          <Label htmlFor="email" className={labelClass}>
            {t("auth.email")} *
          </Label>
          <Input id="email" name="email" type="email" autoComplete="email" required value={formData.email} onChange={handleChange} className={`mt-1.5 ${fieldClass}`} />
        </div>

        <div>
          <Label htmlFor="telefono" className={labelClass}>
            {t("auth.phone")}
          </Label>
          <Input id="telefono" name="telefono" type="tel" autoComplete="tel" value={formData.telefono} onChange={handleChange} className={`mt-1.5 ${fieldClass}`} />
        </div>

        <div>
          <Label htmlFor="password" className={labelClass}>
            {t("auth.password")} *
          </Label>
          <div className="relative mt-1.5">
            <Input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              autoComplete="new-password"
              required
              value={formData.password}
              onChange={handleChange}
              className={`${fieldClass} pr-12`}
            />
            <button
              type="button"
              className="absolute inset-y-0 right-0 flex items-center px-4 text-brand-blue/50 hover:text-brand-blue"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? t("auth.hidePassword") : t("auth.showPassword")}
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </div>

        <div>
          <Label htmlFor="confermaPassword" className={labelClass}>
            {t("auth.confirmPassword")} *
          </Label>
          <div className="relative mt-1.5">
            <Input
              id="confermaPassword"
              name="confermaPassword"
              type={showConfirmPassword ? "text" : "password"}
              autoComplete="new-password"
              required
              value={formData.confermaPassword}
              onChange={handleChange}
              className={`${fieldClass} pr-12`}
            />
            <button
              type="button"
              className="absolute inset-y-0 right-0 flex items-center px-4 text-brand-blue/50 hover:text-brand-blue"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              aria-label={showConfirmPassword ? t("auth.hidePassword") : t("auth.showPassword")}
            >
              {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </div>

        {error ? (
          <p className="rounded-2xl bg-red-50 px-4 py-3 text-center text-sm text-red-700" role="alert">
            {error}
          </p>
        ) : null}

        <div className="space-y-3 pt-2">
          <Button type="submit" disabled={loading} className={`w-full ${primaryButtonClass}`}>
            {loading ? t("common.loading") : t("auth.register")}
          </Button>
          <AuthOr label={t("auth.or")} />
          <Button type="button" variant="outline" onClick={handleGoogleSignup} disabled={loading} className={`w-full ${quietButtonClass}`}>
            <GoogleGlyph />
            {t("auth.registerWithGoogle")}
          </Button>
        </div>
      </form>
    </AuthFrame>
  );
};

export default Register;
