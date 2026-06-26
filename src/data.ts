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
    tagline: 'Car Rental Benin City',
    title: 'Executive Car Hire & Logistics Services in Benin City',
  },
  {
    id: 2,
    image: prado2025,
    tagline: 'Luxury Fleet Nigeria',
    title: 'SUVs, Sedans & VIP Transport Across Lagos, Abuja & Benin',
  },
  {
    id: 3,
    image: hiluxSide,
    tagline: 'Security Escort Nigeria',
    title: 'Hilux Escort & Security Convoy Services Nationwide',
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
      { name: 'Corporate Logistics', desc: 'Reliable corporate mobility solutions and long-term transport contracts for businesses and organizations in Benin City, Lagos, and Abuja.' },
      { name: 'Airport Transfers', desc: 'Professional airport pickup and drop-off across Nigeria with meet & greet service, flight tracking, and executive chauffeur handling.' }
    ]
  },
  {
    id: 'rentals_chauffeurs',
    title: 'Rentals & Chauffeurs',
    iconName: 'Car',
    items: [
      { name: 'Vehicle Rentals', desc: 'Daily, weekly, and monthly car hire in Benin City, Lagos, and Abuja — sedans, SUVs, buses, and luxury vehicles with insurance.' },
      { name: 'Chauffeur Hire', desc: 'Professional drivers for personal and corporate use. Certified chauffeur service with defensive driving credentials.' }
    ]
  },
  {
    id: 'interstate_travel',
    title: 'Interstate Travel',
    iconName: 'MapPin',
    items: [
      { name: 'Interstate Travel', desc: 'Comfortable, safe, and secure interstate transport connecting Benin City to Lagos, Abuja, Port Harcourt, and Warri with double-driver safety protocol.' }
    ]
  },
  {
    id: 'protocol_security',
    title: 'Protocol & Security',
    iconName: 'ShieldCheck',
    items: [
      { name: 'VIP & Protocol', desc: 'Premium fast-track airport clearance, diplomatic coordination, and VIP movement services for government officials and executives.' },
      { name: 'Security Escort', desc: 'Professional escort coordination, armed convoy management, and executive protection services across high-risk corridors in Nigeria.' }
    ]
  },
  {
    id: 'events_tourism',
    title: 'Events & Tourism',
    iconName: 'CalendarDays',
    items: [
      { name: 'Event Transport', desc: 'Tailored fleet transit for weddings, funerals, birthdays, and major corporate conferences — bus rental and luxury car hire available.' },
      { name: 'Tour & Leisure', desc: 'Curated city tours, local excursions in Benin City, resort transfers, and hotel transfers with knowledgeable driver guides.' }
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
    desc: 'The best car rental in Benin City for luxury SUV hire. The Toyota Prado offers elite travel experience for executive transfers, corporate assignments, and interstate travel across Nigeria.',
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
    desc: 'Renowned for durability and commanding presence, the Land Cruiser delivers unmatched VIP transport and security for government assignments, protocol services, and executive movement in Nigeria.',
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
    desc: 'A rugged and reliable premium pickup truck, ideal for security escort services, cargo logistics, rugged terrain operations, and protocol convoy management in Benin City and nationwide.',
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
    desc: 'A popular and reliable choice for daily car hire in Benin City, corporate meetings, and airport transfers, offering excellent fuel efficiency and air-conditioned comfort.',
    pricePerDay: 35000,
    category: 'sedans'
  },
  {
    id: 'camry_2010',
    name: 'Toyota Camry (2010)',
    image: 'https://www.engracedlogistics.com.ng/storage/2019/02/camry-2010-740x556.jpg',
    images: ['https://www.engracedlogistics.com.ng/storage/2019/02/camry-2010-740x556.jpg'],
    specs: { pax: 'Up to 4 Passengers', luggage: '2 Medium Bags', type: 'Premium Sedan' },
    desc: 'Combining a spacious cabin with smooth ride quality, the Toyota Camry is a highly dependable vehicle for executive car rental and corporate transit in Lagos, Abuja, and Benin City.',
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
    desc: 'Perfect for navigating city streets or light rugged terrain, the RAV4 is a popular SUV rental choice in Benin City for comfort, safety, and cargo flexibility.',
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
    desc: 'Designed for group transport, corporate retreats, and family trips. The best bus rental in Benin City for group travel with ample passenger space and air conditioning.',
    pricePerDay: 75000,
    category: 'vans'
  },
  {
    id: 'coaster_bus',
    name: 'Toyota Coaster Bus',
    image: 'https://www.engracedlogistics.com.ng/storage/2019/02/coaster-740x556.jpg',
    images: ['https://www.engracedlogistics.com.ng/storage/2019/02/coaster-740x556.jpg'],
    specs: { pax: 'Up to 28 Passengers', luggage: '15 Large Bags', type: 'Group Transit Coach' },
    desc: 'The ultimate choice for large group transfers, delegation travel, weddings, and corporate site movements. Reliable bus hire for events across Nigeria.',
    pricePerDay: 120000,
    category: 'vans'
  },
  {
    id: 'toyota_sienna',
    name: 'Toyota Sienna Minivan',
    image: 'https://www.engracedlogistics.com.ng/storage/2021/05/sienna-740x556.jpg',
    images: ['https://www.engracedlogistics.com.ng/storage/2021/05/sienna-740x556.jpg'],
    specs: { pax: 'Up to 7 Passengers', luggage: '5 Medium Bags', type: 'Premium Minivan' },
    desc: 'Spacious, highly comfortable, and smooth-driving. The Sienna is the ideal minivan for family transfers, airport runs, and business travel in Nigeria.',
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
    desc: 'Unparalleled luxury, leather trims, advanced suspension comfort. The Lexus GX is the premium choice for VIP transport and executive movements in Nigeria.',
    pricePerDay: 160000,
    category: 'vip'
  }
];
