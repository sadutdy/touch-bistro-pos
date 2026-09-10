export const LANGUAGES = [
  { code: 'en', label: 'English', native: 'English' },
  { code: 'ml', label: 'Malayalam', native: 'മലയാളം' },
  { code: 'hi', label: 'Hindi', native: 'हिन्दी' },
  { code: 'ar', label: 'Arabic', native: 'العربية' },
];

export const DEFAULT_LANG = 'en';

const en = {
  brand: { tag: 'POS terminal' },
  sidebar: { menu: 'Menu', navLabel: 'Primary', online: 'Online', live: 'Live terminal' },
  nav: { floor: 'Floor Plan', pos: 'POS Terminal', inventory: 'Inventory' },
  header: {
    floorTitle: 'Floor Plan',
    floorSub: 'Choose a table to begin an order',
    posTitle: 'POS Terminal',
    takeawaySub: 'Takeaway order',
    table: 'Table {name}',
    tableSub: '{zone} · {seats}',
    seats: '{capacity} seats',
    allZones: 'All zones',
    zoneFilter: 'Zone filter',
  },
  floor: {
    seats: '{capacity} seats',
    status: {
      available: 'available',
      occupied: 'occupied',
      reserved: 'reserved',
      billing: 'billing',
      cleaning: 'cleaning',
    },
  },
  orderType: { 'dine-in': 'dine in', takeaway: 'takeaway', delivery: 'delivery' },
  common: { all: 'All', cancel: 'Cancel' },
  cart: {
    title: 'Current Order',
    noTable: 'Select a table',
    empty: 'Your order will appear here.',
    subtotal: 'Subtotal',
    tax: 'Tax (8%)',
    service: 'Service (10%)',
    total: 'Total',
    pay: 'Pay & Complete',
    newOrder: 'New order',
  },
  modifier: { title: 'Customize item', notes: 'Special note (optional)', add: 'Add to order' },
  pay: {
    title: 'Payment',
    due: 'Due: {amount}',
    tendered: 'Cash tendered',
    change: 'Change due: {amount}',
    confirm: 'Confirm payment',
    method: { Cash: 'Cash', Card: 'Card', 'Mobile Wallet': 'Mobile Wallet' },
  },
  inv: { title: 'Stock levels', min: 'Min {value}', low: 'LOW', enable: 'Enable', markOut: 'Mark out' },
  table: { status: 'Status', waiter: 'Waiter', waiterPh: 'Waiter name', save: 'Save', start: 'Start order', open: 'Open order', active: 'Active order', noWaiter: 'Unassigned', statusTime: 'Time in status', items: 'Ordered items', changeStatus: 'Change status' },
  theme: { toDark: 'Switch to dark mode', toLight: 'Switch to light mode' },
  lang: { label: 'Language' },
  currency: { label: 'Currency', live: 'Live rates · 1 USD = {rates}', offline: 'Offline rates · 1 USD = {rates}' },
  app: { noOrder: 'Select a table or create a takeaway order first.' },
};

