import phone from "@/assets/p-phone.jpg";
import laptop from "@/assets/p-laptop.jpg";
import tablet from "@/assets/p-tablet.jpg";
import watch from "@/assets/p-watch.jpg";
import audio from "@/assets/p-audio.jpg";
import accessory from "@/assets/p-accessory.jpg";
import type { CategorySlug } from "./site";
import { fetchLiveProducts, fetchLiveProduct } from "./mobsmile-api";
import { useEffect, useState } from "react";

export type Review = {
  name: string;
  location?: string;
  rating: number;
  text: string;
  date?: string;
};

export type Product = {
  id: string;
  brand:
    "Apple" | "Samsung" | "Sony" | "Vivo" | "Redmi" | "Joyroom" | "Xiaomi" | "MOBSMILE" | string;
  model: string;
  category: CategorySlug;
  image: string;
  storage: string;
  ram: string;
  colors: string[];
  condition: "Brand New" | "Pre-Owned";
  warranty: string;
  price?: number;
  originalPrice?: number | undefined;
  discountBadge?: string | undefined;
  availability: "In Stock" | "Pre-Order" | "Low Stock";
  os: string;
  screen: string;
  tagline: string;
  specs: Record<string, string>;
  features: string[];
  box: string[];
  faqs: { q: string; a: string }[];
  reviews: Review[];
};

const IMAGES = { phone, laptop, tablet, watch, audio, accessory };

