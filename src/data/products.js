const canvas1 = new URL("../assets/products/canvas1.jpg", import.meta.url).href;

const canvas2 = new URL("../assets/products/canvas2.jpg", import.meta.url).href;

const canvas3 = new URL("../assets/products/canvas3.jpg", import.meta.url).href;

const canvas6 = new URL("../assets/products/canvas6.jpg", import.meta.url).href;

const canvas8 = new URL("../assets/products/canvas8.jpg", import.meta.url).href;

const canvas10 = new URL("../assets/products/canvas10.jpg", import.meta.url)
  .href;

const canvas12 = new URL("../assets/products/canvas12.jpeg", import.meta.url)
  .href;

const canvas13 = new URL("../assets/products/canvas13.jpeg", import.meta.url)
  .href;

const canvas14 = new URL("../assets/products/canvas14.jpeg", import.meta.url)
  .href;

const canvas15 = new URL("../assets/products/canvas15.jpeg", import.meta.url)
  .href;
const products = [
  // GLASS FRAMES

  {
    id: 1,

    name: "Rectangle Glass Frame",

    description: "Custom Rectangle Glass Frame",

    image: canvas6,

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
    id: 2,

    name: "Light Up Glass Frame",

    description: "LED Light Up Glass Frame",

    image: canvas8,

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

    image: canvas2,

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

    image: canvas3,

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

    image: canvas1,

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
          label: "Large",
          dimensions: '9" x 9"',
          price: 25,
        },
      ],
    },
  },

  // TAGS

  {
    id: 6,

    name: "Sports / Luggage Tags",

    description: "Custom Sports Bag & Luggage Tags",

    image: canvas10,

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
