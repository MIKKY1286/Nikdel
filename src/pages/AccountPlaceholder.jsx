import React from "react";
import { Hammer } from "lucide-react";

export default function AccountPlaceholder({ title }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] text-center space-y-4 animate-fade-in">
      <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center text-slate-400 border border-slate-100">
        <Hammer size={32} />
      </div>
      <div className="space-y-2">
        <h2 className="text-2xl font-bold text-slate-900">{title}</h2>
        <p className="text-slate-500 max-w-md mx-auto text-sm">
          This section is currently under construction. Check back soon for updates to your {title.toLowerCase()}!
        </p>
      </div>
    </div>
  );
}
