import React from 'react'
import { Flight } from '../types/takeoff'
import { TakeOffAiInsightWidget } from './TakeOffAiInsightWidget'
import { TakeOffShiftNotes } from './TakeOffShiftNotes'
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
  Thermometer,
  Wind,
  Globe,
  Tag,
  Star,
  Check,
} from 'lucide-react'

interface TakeOffDetailDrawerProps {
  flight: Flight | null
  onClose: () => void
  theme?: 'dark' | 'light'
}

export const TakeOffDetailDrawer: React.FC<TakeOffDetailDrawerProps> = ({
  flight,
  onClose,
  theme = 'dark',
}) => {
  if (!flight) return null
  const isDark = theme === 'dark'
  const paxLf = Math.round((flight.pax.booked / (flight.pax.capacity || 1)) * 100)
  const hasDelay = flight.delayMinutes > 0

  const sectionCardClass = `p-4 rounded-2xl border space-y-3 transition-colors ${
    isDark ? 'bg-[#0B0F19] border-[#1E2D48]' : 'bg-slate-50 border-slate-200'
  }`

  const fieldBoxClass = `p-2.5 rounded-xl border flex flex-col justify-between ${
    isDark ? 'bg-[#131B2E] border-[#1E2D48]' : 'bg-white border-slate-200'
  }`

  const labelClass = `text-[10px] font-bold uppercase tracking-wider ${
    isDark ? 'text-slate-400' : 'text-slate-500'
  }`

  return (
    /* 
      Clean Slide-out Drawer with ZERO backdrop blur, overlay, or opacity reduction.
      The Flight List behind it on the left remains 100% visible, sharp, and fully interactive!
    */
    <div className="fixed inset-y-0 right-0 z-50 max-w-full flex pl-6 sm:pl-10 pointer-events-none select-none">
      <div
        className={`w-screen max-w-[50vw] flex flex-col border-l pointer-events-auto transition-all duration-300 ease-in-out fade-in shadow-[-16px_0_36px_rgba(0,0,0,0.65)] ${
          isDark
            ? 'bg-[#131B2E] border-[#1E2D48] text-[#F8FAFC]'
            : 'bg-white border-slate-200 text-slate-900'
        }`}
      >
        {/* Header Bar */}
        <div
          className={`p-4 border-b flex items-center justify-between gap-3 ${
            isDark ? 'bg-[#0B0F19] border-[#1E2D48]' : 'bg-slate-50 border-slate-200'
          }`}
        >
          <div className="flex items-center gap-2.5 overflow-hidden">
            <div className="w-1.5 h-7 rounded-full bg-[#C8102E] flex-shrink-0" />
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
            <span className="px-3 py-1 rounded-full text-xs font-extrabold tracking-wide uppercase bg-[#C8102E]/20 text-[#C8102E] border border-[#C8102E]/40">
              {flight.status}
            </span>
            <button
              onClick={onClose}
              className={`p-1.5 rounded-xl transition-colors ${
                isDark ? 'text-slate-400 hover:text-white hover:bg-slate-800' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-200'
              }`}
              title="Close Panel"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Content Container (100% Sharp & Unblurred) */}
        <div className="flex-1 overflow-y-auto takeoff-scrollbar p-5 space-y-4">
          {/* SECTION 1: AI Predictive Analytics Insight Widget */}
          <TakeOffAiInsightWidget theme={theme} />

          {/* SECTION 2: Aircraft Photography Hero & Tail Attributes */}
          <div className="relative rounded-2xl overflow-hidden border border-[#1E2D48] bg-slate-950 shadow-md group">
            <img
              src="/thy_b777_aircraft.png"
              alt={flight.aircraftType}
              className="w-full h-44 object-cover object-center opacity-90 transition-transform duration-500 group-hover:scale-105"
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
                  {flight.aircraftType}
                </span>
              </div>
              <div className="text-[11px] text-slate-300 font-mono">
                Owner: <span className="text-white font-bold">{flight.acOwner}</span> ({flight.aircraftAge})
              </div>
            </div>
          </div>

          {/* SECTION 3: Route, Trajectory Arc & Live Telemetry */}
          <div className={sectionCardClass}>
            <div className="flex items-center gap-2 border-b border-[#1E2D48] pb-2">
              <div className="w-1 h-4 bg-[#C8102E] rounded-full" />
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-300">
                📍 Route, Trajectory Arc & Telemetry
              </h3>
            </div>

            <div className="grid grid-cols-2 gap-3 relative">
              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-[#C8102E] text-white flex items-center justify-center shadow-lg border-2 border-white/20 z-10">
                <Plane className="w-4 h-4" />
              </div>

              {/* Departure Card */}
              <div className={fieldBoxClass}>
                <div>
                  <span className={labelClass}>Origin Airport</span>
                  <div className="text-3xl font-black font-mono tracking-tight text-white mt-0.5">
                    {flight.dep}
                  </div>
                  <div className="text-xs font-bold text-slate-300 truncate">{flight.depCity}</div>
                  <div className="text-[10px] text-slate-400 font-mono mt-0.5">{flight.originTz}</div>
                </div>
              </div>

              {/* Arrival Card */}
              <div className={fieldBoxClass}>
                <div>
                  <span className={labelClass}>Destination Airport</span>
                  <div className="text-3xl font-black font-mono tracking-tight text-white mt-0.5">
                    {flight.arr}
                  </div>
                  <div className="text-xs font-bold text-slate-300 truncate">{flight.arrCity}</div>
                  <div className="text-[10px] text-slate-400 font-mono mt-0.5">{flight.destTz}</div>
                </div>
              </div>
            </div>

            {/* Trajectory Arc & Live Telemetry Metrics */}
            <div className="pt-2">
              <div className="relative py-2 flex items-center justify-between">
                <div className="h-1.5 bg-gradient-to-r from-[#C8102E] via-purple-500 to-emerald-500 rounded-full w-full relative">
                  <div className="absolute left-3/4 -top-2 w-5 h-5 rounded-full bg-[#C8102E] text-white flex items-center justify-center shadow-md">
                    <Plane className="w-3 h-3 rotate-90" />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 font-mono text-xs pt-1">
                <div className={fieldBoxClass}>
                  <span className={labelClass}>Covered</span>
                  <span className="font-bold text-white mt-0.5">{flight.distanceCovered}</span>
                </div>
                <div className={fieldBoxClass}>
                  <span className={labelClass}>Remaining</span>
                  <span className="font-bold text-white mt-0.5">{flight.distanceRemaining}</span>
                </div>
                <div className={fieldBoxClass}>
                  <span className={labelClass}>Speed</span>
                  <span className="font-bold text-emerald-400 mt-0.5">{flight.speed}</span>
                </div>
                <div className={fieldBoxClass}>
                  <span className={labelClass}>Altitude</span>
                  <span className="font-bold text-sky-400 mt-0.5">{flight.altitude}</span>
                </div>
              </div>
            </div>
          </div>

          {/* SECTION 4: Complete Schedule, Timings & Slot Matrix */}
          <div className={sectionCardClass}>
            <div className="flex items-center gap-2 border-b border-[#1E2D48] pb-2">
              <div className="w-1 h-4 bg-amber-500 rounded-full" />
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-300">
                ⏱️ Schedule, Timings & CTOT Slot Matrix
              </h3>
            </div>

            <div className="grid grid-cols-3 sm:grid-cols-3 gap-2 font-mono text-xs">
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
                <span className="font-bold text-slate-300 mt-0.5">{flight.tsat}</span>
              </div>
              <div className={fieldBoxClass}>
                <span className={labelClass}>TOBT (Target Off-Blk)</span>
                <span className="font-bold text-slate-300 mt-0.5">{flight.tobt}</span>
              </div>
              <div className={fieldBoxClass}>
                <span className={labelClass}>CTOT (ATC Slot)</span>
                <span className="font-bold text-red-400 mt-0.5">{flight.ctot}</span>
              </div>
            </div>
          </div>

          {/* SECTION 5: Location, Gate, Stand & Terminal */}
          <div className={sectionCardClass}>
            <div className="flex items-center gap-2 border-b border-[#1E2D48] pb-2">
              <div className="w-1 h-4 bg-sky-500 rounded-full" />
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-300">
                🏢 Location, Gate, Stand & Terminal
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
            </div>
          </div>

          {/* SECTION 6: Delay Details & Reason */}
          <div className={sectionCardClass}>
            <div className="flex items-center gap-2 border-b border-[#1E2D48] pb-2">
              <div className="w-1 h-4 bg-[#C8102E] rounded-full" />
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-300">
                ⚠️ Status & Delay Reason Metrics
              </h3>
            </div>

            <div className="grid grid-cols-3 gap-2 text-xs">
              <div className={fieldBoxClass}>
                <span className={labelClass}>Operational Status</span>
                <span className="font-extrabold text-xs text-[#C8102E] uppercase mt-1">{flight.status}</span>
              </div>
              <div className={fieldBoxClass}>
                <span className={labelClass}>Delay Minutes</span>
                <span className={`font-mono font-black text-sm mt-0.5 ${hasDelay ? 'text-red-400' : 'text-emerald-400'}`}>
                  {hasDelay ? `+${flight.delayMinutes} min` : '0 min (On-Time)'}
                </span>
              </div>
              <div className={`${fieldBoxClass} col-span-1`}>
                <span className={labelClass}>Base Hub</span>
                <span className="font-mono font-black text-sm text-white mt-0.5">{flight.base}</span>
              </div>
              <div className={`${fieldBoxClass} col-span-3`}>
                <span className={labelClass}>Delay Code & Reason</span>
                <span className="font-mono font-bold text-xs text-amber-300 mt-0.5">{flight.delayCode}</span>
              </div>
            </div>
          </div>

          {/* SECTION 7: Turnaround Readiness Milestones */}
          <div className={sectionCardClass}>
            <div className="flex items-center gap-2 border-b border-[#1E2D48] pb-2">
              <div className="w-1 h-4 bg-purple-500 rounded-full" />
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-300">
                🔄 Turnaround Readiness & Ground Milestones
              </h3>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between items-center font-bold">
                <span className="text-slate-300">Turnaround Duration</span>
                <span className="font-mono text-purple-400">{flight.turnaround.turnaroundElapsedMin}m / {flight.turnaround.turnaroundTotalMin}m Total</span>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className={fieldBoxClass}>
                  <div className="flex justify-between text-[11px] font-bold">
                    <span className="text-slate-300">Boarding %</span>
                    <span className="text-[#C8102E] font-mono">{flight.turnaround.boardingProgressPct}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden mt-1">
                    <div className="bg-[#C8102E] h-full" style={{ width: `${flight.turnaround.boardingProgressPct}%` }} />
                  </div>
                </div>

                <div className={fieldBoxClass}>
                  <div className="flex justify-between text-[11px] font-bold">
                    <span className="text-slate-300">Fueling %</span>
                    <span className="text-emerald-400 font-mono">{flight.turnaround.fuelingProgressPct}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden mt-1">
                    <div className="bg-emerald-400 h-full" style={{ width: `${flight.turnaround.fuelingProgressPct}%` }} />
                  </div>
                </div>

                <div className={fieldBoxClass}>
                  <div className="flex justify-between text-[11px] font-bold">
                    <span className="text-slate-300">Catering %</span>
                    <span className="text-sky-400 font-mono">{flight.turnaround.cateringProgressPct}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden mt-1">
                    <div className="bg-sky-400 h-full" style={{ width: `${flight.turnaround.cateringProgressPct}%` }} />
                  </div>
                </div>

                <div className={fieldBoxClass}>
                  <div className="flex justify-between text-[11px] font-bold">
                    <span className="text-slate-300">Baggage Loaded %</span>
                    <span className="text-amber-400 font-mono">{flight.turnaround.baggageLoadedPct}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden mt-1">
                    <div className="bg-amber-400 h-full" style={{ width: `${flight.turnaround.baggageLoadedPct}%` }} />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* SECTION 8: Passenger Load Factor & Payload Roster */}
          <div className={sectionCardClass}>
            <div className="flex items-center gap-2 border-b border-[#1E2D48] pb-2">
              <div className="w-1 h-4 bg-emerald-500 rounded-full" />
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-300">
                👥 Passenger Roster & Payload Breakdown
              </h3>
            </div>

            <div className="space-y-3">
              <div className={fieldBoxClass}>
                <div className="flex justify-between items-center text-xs font-bold mb-1">
                  <span>Passenger Seat Load Factor</span>
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
                  <span className={labelClass}>Transit</span>
                  <span className="font-extrabold text-sky-400 mt-0.5">{flight.pax.transit}</span>
                </div>
              </div>

              <div className="grid grid-cols-4 gap-2 text-center font-mono text-xs">
                <div className={fieldBoxClass}>
                  <span className={labelClass}>Business</span>
                  <span className="font-bold text-amber-300 mt-0.5">{flight.pax.businessClass}</span>
                </div>
                <div className={fieldBoxClass}>
                  <span className={labelClass}>Economy</span>
                  <span className="font-bold text-slate-200 mt-0.5">{flight.pax.economyClass}</span>
                </div>
                <div className={fieldBoxClass}>
                  <span className={labelClass}>Infants</span>
                  <span className="font-bold text-purple-400 mt-0.5">{flight.pax.infants}</span>
                </div>
                <div className={fieldBoxClass}>
                  <span className={labelClass}>WCHR / Special</span>
                  <span className="font-bold text-red-400 mt-0.5">{flight.pax.specialAssistance}</span>
                </div>
              </div>
            </div>
          </div>

          {/* SECTION 9: Commercial, Traffic & Operational Attributes */}
          <div className={sectionCardClass}>
            <div className="flex items-center gap-2 border-b border-[#1E2D48] pb-2">
              <div className="w-1 h-4 bg-sky-500 rounded-full" />
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-300">
                🌐 Commercial & Operational Attributes
              </h3>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
              <div className={fieldBoxClass}>
                <span className={labelClass}>Service Type</span>
                <span className="font-mono font-extrabold text-white mt-0.5">{flight.serviceType} (Passenger)</span>
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
                <span className={labelClass}>Operation Genre</span>
                <span className="font-bold text-slate-200 mt-0.5">{flight.operationGenre}</span>
              </div>
              <div className={fieldBoxClass}>
                <span className={labelClass}>Country</span>
                <span className="font-bold text-white mt-0.5">{flight.country}</span>
              </div>
              <div className={fieldBoxClass}>
                <span className={labelClass}>Fuel Uplifted</span>
                <span className="font-mono font-bold text-emerald-400 mt-0.5">{flight.fuel}</span>
              </div>
            </div>
          </div>

          {/* SECTION 10: Weather Operational Context (METAR) */}
          <div className={sectionCardClass}>
            <div className="flex items-center gap-2 border-b border-[#1E2D48] pb-2">
              <div className="w-1 h-4 bg-sky-400 rounded-full" />
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-300">
                🌦️ Departure & Arrival METAR Weather Context
              </h3>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs font-mono">
              <div className={fieldBoxClass}>
                <span className={labelClass}>DEP METAR ({flight.dep})</span>
                <div className="font-bold text-sky-400 text-sm mt-0.5">{flight.weatherDep.status} · {flight.weatherDep.tempC}°C</div>
                <div className="text-[10px] text-slate-400 mt-0.5">Wind: {flight.weatherDep.windKt}</div>
                <div className="text-[10px] text-slate-400">QNH: {flight.weatherDep.qnh} hPa</div>
              </div>

              <div className={fieldBoxClass}>
                <span className={labelClass}>ARR METAR ({flight.arr})</span>
                <div className="font-bold text-amber-400 text-sm mt-0.5">{flight.weatherArr.status} · {flight.weatherArr.tempC}°C</div>
                <div className="text-[10px] text-slate-400 mt-0.5">Wind: {flight.weatherArr.windKt}</div>
                <div className="text-[10px] text-slate-400">QNH: {flight.weatherArr.qnh} hPa</div>
              </div>
            </div>
          </div>

          {/* SECTION 11: Dispatch, Crew & Ground Roster */}
          <div className={sectionCardClass}>
            <div className="flex items-center gap-2 border-b border-[#1E2D48] pb-2">
              <div className="w-1 h-4 bg-purple-500 rounded-full" />
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-300">
                👨‍✈️ Dispatch, Crew Roster & Ground Agent
              </h3>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className={fieldBoxClass}>
                <span className={labelClass}>Handling Agent</span>
                <span className="font-bold text-white mt-0.5">{flight.handlingAgent}</span>
              </div>
              <div className={fieldBoxClass}>
                <span className={labelClass}>Dispatcher / Hub Desk</span>
                <span className="font-bold text-slate-200 mt-0.5">{flight.dispatcher} ({flight.hubDesk})</span>
              </div>
              <div className={`${fieldBoxClass} col-span-2`}>
                <span className={labelClass}>Flight Crew Roster</span>
                <div className="text-xs text-slate-200 font-semibold mt-0.5">
                  <strong>Capt:</strong> {flight.crew.captain} · <strong>FO:</strong> {flight.crew.fo}
                </div>
                <div className="text-[10px] text-slate-400 mt-0.5">
                  Cabin Crew: {flight.crew.cabinCrewCount} members · {flight.crew.dutyStatus}
                </div>
              </div>

              <div className={fieldBoxClass}>
                <span className={labelClass}>Previous Flight</span>
                <span className="font-mono text-slate-300 mt-0.5">{flight.previousFlight}</span>
              </div>
              <div className={fieldBoxClass}>
                <span className={labelClass}>Next Flight</span>
                <span className="font-mono text-slate-300 mt-0.5">{flight.nextFlight}</span>
              </div>
            </div>
          </div>

          {/* SECTION 12: Warning Flags & Operational Icons */}
          <div className={sectionCardClass}>
            <div className="flex items-center gap-2 border-b border-[#1E2D48] pb-2">
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
                <span className={labelClass}>Ground & Service Icons</span>
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

          {/* SECTION 13: ATOM Shift Notes & Handover Log */}
          <TakeOffShiftNotes theme={theme} selectedFlightNumber={flight.flightNumber} />
        </div>
      </div>
    </div>
  )
}
