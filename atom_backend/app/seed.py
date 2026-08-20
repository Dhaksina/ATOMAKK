import asyncio
from datetime import date, datetime

from app.database import init_database, close_database
from app.models.user import User
from app.models.product import Product, Category
from app.models.industry import Industry
from app.models.testimonial import Testimonial
from app.models.quote import QuoteRequest
from app.models.contact import ContactInquiry
from app.models.certificate import Certificate
from app.dependencies import hash_password


CATEGORIES = [
    {"slug": "temperature", "name": "Temperature Calibration", "description": "Dry block and liquid bath calibrators offering high thermal stability and precision.", "iconName": "Thermometer"},
    {"slug": "pressure", "name": "Pressure Calibration", "description": "Precision hydraulic and pneumatic hand pumps, comparators, and automated controllers.", "iconName": "Gauge"},
    {"slug": "process", "name": "Process Calibrators", "description": "Multifunction calibrators for measuring and sourcing electrical, loop, and temperature signals.", "iconName": "Cpu"},
    {"slug": "logger", "name": "Temperature Data Loggers", "description": "High-channel data acquisition systems and wireless loggers for industrial environment monitoring.", "iconName": "Database"},
    {"slug": "flow", "name": "Flow Measurement", "description": "Clamp-on ultrasonic flow meters for non-invasive liquid flow rate measurements.", "iconName": "Activity"},
]

