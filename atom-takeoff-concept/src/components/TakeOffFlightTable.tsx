import React, { memo } from 'react'
import {
  Flight,
  FlightStatus,
  OperationalFlag,
  OperationalIcon,
  SortField,
  ColumnDefinition,
} from '../types/takeoff'
import {
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  AlertCircle,
  Crown,
  Fuel,
  Clock,
  Megaphone,
  ShieldOff,
  PlaneTakeoff,
  PlaneLanding,
  RefreshCw,
  DoorOpen,
  AlertTriangle,
  Wind,
  Mic,
  Wrench,
  Ban,
  MapPin,
  Radio,
  LogOut,
  Navigation,
  Sparkles,
  Zap,
  PlayCircle,
  AlertOctagon,
  Package,
  FileText,
  UserCheck,
  FileCheck,
  FileClock,
  MessageSquare,
  Heart,
  ChevronLeft,
  ChevronRight,
  Star,
  CloudSun,
  CloudRain,
  Thermometer,
} from 'lucide-react'

interface TakeOffFlightTableProps {
  flights: Flight[]
  selectedFlightId: string | null
  onSelectFlight: (flight: Flight) => void
  flashingFlightIds: Set<string>
  sortField: SortField
  sortDir: 'asc' | 'desc'
  onSort: (field: SortField) => void
  columns: ColumnDefinition[]
  page: number
  pageSize: number
  onPageSizeChange: (newSize: number) => void
  totalFlights: number
  onPageChange: (newPage: number) => void
  onToggleWatchlist: (flightId: string, e: React.MouseEvent) => void
  theme: 'dark' | 'light'
}

// Status Config Mapping
const STATUS_STYLES: Record<string, { bg: string; fg: string; border: string; label: string }> = {
  Scheduled: { bg: 'rgba(59, 130, 246, 0.15)', fg: '#3B82F6', border: 'rgba(59, 130, 246, 0.3)', label: 'Scheduled' },
  'Off Block': { bg: 'rgba(168, 85, 247, 0.15)', fg: '#C084FC', border: 'rgba(168, 85, 247, 0.3)', label: 'Off Block' },
  Departed: { bg: 'rgba(16, 185, 129, 0.15)', fg: '#10B981', border: 'rgba(16, 185, 129, 0.3)', label: 'Departed' },
  Landed: { bg: 'rgba(16, 185, 129, 0.15)', fg: '#10B981', border: 'rgba(16, 185, 129, 0.3)', label: 'Landed' },
  Arrived: { bg: 'rgba(16, 185, 129, 0.15)', fg: '#10B981', border: 'rgba(16, 185, 129, 0.3)', label: 'Arrived' },
  Delayed: { bg: 'rgba(239, 68, 68, 0.18)', fg: '#EF4444', border: 'rgba(239, 68, 68, 0.4)', label: 'Delayed' },
  Cancelled: { bg: 'rgba(100, 116, 139, 0.2)', fg: '#94A3B8', border: 'rgba(100, 116, 139, 0.4)', label: 'Cancelled' },
}

