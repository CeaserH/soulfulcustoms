const canvas12 = new URL("../assets/products/canvas12.jpeg", import.meta.url)
  .href;

const canvas13 = new URL("../assets/products/canvas13.jpeg", import.meta.url)
  .href;

const canvas14 = new URL("../assets/products/canvas14.jpeg", import.meta.url)
  .href;

const canvas15 = new URL("../assets/products/canvas15.jpeg", import.meta.url)
  .href;

const backpackLifestyle = new URL(
  "../assets/products/lifestyle-backpack.png",
  import.meta.url,
).href;

const pencilPouchLifestyle = new URL(
  "../assets/products/lifestyle-pencil-pouch.png",
  import.meta.url,
).href;

const lunchBagLifestyle = new URL(
  "../assets/products/lifestyle-lunch-bag.png",
  import.meta.url,
).href;

const idBadgeHoldersLifestyle = new URL(
  "../assets/products/lifestyle-id-badge-holders-v2.png",
  import.meta.url,
).href;

const buttonPinsLifestyle = new URL(
  "../assets/products/lifestyle-button-pins.png",
  import.meta.url,
).href;

const potHoldersLifestyle = new URL(
  "../assets/products/lifestyle-pot-holders.png",
  import.meta.url,
).href;

const rectangleGlassLifestyle = new URL(
  "../assets/products/lifestyle-rectangle-glass-frame.png",
  import.meta.url,
).href;

const lightUpGlassLifestyle = new URL(
  "../assets/products/lifestyle-light-up-glass-frame.png",
  import.meta.url,
).href;

const roundGlassLifestyle = new URL(
  "../assets/products/lifestyle-round-glass-frame.png",
  import.meta.url,
).href;

const rectangleSlateLifestyle = new URL(
  "../assets/products/lifestyle-rectangle-rock-slate.png",
  import.meta.url,
).href;

const heartSlateLifestyle = new URL(
  "../assets/products/lifestyle-heart-rock-slate.png",
  import.meta.url,
).href;

const roundSlateLifestyle = new URL(
  "../assets/products/lifestyle-round-rock-slate.png",
  import.meta.url,
).href;

const sportsTagsLifestyle = new URL(
  "../assets/products/lifestyle-sports-luggage-tags.png",
  import.meta.url,
).href;

const idBadgeStyleImages = [
  new URL("../assets/products/id-badges/badge-style-1.png", import.meta.url)
    .href,
  new URL("../assets/products/id-badges/badge-style-2.png", import.meta.url)
    .href,
  new URL("../assets/products/id-badges/badge-style-3.png", import.meta.url)
    .href,
  new URL("../assets/products/id-badges/badge-style-4.png", import.meta.url)
    .href,
  new URL("../assets/products/id-badges/badge-style-5.png", import.meta.url)
    .href,
  new URL("../assets/products/id-badges/badge-style-6.png", import.meta.url)
    .href,
  new URL("../assets/products/id-badges/badge-style-7.png", import.meta.url)
    .href,
  new URL("../assets/products/id-badges/badge-style-8.png", import.meta.url)
    .href,
  new URL("../assets/products/id-badges/badge-style-9.png", import.meta.url)
    .href,
  new URL("../assets/products/id-badges/badge-style-10.png", import.meta.url)
    .href,
  new URL("../assets/products/id-badges/badge-style-11.png", import.meta.url)
    .href,
  new URL("../assets/products/id-badges/badge-style-12.png", import.meta.url)
    .href,
];

const idBadgeStyles = idBadgeStyleImages.map((image, index) => {
  const styleNumber = index + 1;

  return {
    id: `style-${styleNumber}`,
    label: `Style ${styleNumber}`,
    styleNumber,
    image,
    description: '2.75" x 3.93" ID/badge holder.',
  };
});

const idBadgeQuantities = [
  {
    id: "single",
    label: "1 Badge",
    description: '2.75" x 3.93" ID/badge holder.',
    price: 12,
  },
  {
    id: "three-pack",
    label: "3 Badges",
    description: '2.75" x 3.93" ID/badge holders. Bundle price for 3.',
    price: 30,
  },
];

