import React from 'react'
import { Flight } from '../types/takeoff'
import { Plane, Clock, CheckCircle2, UserCheck, TrendingUp, ShieldAlert } from 'lucide-react'

interface TakeOffMetricsBarProps {
  flights: Flight[]
  theme?: 'dark' | 'light'
}

export const TakeOffMetricsBar: React.FC<TakeOffMetricsBarProps> = ({ flights, theme = 'dark' }) => {
  const isDark = theme === 'dark'
  const total = flights.length
  const delayed = flights.filter((f) => f.status === 'Delayed').length
  const offBlock = flights.filter((f) => f.status === 'Off Block').length
  const departed = flights.filter((f) => f.status === 'Departed' || f.status === 'Landed' || f.status === 'Arrived').length
  const onTime = flights.filter((f) => f.delayMinutes === 0 && f.status !== 'Cancelled').length
  const onTimePct = total > 0 ? Math.round((onTime / total) * 100) : 100
  const totalAlerts = flights.reduce((acc, f) => acc + f.alerts.length, 0)
  const criticalCount = flights.filter((f) => f.alerts.some((a) => a.level === 'critical')).length

  const cards = [
    {
      label: 'TOTAL FLIGHTS',
      value: total,
      subText: 'Scheduled today',
      icon: Plane,
      accent: isDark ? 'text-white' : 'text-slate-900',
      bgIcon: isDark ? 'bg-[#1B253B] text-slate-300' : 'bg-slate-100 text-slate-700',
    },
    {
      label: 'ON-TIME PERFORMANCE',
      value: `${onTimePct}%`,
      subText: `${onTime} flights on schedule`,
      icon: CheckCircle2,
      accent: isDark ? 'text-emerald-400' : 'text-emerald-600',
      bgIcon: isDark ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-800/40' : 'bg-emerald-50 text-emerald-700 border border-emerald-200',
      badge: '+2.4%',
    },
    {
      label: 'ACTIVE DELAYS',
      value: delayed,
      subText: `${Math.round((delayed / (total || 1)) * 100)}% of hub flights`,
      icon: Clock,
      accent: delayed > 2 ? (isDark ? 'text-amber-400' : 'text-amber-600') : (isDark ? 'text-slate-200' : 'text-slate-800'),
      bgIcon: delayed > 2
        ? (isDark ? 'bg-amber-950/60 text-amber-400 border border-amber-800/40' : 'bg-amber-50 text-amber-700 border border-amber-200')
        : (isDark ? 'bg-[#1B253B] text-slate-400' : 'bg-slate-100 text-slate-600'),
    },
    {
      label: 'OFF BLOCK / PUSHBACK',
      value: offBlock,
      subText: 'Active ramp movement',
      icon: UserCheck,
      accent: isDark ? 'text-blue-400' : 'text-blue-600',
      bgIcon: isDark ? 'bg-blue-950/60 text-blue-400 border border-blue-800/40' : 'bg-blue-50 text-blue-700 border border-blue-200',
    },
    {
      label: 'DEPARTED / EN ROUTE',
      value: departed,
      subText: 'Airborne trajectory',
      icon: TrendingUp,
      accent: isDark ? 'text-purple-400' : 'text-purple-600',
      bgIcon: isDark ? 'bg-purple-950/60 text-purple-400 border border-purple-800/40' : 'bg-purple-50 text-purple-700 border border-purple-200',
    },
    {
      label: 'CRITICAL ALERTS',
      value: criticalCount,
      subText: `${totalAlerts} total notifications`,
      icon: ShieldAlert,
      accent: criticalCount > 0 ? 'text-[#C8102E]' : (isDark ? 'text-slate-400' : 'text-slate-600'),
      bgIcon: criticalCount > 0
        ? (isDark ? 'bg-red-950/60 text-[#C8102E] border border-red-900/60' : 'bg-red-50 text-[#C8102E] border border-red-200')
        : (isDark ? 'bg-[#1B253B] text-slate-400' : 'bg-slate-100 text-slate-600'),
    },
  ]

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-4">
      {cards.map((card, idx) => {
        const Icon = card.icon
        return (
          <div
            key={idx}
            className={`rounded-xl p-3.5 shadow-2xs transition-all flex flex-col justify-between border ${
              isDark
                ? 'bg-[#131B2E] border-[#1E2D48] hover:border-[#2E4268]'
                : 'bg-white border-slate-200 hover:border-slate-300 shadow-2xs'
            }`}
          >
            <div className="flex items-center justify-between gap-1 mb-2">
              <span className={`text-[10px] font-extrabold tracking-wider uppercase truncate ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                {card.label}
              </span>
              <div className={`p-1.5 rounded-lg ${card.bgIcon}`}>
                <Icon className="w-3.5 h-3.5" />
              </div>
            </div>
            <div className="flex items-baseline justify-between gap-2">
              <span className={`text-2xl font-black tracking-tight font-mono ${card.accent}`}>
                {card.value}
              </span>
              {card.badge && (
                <span
                  className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md border ${
                    isDark
                      ? 'text-emerald-400 bg-emerald-950/80 border-emerald-800/50'
                      : 'text-emerald-700 bg-emerald-100 border-emerald-200'
                  }`}
                >
                  {card.badge}
                </span>
              )}
            </div>
            <span className={`text-[11px] font-medium mt-1 truncate ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              {card.subText}
            </span>
          </div>
        )
      })}
    </div>
  )
}