PRODUCTS = [
    {
        "slug": "dpi-1000-m", "name": "DPI-1000-M Low Temperature Calibrator", "category": "temperature",
        "shortDescription": "Sub-zero dry block calibrator with stability up to \u00b10.03\u00b0C.",
        "longDescription": "The DPI-1000-M is a premium low-temperature dry block calibrator designed for rapid, stable, and accurate calibration of RTDs, thermocouples, and liquid-in-glass thermometers in laboratory and industrial settings. It features advanced thermoelectric cooling technology for deep sub-zero testing.",
        "features": ["Sub-zero calibration range: -35\u00b0C to 150\u00b0C", "High stability of \u00b10.03\u00b0C", "Multi-hole inserts for calibrating multiple sensors simultaneously", "Advanced PID controller with auto-tuning", "RS-232 / USB communication interface"],
        "specs": {"Temperature Range": "-35\u00b0C to 150\u00b0C", "Accuracy": "\u00b10.15\u00b0C", "Stability": "\u00b10.03\u00b0C", "Well Depth": "150 mm", "Well Diameter": "30 mm", "Heating Time": "-35\u00b0C to 150\u00b0C in 25 mins", "Cooling Time": "25\u00b0C to -30\u00b0C in 30 mins", "Weight": "8.5 kg", "Power Supply": "230 VAC, 50 Hz"},
        "image": "from-blue-600 to-indigo-900", "photo": "/images/products/dpi-1000-m.png",
        "datasheetUrl": "/brochures/DPI-1000-M_datasheet.pdf", "warranty": "2 Years", "inStock": True, "accuracy": "High Accuracy (\u00b10.15\u00b0C)",
    },
    {
        "slug": "dpi-1100-m", "name": "DPI-1100-M Mini Dry Temperature Calibrator", "category": "temperature",
        "shortDescription": "Ultra-portable dry block calibrator for field use, up to 350\u00b0C.",
        "longDescription": "The DPI-1100-M is an ultra-lightweight and compact dry block calibrator engineered specifically for field calibration. Despite its miniature size, it delivers high speed, stability, and ruggedness required for harsh industrial process environments.",
        "features": ["Field portable design weighing only 3.2 kg", "Temperature range: 50\u00b0C to 350\u00b0C", "Fast heating and cooling cycles", "Interchangeable multi-hole inserts", "Over-temperature safety cutout"],
        "specs": {"Temperature Range": "50\u00b0C to 350\u00b0C", "Accuracy": "\u00b10.3\u00b0C", "Stability": "\u00b10.05\u00b0C", "Well Depth": "110 mm", "Well Diameter": "20 mm", "Heating Time": "50\u00b0C to 350\u00b0C in 15 mins", "Cooling Time": "350\u00b0C to 100\u00b0C in 20 mins", "Weight": "3.2 kg", "Dimensions": "180 x 120 x 220 mm"},
        "image": "from-indigo-600 to-purple-900", "photo": "/images/products/dpi-1100-m.png",
        "datasheetUrl": "/brochures/DPI-1100-M_datasheet.pdf", "warranty": "1 Year", "inStock": True, "accuracy": "Standard Accuracy (\u00b10.3\u00b0C)",
    },
    {
        "slug": "dpi-1200", "name": "DPI-1200 High Temperature Calibrator", "category": "temperature",
        "shortDescription": "Ceramic dry block calibrator for extreme heat up to 1200\u00b0C.",
        "longDescription": "The DPI-1200 is a high-temperature industrial calibrator that uses a heavy-duty ceramic block structure to provide safe and reliable calibration of high-temperature thermocouples. It is standard equipment for power plants, steel mills, and glass manufacturing processes.",
        "features": ["Extreme temperature range: 300\u00b0C to 1200\u00b0C", "Dual-zone control for superior uniformity", "Rugged ceramic block construction", "Internal reference sensor option", "Cooling fan and protective safety shield"],
        "specs": {"Temperature Range": "300\u00b0C to 1200\u00b0C", "Accuracy": "\u00b12.0\u00b0C", "Stability": "\u00b10.2\u00b0C", "Well Depth": "160 mm", "Well Diameter": "32 mm", "Heating Time": "Ambient to 1200\u00b0C in 60 mins", "Cooling Time": "1200\u00b0C to 300\u00b0C in 90 mins (with air)", "Weight": "12.0 kg", "Safety": "Overheat alarm & thermal shield"},
        "image": "from-orange-600 to-red-950", "photo": "/images/products/dpi-1200.png",
        "datasheetUrl": "/brochures/DPI-1200_datasheet.pdf", "warranty": "2 Years", "inStock": False, "accuracy": "Industrial High Temp (\u00b12.0\u00b0C)",
    },
    {
        "slug": "dpi-2100", "name": "DPI-2100 Table Top Pressure Comparator", "category": "pressure",
        "shortDescription": "Laboratory table-top comparator for calibrating gauges up to 700 bar.",
        "longDescription": "The DPI-2100 is a high-quality table-top pressure comparator engineered for clean laboratory calibration of pressure transmitters, digital gauges, and switches. Equipped with dual ports and a fine adjustment volume controller, it enables exact pressure generation.",
        "features": ["Pressure range: 0 to 700 bar (Hydraulic/Oil or Water)", "Fine adjustment vernier for micro-tuning pressure", "Quick-fit connection ports (no tools required)", "Heavy-duty steel baseplate for bench stability", "Built-in priming pump for quick air purging"],
        "specs": {"Pressure Range": "0 to 700 bar (10,000 psi)", "Media": "Distilled water or Sebacate oil", "Fine Adjustment": "0.1 mbar sensitivity", "Connections": "2x 1/4\" BSP Female (Quick-fit)", "Base Dimensions": "350 x 280 x 180 mm", "Weight": "6.4 kg", "Materials": "Stainless Steel / Aluminum"},
        "image": "from-cyan-600 to-blue-900", "photo": "/images/products/dpi-2100.png",
        "datasheetUrl": "/brochures/DPI-2100_datasheet.pdf", "warranty": "2 Years", "inStock": True, "accuracy": "Gauge Comparison",
    },
    {
        "slug": "dpi-2200-a", "name": "DPI-2200-A Hand Operated Pressure Cum Vacuum Pump", "category": "pressure",
        "shortDescription": "Pneumatic hand pump generating vacuum up to 40 bar pressure.",
        "longDescription": "The DPI-2200-A is a dual-function pneumatic hand pump capable of generating both vacuum and positive pressure. Ergonomically designed, it is the ideal tool for testing transmitters, dials, and pressure switches in the field.",
        "features": ["Pneumatic range: -0.95 bar (vacuum) to 40 bar pressure", "Dual-switch valve for switching between pressure and vacuum", "Fine trim adjustment valve", "Ergonomic hand grips to minimize hand fatigue", "Overpressure protection valve adjustment"],
        "specs": {"Pressure Range": "-0.95 bar to 40 bar (-28 inHg to 600 psi)", "Media": "Air", "Adjustment": "Fine vernier volume control", "Connection": "1/4\" BSP Female / Quick-connect hose", "Weight": "1.1 kg", "Dimensions": "240 x 140 x 80 mm"},
        "image": "from-teal-600 to-emerald-900", "photo": "/images/products/dpi-2200-a.png",
        "datasheetUrl": "/brochures/DPI-2200-A_datasheet.pdf", "warranty": "1 Year", "inStock": True, "accuracy": "Pneumatic Field Cal",
    },
    {
        "slug": "dpi-2300", "name": "DPI-2300 High Pressure Hand Pump", "category": "pressure",
        "shortDescription": "Hydraulic high-pressure hand pump generating up to 1000 bar.",
        "longDescription": "The DPI-2300 is a high-pressure scissor-action hydraulic hand pump engineered to generate pressures up to 1000 bar. Using oil or distilled water, it is ideal for high-pressure safety valves and heavy manufacturing transmitters.",
        "features": ["Generates pressure up to 1000 bar (15,000 psi)", "Scissor-action leverage requires minimal force", "High-capacity reservoir holds up to 200 ml of fluid", "Integrated pressure release valve", "Dual output ports"],
        "specs": {"Pressure Range": "0 to 1000 bar (15,000 psi)", "Media": "Oil or Distilled Water", "Reservoir Capacity": "200 ml", "Connections": "2x 1/4\" BSP Female / High-pressure hose", "Weight": "1.6 kg", "Material": "Stainless steel & anodized aluminum"},
        "image": "from-emerald-700 to-sky-950", "photo": "/images/products/dpi-2300.png",
        "datasheetUrl": "/brochures/DPI-2300_datasheet.pdf", "warranty": "2 Years", "inStock": True, "accuracy": "High Pressure Lab/Field",
    },
    {
        "slug": "atom-14-plus", "name": "ATOM 14+ Universal Thermocouple Calibrator", "category": "process",
        "shortDescription": "Dedicated calibrator for multi-type Thermocouples and RTDs.",
        "longDescription": "The ATOM 14+ is a micro-processor controlled handheld process calibrator designed to source and measure various thermocouples (J, K, T, E, R, S, B, N) and RTD sensors. It is highly valued for commissioning heating controls.",
        "features": ["Sources and measures 8 thermocouple types and RTDs", "Simultaneous output and input readings on split screen", "Cold junction compensation automatic or manual", "Built-in 24V loop power supply", "Large backlit LCD display with simple layout"],
        "specs": {"TC Types Supported": "J, K, T, E, R, S, B, N", "RTD Support": "Pt100, Pt500, Pt1000, Cu50, Cu100", "Source/Measure Range": "TC: -200\u00b0C to 1800\u00b0C; mA: 0 to 24mA; V: 0 to 10V", "Accuracy": "\u00b10.05% of reading", "Loop Power": "24 VDC \u00b110%", "Battery Life": "15 hours continuous", "Dimensions": "190 x 95 x 45 mm", "Weight": "450 g"},
        "image": "from-orange-500 to-amber-900", "photo": "/images/products/atom-14-plus.png",
        "datasheetUrl": "/brochures/ATOM-14-Plus_datasheet.pdf", "warranty": "1 Year", "inStock": True, "accuracy": "High Accuracy (\u00b10.05% RDG)",
    },
    {
        "slug": "atom-25", "name": "ATOM 25 Universal Calibrator", "category": "process",
        "shortDescription": "Advanced process calibrator sourcing mA, V, Frequency and resistance.",
        "longDescription": "The ATOM 25 is a multi-parameter calibration powerhouse. Able to simulate and record current, voltage, frequency, RTD resistance, and thermocouples, it serves as the ultimate troubleshooting tool for instrumentation engineers.",
        "features": ["Simultaneous source and measure of mA, V, RTD, TC, Ohms, and Frequency", "Step and ramp functions with automated cycles", "HART loop resistor built-in (250 ohm)", "Stores up to 50 calibration records locally", "Rugged yellow drop-resistant bumper"],
        "specs": {"DC Voltage Range": "0 to 30 V (Measure), 0 to 15 V (Source)", "DC Current Range": "0 to 24 mA (Measure & Source)", "Resistance Range": "0 to 4000 \u03a9", "Frequency Range": "1 Hz to 10 kHz", "Accuracy": "\u00b10.02% of reading", "Interface": "USB for PC data upload", "Bumper Material": "Drop-resistant ABS and silicone"},
        "image": "from-yellow-500 to-amber-800", "photo": "/images/products/atom-25.png",
        "datasheetUrl": "/brochures/ATOM-25_datasheet.pdf", "warranty": "2 Years", "inStock": True, "accuracy": "Superior Accuracy (\u00b10.02% RDG)",
    },
    {
        "slug": "cal-4000", "name": "CAL 4000 Multiproduct Calibrator", "category": "process",
        "shortDescription": "Advanced multiproduct calibrator for electrical, temperature and pressure signals.",
        "longDescription": "The CAL 4000 is ATOM India's flagship multiproduct process calibrator. Boasting an ultra-high accuracy of \u00b10.01% of reading, a vibrant color touch-screen interface, and extensive automated calibration scheduling, it sets a new benchmark in process calibration.",
        "features": ["Ultra-high accuracy of \u00b10.01% of reading", "Vibrant 4.3\" high-resolution color touchscreen", "Direct pressure sensor module connection interface", "Automated pass/fail analysis and certificate generation data", "Massive internal storage for up to 10,000 calibrations"],
        "specs": {"Accuracy Class": "0.01%", "Display": "4.3-inch Color TFT Capacitive Touch", "Signals": "mA, V, mV, Ohms, Frequency, Pulse, RTD, TC, Pressure", "Pressure Modules": "Supports external modules (up to 1000 bar)", "Memory": "8 GB Internal Flash", "Ports": "LAN, USB, Wi-Fi connectivity", "Certification": "ISO 17025 accredited certificate included"},
        "image": "from-orange-600 to-red-900", "photo": "/images/products/cal-4000.png",
        "datasheetUrl": "/brochures/CAL-4000_datasheet.pdf", "warranty": "3 Years", "inStock": True, "accuracy": "Laboratory Standard (\u00b10.01%)",
    },
    {
        "slug": "et3916", "name": "ET3916 Series Data Logger", "category": "logger",
        "shortDescription": "8-channel standard temperature data logger with LCD screen.",
        "longDescription": "The ET3916 Series is a multi-channel digital data logger engineered for recording thermal profiles in autoclaves, warehouses, ovens, and cold-storage areas. It supports multiple sensor inputs and exports directly to CSV.",
        "features": ["8 independent universal sensor input channels", "Supports Pt100 and J, K, T, E thermocouple inputs", "Large monochrome LCD display with real-time graph view", "High internal memory storing up to 100,000 logs", "Free Windows configuration and analysis software"],
        "specs": {"Channels": "8 channels (universal input)", "Sampling Rate": "1 second to 24 hours selectable", "Sensor Types": "RTD (Pt100/Pt1000) and TC (K, J, T, E)", "Memory Capacity": "100,000 readings per channel", "PC Connection": "USB 2.0 interface", "Power Source": "4x AA Alkaline batteries or 5V USB wall adapter", "Battery Life": "Up to 30 days continuous log (1-min interval)"},
        "image": "from-violet-600 to-purple-950", "photo": "/images/products/et3916.png",
        "datasheetUrl": "/brochures/ET3916_datasheet.pdf", "warranty": "1 Year", "inStock": True, "accuracy": "Logger Std (\u00b10.5\u00b0C)",
    },
    {
        "slug": "et3916-t", "name": "ET3916 T-Series Touch Data Logger", "category": "logger",
        "shortDescription": "Advanced touch screen logger with real-time temperature plotting.",
        "longDescription": "The ET3916 T-Series elevates industrial logging with a responsive color touchscreen that plots temperature profiles in real time. Ideal for vacuum furnace testing and food processing quality audits.",
        "features": ["4.3-inch color LCD touchscreen interface", "Real-time graphical multi-channel line plots", "Over-limit buzzer and visual LED flash alarm indicators", "PDF report auto-generation direct to USB flash drive", "High-precision hardware with automatic noise filtering"],
        "specs": {"Channels": "8 or 12 channels options", "Display": "4.3-inch Resistive Color Touchscreen", "Resolution": "0.01\u00b0C / 0.01\u00b0F", "Memory": "Built-in 4GB SD Card (expandable)", "Output format": "Direct PDF & CSV reports via USB Host", "Alarm": "Visual LED, acoustic buzzer, and SPDT relay output", "Battery": "Rechargeable Li-ion battery (8 hours backup)"},
        "image": "from-pink-600 to-fuchsia-950", "photo": "/images/products/et3916-t.png",
        "datasheetUrl": "/brochures/ET3916-T_datasheet.pdf", "warranty": "2 Years", "inStock": True, "accuracy": "Logger High-Precision (\u00b10.1\u00b0C)",
    },
    {
        "slug": "et3916r", "name": "ET3916R Series Wireless Data Logger", "category": "logger",
        "shortDescription": "Wireless temperature logger with telemetry and cloud upload.",
        "longDescription": "The ET3916R is a wireless data logger designed for remote telemetry applications. Communicating over LoRa or Wi-Fi, it pushes real-time temperatures to central dashboards, eliminating manual wire routing.",
        "features": ["Wireless connectivity: Wi-Fi or LoRaWAN long range telemetry", "Battery-powered operation with ultra-low consumption", "Integrated cloud dashboard subscription available", "SMS / Email notifications for sensor threshold violations", "Waterproof IP65 enclosure for outdoor placement"],
        "specs": {"Wireless Range": "Up to 500m (Wi-Fi), 5km (LoRa line-of-sight)", "Channels": "4 input channels", "Enclosure": "IP65 Dust & Splash Waterproof", "Battery Life": "Up to 1.5 Years (10-min transmission interval)", "Protocols": "MQTT, HTTP, Modbus TCP", "Internal buffer": "10,000 offline backup readings"},
        "image": "from-fuchsia-700 to-indigo-950", "photo": "/images/products/et3916r.png",
        "datasheetUrl": "/brochures/ET3916R_datasheet.pdf", "warranty": "2 Years", "inStock": True, "accuracy": "Wireless Telemetry (\u00b10.3\u00b0C)",
    },
    {
        "slug": "et3917", "name": "ET3917 Series Data Logger", "category": "logger",
        "shortDescription": "High-channel count data logger supporting up to 32 sensors.",
        "longDescription": "The ET3917 is a heavy-duty rackmount or tabletop data logger supporting up to 32 analog channels. Designed for large-scale heat treatment profiling and engine test bench logging.",
        "features": ["Up to 32 differential analog inputs", "Universal configuration (TC, RTD, voltage, mA)", "Ethernet RJ45 port for industrial automation SCADA integration", "Web server interface built-in for browser-based reading", "Direct Modbus RTU / TCP communications"],
        "specs": {"Channels": "16, 24, or 32 analog channels configurations", "Scan Time": "All channels scanned within 500ms", "Interface": "Ethernet (RJ45), RS-485 Modbus, USB", "Display": "5\" TFT widescreen numeric and channel status display", "Mounting": "19-inch Rackmount standard or desktop casing", "Accuracy": "\u00b10.05% of range"},
        "image": "from-violet-800 to-indigo-900", "photo": "/images/products/et3917.png",
        "datasheetUrl": "/brochures/ET3917_datasheet.pdf", "warranty": "2 Years", "inStock": False, "accuracy": "High Channel (\u00b10.05% FS)",
    },
    {
        "slug": "ultrasonic-flow-meter", "name": "Handheld Ultrasonic Flow Meter", "category": "flow",
        "shortDescription": "Non-invasive transit-time clamp-on flow meter for pipes.",
        "longDescription": "The Handheld Ultrasonic Flow Meter utilizes transit-time ultrasonic technology to measure liquid flow rates through pipes non-invasively. Simply clamp the external transducers onto the pipe; no cutting or shutdown is required.",
        "features": ["Non-invasive clamp-on transducers - no process shutdown", "Wide pipe diameter range: DN15mm to DN6000mm", "High accuracy of \u00b11% of velocity rate", "Built-in data logger for up to 2,000 measurements", "Comes in a ruggedized carrying case with ultrasonic gel"],
        "specs": {"Flow Velocity Range": "\u00b10.01 to \u00b132 m/s", "Pipe Sizes": "DN15 to DN6000 mm (options dependent)", "Accuracy": "\u00b11% of reading (>0.2 m/s)", "Fluid Types": "Water, chemicals, oils, and other acoustic-permeable liquids", "Battery": "Rechargeable Ni-MH battery (12 hours battery life)", "Enclosure": "IP67 dust-proof/waterproof handset", "Transducer Temp": "Standard: -30\u00b0C to 90\u00b0C; High-temp option up to 160\u00b0C"},
        "image": "from-blue-500 to-teal-850", "photo": "/images/products/ultrasonic-flow-meter.png",
        "datasheetUrl": "/brochures/Ultrasonic-Flow-Meter_datasheet.pdf", "warranty": "1 Year", "inStock": True, "accuracy": "Flow Precision (\u00b11.0%)",
    },
]

