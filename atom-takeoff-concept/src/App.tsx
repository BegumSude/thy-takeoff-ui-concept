import React, { useState, useEffect, useMemo, useCallback } from 'react'
import {
  Flight,
  FilterState,
  SortField,
  ColumnDefinition,
  SavedFilter,
} from './types/takeoff'
import { INITIAL_TAKEOFF_FLIGHTS, TAKEOFF_DEFAULT_COLUMNS } from './mock/takeoffData'
import { TakeOffSidebar } from './components/TakeOffSidebar'
import { TakeOffHeader } from './components/TakeOffHeader'
import { TakeOffFilterBar } from './components/TakeOffFilterBar'
import { TakeOffFlightTable } from './components/TakeOffFlightTable'
import { TakeOffDetailDrawer } from './components/TakeOffDetailDrawer'
import { TakeOffDashboardView } from './components/TakeOffDashboardView'
import { TakeOffAdvancedFilterDrawer } from './components/TakeOffAdvancedFilterDrawer'
import { TakeOffSettingsModal } from './components/TakeOffSettingsModal'
import { TakeOffExportModal } from './components/TakeOffExportModal'
import { TakeOffShiftNotes } from './components/TakeOffShiftNotes'
import './styles/takeoff-tokens.css'

const DEFAULT_FILTERS: FilterState = {
  base: 'IST',
  dateType: 'STD',
  begin: '2026-07-28',
  end: '2026-07-28',
  flight: '',
  dep: '',
  arr: '',
  regNo: '',
  status: 'All',
  zone: 'All',
  callSign: '',
  flags: [],
  icons: [],
  acOwner: 'All',
  opCode: 'All',
  serviceType: 'All',
  traffic: 'All',
  operationGenre: 'All',
  country: 'All',
  fuel: 'All',
  delayCode: 'All',
  quickSearch: '',
  watchListOnly: false,
  assignedDesk: 'All',
  presetFilter: 'all',
}

