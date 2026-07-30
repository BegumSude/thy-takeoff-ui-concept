import { Flight, ColumnDefinition, SavedFilter } from '../types/takeoff'

const CITIES: Record<string, { city: string; tz: string; country: string }> = {
  LHR: { city: 'London Heathrow', tz: 'BST (UTC +01:00)', country: 'United Kingdom' },
  JFK: { city: 'New York JFK', tz: 'EDT (UTC -04:00)', country: 'United States' },
  CDG: { city: 'Paris Charles de Gaulle', tz: 'CEST (UTC +02:00)', country: 'France' },
  FRA: { city: 'Frankfurt Main', tz: 'CEST (UTC +02:00)', country: 'Germany' },
  MAD: { city: 'Madrid Barajas', tz: 'CEST (UTC +02:00)', country: 'Spain' },
  DXB: { city: 'Dubai International', tz: 'GST (UTC +04:00)', country: 'United Arab Emirates' },
  AMS: { city: 'Amsterdam Schiphol', tz: 'CEST (UTC +02:00)', country: 'Netherlands' },
  HND: { city: 'Tokyo Haneda', tz: 'JST (UTC +09:00)', country: 'Japan' },
  ESB: { city: 'Ankara Esenboğa', tz: 'TRT (UTC +03:00)', country: 'Turkey' },
  AYT: { city: 'Antalya', tz: 'TRT (UTC +03:00)', country: 'Turkey' },
  ADB: { city: 'Izmir Adnan Menderes', tz: 'TRT (UTC +03:00)', country: 'Turkey' },
  FCO: { city: 'Rome Fiumicino', tz: 'CEST (UTC +02:00)', country: 'Italy' },
  ORD: { city: 'Chicago O\'Hare', tz: 'CDT (UTC -05:00)', country: 'United States' },
  LAX: { city: 'Los Angeles', tz: 'PDT (UTC -07:00)', country: 'United States' },
  MIA: { city: 'Miami International', tz: 'EDT (UTC -04:00)', country: 'United States' },
  BER: { city: 'Berlin Brandenburg', tz: 'CEST (UTC +02:00)', country: 'Germany' },
  DOH: { city: 'Doha Hamad', tz: 'AST (UTC +03:00)', country: 'Qatar' },
  VIE: { city: 'Vienna Schwechat', tz: 'CEST (UTC +02:00)', country: 'Austria' },
  ZRH: { city: 'Zurich Kloten', tz: 'CEST (UTC +02:00)', country: 'Switzerland' },
  TZX: { city: 'Trabzon', tz: 'TRT (UTC +03:00)', country: 'Turkey' },
  GZT: { city: 'Gaziantep', tz: 'TRT (UTC +03:00)', country: 'Turkey' },
  BJV: { city: 'Bodrum Milas', tz: 'TRT (UTC +03:00)', country: 'Turkey' },
  DLM: { city: 'Dalaman', tz: 'TRT (UTC +03:00)', country: 'Turkey' },
  SAW: { city: 'Sabiha Gökçen', tz: 'TRT (UTC +03:00)', country: 'Turkey' },
  IST: { city: 'Istanbul Hub', tz: 'TRT (UTC +03:00)', country: 'Turkey' },
}

const AIRCRAFT_TYPES = [
  { type: 'B777-300ER', cap: 349, age: '3.5 Yrs', fuel: '45,000 KG' },
  { type: 'A350-900', cap: 329, age: '1.8 Yrs', fuel: '42,000 KG' },
  { type: 'B787-9', cap: 300, age: '2.4 Yrs', fuel: '38,000 KG' },
  { type: 'A330-300', cap: 289, age: '6.2 Yrs', fuel: '39,500 KG' },
  { type: 'A321neo', cap: 190, age: '2.1 Yrs', fuel: '14,500 KG' },
  { type: 'B737 MAX 8', cap: 169, age: '3.0 Yrs', fuel: '12,800 KG' },
  { type: 'A320-200', cap: 156, age: '9.4 Yrs', fuel: '11,200 KG' },
]

