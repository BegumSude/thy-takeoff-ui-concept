export type FlightStatus =
  | 'Scheduled'
  | 'Off Block'
  | 'Departed'
  | 'Landed'
  | 'Arrived'
  | 'Delayed'
  | 'Next Info'
  | 'RTR'
  | 'Diversion'
  | 'Cancelled'

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

export interface PaxBreakdown {
  booked: number
  checkedIn: number
  boarded: number
  transit: number
  capacity: number
  firstClass: number
  businessClass: number
  economyClass: number
  infants: number
  specialAssistance: number
}

export interface WeatherContext {
  tempC: number
  condition: string
  windKt: string
  visibilityKm: number
  qnh: number
  status: 'CAVOK' | 'MARGINAL' | 'IAP' | 'TSRA'
}

export interface TurnaroundMetrics {
  fuelingProgressPct: number
  boardingProgressPct: number
  cateringProgressPct: number
  cleaningProgressPct: number
  baggageLoadedPct: number
  turnaroundElapsedMin: number
  turnaroundTotalMin: number
}

export interface FlightAlert {
  id: string
  timestamp: string
  level: 'critical' | 'warning' | 'info'
  msg: string
  category: 'ATC' | 'TECHNICAL' | 'WEATHER' | 'CREW' | 'PAX'
}

export interface Flight {
  id: string
  flightNumber: string
  callSign: string
  dep: string
  depCity: string
  originTz: string
  arr: string
  arrCity: string
  destTz: string
  base: 'IST' | 'SAW' | 'ESB' | 'AYT'
  std: string
  etd: string
  atd: string | null
  sta: string
  eta: string
  ata: string | null
  tsat: string
  tobt: string
  ctot: string
  status: FlightStatus
  gate: string
  stand: string
  terminal: string
  zone: string
  regNo: string
  aircraftType: string
  acOwner: string
  aircraftAge: string
  serviceType: string
  opCode: string
  traffic: string
  operationGenre: string
  country: string
  fuel: string
  delayCode: string
  delayMinutes: number
  flags: OperationalFlag[]
  icons: OperationalIcon[]
  pax: PaxBreakdown
  turnaround: TurnaroundMetrics
  weatherDep: WeatherContext
  weatherArr: WeatherContext
  crew: {
    captain: string
    fo: string
    cabinCrewCount: number
    dutyStatus: string
  }
  handlingAgent: string
  dispatcher: string
  hubDesk: string
  previousFlight: string
  nextFlight: string
  distanceCovered: string
  distanceRemaining: string
  timeElapsed: string
  timeRemaining: string
  speed: string
  altitude: string
  watchList: boolean
  updatedAt: number
  alerts: FlightAlert[]
}

export interface FilterState {
  base: string
  dateType: 'STD' | 'ETD' | 'STA'
  begin: string
  end: string
  flight: string
  dep: string
  arr: string
  regNo: string
  status: string
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
  presetFilter: string
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
  | 'turnaround'

export interface ColumnDefinition {
  id: string
  label: string
  visible: boolean
  widthPx: number
  sticky?: boolean
}

export interface SavedFilter {
  id: string
  name: string
  filters: FilterState
  isDefault?: boolean
}