INDUSTRIES = [
    {"slug": "pharma", "name": "Pharmaceutical", "description": "Assuring strict FDA and WHO compliance with autoclaves, deep-freezers, and cleanroom calibration standards.", "iconName": "Pill"},
    {"slug": "oil-gas", "name": "Oil & Gas", "description": "ATEX-certified pressure pumps and temperature blocks engineered for safety and reliability in hazardous areas.", "iconName": "Flame"},
    {"slug": "power", "name": "Power Plants", "description": "Robust, heavy-duty dry block systems for calibrating ultra-high temperature boilers and turbine sensors.", "iconName": "Zap"},
    {"slug": "cement", "name": "Cement", "description": "Thermal profiling and high-temperature calibration kits designed to withstand abrasive, dusty kiln environments.", "iconName": "Building"},
    {"slug": "automotive", "name": "Automotive", "description": "High-speed, multi-channel data logging setups for engine test beds and vehicle climate testing.", "iconName": "Car"},
    {"slug": "chemical", "name": "Chemical", "description": "Corrosion-resistant pressure sensors and temperature calibrators ensuring continuous chemical process safety.", "iconName": "FlaskConical"},
    {"slug": "food", "name": "Food Processing", "description": "HACCP-compliant temperature probes and logging solutions providing sterile production tracking.", "iconName": "Apple"},
    {"slug": "labs", "name": "Laboratories", "description": "Metrology-grade reference calibrators offering ultra-low uncertainties and traceability to national standards.", "iconName": "Beaker"},
    {"slug": "hvac", "name": "HVAC", "description": "Handy flow meters and logger kits for measuring building energy efficiency and air distribution loops.", "iconName": "Wind"},
    {"slug": "water", "name": "Water Treatment", "description": "Clamp-on flow measurement tools for checking flow rates in steel and concrete pipes without disrupting supply.", "iconName": "Droplet"},
]

