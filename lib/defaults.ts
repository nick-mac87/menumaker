import { Menu, MenuItem, Category } from './types';
import { generateId } from './utils';
import { DEFAULT_BADGES } from './badges';

export const DEMO_MENU_ID = 'demo-the-yard';

function item(
  name: string,
  description: string,
  price: number,
  tags?: string[],
  badge?: string,
  available: boolean = true,
  image?: string
): MenuItem {
  return {
    id: generateId(),
    name,
    description,
    price,
    currency: 'R',
    tags,
    badge,
    available,
    ...(image ? { image } : {}),
  };
}

function category(name: string, items: MenuItem[], description?: string): Category {
  return {
    id: generateId(),
    name,
    description,
    items,
  };
}

export function createDemoMenu(): Menu {
  return {
    id: DEMO_MENU_ID,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    plan: 'free',
    restaurant: {
      name: 'The Yard',
      tagline: 'Wood-fired flavours, neighbourhood vibes',
      logo: '',
      coverImage: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&h=400&fit=crop',
      location: {
        address: '12 Kloof Street, Gardens, Cape Town',
        googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=12+Kloof+Street+Gardens+Cape+Town',
      },
      contact: {
        phone: '+27 21 423 1234',
        whatsapp: '+27612345678',
        email: 'hello@theyard.co.za',
      },
      social: {
        instagram: '@theyardcpt',
        facebook: 'theyardcpt',
        website: 'https://theyard.co.za',
      },
      hours: {
        'Mon – Sat': '11:00 – 22:00',
        'Sun': '09:00 – 16:00',
      },
      delivery: {
        uberEats: 'https://www.ubereats.com/store/the-yard-cape-town',
        wolt: 'https://wolt.com/en/restaurant/the-yard-cpt',
      },
      bookingEnabled: true,
    },
    design: {
      primaryColor: '#3D5A3E',
      accentColor: '#D4762C',
      backgroundColor: '#FAF7F2',
      textColor: '#2C2C2C',
      headingFont: 'DM Serif Display',
      bodyFont: 'Inter',
      backgroundPattern: 'dots',
      borderRadius: 'md',
      menuStyle: 'clean',
    },
    specials: {
      enabled: true,
      title: "Chef's Specials",
      items: [
        item(
          'Braai Board for Two',
          'Boerewors, lamb chops, chicken sosaties, roasted mielies, chakalaka & fresh rolls',
          345,
          undefined,
          'chefs-choice',
          true,
          'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=200&h=200&fit=crop'
        ),
        item(
          'Hake Tacos',
          'Beer-battered hake, pickled slaw, sriracha mayo, flour tortillas',
          135,
          undefined,
          'hot-deal',
          true,
          'https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?w=200&h=200&fit=crop'
        ),
      ],
    },
    categories: [
      category('Starters', [
        item('Halloumi & Watermelon', 'Grilled halloumi, fresh watermelon, mint, balsamic glaze', 95, ['Vegetarian'], 'recommended', true, 'https://images.unsplash.com/photo-1623428187969-5da2dcea5ebf?w=200&h=200&fit=crop'),
        item('Chicken Livers', 'Peri-peri chicken livers, toasted ciabatta, rocket', 85),
        item('Soup of the Day', 'Ask your server. Served with sourdough', 75, ['Vegetarian']),
      ]),
      category('Mains', [
        item('The Yard Burger', '200g beef patty, cheddar, caramelised onion, house sauce, hand-cut chips', 155, undefined, 'most-popular', true, 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=200&h=200&fit=crop'),
        item('Lamb Shoulder', 'Slow-roasted 8hr lamb, roasted vegetables, rosemary jus', 225, undefined, 'chefs-choice', true, 'https://images.unsplash.com/photo-1544025162-d76694265947?w=200&h=200&fit=crop'),
        item('Mushroom Risotto', 'Wild mushroom, parmesan, truffle oil, crispy sage', 145, ['Vegetarian'], 'recommended'),
        item('Grilled Linefish', 'Catch of the day, lemon butter, seasonal greens, baby potatoes', 185),
      ]),
      category('Drinks', [
        item('House Red', 'Western Cape blend', 55),
        item('House White', 'Sauvignon Blanc, Stellenbosch', 55),
        item('Craft Draught', '500ml, rotating local brewery', 65),
        item('Fresh Lemonade', 'Homemade with mint', 45, undefined, undefined, true, 'https://images.unsplash.com/photo-1621263764928-df1444c5e859?w=200&h=200&fit=crop'),
        item('Espresso', 'Double shot', 35),
        item('Cappuccino', 'Double shot with steamed milk', 45),
      ]),
      category('Desserts', [
        item('Malva Pudding', 'Classic South African malva, vanilla custard', 75, undefined, 'most-popular', true, 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=200&h=200&fit=crop'),
        item('Churros', 'Cinnamon sugar, chocolate dipping sauce', 65, undefined, 'new-item'),
      ]),
    ],
    gallery: [],
    badges: [...DEFAULT_BADGES],
  };
}

export function createEmptyMenu(): Menu {
  return {
    id: generateId(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    plan: 'free',
    restaurant: {
      name: '',
      tagline: '',
      logo: '',
      location: {
        address: '',
      },
      contact: {},
      social: {},
      hours: {
        'Mon – Fri': '09:00 – 22:00',
        'Sat – Sun': '10:00 – 22:00',
      },
      delivery: {},
      bookingEnabled: false,
    },
    design: {
      primaryColor: '#3D5A3E',
      accentColor: '#D4762C',
      backgroundColor: '#FAF7F2',
      textColor: '#2C2C2C',
      headingFont: 'DM Serif Display',
      bodyFont: 'Inter',
      backgroundPattern: 'dots',
      borderRadius: 'md',
      menuStyle: 'clean',
    },
    specials: {
      enabled: false,
      title: "Today's Specials",
      items: [],
    },
    categories: [
      {
        id: generateId(),
        name: 'Mains',
        items: [],
      },
    ],
    gallery: [],
    badges: [...DEFAULT_BADGES],
  };
}

export const CURRENCIES = [
  { value: 'R', label: 'R (ZAR)' },
  { value: '$', label: '$ (USD)' },
  { value: '€', label: '€ (EUR)' },
  { value: '£', label: '£ (GBP)' },
  { value: '₹', label: '₹ (INR)' },
  { value: 'A$', label: 'A$ (AUD)' },
  { value: 'C$', label: 'C$ (CAD)' },
  { value: '¥', label: '¥ (JPY)' },
];

export const TAG_OPTIONS = [
  'Vegetarian',
  'Vegan',
  'Gluten-Free',
  'Spicy',
  'Dairy-Free',
  'Nut-Free',
  'Halal',
  'New',
  'Popular',
];

export const TAG_DISPLAY: Record<string, string> = {
  'Vegetarian': 'V',
  'Vegan': 'VG',
  'Gluten-Free': 'GF',
  'Spicy': '🌶',
  'Dairy-Free': 'DF',
  'Nut-Free': 'NF',
  'Halal': 'H',
  'New': '✨',
  'Popular': '⭐',
};