const backToSchoolPersonalization = {
  enabled: true,
  label: "Add Name",
  placeholder: "Enter name to print",
  helperText: "Optional. Add a name at no additional cost.",
  required: false,
};

const badgeHolderPersonalization = {
  enabled: true,
  label: "Name / Title",
  placeholder: "Example: Ms. Smith",
  helperText: "Required. Enter the name or title to print on the holder.",
  required: true,
};

const products = [
  // BACK TO SCHOOL

  {
    id: 12,

    name: "Backpack",

    description: 'Custom backpack, 16" tall.',

    details: [
      { label: "Product", value: "Custom Backpack" },
      { label: "Size", value: '16" tall' },
      { label: "Personalization", value: "Optional name included at no additional cost" },
    ],

    image: backpackLifestyle,

    basePrice: 45,

    category: "Back to School",

    personalization: backToSchoolPersonalization,

    options: {
      sizes: [
        {
          label: "Standard",
          dimensions: '16" tall',
          price: 45,
        },
      ],
    },
  },

  {
    id: 13,

    name: "Pencil Pouch",

    description: "Custom pencil pouch for school supplies and everyday carry.",

    details: [
      { label: "Product", value: "Custom Pencil Pouch" },
      { label: "Size", value: '4.72" x 8.27"' },
      { label: "Personalization", value: "Optional name included at no additional cost" },
    ],

    image: pencilPouchLifestyle,

    basePrice: 8,

    category: "Back to School",

    personalization: backToSchoolPersonalization,

    options: {
      sizes: [
        {
          label: "Standard",
          dimensions: '4.72" x 8.27"',
          price: 8,
        },
      ],
    },
  },

  {
    id: 14,

    name: "Lunch Bag",

    description: 'Custom lunch bag, 7.87" x 10.23" x 2.54".',

    details: [
      { label: "Product", value: "Custom Lunch Bag" },
      { label: "Size", value: '7.87" x 10.23" x 2.54"' },
      { label: "Personalization", value: "Optional name included at no additional cost" },
    ],

    image: lunchBagLifestyle,

    basePrice: 25,

    category: "Back to School",

    personalization: backToSchoolPersonalization,

    options: {
      sizes: [
        {
          label: "Standard",
          dimensions: '7.87" x 10.23" x 2.54"',
          price: 25,
        },
      ],
    },
  },

  // ID/BADGE HOLDERS, BUTTONS, AND HOME GOODS

  {
    id: 15,

    name: "ID/Badge Holder",

    description:
      'Custom ID/badge holders, 2.75" x 3.93". Choose from 12 styles and order 1 or 3. NOTE: Holder only, lanyard not included.',

    details: [
      { label: "Product", value: "Custom ID / Badge Holder" },
      { label: "Size", value: '2.75" x 3.93"' },
      { label: "Styles", value: "Choose from 12 styles and order 1 or 3" },
      { label: "Note", value: "Holder only, lanyard not included." },
    ],

    image: idBadgeHoldersLifestyle,

    basePrice: 12,

    category: "ID/Badge Holders",

    skipUploads: true,

    personalization: badgeHolderPersonalization,

    optionLabel: "Choose Holder Style",

    quantityLabel: "Choose Quantity",

    options: {
      visualStyles: idBadgeStyles,
      quantities: idBadgeQuantities,
    },
  },

  {
    id: 16,

    name: "Button Pins",

    description:
      'Custom button pins available in 2.5" and 3" sizes with single and 5-pack pricing.',

    details: [
      { label: "Product", value: "Custom Button Pins" },
      { label: "Sizes", value: '2.5" and 3" buttons' },
      { label: "Pricing", value: "Single pins and 5-pack options available" },
    ],

    image: buttonPinsLifestyle,

    basePrice: 3,

    category: "Button Pins",

    optionLabel: "Choose Size / Quantity",

    options: {
      styles: [
        {
          id: "2-5-single",
          label: '2.5" button - 1 pin',
          description: 'Single 2.5" custom button pin.',
          price: 3,
        },
        {
          id: "2-5-five-pack",
          label: '2.5" buttons - 5 pack',
          description: 'Five 2.5" custom button pins.',
          price: 10,
        },
        {
          id: "3-single",
          label: '3" button - 1 pin',
          description: 'Single 3" custom button pin.',
          price: 3.5,
        },
        {
          id: "3-five-pack",
          label: '3" buttons - 5 pack',
          description: 'Five 3" custom button pins.',
          price: 13,
        },
      ],
    },
  },

  {
    id: 17,

    name: "Pot Holders",

    description: 'Custom pot holders, 8.25" x 10". Sold as a set of 2.',

    details: [
      { label: "Product", value: "Custom Pot Holders" },
      { label: "Size", value: '8.25" x 10"' },
      { label: "Quantity", value: "Set of 2" },
    ],

    image: potHoldersLifestyle,

    basePrice: 30,

    category: "Home Goods",

    options: {
      sizes: [
        {
          label: "Set of 2",
          dimensions: '8.25" x 10"',
          price: 30,
        },
      ],
    },
  },

  // GLASS FRAMES

  {
    id: 1,

    name: "Rectangle Glass Frame",

    description: "Custom Rectangle Glass Frame",

    details: [
      { label: "Product", value: "Custom Rectangle Glass Frame" },
      { label: "Sizes", value: 'Small 4.3" x 6.3", Medium 6" x 8", Large 7.87" x 11.2"' },
    ],

    image: rectangleGlassLifestyle,

    basePrice: 10,

    category: "Glass",

    options: {
      sizes: [
        {
          label: "Small",
          dimensions: '4.3" x 6.3"',
          price: 10,
        },
        {
          label: "Medium",
          dimensions: '6" x 8"',
          price: 15,
        },
        {
          label: "Large",
          dimensions: '7.87" x 11.2"',
          price: 20,
        },
      ],
    },
  },

  {
    id: 18,

    name: "Round Glass Frame",

    description: 'Custom Round Glass Frame, 9" x 9".',

    details: [
      { label: "Product", value: "Custom Round Glass Frame" },
      { label: "Size", value: '9" x 9"' },
      { label: "Personalization", value: "Optional custom phrase available for $1" },
    ],

    image: roundGlassLifestyle,

    basePrice: 35,

    category: "Glass",

    allowCustomPhrase: true,

    options: {
      sizes: [
        {
          label: "Standard",
          dimensions: '9" x 9"',
          price: 35,
        },
      ],
    },
  },

  {
    id: 2,

    name: "Light Up Glass Frame",

    description: "LED Light Up Glass Frame",

    details: [
      { label: "Product", value: "LED Light Up Glass Frame" },
      { label: "Size", value: '8" x 10"' },
    ],

    image: lightUpGlassLifestyle,

    basePrice: 45,

    category: "Glass",

    options: {
      sizes: [
        {
          label: "Standard",
          dimensions: '8" x 10"',
          price: 45,
        },
      ],
    },
  },

  // SLATE FRAMES

  {
    id: 3,

    name: "Rectangle Rock Slate",

    description: "Custom Rectangle Rock Slate Frame",

    details: [
      { label: "Product", value: "Custom Rectangle Rock Slate Frame" },
      { label: "Sizes", value: 'Medium 5.9" x 7.9", Large 8" x 10"' },
    ],

    image: rectangleSlateLifestyle,

    basePrice: 25,

    category: "Slate",

    options: {
      sizes: [
        {
          label: "Medium",
          dimensions: '5.9" x 7.9"',
          price: 25,
        },
        {
          label: "Large",
          dimensions: '8" x 10"',
          price: 40,
        },
      ],
    },
  },

  {
    id: 4,

    name: "Heart Rock Slate",

    description: "Custom Heart Rock Slate Frame",

    details: [
      { label: "Product", value: "Custom Heart Rock Slate Frame" },
      { label: "Sizes", value: 'Small 5.9" x 5.9", Medium 7.5" x 7.5"' },
    ],

    image: heartSlateLifestyle,

    basePrice: 18,

    category: "Slate",

    options: {
      sizes: [
        {
          label: "Small",
          dimensions: '5.9" x 5.9"',
          price: 18,
        },
        {
          label: "Medium",
          dimensions: '7.5" x 7.5"',
          price: 25,
        },
      ],
    },
  },

  {
    id: 5,

    name: "Round Rock Slate",

    description: "Custom Round Rock Slate Frame",

    details: [
      { label: "Product", value: "Custom Round Rock Slate Frame" },
      { label: "Size", value: '5.9" x 5.9"' },
    ],

    image: roundSlateLifestyle,

    basePrice: 18,

    category: "Slate",

    options: {
      sizes: [
        {
          label: "Small",
          dimensions: '5.9" x 5.9"',
          price: 18,
        },
      ],
    },
  },

  // TAGS

  {
    id: 6,

    name: "Sports / Luggage Tags",

    description: "Custom Sports Bag & Luggage Tags",

    details: [
      { label: "Product", value: "Custom Sports Bag & Luggage Tags" },
      { label: "Options", value: "Single-sided or double-sided printing" },
      { label: "Personalization", value: "Can include small text, name, sports number, and team mascot" },
    ],

    image: sportsTagsLifestyle,

    basePrice: 5,

    category: "Tags",

    options: {
      styles: [
        {
          id: "single",

          label: "Single Sided",

          description:
            "Can include small text, name, sports number, and team mascot",

          price: 5,
        },

        {
          id: "doubleSame",

          label: "Double Sided (Same Photo)",

          description:
            "Same photo on both sides. Can include text, name, sports number, and mascot",

          price: 8,
        },

        {
          id: "doubleDifferent",

          label: "Double Sided (Different Photos)",

          description:
            "Different photos and/or text on each side. Can include text, name, sports number, and mascot",

          price: 10,
        },
      ],
    },
  },
  {
    id: 7,

    name: "Kindergarten Graduation T-Shirt & Stole",

    description:
      "Upload one photo and include the child's name and youth t-shirt size.",

    image: canvas12,

    basePrice: 30,

    category: "Graduation",

    requiredUploads: 1,

    requiresChildName: true,

    requiresYouthSize: true,

    isCustomProject: true,

    allowCustomPhrase: false,

    options: {
      sizes: [
        {
          label: "Youth Small",

          price: 30,
        },

        {
          label: "Youth Medium",

          price: 30,
        },

        {
          label: "Youth Large",

          price: 30,
        },

        {
          label: "Youth XL",

          price: 30,
        },
      ],
    },
  },
  {
    id: 8,

    name: "Custom Graduation Slate Frame",

    description: "Custom graduation slate frame. Upload 3 photos.",

    image: canvas15,

    basePrice: 35,

    category: "Graduation",

    requiredUploads: 3,

    isCustomProject: true,

    options: {
      sizes: [
        {
          label: "Medium",

          dimensions: '5.9" x 7.9"',

          price: 35,
        },

        {
          label: "Large",

          dimensions: '8" x 10"',

          price: 55,
        },
      ],
    },
  },
  {
    id: 9,

    name: "GradFlix Graduation Frame",

    description:
      "Upload 4 high quality photos. Paragraph text may be added at no additional cost.",

    image: canvas14,

    basePrice: 18,

    category: "Graduation",

    requiredUploads: 4,

    freeCustomPhrase: true,

    isCustomProject: true,

    options: {
      sizes: [
        {
          label: "Standard",

          dimensions: '6" x 8"',

          price: 18,
        },
      ],
    },
  },
  {
    id: 10,

    name: "DadFlix Father's Day Glass Frame",

    description: "5 photos. Paragraph text may be added at no additional cost.",

    image: canvas13,

    basePrice: 18,

    category: "Father's Day",

    requiredUploads: 5,

    freeCustomPhrase: true,

    isCustomProject: true,

    options: {
      sizes: [
        {
          label: "Standard",

          dimensions: '6" x 8"',

          price: 18,
        },
      ],
    },
  },
];

export default products;
