import React, { useState } from 'react'
import { Flight } from '../types/atom'
import { X, Download, FileSpreadsheet, FileText, CheckCircle } from 'lucide-react'

interface ExportModalProps {
  open: boolean
  onClose: () => void
  flights: Flight[]
  theme?: 'dark' | 'light'
}

export const ExportModal: React.FC<ExportModalProps> = ({ open, onClose, flights, theme = 'dark' }) => {
  const [format, setFormat] = useState<'csv' | 'json' | 'pdf'>('csv')
  const [exported, setExported] = useState(false)
  const isDark = theme === 'dark'

  if (!open) return null

  const handleExport = () => {
    setExported(true)

    if (format === 'csv') {
      const headers = ['FlightNumber', 'CallSign', 'DEP', 'ARR', 'STD', 'ETD', 'ATD', 'Status', 'Gate', 'Stand', 'RegNo', 'Aircraft']
      const rows = flights.map((f) => [
        f.flightNumber,
        f.callSign,
        f.dep,
        f.arr,
        f.std,
        f.etd,
        f.atd || '',
        f.status,
        f.gate,
        f.stand,
        f.regNo,
        f.aircraftType,
      ])
      const csvContent = [headers.join(','), ...rows.map((e) => e.join(','))].join('\n')
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', `ATOM_Flight_Report_${Date.now()}.csv`)
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    } else if (format === 'json') {
      const jsonContent = JSON.stringify(flights, null, 2)
      const blob = new Blob([jsonContent], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', `ATOM_Flight_Export_${Date.now()}.json`)
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }

    setTimeout(() => {
      setExported(false)
      onClose()
    }, 1200)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 select-none">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className={`absolute inset-0 transition-opacity fade-in ${
          isDark ? 'bg-slate-950/60 backdrop-blur-xs' : 'bg-slate-900/40 backdrop-blur-xs'
        }`}
      />

      {/* Dialog Window */}
      <div
        className={`relative w-full max-w-md rounded-2xl shadow-2xl border overflow-hidden fade-in transition-colors ${
          isDark ? 'bg-[#1E293B] border-[#334155] text-white' : 'bg-white border-slate-200 text-slate-900'
        }`}
      >
        {/* Header */}
        <div
          className={`p-4 border-b flex items-center justify-between ${
            isDark ? 'bg-[#0F172A] border-[#334155]' : 'bg-slate-50 border-slate-200'
          }`}
        >
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-[#C8102E]/20 text-[#C8102E]">
              <Download className="w-4 h-4" />
            </div>
            <div>
              <h2 className={`text-sm font-extrabold ${isDark ? 'text-white' : 'text-slate-900'}`}>Export Flight Telemetry</h2>
              <p className={`text-[11px] font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                {flights.length} filtered flight records
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

        {/* Content Body */}
        <div className="p-5 space-y-4">
          <div className="space-y-2">
            <label className={`text-xs font-extrabold uppercase tracking-wider block ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
              Select Export Format
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'csv', label: 'CSV File', icon: FileSpreadsheet },
                { id: 'json', label: 'JSON Data', icon: FileText },
                { id: 'pdf', label: 'PDF Report', icon: Download },
              ].map((item) => {
                const Icon = item.icon
                const active = format === item.id
                return (
                  <button
                    key={item.id}
                    onClick={() => setFormat(item.id as any)}
                    className={`p-3 rounded-xl border text-center flex flex-col items-center gap-1.5 transition-all ${
                      active
                        ? 'bg-[#C8102E]/20 border-[#C8102E] text-[#C8102E] font-bold shadow-xs'
                        : isDark
                        ? 'bg-[#0F172A] border-[#334155] text-slate-400 hover:bg-slate-700/50'
                        : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="text-xs">{item.label}</span>
                  </button>
                )
              })}
            </div>
          </div>

          {exported && (
            <div className="p-3 rounded-xl bg-emerald-950/80 border border-emerald-800/60 text-emerald-400 text-xs font-bold flex items-center justify-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-400" />
              <span>Report exported successfully!</span>
            </div>
          )}
        </div>

        {/* Footer */}
        <div
          className={`p-4 border-t flex items-center justify-between ${
            isDark ? 'bg-[#0F172A] border-[#334155]' : 'bg-slate-50 border-slate-200'
          }`}
        >
          <button
            onClick={onClose}
            className={`px-4 py-2 rounded-xl text-xs font-bold border transition-colors ${
              isDark
                ? 'text-slate-400 border-slate-700 hover:bg-slate-800'
                : 'text-slate-700 border-slate-300 hover:bg-slate-100'
            }`}
          >
            Cancel
          </button>
          <button
            onClick={handleExport}
            className="px-5 py-2 rounded-xl text-xs font-extrabold text-white bg-[#C8102E] hover:bg-red-700 shadow-xs flex items-center gap-1.5 transition-colors"
          >
            <Download className="w-4 h-4" /> Export Report
          </button>
        </div>
      </div>
    </div>
  )
}
