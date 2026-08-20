export interface Product {
  id: string;
  name: string;
  category: string;
  shortDescription: string;
  longDescription: string;
  features: string[];
  specs: Record<string, string>;
  image: string; // Gradient color or visual indicator
  photo?: string; // Real photograph cutout path
  datasheetUrl: string;
  manualUrl?: string;
  videoUrl?: string;
  warranty: string;
  inStock: boolean;
  accuracy: string;
}

export interface Category {
  id: string;
  name: string;
  description: string;
  iconName: string;
}

export interface Industry {
  id: string;
  name: string;
  description: string;
  iconName: string;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  company: string;
  rating: number;
  text: string;
  logoText: string;
}

export interface QuoteRequest {
  id: string;
  productName: string;
  customerName: string;
  company: string;
  email: string;
  phone: string;
  quantity: number;
  message: string;
  status: 'Pending' | 'Approved' | 'Contacted';
  createdAt: string;
}

export interface ContactInquiry {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: 'Unread' | 'Read' | 'Resolved';
  createdAt: string;
}

export interface Certificate {
  certificateNo: string;
  modelNo: string;
  serialNo: string;
  customerName: string;
  calibrationDate: string;
  dueDate: string;
  status: 'Valid' | 'Expired';
}

export interface CatalogItem {
  id: string;
  name: string;
  desc: string;
  type: string;
  category: string;
  url: string;
  createdAt?: string;
}


export const categories: Category[] = [
  {
    id: 'temperature',
    name: 'Temperature Calibration',
    description: 'Dry block and liquid bath calibrators offering high thermal stability and precision.',
    iconName: 'Thermometer'
  },
  {
    id: 'pressure',
    name: 'Pressure Calibration',
    description: 'Precision hydraulic and pneumatic hand pumps, comparators, and automated controllers.',
    iconName: 'Gauge'
  },
  {
    id: 'process',
    name: 'Process Calibrators',
    description: 'Multifunction calibrators for measuring and sourcing electrical, loop, and temperature signals.',
    iconName: 'Cpu'
  },
  {
    id: 'logger',
    name: 'Temperature Data Loggers',
    description: 'High-channel data acquisition systems and wireless loggers for industrial environment monitoring.',
    iconName: 'Database'
  },
  {
    id: 'flow',
    name: 'Flow Measurement',
    description: 'Clamp-on ultrasonic flow meters for non-invasive liquid flow rate measurements.',
    iconName: 'Activity'
  }
];