const STATUSES: Array<'Scheduled' | 'Off Block' | 'Departed' | 'Landed' | 'Arrived' | 'Delayed' | 'Cancelled' | 'Diversion'> = [
  'Scheduled',
  'Off Block',
  'Departed',
  'Landed',
  'Arrived',
  'Delayed',
  'Scheduled',
  'Off Block',
  'Departed',
  'Delayed',
]

const DELAY_REASONS = [
  '15 (CTOT ATC Restriction)',
  '41 (Technical Maintenance)',
  '71 (ATC Weather Slot)',
  '89 (Ground Handling Congestion)',
  '32 (Catering Uplift Delay)',
  '55 (Cabin Cleaning)',
  'None',
]

const FLAG_POOL: Array<any> = [
  'VIP',
  'Extra Fuel',
  'Crew Duty',
  'Board Announcement',
  'No Security Check',
  'Reg Changed',
  'Dep Gate Changed',
  'Dep Delay',
  'Technical Holding',
]

const ICON_POOL: Array<any> = [
  'Dangerous Goods',
  'ATC Status',
  'Trim Sheet Read',
  'Electricity Active',
  'Special Cargo',
  'Wheelchair',
  'Air Stand Change',
  'Disinfected',
]

const CREW_NAMES = [
  'Capt. E. Yılmaz / F/O M. Kaya',
  'Capt. H. Şahin / F/O C. Demir',
  'Capt. S. Arslan / F/O B. Öztürk',
  'Capt. O. Bulut / F/O T. Aksoy',
  'Capt. N. Aydoğan / F/O G. Kılıç',
  'Capt. F. Duman / F/O U. Sezer',
  'Capt. M. Erkin / F/O K. Altan',
  'Capt. B. Soylu / F/O A. Güner',
]

