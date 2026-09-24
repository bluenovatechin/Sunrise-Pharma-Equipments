/**
 * Explanatory copy written for the new website (not scraped).
 *
 * Everything here explains *how the machines work* in plain language, using only
 * general engineering knowledge plus facts that appear in the brochure / product pages.
 * Company-specific claims must come from the scraped data, not from this file.
 */

// Category guides: what it is, how it works (step by step), where it's used, what to decide when buying.
export const CATEGORY_GUIDES = {
  'ointment-manufacturing-plant': {
    tagline: 'Creams, ointments, gels, lotions & pastes',
    whatItIs:
      'An ointment manufacturing plant is a closed set of stainless-steel vessels that melts, mixes, emulsifies and de-aerates semi-solid products — ointments, creams, gels, lotions and pastes — and then transfers the finished batch to storage or filling.',
    steps: [
      { title: 'Wax / oil phase', text: 'Waxes, oils and oil-soluble ingredients are melted and mixed in the jacketed wax vessel.' },
      { title: 'Water phase', text: 'Water and water-soluble ingredients are heated and dissolved in the water vessel.' },
      { title: 'Vacuum transfer', text: 'Both phases are pulled into the main vessel by vacuum, so nothing is poured or handled manually.' },
      { title: 'Mix & homogenise', text: 'An anchor agitator with scrapers keeps product moving off the walls while the homogenizer creates a smooth, uniform emulsion.' },
      { title: 'Heat, cool & de-aerate', text: 'The jacket heats and cools the batch to the recipe temperature, and vacuum removes trapped air bubbles.' },
      { title: 'Discharge & clean', text: 'The finished batch is transferred for storage or filling, and the plant is cleaned through its CIP & SIP connections.' },
    ],
    applications: ['Pharmaceutical ointments & creams', 'Medicated gels', 'Cosmetic creams & lotions', 'Pastes'],
    buyingTips: [
      'Batch size per shift — the listed plants cover 300–1000 kg',
      'Contact-part material: SS 316 L for product contact, SS 304 for non-contact parts',
      'Homogenizer position: top, side or bottom entry',
      'Heating & cooling method and temperature control',
      'Automation level: manual, semi-automatic or PLC',
      'Cleaning: CIP / SIP connections and hydraulic lid lifting',
    ],
  },
  'liquid-oral-manufacturing-plant': {
    tagline: 'Syrups, suspensions & oral solutions',
    whatItIs:
      'A liquid oral (syrup) manufacturing plant prepares, mixes, filters and stores oral liquids such as syrups, suspensions and solutions in a closed, hygienic system, ready for bottle filling.',
    steps: [
      { title: 'Material handling', text: 'Sugar is transferred into the process by a vacuum system instead of manual loading.' },
      { title: 'Sugar syrup preparation', text: 'Sugar is dissolved in a jacketed, insulated vessel with a bottom-entry propeller mixer for vigorous mixing.' },
      { title: 'Pre-filtration', text: 'The sugar syrup passes through a back-washable stainless-steel sintered filter.' },
      { title: 'Solution preparation', text: 'Actives and excipients are mixed in process vessels; an in-line high-shear mixer is used for suspensions.' },
      { title: 'Storage & transfer', text: 'The finished solution is held in storage vessels and moved by lobe pumps through sanitary piping.' },
      { title: 'Automation & CIP', text: 'A PLC system runs the process and an automated CIP system cleans vessels and lines between batches.' },
    ],
    applications: ['Cough & cold syrups', 'Oral suspensions', 'Tonics & oral solutions', 'Other liquid medicines'],
    buyingTips: [
      'Batch capacity ranges from 500 to 10,000 litres',
      'Fully automatic (PLC) or semi-automatic operation',
      'Sugar handling and syrup preparation method',
      'Filtration: sintered filter or sparkler filter press',
      'Transfer piping, platform and staircase layout for your room',
      'Automated CIP and installation / validation support',
    ],
  },
  'vacuum-tray-dryer': {
    tagline: 'Gentle drying for heat-sensitive material',
    whatItIs:
      'A vacuum tray dryer dries wet powders, granules and pastes spread on trays inside a sealed chamber. Lowering the pressure lowers the boiling point, so moisture or solvent evaporates at a gentler temperature — ideal for heat-sensitive material.',
    steps: [
      { title: 'Load the trays', text: 'Wet material is spread on trays that sit on hollow heating shelves inside the chamber.' },
      { title: 'Seal & apply vacuum', text: 'The door is closed on its interlock and a vacuum is pulled on the chamber.' },
      { title: 'Heat through the shelves', text: 'Hot fluid circulates through the hollow shelves, giving uniform, controlled heating.' },
      { title: 'Condense the vapour', text: 'Evaporated moisture or solvent flows to the condenser and collects in the receiver.' },
      { title: 'Break vacuum & unload', text: 'The vacuum break valve releases the chamber and the dried product is removed.' },
    ],
    applications: ['Pharmaceuticals', 'APIs & intermediates', 'Chemicals', 'Heat-sensitive or solvent-wet products'],
    buyingTips: [
      'Number of trays — models run from 6 to 96 trays',
      'Material of construction: SS 316 L, 316 or 304',
      'Heating medium and maximum operating temperature',
      'Explosion vent / rupture disc if you dry solvent-wet material',
      'Single or double door (double for large models)',
      'Manual or complete PLC automation',
    ],
  },
  'bottle-cap-sealing-machine': {
    tagline: 'Consistent, torque-controlled capping',
    whatItIs:
      'An automatic capping machine places and tightens caps on filled bottles at a set torque, so every bottle is sealed the same way at production speed.',
    steps: [
      { title: 'Cap feeding', text: 'An automatic cap elevating system feeds caps to the capping head.' },
      { title: 'Bottle in', text: 'Filled bottles arrive on the conveyor and are positioned under the head.' },
      { title: 'Tighten to torque', text: 'The capping mechanism disengages automatically once the preset torque is reached, so caps are not damaged.' },
      { title: 'Bottle out', text: 'Sealed bottles continue down the line to labelling.' },
    ],
    applications: ['Syrup & liquid oral bottles', 'Pharmaceutical packaging lines', 'Other screw-cap containers'],
    buyingTips: [
      'Output speed — listed machines run from 1800 pcs/hr to 4800 bottles/hr',
      'Cap type and bottle sizes to be handled',
      'Torque control and repeatability',
      'Motor-driven height adjustment for quick changeovers',
      'PLC control with an easy-to-use HMI',
    ],
  },
  'syrup-bottle-filling-machine': {
    tagline: 'Accurate, low-foam liquid filling',
    whatItIs:
      'An automatic syrup bottle filling machine doses a set volume of liquid into each bottle using piston or servo-driven nozzles, keeping fill volumes consistent and minimising spillage.',
    steps: [
      { title: 'Bottles in', text: 'Empty, cleaned bottles arrive on the conveyor and are held under the filling nozzles.' },
      { title: 'Nozzles dive', text: 'Diving-type nozzles enter the bottle and fill from the bottom up, which reduces foaming.' },
      { title: 'Measured dose', text: 'Servo-driven pistons dispense the set volume for fast, highly accurate fills.' },
      { title: 'Bottles out', text: 'Filled bottles move on to capping; any error is shown instantly on the touch panel.' },
    ],
    applications: ['Syrups & suspensions', 'Oral liquids', 'Other free-flowing liquids'],
    buyingTips: [
      'Number of filling stations: 4, 6, 8 or 12',
      'Fill volume range and bottle sizes',
      'Servo piston or volumetric filling',
      'Required output — e.g. 2500 pcs/hr on the servo model',
      'Foaming behaviour of your product (bottom-up filling helps)',
    ],
  },
  'sticker-labeling-machine': {
    tagline: 'Fast, accurate self-adhesive labelling',
    whatItIs:
      'A sticker labelling machine applies self-adhesive labels to bottles and containers automatically, placing each label accurately at line speed.',
    steps: [
      { title: 'Bottle spacing', text: 'A variable-speed separator wheel spaces bottles evenly on the conveyor.' },
      { title: 'Detect the bottle', text: 'A product sensor, with opaque and clear bottle modes, detects each container.' },
      { title: 'Apply the label', text: 'The label head applies the label with up to ± 1 mm accuracy.' },
      { title: 'Bottles out', text: 'Labelled bottles move on to inspection and packing.' },
    ],
    applications: ['Pharmaceutical bottles', 'Cosmetic containers', 'Food & beverage bottles'],
    buyingTips: [
      'Speed — up to 200 bottles per minute',
      'Bottle shapes, sizes and materials (clear or opaque)',
      'Label size and placement accuracy',
      'PLC control with a user-friendly HMI',
    ],
  },
};

