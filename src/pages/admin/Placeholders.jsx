import React from 'react';

export default function Placeholders({ title }) {
  return (
    <div className="flex flex-col h-full bg-white border border-slate-100 rounded-2xl p-8 shadow-sm">
      <h1 className="text-2xl font-bold text-slate-900 mb-4">{title}</h1>
      <div className="flex-1 border-2 border-dashed border-slate-200 rounded-xl flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <p className="text-slate-500 font-semibold mb-2">This section is under construction</p>
          <p className="text-xs text-slate-400">The UI for {title} will be implemented here soon.</p>
        </div>
      </div>
    </div>
  );
}