// Generator for 110 Realistic Flight Operations
function generateMockFlights(count: number): Flight[] {
  const flights: Flight[] = []
  const bases = ['IST', 'IST', 'IST', 'SAW', 'ESB', 'AYT']
  const destinations = ['LHR', 'JFK', 'CDG', 'FRA', 'MAD', 'DXB', 'AMS', 'HND', 'ESB', 'AYT', 'ADB', 'FCO', 'ORD', 'LAX', 'BER', 'DOH', 'TZX', 'GZT', 'BJV']

  for (let i = 1; i <= count; i++) {
    const flightNumVal = 1000 + i * 7 + (i % 5)
    const flightNumber = i % 12 === 0 ? `VF ${300 + i}` : i % 15 === 0 ? `XQ ${500 + i}` : `TK ${flightNumVal}`
    const callSign = flightNumber.replace(' ', '')
    const base = bases[i % bases.length]
    let arr = destinations[i % destinations.length]
    if (arr === base) arr = 'LHR'

    const destMeta = CITIES[arr] || CITIES['LHR']
    const depMeta = CITIES[base] || CITIES['IST']

    const acInfo = AIRCRAFT_TYPES[i % AIRCRAFT_TYPES.length]
    const status = STATUSES[i % STATUSES.length]
    const isDelayed = status === 'Delayed' || i % 7 === 0
    const delayMin = isDelayed ? 15 + (i * 11) % 95 : 0

    const stdHour = 6 + Math.floor((i * 13) % 17)
    const stdMin = (i * 5) % 60
    const stdStr = `${String(stdHour).padStart(2, '0')}:${String(stdMin).padStart(2, '0')}`

    const totMin = stdHour * 60 + stdMin + delayMin
    const etdHour = Math.floor(totMin / 60) % 24
    const etdMinStr = String(totMin % 60).padStart(2, '0')
    const etdStr = `${String(etdHour).padStart(2, '0')}:${etdMinStr}`

    const arrHour = (stdHour + 2 + (i % 6)) % 24
    const staStr = `${String(arrHour).padStart(2, '0')}:${String(stdMin).padStart(2, '0')}`
    const etaStr = `${String((arrHour + Math.floor(delayMin / 60)) % 24).padStart(2, '0')}:${String((stdMin + (delayMin % 60)) % 60).padStart(2, '0')}`

    const bookedPax = Math.floor(acInfo.cap * (0.75 + (i % 25) * 0.01))
    const checkedIn = Math.min(bookedPax, bookedPax - (i % 4))
    const boarded = status === 'Departed' || status === 'Arrived' || status === 'Landed' ? checkedIn : Math.floor(checkedIn * ((i % 10) * 0.1))

    const regNo = `TC-${['L', 'J', 'V', 'K'][i % 4]}${String.fromCharCode(65 + (i % 26))}${String.fromCharCode(65 + ((i * 3) % 26))}`
    const gatePrefix = ['A', 'B', 'C', 'D', 'E', 'F'][i % 6]
    const gateNum = String(1 + (i % 24)).padStart(2, '0')
    const standNum = String(100 + (i % 300))

    const flags = []
    if (isDelayed) flags.push('Dep Delay')
    if (i % 5 === 0) flags.push('VIP')
    if (i % 9 === 0) flags.push('Extra Fuel')
    if (i % 11 === 0) flags.push('Reg Changed')

    const icons = []
    if (i % 3 === 0) icons.push('Trim Sheet Read')
    if (i % 4 === 0) icons.push('Dangerous Goods')
    if (i % 6 === 0) icons.push('ATC Status')

    flights.push({
      id: `fl-${100 + i}`,
      flightNumber,
      callSign,
      dep: base,
      depCity: depMeta.city,
      originTz: depMeta.tz,
      arr,
      arrCity: destMeta.city,
      destTz: destMeta.tz,
      base,
      std: stdStr,
      etd: etdStr,
      atd: status === 'Departed' || status === 'Landed' || status === 'Arrived' ? etdStr : null,
      sta: staStr,
      eta: etaStr,
      ata: status === 'Arrived' ? etaStr : null,
      tsat: `${String(stdHour).padStart(2, '0')}:${String((stdMin + 2) % 60).padStart(2, '0')}`,
      tobt: `${String(stdHour).padStart(2, '0')}:${String((stdMin - 5 + 60) % 60).padStart(2, '0')}`,
      ctot: `${String(stdHour).padStart(2, '0')}:${String((stdMin + delayMin) % 60).padStart(2, '0')}`,
      status: isDelayed && status === 'Scheduled' ? 'Delayed' : status,
      gate: `${gatePrefix}${gateNum}`,
      stand: standNum,
      terminal: i % 2 === 0 ? 'T1' : 'T2',
      zone: base === 'IST' ? (i % 2 === 0 ? 'Int-East' : 'Int-West') : 'Domestic',
      regNo,
      aircraftType: acInfo.type,
      acOwner: i % 12 === 0 ? 'AJet' : i % 15 === 0 ? 'SunExpress' : 'THY Fleet',
      aircraftAge: acInfo.age,
      serviceType: 'J',
      opCode: flightNumber.split(' ')[0],
      traffic: destMeta.country === 'Turkey' ? 'Scheduled Domestic' : 'Scheduled PAX',
      operationGenre: destMeta.country === 'Turkey' ? 'Domestic' : 'International',
      country: destMeta.country,
      fuel: acInfo.fuel,
      delayCode: isDelayed ? DELAY_REASONS[i % DELAY_REASONS.length] : 'None',
      delayMinutes: isDelayed ? delayMin : 0,
      flags,
      icons,
      pax: {
        booked: bookedPax,
        checkedIn,
        boarded,
        transit: Math.floor(bookedPax * 0.15),
        capacity: acInfo.cap,
        firstClass: 0,
        businessClass: Math.floor(acInfo.cap * 0.1),
        economyClass: Math.floor(acInfo.cap * 0.9),
        infants: i % 3,
        specialAssistance: i % 4,
      },
      turnaround: {
        fuelingProgressPct: Math.min(100, (i * 17) % 100 + 10),
        boardingProgressPct: Math.min(100, (i * 23) % 100),
        cateringProgressPct: Math.min(100, (i * 31) % 100 + 20),
        cleaningProgressPct: Math.min(100, (i * 19) % 100 + 30),
        baggageLoadedPct: Math.min(100, (i * 29) % 100 + 15),
        turnaroundElapsedMin: 35,
        turnaroundTotalMin: 60,
      },
      weatherDep: { tempC: 18 + (i % 6), condition: 'Clear', windKt: '210/12kt', visibilityKm: 10, qnh: 1018, status: 'CAVOK' },
      weatherArr: { tempC: 14 + (i % 12), condition: i % 4 === 0 ? 'Rain' : 'Clear', windKt: '240/16kt', visibilityKm: 8, qnh: 1014, status: i % 4 === 0 ? 'TSRA' : 'CAVOK' },
      crew: { captain: CREW_NAMES[i % CREW_NAMES.length], fo: 'F/O Telemetry', cabinCrewCount: 8, dutyStatus: 'On Duty' },
      handlingAgent: 'TGS Ground Handling',
      dispatcher: `Desk 0${1 + (i % 4)}`,
      hubDesk: `Hub Desk 0${1 + (i % 4)}`,
      previousFlight: `TK ${flightNumVal - 1}`,
      nextFlight: `TK ${flightNumVal + 1}`,
      distanceCovered: '1,420 km',
      distanceRemaining: '980 km',
      timeElapsed: '01:50',
      timeRemaining: '01:15',
      speed: '880 km/h',
      altitude: '11,000 m (FL360)',
      watchList: i % 8 === 0,
      updatedAt: Date.now(),
      alerts: isDelayed
        ? [{ id: `alt-${i}`, timestamp: stdStr, level: 'warning', category: 'ATC', msg: `Delay advisory: ${DELAY_REASONS[i % DELAY_REASONS.length]}` }]
        : [],
    })
  }

  return flights
}

