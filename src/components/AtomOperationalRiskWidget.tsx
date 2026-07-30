import React from 'react'
import {
  ShieldAlert,
  AlertTriangle,
  Clock,
  CheckCircle2,
  CloudRain,
  Plane,
  Building2,
  Zap,
} from 'lucide-react'

interface AtomOperationalRiskWidgetProps {
  theme?: 'dark' | 'light'
  riskScore?: number
  delayMinutes?: number
  confidencePct?: number
}

export const AtomOperationalRiskWidget: React.FC<AtomOperationalRiskWidgetProps> = ({
  theme = 'dark',
  riskScore = 82,
  delayMinutes = 17,
  confidencePct = 91,
}) => {
  const isDark = theme === 'dark'

  return (
    <div className="space-y-3 select-none">
      {/* 1. PROMINENT OPERATIONAL WARNING BANNER (Top of Flight Details Panel) */}
      <div className="p-3.5 rounded-2xl border bg-gradient-to-r from-red-950/90 via-red-900/40 to-[#0F172A] border-red-800/80 text-red-200 flex items-start gap-3 shadow-md relative overflow-hidden">
        {/* Glowing Alert Indicator */}
        <div className="p-2 rounded-xl bg-red-600/20 text-red-400 border border-red-500/40 flex-shrink-0 flex items-center justify-center mt-0.5">
          <ShieldAlert className="w-5 h-5 text-red-500 animate-pulse" />
        </div>

        <div className="flex-1 space-y-1">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-black uppercase tracking-wide bg-red-600 text-white shadow-2xs">
                HIGH OPERATIONAL RISK
              </span>
              <span className="text-xs font-mono font-bold text-red-400">
                Risk Score: {riskScore}%
              </span>
            </div>

            <div className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-950/80 text-emerald-400 border border-emerald-800/60 flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3 text-emerald-400" />
              <span>High ({confidencePct}%) Confidence</span>
            </div>
          </div>

          <p className="text-xs font-medium text-slate-200 leading-snug">
            Predicted Weather Impact & ATC Slot Restrictions over destination airspace. Alternate stand preparation recommended.
          </p>
        </div>
      </div>

      {/* 2. OPERATIONAL RISK SUMMARY CARD */}
      <div
        className={`p-3.5 rounded-2xl border space-y-3 transition-colors ${
          isDark ? 'bg-[#0F172A] border-[#334155] text-slate-100' : 'bg-slate-50 border-slate-200 text-slate-900'
        }`}
      >
        <div className="flex items-center justify-between border-b pb-2 border-[#334155]/60">
          <div className="flex items-center gap-2">
            <div className="w-1 h-4 bg-red-500 rounded-full" />
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-300">
              Operational Risk & Delay Probability
            </h3>
          </div>
          <span className="text-[10px] font-mono text-slate-400">Real-time ML Model</span>
        </div>

        <div className="grid grid-cols-4 gap-2 text-center font-mono">
          {/* Risk Score */}
          <div className="p-2.5 rounded-xl bg-[#1E293B] border border-red-800/60 flex flex-col justify-between">
            <span className="text-[10px] font-bold text-slate-400 uppercase font-sans">Risk Score</span>
            <span className="text-2xl font-black text-red-500 mt-0.5">{riskScore}%</span>
            <span className="text-[9px] font-bold text-red-400 uppercase">HIGH RISK</span>
          </div>

          {/* Delay Probability */}
          <div className="p-2.5 rounded-xl bg-[#1E293B] border border-amber-800/60 flex flex-col justify-between">
            <span className="text-[10px] font-bold text-slate-400 uppercase font-sans">Delay Prob.</span>
            <span className="text-2xl font-black text-amber-400 mt-0.5">78%</span>
            <span className="text-[9px] font-bold text-amber-400 uppercase">LIKELY</span>
          </div>

          {/* Est Delay */}
          <div className="p-2.5 rounded-xl bg-[#1E293B] border border-amber-800/60 flex flex-col justify-between">
            <span className="text-[10px] font-bold text-slate-400 uppercase font-sans">Est. Delay</span>
            <span className="text-2xl font-black text-amber-400 mt-0.5">+{delayMinutes}m</span>
            <span className="text-[9px] font-bold text-amber-400 uppercase">CTOT RISK</span>
          </div>

          {/* Risk Level */}
          <div className="p-2.5 rounded-xl bg-[#1E293B] border border-emerald-800/60 flex flex-col justify-between">
            <span className="text-[10px] font-bold text-slate-400 uppercase font-sans">Confidence</span>
            <span className="text-2xl font-black text-emerald-400 mt-0.5">{confidencePct}%</span>
            <span className="text-[9px] font-bold text-emerald-400 uppercase">HIGH</span>
          </div>
        </div>

        {/* Top Operational Risk Factors */}
        <div className="flex items-center gap-1.5 flex-wrap pt-1 text-xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mr-1">
            Risk Factors:
          </span>
          <span className="px-2 py-0.5 rounded-lg font-semibold bg-amber-950/70 border border-amber-800/60 text-amber-300 flex items-center gap-1">
            <CloudRain className="w-3 h-3 text-amber-400" /> Thunderstorm
          </span>
          <span className="px-2 py-0.5 rounded-lg font-semibold bg-red-950/70 border border-red-800/60 text-red-300 flex items-center gap-1">
            <Plane className="w-3 h-3 text-red-400" /> Late Inbound
          </span>
          <span className="px-2 py-0.5 rounded-lg font-semibold bg-amber-950/70 border border-amber-800/60 text-amber-300 flex items-center gap-1">
            <Building2 className="w-3 h-3 text-amber-400" /> High Apron Traffic
          </span>
        </div>
      </div>
    </div>
  )
}
