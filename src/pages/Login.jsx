import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { Lock, Mail, Loader, Eye, EyeOff } from "lucide-react";

export default function Login({ isAdmin = false }) {
  const { login, loginWithGoogle, resetPassword } = useAuth();
  const { showToast } = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // If we are at /admin/login but didn't pass the prop, we can also check the pathname
  const isActuallyAdmin = isAdmin || location.pathname === "/admin/login";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {

      await login(email, password);
      showToast(`Logged in successfully! Welcome to Nikdel${isActuallyAdmin ? " Admin" : ""}.`, "success");
      navigate(isActuallyAdmin ? "/admin" : "/");
    } catch (err) {
      console.error(err);
      const code = err.code || err.message || "";
      if (code.includes("user-not-found")) {
        setError("Account not found with this email. Try signing up!");
      } else if (
        code.includes("wrong-password") || 
        code.includes("invalid-credential") || 
        code.includes("invalid-email")
      ) {
        setError("Incorrect password or invalid credentials. Please try again.");
      } else {
        setError("Failed to sign in. Please verify your credentials.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError("");
    setLoading(true);
    try {

      await loginWithGoogle();
      showToast(`Logged in successfully via Google! Welcome to Nikdel${isActuallyAdmin ? " Admin" : ""}.`, "success");
      navigate(isActuallyAdmin ? "/admin" : "/");
    } catch (err) {
      console.error(err);
      setError("Google Sign-In failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!email) {
      setError("Please enter your email address to reset your password.");
      return;
    }
    setError("");
    setLoading(true);
    try {
      await resetPassword(email);
      showToast("Password reset email sent! Check your inbox.", "success");
    } catch (err) {
      console.error(err);
      setError("Failed to send password reset email. Make sure the email is correct.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto my-12 bg-white border border-slate-100 rounded-3xl shadow-2xl overflow-hidden grid grid-cols-1 md:grid-cols-2 min-h-[550px] animate-fade-in">
      {/* Left: Brand Showcase */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-950 to-brand-950 p-10 text-white flex flex-col justify-between relative overflow-hidden">
        {/* Glow effects */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-brand-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-brand-600/10 rounded-full blur-3xl pointer-events-none"></div>
        
        {/* Logo/Header */}
        <div className="relative z-10 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-brand-500/20 text-brand-400 flex items-center justify-center font-extrabold text-xl border border-brand-500/30">
            N
          </div>
          <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-brand-300 to-brand-100 bg-clip-text text-transparent">
            Nikdel {isActuallyAdmin && "Admin"}
          </span>
        </div>

        {/* Dynamic Tagline & Features */}
        <div className="relative z-10 my-8 space-y-6">
          <h2 className="text-3xl font-extrabold tracking-tight leading-tight">
            {isActuallyAdmin ? "Manage Your Premium Store." : "Discover the Art of Premium Shopping."}
          </h2>
          <p className="text-slate-400 text-sm leading-relaxed">
            {isActuallyAdmin 
              ? "Access the admin dashboard to manage orders, products, and user analytics seamlessly." 
              : "Join Nikdel to experience hyper-secure checkouts, real-time tracking updates, and custom loyalty incentives."}
          </p>
          
          {/* Feature List */}
          {!isActuallyAdmin && (
            <div className="space-y-4 pt-4 border-t border-slate-800/60">
              <div className="flex items-center gap-3 text-xs font-semibold text-slate-300">
                <span className="w-6 h-6 rounded-full bg-brand-500/10 flex items-center justify-center text-brand-400 border border-brand-500/20">✨</span>
                <span>Free Shipping on Your First Purchase</span>
              </div>
              <div className="flex items-center gap-3 text-xs font-semibold text-slate-300">
                <span className="w-6 h-6 rounded-full bg-brand-500/10 flex items-center justify-center text-brand-400 border border-brand-500/20">🛰️</span>
                <span>Real-Time Tracking Integration</span>
              </div>
              <div className="flex items-center gap-3 text-xs font-semibold text-slate-300">
                <span className="w-6 h-6 rounded-full bg-brand-500/10 flex items-center justify-center text-brand-400 border border-brand-500/20">💳</span>
                <span>Secured Checkout via Paystack Gateway</span>
              </div>
            </div>
          )}
        </div>

        {/* Footer info */}
        <div className="relative z-10 text-[10px] text-slate-500 flex items-center justify-between border-t border-slate-900 pt-4">
          <span>© 2026 Nikdel Store Inc.</span>
          <span>Terms & Privacy</span>
        </div>
      </div>

      {/* Right: Auth Forms */}
      <div className="p-8 sm:p-10 flex flex-col justify-center space-y-6 bg-white">
        <div className="space-y-1">
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">
            {isActuallyAdmin ? "Admin Login" : "Welcome Back"}
          </h2>
          <p className="text-xs text-slate-405 font-bold">
            {isActuallyAdmin ? "Sign in to access the admin portal" : "Sign in to check out and track your orders"}
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-100 text-red-600 font-semibold p-4 rounded-xl text-xs">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email input */}
          <div className="flex flex-col gap-1.5 relative">
            <label className="text-xs font-bold text-slate-500">Email Address</label>
            <div className="relative">
              <Mail size={16} className="text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all"
              />
            </div>
          </div>

          {/* Password input */}
          <div className="flex flex-col gap-1.5 relative">
            <div className="flex justify-between items-center">
              <label className="text-xs font-bold text-slate-500">Password</label>
              <button
                type="button"
                onClick={handleForgotPassword}
                className="text-xs font-bold text-brand-600 hover:text-brand-700 transition-colors"
              >
                Forgot Password?
              </button>
            </div>
            <div className="relative flex items-center">
              <Lock size={16} className="text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-10 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 text-slate-400 hover:text-brand-600 transition-colors"
                title={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full inline-flex items-center justify-center gap-2 bg-slate-900 hover:bg-brand-600 text-white font-bold py-3.5 rounded-xl transition-all shadow-md shadow-slate-900/10 hover:shadow-brand-500/20 disabled:bg-slate-400 cursor-pointer"
          >
            {loading ? (
              <>
                <Loader size={18} className="animate-spin" />
                Signing In...
              </>
            ) : (
              "Sign In"
            )}
          </button>
        </form>

        {/* Divider */}
        <div className="relative flex items-center justify-center my-2">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-100"></div>
          </div>
          <span className="relative px-3 bg-white text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            or continue with
          </span>
        </div>

        {/* Google Sign In */}
        <button
          type="button"
          onClick={handleGoogleLogin}
          disabled={loading}
          className="w-full inline-flex items-center justify-center gap-2.5 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 font-bold py-3 rounded-xl transition-all shadow-sm cursor-pointer disabled:bg-slate-50"
        >
          <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
          Google
        </button>

        {!isActuallyAdmin && (
          <p className="text-center text-xs text-slate-450 font-semibold">
            Don't have an account?{" "}
            <Link to="/signup" className="text-brand-600 hover:underline">
              Sign Up
            </Link>
          </p>
        )}
      </div>
    </div>
  );
}