export const products: Product[] = [
  // Temperature Calibration
  {
    id: 'dpi-1000-m',
    name: 'ATM-100 Low Temperature Calibrator',
    category: 'temperature',
    shortDescription: 'Sub-zero dry block calibrator with stability up to ±0.03°C.',
    longDescription: 'The ATM-100 is a premium low-temperature dry block calibrator designed for rapid, stable, and accurate calibration of RTDs, thermocouples, and liquid-in-glass thermometers in laboratory and industrial settings. It features advanced thermoelectric cooling technology for deep sub-zero testing.',
    features: [
      'Sub-zero calibration range: -35°C to 150°C',
      'High stability of ±0.03°C',
      'Multi-hole inserts for calibrating multiple sensors simultaneously',
      'Advanced PID controller with auto-tuning',
      'RS-232 / USB communication interface'
    ],
    specs: {
      'Temperature Range': '-35°C to 150°C',
      'Accuracy': '±0.15°C',
      'Stability': '±0.03°C',
      'Well Depth': '150 mm',
      'Well Diameter': '30 mm',
      'Heating Time': '-35°C to 150°C in 25 mins',
      'Cooling Time': '25°C to -30°C in 30 mins',
      'Weight': '8.5 kg',
      'Power Supply': '230 VAC, 50 Hz'
    },
    image: 'from-blue-600 to-indigo-900',
    photo: '/images/products/dpi-1000-m.png',
    datasheetUrl: '/brochures/DPI-1000-M_datasheet.pdf',
    warranty: '2 Years',
    inStock: true,
    accuracy: 'High Accuracy (±0.15°C)'
  },
  {
    id: 'dpi-1100-m',
    name: 'ATM-600 M Mini Dry Temperature Calibrator',
    category: 'temperature',
    shortDescription: 'Ultra-portable dry block calibrator for field use, up to 350°C.',
    longDescription: 'The ATM-600 M is an ultra-lightweight and compact dry block calibrator engineered specifically for field calibration. Despite its miniature size, it delivers high speed, stability, and ruggedness required for harsh industrial process environments.',
    features: [
      'Field portable design weighing only 3.2 kg',
      'Temperature range: 50°C to 350°C',
      'Fast heating and cooling cycles',
      'Interchangeable multi-hole inserts',
      'Over-temperature safety cutout'
    ],
    specs: {
      'Temperature Range': '50°C to 350°C',
      'Accuracy': '±0.3°C',
      'Stability': '±0.05°C',
      'Well Depth': '110 mm',
      'Well Diameter': '20 mm',
      'Heating Time': '50°C to 350°C in 15 mins',
      'Cooling Time': '350°C to 100°C in 20 mins',
      'Weight': '3.2 kg',
      'Dimensions': '180 x 120 x 220 mm'
    },
    image: 'from-indigo-600 to-purple-900',
    photo: '/images/products/dpi-1100-m.png',
    datasheetUrl: '/brochures/DPI-1100-M_datasheet.pdf',
    warranty: '1 Year',
    inStock: true,
    accuracy: 'Standard Accuracy (±0.3°C)'
  },
  {
    id: 'dpi-1200',
    name: 'ATM-1000 High Temperature Calibrator',
    category: 'temperature',
    shortDescription: 'Ceramic dry block calibrator for extreme heat up to 1200°C.',
    longDescription: 'The ATM-1000 is a high-temperature industrial calibrator that uses a heavy-duty ceramic block structure to provide safe and reliable calibration of high-temperature thermocouples. It is standard equipment for power plants, steel mills, and glass manufacturing processes.',
    features: [
      'Extreme temperature range: 300°C to 1200°C',
      'Dual-zone control for superior uniformity',
      'Rugged ceramic block construction',
      'Internal reference sensor option',
      'Cooling fan and protective safety shield'
    ],
    specs: {
      'Temperature Range': '300°C to 1200°C',
      'Accuracy': '±2.0°C',
      'Stability': '±0.2°C',
      'Well Depth': '160 mm',
      'Well Diameter': '32 mm',
      'Heating Time': 'Ambient to 1200°C in 60 mins',
      'Cooling Time': '1200°C to 300°C in 90 mins (with air)',
      'Weight': '12.0 kg',
      'Safety': 'Overheat alarm & thermal shield'
    },
    image: 'from-orange-600 to-red-950',
    photo: '/images/products/dpi-1200.png',
    datasheetUrl: '/brochures/DPI-1200_datasheet.pdf',
    warranty: '2 Years',
    inStock: false,
    accuracy: 'Industrial High Temp (±2.0°C)'
  },
  {
    id: 'atm-600',
    name: 'ATM-600 Dry Temperature Calibrator',
    category: 'temperature',
    shortDescription: 'Compact dry temperature calibrator operating from 50°C to 600°C.',
    longDescription: 'Dry Temperature Calibrator is a compact and portable calibration instrument designed for the precise calibration of RTDs, thermocouples, and temperature related instruments with high accuracy, excellent stability, and fast temperature response. It is ideal for laboratory, industrial, and field calibration applications.',
    features: [
      'Compact and lightweight design for easy portability',
      'Wide temperature range for precise calibration (50°C to 600°C)',
      'High stability and excellent temperature uniformity',
      'High accuracy with fast heating performance',
      'Suitable for RTDs, thermocouples, and temperature related instruments'
    ],
    specs: {
      'Temperature Range': '50°C to 600°C',
      'Material': 'Brass',
      'Heating Block Dimension': '40 × 40 × 130 mm',
      'Number of Heaters': '2 × 300 W',
      'Bore Diameter Depth': '25 mm × 120 mm',
      'Controller Type': 'PID Controller',
      'Display Range': '0 to 605 °C',
      'Resolution': '0.1 °C',
      'Stability': '0.2 °C',
      'Uniformity': '< 0.08 °C',
      'Standard Insert': 'Ø24.5 × 120 mm, 6 holes',
      'Insert Hole Depth': '117 mm'
    },
    image: 'from-amber-500 to-yellow-800',
    photo: '/images/products/dpi-1100-m.png',
    datasheetUrl: '/brochures/ATM-600_datasheet.pdf',
    warranty: '1 Year',
    inStock: true,
    accuracy: 'Stability (±0.2°C)'
  },

  // Pressure Calibration
  {
    id: 'dpi-2100',
    name: '1000-T Table Top Pressure Comparator',
    category: 'pressure',
    shortDescription: 'Laboratory table-top comparator for calibrating gauges up to 700 bar.',
    longDescription: 'The 1000-T is a high-quality table-top pressure comparator engineered for clean laboratory calibration of pressure transmitters, digital gauges, and switches. Equipped with dual ports and a fine adjustment volume controller, it enables exact pressure generation.',
    features: [
      'Pressure range: 0 to 700 bar (Hydraulic/Oil or Water)',
      'Fine adjustment vernier for micro-tuning pressure',
      'Quick-fit connection ports (no tools required)',
      'Heavy-duty steel baseplate for bench stability',
      'Built-in priming pump for quick air purging'
    ],
    specs: {
      'Pressure Range': '0 to 700 bar (10,000 psi)',
      'Media': 'Distilled water or Sebacate oil',
      'Fine Adjustment': '0.1 mbar sensitivity',
      'Connections': '2x 1/4" BSP Female (Quick-fit)',
      'Base Dimensions': '350 x 280 x 180 mm',
      'Weight': '6.4 kg',
      'Materials': 'Stainless Steel / Aluminum'
    },
    image: 'from-cyan-600 to-blue-900',
    photo: '/images/products/dpi-2100.png',
    datasheetUrl: '/brochures/DPI-2100_datasheet.pdf',
    warranty: '2 Years',
    inStock: true,
    accuracy: 'Gauge Comparison'
  },
  {
    id: 'dpi-2200-a',
    name: 'ATM-30 H Hand Operated Pressure Cum Vacuum Pump',
    category: 'pressure',
    shortDescription: 'Pneumatic hand pump generating vacuum up to 40 bar pressure.',
    longDescription: 'The ATM-30 H is a dual-function pneumatic hand pump capable of generating both vacuum and positive pressure. Ergonomically designed, it is the ideal tool for testing transmitters, dials, and pressure switches in the field.',
    features: [
      'Pneumatic range: -0.95 bar (vacuum) to 40 bar pressure',
      'Dual-switch valve for switching between pressure and vacuum',
      'Fine trim adjustment valve',
      'Ergonomic hand grips to minimize hand fatigue',
      'Overpressure protection valve adjustment'
    ],
    specs: {
      'Pressure Range': '-0.95 bar to 40 bar (-28 inHg to 600 psi)',
      'Media': 'Air',
      'Adjustment': 'Fine vernier volume control',
      'Connection': '1/4" BSP Female / Quick-connect hose',
      'Weight': '1.1 kg',
      'Dimensions': '240 x 140 x 80 mm'
    },
    image: 'from-teal-600 to-emerald-900',
    photo: '/images/products/dpi-2200-a.png',
    datasheetUrl: '/brochures/DPI-2200-A_datasheet.pdf',
    warranty: '1 Year',
    inStock: true,
    accuracy: 'Pneumatic Field Cal'
  },
  {
    id: 'dpi-2300',
    name: 'ATM-1000 H High Pressure Hand Pump',
    category: 'pressure',
    shortDescription: 'Hydraulic high-pressure hand pump generating up to 1000 bar.',
    longDescription: 'The ATM-1000 H is a high-pressure scissor-action hydraulic hand pump engineered to generate pressures up to 1000 bar. Using oil or distilled water, it is ideal for high-pressure safety valves and heavy manufacturing transmitters.',
    features: [
      'Generates pressure up to 1000 bar (15,000 psi)',
      'Scissor-action leverage requires minimal force',
      'High-capacity reservoir holds up to 200 ml of fluid',
      'Integrated pressure release valve',
      'Dual output ports'
    ],
    specs: {
      'Pressure Range': '0 to 1000 bar (15,000 psi)',
      'Media': 'Oil or Distilled Water',
      'Reservoir Capacity': '200 ml',
      'Connections': '2x 1/4" BSP Female / High-pressure hose',
      'Weight': '1.6 kg',
      'Material': 'Stainless steel & anodized aluminum'
    },
    image: 'from-emerald-700 to-sky-950',
    photo: '/images/products/dpi-2300.png',
    datasheetUrl: '/brochures/DPI-2300_datasheet.pdf',
    warranty: '2 Years',
    inStock: true,
    accuracy: 'High Pressure Lab/Field'
  },

  // Process Calibrators
  {
    id: 'atom-14-plus',
    name: 'ATOMAKK 14+ Universal Thermocouple Calibrator',
    category: 'process',
    shortDescription: 'Dedicated calibrator for multi-type Thermocouples and RTDs.',
    longDescription: 'The ATOMAKK 14+ is a micro-processor controlled handheld process calibrator designed to source and measure various thermocouples (J, K, T, E, R, S, B, N) and RTD sensors. It is highly valued for commissioning heating controls.',
    features: [
      'Sources and measures 8 thermocouple types and RTDs',
      'Simultaneous output and input readings on split screen',
      'Cold junction compensation automatic or manual',
      'Built-in 24V loop power supply',
      'Large backlit LCD display with simple layout'
    ],
    specs: {
      'TC Types Supported': 'J, K, T, E, R, S, B, N',
      'RTD Support': 'Pt100, Pt500, Pt1000, Cu50, Cu100',
      'Source/Measure Range': 'TC: -200°C to 1800°C; mA: 0 to 24mA; V: 0 to 10V',
      'Accuracy': '±0.05% of reading',
      'Loop Power': '24 VDC ±10%',
      'Battery Life': '15 hours continuous',
      'Dimensions': '190 x 95 x 45 mm',
      'Weight': '450 g'
    },
    image: 'from-orange-500 to-amber-900',
    photo: '/images/products/atom-14-plus.png',
    datasheetUrl: '/brochures/ATOM-14-Plus_datasheet.pdf',
    warranty: '1 Year',
    inStock: true,
    accuracy: 'High Accuracy (±0.05% RDG)'
  },
  {
    id: 'atom-25',
    name: 'ATOMAKK 25 Universal Calibrator',
    category: 'process',
    shortDescription: 'Advanced process calibrator sourcing mA, V, Frequency and resistance.',
    longDescription: 'The ATOMAKK 25 is a multi-parameter calibration powerhouse. Able to simulate and record current, voltage, frequency, RTD resistance, and thermocouples, it serves as the ultimate troubleshooting tool for instrumentation engineers.',
    features: [
      'Simultaneous source and measure of mA, V, RTD, TC, Ohms, and Frequency',
      'Step and ramp functions with automated cycles',
      'HART loop resistor built-in (250 ohm)',
      'Stores up to 50 calibration records locally',
      'Rugged yellow drop-resistant bumper'
    ],
    specs: {
      'DC Voltage Range': '0 to 30 V (Measure), 0 to 15 V (Source)',
      'DC Current Range': '0 to 24 mA (Measure & Source)',
      'Resistance Range': '0 to 4000 Ω',
      'Frequency Range': '1 Hz to 10 kHz',
      'Accuracy': '±0.02% of reading',
      'Interface': 'USB for PC data upload',
      'Bumper Material': 'Drop-resistant ABS and silicone'
    },
    image: 'from-yellow-500 to-amber-800',
    photo: '/images/products/atom-25.png',
    datasheetUrl: '/brochures/ATOM-25_datasheet.pdf',
    warranty: '2 Years',
    inStock: true,
    accuracy: 'Superior Accuracy (±0.02% RDG)'
  },
  {
    id: 'cal-4000',
    name: 'CAL 4000 Multiproduct Calibrator',
    category: 'process',
    shortDescription: 'Advanced multiproduct calibrator for electrical, temperature and pressure signals.',
    longDescription: 'The CAL 4000 is ATOMAKK India\'s flagship multiproduct process calibrator. Boasting an ultra-high accuracy of ±0.01% of reading, a vibrant color touch-screen interface, and extensive automated calibration scheduling, it sets a new benchmark in process calibration.',
    features: [
      'Ultra-high accuracy of ±0.01% of reading',
      'Vibrant 4.3" high-resolution color touchscreen',
      'Direct pressure sensor module connection interface',
      'Automated pass/fail analysis and certificate generation data',
      'Massive internal storage for up to 10,000 calibrations'
    ],
    specs: {
      'Accuracy Class': '0.01%',
      'Display': '4.3-inch Color TFT Capacitive Touch',
      'Signals': 'mA, V, mV, Ohms, Frequency, Pulse, RTD, TC, Pressure',
      'Pressure Modules': 'Supports external modules (up to 1000 bar)',
      'Memory': '8 GB Internal Flash',
      'Ports': 'LAN, USB, Wi-Fi connectivity',
      'Certification': 'ISO 17025 accredited certificate included'
    },
    image: 'from-orange-600 to-red-900',
    photo: '/images/products/cal-4000.png',
    datasheetUrl: '/brochures/CAL-4000_datasheet.pdf',
    warranty: '3 Years',
    inStock: true,
    accuracy: 'Laboratory Standard (±0.01%)'
  },
  {
    id: '50-turns-current-coil',
    name: '50 Turns, 20 A/1000 A Current Coil',
    category: 'process',
    shortDescription: 'Precision Current Transformer (CT) testing fixture for clamp meter calibration.',
    longDescription: 'The Current Transformer (CT) Testing Fixture is a precision calibration and testing solution designed for evaluating clamp meters, current transformers, and current sensing devices. It provides stable and accurate current simulation for reliable performance verification, making it ideal for laboratories, calibration facilities, educational institutions, and industrial maintenance applications.',
    features: [
      'High-accuracy current simulation',
      'Suitable for AC/DC calibration',
      'Rugged portable design',
      'Ideal for laboratory and field testing'
    ],
    specs: {
      'Product Type': 'Current Transformer (CT) Test Fixture',
      'Application': 'Clamp Meter Calibration',
      'Current Type': 'AC / DC',
      'Input Current': 'Up to 20 A',
      'Coil Type': 'Precision Multi-Turn Test Coil',
      'Input Terminal': 'Safety Banana Socket',
      'Enclosure': 'Portable Heavy-Duty Carry Case',
      'Calibration Certificate': 'NABL Calibration Certificate Included'
    },
    image: 'from-blue-600 to-indigo-950',
    photo: '/images/products/50-turns-current-coil.png',
    datasheetUrl: '/brochures/50-turns-current-coil_datasheet.pdf',
    warranty: '1 Year',
    inStock: true,
    accuracy: '50 Turns, 20 A/1000 A'
  },

  // Temperature Data Loggers
  {
    id: 'dl-20xx',
    name: 'DL-20XX Multi-Channel Temperature Data Logger',
    category: 'logger',
    shortDescription: '8-channel standard temperature data logger with LCD screen.',
    longDescription: 'The DL-20XX Multi-Channel Temperature Data Logger is a multi-channel digital data logger engineered for recording thermal profiles in autoclaves, warehouses, ovens, and cold-storage areas. It supports multiple sensor inputs and exports directly to CSV.',
    features: [
      '8 independent universal sensor input channels',
      'Supports Pt100 and J, K, T, E thermocouple inputs',
      'Large monochrome LCD display with real-time graph view',
      'High internal memory storing up to 100,000 logs',
      'Free Windows configuration and analysis software'
    ],
    specs: {
      'Channels': '8 channels (universal input)',
      'Sampling Rate': '1 second to 24 hours selectable',
      'Sensor Types': 'RTD (Pt100/Pt1000) and TC (K, J, T, E)',
      'Memory Capacity': '100,000 readings per channel',
      'PC Connection': 'USB 2.0 interface',
      'Power Source': '4x AA Alkaline batteries or 5V USB wall adapter',
      'Battery Life': 'Up to 30 days continuous log (1-min interval)'
    },
    image: 'from-violet-600 to-purple-950',
    photo: '/images/products/dl-20xx.png',
    datasheetUrl: '/brochures/DL-20XX_datasheet.pdf',
    warranty: '1 Year',
    inStock: true,
    accuracy: 'Logger Std (±0.5°C)'
  },

  {
    id: 'dl-20xx-r',
    name: 'DL-30XX Series Wireless Data Logger',
    category: 'logger',
    shortDescription: 'Wireless temperature logger with telemetry and cloud upload.',
    longDescription: 'The DL-30XX is a wireless data logger designed for remote telemetry applications. Communicating over LoRa or Wi-Fi, it pushes real-time temperatures to central dashboards, eliminating manual wire routing.',
    features: [
      'Wireless connectivity: Wi-Fi or LoRaWAN long range telemetry',
      'Battery-powered operation with ultra-low consumption',
      'Integrated cloud dashboard subscription available',
      'SMS / Email notifications for sensor threshold violations',
      'Waterproof IP65 enclosure for outdoor placement'
    ],
    specs: {
      'Wireless Range': 'Up to 500m (Wi-Fi), 5km (LoRa line-of-sight)',
      'Channels': '4 input channels',
      'Enclosure': 'IP65 Dust & Splash Waterproof',
      'Battery Life': 'Up to 1.5 Years (10-min transmission interval)',
      'Protocols': 'MQTT, HTTP, Modbus TCP',
      'Internal buffer': '10,000 offline backup readings'
    },
    image: 'from-fuchsia-700 to-indigo-950',
    photo: '/images/products/dl-20xx-r.png',
    datasheetUrl: '/brochures/DL-20XX-R_datasheet.pdf',
    warranty: '2 Years',
    inStock: true,
    accuracy: 'Wireless Telemetry (±0.3°C)'
  },
  {
    id: 'dl-40xx',
    name: 'DL-40XX Multi-Channel Temperature Data Logger',
    category: 'logger',
    shortDescription: 'High-channel count data logger supporting up to 32 sensors.',
    longDescription: 'The DL-40XX is a heavy-duty rackmount or tabletop data logger supporting up to 32 analog channels. Designed for large-scale heat treatment profiling and engine test bench logging.',
    features: [
      'Up to 32 differential analog inputs',
      'Universal configuration (TC, RTD, voltage, mA)',
      'Ethernet RJ45 port for industrial automation SCADA integration',
      'Web server interface built-in for browser-based reading',
      'Direct Modbus RTU / TCP communications'
    ],
    specs: {
      'Channels': '16, 24, or 32 analog channels configurations',
      'Scan Time': 'All channels scanned within 500ms',
      'Interface': 'Ethernet (RJ45), RS-485 Modbus, USB',
      'Display': '5" TFT widescreen numeric and channel status display',
      'Mounting': '19-inch Rackmount standard or desktop casing',
      'Accuracy': '±0.05% of range'
    },
    image: 'from-violet-800 to-indigo-900',
    photo: '/images/products/dl-40xx.png',
    datasheetUrl: '/brochures/DL-40XX_datasheet.pdf',
    warranty: '2 Years',
    inStock: false,
    accuracy: 'High Channel (±0.05% FS)'
  },

  // Flow Measurement
  {
    id: 'ultrasonic-flow-meter',
    name: 'Handheld Ultrasonic Flow Meter',
    category: 'flow',
    shortDescription: 'Non-invasive transit-time clamp-on flow meter for pipes.',
    longDescription: 'The Handheld Ultrasonic Flow Meter utilizes transit-time ultrasonic technology to measure liquid flow rates through pipes non-invasively. Simply clamp the external transducers onto the pipe; no cutting or shutdown is required.',
    features: [
      'Non-invasive clamp-on transducers - no process shutdown',
      'Wide pipe diameter range: DN15mm to DN6000mm',
      'High accuracy of ±1% of velocity rate',
      'Built-in data logger for up to 2,000 measurements',
      'Comes in a ruggedized carrying case with ultrasonic gel'
    ],
    specs: {
      'Flow Velocity Range': '±0.01 to ±32 m/s',
      'Pipe Sizes': 'DN15 to DN6000 mm (options dependent)',
      'Accuracy': '±1% of reading (>0.2 m/s)',
      'Fluid Types': 'Water, chemicals, oils, and other acoustic-permeable liquids',
      'Battery': 'Rechargeable Ni-MH battery (12 hours battery life)',
      'Enclosure': 'IP67 dust-proof/waterproof handset',
      'Transducer Temp': 'Standard: -30°C to 90°C; High-temp option up to 160°C'
    },
    image: 'from-blue-500 to-teal-850',
    photo: '/images/products/ultrasonic-flow-meter.png',
    datasheetUrl: '/brochures/Ultrasonic-Flow-Meter_datasheet.pdf',
    warranty: '1 Year',
    inStock: true,
    accuracy: 'Flow Precision (±1.0%)'
  }
];

