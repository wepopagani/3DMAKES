import { useEffect, useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { useTranslation } from "react-i18next";
import { auth } from "@/firebase/config";
import { useAuth } from "@/firebase/AuthContext";
import { toast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  AuthBusy,
  AuthFrame,
  AuthOr,
  GoogleGlyph,
  fieldClass,
  labelClass,
  primaryButtonClass,
  quietButtonClass,
  textLinkClass,
} from "@/components/anteprima/accountUi";

const Login = () => {
  const { t } = useTranslation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { currentUser, isAdmin, logInWithGoogle, loading: authLoading } = useAuth();

  useEffect(() => {
    if (authLoading || !currentUser) return;
    navigate(isAdmin ? "/admin" : "/dashboard", { replace: true });
  }, [authLoading, currentUser, isAdmin, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await signInWithEmailAndPassword(auth, email, password);

      toast({
        title: t("auth.loginSuccess"),
        description: t("auth.loginSuccess"),
      });

      if (isAdmin) {
        navigate("/admin");
      } else {
        navigate("/dashboard");
      }
    } catch (error: any) {
      console.error("Errore durante l'accesso:", error);

      if (error.code === "auth/too-many-requests") {
        setError(t("auth.tooManyAttempts"));
      } else {
        setError(t("auth.loginError"));
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError("");

    try {
      await logInWithGoogle();

      toast({
        title: t("auth.loginSuccess"),
        description: t("auth.loginSuccess"),
      });

      if (isAdmin) {
        navigate("/admin");
      } else {
        navigate("/dashboard");
      }
    } catch (error: any) {
      console.error("Errore durante l'accesso con Google:", error);

      if (error.code === "auth/popup-closed-by-user") {
        setError(t("auth.popupClosed"));
      } else if (error.code === "auth/popup-blocked") {
        setError(t("auth.popupBlocked"));
      } else {
        setError(t("auth.loginError"));
      }
    } finally {
      setLoading(false);
    }
  };

  if (authLoading || currentUser) {
    return <AuthBusy />;
  }

  return (
    <AuthFrame
      title={t("auth.login")}
      lede={
        <>
          {t("auth.noAccount")}{" "}
          <Link to="/register" className={textLinkClass}>
            {t("auth.register")}
          </Link>
        </>
      }
    >
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
        <div>
          <Label htmlFor="password" className={labelClass}>
            {t("auth.password")}
          </Label>
          <div className="relative mt-1.5">
            <Input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
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

        <div className="text-right text-sm">
          <Link to="/forgot-password" className={textLinkClass}>
            {t("auth.forgotPassword")}
          </Link>
        </div>

        {error ? (
          <p className="rounded-2xl bg-red-50 px-4 py-3 text-center text-sm text-red-700" role="alert">
            {error}
          </p>
        ) : null}

        <div className="space-y-3">
          <Button type="submit" disabled={loading} className={`w-full ${primaryButtonClass}`}>
            {loading ? t("common.loading") : t("auth.login")}
          </Button>
          <AuthOr label={t("auth.or")} />
          <Button
            type="button"
            variant="outline"
            onClick={handleGoogleLogin}
            disabled={loading}
            className={`w-full ${quietButtonClass}`}
          >
            <GoogleGlyph />
            {t("auth.loginWithGoogle")}
          </Button>
        </div>
      </form>
    </AuthFrame>
  );
};

export default Login;
