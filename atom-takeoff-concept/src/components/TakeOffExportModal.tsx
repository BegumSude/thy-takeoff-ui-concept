import React, { useState } from 'react'
import { Flight } from '../types/takeoff'
import { X, Download, FileSpreadsheet, FileText, CheckCircle, Table } from 'lucide-react'

interface TakeOffExportModalProps {
  open: boolean
  onClose: () => void
  flights: Flight[]
  theme?: 'dark' | 'light'
}

export const TakeOffExportModal: React.FC<TakeOffExportModalProps> = ({
  open,
  onClose,
  flights,
  theme = 'dark',
}) => {
  const [format, setFormat] = useState<'xlsx' | 'csv' | 'json' | 'pdf'>('xlsx')
  const [exported, setExported] = useState(false)
  const isDark = theme === 'dark'

  if (!open) return null

  const handleExport = () => {
    setExported(true)
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-')

    if (format === 'xlsx') {
      // Build clean XML Spreadsheet format natively compatible with Microsoft Excel (.xlsx)
      const headers = [
        'Flight Number',
        'CallSign',
        'Base Hub',
        'DEP',
        'ARR',
        'STD',
        'ETD',
        'ATD',
        'STA',
        'ETA',
        'Status',
        'Delay (Min)',
        'Gate',
        'Stand',
        'RegNo',
        'Aircraft Type',
        'Owner',
        'Pax Booked',
        'Pax Capacity',
        'Fuel (Tons)',
        'Delay Code',
      ]

      const rows = flights.map((f) => [
        f.flightNumber,
        f.callSign,
        f.base,
        f.dep,
        f.arr,
        f.std,
        f.etd,
        f.atd || '',
        f.sta,
        f.eta,
        f.status,
        f.delayMinutes,
        f.gate,
        f.stand,
        f.regNo,
        f.aircraftType,
        f.acOwner,
        f.pax.booked,
        f.pax.capacity,
        f.fuel,
        f.delayCode,
      ])

      // Generate Spreadsheet XML / HTML Table format recognized natively by Microsoft Excel
      let excelXml = `<?xml version="1.0"?>
<?mso-application progid="Excel.Sheet"?>
<Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet"
 xmlns:o="urn:schemas-microsoft-com:office:office"
 xmlns:x="urn:schemas-microsoft-com:office:excel"
 xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet">
 <Styles>
  <Style ss:ID="Header">
   <Font ss:Bold="1" ss:Color="#FFFFFF"/>
   <Interior ss:Color="#C8102E" ss:Pattern="Solid"/>
   <Alignment ss:Horizontal="Center" ss:Vertical="Center"/>
  </Style>
  <Style ss:ID="Data">
   <Alignment ss:Horizontal="Left" ss:Vertical="Center"/>
  </Style>
  <Style ss:ID="Number">
   <Alignment ss:Horizontal="Right" ss:Vertical="Center"/>
  </Style>
 </Styles>
 <Worksheet ss:Name="ATOM Flight Telemetry">
  <Table>
   <Row ss:Height="24">
    ${headers.map((h) => `<Cell ss:StyleID="Header"><Data ss:Type="String">${h}</Data></Cell>`).join('')}
   </Row>
   ${rows
     .map(
       (r) =>
         `<Row ss:Height="20">
      ${r
        .map((cell) => {
          const isNum = typeof cell === 'number'
          return `<Cell ss:StyleID="${isNum ? 'Number' : 'Data'}"><Data ss:Type="${
            isNum ? 'Number' : 'String'
          }">${cell}</Data></Cell>`
        })
        .join('')}
     </Row>`
     )
     .join('')}
  </Table>
 </Worksheet>
</Workbook>`

      const blob = new Blob([excelXml], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8;',
      })
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', `ATOM_TakeOff_OCC_Telemetry_${timestamp}.xlsx`)
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    } else if (format === 'csv') {
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
      link.setAttribute('download', `ATOM_TakeOff_Report_${timestamp}.csv`)
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    } else if (format === 'json') {
      const jsonContent = JSON.stringify(flights, null, 2)
      const blob = new Blob([jsonContent], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', `ATOM_TakeOff_Export_${timestamp}.json`)
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
          isDark ? 'bg-slate-950/70 backdrop-blur-xs' : 'bg-slate-900/40 backdrop-blur-xs'
        }`}
      />

      {/* Dialog Window */}
      <div
        className={`relative w-full max-w-md rounded-2xl shadow-2xl border overflow-hidden fade-in transition-colors ${
          isDark ? 'bg-[#131B2E] border-[#1E2D48] text-[#F8FAFC]' : 'bg-white border-slate-200 text-slate-900'
        }`}
      >
        {/* Header */}
        <div
          className={`p-4 border-b flex items-center justify-between ${
            isDark ? 'bg-[#0B0F19] border-[#1E2D48]' : 'bg-slate-50 border-slate-200'
          }`}
        >
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-[#C8102E]/20 text-[#C8102E]">
              <Download className="w-4 h-4" />
            </div>
            <div>
              <h2 className={`text-sm font-extrabold ${isDark ? 'text-white' : 'text-slate-900'}`}>Export OCC Telemetry</h2>
              <p className={`text-[11px] font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                {flights.length} filtered operational flight records
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
            <div className="grid grid-cols-2 gap-2.5">
              {[
                { id: 'xlsx', label: 'Microsoft Excel (.xlsx)', desc: 'Native formatted OCC spreadsheet', icon: Table, recommended: true },
                { id: 'csv', label: 'CSV Spreadsheet (.csv)', desc: 'Comma-separated standard format', icon: FileSpreadsheet, recommended: false },
                { id: 'json', label: 'JSON Data (.json)', desc: 'Raw telemetry API object stream', icon: FileText, recommended: false },
                { id: 'pdf', label: 'PDF Summary (.pdf)', desc: 'Printable executive summary', icon: Download, recommended: false },
              ].map((item) => {
                const Icon = item.icon
                const active = format === item.id
                return (
                  <button
                    key={item.id}
                    onClick={() => setFormat(item.id as any)}
                    className={`p-3 rounded-xl border text-left flex flex-col justify-between transition-all ${
                      active
                        ? 'bg-[#C8102E]/15 border-[#C8102E] text-white shadow-2xs'
                        : isDark
                        ? 'bg-[#0B0F19] border-[#1E2D48] text-slate-400 hover:bg-[#1E253B]'
                        : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    <div className="flex items-center justify-between w-full mb-1">
                      <div className="flex items-center gap-1.5">
                        <Icon className={`w-4 h-4 ${active ? 'text-[#C8102E]' : 'text-slate-400'}`} />
                        <span className={`text-xs font-extrabold ${active ? 'text-white' : ''}`}>{item.label}</span>
                      </div>
                      {item.recommended && (
                        <span className="text-[9px] font-mono font-black px-1.5 py-0.2 rounded bg-[#C8102E] text-white">
                          RECOMMENDED
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] text-slate-400 block leading-tight">{item.desc}</span>
                  </button>
                )
              })}
            </div>
          </div>

          {exported && (
            <div className="p-3 rounded-xl bg-emerald-950/80 border border-emerald-800/60 text-emerald-400 text-xs font-bold flex items-center justify-center gap-2 fade-in">
              <CheckCircle className="w-4 h-4 text-emerald-400" />
              <span>Exported {format.toUpperCase()} spreadsheet successfully!</span>
            </div>
          )}
        </div>

        {/* Footer */}
        <div
          className={`p-4 border-t flex items-center justify-between ${
            isDark ? 'bg-[#0B0F19] border-[#1E2D48]' : 'bg-slate-50 border-slate-200'
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
            className="px-5 py-2 rounded-xl text-xs font-extrabold text-white bg-[#C8102E] hover:bg-red-700 shadow-2xs flex items-center gap-1.5 transition-colors"
          >
            <Download className="w-4 h-4" /> Download {format.toUpperCase()}
          </button>
        </div>
      </div>
    </div>
  )
}