export const industries: Industry[] = [
  { id: 'pharma', name: 'Pharmaceutical', description: 'Assuring strict FDA and WHO compliance with autoclaves, deep-freezers, and cleanroom calibration standards.', iconName: 'Pill' },
  { id: 'oil-gas', name: 'Oil & Gas', description: 'ATEX-certified pressure pumps and temperature blocks engineered for safety and reliability in hazardous areas.', iconName: 'Flame' },
  { id: 'power', name: 'Power Plants', description: 'Robust, heavy-duty dry block systems for calibrating ultra-high temperature boilers and turbine sensors.', iconName: 'Zap' },
  { id: 'cement', name: 'Cement', description: 'Thermal profiling and high-temperature calibration kits designed to withstand abrasive, dusty kiln environments.', iconName: 'Building' },
  { id: 'automotive', name: 'Automotive', description: 'High-speed, multi-channel data logging setups for engine test beds and vehicle climate testing.', iconName: 'Car' },
  { id: 'chemical', name: 'Chemical', description: 'Corrosion-resistant pressure sensors and temperature calibrators ensuring continuous chemical process safety.', iconName: 'FlaskConical' },
  { id: 'food', name: 'Food Processing', description: 'HACCP-compliant temperature probes and logging solutions providing sterile production tracking.', iconName: 'Apple' },
  { id: 'labs', name: 'Laboratories', description: 'Metrology-grade reference calibrators offering ultra-low uncertainties and traceability to national standards.', iconName: 'Beaker' },
  { id: 'hvac', name: 'HVAC', description: 'Handy flow meters and logger kits for measuring building energy efficiency and air distribution loops.', iconName: 'Wind' },
  { id: 'water', name: 'Water Treatment', description: 'Clamp-on flow measurement tools for checking flow rates in steel and concrete pipes without disrupting supply.', iconName: 'Droplet' }
];