// One-line summaries for brochure machines (used on cards and as meta descriptions).
export const MACHINE_SUMMARIES = {
  'syrup-manufacturing-plant': 'Customised, end-to-end liquid oral plants — fully automated with PLC controls or semi-automated — from 500 to 10,000 litres.',
  'ointment-manufacturing-plant': 'Wax, water and main vessels with vacuum transfer, homogenizer and CIP & SIP — a complete line for ointments, creams and gels.',
  'vacuum-tray-dryer': 'SPEVTD vacuum tray dryers from 6 to 96 trays in SS 316 L / 316 / 304, with 60–80% thermal efficiency.',
  'bottle-unscrambler': 'Feeds loose round or flat bottles onto the line upright and in order, at 60 to 300 bottles per minute.',
  'air-jet-cleaning-machine': 'Cleans empty bottles before filling: bottles are inverted, blown with air jets and vacuum-cleaned, with an ioniser to remove static.',
  'liquid-filling-machine': 'Servo-driven piston filling on 4, 6, 8 or 12 stations with bottom-up filling for low foaming.',
  'capping-machine': 'Torque-controlled capping with automatic cap elevator, motor-driven height adjustment and touch-screen control.',
  'sticker-labelling-machine': 'Self-adjusting sticker labeller with ± 1 mm label accuracy at up to 200 bottles per minute.',
  'visual-inspection-machine': 'Lit, magnified inspection station (LUX > 2000) on a timer-based conveyor for checking filled bottles.',
  'sparkler-filter-press': 'Closed cGMP filter press with AISI 316 L contact parts for complete, zero hold-up batch filtration.',
};

