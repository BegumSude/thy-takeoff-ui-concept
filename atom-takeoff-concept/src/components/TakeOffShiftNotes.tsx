import React, { useState } from 'react'
import {
  FileText,
  Plus,
  Search,
  Pin,
  User,
  X,
  Plane,
  Clock,
  Tag,
  AlertTriangle,
  CheckCircle2,
  Paperclip,
  AtSign,
  History,
  Filter,
  ArrowUpDown,
  Download,
  Share2,
  BookOpen,
} from 'lucide-react'

export interface TakeOffShiftNote {
  id: string
  title: string
  content: string
  priority: 'HIGH' | 'MEDIUM' | 'ROUTINE'
  category: 'Weather' | 'Crew' | 'Aircraft' | 'Ground' | 'Fuel' | 'ATC'
  flightNumber?: string
  author: string
  role: string
  shift: 'Day Shift' | 'Night Shift'
  timestamp: string
  pinned?: boolean
  isMine?: boolean
  mentions?: string[]
  attachments?: { name: string; size: string; type: string }[]
  history?: { user: string; action: string; time: string }[]
}

const INITIAL_TAKEOFF_SHIFT_NOTES: TakeOffShiftNote[] = [
  {
    id: 'sn-1',
    title: 'Active Runway Change Executed',
    content:
      'Runway changed to 17R at IST due to a sudden wind shift to 240/18kt. All heavy wide-body departures (B777/A350) expect minor taxi delays (+10-15m). Apron control notified to pre-sequence departure pushbacks on Zone 1.',
    priority: 'HIGH',
    category: 'ATC',
    flightNumber: 'TK 1983',
    author: 'Capt. E. Yılmaz',
    role: 'Duty OCC Supervisor',
    shift: 'Day Shift',
    timestamp: '14:20 UTC',
    pinned: true,
    isMine: false,
    mentions: ['@Operations', '@ApronControl', '@TowerDesk'],
    attachments: [
      { name: 'IST_WindShift_Radar.pdf', size: '2.4 MB', type: 'pdf' },
      { name: 'Runway17R_Taxiway_Diagram.png', size: '1.1 MB', type: 'image' },
    ],
    history: [
      { user: 'Capt. E. Yılmaz', action: 'Created initial runway change alert', time: '14:20 UTC' },
      { user: 'D. Kaya', action: 'Acknowledged and routed to Eurocontrol', time: '14:25 UTC' },
    ],
  },
  {
    id: 'sn-2',
    title: 'Flight Deck Crew Replacement',
    content:
      'Crew replacement completed for Capt. Yılmaz on TK 0001 (JFK). F/O Aydin stepped in after FTL duty time check. Standby crew activated from IST Duty Lounge at 13:30 UTC.',
    priority: 'MEDIUM',
    category: 'Crew',
    flightNumber: 'TK 0001',
    author: 'D. Kaya',
    role: 'Crew Dispatcher',
    shift: 'Day Shift',
    timestamp: '13:45 UTC',
    pinned: true,
    isMine: true,
    mentions: ['@CrewRoster', '@JFKDesk'],
    attachments: [{ name: 'Crew_FTL_Compliance_Report.pdf', size: '850 KB', type: 'pdf' }],
    history: [
      { user: 'D. Kaya', action: 'Updated F/O Aydin assignment status', time: '13:45 UTC' },
    ],
  },
  {
    id: 'sn-3',
    title: 'Severe Weather Alert - EGLL Airspace',
    content:
      'Weather expected to deteriorate after 18:00 UTC over London Heathrow (LHR). Heavy CB clouds & TSRA reported. Holding pattern probabilities high. Contingency fuel uplifted for TK 1983.',
    priority: 'HIGH',
    category: 'Weather',
    flightNumber: 'TK 1983',
    author: 'M. Er',
    role: 'Meteorology Desk Specialist',
    shift: 'Day Shift',
    timestamp: '13:10 UTC',
    pinned: false,
    isMine: false,
    mentions: ['@FlightDispatch', '@EuropeDesk'],
    attachments: [{ name: 'EGLL_SIGMET_Chart.png', size: '3.2 MB', type: 'image' }],
    history: [
      { user: 'M. Er', action: 'Issued SIGMET advisory for EGLL arrivals', time: '13:10 UTC' },
    ],
  },
  {
    id: 'sn-4',
    title: 'Jetbridge Maintenance Reassignment',
    content:
      'Gate B12 unavailable due to jetbridge hydraulic maintenance. Reassigned arriving TK 1983 to Gate B14. Passenger bus transfer prepared as backup.',
    priority: 'MEDIUM',
    category: 'Ground',
    flightNumber: 'TK 1983',
    author: 'S. Şahin',
    role: 'Apron Controller',
    shift: 'Night Shift',
    timestamp: '12:30 UTC',
    pinned: false,
    isMine: false,
    mentions: ['@GroundHandling', '@GateManager'],
    attachments: [],
    history: [],
  },
  {
    id: 'sn-5',
    title: 'Stand 304 Fuel Uplift Delay',
    content:
      'Fuel uplift delayed by supplier on Stand 304 for TK 1982. Hydrant pump pressure restored at 11:45 UTC. Tankering fuel approved for return leg.',
    priority: 'ROUTINE',
    category: 'Fuel',
    flightNumber: 'TK 1982',
    author: 'B. Çelik',
    role: 'Fuel Dispatcher',
    shift: 'Day Shift',
    timestamp: '11:50 UTC',
    pinned: false,
    isMine: true,
    mentions: ['@FuelSupplier'],
    attachments: [],
    history: [],
  },
]