TESTIMONIALS = [
    {"slug": "dr-ramesh-mehta", "name": "Dr. Ramesh Mehta", "role": "Head of Quality Assurance", "company": "Apex Bio-Pharma Ltd.", "rating": 5, "text": "ATOM India's DPI-1000-M sub-zero dry block calibrator revolutionized our vaccine warehouse validation. The calibration stability of \u00b10.03\u00b0C is phenomenal, and it has easily met all FDA audit inspections.", "logoText": "APEX"},
    {"slug": "vikram-singh", "name": "Vikram Singh", "role": "Lead Instrumentation Engineer", "company": "Western Power Grid Corporation", "rating": 5, "text": "The CAL 4000 multiproduct calibrator is a masterpiece. Sourcing mA while simultaneously reading thermocouple values on the touch-screen saves us hours during start-up testing. The build quality is exceptional.", "logoText": "WEST-GRID"},
    {"slug": "siddharth-roy", "name": "Siddharth Roy", "role": "Operations Director", "company": "Indo-Chemicals Processing", "rating": 4, "text": "We bought the Handheld Ultrasonic Flow Meter for water loop audits. Not having to cut into pipes and halt production has saved us lakhs of rupees. Truly a Made-in-India solution that is on par with global brands.", "logoText": "ICP"},
]

