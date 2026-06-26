/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { FleetItem, ServiceCategory } from './types';

// Import new local images intelligently
import hiluxAngle from './images/2023-hilux-hybrid angle view.jpg';
import hiluxBack from './images/2023-hilux-hybrid back angle.jpg';
import hiluxFront from './images/2023-hilux-hybrid front.jpg';
import hiluxSide from './images/2023-hilux-hybrid sideview.jpg';

import lcAngle from './images/2024-Toyota-Land-Cruiser angle view.jpg';
import lcTop from './images/2024landcruiser top side.jpg';
import prado2025 from './images/2025-toyota-land-cruiser.jpg';

export const HERO_SLIDES = [
  {
    id: 1,
    image: lcAngle,
    tagline: 'Premium Rentals',
    title: 'Executive Car Hire & Logistics',
  },
  {
    id: 2,
    image: prado2025,
    tagline: 'Luxury Fleet',
    title: 'SUVs, Sedans & VIP Transport',
  },
  {
    id: 3,
    image: hiluxSide,
    tagline: 'Secure Travel',
    title: 'Hilux Escort & Security Services',
  }
];

export const DESTINATIONS = [
  "BENIN ↔ LAGOS", "BENIN ↔ ABUJA", "BENIN ↔ PORT HARCOURT", "BENIN ↔ WARRI", "NATIONWIDE TRANSPORTATION",
  "BENIN ↔ LAGOS", "BENIN ↔ ABUJA", "BENIN ↔ PORT HARCOURT", "BENIN ↔ WARRI", "NATIONWIDE TRANSPORTATION"
];

export const SERVICE_CATEGORIES: ServiceCategory[] = [
  {
    id: 'corporate_airport',
    title: 'Corporate & Airport',
    iconName: 'Briefcase',
    items: [
      { name: 'Corporate Logistics', desc: 'Reliable corporate mobility solutions and long-term transport contracts for businesses and organizations.' },
      { name: 'Airport Transfers', desc: 'Professional airport pickup and drop-off with meet & greet service and flight tracking.' }
    ]
  },
  {
    id: 'rentals_chauffeurs',
    title: 'Rentals & Chauffeurs',
    iconName: 'Car',
    items: [
      { name: 'Vehicle Rentals', desc: 'Daily, weekly, and monthly rentals of sedans, SUVs, and buses.' },
      { name: 'Chauffeur Hire', desc: 'Professional drivers for personal and corporate use.' }
    ]
  },
  {
    id: 'interstate_travel',
    title: 'Interstate Travel',
    iconName: 'MapPin',
    items: [
      { name: 'Interstate Travel', desc: 'Comfortable, safe, and secure routes connecting Benin, Lagos, Abuja, Port Harcourt, and Warri.' }
    ]
  },
  {
    id: 'protocol_security',
    title: 'Protocol & Security',
    iconName: 'ShieldCheck',
    items: [
      { name: 'VIP & Protocol', desc: 'Premium fast-track airport clearance, diplomatic coordination, and VIP movement services.' },
      { name: 'Security Escort', desc: 'Professional escort coordination, convoy management, and executive protection services.' }
    ]
  },
  {
    id: 'events_tourism',
    title: 'Events & Tourism',
    iconName: 'CalendarDays',
    items: [
      { name: 'Event Transport', desc: 'Tailored fleet transit for weddings, funerals, birthdays, and major corporate conferences.' },
      { name: 'Tour & Leisure', desc: 'Curated city tours, local excursions, resort transfers, and hotel transfers.' }
    ]
  }
];