export const TakeOffFlightTable: React.FC<TakeOffFlightTableProps> = ({
  flights,
  selectedFlightId,
  onSelectFlight,
  flashingFlightIds,
  sortField,
  sortDir,
  onSort,
  columns,
  page,
  pageSize,
  onPageSizeChange,
  totalFlights,
  onPageChange,
  onToggleWatchlist,
  theme,
}) => {
  const isDark = theme === 'dark'

  const isColumnVisible = (id: string) => {
    const col = columns.find((c) => c.id === id)
    return col ? col.visible : true
  }

  const renderSortHeader = (label: string, field: SortField) => {
    const isActive = sortField === field
    return (
      <button
        onClick={() => onSort(field)}
        className={`flex items-center gap-1 font-extrabold text-[10px] tracking-wider uppercase transition-colors ${
          isDark ? 'hover:text-white' : 'hover:text-slate-900'
        }`}
      >
        <span>{label}</span>
        {isActive ? (
          sortDir === 'asc' ? (
            <ArrowUp className="w-3 h-3 text-[#C8102E]" />
          ) : (
            <ArrowDown className="w-3 h-3 text-[#C8102E]" />
          )
        ) : (
          <ArrowUpDown className="w-3 h-3 opacity-40" />
        )}
      </button>
    )
  }

  const totalPages = Math.ceil(totalFlights / pageSize)

  return (
    <div
      className={`rounded-2xl border shadow-xs overflow-hidden flex flex-col flex-1 min-h-[440px] transition-colors ${
        isDark ? 'bg-[#131B2E] border-[#1E2D48]' : 'bg-white border-slate-200 shadow-2xs'
      }`}
    >
      {/* Excel-like Table Container with Horizontal & Vertical Scroll */}
      <div className="flex-1 overflow-auto takeoff-scrollbar relative">
        <table className="w-full text-left border-collapse min-w-[1300px]">
          <thead>
            <tr className="select-none text-slate-400">
              {/* Sticky Left Column 1: Flight # */}
              {isColumnVisible('flightNumber') && (
                <th className="px-3 py-2 text-[10px] font-extrabold uppercase tracking-wider takeoff-th takeoff-sticky-header-col w-36">
                  {renderSortHeader('Flight #', 'flightNumber')}
                </th>
              )}

              {isColumnVisible('callSign') && (
                <th className="px-2.5 py-2 text-[10px] font-extrabold uppercase tracking-wider takeoff-th w-24">
                  {renderSortHeader('CallSign', 'callSign')}
                </th>
              )}

              {isColumnVisible('dep') && (
                <th className="px-2 py-2 text-[10px] font-extrabold uppercase tracking-wider takeoff-th w-16">
                  {renderSortHeader('DEP', 'dep')}
                </th>
              )}

              {isColumnVisible('arr') && (
                <th className="px-2 py-2 text-[10px] font-extrabold uppercase tracking-wider takeoff-th w-16">
                  {renderSortHeader('ARR', 'arr')}
                </th>
              )}

              {isColumnVisible('std') && (
                <th className="px-2 py-2 text-[10px] font-extrabold uppercase tracking-wider takeoff-th w-16">
                  {renderSortHeader('STD', 'std')}
                </th>
              )}

              {isColumnVisible('etd') && (
                <th className="px-2 py-2 text-[10px] font-extrabold uppercase tracking-wider takeoff-th w-16">
                  {renderSortHeader('ETD', 'etd')}
                </th>
              )}

              {isColumnVisible('atd') && (
                <th className="px-2 py-2 text-[10px] font-extrabold uppercase tracking-wider takeoff-th w-16">
                  ATD
                </th>
              )}

              {isColumnVisible('delay') && (
                <th className="px-2.5 py-2 text-[10px] font-extrabold uppercase tracking-wider takeoff-th w-20">
                  {renderSortHeader('Delay', 'delayMinutes')}
                </th>
              )}

              {isColumnVisible('status') && (
                <th className="px-3 py-2 text-[10px] font-extrabold uppercase tracking-wider takeoff-th w-32">
                  {renderSortHeader('Status', 'status')}
                </th>
              )}

              {/* Turnaround & Boarding Progress Bar Column */}
              {isColumnVisible('turnaround') && (
                <th className="px-3 py-2 text-[10px] font-extrabold uppercase tracking-wider takeoff-th w-44">
                  Turnaround / Boarding %
                </th>
              )}

              {/* Contextual Weather Column */}
              {isColumnVisible('weather') && (
                <th className="px-3 py-2 text-[10px] font-extrabold uppercase tracking-wider takeoff-th w-40">
                  Weather Context
                </th>
              )}

              {isColumnVisible('gateStand') && (
                <th className="px-2.5 py-2 text-[10px] font-extrabold uppercase tracking-wider takeoff-th w-28">
                  {renderSortHeader('Gate / Stand', 'gate')}
                </th>
              )}

              {isColumnVisible('regNo') && (
                <th className="px-2.5 py-2 text-[10px] font-extrabold uppercase tracking-wider takeoff-th w-24">
                  {renderSortHeader('RegNo', 'regNo')}
                </th>
              )}

              {isColumnVisible('aircraftType') && (
                <th className="px-2.5 py-2 text-[10px] font-extrabold uppercase tracking-wider takeoff-th w-28">
                  Aircraft
                </th>
              )}

              {isColumnVisible('pax') && (
                <th className="px-3 py-2 text-[10px] font-extrabold uppercase tracking-wider takeoff-th w-32">
                  PAX Load %
                </th>
              )}

              {isColumnVisible('flags') && (
                <th className="px-3 py-2 text-[10px] font-extrabold uppercase tracking-wider takeoff-th w-36">
                  Flags
                </th>
              )}

              {isColumnVisible('zone') && (
                <th className="px-2 py-2 text-[10px] font-extrabold uppercase tracking-wider takeoff-th w-16">
                  Zone
                </th>
              )}

              {isColumnVisible('fuel') && (
                <th className="px-2.5 py-2 text-[10px] font-extrabold uppercase tracking-wider takeoff-th w-28">
                  Fuel
                </th>
              )}

              {isColumnVisible('delayCode') && (
                <th className="px-3 py-2 text-[10px] font-extrabold uppercase tracking-wider takeoff-th w-36">
                  Delay Code
                </th>
              )}
            </tr>
          </thead>

          <tbody className="divide-y divide-[#1E2D48]">
            {flights.map((flight) => {
              const isSelected = selectedFlightId === flight.id
              const isFlashing = flashingFlightIds.has(flight.id)
              const hasDelay = flight.delayMinutes > 0
              const st = STATUS_STYLES[flight.status] || STATUS_STYLES['Scheduled']
              const paxLf = Math.round((flight.pax.booked / (flight.pax.capacity || 1)) * 100)

              return (
                <tr
                  key={flight.id}
                  onClick={() => onSelectFlight(flight)}
                  className={`takeoff-row cursor-pointer text-xs ${
                    isSelected ? 'takeoff-row-selected' : ''
                  } ${isFlashing ? 'flash-row' : ''}`}
                >
                  {/* Sticky Column 1: Flight Number + Watchlist Star */}
                  {isColumnVisible('flightNumber') && (
                    <td className="px-3 py-1.5 font-mono font-bold takeoff-sticky-col">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={(e) => onToggleWatchlist(flight.id, e)}
                          className="text-slate-500 hover:text-amber-400 transition-colors"
                          title={flight.watchList ? 'Remove Watchlist' : 'Add Watchlist'}
                        >
                          <Star
                            className={`w-3.5 h-3.5 ${
                              flight.watchList ? 'fill-amber-400 text-amber-400' : ''
                            }`}
                          />
                        </button>
                        <span className={`font-extrabold tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
                          {flight.flightNumber}
                        </span>
                      </div>
                    </td>
                  )}

                  {/* CallSign */}
                  {isColumnVisible('callSign') && (
                    <td className={`px-2.5 py-1.5 font-mono font-semibold ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                      {flight.callSign}
                    </td>
                  )}

                  {/* DEP */}
                  {isColumnVisible('dep') && (
                    <td className={`px-2 py-1.5 font-mono font-extrabold ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
                      {flight.dep}
                    </td>
                  )}

                  {/* ARR */}
                  {isColumnVisible('arr') && (
                    <td className={`px-2 py-1.5 font-mono font-extrabold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                      {flight.arr}
                    </td>
                  )}

                  {/* STD */}
                  {isColumnVisible('std') && (
                    <td className={`px-2 py-1.5 font-mono ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                      {flight.std}
                    </td>
                  )}

                  {/* ETD */}
                  {isColumnVisible('etd') && (
                    <td
                      className={`px-2 py-1.5 font-mono font-bold ${
                        hasDelay ? 'text-amber-400' : isDark ? 'text-[#F8FAFC]' : 'text-slate-800'
                      }`}
                    >
                      {flight.etd}
                    </td>
                  )}

                  {/* ATD */}
                  {isColumnVisible('atd') && (
                    <td className={`px-2 py-1.5 font-mono ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                      {flight.atd || '—'}
                    </td>
                  )}

                  {/* Delay */}
                  {isColumnVisible('delay') && (
                    <td className="px-2.5 py-1.5">
                      {hasDelay ? (
                        <span className="inline-flex items-center px-1.5 py-0.2 rounded text-[10px] font-mono font-extrabold bg-red-950/80 text-red-400 border border-red-800/60">
                          +{flight.delayMinutes}m
                        </span>
                      ) : (
                        <span className="text-[11px] font-semibold text-emerald-400">On Time</span>
                      )}
                    </td>
                  )}

                  {/* Status Badge */}
                  {isColumnVisible('status') && (
                    <td className="px-3 py-1.5">
                      <span
                        className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wide border shadow-2xs"
                        style={{
                          color: st.fg,
                          backgroundColor: st.bg,
                          borderColor: st.border,
                        }}
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-current takeoff-pulse" />
                        <span>{st.label}</span>
                      </span>
                    </td>
                  )}

                  {/* Turnaround & Boarding Progress Bar */}
                  {isColumnVisible('turnaround') && (
                    <td className="px-3 py-1.5">
                      <div className="flex flex-col gap-0.5">
                        <div className="flex justify-between text-[10px] font-mono font-bold">
                          <span className="text-slate-400">Brd {flight.turnaround.boardingProgressPct}%</span>
                          <span className="text-slate-400">Fuel {flight.turnaround.fuelingProgressPct}%</span>
                        </div>
                        <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden flex">
                          <div
                            className="bg-[#C8102E] h-full transition-all"
                            style={{ width: `${flight.turnaround.boardingProgressPct}%` }}
                          />
                        </div>
                      </div>
                    </td>
                  )}

                  {/* Contextual Weather Badge */}
                  {isColumnVisible('weather') && (
                    <td className="px-3 py-1.5 font-mono text-[11px]">
                      <div className="flex items-center gap-1">
                        <span className="px-1.5 py-0.2 rounded text-[9px] font-extrabold bg-slate-800 text-sky-300 border border-slate-700">
                          {flight.weatherArr.status}
                        </span>
                        <span className="text-slate-300 font-semibold">{flight.weatherArr.tempC}°C</span>
                        <span className="text-slate-500 text-[10px]">{flight.weatherArr.windKt}</span>
                      </div>
                    </td>
                  )}

                  {/* Gate / Stand */}
                  {isColumnVisible('gateStand') && (
                    <td className="px-2.5 py-1.5 font-bold font-mono">
                      <span className="text-white">{flight.gate}</span>{' '}
                      <span className="text-slate-500 text-[10px]">({flight.stand})</span>
                    </td>
                  )}

                  {/* RegNo */}
                  {isColumnVisible('regNo') && (
                    <td className="px-2.5 py-1.5 font-mono font-bold text-slate-300">
                      {flight.regNo}
                    </td>
                  )}

                  {/* Aircraft */}
                  {isColumnVisible('aircraftType') && (
                    <td className="px-2.5 py-1.5 font-medium text-slate-200">
                      {flight.aircraftType}
                    </td>
                  )}

                  {/* PAX Load Bar */}
                  {isColumnVisible('pax') && (
                    <td className="px-3 py-1.5 font-mono text-[10px]">
                      <div className="flex justify-between font-bold mb-0.5">
                        <span className="text-slate-300">{paxLf}%</span>
                        <span className="text-slate-500">({flight.pax.booked}/{flight.pax.capacity})</span>
                      </div>
                      <div className="w-full h-1 bg-slate-800 rounded-full overflow-hidden">
                        <div className="bg-emerald-400 h-full" style={{ width: `${paxLf}%` }} />
                      </div>
                    </td>
                  )}

                  {/* Flags */}
                  {isColumnVisible('flags') && (
                    <td className="px-3 py-1.5">
                      <div className="flex items-center gap-1 overflow-hidden">
                        {flight.flags.slice(0, 2).map((f) => (
                          <span
                            key={f}
                            className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-[#C8102E]/20 text-[#C8102E] border border-[#C8102E]/40 truncate"
                          >
                            {f}
                          </span>
                        ))}
                      </div>
                    </td>
                  )}

                  {/* Zone */}
                  {isColumnVisible('zone') && (
                    <td className="px-2 py-1.5 font-mono font-bold text-slate-400">
                      {flight.zone}
                    </td>
                  )}

                  {/* Fuel */}
                  {isColumnVisible('fuel') && (
                    <td className="px-2.5 py-1.5 text-slate-300 font-semibold text-[11px]">
                      {flight.fuel}
                    </td>
                  )}

                  {/* Delay Code */}
                  {isColumnVisible('delayCode') && (
                    <td className="px-3 py-1.5 font-mono text-[11px] text-slate-300 truncate">
                      {flight.delayCode}
                    </td>
                  )}
                </tr>
              )
            })}

            {flights.length === 0 && (
              <tr>
                <td colSpan={22} className="py-12 text-center text-slate-500">
                  No flights match TakeOff matrix query parameters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* TakeOff High Density Pagination & Page Size Control Footer */}
      <div
        className={`p-3 border-t flex items-center justify-between text-xs transition-colors ${
          isDark
            ? 'bg-[#131B2E] border-[#1E2D48] text-slate-400'
            : 'bg-slate-50 border-slate-200 text-slate-600'
        }`}
      >
        <div className="flex items-center gap-4">
          <div>
            Showing <span className="font-bold text-white">{flights.length}</span> of{' '}
            <span className="font-bold text-white">{totalFlights}</span> active OCC flights
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-[11px] text-slate-400 font-semibold">Rows per page:</span>
            {[25, 50, 100, 200].map((sz) => (
              <button
                key={sz}
                onClick={() => onPageSizeChange(sz)}
                className={`px-2 py-0.5 rounded-lg text-xs font-mono font-bold border transition-colors ${
                  pageSize === sz
                    ? 'bg-[#C8102E] text-white border-[#C8102E]'
                    : isDark
                    ? 'bg-[#0B0F19] text-slate-300 border-[#1E2D48] hover:bg-[#1E253B]'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                {sz}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onPageChange(Math.max(1, page - 1))}
            disabled={page === 1}
            className="p-1 rounded-lg border disabled:opacity-40 bg-[#0B0F19] border-[#1E2D48] text-slate-300 hover:text-white"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="font-bold text-slate-200 font-mono">
            Page {page} of {totalPages || 1}
          </span>
          <button
            onClick={() => onPageChange(Math.min(totalPages, page + 1))}
            disabled={page >= totalPages}
            className="p-1 rounded-lg border disabled:opacity-40 bg-[#0B0F19] border-[#1E2D48] text-slate-300 hover:text-white"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  )
}