QUOTE_REQUESTS = [
    {"quoteId": "q-101", "productName": "CAL 4000 Multiproduct Calibrator", "customerName": "Anil Deshmukh", "company": "Tata Heavy Industries", "email": "a.deshmukh@tataheavy.com", "phone": "+91 98220 12345", "quantity": 2, "message": "Please send us a quote including calibration certificate and delivery to our Pune factory.", "status": "Pending", "createdAt": datetime(2026, 7, 8, 9, 30, 0)},
    {"quoteId": "q-102", "productName": "DPI-1000-M Low Temperature Calibrator", "customerName": "Priya Sharma", "company": "Sun Research Labs", "email": "priya.sharma@sunlabs.org", "phone": "+91 99123 45678", "quantity": 1, "message": "Need urgent shipment for NABL laboratory inspection.", "status": "Contacted", "createdAt": datetime(2026, 7, 9, 4, 15, 0)},
]

CONTACT_INQUIRIES = [
    {"contactId": "c-201", "name": "Rajesh K.", "email": "rajesh.k@rediffmail.com", "subject": "Dealership Query", "message": "We are distributors of process instruments in Gujarat and would like to register as an authorized dealer for ATOM India.", "status": "Unread", "createdAt": datetime(2026, 7, 8, 14, 22, 0)},
]

