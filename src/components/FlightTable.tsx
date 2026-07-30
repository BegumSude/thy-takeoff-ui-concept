import React, { memo } from 'react'
import {
  Flight,
  FlightStatus,
  OperationalFlag,
  OperationalIcon,
  SortField,
  ColumnDefinition,
} from '../types/atom'
import { STATUS_CONFIG, FLAG_META, ICON_META, SERVICE_TYPES } from '../mock/atomData'
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
} from 'lucide-react'

interface FlightTableProps {
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
  totalFlights: number
  onPageChange: (newPage: number) => void
  onToggleWatchlist: (flightId: string, e: React.MouseEvent) => void
  theme: 'dark' | 'light'
}

// Icon mapper helper for Flags
const renderFlagIcon = (flag: OperationalFlag) => {
  switch (flag) {
    case 'VIP': return <Crown className="w-3 h-3 text-amber-500" />
    case 'Extra Fuel': return <Fuel className="w-3 h-3 text-sky-500" />
    case 'Crew Duty': return <Clock className="w-3 h-3 text-red-500" />
    case 'Board Announcement': return <Megaphone className="w-3 h-3 text-emerald-500" />
    case 'No Security Check': return <ShieldOff className="w-3 h-3 text-red-500" />
    case 'Take Off': return <PlaneTakeoff className="w-3 h-3 text-purple-500" />
    case 'Touch Down': return <PlaneLanding className="w-3 h-3 text-emerald-500" />
    case 'Reg Changed': return <RefreshCw className="w-3 h-3 text-orange-500" />
    case 'Dep Gate Changed': return <DoorOpen className="w-3 h-3 text-amber-500" />
    case 'Dep Delay': return <AlertTriangle className="w-3 h-3 text-red-500" />
    case 'Lost Approach': return <Wind className="w-3 h-3 text-purple-500" />
    case 'Manual Boarding Announcement': return <Mic className="w-3 h-3 text-slate-400" />
    case 'Technical Holding': return <Wrench className="w-3 h-3 text-red-500" />
    default: return <AlertCircle className="w-3 h-3 text-slate-400" />
  }
}

// Monochrome Icon Mapper with severity indicator dot
const renderOperationalIcon = (iconName: OperationalIcon, isDark: boolean) => {
  const meta = ICON_META[iconName]
  const severity = meta ? meta.severity : 'info'

  let severityDot = 'bg-blue-500'
  if (severity === 'warning') severityDot = 'bg-amber-500'
  if (severity === 'critical') severityDot = 'bg-red-500'
  if (severity === 'completed') severityDot = 'bg-emerald-500'

  const iconClass = isDark ? 'w-3.5 h-3.5 text-slate-300' : 'w-3.5 h-3.5 text-slate-600'

  const renderSvg = () => {
    switch (iconName) {
      case 'Aircraft Restrictions': return <Ban className={iconClass} />
      case 'Air Stand Change': return <MapPin className={iconClass} />
      case 'ATC Status': return <Radio className={iconClass} />
      case 'Dep Gate Change': return <LogOut className={iconClass} />
      case 'Dep Stand Change': return <Navigation className={iconClass} />
      case 'Disinfected': return <Sparkles className={iconClass} />
      case 'Electricity Active': return <Zap className={iconClass} />
      case 'Run': return <PlayCircle className={iconClass} />
      case 'Dangerous Goods': return <AlertOctagon className={iconClass} />
      case 'Special Cargo': return <Package className={iconClass} />
      case 'PD': return <FileText className={iconClass} />
      case 'Wheelchair': return <UserCheck className={iconClass} />
      case 'Trim Sheet Read': return <FileCheck className={iconClass} />
      case 'Trim Sheet Unread': return <FileClock className={iconClass} />
      case 'Stand SMS Required': return <MessageSquare className={iconClass} />
      case 'Stretcher': return <Heart className={iconClass} />
      default: return <FileText className={iconClass} />
    }
  }

  return (
    <div
      key={iconName}
      data-tooltip={meta ? `${meta.label}: ${meta.description}` : iconName}
      className={`relative p-1 rounded-lg border flex items-center justify-center transition-colors cursor-help ${
        isDark
          ? 'bg-slate-800/80 hover:bg-slate-700 border-slate-700'
          : 'bg-slate-100 hover:bg-slate-200 border-slate-200'
      }`}
    >
      {renderSvg()}
      <span className={`absolute -top-0.5 -right-0.5 w-1.5 h-1.5 rounded-full ${severityDot}`} />
    </div>
  )
}

