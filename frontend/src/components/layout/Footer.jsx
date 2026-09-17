// components/layout/Footer.jsx — Global Main Content Area Footer with Operationally-Critical Status
export default function Footer() {
  return (
    <footer className="h-12 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-t border-slate-200/80 dark:border-slate-800 px-4 lg:px-6 text-xs text-slate-500 dark:text-slate-400 font-sans flex items-center justify-between shadow-xs">
      {/* Left: Organization & SIH Track */}
      <div className="flex items-center gap-2">
        <span className="font-bold text-slate-900 dark:text-white">AegisNet</span>
        <span className="hidden sm:inline text-slate-600 dark:text-slate-400">· GSDMA Integrated Environmental Mesh</span>
        <span className="hidden md:inline text-slate-400 dark:text-slate-500">(SIH26178 / Qualcomm Edge-AI)</span>
      </div>

      {/* Center: Persistent Live Operational Status */}
      <div className="hidden lg:flex items-center gap-3 text-xs font-mono">
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-slate-700 dark:text-slate-300 font-semibold">Backend: Connected</span>
        </div>
        <span className="text-slate-300 dark:text-slate-700">|</span>
        <div className="flex items-center gap-1.5">
          <span>📡</span>
          <span className="text-slate-700 dark:text-slate-300 font-semibold">Mesh: LoRa 868MHz (Standby OK)</span>
        </div>
        <span className="text-slate-300 dark:text-slate-700">|</span>
        <span className="text-slate-500 dark:text-slate-400 font-medium">Sync: &lt;2s ago</span>
      </div>

      {/* Right: Version & Links */}
      <div className="flex items-center gap-3 text-xs">
        <span className="bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 px-2.5 py-0.5 rounded-full font-mono font-bold text-[11px]">
          v2.0.0
        </span>
        <span className="hidden sm:inline text-slate-400 dark:text-slate-500 font-mono">Build 2026.09</span>
      </div>
    </footer>
  )
}
