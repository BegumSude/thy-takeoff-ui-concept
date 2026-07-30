import React from 'react'
import { Flight } from '../types/takeoff'
import { TakeOffMetricsBar } from './TakeOffMetricsBar'
import {
  Plane,
  Building2,
  Activity,
  ShieldAlert,
} from 'lucide-react'

interface TakeOffDashboardViewProps {
  flights: Flight[]
  theme: 'dark' | 'light'
  onNavigateToFlights: () => void
}

export const TakeOffDashboardView: React.FC<TakeOffDashboardViewProps> = ({
  flights,
  theme,
  onNavigateToFlights,
}) => {
  const isDark = theme === 'dark'
  const total = flights.length
  const delayed = flights.filter((f) => f.status === 'Delayed').length
  const offBlock = flights.filter((f) => f.status === 'Off Block').length
  const arrived = flights.filter((f) => f.status === 'Arrived' || f.status === 'Landed').length
  const cancelled = flights.filter((f) => f.status === 'Cancelled').length
  const onTime = flights.filter((f) => f.delayMinutes === 0 && f.status !== 'Cancelled').length
  const otpPct = total > 0 ? Math.round((onTime / total) * 100) : 100

  const istCount = flights.filter((f) => f.base === 'IST').length
  const sawCount = flights.filter((f) => f.base === 'SAW').length
  const esbCount = flights.filter((f) => f.base === 'ESB').length
  const aytCount = flights.filter((f) => f.base === 'AYT').length

  const allAlerts = flights.flatMap((f) =>
    f.alerts.map((a) => ({ ...a, flightNumber: f.flightNumber }))
  )

  const containerClass = `p-5 rounded-2xl border transition-colors ${
    isDark ? 'bg-[#131B2E] border-[#1E2D48]' : 'bg-white border-slate-200 shadow-xs'
  }`

  const cardClass = `p-4 rounded-xl border ${
    isDark ? 'bg-[#0B0F19] border-[#1E2D48]' : 'bg-slate-50 border-slate-200'
  }`

  return (
    <div className="space-y-5 fade-in select-none">
      {/* Header Banner */}
      <div
        className={`p-6 rounded-2xl border flex items-center justify-between gap-4 ${
          isDark
            ? 'bg-gradient-to-r from-[#131B2E] via-[#0B0F19] to-[#131B2E] border-[#1E2D48]'
            : 'bg-gradient-to-r from-red-50 via-slate-50 to-white border-slate-200 shadow-2xs'
        }`}
      >
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-[#C8102E] text-white">
              TURKISH TECHNOLOGY · TAKEOFF UI
            </span>
            <span className={`text-xs font-mono font-bold ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`}>
              ● OCC CONTROL CENTER
            </span>
          </div>
          <h1 className={`text-2xl font-black tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
            Operations Control Center (OCC) Dashboard
          </h1>
          <p className={`text-xs font-medium mt-1 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
            TakeOff UI Semantic Design System · Real-time fleet telemetry, hub throughput, and OTP metrics.
          </p>
        </div>

        <button
          onClick={onNavigateToFlights}
          className="px-4 py-2.5 rounded-xl font-bold text-xs bg-[#C8102E] text-white hover:bg-red-700 transition-colors shadow-md flex items-center gap-2 flex-shrink-0"
        >
          <Plane className="w-4 h-4" />
          <span>View Live Matrix Grid ({total})</span>
        </button>
      </div>

      {/* TakeOff Metrics Summary */}
      <TakeOffMetricsBar flights={flights} theme={theme} />

      {/* Main Dashboard Layout: 2 Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Left 2-Cols: Analytics & Station Movement */}
        <div className="lg:col-span-2 space-y-5">
          {/* Station Throughput Grid */}
          <div className={containerClass}>
            <div className="flex items-center justify-between border-b pb-3 mb-4 border-[#1E2D48]">
              <div className="flex items-center gap-2">
                <Building2 className="w-4 h-4 text-[#C8102E]" />
                <h3 className={`text-sm font-extrabold tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  Active Station & Hub Throughput
                </h3>
              </div>
              <span className={`text-xs font-mono ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                {total} Flights Scheduled
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className={cardClass}>
                <div className="flex justify-between items-center text-xs font-bold mb-1">
                  <span className={isDark ? 'text-slate-400' : 'text-slate-500'}>IST Hub</span>
                  <span className="text-[#C8102E] font-mono">{istCount}</span>
                </div>
                <div className="text-xl font-black font-mono text-white">{istCount}</div>
                <div className="text-[10px] text-slate-400 mt-1">Istanbul Grand Hub</div>
              </div>

              <div className={cardClass}>
                <div className="flex justify-between items-center text-xs font-bold mb-1">
                  <span className={isDark ? 'text-slate-400' : 'text-slate-500'}>SAW Base</span>
                  <span className="text-blue-400 font-mono">{sawCount}</span>
                </div>
                <div className="text-xl font-black font-mono text-white">{sawCount}</div>
                <div className="text-[10px] text-slate-400 mt-1">Sabiha Gökçen</div>
              </div>

              <div className={cardClass}>
                <div className="flex justify-between items-center text-xs font-bold mb-1">
                  <span className={isDark ? 'text-slate-400' : 'text-slate-500'}>ESB Station</span>
                  <span className="text-purple-400 font-mono">{esbCount}</span>
                </div>
                <div className="text-xl font-black font-mono text-white">{esbCount}</div>
                <div className="text-[10px] text-slate-400 mt-1">Ankara Esenboğa</div>
              </div>

              <div className={cardClass}>
                <div className="flex justify-between items-center text-xs font-bold mb-1">
                  <span className={isDark ? 'text-slate-400' : 'text-slate-500'}>AYT Station</span>
                  <span className="text-emerald-400 font-mono">{aytCount}</span>
                </div>
                <div className="text-xl font-black font-mono text-white">{aytCount}</div>
                <div className="text-[10px] text-slate-400 mt-1">Antalya Operations</div>
              </div>
            </div>
          </div>

          {/* Operational Status Breakdown */}
          <div className={containerClass}>
            <div className="flex items-center justify-between border-b pb-3 mb-4 border-[#1E2D48]">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-emerald-400" />
                <h3 className={`text-sm font-extrabold tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  Operational Status Distribution
                </h3>
              </div>
              <span className="text-xs font-mono font-bold text-emerald-400">
                OTP Rate: {otpPct}%
              </span>
            </div>

            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-xs font-bold mb-1">
                  <span className={isDark ? 'text-slate-300' : 'text-slate-700'}>On-Time & Arrived ({arrived})</span>
                  <span className="text-emerald-400 font-mono">{Math.round((arrived / (total || 1)) * 100)}%</span>
                </div>
                <div className="w-full h-2 rounded-full overflow-hidden bg-slate-800">
                  <div
                    className="h-full bg-emerald-400 rounded-full transition-all"
                    style={{ width: `${Math.round((arrived / (total || 1)) * 100)}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-bold mb-1">
                  <span className={isDark ? 'text-slate-300' : 'text-slate-700'}>Active Delays ({delayed})</span>
                  <span className="text-amber-400 font-mono">{Math.round((delayed / (total || 1)) * 100)}%</span>
                </div>
                <div className="w-full h-2 rounded-full overflow-hidden bg-slate-800">
                  <div
                    className="h-full bg-amber-400 rounded-full transition-all"
                    style={{ width: `${Math.round((delayed / (total || 1)) * 100)}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-bold mb-1">
                  <span className={isDark ? 'text-slate-300' : 'text-slate-700'}>Off Block / Ramp Active ({offBlock})</span>
                  <span className="text-blue-400 font-mono">{Math.round((offBlock / (total || 1)) * 100)}%</span>
                </div>
                <div className="w-full h-2 rounded-full overflow-hidden bg-slate-800">
                  <div
                    className="h-full bg-blue-400 rounded-full transition-all"
                    style={{ width: `${Math.round((offBlock / (total || 1)) * 100)}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right 1-Col: Live Telemetry Alert Stream */}
        <div className={containerClass}>
          <div className="flex items-center justify-between border-b pb-3 mb-4 border-[#1E2D48]">
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-[#C8102E]" />
              <h3 className={`text-sm font-extrabold tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
                TakeOff OCC Telemetry Stream
              </h3>
            </div>
            <span className="px-2 py-0.5 rounded text-[9px] font-extrabold bg-red-950/80 text-red-400 border border-red-800/60">
              {allAlerts.length} ALERTS
            </span>
          </div>

          <div className="space-y-3 max-h-[380px] overflow-y-auto takeoff-scrollbar pr-1">
            {allAlerts.map((alert, idx) => (
              <div
                key={idx}
                className={`p-3 rounded-xl border text-xs font-medium space-y-1 ${
                  alert.level === 'critical'
                    ? 'bg-red-950/50 border-red-800/70 text-red-300'
                    : alert.level === 'warning'
                    ? 'bg-amber-950/50 border-amber-800/70 text-amber-300'
                    : 'bg-blue-950/50 border-blue-800/70 text-blue-300'
                }`}
              >
                <div className="flex justify-between items-center font-bold">
                  <span className="font-mono text-white">{alert.flightNumber}</span>
                  <span className="text-[10px] opacity-75 font-mono">{alert.timestamp}</span>
                </div>
                <p className="leading-snug">{alert.msg}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
