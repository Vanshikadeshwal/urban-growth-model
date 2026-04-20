// =============================================
// DATA FILE — zones.js
// All zone and tender data for the model.
// You can edit these values or add new zones.
// =============================================

const ZONES_DATA = [
  { name: 'Dwarka Expressway',       muni: 92, listing: 78, pricing: 88, rental: 74, yield: 4.1, appreciation: 14.2 },
  { name: 'Noida Sector 150',        muni: 85, listing: 65, pricing: 82, rental: 80, yield: 3.8, appreciation: 12.7 },
  { name: 'New Gurugram (115–117)',   muni: 88, listing: 60, pricing: 76, rental: 62, yield: 3.2, appreciation: 11.5 },
  { name: 'Yamuna Expressway',       muni: 80, listing: 55, pricing: 72, rental: 58, yield: 3.9, appreciation: 10.3 },
  { name: 'Sohna Road',              muni: 76, listing: 72, pricing: 70, rental: 68, yield: 4.4, appreciation:  9.8 },
  { name: 'Manesar',                 muni: 74, listing: 50, pricing: 68, rental: 55, yield: 3.4, appreciation:  9.1 },
  { name: 'Dwarka Sector 21',        muni: 60, listing: 70, pricing: 65, rental: 72, yield: 4.8, appreciation:  8.4 },
  { name: 'Faridabad NH-19',         muni: 70, listing: 82, pricing: 62, rental: 76, yield: 5.1, appreciation:  7.2 },
  { name: 'Greater Noida West',      muni: 65, listing: 88, pricing: 58, rental: 84, yield: 5.6, appreciation:  6.8 },
  { name: 'Raj Nagar Ext.',          muni: 62, listing: 68, pricing: 55, rental: 66, yield: 4.7, appreciation:  6.4 },
  { name: 'Rohini Ext.',             muni: 55, listing: 76, pricing: 52, rental: 78, yield: 5.3, appreciation:  5.9 },
  { name: 'Kundli',                  muni: 58, listing: 48, pricing: 50, rental: 50, yield: 4.2, appreciation:  5.2 },
  { name: 'Bhiwadi',                 muni: 50, listing: 60, pricing: 48, rental: 60, yield: 5.8, appreciation:  4.5 },
  { name: 'Lal Kuan',                muni: 45, listing: 55, pricing: 44, rental: 55, yield: 5.0, appreciation:  4.1 },
];

const TENDERS_DATA = [
  { zone: 'Dwarka Expressway',     type: 'Metro Extension (Phase IV)',         status: 'Awarded',   impact: 'High'   },
  { zone: 'Noida Sector 150',      type: 'Sports City Infrastructure',          status: 'Tendered',  impact: 'High'   },
  { zone: 'New Gurugram',          type: 'SPR & NH48 Junction Upgrade',         status: 'Ongoing',   impact: 'High'   },
  { zone: 'Yamuna Expressway',     type: 'Jewar Airport Access Road',           status: 'Tendered',  impact: 'High'   },
  { zone: 'Sohna Road',            type: 'KMP Expressway Integration',          status: 'Completed', impact: 'Medium' },
  { zone: 'Faridabad NH-19',       type: 'Sewage Treatment Plant Upgrade',      status: 'Tendered',  impact: 'Medium' },
  { zone: 'Manesar',               type: 'Industrial Corridor CLU Change',      status: 'Declared',  impact: 'Medium' },
  { zone: 'Greater Noida West',    type: 'Aquifer Recharge & CLU Zoning',       status: 'Tendered',  impact: 'Low'    },
];

// City dataset switcher (pre-built alternate datasets)
const CITY_DATA = {
  ncr: {
    zones: ZONES_DATA,
    tenders: TENDERS_DATA,
    label: 'Delhi NCR',
    metrics: { zones: 14, highGrowth: 5, velocity: '+8.4%', tenders: 23, gap: '2.1%' }
  },
  mumbai: {
    zones: [
      { name: 'Panvel Node',         muni: 90, listing: 72, pricing: 85, rental: 70, yield: 3.6, appreciation: 13.5 },
      { name: 'Dombivli East',       muni: 82, listing: 78, pricing: 78, rental: 75, yield: 4.2, appreciation: 11.2 },
      { name: 'Taloja-Kharghar',     muni: 78, listing: 65, pricing: 74, rental: 68, yield: 3.9, appreciation: 10.4 },
      { name: 'Kalyan-Dombivali',    muni: 70, listing: 80, pricing: 65, rental: 80, yield: 5.0, appreciation:  8.1 },
      { name: 'Badlapur',            muni: 65, listing: 70, pricing: 60, rental: 74, yield: 5.4, appreciation:  7.2 },
      { name: 'Bhiwandi',            muni: 60, listing: 60, pricing: 56, rental: 62, yield: 4.8, appreciation:  6.3 },
      { name: 'Ulwe',                muni: 74, listing: 55, pricing: 70, rental: 58, yield: 3.7, appreciation:  9.6 },
      { name: 'Kamothe',             muni: 55, listing: 65, pricing: 52, rental: 66, yield: 5.1, appreciation:  5.8 },
    ],
    tenders: [
      { zone: 'Panvel Node',    type: 'Navi Mumbai Airport Phase I',      status: 'Ongoing',   impact: 'High'   },
      { zone: 'Ulwe',          type: 'Trans-Harbour Link Extension',      status: 'Tendered',  impact: 'High'   },
      { zone: 'Badlapur',      type: 'Suburban Rail Doubling',            status: 'Awarded',   impact: 'Medium' },
    ],
    label: 'Mumbai MMR',
    metrics: { zones: 8, highGrowth: 3, velocity: '+9.1%', tenders: 18, gap: '1.8%' }
  },
  bangalore: {
    zones: [
      { name: 'Whitefield–ITPL',    muni: 88, listing: 80, pricing: 86, rental: 72, yield: 3.5, appreciation: 13.8 },
      { name: 'Sarjapur Road',      muni: 84, listing: 75, pricing: 80, rental: 78, yield: 4.0, appreciation: 12.2 },
      { name: 'Devanahalli',        muni: 90, listing: 58, pricing: 84, rental: 60, yield: 3.2, appreciation: 13.0 },
      { name: 'Hebbal',             muni: 76, listing: 70, pricing: 74, rental: 68, yield: 3.8, appreciation: 10.5 },
      { name: 'Hosur Road',         muni: 70, listing: 78, pricing: 68, rental: 76, yield: 4.6, appreciation:  8.9 },
      { name: 'Kanakapura Road',    muni: 62, listing: 68, pricing: 60, rental: 70, yield: 5.0, appreciation:  7.1 },
      { name: 'Tumkur Road',        muni: 58, listing: 60, pricing: 54, rental: 62, yield: 4.8, appreciation:  6.2 },
      { name: 'Electronic City Ph2',muni: 72, listing: 72, pricing: 70, rental: 74, yield: 4.2, appreciation:  9.3 },
    ],
    tenders: [
      { zone: 'Devanahalli',       type: 'BIAL Terminal 2 + Metro Phase 3', status: 'Ongoing',  impact: 'High'   },
      { zone: 'Whitefield',        type: 'Purple Line Metro Extension',      status: 'Ongoing',  impact: 'High'   },
      { zone: 'Hosur Road',        type: 'Peripheral Ring Road Segment',     status: 'Awarded',  impact: 'Medium' },
    ],
    label: 'Bangalore',
    metrics: { zones: 8, highGrowth: 4, velocity: '+10.2%', tenders: 21, gap: '1.5%' }
  }
};
