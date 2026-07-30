import React, { useState } from 'react'
import {
  ColumnDefinition,
  CalculatedColumn,
  ColumnRule,
  SavedFilter,
  HubDesk,
  FilterState,
} from '../types/atom'
import { HUB_DESKS, SAVED_FILTERS_PRESETS } from '../mock/atomData'
import {
  X,
  Settings as SettingsIcon,
  Plus,
  Trash2,
  Edit3,
  Bookmark,
  Eye,
  EyeOff,
  Layers,
  Calculator,
  Sliders,
  Save,
} from 'lucide-react'

interface SettingsModalProps {
  open: boolean
  onClose: () => void
  columns: ColumnDefinition[]
  onToggleColumn: (colId: string) => void
  onResetColumns: () => void
  groupByWatchList: boolean
  onToggleWatchListGroup: () => void
  hubDesks: HubDesk[]
  onAssignHubDesk: (deskId: string) => void
  activeFilters: FilterState
  onLoadSavedFilter: (preset: SavedFilter) => void
  theme?: 'dark' | 'light'
}

type TabType = 'desk' | 'columns' | 'calculated' | 'rules' | 'presets'

export const SettingsModal: React.FC<SettingsModalProps> = ({
  open,
  onClose,
  columns,
  onToggleColumn,
  onResetColumns,
  groupByWatchList,
  onToggleWatchListGroup,
  hubDesks,
  onAssignHubDesk,
  activeFilters,
  onLoadSavedFilter,
  theme = 'dark',
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('desk')
  const [savedFilters, setSavedFilters] = useState<SavedFilter[]>(SAVED_FILTERS_PRESETS)
  const [newPresetName, setNewPresetName] = useState('')
  const [editingPresetId, setEditingPresetId] = useState<string | null>(null)
  const [renameInput, setRenameInput] = useState('')

  const isDark = theme === 'dark'

  const [calculatedCols] = useState<CalculatedColumn[]>([
    { id: 'c1', label: 'Est Ground Time', expression: 'STA - ETD', enabled: true },
    { id: 'c2', label: 'Seat Load Ratio %', expression: '(Booked / Capacity) * 100', enabled: true },
  ])

  const [columnRules] = useState<ColumnRule[]>([
    { id: 'r1', columnId: 'delay', condition: 'greaterThan', value: '30', highlightColor: 'rgba(239, 68, 68, 0.2)' },
    { id: 'r2', columnId: 'status', condition: 'equals', value: 'Delayed', highlightColor: 'rgba(245, 158, 11, 0.2)' },
  ])

  if (!open) return null

  const handleSavePreset = () => {
    if (!newPresetName.trim()) return
    const newPreset: SavedFilter = {
      id: `preset-${Date.now()}`,
      name: newPresetName.trim(),
      filters: activeFilters,
    }
    setSavedFilters([...savedFilters, newPreset])
    setNewPresetName('')
  }

  const handleRenamePreset = (id: string) => {
    if (!renameInput.trim()) return
    setSavedFilters(
      savedFilters.map((sf) => (sf.id === id ? { ...sf, name: renameInput.trim() } : sf))
    )
    setEditingPresetId(null)
    setRenameInput('')
  }

  const handleRemovePreset = (id: string) => {
    setSavedFilters(savedFilters.filter((sf) => sf.id !== id))
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
        className={`relative w-full max-w-3xl rounded-2xl shadow-2xl border overflow-hidden flex flex-col max-h-[85vh] fade-in transition-colors ${
          isDark ? 'bg-[#1E293B] border-[#334155] text-white' : 'bg-white border-slate-200 text-slate-900'
        }`}
      >
        {/* Header */}
        <div
          className={`px-6 py-4 border-b flex items-center justify-between ${
            isDark ? 'bg-[#0F172A] border-[#334155]' : 'bg-slate-50 border-slate-200'
          }`}
        >
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-[#C8102E]/20 text-[#C8102E]">
              <SettingsIcon className="w-5 h-5" />
            </div>
            <div>
              <h2 className={`text-base font-extrabold ${isDark ? 'text-white' : 'text-slate-900'}`}>ATOM Operations Settings</h2>
              <p className={`text-xs font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                Grid layout, hub assignments, rules and preset management
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className={`p-1.5 rounded-lg transition-colors ${
              isDark ? 'text-slate-400 hover:text-white hover:bg-slate-800' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-200'
            }`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div
          className={`flex border-b px-6 ${
            isDark ? 'border-[#334155] bg-[#1E293B]' : 'border-slate-200 bg-white'
          }`}
        >
          {[
            { id: 'desk', label: 'Hub Desks & Watch List', icon: Layers },
            { id: 'columns', label: 'Select Columns', icon: Eye },
            { id: 'calculated', label: 'Calculated Columns', icon: Calculator },
            { id: 'rules', label: 'Column Rules', icon: Sliders },
            { id: 'presets', label: 'Filter Presets', icon: Bookmark },
          ].map((tab) => {
            const Icon = tab.icon
            const active = activeTab === tab.id
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as TabType)}
                className={`flex items-center gap-2 px-4 py-3 text-xs font-bold transition-all border-b-2 ${
                  active
                    ? 'border-[#C8102E] text-[#C8102E]'
                    : isDark
                    ? 'border-transparent text-slate-400 hover:text-white'
                    : 'border-transparent text-slate-600 hover:text-slate-900'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            )
          })}
        </div>

        {/* Tab Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
          {/* TAB 1: Hub Desks & Watch List */}
          {activeTab === 'desk' && (
            <div className="space-y-6 fade-in">
              <div
                className={`p-4 border rounded-xl flex items-center justify-between ${
                  isDark ? 'bg-[#0F172A] border-[#334155]' : 'bg-slate-50 border-slate-200'
                }`}
              >
                <div>
                  <div className={`text-sm font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>Group Grid by Watch List</div>
                  <div className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                    Pin flagged watchlist flights to the top of the flight grid
                  </div>
                </div>
                <button
                  onClick={onToggleWatchListGroup}
                  className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all border ${
                    groupByWatchList
                      ? 'bg-[#C8102E] text-white border-[#C8102E]'
                      : isDark
                      ? 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
                      : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
                  }`}
                >
                  {groupByWatchList ? 'Grouped Active' : 'Enable Grouping'}
                </button>
              </div>

              <div>
                <h3 className={`text-xs font-extrabold uppercase tracking-wider mb-3 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                  Assign / ReAssign Flights to Hub Desks
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {hubDesks.map((desk) => (
                    <div
                      key={desk.id}
                      className={`p-3.5 border rounded-xl shadow-xs flex items-center justify-between ${
                        isDark ? 'bg-[#0F172A] border-[#334155]' : 'bg-slate-50 border-slate-200'
                      }`}
                    >
                      <div>
                        <div className={`text-xs font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>{desk.name}</div>
                        <div className={`text-[11px] font-mono ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                          Operator: {desk.operator} · ({desk.assignedCount} active flights)
                        </div>
                      </div>
                      <button
                        onClick={() => onAssignHubDesk(desk.id)}
                        className="px-3 py-1.5 rounded-xl text-xs font-extrabold text-[#C8102E] bg-[#C8102E]/20 hover:bg-[#C8102E]/30 border border-[#C8102E]/40 transition-colors"
                      >
                        Assign Desk
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: Select Columns */}
          {activeTab === 'columns' && (
            <div className="space-y-4 fade-in">
              <div className="flex items-center justify-between">
                <span className={`text-xs font-extrabold uppercase tracking-wider ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                  Visible Table Columns ({columns.filter((c) => c.visible).length}/{columns.length})
                </span>
                <button
                  onClick={onResetColumns}
                  className="text-xs font-bold text-[#C8102E] hover:underline"
                >
                  Reset Default Layout
                </button>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {columns.map((col) => (
                  <button
                    key={col.id}
                    onClick={() => onToggleColumn(col.id)}
                    className={`p-2.5 rounded-xl border text-xs font-semibold flex items-center justify-between transition-all ${
                      col.visible
                        ? 'bg-[#C8102E]/20 border-[#C8102E]/60 text-[#C8102E] font-bold'
                        : isDark
                        ? 'bg-[#0F172A] border-[#334155] text-slate-500 opacity-60'
                        : 'bg-slate-50 border-slate-200 text-slate-400 opacity-60'
                    }`}
                  >
                    <span className="truncate">{col.label}</span>
                    {col.visible ? (
                      <Eye className="w-4 h-4 text-[#C8102E]" />
                    ) : (
                      <EyeOff className="w-4 h-4 text-slate-400" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: Calculated Columns */}
          {activeTab === 'calculated' && (
            <div className="space-y-4 fade-in">
              <div className="flex items-center justify-between">
                <span className={`text-xs font-extrabold uppercase tracking-wider ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                  Custom Calculated Columns
                </span>
                <button className="px-3 py-1.5 bg-[#C8102E] text-white text-xs font-bold rounded-xl flex items-center gap-1">
                  <Plus className="w-3.5 h-3.5" /> Add Formula Column
                </button>
              </div>
              <div className="space-y-2">
                {calculatedCols.map((col) => (
                  <div
                    key={col.id}
                    className={`p-3 border rounded-xl flex items-center justify-between ${
                      isDark ? 'bg-[#0F172A] border-[#334155]' : 'bg-slate-50 border-slate-200'
                    }`}
                  >
                    <div>
                      <div className={`text-xs font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>{col.label}</div>
                      <div className={`text-[11px] font-mono ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                        Formula: <code className="bg-slate-800 px-1 py-0.5 rounded text-emerald-400">{col.expression}</code>
                      </div>
                    </div>
                    <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-md bg-emerald-950/80 text-emerald-400 border border-emerald-800/60">
                      ACTIVE
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: Column Rules */}
          {activeTab === 'rules' && (
            <div className="space-y-4 fade-in">
              <div className="flex items-center justify-between">
                <span className={`text-xs font-extrabold uppercase tracking-wider ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                  Dynamic Column Rules & Highlights
                </span>
                <button className="px-3 py-1.5 bg-[#C8102E] text-white text-xs font-bold rounded-xl flex items-center gap-1">
                  <Plus className="w-3.5 h-3.5" /> New Rule
                </button>
              </div>
              <div className="space-y-2">
                {columnRules.map((rule) => (
                  <div
                    key={rule.id}
                    className={`p-3 border rounded-xl flex items-center justify-between ${
                      isDark ? 'bg-[#0F172A] border-[#334155]' : 'bg-slate-50 border-slate-200'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span
                        className="w-4 h-4 rounded border border-slate-600"
                        style={{ backgroundColor: rule.highlightColor }}
                      />
                      <span className={`text-xs font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                        Column <code className="font-mono text-slate-400">[{rule.columnId}]</code>{' '}
                        {rule.condition} "{rule.value}"
                      </span>
                    </div>
                    <button className="p-1 text-slate-400 hover:text-red-400">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: Filter Presets */}
          {activeTab === 'presets' && (
            <div className="space-y-6 fade-in">
              <div
                className={`p-4 border rounded-xl space-y-3 ${
                  isDark ? 'bg-[#0F172A] border-[#334155]' : 'bg-slate-50 border-slate-200'
                }`}
              >
                <div className={`text-xs font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>Save Active Filter State</div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Enter preset name (e.g. Morning LHR Flights)..."
                    value={newPresetName}
                    onChange={(e) => setNewPresetName(e.target.value)}
                    className={`flex-1 px-3 py-2 border rounded-xl text-xs font-semibold outline-none focus:border-[#C8102E] ${
                      isDark ? 'bg-[#1E293B] border-[#334155] text-white' : 'bg-white border-slate-300 text-slate-900'
                    }`}
                  />
                  <button
                    onClick={handleSavePreset}
                    className="px-4 py-2 bg-[#C8102E] text-white text-xs font-extrabold rounded-xl flex items-center gap-1.5 hover:bg-red-700 transition-colors"
                  >
                    <Save className="w-3.5 h-3.5" /> Save Preset
                  </button>
                </div>
              </div>

              <div className="space-y-3">
                <span className={`text-xs font-extrabold uppercase tracking-wider ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                  Saved Filter Presets ({savedFilters.length})
                </span>
                <div className="space-y-2">
                  {savedFilters.map((preset) => (
                    <div
                      key={preset.id}
                      className={`p-3.5 border rounded-xl shadow-xs flex items-center justify-between gap-3 ${
                        isDark ? 'bg-[#0F172A] border-[#334155]' : 'bg-slate-50 border-slate-200'
                      }`}
                    >
                      <div className="flex-1 overflow-hidden">
                        {editingPresetId === preset.id ? (
                          <div className="flex items-center gap-2">
                            <input
                              type="text"
                              value={renameInput}
                              onChange={(e) => setRenameInput(e.target.value)}
                              className="px-2 py-1 bg-white border border-slate-400 rounded text-xs font-bold text-slate-900"
                            />
                            <button
                              onClick={() => handleRenamePreset(preset.id)}
                              className="px-2 py-1 bg-emerald-600 text-white rounded text-xs"
                            >
                              OK
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            <span className={`text-xs font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>{preset.name}</span>
                            {preset.isDefault && (
                              <span className="text-[9px] font-extrabold px-1.5 py-0.2 bg-slate-200 text-slate-800 rounded border border-slate-300">
                                DEFAULT
                              </span>
                            )}
                          </div>
                        )}
                      </div>

                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => onLoadSavedFilter(preset)}
                          className="px-3 py-1 bg-emerald-950/80 text-emerald-400 rounded-lg text-xs font-extrabold border border-emerald-800/60 hover:bg-emerald-900/60"
                        >
                          Load Filter
                        </button>
                        <button
                          onClick={() => {
                            setEditingPresetId(preset.id)
                            setRenameInput(preset.name)
                          }}
                          className="p-1.5 text-slate-400 hover:text-slate-700"
                          title="Rename Filter"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleRemovePreset(preset.id)}
                          className="p-1.5 text-slate-400 hover:text-red-500"
                          title="Remove Filter"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div
          className={`p-4 border-t flex justify-end ${
            isDark ? 'bg-[#0F172A] border-[#334155]' : 'bg-slate-50 border-slate-200'
          }`}
        >
          <button
            onClick={onClose}
            className="px-6 py-2 bg-[#C8102E] text-white font-extrabold text-xs rounded-xl shadow-xs hover:bg-red-700 transition-colors"
          >
            Done & Apply
          </button>
        </div>
      </div>
    </div>
  )
}