interface TakeOffShiftNotesProps {
  theme?: 'dark' | 'light'
}

export const TakeOffShiftNotes: React.FC<TakeOffShiftNotesProps> = ({
  theme = 'dark',
}) => {
  const isDark = theme === 'dark'
  const [notes, setNotes] = useState<TakeOffShiftNote[]>(INITIAL_TAKEOFF_SHIFT_NOTES)
  const [selectedNoteId, setSelectedNoteId] = useState<string>(INITIAL_TAKEOFF_SHIFT_NOTES[0].id)
  const [activeLeftTab, setActiveLeftTab] = useState<string>('all')
  const [selectedCategory, setSelectedCategory] = useState<string>('All')
  const [searchQuery, setSearchQuery] = useState('')
  const [showAddModal, setShowAddModal] = useState(false)

  // New Note Form State
  const [newTitle, setNewTitle] = useState('')
  const [newContent, setNewContent] = useState('')
  const [newPriority, setNewPriority] = useState<'HIGH' | 'MEDIUM' | 'ROUTINE'>('MEDIUM')
  const [newCategory, setNewCategory] = useState<'Weather' | 'Crew' | 'Aircraft' | 'Ground' | 'Fuel' | 'ATC'>('Ground')
  const [newFlightRef, setNewFlightRef] = useState('')

  const activeNote = notes.find((n) => n.id === selectedNoteId) || notes[0]

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newTitle.trim() || !newContent.trim()) return

    const created: TakeOffShiftNote = {
      id: `sn-${Date.now()}`,
      title: newTitle.trim(),
      content: newContent.trim(),
      priority: newPriority,
      category: newCategory,
      flightNumber: newFlightRef.trim() || undefined,
      author: 'Begüm Sude (You)',
      role: 'Senior OCC Controller',
      shift: 'Day Shift',
      timestamp: 'Just now (14:53 UTC)',
      pinned: newPriority === 'HIGH',
      isMine: true,
      mentions: ['@Operations'],
      attachments: [],
      history: [{ user: 'Begüm Sude', action: 'Created shift log entry', time: 'Just now' }],
    }

    setNotes((prev) => [created, ...prev])
    setSelectedNoteId(created.id)
    setNewTitle('')
    setNewContent('')
    setShowAddModal(false)
  }

  const togglePin = (noteId: string) => {
    setNotes((prev) =>
      prev.map((n) => (n.id === noteId ? { ...n, pinned: !n.pinned } : n))
    )
  }

  // Filter Logic
  const filteredNotes = notes.filter((note) => {
    if (activeLeftTab === 'mine' && !note.isMine) return false
    if (activeLeftTab === 'important' && note.priority !== 'HIGH') return false
    if (activeLeftTab === 'pinned' && !note.pinned) return false
    if (activeLeftTab === 'shift' && note.shift !== 'Day Shift') return false

    if (selectedCategory !== 'All' && note.category !== selectedCategory) return false

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      const match =
        note.title.toLowerCase().includes(q) ||
        note.content.toLowerCase().includes(q) ||
        note.author.toLowerCase().includes(q) ||
        (note.flightNumber && note.flightNumber.toLowerCase().includes(q))
      if (!match) return false
    }

    return true
  })

  return (
    <div
      className={`flex-1 flex flex-col rounded-2xl border overflow-hidden transition-colors ${
        isDark ? 'bg-[#0B0F19] border-[#1E2D48] text-[#F8FAFC]' : 'bg-white border-slate-200 text-slate-900 shadow-sm'
      }`}
    >
      {/* Top Main Workspace Toolbar */}
      <div
        className={`p-3.5 border-b flex items-center justify-between gap-4 select-none ${
          isDark ? 'bg-[#131B2E] border-[#1E2D48]' : 'bg-slate-50 border-slate-200'
        }`}
      >
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-[#C8102E]/20 text-[#C8102E] border border-[#C8102E]/30 flex items-center justify-center">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-black uppercase tracking-tight text-white">
                AtoMessage  
              </h2>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-950/80 text-emerald-400 border border-emerald-800/60">
                ACTIVE SHIFT (DAY)
              </span>
            </div>
            <p className="text-xs text-slate-400 font-medium">34-Inch Ultrawide Full-Screen Operational Log Environment</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Search Bar */}
          <div className="relative w-64">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search all shift notes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 rounded-xl text-xs font-medium bg-[#0B0F19] border border-[#1E2D48] text-slate-200 placeholder-slate-500 focus:outline-none focus:border-[#C8102E]"
            />
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="px-3 py-1.5 rounded-xl text-xs font-extrabold bg-[#C8102E] text-white hover:bg-[#a00c24] transition-colors flex items-center gap-1.5 shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Log Shift Note</span>
          </button>
        </div>
      </div>

      {/* Main 3-Column Full-Screen Workspace */}
      <div className="flex-1 flex min-h-0 overflow-hidden">
        {/* COLUMN 1: Left Navigation Sub-Panel */}
        <div
          className={`w-64 border-r p-3.5 space-y-4 flex-shrink-0 flex flex-col justify-between select-none ${
            isDark ? 'bg-[#0B0F19] border-[#1E2D48]' : 'bg-slate-50 border-slate-200'
          }`}
        >
          <div className="space-y-4">
            {/* Views Section */}
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-2 px-2">
                Handover Views
              </span>
              <div className="space-y-1">
                {[
                  { id: 'all', label: 'All Notes', count: notes.length },
                  { id: 'shift', label: 'Shift Handover', count: notes.filter((n) => n.shift === 'Day Shift').length },
                  { id: 'important', label: 'Important', count: notes.filter((n) => n.priority === 'HIGH').length },
                  { id: 'mine', label: 'My Notes', count: notes.filter((n) => n.isMine).length },
                  { id: 'pinned', label: 'Pinned Notes', count: notes.filter((n) => n.pinned).length },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setActiveLeftTab(item.id)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                      activeLeftTab === item.id
                        ? 'bg-[#C8102E] text-white shadow-2xs'
                        : isDark
                        ? 'text-slate-300 hover:bg-[#131B2E] hover:text-white'
                        : 'text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    <span>{item.label}</span>
                    <span
                      className={`px-1.5 py-0.2 rounded text-[10px] font-mono ${
                        activeLeftTab === item.id ? 'bg-white/20 text-white' : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {item.count}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Operational Categories Section */}
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-2 px-2">
                Categories
              </span>
              <div className="flex flex-wrap gap-1.5 px-1">
                {['All', 'Weather', 'Crew', 'Aircraft', 'Ground', 'Fuel', 'ATC'].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-2.5 py-1 rounded-xl text-xs font-mono font-bold border transition-colors ${
                      selectedCategory === cat
                        ? 'bg-[#131B2E] border-amber-400 text-amber-400'
                        : 'bg-[#131B2E]/60 border-[#1E2D48] text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Shift Handover Completion Card */}
          <div className="p-3 rounded-xl border bg-[#131B2E] border-[#1E2D48] space-y-1.5 text-xs">
            <div className="flex justify-between items-center font-bold">
              <span className="text-slate-300">Shift Handover Log Status</span>
              <span className="text-emerald-400 font-mono">85% Ready</span>
            </div>
            <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
              <div className="bg-emerald-400 h-full" style={{ width: '85%' }} />
            </div>
            <p className="text-[10px] text-slate-400">Night shift handover checklist in progress</p>
          </div>
        </div>

        {/* COLUMN 2: Center Notes Selection List */}
        <div
          className={`w-96 border-r flex flex-col flex-shrink-0 select-none ${
            isDark ? 'bg-[#0B0F19] border-[#1E2D48]' : 'bg-slate-50 border-slate-200'
          }`}
        >
          <div className="p-3 border-b border-[#1E2D48] flex items-center justify-between text-xs font-bold text-slate-400">
            <span>Showing {filteredNotes.length} Log Entries</span>
            <div className="flex items-center gap-1 text-[11px]">
              <Filter className="w-3 h-3 text-slate-500" />
              <span>Sorted by Time</span>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto takeoff-scrollbar p-2.5 space-y-2">
            {filteredNotes.map((note) => {
              const isSelected = note.id === selectedNoteId
              return (
                <div
                  key={note.id}
                  onClick={() => setSelectedNoteId(note.id)}
                  className={`p-3 rounded-xl border cursor-pointer space-y-2 transition-all ${
                    isSelected
                      ? 'bg-[#131B2E] border-[#C8102E] shadow-sm'
                      : 'bg-[#131B2E]/60 border-[#1E2D48] hover:border-slate-600'
                  }`}
                >
                  <div className="flex items-center justify-between gap-1">
                    <div className="flex items-center gap-1.5 overflow-hidden">
                      <span
                        className={`px-1.5 py-0.2 rounded text-[9px] font-mono font-extrabold uppercase border ${
                          note.priority === 'HIGH'
                            ? 'bg-red-950/80 text-red-400 border-red-800/60'
                            : note.priority === 'MEDIUM'
                            ? 'bg-amber-950/80 text-amber-400 border-amber-800/60'
                            : 'bg-emerald-950/80 text-emerald-400 border-emerald-800/60'
                        }`}
                      >
                        {note.priority}
                      </span>
                      <span className="px-1.5 py-0.2 rounded text-[9px] font-mono font-semibold bg-slate-800 text-slate-300 border border-slate-700">
                        {note.category}
                      </span>
                      {note.flightNumber && (
                        <span className="px-1.5 py-0.2 rounded text-[9px] font-mono font-bold bg-[#C8102E]/20 text-[#C8102E] border border-[#C8102E]/40 flex items-center gap-0.5">
                          <Plane className="w-2.5 h-2.5" />
                          {note.flightNumber}
                        </span>
                      )}
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        togglePin(note.id)
                      }}
                      className="text-slate-500 hover:text-amber-400"
                    >
                      <Pin className={`w-3.5 h-3.5 ${note.pinned ? 'fill-amber-400 text-amber-400' : ''}`} />
                    </button>
                  </div>

                  <div>
                    <h4 className="text-xs font-extrabold text-white truncate">{note.title}</h4>
                    <p className="text-xs text-slate-400 line-clamp-2 mt-0.5 leading-snug">{note.content}</p>
                  </div>

                  <div className="flex items-center justify-between text-[10px] text-slate-500 pt-1 border-t border-[#1E2D48] font-mono">
                    <span className="text-slate-300 font-bold">{note.author}</span>
                    <span>{note.timestamp}</span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* COLUMN 3: Right Main Workspace (Spacious Long-Form Reading & Editing Area) */}
        {activeNote && (
          <div className="flex-1 flex flex-col overflow-y-auto takeoff-scrollbar p-6 space-y-5">
            {/* Note Header Details */}
            <div className="space-y-3 border-b border-[#1E2D48] pb-4">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span
                    className={`px-2.5 py-1 rounded-xl text-xs font-mono font-black uppercase border ${
                      activeNote.priority === 'HIGH'
                        ? 'bg-red-950/80 text-red-400 border-red-800/60'
                        : activeNote.priority === 'MEDIUM'
                        ? 'bg-amber-950/80 text-amber-400 border-amber-800/60'
                        : 'bg-emerald-950/80 text-emerald-400 border-emerald-800/60'
                    }`}
                  >
                    {activeNote.priority} PRIORITY
                  </span>

                  <span className="px-2.5 py-1 rounded-xl text-xs font-mono font-bold bg-slate-800 text-slate-200 border border-slate-700">
                    Category: {activeNote.category}
                  </span>

                  {activeNote.flightNumber && (
                    <span className="px-2.5 py-1 rounded-xl text-xs font-mono font-bold bg-[#C8102E]/20 text-[#C8102E] border border-[#C8102E]/40 flex items-center gap-1">
                      <Plane className="w-3.5 h-3.5" />
                      Flight {activeNote.flightNumber}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2 font-mono text-xs text-slate-400">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{activeNote.timestamp} ({activeNote.shift})</span>
                </div>
              </div>

              <h1 className="text-xl font-black tracking-tight text-white">{activeNote.title}</h1>

              {/* Author & Mention Tags */}
              <div className="flex items-center justify-between text-xs pt-1">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-[#C8102E] text-white font-bold text-xs flex items-center justify-center">
                    {activeNote.author[0]}
                  </div>
                  <div>
                    <span className="font-bold text-white block">{activeNote.author}</span>
                    <span className="text-[10px] text-slate-400 font-mono">{activeNote.role}</span>
                  </div>
                </div>

                {/* Team Mentions UI Concept */}
                {activeNote.mentions && (
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] text-slate-400 font-mono uppercase">Notified Teams:</span>
                    {activeNote.mentions.map((m) => (
                      <span
                        key={m}
                        className="px-2 py-0.5 rounded-lg text-[11px] font-mono font-bold bg-purple-950/70 border border-purple-800/60 text-purple-300 flex items-center gap-1"
                      >
                        <AtSign className="w-3 h-3 text-purple-400" />
                        {m}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Spacious Long-Form Reading & Editing Workspace Area */}
            <div className="p-5 rounded-2xl border bg-[#131B2E] border-[#1E2D48] space-y-4">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block border-b border-[#1E2D48] pb-2">
                Operational Shift Handover Details
              </span>
              <p className="text-sm text-slate-200 leading-relaxed font-sans whitespace-pre-line">
                {activeNote.content}
              </p>
            </div>

            {/* Attachments Section (UI Concept Placeholder) */}
            <div className="p-4 rounded-2xl border bg-[#131B2E] border-[#1E2D48] space-y-3">
              <div className="flex items-center gap-2 border-b border-[#1E2D48] pb-2">
                <Paperclip className="w-4 h-4 text-amber-400" />
                <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-300">
                  Operational Documents & Attachments ({activeNote.attachments?.length || 0})
                </h3>
              </div>

              {activeNote.attachments && activeNote.attachments.length > 0 ? (
                <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                  {activeNote.attachments.map((att, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-xl border bg-[#0B0F19] border-[#1E2D48] flex items-center justify-between"
                    >
                      <div className="flex items-center gap-2 overflow-hidden">
                        <Paperclip className="w-3.5 h-3.5 text-sky-400 flex-shrink-0" />
                        <div className="truncate">
                          <span className="font-bold text-white block truncate">{att.name}</span>
                          <span className="text-[10px] text-slate-500">{att.size}</span>
                        </div>
                      </div>
                      <button className="p-1 rounded bg-slate-800 text-slate-300 hover:text-white">
                        <Download className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <span className="text-xs text-slate-500 italic block">No operational file attachments</span>
              )}
            </div>

            {/* Timeline / Audit History of Previous Updates */}
            <div className="p-4 rounded-2xl border bg-[#131B2E] border-[#1E2D48] space-y-3">
              <div className="flex items-center gap-2 border-b border-[#1E2D48] pb-2">
                <History className="w-4 h-4 text-purple-400" />
                <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-300">
                  Shift Log Revision & Audit Timeline
                </h3>
              </div>

              <div className="space-y-2 text-xs font-mono">
                {activeNote.history && activeNote.history.length > 0 ? (
                  activeNote.history.map((hist, idx) => (
                    <div key={idx} className="flex items-center justify-between p-2 rounded-lg bg-[#0B0F19] border border-[#1E2D48]">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-emerald-400" />
                        <span className="text-slate-300 font-bold">{hist.user}:</span>
                        <span className="text-slate-400">{hist.action}</span>
                      </div>
                      <span className="text-[10px] text-slate-500">{hist.time}</span>
                    </div>
                  ))
                ) : (
                  <div className="flex items-center gap-2 p-2 rounded-lg bg-[#0B0F19] border border-[#1E2D48]">
                    <div className="w-2 h-2 rounded-full bg-emerald-400" />
                    <span className="text-slate-300 font-bold">{activeNote.author}:</span>
                    <span className="text-slate-400">Logged shift entry</span>
                    <span className="text-[10px] text-slate-500 ml-auto">{activeNote.timestamp}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modal for Logging New Shift Note */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs fade-in select-none">
          <div className="w-full max-w-lg bg-[#131B2E] border border-[#1E2D48] rounded-2xl shadow-2xl p-5 space-y-4">
            <div className="flex items-center justify-between border-b pb-3 border-[#1E2D48]">
              <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
                <Plus className="w-4 h-4 text-[#C8102E]" />
                Log ATOM Shift Handover Note
              </h3>
              <button onClick={() => setShowAddModal(false)} className="p-1 text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddNote} className="space-y-3 text-xs">
              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                  Note Title / Summary
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Runway changed to 17R at IST."
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#0B0F19] border border-[#1E2D48] text-white focus:outline-none focus:border-[#C8102E]"
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">Priority</label>
                  <select
                    value={newPriority}
                    onChange={(e) => setNewPriority(e.target.value as any)}
                    className="w-full px-2 py-1.5 rounded-xl bg-[#0B0F19] border border-[#1E2D48] text-white font-mono"
                  >
                    <option value="HIGH">HIGH (Red)</option>
                    <option value="MEDIUM">MEDIUM (Yellow)</option>
                    <option value="ROUTINE">ROUTINE (Green)</option>
                  </select>
                </div>

                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">Category</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as any)}
                    className="w-full px-2 py-1.5 rounded-xl bg-[#0B0F19] border border-[#1E2D48] text-white font-mono"
                  >
                    <option value="Ground">Ground</option>
                    <option value="Crew">Crew</option>
                    <option value="Weather">Weather</option>
                    <option value="Aircraft">Aircraft</option>
                    <option value="Fuel">Fuel</option>
                    <option value="ATC">ATC</option>
                  </select>
                </div>

                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">Flight Ref</label>
                  <input
                    type="text"
                    placeholder="TK 1983"
                    value={newFlightRef}
                    onChange={(e) => setNewFlightRef(e.target.value)}
                    className="w-full px-2 py-1.5 rounded-xl bg-[#0B0F19] border border-[#1E2D48] text-white font-mono uppercase"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                  Full Shift Note Content
                </label>
                <textarea
                  required
                  rows={4}
                  placeholder="Enter detailed operational shift handover information..."
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#0B0F19] border border-[#1E2D48] text-white focus:outline-none focus:border-[#C8102E]"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-[#1E2D48]">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-3.5 py-1.5 rounded-xl bg-slate-800 text-slate-300 hover:text-white"
                >
                  Cancel
                </button>
                <button type="submit" className="px-4 py-1.5 rounded-xl bg-[#C8102E] text-white font-bold hover:bg-[#a00c24]">
                  Post Note
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