export const testimonials: Testimonial[] = [
  {
    id: '1',
    name: 'Dr. Ramesh Mehta',
    role: 'Head of Quality Assurance',
    company: 'Apex Bio-Pharma Ltd.',
    rating: 5,
    text: 'ATOMAKK India\'s ATM-100 sub-zero dry block calibrator revolutionized our vaccine warehouse validation. The calibration stability of ±0.03°C is phenomenal, and it has easily met all FDA audit inspections.',
    logoText: 'APEX'
  },
  {
    id: '2',
    name: 'Vikram Singh',
    role: 'Lead Instrumentation Engineer',
    company: 'Western Power Grid Corporation',
    rating: 5,
    text: 'The CAL 4000 multiproduct calibrator is a masterpiece. Sourcing mA while simultaneously reading thermocouple values on the touch-screen saves us hours during start-up testing. The build quality is exceptional.',
    logoText: 'WEST-GRID'
  },
  {
    id: '3',
    name: 'Siddharth Roy',
    role: 'Operations Director',
    company: 'Indo-Chemicals Processing',
    rating: 4,
    text: 'We bought the Handheld Ultrasonic Flow Meter for water loop audits. Not having to cut into pipes and halt production has saved us lakhs of rupees. Truly a Made-in-India solution that is on par with global brands.',
    logoText: 'ICP'
  }
];

