import { useState } from "react";
import { supabase, isSupabaseAvailable } from "@/lib/supabase";
import { Navigate, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/context/AuthContext";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { LanguageSwitcher } from "@/components/shared/LanguageSwitcher";
import { ThemeToggle } from "@/components/shared/ThemeToggle";
import { LuZap as Zap } from "react-icons/lu";

export default function AuthPage() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "ar";

  if (user) {
    return <Navigate to="/" replace />;
  }

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (!isSupabaseAvailable() || !supabase) {
      // Offline Demo Mode
      setTimeout(() => {
        const userData = {
          id: "offline-user",
          email,
          user_metadata: { full_name: fullName || email.split("@")[0] }
        };
        localStorage.setItem("thinks-offline-session", JSON.stringify({
          user: userData,
          access_token: "offline-token"
        }));
        
        toast.success(isRTL ? "تم تسجيل الدخول في وضع عدم الاتصال" : "Offline mode logged in.");
        
        // Reload to force AuthContext to pick up the simulated session
        window.location.reload();
      }, 1000);
      return;
    }

    try {
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: fullName,
            },
          },
        });
        if (error) throw error;
        toast.success(isRTL ? "تم إنشاء الحساب، يرجى الاستمرار" : "Account created successfully.");
        navigate("/");
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        toast.success(isRTL ? "تم تسجيل الدخول بنجاح" : "Successfully logged in.");
      }
    } catch (error: any) {
      toast.error(error.message || (isRTL ? "حدث خطأ ما" : "An error occurred"));
      setLoading(false);
    }
  };

  return (
    <div className="h-screen w-full flex items-center justify-center p-4 overflow-hidden" dir={isRTL ? "rtl" : "ltr"}>
      <div className="absolute top-4 inset-inline-end-4 z-20 flex items-center gap-2">
        <ThemeToggle />
        <LanguageSwitcher />
      </div>
      <div className="absolute inset-0 bg-background pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full blur-[120px] bg-primary/20" />
      </div>

      <Card className="w-full max-w-md relative z-10 glass border-primary/20">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-6">
            <div className="h-20 w-auto px-6 py-2 rounded-2xl bg-secondary/30 flex items-center justify-center">
              <img src="/logo-full.png" alt="ThinkStack Logo" className="h-full object-contain dark:invert" />
            </div>
          </div>
          <CardDescription>
            {isSignUp
              ? isRTL ? "أنشئ حساباً للبدء" : "Create an account to get started"
              : isRTL ? "قم بتسجيل الدخول إلى حسابك" : "Sign in to your account"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAuth} className="space-y-4">
            {isSignUp && (
              <div className="space-y-2">
                <Label htmlFor="fullName" className="text-start block">{isRTL ? "الاسم الكامل" : "Full Name"}</Label>
                <Input
                  id="fullName"
                  type="text"
                  placeholder={isRTL ? "أحمد محمد" : "John Doe"}
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                  className="bg-secondary/50 border-input text-start"
                />
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-start block">{isRTL ? "البريد الإلكتروني" : "Email"}</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-secondary/50 border-input text-start"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-start block">{isRTL ? "كلمة المرور" : "Password"}</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="bg-secondary/50 border-input text-start"
              />
            </div>
            <Button
              type="submit"
              className="w-full"
              disabled={loading}
            >
              {loading
                ? (isRTL ? "جاري التحميل..." : "Loading...")
                : isSignUp
                  ? (isRTL ? "إنشاء حساب" : "Sign Up")
                  : (isRTL ? "تسجيل الدخول" : "Sign In")}
            </Button>
          </form>
          
          {!isSupabaseAvailable() && (
            <div className="mt-4 p-3 bg-destructive/10 text-destructive text-sm rounded-md text-center">
              {isRTL
                ? "قاعدة بيانات Supabase غير متصلة. يرجى إضافة الإعدادات في .env للعمل بكامل الميزات."
                : "Supabase database is not connected. Add settings to .env for full features."}
            </div>
          )}
        </CardContent>
        <CardFooter className="flex flex-col items-center">
          <p className="text-sm text-muted-foreground mt-2">
            {isSignUp
              ? isRTL ? "لديك حساب بالفعل؟" : "Already have an account?"
              : isRTL ? "ليس لديك حساب؟" : "Don't have an account?"}{" "}
            <button
              type="button"
              onClick={() => setIsSignUp(!isSignUp)}
              className="font-medium text-primary hover:underline cursor-pointer bg-transparent border-0 p-0"
            >
              {isSignUp
                ? isRTL ? "تسجيل الدخول" : "Sign In"
                : isRTL ? "إنشاء حساب" : "Sign Up"}
            </button>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