export const PRODUCTS: Product[] = [
  // --- SMARTPHONES ---
  {
    id: "iphone-17-pro-max",
    brand: "Apple",
    model: "iPhone 17 Pro Max",
    category: "smartphones",
    image: IMAGES.phone,
    storage: "512GB",
    ram: "12GB",
    colors: ["Titanium Black", "Desert Orange", "Natural Titanium", "White Titanium"],
    condition: "Brand New",
    warranty: "1 Year Apple Care / Official Warranty",
    price: 549000,
    originalPrice: 589000,
    discountBadge: "Hot Deal",
    availability: "In Stock",
    os: "iOS 19",
    screen: '6.9" LTPO Super Retina XDR 120Hz',
    tagline: "The pinnacle of mobile performance and photographic power.",
    specs: {
      Display: '6.9" Super Retina XDR, ProMotion 120Hz, 3000 nits peak',
      Processor: "Apple A19 Pro (3nm Gen 2) with 6-core GPU & Ray Tracing",
      Camera: "48MP Fusion (Sensor-Shift OIS) + 48MP Ultra-Wide + 48MP 5x Periscope Telephoto",
      FrontCamera: "18MP Center Stage with Autofocus",
      Battery: "4850mAh, 45W wired fast charging, 25W MagSafe wireless",
      Storage: "512GB NVMe High-Speed",
      Connectivity: "5G Sub-6 & mmWave, Wi-Fi 7, Bluetooth 5.4, USB-C 3.2 (10Gbps)",
      Build: "Grade 5 Titanium frame, Ceramic Shield front, textured matte glass back",
      WaterResistance: "IP68 rated (up to 6m for 30 mins)",
      Warranty: "1 Year Official Warranty",
    },
    features: [
      "Next-generation Action Button and Dedicated Camera Control Sensor",
      "ProMotion adaptive 1–120Hz refresh rate with Always-On display",
      "Apple Intelligence built-in with on-device privacy protection",
      "Spatial Video & Audio capture compatible with Vision Pro",
    ],
    box: [
      "iPhone 17 Pro Max handset",
      "Braided USB-C to USB-C Cable (1m)",
      "Documentation",
      "SIM Ejector Pin",
    ],
    faqs: [
      {
        q: "Is this factory sealed and brand new?",
        a: "Yes, 100% brand new, factory sealed with verified Apple Serial / IMEI number.",
      },
      {
        q: "Do you offer islandwide delivery?",
        a: "Yes, express insured courier delivery across all 25 districts in Sri Lanka.",
      },
      {
        q: "Can I pay on delivery or inspect first?",
        a: "We can arrange in-store pickup or secure verified cash/bank transfer upon arrival.",
      },
    ],
    reviews: [
      {
        name: "Dilan Perera",
        location: "Colombo 07",
        rating: 5,
        text: "Genuine Apple sealed box, fast WhatsApp response and got it within 2 hours in Colombo.",
        date: "2 days ago",
      },
      {
        name: "Nadeesha Silva",
        location: "Kandy",
        rating: 5,
        text: "Best price in Sri Lanka. Verified the serial number on Apple portal immediately. Excellent service!",
        date: "1 week ago",
      },
    ],
  },
  {
    id: "galaxy-s25-ultra",
    brand: "Samsung",
    model: "Galaxy S25 Ultra 5G",
    category: "smartphones",
    image: IMAGES.phone,
    storage: "256GB",
    ram: "12GB",
    colors: ["Titanium Silver", "Titanium Black", "Titanium Blue"],
    condition: "Brand New",
    warranty: "1 Year Company Warranty",
    price: 429000,
    originalPrice: 459000,
    discountBadge: "Special Offer",
    availability: "In Stock",
    os: "Android 15 with One UI 7",
    screen: '6.8" Dynamic AMOLED 2X 120Hz',
    tagline: "Pro-grade 200MP zoom with integrated S Pen precision.",
    specs: {
      Display: '6.8" QHD+ Flat Dynamic AMOLED 2X, 1–120Hz, Gorilla Armor anti-reflective',
      Processor: "Qualcomm Snapdragon 8 Elite for Galaxy (3nm)",
      Camera: "200MP Main + 50MP 5x Periscope + 50MP Ultra-Wide + 10MP 3x Telephoto",
      Battery: "5000mAh with 45W Super Fast Charging 2.0 & Fast Wireless 2.0",
      Storage: "256GB UFS 4.0",
      Connectivity: "5G, Wi-Fi 7, Bluetooth 5.4, Ultra-Wideband (UWB)",
      Security: "Ultrasonic In-Display Fingerprint + Samsung Knox Vault",
      Warranty: "1 Year Official Warranty",
    },
    features: [
      "Built-in Bluetooth S Pen with air gestures and precision sketch",
      "Galaxy AI suite: Live Call Translate, Circle to Search, Note Assist",
      "Anti-glare Corning Gorilla Armor glass with 4x scratch resistance",
      "Sustained gaming performance with enlarged Vapor Chamber cooling",
    ],
    box: [
      "Galaxy S25 Ultra",
      "Integrated S Pen",
      "USB-C to USB-C Data Cable",
      "Quick Start Guide",
      "Ejection Pin",
    ],
    faqs: [
      {
        q: "Is this the Snapdragon version?",
        a: "Yes, powered by the flagship Snapdragon 8 Elite chipset.",
      },
      {
        q: "Does it support dual SIMs?",
        a: "Yes, Dual physical Nano-SIM plus multi-eSIM profile support.",
      },
    ],
    reviews: [
      {
        name: "Ravindu Mendis",
        location: "Nugegoda",
        rating: 5,
        text: "Camera zoom is unbelievable for concerts. Quick WhatsApp inquiry and prompt delivery.",
        date: "3 days ago",
      },
    ],
  },
  {
    id: "vivo-x100-pro",
    brand: "Vivo",
    model: "Vivo X100 Pro ZEISS Edition",
    category: "smartphones",
    image: IMAGES.phone,
    storage: "512GB",
    ram: "16GB",
    colors: ["Sunset Orange", "Asteroid Black"],
    condition: "Brand New",
    warranty: "1 Year Official Warranty",
    price: 339000,
    originalPrice: 365000,
    discountBadge: "Hot Deal",
    availability: "In Stock",
    os: "Funtouch OS 14 (Android 14)",
    screen: '6.78" LTPO AMOLED 120Hz',
    tagline: "Unrivaled mobile photography engineered with ZEISS APO optics.",
    specs: {
      Display: '6.78" 1.5K LTPO AMOLED 120Hz, 3000 nits brightness',
      Processor: "MediaTek Dimensity 9300 flagship + Vivo V3 Imaging Chip",
      Camera: "50MP 1-inch ZEISS Main + 50MP ZEISS APO Telephoto (4.3x) + 50MP Ultra-Wide",
      Battery: "5400mAh BlueVolt with 100W FlashCharge + 50W Wireless",
      Storage: "512GB UFS 4.0",
      Connectivity: "5G, Wi-Fi 7, Bluetooth 5.4, NFC, IR Blaster",
      Warranty: "1 Year Official Warranty",
    },
    features: [
      "ZEISS T* Coating eliminates lens flare and chromatic aberration",
      "4K Cinematic Portrait Video with real-time blur switching",
      "100W FlashCharge gives 50% power in under 14 minutes",
    ],
    box: [
      "Vivo X100 Pro",
      "100W Fast Charger Adapter",
      "USB-C Cable",
      "Protective Case",
      "SIM Pin",
    ],
    faqs: [
      {
        q: "Does the package include the 100W charger?",
        a: "Yes, the full genuine 100W adapter is included in the box.",
      },
    ],
    reviews: [
      {
        name: "Kasun Jayawardena",
        location: "Kurunegala",
        rating: 5,
        text: "The portrait camera beats dedicated DSLR cameras. Amazing phone.",
        date: "5 days ago",
      },
    ],
  },
  {
    id: "redmi-note-13-pro-plus",
    brand: "Redmi",
    model: "Redmi Note 13 Pro+ 5G",
    category: "smartphones",
    image: IMAGES.phone,
    storage: "256GB",
    ram: "12GB",
    colors: ["Midnight Black", "Aurora Purple", "Moonlight White"],
    condition: "Brand New",
    warranty: "1 Year Official Warranty",
    price: 139000,
    originalPrice: 149000,
    discountBadge: "Popular",
    availability: "In Stock",
    os: "Xiaomi HyperOS (Android 14)",
    screen: '6.67" Curved 1.5K AMOLED 120Hz',
    tagline: "200MP OIS camera and 120W HyperCharge in a premium curved design.",
    specs: {
      Display: '6.67" CrystalRes 1.5K Curved AMOLED, 120Hz, Dolby Vision',
      Processor: "MediaTek Dimensity 7200-Ultra (4nm)",
      Camera: "200MP OIS Ultra-Clear Main + 8MP Ultra-Wide + 2MP Macro",
      Battery: "5000mAh with 120W HyperCharge (0 to 100% in 19 mins)",
      Storage: "256GB UFS 3.1",
      Protection: "IP68 Dust and Water Resistance, Gorilla Glass Victus",
      Warranty: "1 Year Official Warranty",
    },
    features: [
      "Flagship 200MP sensor with 4x in-sensor lossless zoom",
      "120W HyperCharge powers the device in less than 20 minutes",
      "IP68 rating for peace of mind against spills and rain",
    ],
    box: [
      "Redmi Note 13 Pro+ handset",
      "120W Charger",
      "USB-C Cable",
      "Protective Cover",
      "SIM Tool",
    ],
    faqs: [
      {
        q: "Is this global version?",
        a: "Yes, official Sri Lankan / Global version with Google Play Store & OTA updates.",
      },
    ],
    reviews: [
      {
        name: "Amal Wijesinghe",
        location: "Galle",
        rating: 5,
        text: "Value for money king in Sri Lanka. 120W charging is super quick.",
        date: "2 weeks ago",
      },
    ],
  },

  // --- LAPTOPS & MACBOOKS ---
  {
    id: "macbook-air-m4",
    brand: "Apple",
    model: 'MacBook Air 13.6" M4',
    category: "laptops",
    image: IMAGES.laptop,
    storage: "512GB SSD",
    ram: "16GB Unified",
    colors: ["Midnight", "Starlight", "Space Grey", "Silver"],
    condition: "Brand New",
    warranty: "1 Year Apple International Warranty",
    price: 439000,
    originalPrice: 469000,
    discountBadge: "Best Seller",
    availability: "In Stock",
    os: "macOS Sequoia",
    screen: '13.6" Liquid Retina 500 nits',
    tagline: "Featherlight design with unprecedented M4 speed and all-day endurance.",
    specs: {
      Display: '13.6" Liquid Retina LED-backlit display with True Tone, 500 nits',
      Processor: "Apple M4 Chip (10-core CPU with 4 performance cores, 10-core GPU)",
      Memory: "16GB Unified Memory (120GB/s memory bandwidth)",
      Storage: "512GB PCIe-based onboard SSD",
      Battery: "52.6-watt-hour battery, up to 18 hours Apple TV app movie playback",
      Charging: "MagSafe 3 charging port with 35W Dual USB-C Power Adapter",
      Ports: "2x Thunderbolt / USB 4 ports, 3.5mm headphone jack with high-impedance support",
      Audio: "Four-speaker sound system with Spatial Audio and Dolby Atmos",
      Warranty: "1 Year Official Apple Warranty",
    },
    features: [
      "Completely silent fanless architecture",
      "1080p FaceTime HD camera with advanced image signal processor",
      "Magic Keyboard with full-height function row and Touch ID",
      "Supports up to two external displays with laptop lid closed",
    ],
    box: [
      "13.6-inch MacBook Air",
      "35W Dual USB-C Port Compact Power Adapter",
      "USB-C to MagSafe 3 Braided Cable (2m)",
    ],
    faqs: [
      {
        q: "Can I claim warranty at local Apple Authorized Service Providers in SL?",
        a: "Yes, Apple 1-Year International Warranty is recognized by all authorized service centers.",
      },
      {
        q: "Is 16GB RAM the base model?",
        a: "Yes, the new generation starts standard with 16GB Unified Memory.",
      },
    ],
    reviews: [
      {
        name: "Ishara Dhanushka",
        location: "Battaramulla",
        rating: 5,
        text: "Super light and handles Photoshop + video editing without warming up. Best purchase this year.",
        date: "4 days ago",
      },
    ],
  },
  {
    id: "macbook-pro-14-m4",
    brand: "Apple",
    model: 'MacBook Pro 14" M4 Pro',
    category: "laptops",
    image: IMAGES.laptop,
    storage: "1TB SSD",
    ram: "24GB Unified",
    colors: ["Space Black", "Silver"],
    condition: "Brand New",
    warranty: "1 Year Apple International Warranty",
    price: 689000,
    originalPrice: 725000,
    availability: "In Stock",
    os: "macOS Sequoia",
    screen: '14.2" Liquid Retina XDR 120Hz',
    tagline: "Uncompromised professional workstation for developers and creators.",
    specs: {
      Display: '14.2" Liquid Retina XDR, 1600 nits peak HDR, 1000 nits sustained, ProMotion 120Hz',
      Processor: "Apple M4 Pro (12-core CPU, 16-core GPU, 16-core Neural Engine)",
      Memory: "24GB Unified Memory (150GB/s bandwidth)",
      Storage: "1TB Ultra-Fast NVMe SSD",
      Battery: "72.4-watt-hour battery, up to 22 hours video playback",
      Ports: "3x Thunderbolt 5 (USB-C), HDMI 2.1, SDXC card slot, MagSafe 3, 3.5mm jack",
      Audio:
        "Studio-grade three-mic array, High-fidelity six-speaker sound with force-cancelling woofers",
      Warranty: "1 Year Official Apple Warranty",
    },
    features: [
      "Thunderbolt 5 support with transfer speeds up to 120 Gb/s",
      "Liquid Retina XDR display with nano-texture glass coating option",
      "Hardware-accelerated ray tracing and mesh shading for 3D modeling",
    ],
    box: ["14-inch MacBook Pro", "70W or 96W USB-C Power Adapter", "USB-C to MagSafe 3 Cable"],
    faqs: [
      {
        q: "Is Space Black fingerprint resistant?",
        a: "Yes, Apple's anodization seal minimizes fingerprints significantly.",
      },
    ],
    reviews: [
      {
        name: "Mahesh Gunawardena",
        location: "Colombo 03",
        rating: 5,
        text: "Build times in Xcode cut in half. Premium machine from MOBSMILE.",
        date: "1 week ago",
      },
    ],
  },

  // --- TABLETS ---
  {
    id: "ipad-pro-11-m4",
    brand: "Apple",
    model: 'iPad Pro 11" M4 OLED',
    category: "tablets",
    image: IMAGES.tablet,
    storage: "256GB",
    ram: "8GB",
    colors: ["Space Black", "Silver"],
    condition: "Brand New",
    warranty: "1 Year Apple Warranty",
    price: 359000,
    originalPrice: 389000,
    discountBadge: "Hot Deal",
    availability: "In Stock",
    os: "iPadOS 18",
    screen: '11" Ultra Retina XDR Tandem OLED',
    tagline: "Impossibly thin. Unbelievably powerful. The revolutionary Tandem OLED iPad.",
    specs: {
      Display:
        '11" Ultra Retina XDR Tandem OLED, 1000 nits full-screen, 1600 nits peak HDR, 120Hz ProMotion',
      Processor: "Apple M4 chip (9-core CPU, 10-core GPU, Next-Gen Neural Engine)",
      Camera: "12MP Wide back camera with LiDAR scanner + 12MP Landscape Center Stage front camera",
      Thickness: "Ultra-thin 5.3 mm aluminum chassis",
      Connectivity: "Wi-Fi 6E (802.11ax), Bluetooth 5.3, USB-C Thunderbolt / USB 4",
      Speakers: "Four-speaker audio system with studio-grade mics",
      Warranty: "1 Year Official Warranty",
    },
    features: [
      "World's first Tandem OLED display for deep blacks and extreme brightness",
      "Full support for Apple Pencil Pro with barrel roll and squeeze haptics",
      "Apple M4 chip delivers desktop-grade rendering and AI processing",
    ],
    box: ["11-inch iPad Pro", "USB-C Charge Cable (1m)", "20W USB-C Power Adapter"],
    faqs: [
      {
        q: "Do you sell the Apple Pencil Pro separately?",
        a: "Yes, we stock genuine Apple Pencil Pro and Magic Keyboards.",
      },
    ],
    reviews: [
      {
        name: "Tharindu Wickrama",
        location: "Moratuwa",
        rating: 5,
        text: "The OLED screen is sensational for digital illustration.",
        date: "3 days ago",
      },
    ],
  },
  {
    id: "galaxy-tab-s9-ultra",
    brand: "Samsung",
    model: "Galaxy Tab S9 Ultra 5G",
    category: "tablets",
    image: IMAGES.tablet,
    storage: "512GB",
    ram: "12GB",
    colors: ["Graphite", "Beige"],
    condition: "Brand New",
    warranty: "1 Year Warranty",
    price: 389000,
    originalPrice: 415000,
    availability: "In Stock",
    os: "Android 14 with One UI & Samsung DeX",
    screen: '14.6" Dynamic AMOLED 2X 120Hz',
    tagline: "Colossal 14.6-inch AMOLED canvas with included IP68 S Pen.",
    specs: {
      Display: '14.6" Dynamic AMOLED 2X, 120Hz, HDR10+, 1848 x 2960 pixels',
      Processor: "Snapdragon 8 Gen 2 for Galaxy (4nm)",
      Camera: "Dual 13MP + 8MP rear, Dual 12MP wide front cameras",
      Battery: "11,200mAh with 45W fast charging",
      WaterResistance: "IP68 water and dust resistance on tablet and S Pen",
      Audio: "Quad stereo speakers tuned by AKG with Dolby Atmos",
      Warranty: "1 Year Warranty",
    },
    features: [
      "Samsung DeX mode provides full PC desktop experience with multi-windowing",
      "IP68 waterproof rating makes it durable for studio and outdoor work",
      "Included low-latency S Pen snaps magnetically to the back",
    ],
    box: ["Galaxy Tab S9 Ultra", "S Pen", "USB-C Data Cable", "Ejection Pin"],
    faqs: [
      {
        q: "Does the S Pen come inside the box?",
        a: "Yes, the genuine S Pen is included free inside the box.",
      },
    ],
    reviews: [
      {
        name: "Prabath Fernando",
        location: "Negombo",
        rating: 5,
        text: "Replacing my laptop for meetings with Samsung DeX. Great battery life.",
        date: "1 week ago",
      },
    ],
  },

  // --- WATCHES & WEARABLES ---
  {
    id: "apple-watch-ultra-3",
    brand: "Apple",
    model: "Apple Watch Ultra 3 Titanium",
    category: "watches",
    image: IMAGES.watch,
    storage: "64GB",
    ram: "2GB",
    colors: ["Natural Titanium", "Black Titanium"],
    condition: "Brand New",
    warranty: "1 Year Official Apple Warranty",
    price: 269000,
    originalPrice: 289000,
    discountBadge: "Hot Deal",
    availability: "In Stock",
    os: "watchOS 11",
    screen: "49mm Sapphire Crystal LTPO2 OLED 3000 nits",
    tagline:
      "The ultimate sports, diving and adventure smartwatch engineered in aerospace titanium.",
    specs: {
      Case: "49mm Grade 5 Titanium with raised bezel edges protecting the flat sapphire front",
      Display: "LTPO2 OLED Always-On Retina, up to 3000 nits brightness, 1 nit minimum",
      Processor: "Apple S10 SiP with 64-bit dual-core processor and 4-core Neural Engine",
      Sensors: "ECG, Blood Oxygen, Temperature sensing, Depth gauge to 40m, Water temp",
      Battery: "Up to 36 hours normal use, up to 72 hours in Low Power Mode",
      GPS: "Precision dual-frequency GPS (L1 and L5) with route backtracking",
      Siren: "86-decibel Emergency Siren audible up to 180 meters",
      Warranty: "1 Year Official Warranty",
    },
    features: [
      "Customizable Action Button for instant workout starts and compass waypoints",
      "EN13319 certified for scuba diving and free diving up to 40 meters",
      "Advanced dual-frequency GPS tracks accurately through dense jungle and urban canyons",
    ],
    box: [
      "Titanium Case",
      "Choice of Ocean / Alpine / Trail Loop Band",
      "Apple Watch Magnetic Fast Charger to USB-C Cable (1m)",
    ],
    faqs: [
      {
        q: "Can I choose the band style and size?",
        a: "Yes, let us know your preferred band (Ocean, Alpine or Trail Loop) when ordering on WhatsApp.",
      },
    ],
    reviews: [
      {
        name: "Kasun Liyanage",
        location: "Kandy",
        rating: 5,
        text: "Battery easily lasts 3 full days with workout tracking. Stunning Black Titanium finish.",
        date: "3 days ago",
      },
    ],
  },
  {
    id: "galaxy-watch-7",
    brand: "Samsung",
    model: "Galaxy Watch 7 44mm LTE",
    category: "watches",
    image: IMAGES.watch,
    storage: "32GB",
    ram: "2GB",
    colors: ["Green", "Silver"],
    condition: "Brand New",
    warranty: "1 Year Warranty",
    price: 109000,
    originalPrice: 119000,
    availability: "In Stock",
    os: "Wear OS Powered by Samsung (One UI 6 Watch)",
    screen: '1.5" Super AMOLED Sapphire Crystal',
    tagline: "AI-powered wellness score, advanced sleep tracking and dual-frequency GPS.",
    specs: {
      Case: "44mm Armor Aluminum case with Sapphire Crystal glass",
      Processor: "Exynos W1000 (3nm, 5-Core processor)",
      Sensors:
        "BioActive Sensor (Optical Heart Rate, Electrical Heart, Bioelectrical Impedance), Temp Sensor",
      Battery: "425mAh with WPC-based wireless fast charging",
      Connectivity: "LTE, Bluetooth 5.3, Wi-Fi, NFC, Dual GPS (L1+L5)",
      Durability: "5ATM + IP68 water resistance, MIL-STD-810H certified",
      Warranty: "1 Year Warranty",
    },
    features: [
      "Energy Score by Galaxy AI analyzes sleep and daily activity",
      "De-Novo Sleep Apnea detection feature approved by health authorities",
      "3nm processor provides 3x faster response times and silky smooth animations",
    ],
    box: ["Galaxy Watch 7", "Sport Band", "Fast Wireless Charger Cable", "Manual"],
    faqs: [
      {
        q: "Does it work with non-Samsung Android phones?",
        a: "Yes, works seamlessly with all modern Android smartphones via Galaxy Wearable app.",
      },
    ],
    reviews: [
      {
        name: "Suranga Perera",
        location: "Maharagama",
        rating: 5,
        text: "Fastest Wear OS watch I've used. Heart rate tracking is spot on.",
        date: "1 week ago",
      },
    ],
  },

  // --- AUDIO ---
  {
    id: "sony-wh1000xm6",
    brand: "Sony",
    model: "Sony WH-1000XM6 Wireless Noise-Cancelling",
    category: "audio",
    image: IMAGES.audio,
    storage: "—",
    ram: "—",
    colors: ["Black", "Platinum Silver", "Midnight Blue"],
    condition: "Brand New",
    warranty: "1 Year Warranty",
    price: 129000,
    originalPrice: 145000,
    discountBadge: "Hot Deal",
    availability: "In Stock",
    os: "Sony Headphones Connect App (iOS / Android)",
    screen: "—",
    tagline: "Next-generation HD noise cancelling with bespoke 30mm precision drivers.",
    specs: {
      Processor: "Integrated Processor V2 & HD Noise Cancelling Processor QN1",
      Drivers: "30mm specially designed carbon fiber composite dome drivers",
      Battery: "Up to 30 hours with ANC On, up to 40 hours with ANC Off",
      QuickCharge: "3-minute charge delivers 3 hours playback with USB-PD adapter",
      Codecs: "LDAC, AAC, SBC, Sony DSEE Extreme AI upscaling",
      Microphones: "8 microphones for extreme beamforming noise isolation",
      Bluetooth: "Bluetooth 5.3 with Multipoint Connection (2 devices simultaneously)",
      Warranty: "1 Year Official Warranty",
    },
    features: [
      "Auto NC Optimizer automatically adjusts cancelling based on atmospheric pressure and wearing conditions",
      "Speak-to-Chat pauses music automatically when you start talking",
      "Ultra-comfortable soft-fit leather headband and lightweight earcups",
    ],
    box: [
      "Headphones",
      "Collapsible Carrying Case",
      "Connection Cable (3.5mm)",
      "USB-C Charging Cable",
    ],
    faqs: [
      {
        q: "Are these good for international flights?",
        a: "They are the industry gold standard for airplane travel and noisy office environments.",
      },
    ],
    reviews: [
      {
        name: "Amaya Fonseka",
        location: "Colombo 05",
        rating: 5,
        text: "Pure silence on my flights to Dubai. Sound quality on LDAC is magical.",
        date: "4 days ago",
      },
    ],
  },
  {
    id: "airpods-pro-2-usbc",
    brand: "Apple",
    model: "AirPods Pro (2nd Gen with USB-C MagSafe)",
    category: "audio",
    image: IMAGES.audio,
    storage: "—",
    ram: "—",
    colors: ["Gloss White"],
    condition: "Brand New",
    warranty: "1 Year Apple Warranty",
    price: 84000,
    originalPrice: 92000,
    discountBadge: "Best Seller",
    availability: "In Stock",
    os: "iOS / iPadOS / macOS / watchOS",
    screen: "—",
    tagline: "Pro-level Active Noise Cancellation and Adaptive Audio with H2 silicon.",
    specs: {
      Chip: "Apple H2 headphone chip in earbuds, Apple U1 chip in MagSafe Charging Case",
      AudioTechnology: "Custom high-excursion Apple driver, Custom high dynamic range amplifier",
      NoiseCancellation: "Up to 2x more Active Noise Cancellation than 1st Gen",
      Transparency: "Adaptive Transparency & Conversation Awareness",
      Battery: "Up to 6 hours listening time on single charge, up to 30 hours total with case",
      WaterResistance: "IP54 dust, sweat and water resistant (earbuds and case)",
      Case: "MagSafe Case (USB-C) with built-in speaker for Find My and lanyard loop",
      Warranty: "1 Year Official Apple Warranty",
    },
    features: [
      "Personalized Spatial Audio with dynamic head tracking",
      "Touch control: swipe to adjust volume directly on the stem",
      "Precision Finding with Find My app lets you locate your charging case easily",
    ],
    box: [
      "AirPods Pro (2nd Gen)",
      "MagSafe Charging Case (USB-C) with speaker",
      "Silicone ear tips (XS, S, M, L)",
      "USB-C Charge Cable",
    ],
    faqs: [
      {
        q: "Is this the USB-C version?",
        a: "Yes, this is the updated version with USB-C port and IP54 dust resistance.",
      },
    ],
    reviews: [
      {
        name: "Kavinda De Silva",
        location: "Mount Lavinia",
        rating: 5,
        text: "Seamless switching between MacBook and iPhone. 100% genuine sealed box.",
        date: "5 days ago",
      },
    ],
  },
  {
    id: "joyroom-t03s-pro",
    brand: "Joyroom",
    model: "Joyroom JR-T03S Pro ANC True Wireless Earbuds",
    category: "audio",
    image: IMAGES.audio,
    storage: "—",
    ram: "—",
    colors: ["White", "Midnight Black"],
    condition: "Brand New",
    warranty: "6 Months Warranty",
    price: 14500,
    originalPrice: 18000,
    discountBadge: "Budget Pick",
    availability: "In Stock",
    os: "Universal (iOS / Android / Windows)",
    screen: "—",
    tagline: "Premium Active Noise Cancelling audio experience at an unbeatable price.",
    specs: {
      Bluetooth: "Bluetooth 5.3 + EDR with 15m transmission range",
      ANC: "Active Noise Cancellation up to -25dB depth",
      BatteryLife: "5 hours playback per charge, 25 hours with case",
      Charging: "Wireless Qi charging supported + Lightning/USB-C fast charge",
      Microphone: "Dual Silicon Mic for clear HD calling",
      Warranty: "6 Months Replacement Warranty",
    },
    features: [
      "Pop-up pairing animation on iOS devices",
      "Wireless charging case with complimentary silicone protective sleeve",
      "Smart in-ear detection automatically pauses music when removed",
    ],
    box: [
      "JR-T03S Pro Earbuds",
      "Wireless Charging Case",
      "Silicone Protective Case & Hook",
      "Replacement Ear Tips (S/M/L)",
      "Charge Cable",
    ],
    faqs: [
      {
        q: "Do these support wireless charging pads?",
        a: "Yes, Qi wireless charging pads are fully supported.",
      },
    ],
    reviews: [
      {
        name: "Dulaj Chamara",
        location: "Homagama",
        rating: 5,
        text: "Sound and bass are impressive for this price point. Value buy!",
        date: "2 weeks ago",
      },
    ],
  },

  // --- SMART DEVICES ---
  {
    id: "smart-home-hub-2",
    brand: "Xiaomi",
    model: "Xiaomi Smart Home Hub 2 Gateway",
    category: "smart-devices",
    image: IMAGES.accessory,
    storage: "128MB",
    ram: "128MB",
    colors: ["Clean White"],
    condition: "Brand New",
    warranty: "1 Year Official Warranty",
    price: 39000,
    originalPrice: 45000,
    availability: "In Stock",
    os: "Mi Home / Xiaomi Home App & Apple HomeKit",
    screen: "—",
    tagline: "The central nervous system for Zigbee, Bluetooth Mesh and Wi-Fi smart homes.",
    specs: {
      Protocols: "Zigbee 3.0, Bluetooth 5.0, Bluetooth Mesh, 2.4GHz & 5GHz Dual-band Wi-Fi",
      Processor: "Dual-Core 1.0GHz processor with 128MB high-speed memory",
      Ethernet: "RJ45 wired network port for ultra-low latency connection",
      Power: "Type-C 5V 1A power supply",
      Compatibility: "Mi Home, Google Assistant, Amazon Alexa, Apple HomeKit",
      Warranty: "1 Year Official Warranty",
    },
    features: [
      "Connects and automates up to 100 smart home devices concurrently",
      "Local automation execution continues even when internet connection drops",
      "Dual-band Wi-Fi and direct Ethernet port for zero-lag trigger response",
    ],
    box: ["Smart Home Hub 2", "Type-C Power Cable", "User Manual"],
    faqs: [
      {
        q: "Does it support smart bulbs and door locks?",
        a: "Yes, all Xiaomi and standard Zigbee 3.0 sensors, bulbs and switches work smoothly.",
      },
    ],
    reviews: [
      {
        name: "Menaka Jayawardena",
        location: "Rajagiriya",
        rating: 5,
        text: "Automated my entire living room lights and AC with this hub. Setup was straightforward.",
        date: "1 week ago",
      },
    ],
  },

  // --- ACCESSORIES ---
  {
    id: "joyroom-65w-gan-charger",
    brand: "Joyroom",
    model: "Joyroom 65W GaN Fast Charger 3-Port",
    category: "accessories",
    image: IMAGES.accessory,
    storage: "—",
    ram: "—",
    colors: ["Black", "White"],
    condition: "Brand New",
    warranty: "6 Months Warranty",
    price: 9500,
    originalPrice: 12000,
    discountBadge: "Hot Deal",
    availability: "In Stock",
    os: "Universal",
    screen: "—",
    tagline: "GaN III Ultra-compact 65W fast charger for MacBook, iPhone, Galaxy and iPad.",
    specs: {
      Technology: "GaN (Gallium Nitride) 3rd Generation chip",
      TotalPower: "65W Max Output",
      Ports: "2x USB-C (65W Max PD) + 1x USB-A (30W Max QC 3.0)",
      Protocols: "PD3.0, QC4+, PPS, AFC, FCP, SCP, Apple 2.4A",
      Safety: "8-layer smart temperature and over-voltage protection",
      Warranty: "6 Months Warranty",
    },
    features: [
      "Powers a MacBook Pro 13/14 or iPhone 16/17 from 0 to 50% in 30 minutes",
      "Charges laptop, phone and earbuds simultaneously from one socket",
      "50% smaller than conventional 65W laptop charging bricks",
    ],
    box: ["Joyroom 65W GaN Charger", "User Guide"],
    faqs: [
      {
        q: "Can this charge a MacBook Air or Pro?",
        a: "Yes, 65W Power Delivery provides full speed charging for MacBook Air and MacBook Pro 13/14.",
      },
    ],
    reviews: [
      {
        name: "Thilina Bandara",
        location: "Kaduwela",
        rating: 5,
        text: "Compact travel charger that replaced all my bulky adapters.",
        date: "3 days ago",
      },
    ],
  },
  {
    id: "joyroom-magsafe-powerbank",
    brand: "Joyroom",
    model: "Joyroom Magnetic Wireless Power Bank 10,000mAh 20W PD",
    category: "accessories",
    image: IMAGES.accessory,
    storage: "—",
    ram: "—",
    colors: ["Space Black", "Alpine Green", "Off White"],
    condition: "Brand New",
    warranty: "6 Months Warranty",
    price: 13500,
    originalPrice: 16500,
    discountBadge: "Popular",
    availability: "In Stock",
    os: "Universal",
    screen: "LED Battery Digital Display",
    tagline: "Strong magnetic snap-on wireless power bank with 20W two-way fast charging.",
    specs: {
      Capacity: "10,000mAh 3.85V (38.5Wh) Airline Approved",
      WirelessOutput: "15W / 10W / 7.5W / 5W Magnetic Wireless Charging",
      WiredOutput: "USB-C 20W Power Delivery + USB-A 22.5W Super Charge",
      Display: "Real-time LED smart digital percentage display",
      Magnets: "10N high-strength N52 rare-earth magnetic array",
      Warranty: "6 Months Warranty",
    },
    features: [
      "Snap-and-charge securely on iPhone 12 through iPhone 17 models",
      "Foldable kickstand lets you watch videos while charging vertically or horizontally",
      "Simultaneously charge two devices wirelessly and via USB-C cable",
    ],
    box: ["10,000mAh Magnetic Power Bank", "USB-C to USB-C Fast Cable", "User Manual"],
    faqs: [
      {
        q: "Can I take this on airline flights?",
        a: "Yes, 38.5Wh is well within international airline carry-on safety regulations.",
      },
    ],
    reviews: [
      {
        name: "Sanjaya Wickramasinghe",
        location: "Panadura",
        rating: 5,
        text: "The magnetic grip is strong and kickstand is super handy in office.",
        date: "1 week ago",
      },
    ],
  },
  {
    id: "buds-speaker-bundle",
    brand: "MOBSMILE",
    model: "MOBSMILE Edition Buds + Liquid Glass Bluetooth Speaker Bundle",
    category: "accessories",
    image: IMAGES.accessory,
    storage: "—",
    ram: "—",
    colors: ["Matte Black & Orange", "Pure White"],
    condition: "Brand New",
    warranty: "6 Months MOBSMILE Warranty",
    price: 24900,
    originalPrice: 32000,
    discountBadge: "Bundle Deal",
    availability: "In Stock",
    os: "Universal",
    screen: "—",
    tagline: "High-fidelity audio bundle tailored exclusively for MOBSMILE customers.",
    specs: {
      SpeakerOutput: "15W 360-degree spatial acoustic driver with glowing LED ring",
      BudsDrivers: "13mm titanium composite acoustic drivers with ENC",
      Battery: "12h playback on speaker, 24h playback with earbuds charging case",
      Connectivity: "Bluetooth 5.3 Low Latency, TWS Dual-Pairing Mode",
      Warranty: "6 Months Replacement Warranty",
    },
    features: [
      "Liquid glass transparent acoustic chamber with dynamic orange audio glow",
      "IPX5 water-resistance for outdoor picnics, beach and pool parties",
      "Special discount when bundled together in this showcase pack",
    ],
    box: [
      "Liquid Glass Bluetooth Speaker",
      "True Wireless Earbuds with Case",
      "Braided USB-C Cable",
      "Aux Cable",
      "VIP Warranty Card",
    ],
    faqs: [
      {
        q: "Can I buy individual components?",
        a: "Yes, WhatsApp us at 0774312456 for standalone pricing.",
      },
    ],
    reviews: [
      {
        name: "Hasini Ranasinghe",
        location: "Nugegoda",
        rating: 5,
        text: "The speaker's orange LED glow looks incredible at night. Crisp bass!",
        date: "2 weeks ago",
      },
    ],
  },
];