export const initialQuoteRequests: QuoteRequest[] = [
  {
    id: 'q-101',
    productName: 'CAL 4000 Multiproduct Calibrator',
    customerName: 'Anil Deshmukh',
    company: 'Tata Heavy Industries',
    email: 'a.deshmukh@tataheavy.com',
    phone: '+91 98220 12345',
    quantity: 2,
    message: 'Please send us a quote including calibration certificate and delivery to our factory.',
    status: 'Pending',
    createdAt: '2026-07-08T09:30:00Z'
  },
  {
    id: 'q-102',
    productName: 'ATM-100 Low Temperature Calibrator',
    customerName: 'Priya Sharma',
    company: 'Sun Research Labs',
    email: 'priya.sharma@sunlabs.org',
    phone: '+91 99123 45678',
    quantity: 1,
    message: 'Need urgent shipment for NABL laboratory inspection.',
    status: 'Contacted',
    createdAt: '2026-07-09T04:15:00Z'
  }
];

export const initialContactInquiries: ContactInquiry[] = [
  {
    id: 'c-201',
    name: 'Rajesh K.',
    email: 'rajesh.k@rediffmail.com',
    subject: 'Dealership Query',
    message: 'We are distributors of process instruments in Gujarat and would like to register as an authorized dealer for ATOMAKK India.',
    status: 'Unread',
    createdAt: '2026-07-08T14:22:00Z'
  }
];

