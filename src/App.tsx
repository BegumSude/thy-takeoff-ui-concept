import React, { useState, useEffect, useMemo, useCallback } from 'react'
import {
  Flight,
  FilterState,
  SortField,
  ColumnDefinition,
  SavedFilter,
  HubDesk,
} from './types/atom'
import {
  INITIAL_MOCK_FLIGHTS,
  DEFAULT_COLUMNS,
  HUB_DESKS,
} from './mock/atomData'
import { LeftNav } from './components/LeftNav'
import { TopBar } from './components/TopBar'
import { FilterBar } from './components/FilterBar'
import { FlightTable } from './components/FlightTable'
import { DetailDrawer } from './components/DetailDrawer'
import { DashboardView } from './components/DashboardView'
import { AdvancedFilterDrawer } from './components/AdvancedFilterDrawer'
import { SettingsModal } from './components/SettingsModal'
import { ExportModal } from './components/ExportModal'
import { AtomShiftNotes } from './components/AtomShiftNotes'

const DEFAULT_FILTERS: FilterState = {
  base: 'IST',
  dateType: 'STD',
  begin: '2026-07-24',
  end: '2026-07-24',
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
}

export default function App() {
  const [flights, setFlights] = useState<Flight[]>(INITIAL_MOCK_FLIGHTS)
  const [selectedFlight, setSelectedFlight] = useState<Flight | null>(null)
  const [flashingFlightIds, setFlashingFlightIds] = useState<Set<string>>(new Set())
  const [navCollapsed, setNavCollapsed] = useState(false)
  const [activeNav, setActiveNav] = useState('flights')
  const [activeHub, setActiveHub] = useState('IST')

  // Theme Management
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    const saved = localStorage.getItem('atom_theme')
    return (saved === 'light' || saved === 'dark') ? saved : 'dark'
  })

  // Global Theme Sync
  useEffect(() => {
    const root = document.documentElement
    const body = document.body
    if (theme === 'dark') {
      root.classList.add('dark')
      body.classList.add('dark')
      body.style.backgroundColor = '#0F172A'
      body.style.color = '#F9FAFB'
    } else {
      root.classList.remove('dark')
      body.classList.remove('dark')
      body.style.backgroundColor = '#F8FAFB'
      body.style.color = '#0F172A'
    }
  }, [theme])

  const toggleTheme = useCallback(() => {
    setTheme((prev) => {
      const next = prev === 'dark' ? 'light' : 'dark'
      localStorage.setItem('atom_theme', next)
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
  const [columns, setColumns] = useState<ColumnDefinition[]>(DEFAULT_COLUMNS)
  const [hubDesks, setHubDesks] = useState<HubDesk[]>(HUB_DESKS)
  const [groupByWatchList, setGroupByWatchList] = useState(false)

  // Pagination State
  const [page, setPage] = useState(1)
  const pageSize = 15

  const isDark = theme === 'dark'

  // Live Telemetry Updates Simulation
  useEffect(() => {
    if (!liveActive) return

    const timer = setInterval(() => {
      const idx = Math.floor(Math.random() * INITIAL_MOCK_FLIGHTS.length)
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
    }, 6000)

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
    setColumns(DEFAULT_COLUMNS)
  }

  // Hub Desk Handler
  const handleAssignHubDesk = (deskId: string, countDelta: number) => {
    setHubDesks((prev) =>
      prev.map((d) => (d.id === deskId ? { ...d, assignedCount: d.assignedCount + countDelta } : d))
    )
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
    if (filters.zone !== 'All') {
      result = result.filter((f) => f.zone === filters.zone)
    }
    if (filters.callSign.trim()) {
      const q = filters.callSign.toLowerCase()
      result = result.filter((f) => f.callSign.toLowerCase().includes(q))
    }
    if (filters.flags.length > 0) {
      result = result.filter((f) => filters.flags.some((flag) => f.flags.includes(flag)))
    }
    if (filters.icons.length > 0) {
      result = result.filter((f) => filters.icons.some((icon) => f.icons.includes(icon)))
    }
    if (filters.acOwner !== 'All') {
      result = result.filter((f) => f.acOwner.includes(filters.acOwner))
    }
    if (filters.opCode !== 'All') {
      result = result.filter((f) => f.opCode === filters.opCode)
    }
    if (filters.serviceType !== 'All') {
      result = result.filter((f) => f.serviceType === filters.serviceType)
    }
    if (filters.traffic !== 'All') {
      result = result.filter((f) => f.traffic === filters.traffic)
    }
    if (filters.operationGenre !== 'All') {
      result = result.filter((f) => f.operationGenre === filters.operationGenre)
    }
    if (filters.country !== 'All') {
      result = result.filter((f) => f.country === filters.country)
    }
    if (filters.fuel !== 'All') {
      result = result.filter((f) => f.fuel === filters.fuel)
    }
    if (filters.delayCode !== 'All') {
      if (filters.delayCode === 'None') {
        result = result.filter((f) => f.delayMinutes === 0)
      } else {
        result = result.filter((f) => f.delayCode.includes(filters.delayCode.split(' ')[0]))
      }
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

  // Paginated Slice
  const paginatedFlights = useMemo(() => {
    const start = (page - 1) * pageSize
    return displayFlights.slice(start, start + pageSize)
  }, [displayFlights, page, pageSize])

  return (
    <div
      className={`flex h-screen overflow-hidden select-none transition-colors duration-200 ${
        isDark ? 'bg-[#0F172A] text-[#F9FAFB]' : 'bg-[#F8FAFB] text-slate-900'
      }`}
    >
      {/* Left Navigation */}
      <LeftNav
        collapsed={navCollapsed}
        onToggleCollapse={() => setNavCollapsed(!navCollapsed)}
        activeNav={activeNav}
        onSelectNav={setActiveNav}
        onOpenSettings={() => setSettingsOpen(true)}
        theme={theme}
        onToggleTheme={toggleTheme}
      />

      {/* Main Workspace */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Header */}
        <TopBar
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

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto p-5 flex flex-col custom-scrollbar">
          {/* Conditional Rendering based on LeftNav Selection */}
          {activeNav === 'dashboard' ? (
            /* 1. Dedicated Operations Dashboard View */
            <DashboardView
              flights={flights}
              theme={theme}
              onNavigateToFlights={() => setActiveNav('flights')}
            />
          ) : activeNav === 'shift-notes' ? (
            /* 2. Full-Page ATOM Shift Notes & Handover Log View */
            <div className="flex-1 flex flex-col fade-in">
              <AtomShiftNotes theme={theme} />
            </div>
          ) : (
            /* 3. Main Flight List View */
            <div className="flex-1 flex flex-col space-y-4 fade-in">
              {/* Collapsible Filter Bar with 21 filters */}
              <FilterBar
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

              {/* Main Flight Grid Table */}
              <FlightTable
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
                totalFlights={displayFlights.length}
                onPageChange={setPage}
                onToggleWatchlist={handleToggleWatchlist}
                theme={theme}
              />
            </div>
          )}
        </main>
      </div>

      {/* Slide-over Detail Drawer matching reference design */}
      <DetailDrawer
        flight={selectedFlight}
        onClose={() => setSelectedFlight(null)}
        theme={theme}
      />

      {/* Slide-over Advanced Filter Drawer */}
      <AdvancedFilterDrawer
        open={advancedFilterOpen}
        onClose={() => setAdvancedFilterOpen(false)}
        filters={filters}
        onFilterChange={handleFilterChange}
        onClearFilters={handleClearFilters}
        theme={theme}
      />

      {/* Operational Settings Modal */}
      <SettingsModal
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        columns={columns}
        onToggleColumn={handleToggleColumn}
        onResetColumns={handleResetColumns}
        groupByWatchList={groupByWatchList}
        onToggleWatchListGroup={() => setGroupByWatchList(!groupByWatchList)}
        hubDesks={hubDesks}
        onAssignHubDesk={handleAssignHubDesk}
        activeFilters={filters}
        onLoadSavedFilter={handleLoadSavedFilter}
        theme={theme}
      />

      {/* Export Modal */}
      <ExportModal
        open={exportOpen}
        onClose={() => setExportOpen(false)}
        flights={displayFlights}
        theme={theme}
      />
    </div>
  )
}
