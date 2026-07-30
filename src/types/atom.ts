export type FlightStatus =
  | 'Arrived'
  | 'Cancelled'
  | 'Delayed'
  | 'Departed'
  | 'Diversion'
  | 'Landed'
  | 'Next Info'
  | 'Off Block'
  | 'RTR'
  | 'Scheduled'

export type OperationalFlag =
  | 'VIP'
  | 'Extra Fuel'
  | 'Crew Duty'
  | 'Board Announcement'
  | 'No Security Check'
  | 'Take Off'
  | 'Touch Down'
  | 'Reg Changed'
  | 'Dep Gate Changed'
  | 'Dep Delay'
  | 'Lost Approach'
  | 'Manual Boarding Announcement'
  | 'Technical Holding'

export type OperationalIcon =
  | 'Aircraft Restrictions'
  | 'Air Stand Change'
  | 'ATC Status'
  | 'Dep Gate Change'
  | 'Dep Stand Change'
  | 'Disinfected'
  | 'Electricity Active'
  | 'Run'
  | 'Dangerous Goods'
  | 'Special Cargo'
  | 'PD'
  | 'Wheelchair'
  | 'Trim Sheet Read'
  | 'Trim Sheet Unread'
  | 'Stand SMS Required'
  | 'Stretcher'

export type ServiceType = 'J' | 'A' | 'C' | 'F' | 'G' | 'M' | 'P' | 'S' | 'E' | 'H'

export interface ServiceTypeInfo {
  code: ServiceType
  label: string
  description: string
}

export interface OperationalFlagMeta {
  name: OperationalFlag
  label: string
  icon: string
  color: string
  bg: string
  description: string
}

export interface OperationalIconMeta {
  name: OperationalIcon
  label: string
  icon: string
  severity: 'info' | 'warning' | 'critical' | 'completed'
  description: string
}

export type NotePriority = 'HIGH' | 'MEDIUM' | 'ROUTINE'
export type NoteCategory = 'Weather' | 'Crew' | 'Aircraft' | 'Ground' | 'Fuel' | 'ATC'

export interface ShiftNote {
  id: string
  title: string
  content: string
  priority: NotePriority
  category: NoteCategory
  flightNumber?: string
  author: string
  role: string
  timestamp: string
  pinned?: boolean
  isMine?: boolean
}

export interface Flight {
  id: string
  flightNumber: string
  callSign: string
  base: string
  dateType: 'STD' | 'ETD' | 'ATD' | 'STA'
  beginDate: string
  endDate: string
  date: string
  dep: string
  depCity: string
  originTz: string
  arr: string
  arrCity: string
  destTz: string
  std: string
  etd: string
  atd: string | null
  sta: string
  eta: string
  ata: string | null
  tsat?: string
  tobt?: string
  ctot?: string
  gate: string
  stand: string
  terminal: string
  regNo: string
  acOwner: string
  aircraftType: string
  aircraftAge?: string
  speed?: string
  altitude?: string
  status: FlightStatus
  zone: string
  flags: OperationalFlag[]
  icons: OperationalIcon[]
  opCode: string
  serviceType: ServiceType
  traffic: 'International' | 'Domestic' | 'Regional' | 'Transatlantic'
  operationGenre: string
  country: string
  fuel: 'Sufficient' | 'Extra Fuel Uplifted' | 'Fuelling Active' | 'Low Margin' | 'Tankering'
  delayCode: string
  delayMinutes: number
  watchList: boolean
  hubDesk: string
  handlingAgent?: string
  dispatcher?: string
  previousFlight?: string
  nextFlight?: string
  distanceCovered?: string
  distanceRemaining?: string
  timeElapsed?: string
  timeRemaining?: string
  pax: {
    booked: number
    checkedIn: number
    boarded: number
    capacity: number
    transit: number
    vipCount: number
    wheelchairCount: number
  }
  crew: {
    captain: string
    fo: string
    cabinCrewCount: number
    dutyStatus: string
  }
  alerts: {
    msg: string
    level: 'critical' | 'warning' | 'info'
    timestamp: string
  }[]
  weather: {
    origin: { temp: number; condition: string; wind: number }
    dest: { temp: number; condition: string; wind: number }
  }
  updatedAt: number
}

// Complete 21 mandatory filters
export interface FilterState {
  base: string
  dateType: 'STD' | 'ETD' | 'ATD' | 'STA' | 'ALL'
  begin: string
  end: string
  flight: string
  dep: string
  arr: string
  regNo: string
  status: FlightStatus | 'All'
  zone: string
  callSign: string
  flags: OperationalFlag[]
  icons: OperationalIcon[]
  acOwner: string
  opCode: string
  serviceType: string
  traffic: string
  operationGenre: string
  country: string
  fuel: string
  delayCode: string
  quickSearch: string
  watchListOnly: boolean
  assignedDesk: string
}

export type SortField =
  | 'flightNumber'
  | 'callSign'
  | 'dep'
  | 'arr'
  | 'std'
  | 'etd'
  | 'delayMinutes'
  | 'status'
  | 'gate'
  | 'regNo'
  | 'zone'

export interface ColumnDefinition {
  id: string
  label: string
  visible: boolean
  width?: number
  sticky?: boolean
  category: 'core' | 'flight' | 'aircraft' | 'ops' | 'commercial'
}

export interface CalculatedColumn {
  id: string
  label: string
  expression: string
  enabled: boolean
}

export interface ColumnRule {
  id: string
  columnId: string
  condition: 'equals' | 'greaterThan' | 'contains'
  value: string
  highlightColor: string
}

export interface SavedFilter {
  id: string
  name: string
  isDefault?: boolean
  filters: FilterState
}

export interface HubDesk {
  id: string
  name: string
  code: string
  operator: string
  assignedCount: number
}
