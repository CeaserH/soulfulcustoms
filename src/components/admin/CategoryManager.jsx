import { useEffect, useState } from "react";

import {
  deleteCategory,
  getCategorySections,
  renameCategory,
  saveCategoryOrder,
  saveCategorySection,
} from "../../services/categoryService";
import { getProductCatalog } from "../../services/productService";

function getCategoryErrorMessage(action, err) {
  if (err?.code === "permission-denied") {
    return `Category ${action} was blocked by Firestore rules. Allow authenticated create/update on categorySettings.`;
  }

  return `Category could not be ${action}.`;
}

export default function CategoryManager() {
  const [products, setProducts] = useState([]);
  const [sections, setSections] = useState([]);
  const [renameValues, setRenameValues] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function loadCategories() {
    try {
      setIsLoading(true);
      setError("");

      const products = await getProductCatalog({ includeInactive: true });
      const categorySections = await getCategorySections(products);

      setProducts(products);
      setSections(categorySections);
      setRenameValues(
        Object.fromEntries(
          categorySections.map((section) => [section.category, section.category]),
        ),
      );
    } catch (err) {
      console.error(err);
      setError("Categories could not be loaded.");
    } finally {
      setIsLoading(false);
    }
  }

  function getProductCount(category) {
    return products.filter((product) => product.category === category).length;
  }

  useEffect(() => {
    loadCategories();
  }, []);

  function updateSection(category, field, value) {
    setSections((current) =>
      current.map((section) =>
        section.category === category
          ? {
              ...section,
              [field]: value,
            }
          : section,
      ),
    );
  }

  async function moveSection(index, direction) {
    const nextIndex = index + direction;

    if (nextIndex < 0 || nextIndex >= sections.length) {
      return;
    }

    const nextSections = [...sections];
    const [section] = nextSections.splice(index, 1);

    nextSections.splice(nextIndex, 0, section);
    setSections(nextSections);

    try {
      setMessage("");
      setError("");
      await saveCategoryOrder(nextSections);
      setMessage("Category order saved.");
    } catch (err) {
      console.error(err);
      setError(getCategoryErrorMessage("order saved", err));
    }
  }

  async function handleSave(section) {
    if (!section.title.trim()) {
      setError("Category title is required.");
      return;
    }

    if (!section.description.trim()) {
      setError("Category description is required.");
      return;
    }

    try {
      setIsSaving(true);
      setMessage("");
      setError("");

      await saveCategorySection(section);
      await loadCategories();
      setMessage(`${section.title} was updated.`);
    } catch (err) {
      console.error(err);
      setError(getCategoryErrorMessage("saved", err));
    } finally {
      setIsSaving(false);
    }
  }

  async function handleRename(section) {
    const nextCategory = renameValues[section.category]?.trim();

    if (!nextCategory) {
      setError("New category name is required.");
      setMessage("");
      return;
    }

    if (nextCategory === section.category) {
      setError("Enter a different category name before renaming.");
      setMessage("");
      return;
    }

    const confirmed = window.confirm(
      `Rename "${section.category}" to "${nextCategory}" and move all products in this category?`,
    );

    if (!confirmed) {
      return;
    }

    try {
      setIsSaving(true);
      setMessage("");
      setError("");

      await renameCategory(section.category, nextCategory, section);
      await loadCategories();
      setMessage(`Category renamed to ${nextCategory}.`);
    } catch (err) {
      console.error(err);
      setError(getCategoryErrorMessage("renamed", err));
    } finally {
      setIsSaving(false);
    }
  }

  async function handleDelete(section) {
    const productCount = getProductCount(section.category);
    const confirmed = window.confirm(
      `Delete "${section.title}" from the shop? This will make ${productCount} product${productCount === 1 ? "" : "s"} in this category inactive.`,
    );

    if (!confirmed) {
      return;
    }

    try {
      setIsSaving(true);
      setMessage("");
      setError("");

      await deleteCategory(section.category);
      await loadCategories();
      setMessage(`${section.title} was removed from the shop.`);
    } catch (err) {
      console.error(err);
      setError(getCategoryErrorMessage("deleted", err));
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <section className="adminDetailCard adminCategoryManager">
      <div className="adminProductFormHeader">
        <div>
          <span className="adminSectionTitle">Categories</span>
          <h2>Shop Category Order</h2>
        </div>
      </div>

      <div className="adminInlineNotice">
        Rename the public category heading, update its description, or move it
        higher or lower on the shop page. Products stay connected to their
        category behind the scenes.
      </div>

      {message && <div className="adminSuccessNotice">{message}</div>}
      {error && <div className="checkoutErrorCard">{error}</div>}

      {isLoading ? (
        <p className="adminMutedText">Loading categories...</p>
      ) : (
        <div className="adminCategoryList">
          {sections.map((section, index) => (
            <article className="adminCategoryCard" key={section.category}>
              <div className="adminCategoryMove">
                <span className="adminCategoryCount">
                  {getProductCount(section.category)}{" "}
                  {getProductCount(section.category) === 1 ? "product" : "products"}
                </span>

                <button
                  type="button"
                  className="adminGhostBtn"
                  disabled={index === 0}
                  onClick={() => moveSection(index, -1)}
                >
                  Move Up
                </button>

                <button
                  type="button"
                  className="adminGhostBtn"
                  disabled={index === sections.length - 1}
                  onClick={() => moveSection(index, 1)}
                >
                  Move Down
                </button>
              </div>

              <div className="adminCategoryForm">
                <label>
                  Category Key
                  <input type="text" value={section.category} disabled />
                </label>

                <label>
                  Display Title
                  <input
                    type="text"
                    value={section.title}
                    required
                    onChange={(e) =>
                      updateSection(section.category, "title", e.target.value)
                    }
                  />
                </label>

                <label className="adminFullField">
                  Description
                  <textarea
                    value={section.description}
                    required
                    onChange={(e) =>
                      updateSection(
                        section.category,
                        "description",
                        e.target.value,
                      )
                    }
                  />
                </label>

                <label className="adminFullField">
                  Rename Actual Category
                  <input
                    type="text"
                    value={renameValues[section.category] || ""}
                    onChange={(e) =>
                      setRenameValues((current) => ({
                        ...current,
                        [section.category]: e.target.value,
                      }))
                    }
                  />
                </label>
              </div>

              <div className="adminCategoryActions">
                <button
                  type="button"
                  className="primaryBtn"
                  disabled={isSaving}
                  onClick={() => handleSave(section)}
                >
                  Save Category
                </button>

                <button
                  type="button"
                  className="adminGhostBtn"
                  disabled={isSaving}
                  onClick={() => handleRename(section)}
                >
                  Rename Category
                </button>

                <button
                  type="button"
                  className="adminGhostBtn adminDangerBtn"
                  disabled={isSaving}
                  onClick={() => handleDelete(section)}
                >
                  Delete Category
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