export const mockCertificates: Certificate[] = [
  {
    certificateNo: 'AI-2026-9041',
    modelNo: 'ATM-100',
    serialNo: 'SN-1000-2490',
    customerName: 'Apex Bio-Pharma Ltd.',
    calibrationDate: '2026-04-15',
    dueDate: '2027-04-14',
    status: 'Valid'
  },
  {
    certificateNo: 'AI-2026-8812',
    modelNo: 'CAL 4000',
    serialNo: 'SN-30G-7741',
    customerName: 'Western Power Grid Corporation',
    calibrationDate: '2026-02-10',
    dueDate: '2027-02-09',
    status: 'Valid'
  },
  {
    certificateNo: 'AI-2025-1049',
    modelNo: 'ATOMAKK-25',
    serialNo: 'SN-25-1102',
    customerName: 'Indo-Chemicals Processing',
    calibrationDate: '2025-06-01',
    dueDate: '2026-06-01',
    status: 'Expired'
  }
];

export const initialCatalogItems: CatalogItem[] = [
  {
    id: 'atom-complete-catalogue',
    name: 'ATOMAKK Instruments Complete Product Catalogue 2026',
    desc: 'Master product catalogue featuring temperature block calibrators, pressure pumps, data acquisition loggers, and ultrasonic flow meters.',
    type: 'PDF Corporate Catalogue (8.6 MB)',
    category: 'corporate',
    url: '/brochures/CAL-4000_datasheet.pdf',
    createdAt: '2026-08-06T10:00:00Z'
  }
];

