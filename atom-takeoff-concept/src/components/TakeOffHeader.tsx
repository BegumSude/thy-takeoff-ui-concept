import React, { useState, useEffect } from 'react'
import {
  Search,
  Clock,
  Activity,
  Sliders,
  Settings,
  Sun,
  Moon,
  Radio,
  Building2,
  Bell,
  Sparkles,
} from 'lucide-react'

interface TakeOffHeaderProps {
  quickSearch: string
  onQuickSearchChange: (val: string) => void
  liveActive: boolean
  onToggleLive: () => void
  onOpenSettings: () => void
  onOpenAdvancedFilter: () => void
  activeHub: string
  onHubChange: (hub: string) => void
  theme: 'dark' | 'light'
  onToggleTheme: () => void
  activeNav: string
}

export const TakeOffHeader: React.FC<TakeOffHeaderProps> = ({
  quickSearch,
  onQuickSearchChange,
  liveActive,
  onToggleLive,
  onOpenSettings,
  onOpenAdvancedFilter,
  activeHub,
  onHubChange,
  theme,
  onToggleTheme,
  activeNav,
}) => {
  const [utcTime, setUtcTime] = useState('')
  const isDark = theme === 'dark'

  useEffect(() => {
    const updateClock = () => {
      const now = new Date()
      const timeStr = now.toLocaleTimeString('en-GB', { timeZone: 'Europe/Istanbul' })
      const dateStr = now.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      })
      setUtcTime(`${dateStr} · ${timeStr} TRT (UTC+3)`)
    }
    updateClock()
    const timer = setInterval(updateClock, 1000)
    return () => clearInterval(timer)
  }, [])

  return (
    <header
      className={`h-16 px-4 flex items-center justify-between border-b select-none flex-shrink-0 transition-colors ${
        isDark
          ? 'bg-[#131B2E] border-[#1E2D48] text-[#F8FAFC]'
          : 'bg-white border-slate-200 text-slate-900 shadow-2xs'
      }`}
    >
      {/* Left: Active Breadcrumb & Station Hub Selector */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <div className="px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-[#C8102E] text-white">
            ATOM
          </div>
          <span className={`text-xs font-mono font-bold ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            /
          </span>
          
        </div>

        {/* Station Hub Buttons */}
        <div
          className={`flex items-center gap-1 p-1 rounded-xl border ${
            isDark ? 'bg-[#0F172A] border-[#1E2D48]' : 'bg-slate-100 border-slate-200'
          }`}
        >
          {['IST', 'SAW', 'ESB', 'AYT'].map((hub) => (
            <button
              key={hub}
              onClick={() => onHubChange(hub)}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold font-mono transition-all ${
                activeHub === hub
                  ? 'bg-[#C8102E] text-white shadow-2xs'
                  : isDark
                  ? 'text-slate-400 hover:text-white hover:bg-[#1E253B]'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white'
              }`}
            >
              {hub}
            </button>
          ))}
        </div>
      </div>

      {/* Center: Global Search Bar */}
      <div className="flex-1 max-w-md mx-6">
        <div className="relative">
          <Search
            className={`w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 ${
              isDark ? 'text-slate-500' : 'text-slate-400'
            }`}
          />
          <input
            type="text"
            value={quickSearch}
            onChange={(e) => onQuickSearchChange(e.target.value)}
            placeholder="Search Flight, Callsign..."
            className={`w-full pl-9 pr-4 py-1.5 rounded-xl text-xs font-medium border outline-none transition-all ${
              isDark
                ? 'bg-[#0B0F19] border-[#1E2D48] text-white placeholder-slate-500 focus:border-[#C8102E]'
                : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400 focus:border-[#C8102E]'
            }`}
          />
          <span
            className={`absolute right-2.5 top-1/2 -translate-y-1/2 text-[9px] font-mono font-bold px-1.5 py-0.5 rounded border ${
              isDark ? 'bg-[#1E253B] border-[#2E4268] text-slate-400' : 'bg-slate-200 border-slate-300 text-slate-600'
            }`}
          >
            ⌘K
          </span>
        </div>
      </div>

      {/* Right: Live Telemetry Indicator, UTC Clock, Theme Toggle & Controls */}
      <div className="flex items-center gap-3">
      

        {/* Theme Switcher Button */}
        <button
          onClick={onToggleTheme}
          className={`p-2 rounded-xl border transition-colors ${
            isDark
              ? 'bg-[#0F172A] border-[#1E2D48] text-amber-400 hover:bg-[#1E253B]'
              : 'bg-slate-100 border-slate-200 text-indigo-600 hover:bg-slate-200'
          }`}
          title={isDark ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
        >
          {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>

        {/* Advanced Filters Button */}
        <button
          onClick={onOpenAdvancedFilter}
          className={`p-2 rounded-xl border transition-colors ${
            isDark
              ? 'bg-[#0F172A] border-[#1E2D48] text-slate-300 hover:bg-[#1E253B]'
              : 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200'
          }`}
          title="Advanced Filter Query Builder"
        >
          <Sliders className="w-4 h-4" />
        </button>

        {/* Settings Button */}
        <button
          onClick={onOpenSettings}
          className={`p-2 rounded-xl border transition-colors ${
            isDark
              ? 'bg-[#0F172A] border-[#1E2D48] text-slate-300 hover:bg-[#1E253B]'
              : 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200'
          }`}
          title="ATOM TakeOff System Settings"
        >
          <Settings className="w-4 h-4" />
        </button>
      </div>
    </header>
  )
}