// Status Badge Component
const StatusBadge = memo(({ status }: { status: FlightStatus }) => {
  const cfg = STATUS_CONFIG[status] || STATUS_CONFIG['Scheduled']
  const isLive = status === 'Off Block' || status === 'Delayed'

  return (
    <span
      className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-extrabold tracking-wide uppercase border shadow-2xs whitespace-nowrap"
      style={{
        color: cfg.fg,
        backgroundColor: cfg.bg,
        borderColor: cfg.border,
      }}
    >
      <span
        className={`w-1.5 h-1.5 rounded-full ${isLive ? 'pulse-dot' : ''}`}
        style={{ backgroundColor: cfg.dot }}
      />
      <span>{cfg.label}</span>
    </span>
  )
})

export const FlightTable: React.FC<FlightTableProps> = ({
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
      className={`rounded-xl border shadow-xs overflow-hidden flex flex-col flex-1 min-h-[400px] transition-colors ${
        isDark ? 'bg-[#1E293B] border-[#334155]' : 'bg-white border-slate-200 shadow-xs'
      }`}
    >
      {/* Table Container with Horizontal & Vertical Scroll */}
      <div className="flex-1 overflow-auto custom-scrollbar relative">
        <table className="w-full text-left border-collapse min-w-[1200px]">
          <thead>
            <tr
              className={`border-b select-none ${
                isDark
                  ? 'bg-[#1E293B] border-[#334155] text-slate-400'
                  : 'bg-slate-50 border-slate-200 text-slate-600'
              }`}
            >
              {/* Sticky Left Column: Flight # */}
              {isColumnVisible('flightNumber') && (
                <th
                  className={`px-3.5 py-2.5 text-[10px] font-extrabold uppercase tracking-wider sticky-th sticky-col-header shadow-r w-36 ${
                    isDark ? 'text-slate-400' : 'text-slate-600'
                  }`}
                >
                  {renderSortHeader('Flight #', 'flightNumber')}
                </th>
              )}

              {isColumnVisible('callSign') && (
                <th className="px-3 py-2.5 text-[10px] font-extrabold uppercase tracking-wider sticky-th w-24">
                  {renderSortHeader('CallSign', 'callSign')}
                </th>
              )}

              {isColumnVisible('dep') && (
                <th className="px-2 py-2.5 text-[10px] font-extrabold uppercase tracking-wider sticky-th w-16">
                  {renderSortHeader('DEP', 'dep')}
                </th>
              )}

              {isColumnVisible('arr') && (
                <th className="px-2 py-2.5 text-[10px] font-extrabold uppercase tracking-wider sticky-th w-16">
                  {renderSortHeader('ARR', 'arr')}
                </th>
              )}

              {isColumnVisible('std') && (
                <th className="px-2 py-2.5 text-[10px] font-extrabold uppercase tracking-wider sticky-th w-16">
                  {renderSortHeader('STD', 'std')}
                </th>
              )}

              {isColumnVisible('etd') && (
                <th className="px-2 py-2.5 text-[10px] font-extrabold uppercase tracking-wider sticky-th w-16">
                  {renderSortHeader('ETD', 'etd')}
                </th>
              )}

              {isColumnVisible('atd') && (
                <th className="px-2 py-2.5 text-[10px] font-extrabold uppercase tracking-wider sticky-th w-16">
                  ATD
                </th>
              )}

              {isColumnVisible('delay') && (
                <th className="px-3 py-2.5 text-[10px] font-extrabold uppercase tracking-wider sticky-th w-20">
                  {renderSortHeader('Delay', 'delayMinutes')}
                </th>
              )}

              {isColumnVisible('status') && (
                <th className="px-3.5 py-2.5 text-[10px] font-extrabold uppercase tracking-wider sticky-th w-32">
                  {renderSortHeader('Status', 'status')}
                </th>
              )}

              {isColumnVisible('gateStand') && (
                <th className="px-3 py-2.5 text-[10px] font-extrabold uppercase tracking-wider sticky-th w-28">
                  {renderSortHeader('Gate / Stand', 'gate')}
                </th>
              )}

              {isColumnVisible('regNo') && (
                <th className="px-3 py-2.5 text-[10px] font-extrabold uppercase tracking-wider sticky-th w-24">
                  {renderSortHeader('RegNo', 'regNo')}
                </th>
              )}

              {isColumnVisible('aircraftType') && (
                <th className="px-3 py-2.5 text-[10px] font-extrabold uppercase tracking-wider sticky-th w-28">
                  Aircraft
                </th>
              )}

              {isColumnVisible('acOwner') && (
                <th className="px-2.5 py-2.5 text-[10px] font-extrabold uppercase tracking-wider sticky-th w-24">
                  Ac Owner
                </th>
              )}

              {isColumnVisible('serviceType') && (
                <th className="px-2 py-2.5 text-[10px] font-extrabold uppercase tracking-wider sticky-th w-14">
                  Svc
                </th>
              )}

              {isColumnVisible('flags') && (
                <th className="px-3 py-2.5 text-[10px] font-extrabold uppercase tracking-wider sticky-th w-40">
                  Flags
                </th>
              )}

              {isColumnVisible('icons') && (
                <th className="px-3 py-2.5 text-[10px] font-extrabold uppercase tracking-wider sticky-th w-36">
                  Icons
                </th>
              )}

              {isColumnVisible('zone') && (
                <th className="px-2 py-2.5 text-[10px] font-extrabold uppercase tracking-wider sticky-th w-16">
                  {renderSortHeader('Zone', 'zone')}
                </th>
              )}

              {isColumnVisible('opCode') && (
                <th className="px-2 py-2.5 text-[10px] font-extrabold uppercase tracking-wider sticky-th w-16">
                  Op.Code
                </th>
              )}

              {isColumnVisible('traffic') && (
                <th className="px-3 py-2.5 text-[10px] font-extrabold uppercase tracking-wider sticky-th w-28">
                  Traffic
                </th>
              )}

              {isColumnVisible('country') && (
                <th className="px-3 py-2.5 text-[10px] font-extrabold uppercase tracking-wider sticky-th w-28">
                  Country
                </th>
              )}

              {isColumnVisible('fuel') && (
                <th className="px-3 py-2.5 text-[10px] font-extrabold uppercase tracking-wider sticky-th w-32">
                  Fuel
                </th>
              )}

              {isColumnVisible('delayCode') && (
                <th className="px-3 py-2.5 text-[10px] font-extrabold uppercase tracking-wider sticky-th w-28">
                  Delay Code
                </th>
              )}
            </tr>
          </thead>

          <tbody className={`divide-y ${isDark ? 'divide-[#334155]/60' : 'divide-slate-200'}`}>
            {flights.map((flight) => {
              const isSelected = selectedFlightId === flight.id
              const isFlashing = flashingFlightIds.has(flight.id)
              const hasDelay = flight.delayMinutes > 0
              const svcInfo = SERVICE_TYPES.find((s) => s.code === flight.serviceType)

              return (
                <tr
                  key={flight.id}
                  onClick={() => onSelectFlight(flight)}
                  className={`flight-table-row cursor-pointer text-xs ${
                    isSelected ? 'selected-row' : ''
                  } ${isFlashing ? 'flash-row' : ''} ${
                    isDark
                      ? 'hover:bg-[#1E293B]'
                      : 'hover:bg-slate-100'
                  }`}
                >
                  {/* Sticky Column 1: Flight Number + Watchlist Star */}
                  {isColumnVisible('flightNumber') && (
                    <td
                      className={`px-3.5 py-2.5 font-mono font-bold sticky-col border-r ${
                        isDark
                          ? 'border-[#334155]/60 text-white'
                          : 'border-slate-200 text-slate-900 bg-white'
                      } ${isSelected ? 'border-l-4 border-l-[#C8102E]' : ''}`}
                    >
                      <div className="flex items-center gap-2">
                        <button
                          onClick={(e) => onToggleWatchlist(flight.id, e)}
                          className="text-slate-400 hover:text-amber-500 transition-colors"
                          title={flight.watchList ? 'Remove from Watch List' : 'Add to Watch List'}
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
                    <td className={`px-3 py-2.5 font-mono font-semibold ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                      {flight.callSign}
                    </td>
                  )}

                  {/* DEP */}
                  {isColumnVisible('dep') && (
                    <td className={`px-2 py-2.5 font-mono font-extrabold ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
                      {flight.dep}
                    </td>
                  )}

                  {/* ARR */}
                  {isColumnVisible('arr') && (
                    <td className={`px-2 py-2.5 font-mono font-extrabold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                      {flight.arr}
                    </td>
                  )}

                  {/* STD */}
                  {isColumnVisible('std') && (
                    <td className={`px-2 py-2.5 font-mono font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                      {flight.std}
                    </td>
                  )}

                  {/* ETD */}
                  {isColumnVisible('etd') && (
                    <td
                      className={`px-2 py-2.5 font-mono font-bold ${
                        hasDelay
                          ? isDark ? 'text-amber-400' : 'text-amber-600'
                          : isDark ? 'text-slate-200' : 'text-slate-800'
                      }`}
                    >
                      {flight.etd}
                    </td>
                  )}

                  {/* ATD */}
                  {isColumnVisible('atd') && (
                    <td className={`px-2 py-2.5 font-mono font-medium ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                      {flight.atd || '—'}
                    </td>
                  )}

                  {/* Delay Badges */}
                  {isColumnVisible('delay') && (
                    <td className="px-3 py-2.5">
                      {hasDelay ? (
                        <span
                          className={`inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-mono font-extrabold border ${
                            isDark
                              ? 'bg-red-950/80 text-red-400 border-red-800/60'
                              : 'bg-red-100 text-red-800 border-red-200'
                          }`}
                        >
                          +{flight.delayMinutes}m
                        </span>
                      ) : (
                        <span className={`text-[11px] font-semibold ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`}>
                          On Time
                        </span>
                      )}
                    </td>
                  )}

                  {/* Status Badge */}
                  {isColumnVisible('status') && (
                    <td className="px-3.5 py-2.5">
                      <StatusBadge status={flight.status} />
                    </td>
                  )}

                  {/* Gate / Stand */}
                  {isColumnVisible('gateStand') && (
                    <td className="px-3 py-2.5">
                      <div className="flex flex-col leading-tight">
                        <span className={`font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>{flight.gate}</span>
                        <span className={`text-[10px] font-mono ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                          Stand {flight.stand} ({flight.terminal})
                        </span>
                      </div>
                    </td>
                  )}

                  {/* RegNo */}
                  {isColumnVisible('regNo') && (
                    <td className={`px-3 py-2.5 font-mono font-bold ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                      {flight.regNo}
                    </td>
                  )}

                  {/* Aircraft */}
                  {isColumnVisible('aircraftType') && (
                    <td className={`px-3 py-2.5 font-medium ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
                      {flight.aircraftType}
                    </td>
                  )}

                  {/* Ac Owner */}
                  {isColumnVisible('acOwner') && (
                    <td className={`px-2.5 py-2.5 font-medium truncate ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                      {flight.acOwner}
                    </td>
                  )}

                  {/* Service Type Compact Badge */}
                  {isColumnVisible('serviceType') && (
                    <td className="px-2 py-2.5">
                      <span
                        data-tooltip={svcInfo ? svcInfo.label : `Service ${flight.serviceType}`}
                        className={`inline-block px-1.5 py-0.5 rounded font-mono font-extrabold text-[10px] border cursor-help ${
                          isDark
                            ? 'bg-slate-800 text-slate-200 border-slate-700'
                            : 'bg-slate-100 text-slate-700 border-slate-200'
                        }`}
                      >
                        {flight.serviceType}
                      </span>
                    </td>
                  )}

                  {/* Flags Chips with Tooltips & SVG Icons */}
                  {isColumnVisible('flags') && (
                    <td className="px-3 py-2.5">
                      <div className="flex flex-wrap gap-1">
                        {flight.flags.map((flag) => {
                          const meta = FLAG_META[flag]
                          return (
                            <span
                              key={flag}
                              data-tooltip={meta ? meta.description : flag}
                              className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-lg text-[10px] font-bold border whitespace-nowrap cursor-help"
                              style={{
                                color: meta ? meta.color : '#94A3B8',
                                backgroundColor: meta ? meta.bg : 'rgba(51, 65, 85, 0.4)',
                                borderColor: meta ? `${meta.color}40` : '#334155',
                              }}
                            >
                              {renderFlagIcon(flag)}
                              <span>{meta ? meta.label : flag}</span>
                            </span>
                          )
                        })}
                      </div>
                    </td>
                  )}

                  {/* Icons Monochrome Badges with Tooltips */}
                  {isColumnVisible('icons') && (
                    <td className="px-3 py-2.5">
                      <div className="flex items-center gap-1 flex-wrap">
                        {flight.icons.map((iconName) => renderOperationalIcon(iconName, isDark))}
                      </div>
                    </td>
                  )}

                  {/* Zone */}
                  {isColumnVisible('zone') && (
                    <td className={`px-2 py-2.5 font-bold font-mono ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                      {flight.zone}
                    </td>
                  )}

                  {/* Op.Code */}
                  {isColumnVisible('opCode') && (
                    <td className="px-2 py-2.5 font-mono font-extrabold text-[#C8102E]">
                      {flight.opCode}
                    </td>
                  )}

                  {/* Traffic */}
                  {isColumnVisible('traffic') && (
                    <td className={`px-3 py-2.5 font-medium ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                      {flight.traffic}
                    </td>
                  )}

                  {/* Country */}
                  {isColumnVisible('country') && (
                    <td className={`px-3 py-2.5 font-medium truncate ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                      {flight.country}
                    </td>
                  )}

                  {/* Fuel */}
                  {isColumnVisible('fuel') && (
                    <td className="px-3 py-2.5">
                      <span className={`text-[11px] font-semibold ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                        {flight.fuel}
                      </span>
                    </td>
                  )}

                  {/* Delay Code */}
                  {isColumnVisible('delayCode') && (
                    <td className={`px-3 py-2.5 font-mono text-[11px] font-bold ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                      {flight.delayCode}
                    </td>
                  )}
                </tr>
              )
            })}

            {flights.length === 0 && (
              <tr>
                <td colSpan={22} className="py-12 text-center text-slate-500">
                  No flights match your operational filter parameters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div
        className={`p-3 border-t flex items-center justify-between text-xs transition-colors ${
          isDark
            ? 'bg-[#1E293B] border-[#334155] text-slate-400'
            : 'bg-slate-50 border-slate-200 text-slate-600'
        }`}
      >
        <div>
          Showing <span className={`font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>{flights.length}</span> of{' '}
          <span className={`font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>{totalFlights}</span> total active flights
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => onPageChange(Math.max(1, page - 1))}
            disabled={page === 1}
            className={`p-1 rounded-lg border disabled:opacity-40 transition-colors ${
              isDark
                ? 'bg-[#0F172A] border-[#334155] text-slate-300 hover:text-white'
                : 'bg-white border-slate-200 text-slate-700 hover:text-slate-900'
            }`}
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className={`font-bold ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
            Page {page} of {totalPages || 1}
          </span>
          <button
            onClick={() => onPageChange(Math.min(totalPages, page + 1))}
            disabled={page >= totalPages}
            className={`p-1 rounded-lg border disabled:opacity-40 transition-colors ${
              isDark
                ? 'bg-[#0F172A] border-[#334155] text-slate-300 hover:text-white'
                : 'bg-white border-slate-200 text-slate-700 hover:text-slate-900'
            }`}
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  )
}
