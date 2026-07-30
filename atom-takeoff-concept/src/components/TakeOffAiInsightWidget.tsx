import React from 'react'
import {
  Sparkles,
  AlertTriangle,
  Clock,
  CheckCircle2,
  CloudRain,
  Plane,
  Building2,
  BellRing,
  ArrowRight,
  BrainCircuit,
  Zap,
} from 'lucide-react'

interface TakeOffAiInsightWidgetProps {
  theme?: 'dark' | 'light'
}

export const TakeOffAiInsightWidget: React.FC<TakeOffAiInsightWidgetProps> = ({
  theme = 'dark',
}) => {
  const isDark = theme === 'dark'

  return (
    <div
      className={`rounded-2xl border p-4 space-y-3.5 transition-all shadow-md relative overflow-hidden select-none ${
        isDark
          ? 'bg-gradient-to-br from-[#1A1528] via-[#131B2E] to-[#0B0F19] border-[#2A2342] text-[#F8FAFC]'
          : 'bg-gradient-to-br from-purple-50 via-slate-50 to-white border-purple-200 text-slate-900 shadow-2xs'
      }`}
    >
      {/* Background Decorative Accent */}
      <div className="absolute -right-6 -top-6 w-24 h-24 rounded-full bg-purple-600/10 blur-xl pointer-events-none" />

      {/* Header Bar */}
      <div className="flex items-center justify-between gap-2 border-b pb-2.5 border-purple-500/20">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-xl bg-purple-500/20 text-purple-400 border border-purple-500/30 flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-purple-300 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h3 className="text-xs font-black uppercase tracking-wider text-purple-300">
                AI Operational Predictive Analytics
              </h3>
              <span className="px-1.5 py-0.2 rounded text-[9px] font-mono font-extrabold bg-purple-950/80 text-purple-300 border border-purple-700/50">
                v4.2 OCC ML
              </span>
            </div>
            <p className="text-[10px] text-slate-400 font-medium">Real-time ML delay propagation inference</p>
          </div>
        </div>

        {/* Confidence Badge */}
        <div className="flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-extrabold font-mono bg-emerald-950/80 text-emerald-400 border border-emerald-800/60">
          <CheckCircle2 className="w-3 h-3 text-emerald-400" />
          <span>Confidence: High (91%)</span>
        </div>
      </div>

      {/* Top 3 Metric Callout Cards */}
      <div className="grid grid-cols-2 gap-2.5">
        {/* Metric 1: Operational Risk */}
        <div
          className={`p-3 rounded-xl border flex flex-col justify-between ${
            isDark ? 'bg-[#0B0F19]/80 border-[#1E2D48]' : 'bg-white border-slate-200 shadow-2xs'
          }`}
        >
          <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
            <span>Operational Risk</span>
            <AlertTriangle className="w-3.5 h-3.5 text-[#C8102E]" />
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-black font-mono text-red-500 tracking-tight">82%</span>
            <span className="px-1.5 py-0.2 rounded text-[9px] font-bold uppercase bg-red-950/80 text-red-400 border border-red-800/60">
              HIGH RISK
            </span>
          </div>
          <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden mt-2">
            <div className="h-full bg-[#C8102E] rounded-full" style={{ width: '82%' }} />
          </div>
        </div>

        {/* Metric 2: Predicted Delay */}
        <div
          className={`p-3 rounded-xl border flex flex-col justify-between ${
            isDark ? 'bg-[#0B0F19]/80 border-[#1E2D48]' : 'bg-white border-slate-200 shadow-2xs'
          }`}
        >
          <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
            <span>Predicted Delay</span>
            <Clock className="w-3.5 h-3.5 text-amber-400" />
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-black font-mono text-amber-400 tracking-tight">+17 min</span>
            <span className="px-1.5 py-0.2 rounded text-[9px] font-bold uppercase bg-amber-950/80 text-amber-400 border border-amber-800/60">
              CTOT RISK
            </span>
          </div>
          <div className="text-[10px] text-slate-400 font-mono mt-1">
            Estimated Off-Block: <span className="text-white font-bold">10:32 TRT</span>
          </div>
        </div>
      </div>

      {/* Top Factors Section */}
      <div className="space-y-1.5">
        <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block">
          Top Risk Factors
        </span>
        <div className="flex flex-wrap gap-1.5">
          <div className="px-2.5 py-1 rounded-xl text-xs font-semibold flex items-center gap-1.5 bg-sky-950/70 border border-sky-800/60 text-sky-300">
            <CloudRain className="w-3.5 h-3.5 text-sky-400" />
            <span>Thunderstorm</span>
          </div>
          <div className="px-2.5 py-1 rounded-xl text-xs font-semibold flex items-center gap-1.5 bg-amber-950/70 border border-amber-800/60 text-amber-300">
            <Plane className="w-3.5 h-3.5 text-amber-400" />
            <span>Late inbound aircraft</span>
          </div>
          <div className="px-2.5 py-1 rounded-xl text-xs font-semibold flex items-center gap-1.5 bg-purple-950/70 border border-purple-800/60 text-purple-300">
            <Building2 className="w-3.5 h-3.5 text-purple-400" />
            <span>High apron traffic</span>
          </div>
        </div>
      </div>

      {/* Recommended Actions Section */}
      <div className="space-y-1.5 pt-1 border-t border-purple-500/20">
        <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block">
          AI Recommended Operational Actions
        </span>
        <div className="space-y-1.5">
          {[
            { label: 'Notify Ground Operations', icon: BellRing, color: 'text-amber-400' },
            { label: 'Prepare alternate stand', icon: Building2, color: 'text-sky-400' },
            { label: 'Monitor inbound aircraft ETA', icon: Clock, color: 'text-purple-400' },
          ].map((action, idx) => {
            const Icon = action.icon
            return (
              <div
                key={idx}
                className={`p-2 rounded-xl border flex items-center justify-between text-xs font-bold transition-colors ${
                  isDark
                    ? 'bg-[#0B0F19] border-[#1E2D48] hover:border-purple-500/50'
                    : 'bg-white border-slate-200 hover:border-purple-300 shadow-2xs'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Icon className={`w-3.5 h-3.5 ${action.color}`} />
                  <span className={isDark ? 'text-slate-200' : 'text-slate-800'}>{action.label}</span>
                </div>
                <button className="px-2 py-0.5 rounded-lg text-[10px] font-extrabold bg-[#C8102E]/20 text-[#C8102E] border border-[#C8102E]/40 hover:bg-[#C8102E] hover:text-white transition-colors flex items-center gap-1">
                  <span>Execute</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