export default function App() {
  const [flights, setFlights] = useState<Flight[]>(INITIAL_TAKEOFF_FLIGHTS)
  const [selectedFlight, setSelectedFlight] = useState<Flight | null>(null)
  const [flashingFlightIds, setFlashingFlightIds] = useState<Set<string>>(new Set())
  const [navCollapsed, setNavCollapsed] = useState(false)
  const [activeNav, setActiveNav] = useState('flights')
  const [activeHub, setActiveHub] = useState('IST')

  // TakeOff Theme Management
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    const saved = localStorage.getItem('takeoff_theme')
    return (saved === 'light' || saved === 'dark') ? saved : 'dark'
  })

  // Global TakeOff Theme Sync
  useEffect(() => {
    const root = document.documentElement
    const body = document.body
    if (theme === 'dark') {
      root.className = 'takeoff-dark'
      body.className = 'takeoff-dark'
    } else {
      root.className = 'takeoff-light'
      body.className = 'takeoff-light'
    }
  }, [theme])

  const toggleTheme = useCallback(() => {
    setTheme((prev) => {
      const next = prev === 'dark' ? 'light' : 'dark'
      localStorage.setItem('takeoff_theme', next)
      return next
    })
  }, [])

  // Filter & Sort State
  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS)
  const [sortField, setSortField] = useState<SortField>('std')
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc')

  // UI Modal & Drawer States
  const [advancedFilterOpen, setAdvancedFilterOpen] = useState(false)
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [exportOpen, setExportOpen] = useState(false)
  const [liveActive, setLiveActive] = useState(true)

  // Settings State
  const [columns, setColumns] = useState<ColumnDefinition[]>(TAKEOFF_DEFAULT_COLUMNS)
  const [groupByWatchList, setGroupByWatchList] = useState(false)

  // Pagination State (Default 50 rows per page for dense OCC view)
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(50)

  const isDark = theme === 'dark'

  // Live Telemetry Simulation
  useEffect(() => {
    if (!liveActive) return

    const timer = setInterval(() => {
      const idx = Math.floor(Math.random() * INITIAL_TAKEOFF_FLIGHTS.length)
      let flashId = ''

      setFlights((prev) => {
        const target = prev[idx]
        if (!target || target.status === 'Arrived' || target.status === 'Cancelled') return prev

        const updated = { ...target }
        const roll = Math.random()

        if (roll < 0.4 && target.status === 'Scheduled') {
          updated.status = 'Off Block'
          updated.etd = target.std
        } else if (roll < 0.7 && target.status === 'Delayed') {
          updated.delayMinutes += 15
          const [h, m] = target.std.split(':').map(Number)
          const tot = h * 60 + m + updated.delayMinutes
          const nh = Math.floor(tot / 60) % 24
          const nm = tot % 60
          updated.etd = `${String(nh).padStart(2, '0')}:${String(nm).padStart(2, '0')}`
        }

        updated.updatedAt = Date.now()
        flashId = updated.id

        const nextArr = [...prev]
        nextArr[idx] = updated
        return nextArr
      })

      if (flashId) {
        setFlashingFlightIds((p) => new Set([...p, flashId]))
        setTimeout(() => {
          setFlashingFlightIds((p) => {
            const next = new Set(p)
            next.delete(flashId)
            return next
          })
        }, 2200)
      }
    }, 7000)

    return () => clearInterval(timer)
  }, [liveActive])

  // Sort Handler
  const handleSort = useCallback((field: SortField) => {
    setSortField((prevField) => {
      if (prevField === field) {
        setSortDir((prevDir) => (prevDir === 'asc' ? 'desc' : 'asc'))
        return field
      }
      setSortDir('asc')
      return field
    })
  }, [])

  // Filter Handlers
  const handleFilterChange = (updated: Partial<FilterState>) => {
    setFilters((prev) => ({ ...prev, ...updated }))
    setPage(1)
  }

  const handleClearFilters = () => {
    setFilters(DEFAULT_FILTERS)
    setPage(1)
  }

  const handleToggleWatchlist = (flightId: string, e: React.MouseEvent) => {
    e.stopPropagation()
    setFlights((prev) =>
      prev.map((f) => (f.id === flightId ? { ...f, watchList: !f.watchList } : f))
    )
  }

  // Column Visibility Handlers
  const handleToggleColumn = (colId: string) => {
    setColumns((prev) =>
      prev.map((col) => (col.id === colId ? { ...col, visible: !col.visible } : col))
    )
  }

  const handleResetColumns = () => {
    setColumns(TAKEOFF_DEFAULT_COLUMNS)
  }

  // Saved Filter Preset Handler
  const handleLoadSavedFilter = (preset: SavedFilter) => {
    setFilters(preset.filters)
    setSettingsOpen(false)
    setPage(1)
  }

  // Active Status Count
  const activeStatusCount = useMemo(() => {
    const counts: Record<string, number> = {}
    flights.forEach((f) => {
      counts[f.status] = (counts[f.status] || 0) + 1
    })
    return counts
  }, [flights])

  // Filtered & Sorted Flights
  const displayFlights = useMemo(() => {
    let result = flights

    if (filters.base !== 'All') {
      result = result.filter((f) => f.base === filters.base)
    }
    if (filters.flight.trim()) {
      const q = filters.flight.toLowerCase()
      result = result.filter((f) => f.flightNumber.toLowerCase().includes(q))
    }
    if (filters.dep.trim()) {
      const q = filters.dep.toLowerCase()
      result = result.filter((f) => f.dep.toLowerCase().includes(q))
    }
    if (filters.arr.trim()) {
      const q = filters.arr.toLowerCase()
      result = result.filter((f) => f.arr.toLowerCase().includes(q))
    }
    if (filters.regNo.trim()) {
      const q = filters.regNo.toLowerCase()
      result = result.filter((f) => f.regNo.toLowerCase().includes(q))
    }
    if (filters.status !== 'All') {
      result = result.filter((f) => f.status === filters.status)
    }
    if (filters.flags.length > 0) {
      result = result.filter((f) => filters.flags.some((flag) => f.flags.includes(flag as any)))
    }
    if (filters.watchListOnly) {
      result = result.filter((f) => f.watchList)
    }
    if (filters.quickSearch.trim()) {
      const q = filters.quickSearch.toLowerCase()
      result = result.filter(
        (f) =>
          f.flightNumber.toLowerCase().includes(q) ||
          f.callSign.toLowerCase().includes(q) ||
          f.dep.toLowerCase().includes(q) ||
          f.arr.toLowerCase().includes(q) ||
          f.regNo.toLowerCase().includes(q) ||
          f.gate.toLowerCase().includes(q)
      )
    }

    // Sort
    const sorted = [...result].sort((a, b) => {
      if (groupByWatchList) {
        if (a.watchList && !b.watchList) return -1
        if (!a.watchList && b.watchList) return 1
      }

      let av: any = a[sortField] || ''
      let bv: any = b[sortField] || ''

      if (sortField === 'delayMinutes') {
        av = a.delayMinutes
        bv = b.delayMinutes
      }

      const cmp = av < bv ? -1 : av > bv ? 1 : 0
      return sortDir === 'asc' ? cmp : -cmp
    })

    return sorted
  }, [flights, filters, sortField, sortDir, groupByWatchList])

  const paginatedFlights = useMemo(() => {
    const start = (page - 1) * pageSize
    return displayFlights.slice(start, start + pageSize)
  }, [displayFlights, page, pageSize])

  return (
    <div
      className={`flex h-screen overflow-hidden select-none transition-colors duration-200 ${
        isDark ? 'bg-[#0B0F19] text-[#F8FAFC]' : 'bg-[#F8FAFB] text-slate-900'
      }`}
    >
      {/* TakeOff Left Navigation Sidebar */}
      <TakeOffSidebar
        collapsed={navCollapsed}
        onToggleCollapse={() => setNavCollapsed(!navCollapsed)}
        activeNav={activeNav}
        onSelectNav={setActiveNav}
        onOpenSettings={() => setSettingsOpen(true)}
        theme={theme}
        onToggleTheme={toggleTheme}
      />

      {/* Main TakeOff Workspace */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Header */}
        <TakeOffHeader
          quickSearch={filters.quickSearch}
          onQuickSearchChange={(val) => handleFilterChange({ quickSearch: val })}
          liveActive={liveActive}
          onToggleLive={() => setLiveActive(!liveActive)}
          onOpenSettings={() => setSettingsOpen(true)}
          onOpenAdvancedFilter={() => setAdvancedFilterOpen(true)}
          activeHub={activeHub}
          onHubChange={setActiveHub}
          theme={theme}
          onToggleTheme={toggleTheme}
          activeNav={activeNav}
        />

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto p-4 flex flex-col takeoff-scrollbar">
          {activeNav === 'dashboard' ? (
            <TakeOffDashboardView
              flights={flights}
              theme={theme}
              onNavigateToFlights={() => setActiveNav('flights')}
            />
          ) : activeNav === 'shift-notes' ? (
            <div className="flex-1 flex flex-col fade-in">
              <TakeOffShiftNotes theme={theme} />
            </div>
          ) : (
            <div className="flex-1 flex flex-col space-y-3 fade-in">
              {/* TakeOff Filter Bar with Original ATOM Filter System */}
              <TakeOffFilterBar
                filters={filters}
                onFilterChange={handleFilterChange}
                onClearFilters={handleClearFilters}
                onOpenAdvancedFilter={() => setAdvancedFilterOpen(true)}
                onOpenSettings={() => setSettingsOpen(true)}
                onOpenExport={() => setExportOpen(true)}
                activeStatusCount={activeStatusCount}
                totalCount={flights.length}
                theme={theme}
              />

              {/* TakeOff Excel-Like Data Grid Table */}
              <TakeOffFlightTable
                flights={paginatedFlights}
                selectedFlightId={selectedFlight?.id || null}
                onSelectFlight={setSelectedFlight}
                flashingFlightIds={flashingFlightIds}
                sortField={sortField}
                sortDir={sortDir}
                onSort={handleSort}
                columns={columns}
                page={page}
                pageSize={pageSize}
                onPageSizeChange={setPageSize}
                totalFlights={displayFlights.length}
                onPageChange={setPage}
                onToggleWatchlist={handleToggleWatchlist}
                theme={theme}
              />
            </div>
          )}
        </main>
      </div>

      {/* TakeOff Progressive Disclosure Detail Drawer */}
      <TakeOffDetailDrawer
        flight={selectedFlight}
        onClose={() => setSelectedFlight(null)}
        theme={theme}
      />

      {/* TakeOff Advanced Filter Query Drawer */}
      <TakeOffAdvancedFilterDrawer
        open={advancedFilterOpen}
        onClose={() => setAdvancedFilterOpen(false)}
        filters={filters}
        onFilterChange={handleFilterChange}
        onClearFilters={handleClearFilters}
        theme={theme}
      />

      {/* TakeOff Operational Settings Modal */}
      <TakeOffSettingsModal
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        columns={columns}
        onToggleColumn={handleToggleColumn}
        onResetColumns={handleResetColumns}
        groupByWatchList={groupByWatchList}
        onToggleWatchListGroup={() => setGroupByWatchList(!groupByWatchList)}
        activeFilters={filters}
        onLoadSavedFilter={handleLoadSavedFilter}
        theme={theme}
      />

      {/* TakeOff Export Telemetry Modal */}
      <TakeOffExportModal
        open={exportOpen}
        onClose={() => setExportOpen(false)}
        flights={displayFlights}
        theme={theme}
      />
    </div>
  )
}
