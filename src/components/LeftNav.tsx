import React from 'react'
import {
  LayoutDashboard,
  Plane,
  Send,
  Layers,
  Users,
  BarChart3,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Radio,
  Sun,
  Moon,
  FileText,
} from 'lucide-react'

interface LeftNavProps {
  collapsed: boolean
  onToggleCollapse: () => void
  activeNav: string
  onSelectNav: (id: string) => void
  onOpenSettings: () => void
  theme: 'dark' | 'light'
  onToggleTheme: () => void
}

const NAV_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, section: 'Operations' },
  { id: 'flights', label: 'Flight List', icon: Plane, section: 'Operations', badge: 'LIVE' },
  { id: 'shift-notes', label: 'Shift Handover Notes', icon: FileText, section: 'Operations', badge: 'LOG' },
  { id: 'dispatch', label: 'Dispatch Control', icon: Send, section: 'Operations' },
  { id: 'fleet', label: 'Fleet Status', icon: Layers, section: 'Management' },
  { id: 'crew', label: 'Crew Rosters', icon: Users, section: 'Management' },
  { id: 'analytics', label: 'Analytics', icon: BarChart3, section: 'Management' },
]

export const LeftNav: React.FC<LeftNavProps> = ({
  collapsed,
  onToggleCollapse,
  activeNav,
  onSelectNav,
  onOpenSettings,
  theme,
  onToggleTheme,
}) => {
  const isDark = theme === 'dark'

  return (
    <aside
      className={`relative flex flex-col transition-all duration-200 ease-in-out z-30 select-none ${
        collapsed ? 'w-16' : 'w-64'
      } ${
        isDark
          ? 'bg-[#1E293B] border-r border-[#334155] text-slate-100'
          : 'bg-white border-r border-slate-200 text-slate-900 shadow-xs'
      }`}
    >
      {/* Brand Header with Prominent THYlogo.png */}
      <div
        className={`h-20 px-3.5 flex items-center justify-between border-b flex-shrink-0 ${
          isDark ? 'border-[#334155]' : 'border-slate-200'
        }`}
      >
        <div className="flex items-center gap-3 overflow-hidden">
          {/* Main Visual Brand Logo: THYlogo.png */}
          <div className="w-18 h-18 rounded-xl flex items-center justify-center flex-shrink-0 bg-[#C8102E]/10 p-1 border border-[#C8102E]/20 shadow-xs">
            <img
              src="/THYlogo.png"
              alt="Turkish Airlines"
              className="w-35 h-35 object-contain"
            />
          </div>

          {!collapsed && (
            <div className="flex flex-col justify-center leading-none overflow-hidden py-0.5">
              {/* App Name: Large, Bold, Red Font */}
              <span className="text-xl font-black text-[#C8102E] tracking-tight font-sans">
                ATOM
              </span>
              {/* Subtitle: Airline Tactical Operations Manager */}
              <span
                className={`text-[10px] font-medium tracking-tight leading-tight mt-1 truncate ${
                  isDark ? 'text-slate-400' : 'text-slate-500'
                }`}
              >
                Airline Tactical Operations Manager
              </span>
            </div>
          )}
        </div>

        <button
          onClick={onToggleCollapse}
          className={`p-1 rounded-lg transition-colors ${
            isDark
              ? 'text-slate-400 hover:text-white hover:bg-slate-700/60'
              : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'
          }`}
          title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* Nav Menu */}
      <div className="flex-1 overflow-y-auto py-3 custom-scrollbar">
        {(['Operations', 'Management'] as const).map((section) => {
          const items = NAV_ITEMS.filter((item) => item.section === section)
          return (
            <div key={section} className="mb-4">
              {!collapsed && (
                <div
                  className={`px-4 mb-1.5 text-[10px] font-bold tracking-widest uppercase ${
                    isDark ? 'text-slate-400' : 'text-slate-500'
                  }`}
                >
                  {section}
                </div>
              )}
              <div className="space-y-0.5 px-2">
                {items.map((item) => {
                  const Icon = item.icon
                  const isActive = activeNav === item.id
                  return (
                    <button
                      key={item.id}
                      onClick={() => onSelectNav(item.id)}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${
                        isActive
                          ? isDark
                            ? 'bg-[#C8102E]/20 text-white border border-[#C8102E]/50 shadow-xs'
                            : 'bg-red-50 text-[#C8102E] border border-red-200 shadow-xs'
                          : isDark
                          ? 'text-slate-300 hover:bg-slate-700/50 hover:text-white'
                          : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                      }`}
                      title={collapsed ? item.label : undefined}
                    >
                      <Icon
                        className={`w-4 h-4 flex-shrink-0 ${
                          isActive
                            ? 'text-[#C8102E]'
                            : isDark
                            ? 'text-slate-400'
                            : 'text-slate-500'
                        }`}
                      />
                      {!collapsed && <span className="truncate flex-1 text-left">{item.label}</span>}
                      {!collapsed && item.badge && (
                        <span
                          className={`px-1.5 py-0.5 text-[9px] font-extrabold rounded-full ${
                            item.badge === 'LOG'
                              ? 'bg-amber-950/80 text-amber-400 border border-amber-800/60'
                              : isDark
                              ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-800/60'
                              : 'bg-emerald-100 text-emerald-700 border border-emerald-200'
                          }`}
                        >
                          {item.badge}
                        </span>
                      )}
                    </button>
                  )
                })}
              </div>
            </div>
          )
        })}

        {/* System Settings & Theme Switch Link */}
        <div className={`px-2 pt-2 border-t ${isDark ? 'border-[#334155]' : 'border-slate-200'}`}>
          {!collapsed && (
            <div
              className={`px-2 mb-1.5 text-[10px] font-bold tracking-widest uppercase ${
                isDark ? 'text-slate-400' : 'text-slate-500'
              }`}
            >
              System & Appearance
            </div>
          )}

          {/* Theme Mode Switcher */}
          <button
            onClick={onToggleTheme}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold mb-1 transition-all ${
              isDark
                ? 'text-slate-300 hover:bg-slate-700/50 hover:text-white'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
            title={collapsed ? (isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode') : undefined}
          >
            {isDark ? (
              <Sun className="w-4 h-4 text-amber-400 flex-shrink-0" />
            ) : (
              <Moon className="w-4 h-4 text-indigo-600 flex-shrink-0" />
            )}
            {!collapsed && (
              <div className="flex items-center justify-between flex-1">
                <span>{isDark ? 'Light Theme' : 'Dark Theme'}</span>
                <span
                  className={`text-[9px] font-mono font-bold px-1.5 py-0.2 rounded ${
                    isDark ? 'bg-slate-800 text-amber-400' : 'bg-slate-200 text-indigo-700'
                  }`}
                >
                  {isDark ? 'DARK' : 'LIGHT'}
                </span>
              </div>
            )}
          </button>

          <button
            onClick={onOpenSettings}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
              isDark
                ? 'text-slate-300 hover:bg-slate-700/50 hover:text-white'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
            title={collapsed ? 'ATOM Settings' : undefined}
          >
            <Settings className={`w-4 h-4 flex-shrink-0 ${isDark ? 'text-slate-400' : 'text-slate-500'}`} />
            {!collapsed && <span>ATOM Settings</span>}
          </button>
        </div>
      </div>

      {/* User Profile Footer */}
      <div
        className={`p-3 border-t flex items-center gap-2.5 ${
          isDark
            ? 'border-[#334155] bg-slate-900/40'
            : 'border-slate-200 bg-slate-50'
        }`}
      >
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#C8102E] to-red-950 text-white font-bold text-xs flex items-center justify-center flex-shrink-0 shadow-sm border border-red-800/50">
          BSB
        </div>
        {!collapsed && (
          <div className="flex-1 overflow-hidden leading-tight">
            <div className={`text-xs font-bold truncate ${isDark ? 'text-white' : 'text-slate-900'}`}>
              Begüm Sude Bölükbaş
            </div>
            <div className={`text-[10px] font-medium truncate flex items-center gap-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              <Radio className="w-2.5 h-2.5 text-emerald-400 animate-pulse" /> OCC Controller
            </div>
          </div>
        )}
        {!collapsed && (
          <button
            className={`p-1 rounded transition-colors ${
              isDark ? 'text-slate-400 hover:text-white hover:bg-slate-700/50' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-200'
            }`}
            title="Sign Out"
          >
            <LogOut className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </aside>
  )
}