CERTIFICATES = [
    {"certificateNo": "AI-2026-9041", "modelNo": "DPI-1000-M", "serialNo": "SN-1000-2490", "customerName": "Apex Bio-Pharma Ltd.", "calibrationDate": date(2026, 4, 15), "dueDate": date(2027, 4, 14), "status": "Valid"},
    {"certificateNo": "AI-2026-8812", "modelNo": "CAL 4000", "serialNo": "SN-30G-7741", "customerName": "Western Power Grid Corporation", "calibrationDate": date(2026, 2, 10), "dueDate": date(2027, 2, 9), "status": "Valid"},
    {"certificateNo": "AI-2025-1049", "modelNo": "ATOM-25", "serialNo": "SN-25-1102", "customerName": "Indo-Chemicals Processing", "calibrationDate": date(2025, 6, 1), "dueDate": date(2026, 6, 1), "status": "Expired"},
]


async def seed():
    await init_database()

    existing_users = await User.find_all().to_list()
    if not existing_users:
        admin = User(
            username="admin",
            hashed_password=hash_password("admin123"),
            role="admin",
            created_at=datetime.utcnow(),
        )
        await admin.insert()
        print("[SEED] Created admin user (admin / admin123)")
    else:
        print("[SEED] Admin user already exists, skipping")

    existing_products = await Product.find_all().to_list()
    if not existing_products:
        for p in PRODUCTS:
            await Product(**p).insert()
        print(f"[SEED] Inserted {len(PRODUCTS)} products")
    else:
        print("[SEED] Products already exist, skipping")

    existing_cats = await Category.find_all().to_list()
    if not existing_cats:
        for c in CATEGORIES:
            await Category(**c).insert()
        print(f"[SEED] Inserted {len(CATEGORIES)} categories")
    else:
        print("[SEED] Categories already exist, skipping")

    existing_ind = await Industry.find_all().to_list()
    if not existing_ind:
        for i in INDUSTRIES:
            await Industry(**i).insert()
        print(f"[SEED] Inserted {len(INDUSTRIES)} industries")
    else:
        print("[SEED] Industries already exist, skipping")

    existing_test = await Testimonial.find_all().to_list()
    if not existing_test:
        for t in TESTIMONIALS:
            await Testimonial(**t).insert()
        print(f"[SEED] Inserted {len(TESTIMONIALS)} testimonials")
    else:
        print("[SEED] Testimonials already exist, skipping")

    existing_quotes = await QuoteRequest.find_all().to_list()
    if not existing_quotes:
        for q in QUOTE_REQUESTS:
            await QuoteRequest(**q).insert()
        print(f"[SEED] Inserted {len(QUOTE_REQUESTS)} quote requests")
    else:
        print("[SEED] Quote requests already exist, skipping")

    existing_contacts = await ContactInquiry.find_all().to_list()
    if not existing_contacts:
        for c in CONTACT_INQUIRIES:
            await ContactInquiry(**c).insert()
        print(f"[SEED] Inserted {len(CONTACT_INQUIRIES)} contact inquiries")
    else:
        print("[SEED] Contact inquiries already exist, skipping")

    existing_certs = await Certificate.find_all().to_list()
    if not existing_certs:
        for c in CERTIFICATES:
            await Certificate(**c).insert()
        print(f"[SEED] Inserted {len(CERTIFICATES)} certificates")
    else:
        print("[SEED] Certificates already exist, skipping")

    print("[SEED] Database seeding complete!")
    await close_database()


if __name__ == "__main__":
    asyncio.run(seed())
