import React, { useState, useEffect } from 'react'
import {
  Search,
  Bell,
  Settings,
  Clock,
  X,
  Building2,
  ChevronRight,
  Filter,
  Sun,
  Moon,
} from 'lucide-react'

interface TopBarProps {
  quickSearch: string
  onQuickSearchChange: (value: string) => void
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

export const TopBar: React.FC<TopBarProps> = ({
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
  const [time, setTime] = useState(new Date())
  const isDark = theme === 'dark'

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  const timeString = time.toLocaleTimeString('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    timeZone: 'Europe/Istanbul',
  })

  const navLabel = activeNav === 'dashboard' ? 'Operations Dashboard' : 'Flight List'

  return (
    <header
      className={`h-14 border-b px-5 flex items-center justify-between gap-4 flex-shrink-0 z-20 transition-colors ${
        isDark ? 'bg-[#1E293B] border-[#334155] text-white' : 'bg-white border-slate-200 text-slate-900 shadow-2xs'
      }`}
    >
      {/* Left: Breadcrumbs & Hub Select */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1.5 text-xs font-medium">
          <span className={`flex items-center gap-1 font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>
            <Building2 className="w-3.5 h-3.5 text-[#C8102E]" />
            Hub Control
          </span>
          <ChevronRight className={`w-3 h-3 ${isDark ? 'text-slate-600' : 'text-slate-400'}`} />
          <select
            value={activeHub}
            onChange={(e) => onHubChange(e.target.value)}
            className={`border rounded-lg text-xs font-bold px-2.5 py-1 outline-none focus:border-[#C8102E] cursor-pointer transition-colors ${
              isDark
                ? 'bg-[#0F172A] border-[#334155] text-white'
                : 'bg-slate-50 border-slate-300 text-slate-900'
            }`}
          >
            <option value="IST">IST - Istanbul Grand Hub</option>
            <option value="SAW">SAW - Sabiha Gökçen Station</option>
            <option value="ESB">ESB - Ankara Esenboğa</option>
            <option value="AYT">AYT - Antalya Operations</option>
          </select>
          <ChevronRight className={`w-3 h-3 ${isDark ? 'text-slate-600' : 'text-slate-400'}`} />
          <span className={`font-bold ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>{navLabel}</span>
        </div>
      </div>

      {/* Center: Global Search Bar */}
      <div className="flex-1 max-w-md relative">
        <div className="relative flex items-center">
          <Search className={`w-3.5 h-3.5 absolute left-3 pointer-events-none ${isDark ? 'text-slate-400' : 'text-slate-400'}`} />
          <input
            type="text"
            value={quickSearch}
            onChange={(e) => onQuickSearchChange(e.target.value)}
            placeholder="Quick search flight #, CallSign, RegNo, DEP, ARR, Gate..."
            className={`w-full pl-8 pr-8 py-1.5 border rounded-xl text-xs font-medium outline-none focus:border-[#C8102E] focus:ring-1 focus:ring-[#C8102E] transition-all ${
              isDark
                ? 'bg-[#0F172A] border-[#334155] text-white placeholder-slate-400'
                : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400 focus:bg-white'
            }`}
          />
          {quickSearch && (
            <button
              onClick={() => onQuickSearchChange('')}
              className="absolute right-2.5 p-0.5 text-slate-400 hover:text-slate-600 dark:hover:text-white rounded-full"
            >
              <X className="w-3 h-3" />
            </button>
          )}
        </div>
      </div>

      {/* Right: Time, Live Status, Theme Switch, Controls */}
      <div className="flex items-center gap-2.5">
        {/* UTC+3 Clock */}
        <div
          className={`hidden lg:flex items-center gap-2 px-3 py-1 border rounded-lg text-xs font-mono font-bold ${
            isDark ? 'bg-[#0F172A] border-[#334155] text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
          }`}
        >
          <Clock className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-[10px] text-slate-400 font-sans font-medium">UTC+3</span>
          <span className="text-emerald-500 font-extrabold">{timeString}</span>
        </div>

        {/* Real-time Telemetry Toggle */}
        <button
          onClick={onToggleLive}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-extrabold tracking-wider border transition-all ${
            liveActive
              ? isDark
                ? 'bg-emerald-950/60 text-emerald-400 border-emerald-800/80'
                : 'bg-emerald-50 text-emerald-700 border-emerald-200'
              : isDark
              ? 'bg-slate-800 text-slate-400 border-slate-700'
              : 'bg-slate-100 text-slate-500 border-slate-200'
          }`}
          title="Toggle live telemetry updates"
        >
          <span className={`w-2 h-2 rounded-full ${liveActive ? 'bg-emerald-500 pulse-dot' : 'bg-slate-400'}`} />
          {liveActive ? 'TELEMETRY LIVE' : 'STREAM PAUSED'}
        </button>

        <div className={`h-4 w-px ${isDark ? 'bg-[#334155]' : 'bg-slate-200'}`} />

        {/* Theme Switcher Button */}
        <button
          onClick={onToggleTheme}
          className={`p-2 rounded-xl border transition-colors ${
            isDark
              ? 'bg-[#0F172A] border-[#334155] text-amber-400 hover:bg-slate-700/60'
              : 'bg-slate-50 border-slate-200 text-indigo-600 hover:bg-slate-100'
          }`}
          title={isDark ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
        >
          {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>

        {/* Slide-over Advanced Filter Trigger */}
        <button
          onClick={onOpenAdvancedFilter}
          className={`p-2 rounded-xl transition-colors relative ${
            isDark
              ? 'text-slate-400 hover:text-white hover:bg-slate-700/60'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
          title="Advanced Search & Slide-over Filter Panel"
        >
          <Filter className="w-4 h-4" />
        </button>

        {/* Notifications */}
        <button
          className={`p-2 rounded-xl transition-colors relative ${
            isDark
              ? 'text-slate-400 hover:text-white hover:bg-slate-700/60'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
          title="Operational Alerts & Notifications"
        >
          <Bell className="w-4 h-4" />
          <span className={`absolute top-1.5 right-1.5 w-2 h-2 bg-[#C8102E] rounded-full ring-2 ${isDark ? 'ring-[#1E293B]' : 'ring-white'}`} />
        </button>

        {/* Settings Button */}
        <button
          onClick={onOpenSettings}
          className={`p-2 rounded-xl transition-colors ${
            isDark
              ? 'text-slate-400 hover:text-white hover:bg-slate-700/60'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
          title="ATOM Application Settings"
        >
          <Settings className="w-4 h-4" />
        </button>
      </div>
    </header>
  )
}