export function getProduct(id: string): Product | undefined {
  return PRODUCTS.find((p) => p.id === id);
}

export function formatPrice(price?: number): string {
  if (!price) return "Price on request";
  return `LKR ${price.toLocaleString("en-LK")}`;
}

const STORAGE_SETS: Record<string, string[]> = {
  smartphones: ["128GB", "256GB", "512GB", "1TB"],
  tablets: ["128GB", "256GB", "512GB", "1TB"],
  laptops: ["256GB SSD", "512GB SSD", "1TB SSD", "2TB SSD"],
  watches: ["32GB", "64GB"],
  audio: [],
  accessories: [],
  "smart-devices": ["64MB", "128MB", "16GB"],
};

export type Variants = {
  storage: string[];
  colors: string[];
  ram: string[];
  warranty: string[];
};

export function getVariants(p: Product): Variants {
  const set = STORAGE_SETS[p.category];
  const storage =
    set && set.length > 0
      ? Array.from(new Set([p.storage, ...set])).filter((s) => s !== "—")
      : p.storage === "—"
        ? []
        : [p.storage];

  const defaultRam =
    p.category === "smartphones" || p.category === "tablets"
      ? ["8GB", "12GB", "16GB"]
      : p.category === "laptops"
        ? ["16GB", "24GB", "32GB Unified"]
        : [];

  const ram =
    p.ram === "—" || defaultRam.length === 0 ? [] : Array.from(new Set([p.ram, ...defaultRam]));

  return {
    storage,
    colors: p.colors.length > 0 ? p.colors : ["Standard"],
    ram,
    warranty: Array.from(new Set([p.warranty, "Extended MOBSMILE Care (+6 Months)"])),
  };
}

