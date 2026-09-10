import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  orderBy,
  query,
  setDoc,
  updateDoc,
} from "firebase/firestore";

import staticProducts from "../data/products";
import { db } from "../firebase";
import { getStockQuantity } from "../utils/stock";

const productsCollection = "products";
const productOverridesCollection = "productOverrides";
const acronyms = new Set(["id", "led"]);

function titleCaseWord(word) {
  if (acronyms.has(word.toLowerCase())) {
    return word.toUpperCase();
  }

  return word.charAt(0).toUpperCase() + word.slice(1);
}

export function toTitleCase(value) {
  return value
    .trim()
    .replace(/\s+/g, " ")
    .toLowerCase()
    .replace(/\b[\w']+/g, (word) => {
      if (word.includes("/")) {
        return word
          .split("/")
          .map((part) => toTitleCase(part))
          .join("/");
      }

      return titleCaseWord(word);
    });
}

function normalizeProduct(product) {
  const normalizedOptions = product.options || {};
  const firstSize = normalizedOptions.sizes?.[0];
  const firstStyle = normalizedOptions.styles?.[0];
  const firstQuantity = normalizedOptions.quantities?.[0];

  return {
    ...product,
    options: normalizedOptions,
    stockQuantity: getStockQuantity(product),
    basePrice:
      Number(product.basePrice) ||
      Number(firstSize?.price) ||
      Number(firstStyle?.price) ||
      Number(firstQuantity?.price) ||
      0,
    isActive: product.isActive !== false,
  };
}

function removeUndefined(value) {
  if (Array.isArray(value)) {
    return value.map(removeUndefined);
  }

  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value)
        .filter(([, entryValue]) => entryValue !== undefined)
        .map(([key, entryValue]) => [key, removeUndefined(entryValue)]),
    );
  }

  return value;
}

function applyOverrides(product, overridesById) {
  const override = overridesById.get(String(product.id));

  return normalizeProduct({
    ...product,
    ...override,
    id: product.id,
    source: "static",
    productKey: `static-${product.id}`,
    isEditable: true,
    canDelete: false,
  });
}

export async function getProductCatalog({ includeInactive = false } = {}) {
  const [productsSnapshot, overridesSnapshot] = await Promise.all([
    getDocs(query(collection(db, productsCollection), orderBy("createdAt", "desc"))),
    getDocs(collection(db, productOverridesCollection)),
  ]);

  const overridesById = new Map(
    overridesSnapshot.docs.map((snapshot) => [snapshot.id, snapshot.data()]),
  );

  const staticCatalog = staticProducts.map((product) =>
    applyOverrides(product, overridesById),
  );

  const adminCatalog = productsSnapshot.docs.map((snapshot) =>
    normalizeProduct({
      firestoreId: snapshot.id,
      id: `admin-${snapshot.id}`,
      productKey: `admin-${snapshot.id}`,
      source: "admin",
      isEditable: true,
      canDelete: true,
      ...snapshot.data(),
    }),
  );

  const catalog = [...adminCatalog, ...staticCatalog];

  if (includeInactive) {
    return catalog;
  }

  return catalog.filter((product) => product.isActive);
}

export function getStaticProductCatalog({ includeInactive = false } = {}) {
  const catalog = staticProducts.map((product) =>
    normalizeProduct({
      ...product,
      source: "static",
      productKey: `static-${product.id}`,
      isEditable: true,
      canDelete: false,
    }),
  );

  if (includeInactive) {
    return catalog;
  }

  return catalog.filter((product) => product.isActive);
}

export async function createAdminProduct(product) {
  const productDoc = removeUndefined({
    ...product,
    name: toTitleCase(product.name),
    category: toTitleCase(product.category),
    isActive: product.isActive !== false,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  });

  return addDoc(collection(db, productsCollection), productDoc);
}

export async function updateAdminProduct(firestoreId, product) {
  const productDoc = removeUndefined({
    ...product,
    name: toTitleCase(product.name),
    category: toTitleCase(product.category),
    isActive: product.isActive !== false,
    updatedAt: Date.now(),
  });

  await updateDoc(doc(db, productsCollection, firestoreId), productDoc);
}

export async function updateProduct(product, updates) {
  if (product.source === "admin") {
    await updateAdminProduct(product.firestoreId, updates);

    return;
  }

  const productDoc = removeUndefined({
    ...updates,
    name: toTitleCase(updates.name),
    category: toTitleCase(updates.category),
    isActive: updates.isActive !== false,
    updatedAt: Date.now(),
  });

  await setDoc(
    doc(db, productOverridesCollection, String(product.id)),
    productDoc,
    {
      merge: true,
    },
  );
}

export async function setProductActive(product, isActive) {
  if (product.source === "admin") {
    await updateDoc(doc(db, productsCollection, product.firestoreId), {
      isActive,
      updatedAt: Date.now(),
    });

    return;
  }

  await setDoc(
    doc(db, productOverridesCollection, String(product.id)),
    {
      isActive,
      updatedAt: Date.now(),
    },
    {
      merge: true,
    },
  );
}

export async function updateProductCategory(product, category) {
  const productCategory = toTitleCase(category);

  if (product.source === "admin") {
    await updateDoc(doc(db, productsCollection, product.firestoreId), {
      category: productCategory,
      updatedAt: Date.now(),
    });

    return;
  }

  await setDoc(
    doc(db, productOverridesCollection, String(product.id)),
    {
      category: productCategory,
      updatedAt: Date.now(),
    },
    {
      merge: true,
    },
  );
}

export async function deleteAdminProduct(product) {
  if (product.source !== "admin" || !product.firestoreId) {
    throw new Error("Only admin-created products can be deleted.");
  }

  await deleteDoc(doc(db, productsCollection, product.firestoreId));
}
