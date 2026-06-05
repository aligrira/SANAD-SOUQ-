export interface CategoryDefinition {
  name: string;
  subcategories: string[];
  iconName: string;
  colorName: string;
}

export const CATEGORIES_DATA: CategoryDefinition[] = [
  {
    name: 'ملابس نساء',
    iconName: 'User',
    colorName: 'rose',
    subcategories: ['فساتين', 'عبايات', 'أحذية', 'حقائب', 'إكسسوارات', 'أخرى']
  },
  {
    name: 'هواتف',
    iconName: 'Smartphone',
    colorName: 'indigo',
    subcategories: ['هواتف أندرويد', 'آيفون', 'أجهزة لوحية', 'ساعات ذكية', 'أخرى']
  },
  {
    name: 'سيارات',
    iconName: 'Car',
    colorName: 'amber',
    subcategories: ['سيارات للبيع', 'قطع غيار', 'إكسسوارات سيارات', 'دراجات نارية', 'أخرى']
  },
  {
    name: 'ملابس رجال',
    iconName: 'Shirt',
    colorName: 'blue',
    subcategories: ['تيشيرتات وقمصان', 'بناطيل وجينز', 'أحذية رجالية', 'ساعات ونظارات', 'أخرى']
  },
  {
    name: 'ملابس اطفال',
    iconName: 'Baby',
    colorName: 'orange',
    subcategories: ['ملابس أولاد', 'ملابس بنات', 'ملابس رضع', 'ألعاب وأدوات', 'أخرى']
  },
  {
    name: 'ماكياج و اكسسوارات',
    iconName: 'Star',
    colorName: 'purple',
    subcategories: ['أدوات ماكياج', 'إكسسوارات شعر', 'شعر وبشرة', 'أخرى']
  },
  {
    name: 'عطورات',
    iconName: 'Droplets',
    colorName: 'rose',
    subcategories: ['عطور رجالية', 'عطور نسائية', 'بخور وعود', 'أخرى']
  },
  {
    name: 'عقارات',
    iconName: 'Home',
    colorName: 'cyan',
    subcategories: ['شقق للبيع', 'شقق للإيجار', 'أراضي ومزارع', 'فلل ومنازل', 'أخرى']
  },
  {
    name: 'إلكترونيات',
    iconName: 'Laptop',
    colorName: 'violet',
    subcategories: ['كمبيوتر ولابتوب', 'شاشات وتلفزيونات', 'سماعات وصوتيات', 'كاميرات', 'أجهزة منزلية', 'أخرى']
  },
  {
    name: 'أثاث',
    iconName: 'Package',
    colorName: 'lime',
    subcategories: ['صالات ومجالس', 'غرف نوم', 'أثاث مطبخ', 'أثاث مكتبي', 'أخرى']
  },
  {
    name: 'أدوات منزلية',
    iconName: 'Coffee',
    colorName: 'teal',
    subcategories: ['أجهزة كهربائية', 'أدوات مطبخ', 'ديكورات', 'أخرى']
  },
  {
    name: 'حيوانات',
    iconName: 'PawPrint',
    colorName: 'yellow',
    subcategories: ['قطط', 'كلاب', 'طيور وأسماك', 'مستلزمات حيوانات', 'أخرى']
  },
  {
    name: 'تحف و هدايا',
    iconName: 'Gift',
    colorName: 'emerald',
    subcategories: ['لوحات فنية', 'تحف يدوية', 'ساعات حائط', 'هدايا مميزة', 'أخرى']
  },
  {
    name: 'اخرى',
    iconName: 'Grid',
    colorName: 'gray',
    subcategories: ['خدمات', 'وظائف', 'أخرى']
  }
];

export const ALL_MAIN_CATEGORIES_NAMES = CATEGORIES_DATA.map(c => c.name);

export function getSubcategoriesForMain(mainCat: string): string[] {
  const found = CATEGORIES_DATA.find(c => c.name === mainCat);
  return found ? found.subcategories : [];
}
