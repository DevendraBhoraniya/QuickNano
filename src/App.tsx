import { Sparkles, FileText, List, Zap } from 'lucide-react';

function App() {
  return (
    <div className="w-80 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border-b border-cyan-500/20 p-4">
        <div className="flex items-center justify-center gap-2 mb-1">
          <Sparkles className="w-5 h-5 text-cyan-400" />
          <h1 className="text-xl font-bold text-cyan-400">QuickNano</h1>
        </div>
        <div className="flex items-center justify-center gap-2 text-xs text-slate-400">
          <span className="bg-slate-800/60 px-2 py-0.5 rounded-full">v1.0</span>
          <span>•</span>
          <span className="flex items-center gap-1">
            <Zap className="w-3 h-3" />
            On-device AI
          </span>
        </div>
      </div>

      <div className="p-4">
        {/* Tagline */}
        <div className="bg-gradient-to-r from-cyan-500/5 to-blue-500/5 border border-cyan-500/20 rounded-lg p-3 mb-4">
          <p className="text-xs text-slate-300 leading-relaxed text-center">
            <span className="text-cyan-300 font-semibold">Rewrite & Summarize</span> web content with Chrome's built-in AI
          </p>
          <p className="text-xs text-emerald-400 text-center mt-1 flex items-center justify-center gap-1">
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            100% private • No data sent
          </p>
        </div>

        {/* Features */}
        <div className="space-y-2.5">
          <div className="group bg-slate-800/40 hover:bg-slate-800/60 border border-slate-700 hover:border-cyan-500/50 rounded-lg p-3 transition-all cursor-default">
            <div className="flex items-center gap-2 mb-2">
              <div className="bg-cyan-500/10 p-1.5 rounded-lg group-hover:bg-cyan-500/20 transition-colors">
                <FileText className="w-4 h-4 text-cyan-400" />
              </div>
              <h3 className="text-sm font-semibold text-cyan-100">Rewrite & Explain</h3>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed ml-8">
              Select text → Right-click → <span className="text-slate-300 font-medium">"Rewrite & Explain"</span>
            </p>
            <p className="text-xs text-slate-500 leading-relaxed ml-8 mt-1">
              Simplifies complex text instantly
            </p>
          </div>

          <div className="group bg-slate-800/40 hover:bg-slate-800/60 border border-slate-700 hover:border-yellow-500/50 rounded-lg p-3 transition-all cursor-default">
            <div className="flex items-center gap-2 mb-2">
              <div className="bg-yellow-500/10 p-1.5 rounded-lg group-hover:bg-yellow-500/20 transition-colors">
                <Zap className="w-4 h-4 text-yellow-400" />
              </div>
              <h3 className="text-sm font-semibold text-yellow-100">TL;DR Summary</h3>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed ml-8">
              Right-click page → <span className="text-slate-300 font-medium">"Summarize → TL;DR"</span>
            </p>
            <p className="text-xs text-slate-500 leading-relaxed ml-8 mt-1">
              Get a quick page overview
            </p>
          </div>

          <div className="group bg-slate-800/40 hover:bg-slate-800/60 border border-slate-700 hover:border-emerald-500/50 rounded-lg p-3 transition-all cursor-default">
            <div className="flex items-center gap-2 mb-2">
              <div className="bg-emerald-500/10 p-1.5 rounded-lg group-hover:bg-emerald-500/20 transition-colors">
                <List className="w-4 h-4 text-emerald-400" />
              </div>
              <h3 className="text-sm font-semibold text-emerald-100">Key Points</h3>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed ml-8">
              Right-click page → <span className="text-slate-300 font-medium">"Summarize → Key Points"</span>
            </p>
            <p className="text-xs text-slate-500 leading-relaxed ml-8 mt-1">
              Extract main ideas as bullets
            </p>
          </div>
        </div>

        {/* Requirements */}
        <div className="mt-4 bg-amber-500/10 border border-amber-500/30 rounded-lg p-3">
          <div className="flex items-start gap-2">
            <svg className="w-4 h-4 text-amber-400 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <div>
              <p className="text-xs text-amber-300 font-medium">Requirements</p>
              <p className="text-xs text-amber-200/80 mt-1 leading-relaxed">
                Chrome 127+ with Gemini Nano enabled via{' '}
                <code className="bg-amber-900/40 px-1.5 py-0.5 rounded text-amber-300">chrome://flags</code>
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-4 pt-3 border-t border-slate-700/50 text-center">
          <p className="text-xs text-slate-500">
            Powered by <span className="text-slate-400 font-medium">Chrome's Gemini Nano</span>
          </p>
          <p className="text-xs text-slate-500 mt-1">
            Made with 🧡 by Dev
          </p>
        </div>
      </div>
    </div>
  );
}

export default App;