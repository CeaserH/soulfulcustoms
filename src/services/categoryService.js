import { collection, doc, getDocs, setDoc } from "firebase/firestore";

import { db } from "../firebase";
import {
  getProductCatalog,
  setProductActive,
  toTitleCase,
  updateProductCategory,
} from "./productService";

const categorySettingsCollection = "categorySettings";

export const defaultCategorySections = [
  {
    title: "Back To School",
    category: "Back to School",
    description:
      "Personalized school essentials, including backpacks, lunch bags, and pencil pouches.",
  },
  {
    title: "Glass Frames",
    category: "Glass",
    description:
      "Premium glass keepsakes with vibrant photo reproduction and elegant display stands.",
  },
  {
    title: "Slate Frames",
    category: "Slate",
    description:
      "Natural stone photo displays crafted to preserve life's most meaningful moments.",
  },
  {
    title: "Sports & Luggage Tags",
    category: "Tags",
    description:
      "Personalized tags perfect for athletes, teams, travel, and everyday identification.",
  },
  {
    title: "ID/Badge Holders",
    category: "ID/Badge Holders",
    description:
      "Custom holders for IDs, work badges, and teacher badge inserts with single or 3-pack pricing.",
  },
  {
    title: "Button Pins",
    category: "Button Pins",
    description:
      "Personalized button pins available in multiple sizes and bundle quantities.",
  },
  {
    title: "Home Goods",
    category: "Home Goods",
    description:
      "Useful custom pieces for home gifting, kitchens, and everyday keepsakes.",
  },
];

function getCategoryDocId(category) {
  return encodeURIComponent(category);
}

export async function getCategorySettings() {
  let snapshot;

  try {
    snapshot = await getDocs(collection(db, categorySettingsCollection));
  } catch (err) {
    console.warn("Category settings could not be loaded.", err);
    return new Map();
  }

  return new Map(
    snapshot.docs.map((docSnapshot) => {
      const data = docSnapshot.data();

      return [data.category || decodeURIComponent(docSnapshot.id), data];
    }),
  );
}

export async function getCategorySections(products) {
  const settings = await getCategorySettings();
  const defaultsByCategory = new Map(
    defaultCategorySections.map((section, index) => [
      section.category,
      {
        ...section,
        sortOrder: index,
      },
    ]),
  );
  const productCategories = Array.from(
    new Set(products.map((product) => product.category).filter(Boolean)),
  );

  return productCategories
    .filter((category) => settings.get(category)?.isDeleted !== true)
    .map((category, index) => {
      const defaultSection = defaultsByCategory.get(category) || {
        title: toTitleCase(category),
        category,
        description: "Custom products available from Soulful Customs.",
        sortOrder: defaultCategorySections.length + index,
      };
      const savedSection = settings.get(category) || {};

      return {
        ...defaultSection,
        ...savedSection,
        category,
        isDeleted: false,
        sortOrder: Number(savedSection.sortOrder ?? defaultSection.sortOrder),
      };
    })
    .sort((a, b) => a.sortOrder - b.sortOrder || a.title.localeCompare(b.title));
}

export async function saveCategorySection(section) {
  await setDoc(
    doc(db, categorySettingsCollection, getCategoryDocId(section.category)),
    {
      category: section.category,
      title: toTitleCase(section.title),
      description: section.description.trim(),
      sortOrder: Number(section.sortOrder) || 0,
      isDeleted: false,
      updatedAt: Date.now(),
    },
    {
      merge: true,
    },
  );
}

export async function saveCategoryOrder(sections) {
  await Promise.all(
    sections.map((section, index) =>
      saveCategorySection({
        ...section,
        sortOrder: index,
      }),
    ),
  );
}

export async function renameCategory(oldCategory, nextCategory, section) {
  const category = toTitleCase(nextCategory);

  if (!category) {
    throw new Error("Category name is required.");
  }

  if (category === oldCategory) {
    return;
  }

  const products = await getProductCatalog({ includeInactive: true });
  const matchingProducts = products.filter(
    (product) => product.category === oldCategory,
  );

  await Promise.all(
    matchingProducts.map((product) => updateProductCategory(product, category)),
  );

  await saveCategorySection({
    ...section,
    category,
    title: category,
  });

  await setDoc(
    doc(db, categorySettingsCollection, getCategoryDocId(oldCategory)),
    {
      category: oldCategory,
      isDeleted: true,
      updatedAt: Date.now(),
    },
    {
      merge: true,
    },
  );
}

export async function deleteCategory(category) {
  const products = await getProductCatalog({ includeInactive: true });
  const matchingProducts = products.filter(
    (product) => product.category === category,
  );

  await Promise.all(
    matchingProducts.map((product) => setProductActive(product, false)),
  );

  await setDoc(
    doc(db, categorySettingsCollection, getCategoryDocId(category)),
    {
      category,
      isDeleted: true,
      updatedAt: Date.now(),
    },
    {
      merge: true,
    },
  );
}
