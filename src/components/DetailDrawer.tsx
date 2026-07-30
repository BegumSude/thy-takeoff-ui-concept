import React from 'react'
import { Flight } from '../types/atom'
import { STATUS_CONFIG, SERVICE_TYPES, FLAG_META, ICON_META } from '../mock/atomData'
import { AtomOperationalRiskWidget } from './AtomOperationalRiskWidget'
import { AtomShiftNotes } from './AtomShiftNotes'
import {
  X,
  Plane,
  Clock,
  User,
  Users,
  ShieldAlert,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  Info,
  MapPin,
  Compass,
  CloudSun,
  Fuel,
  Building2,
  FileText,
  UserCheck,
  Shield,
  Gauge,
  Activity,
  Layers,
  Sparkles,
  Star,
  Check,
} from 'lucide-react'

interface DetailDrawerProps {
  flight: Flight | null
  onClose: () => void
  theme: 'dark' | 'light'
}

export const DetailDrawer: React.FC<DetailDrawerProps> = ({ flight, onClose, theme }) => {
  if (!flight) return null

  const isDark = theme === 'dark'
  const cfg = STATUS_CONFIG[flight.status] || STATUS_CONFIG['Scheduled']
  const paxLf = Math.round((flight.pax.booked / (flight.pax.capacity || 1)) * 100)
  const svcInfo = SERVICE_TYPES.find((s) => s.code === flight.serviceType)
  const hasDelay = flight.delayMinutes > 0

  const fieldBoxClass = `p-2.5 rounded-xl border flex flex-col justify-between ${
    isDark ? 'bg-[#1E293B] border-[#334155]' : 'bg-white border-slate-200'
  }`

  const labelClass = `text-[10px] font-bold uppercase tracking-wider ${
    isDark ? 'text-slate-400' : 'text-slate-500'
  }`

  return (
    /* 
      Clean Slide-out Drawer with ZERO backdrop blur, overlay, or opacity reduction.
      The Flight List behind it on the left remains 100% visible, sharp, and fully interactive!
    */
    <div className="fixed inset-y-0 right-0 z-50 max-w-full flex pl-6 pointer-events-none select-none">
      <div
        className={`w-screen max-w-[50vw] flex flex-col border-l pointer-events-auto transition-all duration-300 ease-in-out fade-in shadow-[-16px_0_36px_rgba(0,0,0,0.65)] ${
          isDark
            ? 'bg-[#1E293B] border-[#334155] text-slate-100'
            : 'bg-white border-slate-200 text-slate-900'
        }`}
      >
        {/* Header Bar */}
        <div
          className={`p-4 border-b flex items-center justify-between gap-3 ${
            isDark ? 'bg-[#0F172A] border-[#334155]' : 'bg-slate-50 border-slate-200'
          }`}
        >
          <div className="flex items-center gap-2.5 overflow-hidden">
            {/* Red Left Accent */}
            <div className="w-1.5 h-8 rounded-full bg-[#C8102E] flex-shrink-0" />
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="font-mono text-base font-extrabold tracking-tight text-white">
                  {flight.flightNumber}
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#C8102E]/20 text-[#C8102E] border border-[#C8102E]/40">
                  {flight.callSign}
                </span>
                {flight.watchList && (
                  <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-400 border border-amber-500/40 flex items-center gap-1">
                    <Star className="w-3 h-3 fill-amber-400 text-amber-400" /> Watchlist
                  </span>
                )}
              </div>
              <span className="text-[11px] font-semibold text-slate-400 truncate mt-0.5">
                {flight.dep} ({flight.depCity}) → {flight.arr} ({flight.arrCity}) · {flight.aircraftType} ({flight.regNo})
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            <span
              className="px-3 py-1 rounded-full text-xs font-extrabold tracking-wide uppercase border"
              style={{
                color: cfg.fg,
                backgroundColor: cfg.bg,
                borderColor: cfg.border,
              }}
            >
              {cfg.label}
            </span>
            <button
              onClick={onClose}
              className={`p-1.5 rounded-xl transition-colors ${
                isDark
                  ? 'text-slate-400 hover:text-white hover:bg-slate-800'
                  : 'text-slate-500 hover:text-slate-900 hover:bg-slate-200'
              }`}
              title="Close Drawer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Content Container (100% Sharp & Unblurred) */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-5 space-y-4">
          {/* 1. Prominent Operational Warning Banner & Risk Widget */}
          <AtomOperationalRiskWidget
            theme={theme}
            riskScore={flight.delayMinutes > 30 ? 82 : 45}
            delayMinutes={flight.delayMinutes || 17}
            confidencePct={91}
          />

          {/* 2. Aircraft Hero Photo & Tail Attributes */}
          <div className="relative rounded-2xl overflow-hidden border border-[#334155]/80 bg-slate-950 shadow-md group">
            <img
              src="/thy_b777_aircraft.png"
              alt={flight.aircraftType}
              className="w-full h-48 object-cover object-center opacity-90 transition-transform duration-500 group-hover:scale-105"
              onError={(e) => {
                ;(e.target as HTMLElement).style.display = 'none'
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent pointer-events-none" />
            <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs font-mono">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-black/70 backdrop-blur-md text-white font-black border border-white/20">
                  {flight.regNo}
                </span>
                <span className="text-slate-300 font-bold text-[11px]">
                  {flight.aircraftType} ({flight.aircraftAge || '3.5 Yrs'})
                </span>
              </div>
              <div className="text-[11px] text-slate-300 font-mono">
                Fleet Owner: <span className="text-white font-bold">{flight.acOwner}</span>
              </div>
            </div>
          </div>

          {/* 3. Logical Column Order Layout: Section 1 - Route & Flight Timings */}
          <div
            className={`p-4 rounded-2xl border space-y-3 ${
              isDark ? 'bg-[#0F172A] border-[#334155]' : 'bg-slate-50 border-slate-200'
            }`}
          >
            <div className="flex items-center gap-2 border-b border-[#334155]/60 pb-2">
              <div className="w-1 h-4 bg-[#C8102E] rounded-full" />
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-300">
                📍 Route, Trajectory & Schedule Matrix
              </h3>
            </div>

            {/* Airport Codes & Trajectory */}
            <div className="grid grid-cols-2 gap-3 relative">
              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-[#C8102E] text-white flex items-center justify-center shadow-lg border-2 border-white/20 z-10">
                <Plane className="w-4 h-4" />
              </div>

              <div className={fieldBoxClass}>
                <div>
                  <span className={labelClass}>Origin (DEP)</span>
                  <div className="text-3xl font-black font-mono tracking-tight text-white mt-0.5">
                    {flight.dep}
                  </div>
                  <div className="text-xs font-bold text-slate-300 truncate">{flight.depCity}</div>
                  <div className="text-[10px] text-slate-400 font-mono mt-0.5">{flight.originTz}</div>
                </div>
              </div>

              <div className={fieldBoxClass}>
                <div>
                  <span className={labelClass}>Destination (ARR)</span>
                  <div className="text-3xl font-black font-mono tracking-tight text-white mt-0.5">
                    {flight.arr}
                  </div>
                  <div className="text-xs font-bold text-slate-300 truncate">{flight.arrCity}</div>
                  <div className="text-[10px] text-slate-400 font-mono mt-0.5">{flight.destTz}</div>
                </div>
              </div>
            </div>

            {/* Complete Schedule Grid (STD, ETD, ATD, STA, ETA, ATA, TSAT, TOBT, CTOT) */}
            <div className="grid grid-cols-3 sm:grid-cols-3 gap-2 font-mono text-xs pt-1">
              <div className={fieldBoxClass}>
                <span className={labelClass}>STD (Sched Dep)</span>
                <span className="font-extrabold text-sm text-white mt-0.5">{flight.std}</span>
              </div>
              <div className={fieldBoxClass}>
                <span className={labelClass}>ETD (Est Dep)</span>
                <span className={`font-extrabold text-sm mt-0.5 ${hasDelay ? 'text-amber-400' : 'text-white'}`}>{flight.etd}</span>
              </div>
              <div className={fieldBoxClass}>
                <span className={labelClass}>ATD (Act Dep)</span>
                <span className="font-extrabold text-sm text-emerald-400 mt-0.5">{flight.atd || '—'}</span>
              </div>

              <div className={fieldBoxClass}>
                <span className={labelClass}>STA (Sched Arr)</span>
                <span className="font-extrabold text-sm text-white mt-0.5">{flight.sta}</span>
              </div>
              <div className={fieldBoxClass}>
                <span className={labelClass}>ETA (Est Arr)</span>
                <span className="font-extrabold text-sm text-amber-400 mt-0.5">{flight.eta}</span>
              </div>
              <div className={fieldBoxClass}>
                <span className={labelClass}>ATA (Act Arr)</span>
                <span className="font-extrabold text-sm text-emerald-400 mt-0.5">{flight.ata || '—'}</span>
              </div>

              <div className={fieldBoxClass}>
                <span className={labelClass}>TSAT (Target Start)</span>
                <span className="font-bold text-slate-300 mt-0.5">{flight.tsat || '10:12'}</span>
              </div>
              <div className={fieldBoxClass}>
                <span className={labelClass}>TOBT (Target Off-Blk)</span>
                <span className="font-bold text-slate-300 mt-0.5">{flight.tobt || '10:10'}</span>
              </div>
              <div className={fieldBoxClass}>
                <span className={labelClass}>CTOT (ATC Slot)</span>
                <span className="font-bold text-red-400 mt-0.5">{flight.ctot || '10:25'}</span>
              </div>
            </div>
          </div>

          {/* Section 2: Gate, Stand, Zone & Delay Reason */}
          <div
            className={`p-4 rounded-2xl border space-y-3 ${
              isDark ? 'bg-[#0F172A] border-[#334155]' : 'bg-slate-50 border-slate-200'
            }`}
          >
            <div className="flex items-center gap-2 border-b border-[#334155]/60 pb-2">
              <div className="w-1 h-4 bg-amber-500 rounded-full" />
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-300">
                🏢 Location, Gate, Stand & Delay Metrics
              </h3>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
              <div className={fieldBoxClass}>
                <span className={labelClass}>Gate</span>
                <span className="font-mono font-black text-sm text-white mt-0.5">{flight.gate}</span>
              </div>
              <div className={fieldBoxClass}>
                <span className={labelClass}>Stand</span>
                <span className="font-mono font-black text-sm text-slate-200 mt-0.5">{flight.stand}</span>
              </div>
              <div className={fieldBoxClass}>
                <span className={labelClass}>Terminal</span>
                <span className="font-mono font-extrabold text-white mt-0.5">{flight.terminal}</span>
              </div>
              <div className={fieldBoxClass}>
                <span className={labelClass}>Zone</span>
                <span className="font-mono font-extrabold text-slate-300 mt-0.5">{flight.zone}</span>
              </div>

              <div className={fieldBoxClass}>
                <span className={labelClass}>Status</span>
                <span className="font-extrabold text-xs text-[#C8102E] uppercase mt-1">{flight.status}</span>
              </div>
              <div className={fieldBoxClass}>
                <span className={labelClass}>Delay</span>
                <span className={`font-mono font-black text-sm mt-0.5 ${hasDelay ? 'text-red-400' : 'text-emerald-400'}`}>
                  {hasDelay ? `+${flight.delayMinutes} min` : '0 min (On-Time)'}
                </span>
              </div>
              <div className={`${fieldBoxClass} col-span-2`}>
                <span className={labelClass}>Delay Code & Reason</span>
                <span className="font-mono font-bold text-xs text-amber-300 mt-0.5">{flight.delayCode}</span>
              </div>
            </div>
          </div>

          {/* Section 3: Commercial & Service Attributes */}
          <div
            className={`p-4 rounded-2xl border space-y-3 ${
              isDark ? 'bg-[#0F172A] border-[#334155]' : 'bg-slate-50 border-slate-200'
            }`}
          >
            <div className="flex items-center gap-2 border-b border-[#334155]/60 pb-2">
              <div className="w-1 h-4 bg-emerald-500 rounded-full" />
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-300">
                🌐 Commercial, Service & Fuel Attributes
              </h3>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
              <div className={fieldBoxClass}>
                <span className={labelClass}>Service Type</span>
                <span className="font-mono font-extrabold text-white mt-0.5">{flight.serviceType} ({svcInfo?.label || 'Scheduled'})</span>
              </div>
              <div className={fieldBoxClass}>
                <span className={labelClass}>Op.Code</span>
                <span className="font-mono font-extrabold text-white mt-0.5">{flight.opCode}</span>
              </div>
              <div className={fieldBoxClass}>
                <span className={labelClass}>Traffic Type</span>
                <span className="font-bold text-slate-200 mt-0.5">{flight.traffic}</span>
              </div>

              <div className={fieldBoxClass}>
                <span className={labelClass}>Genre</span>
                <span className="font-bold text-slate-200 mt-0.5">{flight.operationGenre}</span>
              </div>
              <div className={fieldBoxClass}>
                <span className={labelClass}>Country</span>
                <span className="font-bold text-white mt-0.5">{flight.country}</span>
              </div>
              <div className={fieldBoxClass}>
                <span className={labelClass}>Fuel Uplift</span>
                <span className="font-mono font-bold text-emerald-400 mt-0.5">{flight.fuel}</span>
              </div>
            </div>
          </div>

          {/* Section 4: Passenger Load & Crew Roster */}
          <div
            className={`p-4 rounded-2xl border space-y-3 ${
              isDark ? 'bg-[#0F172A] border-[#334155]' : 'bg-slate-50 border-slate-200'
            }`}
          >
            <div className="flex items-center gap-2 border-b border-[#334155]/60 pb-2">
              <div className="w-1 h-4 bg-emerald-400 rounded-full" />
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-300">
                👥 Passenger Load Factor & Crew Roster
              </h3>
            </div>

            <div className="space-y-3">
              <div className={fieldBoxClass}>
                <div className="flex justify-between items-center text-xs font-bold mb-1">
                  <span>Passenger Load Ratio</span>
                  <span className="text-emerald-400 font-mono font-black">{paxLf}% ({flight.pax.booked} / {flight.pax.capacity} Seats)</span>
                </div>
                <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                  <div className="bg-emerald-400 h-full" style={{ width: `${paxLf}%` }} />
                </div>
              </div>

              <div className="grid grid-cols-4 gap-2 text-center font-mono text-xs">
                <div className={fieldBoxClass}>
                  <span className={labelClass}>Booked</span>
                  <span className="font-extrabold text-white mt-0.5">{flight.pax.booked}</span>
                </div>
                <div className={fieldBoxClass}>
                  <span className={labelClass}>Checked-in</span>
                  <span className="font-extrabold text-white mt-0.5">{flight.pax.checkedIn}</span>
                </div>
                <div className={fieldBoxClass}>
                  <span className={labelClass}>Boarded</span>
                  <span className="font-extrabold text-[#C8102E] mt-0.5">{flight.pax.boarded}</span>
                </div>
                <div className={fieldBoxClass}>
                  <span className={labelClass}>Transit PAX</span>
                  <span className="font-extrabold text-slate-300 mt-0.5">{flight.pax.transit}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className={fieldBoxClass}>
                  <span className={labelClass}>Captain & FO</span>
                  <span className="font-bold text-white mt-0.5">{flight.crew.captain} · {flight.crew.fo}</span>
                </div>
                <div className={fieldBoxClass}>
                  <span className={labelClass}>Cabin Crew / Duty</span>
                  <span className="font-bold text-slate-200 mt-0.5">{flight.crew.cabinCrewCount} Crew Members ({flight.crew.dutyStatus})</span>
                </div>
              </div>
            </div>
          </div>

          {/* Section 5: Warning Flags & Monochrome Icons */}
          <div
            className={`p-4 rounded-2xl border space-y-3 ${
              isDark ? 'bg-[#0F172A] border-[#334155]' : 'bg-slate-50 border-slate-200'
            }`}
          >
            <div className="flex items-center gap-2 border-b border-[#334155]/60 pb-2">
              <div className="w-1 h-4 bg-red-500 rounded-full" />
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-300">
                🚩 Operational Warning Flags & Service Icons
              </h3>
            </div>

            <div className="space-y-2 text-xs">
              <div>
                <span className={labelClass}>Warning Flags</span>
                <div className="flex flex-wrap gap-1.5 mt-1">
                  {flight.flags.map((f) => (
                    <span
                      key={f}
                      className="px-2.5 py-1 rounded-xl text-xs font-bold bg-[#C8102E]/20 text-[#C8102E] border border-[#C8102E]/40"
                    >
                      🚩 {f}
                    </span>
                  ))}
                  {flight.flags.length === 0 && <span className="text-slate-500 text-xs italic">No active flags</span>}
                </div>
              </div>

              <div>
                <span className={labelClass}>Service Icons</span>
                <div className="flex flex-wrap gap-1.5 mt-1">
                  {flight.icons.map((i) => (
                    <span
                      key={i}
                      className="px-2.5 py-1 rounded-xl text-xs font-bold bg-slate-800 text-slate-200 border border-slate-700 flex items-center gap-1"
                    >
                      <Check className="w-3 h-3 text-emerald-400" /> {i}
                    </span>
                  ))}
                  {flight.icons.length === 0 && <span className="text-slate-500 text-xs italic">No service icons</span>}
                </div>
              </div>
            </div>
          </div>

          {/* 4. ATOM SHIFT NOTES & HANDOVER LOG MODULE */}
          <AtomShiftNotes theme={theme} selectedFlightNumber={flight.flightNumber} />
        </div>
      </div>
    </div>
  )
}
