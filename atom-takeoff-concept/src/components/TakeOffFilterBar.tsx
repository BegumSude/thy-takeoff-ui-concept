import React, { useState } from 'react'
import { FilterState, FlightStatus, OperationalFlag, OperationalIcon } from '../types/takeoff'
import {
  Filter,
  RotateCcw,
  Download,
  Settings as SettingsIcon,
  SlidersHorizontal,
  ChevronDown,
  ChevronUp,
  X,
  Sliders,
} from 'lucide-react'

interface TakeOffFilterBarProps {
  filters: FilterState
  onFilterChange: (updated: Partial<FilterState>) => void
  onClearFilters: () => void
  onOpenAdvancedFilter: () => void
  onOpenSettings: () => void
  onOpenExport: () => void
  activeStatusCount: Record<string, number>
  totalCount: number
  theme: 'dark' | 'light'
}

const ALL_STATUSES: (FlightStatus | 'All')[] = [
  'All',
  'Scheduled',
  'Off Block',
  'Departed',
  'Landed',
  'Arrived',
  'Delayed',
  'Next Info',
  'RTR',
  'Diversion',
  'Cancelled',
]

const FLAG_OPTIONS: OperationalFlag[] = [
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

const ICON_OPTIONS: OperationalIcon[] = [
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

export const TakeOffFilterBar: React.FC<TakeOffFilterBarProps> = ({
  filters,
  onFilterChange,
  onClearFilters,
  onOpenAdvancedFilter,
  onOpenSettings,
  onOpenExport,
  activeStatusCount,
  totalCount,
  theme,
}) => {
  const isDark = theme === 'dark'
  const [expanded, setExpanded] = useState(false)

  // Calculate active filter count & active filter chips
  const activeChips: { key: keyof FilterState; label: string; value: string }[] = []

  if (filters.base !== 'IST') activeChips.push({ key: 'base', label: 'Base', value: filters.base })
  if (filters.flight) activeChips.push({ key: 'flight', label: 'Flight', value: filters.flight })
  if (filters.dep) activeChips.push({ key: 'dep', label: 'DEP', value: filters.dep })
  if (filters.arr) activeChips.push({ key: 'arr', label: 'ARR', value: filters.arr })
  if (filters.regNo) activeChips.push({ key: 'regNo', label: 'RegNo', value: filters.regNo })
  if (filters.status !== 'All') activeChips.push({ key: 'status', label: 'Status', value: filters.status })
  if (filters.zone !== 'All') activeChips.push({ key: 'zone', label: 'Zone', value: filters.zone })
  if (filters.callSign) activeChips.push({ key: 'callSign', label: 'CallSign', value: filters.callSign })
  if (filters.flags.length > 0)
    activeChips.push({ key: 'flags', label: 'Flags', value: `${filters.flags.length} selected` })
  if (filters.icons.length > 0)
    activeChips.push({ key: 'icons', label: 'Icons', value: `${filters.icons.length} selected` })
  if (filters.acOwner !== 'All') activeChips.push({ key: 'acOwner', label: 'Owner', value: filters.acOwner })
  if (filters.opCode !== 'All') activeChips.push({ key: 'opCode', label: 'Op.Code', value: filters.opCode })
  if (filters.serviceType !== 'All')
    activeChips.push({ key: 'serviceType', label: 'Service', value: filters.serviceType })
  if (filters.traffic !== 'All') activeChips.push({ key: 'traffic', label: 'Traffic', value: filters.traffic })
  if (filters.operationGenre !== 'All')
    activeChips.push({ key: 'operationGenre', label: 'Genre', value: filters.operationGenre })
  if (filters.country !== 'All') activeChips.push({ key: 'country', label: 'Country', value: filters.country })
  if (filters.fuel !== 'All') activeChips.push({ key: 'fuel', label: 'Fuel', value: filters.fuel })
  if (filters.delayCode !== 'All')
    activeChips.push({ key: 'delayCode', label: 'DelayCode', value: filters.delayCode })
  if (filters.watchListOnly) activeChips.push({ key: 'watchListOnly', label: 'WatchList', value: 'Active' })

  const removeChip = (key: keyof FilterState) => {
    if (key === 'base') onFilterChange({ base: 'IST' })
    else if (key === 'status') onFilterChange({ status: 'All' })
    else if (key === 'zone') onFilterChange({ zone: 'All' })
    else if (key === 'flags') onFilterChange({ flags: [] })
    else if (key === 'icons') onFilterChange({ icons: [] })
    else if (key === 'acOwner') onFilterChange({ acOwner: 'All' })
    else if (key === 'opCode') onFilterChange({ opCode: 'All' })
    else if (key === 'serviceType') onFilterChange({ serviceType: 'All' })
    else if (key === 'traffic') onFilterChange({ traffic: 'All' })
    else if (key === 'operationGenre') onFilterChange({ operationGenre: 'All' })
    else if (key === 'country') onFilterChange({ country: 'All' })
    else if (key === 'fuel') onFilterChange({ fuel: 'All' })
    else if (key === 'delayCode') onFilterChange({ delayCode: 'All' })
    else if (key === 'watchListOnly') onFilterChange({ watchListOnly: false })
    else onFilterChange({ [key]: '' })
  }

  const selectClass = `w-full rounded-xl px-2 py-1 text-xs font-semibold outline-none focus:border-[#C8102E] transition-colors ${
    isDark
      ? 'bg-[#0B0F19] border border-[#1E2D48] text-white'
      : 'bg-white border border-slate-300 text-slate-900'
  }`

  const labelClass = `text-[10px] font-bold uppercase tracking-wider ${
    isDark ? 'text-slate-400' : 'text-slate-500'
  }`

  return (
    <div
      className={`rounded-2xl shadow-2xs mb-4 transition-all duration-200 border ${
        isDark ? 'bg-[#131B2E] border-[#1E2D48]' : 'bg-white border-slate-200 shadow-xs'
      }`}
    >
      {/* Top Main Toolbar Row */}
      <div className="p-3 flex items-center justify-between gap-3 flex-wrap">
        {/* Left: Operational Matrix Info Badge */}
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-[#C8102E]/20 text-[#C8102E]">
            <Sliders className="w-4 h-4" />
          </div>
          <div className="flex items-center gap-2">
            <span className={`text-xs font-extrabold tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
              Flight List
            </span>
            <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border ${
              isDark ? 'bg-[#0B0F19] border-[#1E2D48] text-slate-400' : 'bg-slate-100 border-slate-200 text-slate-600'
            }`}>
              {totalCount} Total Flights
            </span>
          </div>
        </div>

        {/* Right Toolbar Action Buttons */}
        <div className="flex items-center gap-2 flex-shrink-0">
          {/* Expand / Collapse Filters Button */}
          <button
            onClick={() => setExpanded(!expanded)}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-extrabold transition-all border ${
              expanded || activeChips.length > 0
                ? isDark
                  ? 'bg-[#C8102E]/20 text-white border-[#C8102E]/50'
                  : 'bg-red-50 text-[#C8102E] border-red-300'
                : isDark
                ? 'bg-[#0B0F19] text-slate-300 border-[#1E2D48] hover:bg-[#1E253B]'
                : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
            }`}
          >
            <Filter className="w-3.5 h-3.5 text-[#C8102E]" />
            <span>Filters</span>
            {activeChips.length > 0 && (
              <span className="px-1.5 py-0.2 text-[9px] font-mono font-black rounded-full bg-[#C8102E] text-white">
                {activeChips.length}
              </span>
            )}
            {expanded ? <ChevronUp className="w-3.5 h-3.5 ml-0.5" /> : <ChevronDown className="w-3.5 h-3.5 ml-0.5" />}
          </button>

          {/* Clear Filters Button */}
          {activeChips.length > 0 && (
            <button
              onClick={onClearFilters}
              className={`inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-bold border transition-colors ${
                isDark
                  ? 'text-slate-300 bg-[#0B0F19] hover:bg-[#1E253B] border-[#1E2D48]'
                  : 'text-slate-700 bg-slate-50 hover:bg-slate-100 border-slate-200'
              }`}
              title="Clear all active filters"
            >
              <RotateCcw className="w-3 h-3 text-slate-400" />
              <span>Clear</span>
            </button>
          )}

          {/* Export Button */}
          <button
            onClick={onOpenExport}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border transition-colors ${
              isDark
                ? 'text-slate-200 bg-[#0B0F19] border-[#1E2D48] hover:bg-[#1E253B]'
                : 'text-slate-700 bg-white border-slate-200 hover:bg-slate-50'
            }`}
          >
            <Download className="w-3.5 h-3.5 text-slate-400" />
            <span className="hidden sm:inline">Export</span>
          </button>

          {/* Settings Button */}
          <button
            onClick={onOpenSettings}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border transition-colors ${
              isDark
                ? 'text-slate-200 bg-[#0B0F19] border-[#1E2D48] hover:bg-[#1E253B]'
                : 'text-slate-700 bg-white border-slate-200 hover:bg-slate-50'
            }`}
          >
            <SettingsIcon className="w-3.5 h-3.5 text-slate-400" />
            <span className="hidden sm:inline">Settings</span>
          </button>

          {/* Advanced Filter Trigger */}
          <button
            onClick={onOpenAdvancedFilter}
            className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-extrabold border transition-colors ${
              isDark
                ? 'text-white bg-[#C8102E]/20 border-[#C8102E]/60 hover:bg-[#C8102E]/30'
                : 'text-[#C8102E] bg-red-50 border-red-200 hover:bg-red-100'
            }`}
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-[#C8102E]" />
            <span className="hidden md:inline">Advanced Filter</span>
          </button>
        </div>
      </div>

      {/* Applied Active Filter Chips */}
      {activeChips.length > 0 && !expanded && (
        <div
          className={`px-3 pb-2.5 flex items-center gap-1.5 flex-wrap border-t pt-2 fade-in ${
            isDark ? 'border-[#1E2D48]' : 'border-slate-100'
          }`}
        >
          <span className={`text-[10px] font-extrabold uppercase tracking-wider ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            Active:
          </span>
          {activeChips.map((chip) => (
            <span
              key={chip.key}
              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-xs font-semibold border ${
                isDark
                  ? 'bg-[#0B0F19] border-[#1E2D48] text-slate-200'
                  : 'bg-slate-100 border-slate-200 text-slate-800'
              }`}
            >
              <span className={isDark ? 'text-slate-400 font-normal' : 'text-slate-500 font-normal'}>{chip.label}:</span>
              <span className={`font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>{chip.value}</span>
              <button
                onClick={() => removeChip(chip.key)}
                className={`p-0.5 rounded-full ml-0.5 ${
                  isDark ? 'text-slate-400 hover:text-white hover:bg-slate-700' : 'text-slate-400 hover:text-slate-900 hover:bg-slate-200'
                }`}
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
        </div>
      )}

      {/* Accordion Expandable Filter Panel (Contains ALL 21 Filters) */}
      {expanded && (
        <div
          className={`p-3.5 pt-0 space-y-3 border-t fade-in ${
            isDark ? 'border-[#1E2D48]' : 'border-slate-200'
          }`}
        >
          {/* Row 1: Core Flight Identifiers */}
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2.5 pt-3">
            {/* 1. Base */}
            <div className="flex flex-col gap-1">
              <label className={labelClass}>Base</label>
              <select
                value={filters.base}
                onChange={(e) => onFilterChange({ base: e.target.value })}
                className={selectClass}
              >
                <option value="IST">IST (Istanbul)</option>
                <option value="SAW">SAW (Sabiha)</option>
                <option value="ESB">ESB (Ankara)</option>
                <option value="AYT">AYT (Antalya)</option>
                <option value="All">All Bases</option>
              </select>
            </div>

            {/* 2. Date Type */}
            <div className="flex flex-col gap-1">
              <label className={labelClass}>Date Type</label>
              <select
                value={filters.dateType}
                onChange={(e) => onFilterChange({ dateType: e.target.value as any })}
                className={selectClass}
              >
                <option value="STD">STD (Sched. Dep)</option>
                <option value="ETD">ETD (Est. Dep)</option>
                <option value="ATD">ATD (Act. Dep)</option>
                <option value="STA">STA (Sched. Arr)</option>
                <option value="ALL">All Times</option>
              </select>
            </div>

            {/* 3. Begin Date */}
            <div className="flex flex-col gap-1">
              <label className={labelClass}>Begin</label>
              <input
                type="date"
                value={filters.begin}
                onChange={(e) => onFilterChange({ begin: e.target.value })}
                className={selectClass}
              />
            </div>

            {/* 4. End Date */}
            <div className="flex flex-col gap-1">
              <label className={labelClass}>End</label>
              <input
                type="date"
                value={filters.end}
                onChange={(e) => onFilterChange({ end: e.target.value })}
                className={selectClass}
              />
            </div>

            {/* 5. Flight */}
            <div className="flex flex-col gap-1">
              <label className={labelClass}>Flight #</label>
              <input
                type="text"
                placeholder="e.g. TK 1983"
                value={filters.flight}
                onChange={(e) => onFilterChange({ flight: e.target.value })}
                className={selectClass}
              />
            </div>

            {/* 6. DEP */}
            <div className="flex flex-col gap-1">
              <label className={labelClass}>DEP</label>
              <input
                type="text"
                placeholder="e.g. IST"
                value={filters.dep}
                onChange={(e) => onFilterChange({ dep: e.target.value })}
                className={`${selectClass} font-mono uppercase`}
              />
            </div>

            {/* 7. ARR */}
            <div className="flex flex-col gap-1">
              <label className={labelClass}>ARR</label>
              <input
                type="text"
                placeholder="e.g. LHR"
                value={filters.arr}
                onChange={(e) => onFilterChange({ arr: e.target.value })}
                className={`${selectClass} font-mono uppercase`}
              />
            </div>

            {/* 8. RegNo */}
            <div className="flex flex-col gap-1">
              <label className={labelClass}>RegNo</label>
              <input
                type="text"
                placeholder="TC-LJA"
                value={filters.regNo}
                onChange={(e) => onFilterChange({ regNo: e.target.value })}
                className={`${selectClass} font-mono uppercase`}
              />
            </div>
          </div>

          {/* Row 2: Secondary Filters */}
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2.5">
            {/* 9. Status */}
            <div className="flex flex-col gap-1">
              <label className={labelClass}>Status</label>
              <select
                value={filters.status}
                onChange={(e) => onFilterChange({ status: e.target.value as any })}
                className={selectClass}
              >
                {ALL_STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>

            {/* 10. Zone */}
            <div className="flex flex-col gap-1">
              <label className={labelClass}>Zone</label>
              <select
                value={filters.zone}
                onChange={(e) => onFilterChange({ zone: e.target.value })}
                className={selectClass}
              >
                <option value="All">All Zones</option>
                <option value="Z1">Z1 (Gates A/B)</option>
                <option value="Z2">Z2 (Gates C/D)</option>
                <option value="Z3">Z3 (Gates E/F)</option>
                <option value="Z4">Z4 (Remote Apron)</option>
              </select>
            </div>

            {/* 11. CallSign */}
            <div className="flex flex-col gap-1">
              <label className={labelClass}>CallSign</label>
              <input
                type="text"
                placeholder="THY1983"
                value={filters.callSign}
                onChange={(e) => onFilterChange({ callSign: e.target.value })}
                className={`${selectClass} font-mono uppercase`}
              />
            </div>

            {/* 12. Flags */}
            <div className="flex flex-col gap-1">
              <label className={labelClass}>Flags</label>
              <select
                value={filters.flags.length > 0 ? filters.flags[0] : 'All'}
                onChange={(e) =>
                  onFilterChange({
                    flags: e.target.value === 'All' ? [] : [e.target.value as OperationalFlag],
                  })
                }
                className={selectClass}
              >
                <option value="All">All Flags ({filters.flags.length})</option>
                {FLAG_OPTIONS.map((f) => (
                  <option key={f} value={f}>
                    {f}
                  </option>
                ))}
              </select>
            </div>

            {/* 13. Icons */}
            <div className="flex flex-col gap-1">
              <label className={labelClass}>Icons</label>
              <select
                value={filters.icons.length > 0 ? filters.icons[0] : 'All'}
                onChange={(e) =>
                  onFilterChange({
                    icons: e.target.value === 'All' ? [] : [e.target.value as OperationalIcon],
                  })
                }
                className={selectClass}
              >
                <option value="All">All Icons ({filters.icons.length})</option>
                {ICON_OPTIONS.map((i) => (
                  <option key={i} value={i}>
                    {i}
                  </option>
                ))}
              </select>
            </div>

            {/* 14. Ac Owner */}
            <div className="flex flex-col gap-1">
              <label className={labelClass}>Ac Owner</label>
              <select
                value={filters.acOwner}
                onChange={(e) => onFilterChange({ acOwner: e.target.value })}
                className={selectClass}
              >
                <option value="All">All Owners</option>
                <option value="THY">Turkish Airlines (THY)</option>
                <option value="AnadoluJet">AJet / AnadoluJet</option>
                <option value="SunExpress">SunExpress</option>
              </select>
            </div>

            {/* 15. Op.Code */}
            <div className="flex flex-col gap-1">
              <label className={labelClass}>Op.Code</label>
              <select
                value={filters.opCode}
                onChange={(e) => onFilterChange({ opCode: e.target.value })}
                className={`${selectClass} font-mono`}
              >
                <option value="All">All Codes</option>
                <option value="TK">TK (Turkish Airlines)</option>
                <option value="VF">VF (AJet)</option>
                <option value="XQ">XQ (SunExpress)</option>
              </select>
            </div>

            {/* 16. Service Type */}
            <div className="flex flex-col gap-1">
              <label className={labelClass}>Service Type</label>
              <select
                value={filters.serviceType}
                onChange={(e) => onFilterChange({ serviceType: e.target.value })}
                className={selectClass}
              >
                <option value="All">All Services</option>
                <option value="J">J - Passenger Scheduled</option>
                <option value="F">F - Freight / Cargo</option>
                <option value="C">C - Charter Service</option>
                <option value="P">P - Positioning / Ferry</option>
              </select>
            </div>
          </div>

          {/* Row 3: Operational & Commercial Attributes */}
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-2.5">
            {/* 17. Traffic */}
            <div className="flex flex-col gap-1">
              <label className={labelClass}>Traffic</label>
              <select
                value={filters.traffic}
                onChange={(e) => onFilterChange({ traffic: e.target.value })}
                className={selectClass}
              >
                <option value="All">All Traffic</option>
                <option value="International">International</option>
                <option value="Domestic">Domestic</option>
                <option value="Transatlantic">Transatlantic</option>
                <option value="Regional">Regional</option>
              </select>
            </div>

            {/* 18. Operation Genre */}
            <div className="flex flex-col gap-1">
              <label className={labelClass}>Operation Genre</label>
              <select
                value={filters.operationGenre}
                onChange={(e) => onFilterChange({ operationGenre: e.target.value })}
                className={selectClass}
              >
                <option value="All">All Genres</option>
                <option value="Passenger Scheduled">Passenger Scheduled</option>
                <option value="Cargo Scheduled">Cargo Scheduled</option>
                <option value="Charter">Charter</option>
                <option value="Ferry">Ferry / Positioning</option>
              </select>
            </div>

            {/* 19. Country */}
            <div className="flex flex-col gap-1">
              <label className={labelClass}>Country</label>
              <select
                value={filters.country}
                onChange={(e) => onFilterChange({ country: e.target.value })}
                className={selectClass}
              >
                <option value="All">All Countries</option>
                <option value="Turkey">Turkey</option>
                <option value="United Kingdom">United Kingdom</option>
                <option value="United States">United States</option>
                <option value="Germany">Germany</option>
                <option value="France">France</option>
                <option value="United Arab Emirates">United Arab Emirates</option>
                <option value="Netherlands">Netherlands</option>
                <option value="Ireland">Ireland</option>
              </select>
            </div>

            {/* 20. Fuel */}
            <div className="flex flex-col gap-1">
              <label className={labelClass}>Fuel</label>
              <select
                value={filters.fuel}
                onChange={(e) => onFilterChange({ fuel: e.target.value })}
                className={selectClass}
              >
                <option value="All">All Fuel States</option>
                <option value="Sufficient">Sufficient</option>
                <option value="Extra Fuel Uplifted">Extra Fuel Uplifted</option>
                <option value="Fuelling Active">Fuelling Active</option>
                <option value="Low Margin">Low Margin</option>
              </select>
            </div>

            {/* 21. Delay Code */}
            <div className="flex flex-col gap-1">
              <label className={labelClass}>Delay Code</label>
              <select
                value={filters.delayCode}
                onChange={(e) => onFilterChange({ delayCode: e.target.value })}
                className={selectClass}
              >
                <option value="All">All Delay Codes</option>
                <option value="None">None (On Time)</option>
                <option value="15 (Catering)">15 - Catering</option>
                <option value="41 (Technical)">41 - Technical / Maintenance</option>
                <option value="71 (ATC Weather)">71 - ATC Weather Slot</option>
                <option value="89 (Strike)">89 - Ground Handling Strike</option>
              </select>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
