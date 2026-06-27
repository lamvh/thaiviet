import type { Project } from '../lib/types';

const G = 'https://lh3.googleusercontent.com/aida-public/';
const U = 'https://images.unsplash.com/';

export const PROJECTS: Project[] = [
  { id: 'plimmerton-coastal', category: 'exterior', categoryLabel: 'Exterior Painting', title: 'Plimmerton Coastal Home', desc: 'Weatherboard restoration and premium protective coating.', image: G + 'AB6AXuCruYund-V1_MgPeC8XhI9DPpJjAP183DZbI0NziNqwE-ctveKSunYbxvqUjn9-KmbZphDbF-CFg8GK2RoJH2-ttBnc7wKIvbOpPCYYCuz6AXtOxrjvE6YQlXpzyX0s5NIlehCbLTT7XoSFhJMTIJaYuAPx2CTB_wWthBiRu3dGkW_o-Aoa6rIPubUPeqmlTcxaZIh0kw9Q_8V-ESgQX4WixBpTnJvQLBWPLkWe1SYb4hr6YfZ3wgtzWb8VNEuQbeAObtb3tI1RZLs' },
  { id: 'waterfront-estate', category: 'exterior', categoryLabel: 'Exterior Painting', title: 'Architectural Waterfront Estate', desc: 'Weather-resistant coatings for coastal exposure.', image: G + 'AB6AXuBucxlLer_5IVV5-Ouk0Zd-msAO90Qj1ZwMwwB0-f2PuSN6A_jm7D6sLiB4x75abP86yz6pGOUCSNcT5Of-rSpUCBp-fT99QuObNXsb_p2y8hm3kdQr3mdpO7YIK7l2lwe4INRKcthnbQ2yXINw6kzhYVH7lO9q6NEd12HH80b43UN4Oro5DINej5VUq7it_mxsKSn68oHwpBxdZLpTGsfQbE1LK5Otl2I04NONxuGfi0lEqlxNna0izeeVZj3NBIRFmthlqqrrLSE' },
  { id: 'kapiti-beach', category: 'exterior', categoryLabel: 'Exterior Painting', title: 'Kāpiti Beach House', desc: 'Coastal weatherboard repaint with full prep.', image: U + 'photo-1572120360610-d971b9d7767c?w=800&q=80' },
  { id: 'karori-villa', category: 'interior', categoryLabel: 'Interior Painting', title: 'Modern Villa Refresh — Karori', desc: 'Precision interior detailing and feature wall.', image: G + 'AB6AXuBFIVxAWkyuyJKwXUYqIR3iz2ttS1KGU3GazGzibFfN2_DQ5cG7q7KOonVor3L5Z9mxdUbXGRt5AKcnSLwQcrbQCuo7JiqJRnNoOVE4Le-lr9-Au3ukfZiRer7Sa7iwCSajQlCIcJDk6BrlJ7SEvxfN0jOwvhxLvY_kZ8vXEgPdNcROW9I0b6Rok8Qan0cRJ9VKzryqsB7HkRZ2qiUEe2gDwhAN6qidWDYHs_Kf6yDLO_9-ZuEwGsbgN7J6I008N0bqTJwaVBsa22o' },
  { id: 'cbd-office', category: 'interior', categoryLabel: 'Interior Painting', title: 'Wellington CBD Office', desc: 'High-traffic durable finishes for corporate HQ.', image: G + 'AB6AXuA7927lvtLrFe66RAe1frc_plcZxatKe_EQsVVC_DQbL5dPkqm5H-1Jh_oWvo1aBVTcNNH_zIOr1L4b1E6rYxpq-ujCwZw5roaBHqHwEuNzK1YIkbPHnFhKvloxfj1gIx9IxAgGvmfEC5e2Awne5zNz-swHyNSmiCecP-KqwXy0MNdSBFIa2t46Rwl25bvJneJ1-3qaYnABuKOEbkxahvlSdnC8VEU-bC-04vMDTybSdTmvWQH1NWvpxx8KWd6dCUmTZwfVrbpcSFI' },
  { id: 'newtown-apartment', category: 'interior', categoryLabel: 'Interior Painting', title: 'Newtown Apartment Repaint', desc: 'Full interior repaint between tenancies.', image: U + 'photo-1562259929-b4e1fd3aef09?w=800&q=80' },
  { id: 'whitby-roof', category: 'roof', categoryLabel: 'Roof Painting', title: 'Whitby Family Home Roof', desc: 'Full roof restoration with weather-resistant coating.', image: U + 'photo-1600585154340-be6161a56a0c?w=800&q=80' },
  { id: 'khandallah-roof', category: 'roof', categoryLabel: 'Roof Painting', title: 'Khandallah Roof Repaint', desc: 'Two-day roof repaint, no mess, fixed price.', image: U + 'photo-1605276374104-dee2a0ed3cd6?w=800&q=80' },
  { id: 'thorndon-strip', category: 'stripping', categoryLabel: 'Paint Stripping', title: 'Thorndon Heritage Strip', desc: 'Decades of failing layers removed back to bare timber.', image: G + 'AB6AXuC4OlQCh34d7qb5klQxylYilA9YvnA7w-XxXGkAFAG4R_mA4uMEURT2NRf2PGoJcF42VRCiXkjjXPmvCaBn900h9kkXKhK8fmzsSRWIradFVfJiyg5TEcfhJZii-SDCbQCVdVFXHM8TZ8lnbPaXAkiq8jV7Z3iAz6Zq2x_eylP9j5yaWnweuxibAf54PH9gFBn4dGE_woIqQCO1joe1Rm3Ug4OMvbIEj2Vx7XVcxHEm-SDxi1P07JPslaNwYv6DbTrZG4O3Y8n4S5M' },
  { id: 'mt-victoria', category: 'stripping', categoryLabel: 'Paint Stripping', title: 'Mt Victoria Restoration', desc: 'Full strip and prep before heritage repaint.', image: U + 'photo-1581578731548-c64695cc6952?w=800&q=80' },
  { id: 'lower-hutt-build', category: 'plastering', categoryLabel: 'Plastering & GIB Stopping', title: 'Lower Hutt New Build', desc: 'Full GIB stopping and skim ready for paint.', image: G + 'AB6AXuCkIgIcFVLKUjLpm0uZU-7bqf4B4S4b9OUsJXP-Kta40rDAo8iGLygiH-0xfhYNhR11AKbyjsfJIY14RcSI8_e03_pAwA1Wv3wfw3KBVGtivxWrpdotwTN2AendpT1YRpDJPYx4AhRxLNpBVEHQeHBcKi950-prvAuu8J2j6uXhSNYIOr1kZAFaHjbPGSoLcA02Jx73XGkjq8JD14pYaN1qB462GxA64H5dPWueo8sqCIXcyEjIsEylIL6vJjW0HrUaBCucqyiyE2g' },
  { id: 'kelburn-reno', category: 'plastering', categoryLabel: 'Plastering & GIB Stopping', title: 'Kelburn Renovation', desc: 'Wall repairs and skim coat across whole house.', image: U + 'photo-1589939705384-5185137a7f0f?w=800&q=80' },
  { id: 'whitby-cedar', category: 'wood', categoryLabel: 'Wood Staining', title: 'Whitby Cedar Deck & Pergola', desc: 'Cedar staining with full surface prep.', image: G + 'AB6AXuAGajUvIyg715rUJUFpAtgxuxAZsLEfsZ4_44D_ySXO9atyurHs7aEg5dfaFrNDcO6q-qlb8pxEQffODC5-Isqf-axMxDUskSRqQgx2XfMOA3Ol4NIauEZlkefaV7Us_3gJK-MV0x6VSSsR0NeamUyXJgY4RHFZU2cEzTpAxQrG4LhEZciWsFLs0u1nws-ey1GSOllyJIe7O4GV2EQ-cbtpau3b0QBpboulSm9_m1Z71kdBxtoiQzKV0hOPhEbQX3RofQbgo35LSGs' },
  { id: 'wairarapa-timber', category: 'wood', categoryLabel: 'Wood Staining', title: 'Wairarapa Farmhouse Timber', desc: 'Exterior timber stain and protective seal.', image: U + 'photo-1558618666-fcd25c85cd64?w=800&q=80' },
  { id: 'thorndon-carpentry', category: 'building', categoryLabel: 'Building Work', title: 'Thorndon Carpentry Repairs', desc: 'Weatherboard replacement and trim repairs before paint.', image: U + 'photo-1503387762-592deb58ef4e?w=800&q=80' },
  { id: 'plimmerton-garage', category: 'building', categoryLabel: 'Building Work', title: 'Plimmerton Garage Prep', desc: 'Minor rebuild and patching before exterior repaint.', image: U + 'photo-1572883454114-1cf0031ede2a?w=800&q=80' },
  { id: 'karori-floors', category: 'flooring', categoryLabel: 'Flooring', title: 'Karori Villa Timber Floors', desc: 'Full sand-back and three coats of polyurethane varnish.', image: U + 'photo-1581858726788-75bc0f6a952d?w=800&q=80' },
  { id: 'lower-hutt-floor', category: 'flooring', categoryLabel: 'Flooring', title: 'Lower Hutt Floor Refinish', desc: 'Sand and varnish across living room and hallway timber.', image: U + 'photo-1615874959474-d609969a20ed?w=800&q=80' },
];

export const PROJECT_FILTERS: { value: string; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'interior', label: 'Interior Painting' },
  { value: 'exterior', label: 'Exterior Painting' },
  { value: 'roof', label: 'Roof Painting' },
  { value: 'stripping', label: 'Paint Stripping' },
  { value: 'plastering', label: 'Plastering & GIB Stopping' },
  { value: 'wood', label: 'Wood Staining' },
  { value: 'building', label: 'Building Work' },
  { value: 'flooring', label: 'Flooring' },
];