const ml = {
  brand: { tag: 'POS ടെർമിനൽ' },
  sidebar: { menu: 'മെനു', navLabel: 'പ്രധാനം', online: 'ഓൺലൈൻ', live: 'ലൈവ് ടെർമിനൽ' },
  nav: { floor: 'ഫ്ലോർ പ്ലാൻ', pos: 'POS ടെർമിനൽ', inventory: 'സ്റ്റോക്ക്' },
  header: {
    floorTitle: 'ഫ്ലോർ പ്ലാൻ',
    floorSub: 'ഓർഡർ തുടങ്ങാൻ ഒരു ടേബിൾ തിരഞ്ഞെടുക്കുക',
    posTitle: 'POS ടെർമിനൽ',
    takeawaySub: 'ടേക്ക് അവേ ഓർഡർ',
    table: 'ടേബിൾ {name}',
    tableSub: '{zone} · {seats}',
    seats: '{capacity} സീറ്റുകൾ',
    allZones: 'എല്ലാ സോണുകളും',
    zoneFilter: 'സോൺ ഫിൽട്ടർ',
  },
  floor: {
    seats: '{capacity} സീറ്റുകൾ',
    status: {
      available: 'ലഭ്യം',
      occupied: 'തിരക്കിലാണ്',
      reserved: 'റിസർവ് ചെയ്തു',
      billing: 'ബില്ലിംഗ്',
      cleaning: 'വൃത്തിയാക്കുന്നു',
    },
  },
  orderType: { 'dine-in': 'ഡൈൻ-ഇൻ', takeaway: 'ടേക്ക് അവേ', delivery: 'ഡെലിവറി' },
  common: { all: 'എല്ലാം', cancel: 'റദ്ദാക്കുക' },
  cart: {
    title: 'നിലവിലെ ഓർഡർ',
    noTable: 'ഒരു ടേബിൾ തിരഞ്ഞെടുക്കുക',
    empty: 'നിങ്ങളുടെ ഓർഡർ ഇവിടെ കാണിക്കും.',
    subtotal: 'സബ്ടോട്ടൽ',
    tax: 'നികുതി (8%)',
    service: 'സർവീസ് (10%)',
    total: 'ആകെ',
    pay: 'പണമടച്ച് പൂർത്തിയാക്കുക',
    newOrder: 'പുതിയ ഓർഡർ',
  },
  modifier: { title: 'ഇനം ക്രമീകരിക്കുക', notes: 'പ്രത്യേക കുറിപ്പ് (ഐച്ഛികം)', add: 'ഓർഡറിൽ ചേർക്കുക' },
  pay: {
    title: 'പണമടയ്ക്കൽ',
    due: 'അടയ്ക്കാനുള്ളത്: {amount}',
    tendered: 'നൽകിയ തുക',
    change: 'ബാക്കി: {amount}',
    confirm: 'പേയ്മെന്റ് സ്ഥിരീകരിക്കുക',
    method: { Cash: 'പണം', Card: 'കാർഡ്', 'Mobile Wallet': 'മൊബൈൽ വാലറ്റ്' },
  },
  inv: { title: 'സ്റ്റോക്ക് നില', min: 'കുറഞ്ഞത് {value}', low: 'കുറവ്', enable: 'ലഭ്യമാക്കുക', markOut: 'തീർന്നതായി അടയാളം' },
  table: { status: 'സ്ഥിതി', waiter: 'വെയിറ്റർ', waiterPh: 'വെയിറ്ററുടെ പേര്', save: 'സംരക്ഷിക്കുക', start: 'ഓർഡർ തുടങ്ങുക', open: 'ഓർഡർ തുറക്കുക', active: 'സജീവ ഓർഡർ', noWaiter: 'നിയോഗിച്ചിട്ടില്ല', statusTime: 'സ്ഥിതിയിലെ സമയം', items: 'ഓർഡർ ചെയ്ത ഇനങ്ങൾ', changeStatus: 'സ്ഥിതി മാറ്റുക' },
  theme: { toDark: 'ഡാർക്ക് മോഡിലേക്ക് മാറുക', toLight: 'ലൈറ്റ് മോഡിലേക്ക് മാറുക' },
  lang: { label: 'ഭാഷ' },
  currency: { label: 'കറൻസി', live: 'ലൈവ് നിരക്കുകൾ · 1 USD = {rates}', offline: 'ഓഫ്‌ലൈൻ നിരക്കുകൾ · 1 USD = {rates}' },
  app: { noOrder: 'ആദ്യം ഒരു ടേബിൾ തിരഞ്ഞെടുക്കുകയോ ടേക്ക് അവേ ഓർഡർ ഉണ്ടാക്കുകയോ ചെയ്യുക.' },
};

const hi = {
  brand: { tag: 'POS टर्मिनल' },
  sidebar: { menu: 'मेन्यू', navLabel: 'मुख्य', online: 'ऑनलाइन', live: 'लाइव टर्मिनल' },
  nav: { floor: 'फ़्लोर प्लान', pos: 'POS टर्मिनल', inventory: 'इन्वेंटरी' },
  header: {
    floorTitle: 'फ़्लोर प्लान',
    floorSub: 'ऑर्डर शुरू करने के लिए टेबल चुनें',
    posTitle: 'POS टर्मिनल',
    takeawaySub: 'टेकअवे ऑर्डर',
    table: 'टेबल {name}',
    tableSub: '{zone} · {seats}',
    seats: '{capacity} सीटें',
    allZones: 'सभी ज़ोन',
    zoneFilter: 'ज़ोन फ़िल्टर',
  },
  floor: {
    seats: '{capacity} सीटें',
    status: {
      available: 'उपलब्ध',
      occupied: 'व्यस्त',
      reserved: 'आरक्षित',
      billing: 'बिलिंग',
      cleaning: 'सफ़ाई',
    },
  },
  orderType: { 'dine-in': 'डाइन-इन', takeaway: 'टेकअवे', delivery: 'डिलीवरी' },
  common: { all: 'सभी', cancel: 'रद्द करें' },
  cart: {
    title: 'वर्तमान ऑर्डर',
    noTable: 'टेबल चुनें',
    empty: 'आपका ऑर्डर यहाँ दिखेगा।',
    subtotal: 'उप-योग',
    tax: 'कर (8%)',
    service: 'सेवा (10%)',
    total: 'कुल',
    pay: 'भुगतान करें और पूर्ण करें',
    newOrder: 'नया ऑर्डर',
  },
  modifier: { title: 'आइटम अनुकूलित करें', notes: 'विशेष नोट (वैकल्पिक)', add: 'ऑर्डर में जोड़ें' },
  pay: {
    title: 'भुगतान',
    due: 'देय: {amount}',
    tendered: 'दी गई राशि',
    change: 'बाकी: {amount}',
    confirm: 'भुगतान की पुष्टि करें',
    method: { Cash: 'नकद', Card: 'कार्ड', 'Mobile Wallet': 'मोबाइल वॉलेट' },
  },
  inv: { title: 'स्टॉक स्तर', min: 'न्यूनतम {value}', low: 'कम', enable: 'उपलब्ध करें', markOut: 'समाप्त करें' },
  table: { status: 'स्थिति', waiter: 'वेटर', waiterPh: 'वेटर का नाम', save: 'सहेजें', start: 'ऑर्डर शुरू करें', open: 'ऑर्डर खोलें', active: 'सक्रिय ऑर्डर', noWaiter: 'असाइन नहीं', statusTime: 'स्थिति में समय', items: 'ऑर्डर की गई वस्तुएँ', changeStatus: 'स्थिति बदलें' },
  theme: { toDark: 'डार्क मोड पर जाएँ', toLight: 'लाइट मोड पर जाएँ' },
  lang: { label: 'भाषा' },
  currency: { label: 'मुद्रा', live: 'लाइव दरें · 1 USD = {rates}', offline: 'ऑफ़लाइन दरें · 1 USD = {rates}' },
  app: { noOrder: 'पहले टेबल चुनें या टेकअवे ऑर्डर बनाएँ।' },
};