export const FLEET_DATA: FleetItem[] = [
  {
    id: 'toyota_prado_2025',
    name: 'Toyota Prado (2025)',
    image: prado2025,
    images: [prado2025],
    cutout: '/assets/images/prado_2025.png',
    specs: { pax: 'Up to 5 Passengers', luggage: '4 Large Bags', type: 'Premium 4x4 SUV' },
    desc: 'Combining luxury, performance, and versatility, the Toyota Prado offers an elite travel experience for executive transfers, corporate assignments, and interstate travel.',
    pricePerDay: 120000,
    category: 'suvs'
  },
  {
    id: 'toyota_landcruiser_2024',
    name: 'Toyota Land Cruiser (2024)',
    image: lcAngle,
    images: [lcAngle, lcTop],
    cutout: '/assets/images/land_cruiser_2024.png',
    specs: { pax: 'Up to 5 Passengers', luggage: '4 Large Bags', type: 'Elite Convoy SUV' },
    desc: 'Renowned worldwide for its durability and commanding presence, the Land Cruiser delivers unmatched security for government assignments, protocol services, and VIP movement.',
    pricePerDay: 180000,
    category: 'vip'
  },
  {
    id: 'toyota_hilux_2023',
    name: 'Toyota Hilux (2023)',
    image: hiluxAngle,
    images: [hiluxAngle, hiluxBack, hiluxFront, hiluxSide],
    cutout: '/assets/images/hilux_2023.png',
    specs: { pax: 'Up to 5 Passengers', luggage: '4 Medium Bags', type: 'Premium Escort Pickup' },
    desc: 'A rugged and reliable premium pickup truck, ideal for security escorts, cargo transport, rugged terrains, and protocol convoy operations.',
    pricePerDay: 95000,
    category: 'vip'
  },
  {
    id: 'corolla_2016',
    name: 'Toyota Corolla (2016)',
    image: 'https://www.engracedlogistics.com.ng/storage/2019/02/corolla-2016-740x556.jpg',
    images: [
      'https://www.engracedlogistics.com.ng/storage/2019/02/corolla-2016-740x556.jpg',
      'https://www.engracedlogistics.com.ng/storage/2019/02/corolla-2016.jpg'
    ],
    specs: { pax: 'Up to 4 Passengers', luggage: '2 Medium Bags', type: 'Comfort Sedan' },
    desc: 'A popular and reliable choice for daily city runs, corporate meetings, and airport transfers, offering excellent efficiency and air-conditioned comfort.',
    pricePerDay: 35000,
    category: 'sedans'
  },
  {
    id: 'camry_2010',
    name: 'Toyota Camry (2010)',
    image: 'https://www.engracedlogistics.com.ng/storage/2019/02/camry-2010-740x556.jpg',
    images: ['https://www.engracedlogistics.com.ng/storage/2019/02/camry-2010-740x556.jpg'],
    specs: { pax: 'Up to 4 Passengers', luggage: '2 Medium Bags', type: 'Premium Sedan' },
    desc: 'Combining a spacious cabin with smooth, quiet ride quality, the Toyota Camry is a highly dependable vehicle for corporate and executive transit.',
    pricePerDay: 40000,
    category: 'sedans'
  },
  {
    id: 'rav4_2016',
    name: 'Toyota RAV4 (2016)',
    image: 'https://www.engracedlogistics.com.ng/storage/2019/02/rav4-740x556.jpg',
    images: [
      'https://www.engracedlogistics.com.ng/storage/2019/02/rav4-740x556.jpg',
      'https://www.engracedlogistics.com.ng/storage/2019/02/rav4.jpg'
    ],
    specs: { pax: 'Up to 4 Passengers', luggage: '3 Medium Bags', type: 'Compact Crossover SUV' },
    desc: 'Perfect for navigating city streets or light rugged terrains, the RAV4 crossover delivers comfort, safety, and cargo flexibility.',
    pricePerDay: 60000,
    category: 'suvs'
  },
  {
    id: 'hiace_bus',
    name: 'Toyota Hiace Bus',
    image: 'https://www.engracedlogistics.com.ng/storage/2019/02/bus-740x556.jpg',
    images: [
      'https://www.engracedlogistics.com.ng/storage/2019/02/bus-740x556.jpg',
      'https://www.engracedlogistics.com.ng/storage/2019/02/bus.jpg'
    ],
    specs: { pax: 'Up to 14 Passengers', luggage: '8 Medium Bags', type: 'Executive Commuter Bus' },
    desc: 'Designed for group transport, corporate retreats, and family trips, offering ample passenger space and air conditioning comfort.',
    pricePerDay: 75000,
    category: 'vans'
  },
  {
    id: 'coaster_bus',
    name: 'Toyota Coaster Bus',
    image: 'https://www.engracedlogistics.com.ng/storage/2019/02/coaster-740x556.jpg',
    images: ['https://www.engracedlogistics.com.ng/storage/2019/02/coaster-740x556.jpg'],
    specs: { pax: 'Up to 28 Passengers', luggage: '15 Large Bags', type: 'Group Transit Coach' },
    desc: 'The ultimate choice for large group transfers, delegation travels, weddings, and corporate site movements.',
    pricePerDay: 120000,
    category: 'vans'
  },
  {
    id: 'toyota_sienna',
    name: 'Toyota Sienna Minivan',
    image: 'https://www.engracedlogistics.com.ng/storage/2021/05/sienna-740x556.jpg',
    images: ['https://www.engracedlogistics.com.ng/storage/2021/05/sienna-740x556.jpg'],
    specs: { pax: 'Up to 7 Passengers', luggage: '5 Medium Bags', type: 'Premium Minivan' },
    desc: 'Spacious, highly comfortable, and smooth-driving, the Sienna is the ideal minivan choice for family transfers and business travels.',
    pricePerDay: 65000,
    category: 'vans'
  },
  {
    id: 'lexus_gx',
    name: 'Lexus GX SUV',
    image: 'https://www.engracedlogistics.com.ng/storage/2021/05/lexus-740x556.jpg',
    images: [
      'https://www.engracedlogistics.com.ng/storage/2021/05/lexus-740x556.jpg',
      'https://www.engracedlogistics.com.ng/storage/2021/05/lexus.jpg'
    ],
    specs: { pax: 'Up to 5 Passengers', luggage: '4 Large Bags', type: 'Luxury Executive SUV' },
    desc: 'Unparalleled luxury, leather trims, advanced suspension comfort, and presence for VIP protocols and executive movements.',
    pricePerDay: 160000,
    category: 'vip'
  }
];