// Photos taken from the brochure PDF (see public/assets/images/brochure).
export const MACHINE_IMAGES = {
  'syrup-manufacturing-plant': '/assets/images/brochure/syrup-manufacturing-plant.jpg',
  'ointment-manufacturing-plant': '/assets/images/brochure/ointment-manufacturing-plant.jpg',
  'vacuum-tray-dryer': '/assets/images/brochure/vacuum-tray-dryer.jpg',
  'bottle-unscrambler': '/assets/images/brochure/bottle-unscrambler.jpg',
  'air-jet-cleaning-machine': '/assets/images/brochure/air-jet-cleaning-machine.jpg',
  'liquid-filling-machine': '/assets/images/brochure/liquid-filling-machine.jpg',
  'capping-machine': '/assets/images/brochure/capping-machine.jpg',
  'sticker-labelling-machine': '/assets/images/brochure/sticker-labelling-machine.jpg',
  'visual-inspection-machine': '/assets/images/brochure/visual-inspection-machine.jpg',
  'sparkler-filter-press': '/assets/images/brochure/sparkler-filter-press.jpg',
};

// Hero image per category (a clean brochure cut-out where one exists).
export const CATEGORY_IMAGES = {
  'ointment-manufacturing-plant': '/assets/images/brochure/ointment-manufacturing-plant.jpg',
  'liquid-oral-manufacturing-plant': '/assets/images/brochure/syrup-manufacturing-plant.jpg',
  'vacuum-tray-dryer': '/assets/images/brochure/vacuum-tray-dryer.jpg',
  'bottle-cap-sealing-machine': '/assets/images/brochure/capping-machine.jpg',
  'syrup-bottle-filling-machine': '/assets/images/brochure/liquid-filling-machine.jpg',
  'sticker-labeling-machine': '/assets/images/brochure/sticker-labelling-machine.jpg',
};