export const INITIAL_TAKEOFF_FLIGHTS: Flight[] = generateMockFlights(120)

export const TAKEOFF_DEFAULT_COLUMNS: ColumnDefinition[] = [
  { id: 'flightNumber', label: 'Flight #', visible: true, widthPx: 140, sticky: true },
  { id: 'callSign', label: 'CallSign', visible: true, widthPx: 100 },
  { id: 'dep', label: 'DEP', visible: true, widthPx: 70 },
  { id: 'arr', label: 'ARR', visible: true, widthPx: 70 },
  { id: 'std', label: 'STD', visible: true, widthPx: 75 },
  { id: 'etd', label: 'ETD', visible: true, widthPx: 75 },
  { id: 'atd', label: 'ATD', visible: true, widthPx: 75 },
  { id: 'delay', label: 'Delay', visible: true, widthPx: 90 },
  { id: 'status', label: 'Status', visible: true, widthPx: 120 },
  { id: 'turnaround', label: 'Turnaround / Boarding %', visible: true, widthPx: 160 },
  { id: 'weather', label: 'Dep/Arr Weather', visible: true, widthPx: 150 },
  { id: 'gateStand', label: 'Gate / Stand', visible: true, widthPx: 115 },
  { id: 'regNo', label: 'RegNo', visible: true, widthPx: 95 },
  { id: 'aircraftType', label: 'Aircraft', visible: true, widthPx: 110 },
  { id: 'acOwner', label: 'Ac Owner', visible: true, widthPx: 100 },
  { id: 'pax', label: 'PAX Load %', visible: true, widthPx: 130 },
  { id: 'flags', label: 'Flags', visible: true, widthPx: 150 },
  { id: 'icons', label: 'Icons', visible: true, widthPx: 140 },
  { id: 'zone', label: 'Zone', visible: true, widthPx: 75 },
  { id: 'opCode', label: 'Op.Code', visible: true, widthPx: 75 },
  { id: 'traffic', label: 'Traffic', visible: true, widthPx: 120 },
  { id: 'fuel', label: 'Fuel', visible: true, widthPx: 110 },
  { id: 'delayCode', label: 'Delay Code', visible: true, widthPx: 140 },
]

export const TAKEOFF_SAVED_PRESETS: SavedFilter[] = [
  {
    id: 'pr-1',
    name: '🔴 Active Delays (>15m)',
    isDefault: true,
    filters: {
      base: 'IST',
      dateType: 'STD',
      begin: '2026-07-28',
      end: '2026-07-28',
      flight: '',
      dep: '',
      arr: '',
      regNo: '',
      status: 'Delayed',
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
      presetFilter: 'delayed',
    },
  },
]