const ar = {
  brand: { tag: 'نقطة البيع' },
  sidebar: { menu: 'القائمة', navLabel: 'التنقل الرئيسي', online: 'متصل', live: 'طرفية مباشرة' },
  nav: { floor: 'مخطط القاعة', pos: 'نقطة البيع', inventory: 'المخزون' },
  header: {
    floorTitle: 'مخطط القاعة',
    floorSub: 'اختر طاولة لبدء الطلب',
    posTitle: 'نقطة البيع',
    takeawaySub: 'طلب سفري',
    table: 'طاولة {name}',
    tableSub: '{zone} · {seats}',
    seats: '{capacity} مقاعد',
    allZones: 'كل المناطق',
    zoneFilter: 'تصفية المنطقة',
  },
  floor: {
    seats: '{capacity} مقاعد',
    status: {
      available: 'متاحة',
      occupied: 'مشغولة',
      reserved: 'محجوزة',
      billing: 'فوترة',
      cleaning: 'تنظيف',
    },
  },
  orderType: { 'dine-in': 'صالة', takeaway: 'سفري', delivery: 'توصيل' },
  common: { all: 'الكل', cancel: 'إلغاء' },
  cart: {
    title: 'الطلب الحالي',
    noTable: 'اختر طاولة',
    empty: 'سيظهر طلبك هنا.',
    subtotal: 'المجموع الفرعي',
    tax: 'الضريبة (8%)',
    service: 'الخدمة (10%)',
    total: 'الإجمالي',
    pay: 'ادفع وأكمل',
    newOrder: 'طلب جديد',
  },
  modifier: { title: 'تخصيص الصنف', notes: 'ملاحظة خاصة (اختياري)', add: 'أضف إلى الطلب' },
  pay: {
    title: 'الدفع',
    due: 'المستحق: {amount}',
    tendered: 'المبلغ المدفوع',
    change: 'الباقي: {amount}',
    confirm: 'تأكيد الدفع',
    method: { Cash: 'نقدًا', Card: 'بطاقة', 'Mobile Wallet': 'محفظة الهاتف' },
  },
  inv: { title: 'مستويات المخزون', min: 'الأدنى {value}', low: 'منخفض', enable: 'تفعيل', markOut: 'نفد المخزون' },
  table: { status: 'الحالة', waiter: 'النادل', waiterPh: 'اسم النادل', save: 'حفظ', start: 'بدء الطلب', open: 'فتح الطلب', active: 'طلب نشط', noWaiter: 'غير معيّن', statusTime: 'المدة في الحالة', items: 'الأصناف المطلوبة', changeStatus: 'تغيير الحالة' },
  theme: { toDark: 'التبديل إلى الوضع الداكن', toLight: 'التبديل إلى الوضع الفاتح' },
  lang: { label: 'اللغة' },
  currency: { label: 'العملة', live: 'أسعار مباشرة · 1 دولار = {rates}', offline: 'أسعار دون اتصال · 1 دولار = {rates}' },
  app: { noOrder: 'اختر طاولة أولاً أو أنشئ طلبًا سفريًا.' },
};

const translations = { en, ml, hi, ar };

function lookup(lang, key) {
  return key.split('.').reduce((o, k) => (o != null && o[k] != null ? o[k] : undefined), translations[lang]);
}

export function translate(lang, key, vars) {
  let s = lookup(lang, key) ?? lookup('en', key) ?? key;
  if (vars && typeof s === 'string') {
    for (const [k, v] of Object.entries(vars)) s = s.replaceAll(`{${k}}`, String(v));
  }
  return s;
}

export function isSupported(code) {
  return LANGUAGES.some((l) => l.code === code);
}