export function dealPrice(p: Product): number | undefined {
  if (p.originalPrice && p.price) return p.price;
  if (!p.price) return undefined;
  return Math.round((p.price * 0.92) / 1000) * 1000;
}

export const HOT_DEALS = PRODUCTS.filter((p) => p.discountBadge || p.originalPrice).slice(0, 4);

/** Same rule as HOT_DEALS above, but usable against any product list — needed once "products" can include live backend data too. */
export function getHotDeals(products: Product[]): Product[] {
  return products.filter((p) => p.discountBadge || p.originalPrice).slice(0, 4);
}

// ---------------------------------------------------------------------
// Live catalogue (mobsmile-backend)
//
// The static PRODUCTS array above is always the baseline — every page
// renders correctly even if VITE_MOBSMILE_API_URL is unset or the
// backend isn't reachable. getAllProducts()/useCatalog() layer real
// admin-managed stock on TOP of it, additively, never replacing it.
// ---------------------------------------------------------------------

/**
 * Static catalogue + the shop database + (optionally) the external backend.
 * Database rows win over a static product with the same id, so anything
 * edited in the admin area shows up straight away.
 */
export async function getAllProducts(): Promise<Product[]> {
  const [db, live] = await Promise.all([fetchDbProducts(), fetchLiveProducts()]);
  const dbIds = new Set(db.map((p) => p.id));
  const base = PRODUCTS.filter((p) => !dbIds.has(p.id));
  const merged = [...db, ...base];
  if (live.length === 0) return merged;
  return [...live, ...merged];
}

/**
 * Looks up a product by id, checking the live backend first (only for
 * "live-" prefixed ids — see lib/mobsmile-api.ts) and falling back to
 * the static catalogue. Safe to call for any id.
 */
export async function getProductAsync(id: string): Promise<Product | undefined> {
  const live = await fetchLiveProduct(id);
  return live ?? getProduct(id);
}

/**
 * React hook for pages that list/filter products client-side (search,
 * category browsing, homepage). Starts with the static catalogue —
 * identical to what the server rendered, so there's no hydration
 * mismatch — then swaps in the live-merged list once the backend
 * responds. If the backend isn't configured or is unreachable, nothing
 * ever changes and the page behaves exactly as it did before.
 */
export function useCatalog(): { products: Product[]; loading: boolean } {
  const [products, setProducts] = useState<Product[]>(PRODUCTS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    getAllProducts()
      .then((all) => {
        if (active) setProducts(all);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  return { products, loading };
}
