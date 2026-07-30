import React from 'react'
import { FilterState, OperationalFlag, OperationalIcon } from '../types/takeoff'
import { X, RotateCcw, Check, SlidersHorizontal } from 'lucide-react'

interface TakeOffAdvancedFilterDrawerProps {
  open: boolean
  onClose: () => void
  filters: FilterState
  onFilterChange: (updated: Partial<FilterState>) => void
  onClearFilters: () => void
  theme?: 'dark' | 'light'
}

const ALL_FLAGS: OperationalFlag[] = [
  'VIP',
  'Extra Fuel',
  'Crew Duty',
  'Board Announcement',
  'No Security Check',
  'Take Off',
  'Touch Down',
  'Reg Changed',
  'Dep Gate Changed',
  'Dep Delay',
  'Lost Approach',
  'Manual Boarding Announcement',
  'Technical Holding',
]

const ALL_ICONS: OperationalIcon[] = [
  'Aircraft Restrictions',
  'Air Stand Change',
  'ATC Status',
  'Dep Gate Change',
  'Dep Stand Change',
  'Disinfected',
  'Electricity Active',
  'Run',
  'Dangerous Goods',
  'Special Cargo',
  'PD',
  'Wheelchair',
  'Trim Sheet Read',
  'Trim Sheet Unread',
  'Stand SMS Required',
  'Stretcher',
]

export const TakeOffAdvancedFilterDrawer: React.FC<TakeOffAdvancedFilterDrawerProps> = ({
  open,
  onClose,
  filters,
  onFilterChange,
  onClearFilters,
  theme = 'dark',
}) => {
  if (!open) return null
  const isDark = theme === 'dark'

  const toggleFlag = (flag: OperationalFlag) => {
    const exists = filters.flags.includes(flag)
    if (exists) {
      onFilterChange({ flags: filters.flags.filter((f) => f !== flag) })
    } else {
      onFilterChange({ flags: [...filters.flags, flag] })
    }
  }

  const toggleIcon = (icon: OperationalIcon) => {
    const exists = filters.icons.includes(icon)
    if (exists) {
      onFilterChange({ icons: filters.icons.filter((i) => i !== icon) })
    } else {
      onFilterChange({ icons: [...filters.icons, icon] })
    }
  }

  return (
    <div className="fixed inset-0 z-50 overflow-hidden select-none">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className={`absolute inset-0 transition-opacity fade-in ${
          isDark ? 'bg-slate-950/70 backdrop-blur-xs' : 'bg-slate-900/40 backdrop-blur-xs'
        }`}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div
          className={`w-screen max-w-md shadow-2xl flex flex-col border-l fade-in transition-colors ${
            isDark ? 'bg-[#131B2E] border-[#1E2D48] text-[#F8FAFC]' : 'bg-white border-slate-200 text-slate-900'
          }`}
        >
          {/* Header */}
          <div
            className={`p-4 border-b flex items-center justify-between ${
              isDark ? 'bg-[#0B0F19] border-[#1E2D48]' : 'bg-slate-50 border-slate-200'
            }`}
          >
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-[#C8102E]/20 text-[#C8102E]">
                <SlidersHorizontal className="w-4 h-4" />
              </div>
              <div>
                <h2 className={`text-sm font-extrabold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  Advanced Filter Query Builder
                </h2>
                <p className={`text-[11px] font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  Multi-attribute operational query builder
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className={`p-1.5 rounded-lg transition-colors ${
                isDark ? 'text-slate-400 hover:text-white hover:bg-slate-800' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-200'
              }`}
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-5 space-y-6 takeoff-scrollbar">
            {/* Quick Watchlist Toggle */}
            <div
              className={`border rounded-xl p-3.5 flex items-center justify-between ${
                isDark ? 'bg-[#0B0F19] border-[#1E2D48]' : 'bg-slate-50 border-slate-200'
              }`}
            >
              <div>
                <div className={`text-xs font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>Watch List Flights Only</div>
                <div className={`text-[11px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Filter flights tagged for dispatcher watch</div>
              </div>
              <input
                type="checkbox"
                checked={filters.watchListOnly}
                onChange={(e) => onFilterChange({ watchListOnly: e.target.checked })}
                className="w-4 h-4 text-[#C8102E] rounded border-slate-300 focus:ring-[#C8102E]"
              />
            </div>

            {/* Operational Flags Selection */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className={`text-xs font-extrabold uppercase tracking-wider ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                  Operational Warning Flags ({filters.flags.length})
                </span>
                {filters.flags.length > 0 && (
                  <button
                    onClick={() => onFilterChange({ flags: [] })}
                    className="text-[10px] font-bold text-[#C8102E] hover:underline"
                  >
                    Clear Flags
                  </button>
                )}
              </div>
              <div className="flex flex-wrap gap-1.5">
                {ALL_FLAGS.map((flag) => {
                  const active = filters.flags.includes(flag)
                  return (
                    <button
                      key={flag}
                      onClick={() => toggleFlag(flag)}
                      className={`px-2.5 py-1 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all border ${
                        active
                          ? 'bg-[#C8102E] text-white border-[#C8102E] shadow-2xs'
                          : isDark
                          ? 'bg-[#0B0F19] text-slate-300 border-[#1E2D48] hover:bg-[#1E253B]'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {active && <Check className="w-3 h-3 text-white" />}
                      <span>{flag}</span>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Operational Icons Selection */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className={`text-xs font-extrabold uppercase tracking-wider ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                  Ground & Service Icons ({filters.icons.length})
                </span>
                {filters.icons.length > 0 && (
                  <button
                    onClick={() => onFilterChange({ icons: [] })}
                    className="text-[10px] font-bold text-[#C8102E] hover:underline"
                  >
                    Clear Icons
                  </button>
                )}
              </div>
              <div className="grid grid-cols-2 gap-1.5">
                {ALL_ICONS.map((icon) => {
                  const active = filters.icons.includes(icon)
                  return (
                    <button
                      key={icon}
                      onClick={() => toggleIcon(icon)}
                      className={`p-2 rounded-xl text-left text-xs font-semibold flex items-center gap-2 border transition-all ${
                        active
                          ? isDark
                            ? 'bg-slate-100 text-slate-950 border-white shadow-2xs font-bold'
                            : 'bg-slate-900 text-white border-slate-900 shadow-2xs font-bold'
                          : isDark
                          ? 'bg-[#0B0F19] text-slate-300 border-[#1E2D48] hover:bg-[#1E253B]'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      <span className={`w-2 h-2 rounded-full ${active ? 'bg-red-600' : 'bg-slate-400'}`} />
                      <span className="truncate">{icon}</span>
                    </button>
                  )
                })}
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div
            className={`p-4 border-t flex items-center justify-between gap-3 ${
              isDark ? 'bg-[#0B0F19] border-[#1E2D48]' : 'bg-slate-50 border-slate-200'
            }`}
          >
            <button
              onClick={onClearFilters}
              className={`px-4 py-2 rounded-xl text-xs font-bold border flex items-center gap-1.5 transition-colors ${
                isDark
                  ? 'text-slate-300 bg-slate-800 border-slate-700 hover:bg-slate-700'
                  : 'text-slate-700 bg-white border-slate-300 hover:bg-slate-100'
              }`}
            >
              <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
              Reset All
            </button>
            <button
              onClick={onClose}
              className="px-5 py-2 rounded-xl text-xs font-extrabold text-white bg-[#C8102E] hover:bg-red-700 shadow-2xs flex items-center gap-1.5 transition-colors"
            >
              Apply Filter Query
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