// How an order runs, in the order the brochure and profile describe it.
export const HOW_WE_WORK = [
  { title: 'Share your requirement', text: 'Tell us the product, batch size and output you need — by phone, email or the inquiry form.' },
  { title: 'Design & quotation', text: 'We design the process, equipment and transfer piping and send a quotation for your configuration.' },
  { title: 'Manufacturing & QC', text: 'Machines are fabricated in stainless steel at our Vatva GIDC works and quality-checked before dispatch.' },
  { title: 'Delivery & installation', text: 'We deliver by road, rail or air and our team supports installation and validation.' },
];

/** Company-level FAQs, answered from the scraped data only. */
export function buildCompanyFaqs({ company, categories, products, brochureMachines }) {
  const prices = products.map((p) => p.price?.amount).filter(Boolean);
  const inr = (n) => '₹' + n.toLocaleString('en-IN');
  const extra = brochureMachines.filter((m) => !m.categoryId).map((m) => m.name);
  return [
    {
      question: 'What does Sunrise Pharma Equipments manufacture?',
      answer: `We manufacture process and packaging machinery for liquid and ointment products: ${categories.map((c) => c.name).join(', ')}, as well as the ${extra.join(', ')}.`,
    },
    {
      question: 'Where are you located?',
      answer: `Our office is at ${company.addresses.office.full}. Our registered office & factory is at ${company.addresses.factory.full}.`,
    },
    {
      question: 'Do you export machines outside India?',
      answer: `Yes. We supply all over India and export to ${company.logistics.exportMarkets.join(', ')}.`,
    },
    {
      question: 'What is the minimum order quantity?',
      answer: 'The minimum order for every listed machine is 1 unit.',
    },
    {
      question: 'How much do your machines cost?',
      answer: `Listed prices range from ${inr(Math.min(...prices))} to ${inr(Math.max(...prices))} per unit, depending on the machine. Prices are indicative — the final quote depends on capacity, material and automation, so contact us for a quotation.`,
    },
    {
      question: 'Can the machines be customised?',
      answer: 'Yes. Customisation is one of our core strengths — we provide customised, end-to-end solutions, fully automated with PLC controls or semi-automated as required.',
    },
    {
      question: 'Do you help with installation?',
      answer: 'Yes. We have a highly experienced team for installation and validation support.',
    },
    {
      question: 'What payment methods do you accept?',
      answer: `${company.logistics.modesOfPayment.join(', ')}. Depending on the machine, terms such as Cash in Advance, Cash on Delivery, Cheque and Letter of Credit are also available.`,
    },
    {
      question: 'How are machines shipped?',
      answer: `We dispatch by air, rail and road. Delivery time depends on the machine and is listed on each product page.`,
    },
    {
      question: 'Do the machines come with a warranty?',
      answer: 'Yes, our listed machines come with a warranty. The terms for each machine are shown on its product page.',
    },
    {
      question: 'What are your GST and IEC numbers?',
      answer: `GST: ${company.legal.gstNumber}. Import Export Code (IEC): ${company.legal.ieCode}.`,
    },
    {
      question: 'How can I contact you?',
      answer: `Call ${company.contact.mobile.display} or ${company.contact.phone.display}, or email ${company.contact.email}. Office hours: ${company.contact.businessHours.display}.`,
    },
  ];
}
