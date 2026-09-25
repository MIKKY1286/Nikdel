import React, { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { Lock, Loader, Eye, EyeOff } from "lucide-react";

export default function ResetPassword() {
  const { submitResetPassword } = useAuth();
  const { showToast } = useToast();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const token = searchParams.get("token");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!token) {
      setError("Invalid or missing reset token.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const user = await submitResetPassword(token, password);
      showToast("Password reset successfully!", "success");
      
      // Navigate to appropriate home/dashboard based on role
      if (user?.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/");
      }
    } catch (err) {
      console.error(err);
      setError("Failed to reset password. The token may be invalid or expired.");
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="max-w-md mx-auto my-12 bg-white border border-slate-100 rounded-3xl p-8 shadow-2xl text-center">
        <h2 className="text-2xl font-bold text-slate-900 mb-4">Invalid Link</h2>
        <p className="text-slate-500 mb-6">The password reset link is missing or invalid. Please request a new password reset from the login page.</p>
        <button onClick={() => navigate("/login")} className="bg-brand-600 hover:bg-brand-700 text-white font-bold py-3 px-6 rounded-xl transition-all">
          Go to Login
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto my-12 bg-white border border-slate-100 rounded-3xl p-8 shadow-2xl animate-fade-in flex flex-col space-y-6">
      <div className="space-y-1 text-center">
        <h2 className="text-2xl font-bold tracking-tight text-slate-900">Reset Password</h2>
        <p className="text-xs text-slate-500 font-bold">Enter your new password below.</p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-100 text-red-600 font-semibold p-4 rounded-xl text-xs">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Password input */}
        <div className="flex flex-col gap-1.5 relative">
          <label className="text-xs font-bold text-slate-500">New Password</label>
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

        {/* Confirm Password input */}
        <div className="flex flex-col gap-1.5 relative">
          <label className="text-xs font-bold text-slate-500">Confirm Password</label>
          <div className="relative flex items-center">
            <Lock size={16} className="text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all"
            />
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
              Resetting...
            </>
          ) : (
            "Reset Password"
          )}
        </button>
      </form>
    </div>
  );
}
