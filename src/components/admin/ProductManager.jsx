import { useEffect, useMemo, useState } from "react";

import {
  createAdminProduct,
  deleteAdminProduct,
  getProductCatalog,
  setProductActive,
  toTitleCase,
  updateProduct,
} from "../../services/productService";
import { getCategorySections } from "../../services/categoryService";
import { uploadFile } from "../../services/uploadService";

const emptySize = {
  id: "",
  label: "Standard",
  dimensions: "",
  price: "",
};

const emptyForm = {
  category: "",
  name: "",
  description: "",
  image: "",
  imageFile: null,
  isActive: true,
  stockQuantity: "0",
  requiredUploads: 1,
  skipUploads: false,
  allowCustomPhrase: true,
  freeCustomPhrase: false,
  optionKind: "sizes",
  visualStyles: [],
  sizes: [{ ...emptySize }],
};

function buildProductDetails(form) {
  const sizes = form.sizes.map((size) => ({
    ...size,
    price: Number(size.price),
  }));
  const sizeValue =
    sizes.length === 1
      ? sizes[0].dimensions
      : sizes
          .map((size) => `${size.label} ${size.dimensions}`.trim())
          .join(", ");

  const details = [
    { label: "Product", value: form.name },
    { label: sizes.length === 1 ? "Size" : "Sizes", value: sizeValue },
  ];

  if (form.skipUploads) {
    details.push({ label: "Uploads", value: "No customer photo upload required" });
  } else {
    details.push({
      label: "Uploads",
      value:
        Number(form.requiredUploads) === 1
          ? "Upload 1 photo"
          : `Upload ${Number(form.requiredUploads)} photos`,
    });
  }

  if (form.allowCustomPhrase && !form.freeCustomPhrase) {
    details.push({
      label: "Personalization",
      value: "Optional custom phrase available for $1",
    });
  }

  if (form.freeCustomPhrase) {
    details.push({
      label: "Personalization",
      value: "Message or paragraph included at no additional cost",
    });
  }

  return details;
}

function productToForm(product) {
  const optionKind = product.options?.visualStyles
    ? "quantities"
    : product.options?.styles
      ? "styles"
      : "sizes";
  const optionRows =
    product.options?.sizes || product.options?.styles || product.options?.quantities;

  return {
    category: product.category || "",
    name: product.name || "",
    description: product.description || "",
    image: product.image || "",
    imageFile: null,
    isActive: product.isActive !== false,
    stockQuantity: String(product.stockQuantity ?? 0),
    requiredUploads: product.requiredUploads || 1,
    skipUploads: Boolean(product.skipUploads),
    allowCustomPhrase: product.allowCustomPhrase !== false,
    freeCustomPhrase: Boolean(product.freeCustomPhrase),
    optionKind,
    visualStyles: product.options?.visualStyles || [],
    sizes:
      optionRows?.length > 0
        ? optionRows.map((size) => ({
            id: size.id || "",
            label: size.label || "Standard",
            dimensions: size.dimensions || size.description || "",
            price: String(size.price ?? ""),
          }))
        : [{ ...emptySize }],
  };
}

export default function ProductManager() {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [categorySections, setCategorySections] = useState([]);

  const categories = useMemo(
    () =>
      Array.from(new Set(products.map((product) => product.category))).sort(
        (a, b) => a.localeCompare(b),
      ),
    [products],
  );
  const categoryLabels = useMemo(
    () =>
      new Map(
        categorySections.map((section) => [section.category, section.title]),
      ),
    [categorySections],
  );
  const selectedCategoryValue =
    form.category && categories.includes(form.category)
      ? form.category
      : "__new__";

  async function loadProducts() {
    try {
      setIsLoading(true);
      setError("");

      const catalog = await getProductCatalog({ includeInactive: true });
      const sections = await getCategorySections(catalog);

      setProducts(catalog);
      setCategorySections(sections);
    } catch (err) {
      console.error(err);
      setError("Product catalog could not be loaded.");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadProducts();
  }, []);

  function resetForm() {
    setSelectedProduct(null);
    setForm(emptyForm);
    setMessage("");
    setError("");
  }

  function selectProduct(product) {
    setSelectedProduct(product);
    setForm(productToForm(product));
    setMessage("");
    setError("");
  }

  function updateForm(field, value) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  function updateSize(index, field, value) {
    setForm((current) => ({
      ...current,
      sizes: current.sizes.map((size, sizeIndex) =>
        sizeIndex === index
          ? {
              ...size,
              [field]: value,
            }
          : size,
      ),
    }));
  }

  function addSize() {
    setForm((current) => ({
      ...current,
      sizes: [
        ...current.sizes,
        {
          ...emptySize,
          label: `Option ${current.sizes.length + 1}`,
        },
      ],
    }));
  }

  function removeSize(index) {
    setForm((current) => ({
      ...current,
      sizes: current.sizes.filter((_, sizeIndex) => sizeIndex !== index),
    }));
  }

  function validateForm(nextForm) {
    if (
      String(nextForm.stockQuantity).trim() === "" ||
      !Number.isSafeInteger(Number(nextForm.stockQuantity)) ||
      Number(nextForm.stockQuantity) < 0
    ) {
      return "Stock quantity must be a whole number of zero or more.";
    }

    if (!nextForm.category.trim()) {
      return "Category is required.";
    }

    if (!nextForm.name.trim()) {
      return "Product title is required.";
    }

    if (!nextForm.description.trim()) {
      return "Product description is required.";
    }

    if (!nextForm.image && !nextForm.imageFile) {
      return "Product image is required.";
    }

    if (nextForm.sizes.length === 0) {
      return "At least one size and price option is required.";
    }

    for (const size of nextForm.sizes) {
      if (!size.label.trim()) {
        return "Every size option needs a label.";
      }

      if (!size.dimensions.trim()) {
        return "Every size option needs dimensions.";
      }

      if (!size.price || Number(size.price) <= 0) {
        return "Every size option needs a valid price.";
      }
    }

    return "";
  }

  async function handleSubmit(e) {
    e.preventDefault();

    const nextForm = {
      ...form,
      category: toTitleCase(form.category),
      name: toTitleCase(form.name),
      sizes: form.sizes.map((size) => ({
        ...size,
        label: toTitleCase(size.label),
      })),
    };
    const validationError = validateForm(nextForm);

    if (validationError) {
      setError(validationError);
      setMessage("");
      return;
    }

    try {
      setIsSaving(true);
      setError("");
      setMessage("");

      let image = nextForm.image;

      if (nextForm.imageFile) {
        const uploadResult = await uploadFile(nextForm.imageFile);
        image =
          uploadResult.url ||
          `${process.env.UPLOAD_WORKER_URL}?file=${uploadResult.fileId}`;
      }

      const sizes = nextForm.sizes.map((size) => ({
        id: size.id || size.label.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
        label: size.label,
        dimensions: size.dimensions.trim(),
        price: Number(size.price),
      }));
      const options =
        nextForm.optionKind === "styles"
          ? {
              styles: sizes.map((size) => ({
                id: size.id,
                label: size.label,
                description: size.dimensions,
                price: size.price,
              })),
            }
          : nextForm.optionKind === "quantities"
            ? {
                visualStyles: nextForm.visualStyles,
                quantities: sizes.map((size) => ({
                  id: size.id,
                  label: size.label,
                  description: size.dimensions,
                  price: size.price,
                })),
              }
            : {
                sizes,
              };
      const preservedProductConfig = selectedProduct
        ? {
            optionLabel: selectedProduct.optionLabel,
            quantityLabel: selectedProduct.quantityLabel,
            sizeOptionLabel: selectedProduct.sizeOptionLabel,
            personalization: selectedProduct.personalization,
            requiresChildName: selectedProduct.requiresChildName,
            requiresYouthSize: selectedProduct.requiresYouthSize,
            isCustomProject: selectedProduct.isCustomProject,
          }
        : {};

      const productDoc = {
        ...preservedProductConfig,
        name: nextForm.name,
        category: nextForm.category,
        description: nextForm.description.trim(),
        details: buildProductDetails(nextForm),
        image,
        basePrice: Math.min(...sizes.map((size) => size.price)),
        isActive: nextForm.isActive,
        stockQuantity: Number(nextForm.stockQuantity),
        requiredUploads: nextForm.skipUploads
          ? 0
          : Math.max(1, Number(nextForm.requiredUploads) || 1),
        skipUploads: nextForm.skipUploads,
        allowCustomPhrase: nextForm.allowCustomPhrase,
        freeCustomPhrase: nextForm.freeCustomPhrase,
        options,
      };

      if (selectedProduct) {
        await updateProduct(selectedProduct, productDoc);
        setMessage("Product updated.");
      } else {
        await createAdminProduct(productDoc);
        setMessage("Product added.");
      }

      setForm(emptyForm);
      setSelectedProduct(null);
      await loadProducts();
    } catch (err) {
      console.error(err);
      setError("Product could not be saved.");
    } finally {
      setIsSaving(false);
    }
  }

  async function handleActiveToggle(product) {
    try {
      setError("");
      setMessage("");

      await setProductActive(product, !product.isActive);
      await loadProducts();

      if (selectedProduct?.productKey === product.productKey) {
        setSelectedProduct({
          ...selectedProduct,
          isActive: !product.isActive,
        });
        updateForm("isActive", !product.isActive);
      }

      setMessage(
        `${product.name} is now ${product.isActive ? "inactive" : "active"}.`,
      );
    } catch (err) {
      console.error(err);
      setError("Product status could not be updated.");
    }
  }

  async function handleDeleteProduct(product) {
    if (!product?.canDelete) {
      setError("Original products cannot be deleted. Set them inactive instead.");
      return;
    }

    const shouldDelete = window.confirm(
      `Delete ${product.name}? This permanently removes the product from the admin-created catalog.`,
    );

    if (!shouldDelete) {
      return;
    }

    try {
      setError("");
      setMessage("");

      await deleteAdminProduct(product);
      resetForm();
      await loadProducts();
      setMessage(`${product.name} was deleted.`);
    } catch (err) {
      console.error(err);
      setError(
        err?.code === "permission-denied"
          ? "Firebase denied deletion. Update the products Firestore rule to allow delete for signed-in admins."
          : `Product could not be deleted. ${err?.message || ""}`.trim(),
      );
    }
  }

  return (
    <div className="adminProductManager">
      <aside className="adminSidebar adminProductSidebar">
        <div className="adminProductSidebarHeader">
          <h3 className="adminSectionTitle">Products</h3>

          <button type="button" className="adminGhostBtn" onClick={resetForm}>
            New Product
          </button>
        </div>

        {isLoading ? (
          <p className="adminMutedText">Loading products...</p>
        ) : (
          products.map((product) => (
            <button
              type="button"
              key={product.productKey}
              className={`adminOrderListItem adminProductListItem ${
                selectedProduct?.productKey === product.productKey ? "active" : ""
              }`}
              onClick={() => selectProduct(product)}
            >
              <img src={product.image} alt="" />

              <div>
                <strong>{product.name}</strong>
                <p>{product.category}</p>
                <p>{product.stockQuantity} in stock</p>
              </div>

              <span
                className={`statusBadge ${
                  product.isActive ? "status-ready" : "status-archived"
                }`}
              >
                {product.isActive ? "Active" : "Inactive"}
              </span>
            </button>
          ))
        )}
      </aside>

      <main className="adminContent">
        <form className="adminDetailCard adminProductForm" onSubmit={handleSubmit}>
          <div className="adminProductFormHeader">
            <div>
              <span className="adminSectionTitle">
                {selectedProduct ? "Edit Product" : "New Product"}
              </span>

              <h2>
                {selectedProduct
                  ? selectedProduct.isEditable
                    ? selectedProduct.name
                    : `${selectedProduct.name} Status`
                  : "Add Product"}
              </h2>
            </div>

            {selectedProduct && (
              <div className="adminProductActions">
                <button
                  type="button"
                  className="adminGhostBtn"
                  onClick={() => handleActiveToggle(selectedProduct)}
                >
                  Set {selectedProduct.isActive ? "Inactive" : "Active"}
                </button>

                {selectedProduct.canDelete && (
                  <button
                    type="button"
                    className="adminGhostBtn adminDangerBtn"
                    onClick={() => handleDeleteProduct(selectedProduct)}
                  >
                    Delete
                  </button>
                )}
              </div>
            )}
          </div>

          {selectedProduct && !selectedProduct.canDelete && (
            <div className="adminInlineNotice">
              This is an original product. Edits are saved in Firebase and can
              change what customers see, but deletion is disabled. Set it
              inactive to hide it from the shop.
            </div>
          )}

          {message && <div className="adminSuccessNotice">{message}</div>}
          {error && <div className="checkoutErrorCard">{error}</div>}

          <fieldset>
            <div className="adminFormGrid">
              <label>
                Category
                <select
                  value={selectedCategoryValue}
                  required
                  onChange={(e) =>
                    updateForm(
                      "category",
                      e.target.value === "__new__" ? "" : e.target.value,
                    )
                  }
                >
                  <option value="" disabled>
                    Select Category
                  </option>

                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {categoryLabels.get(category) || category}
                    </option>
                  ))}

                  <option value="__new__">Create New Category</option>
                </select>
              </label>

              {selectedCategoryValue === "__new__" && (
                <label>
                  New Category
                  <input
                    type="text"
                    value={form.category}
                    required
                    onBlur={(e) =>
                      updateForm("category", toTitleCase(e.target.value))
                    }
                    onChange={(e) => updateForm("category", e.target.value)}
                    placeholder="Example: Home Goods"
                  />
                </label>
              )}

              <label>
                Title
                <input
                  type="text"
                  value={form.name}
                  required
                  onBlur={(e) => updateForm("name", toTitleCase(e.target.value))}
                  onChange={(e) => updateForm("name", e.target.value)}
                  placeholder="Example: Round Glass Frame"
                />
              </label>

              <label className="adminFullField">
                Description
                <textarea
                  value={form.description}
                  required
                  onChange={(e) => updateForm("description", e.target.value)}
                  placeholder="Short product description shown on the product card."
                />
              </label>

              <label>
                Stock quantity
                <input
                  type="number"
                  min="0"
                  step="1"
                  required
                  value={form.stockQuantity}
                  onChange={(e) => updateForm("stockQuantity", e.target.value)}
                />
                <small>Enter 0 to mark this product temporarily out of stock.</small>
              </label>

              <label>
                Product Image
                <input
                  type="file"
                  accept="image/*"
                  required={!form.image}
                  onChange={(e) =>
                    updateForm("imageFile", e.target.files?.[0] || null)
                  }
                />
              </label>

              {(form.image || form.imageFile) && (
                <div className="adminImagePreview">
                  <img
                    src={
                      form.imageFile
                        ? URL.createObjectURL(form.imageFile)
                        : form.image
                    }
                    alt="Product preview"
                  />
                </div>
              )}
            </div>

            <div className="adminProductOptions">
              <div className="adminProductFormHeader">
                <div>
                  <span className="adminSectionTitle">Sizes & Pricing</span>
                  <h3>Required Options</h3>
                </div>

                <button type="button" className="adminGhostBtn" onClick={addSize}>
                  Add Size
                </button>
              </div>

              {form.sizes.map((size, index) => (
                <div className="adminSizeRow" key={`size-${index}`}>
                  <label>
                    Label
                    <input
                      type="text"
                      value={size.label}
                      required
                      onBlur={(e) => updateSize(index, "label", toTitleCase(e.target.value))}
                      onChange={(e) => updateSize(index, "label", e.target.value)}
                    />
                  </label>

                  <label>
                    Size / Dimensions
                    <input
                      type="text"
                      value={size.dimensions}
                      required
                      onChange={(e) =>
                        updateSize(index, "dimensions", e.target.value)
                      }
                      placeholder={'Example: 8" x 10"'}
                    />
                  </label>

                  <label>
                    Price
                    <input
                      type="number"
                      min="0.01"
                      step="0.01"
                      value={size.price}
                      required
                      onChange={(e) => updateSize(index, "price", e.target.value)}
                    />
                  </label>

                  <button
                    type="button"
                    className="removeBtn"
                    disabled={form.sizes.length === 1}
                    onClick={() => removeSize(index)}
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>

            <div className="adminProductToggles">
              <label className="phraseCheckbox">
                <input
                  type="checkbox"
                  checked={form.isActive}
                  onChange={(e) => updateForm("isActive", e.target.checked)}
                />
                Show product on the shop page
              </label>

              <label className="phraseCheckbox">
                <input
                  type="checkbox"
                  checked={form.skipUploads}
                  onChange={(e) => updateForm("skipUploads", e.target.checked)}
                />
                No customer photo upload required
              </label>

              {!form.skipUploads && (
                <label>
                  Customer Photo Uploads Required
                  <input
                    type="number"
                    min="1"
                    step="1"
                    value={form.requiredUploads}
                    required
                    onChange={(e) => updateForm("requiredUploads", e.target.value)}
                  />
                </label>
              )}

              <label className="phraseCheckbox">
                <input
                  type="checkbox"
                  checked={form.allowCustomPhrase}
                  onChange={(e) =>
                    updateForm("allowCustomPhrase", e.target.checked)
                  }
                />
                Allow optional custom phrase (+$1)
              </label>

              <label className="phraseCheckbox">
                <input
                  type="checkbox"
                  checked={form.freeCustomPhrase}
                  onChange={(e) => updateForm("freeCustomPhrase", e.target.checked)}
                />
                Require included message / paragraph
              </label>
            </div>
          </fieldset>

          <button
            type="submit"
            className="primaryBtn"
            disabled={isSaving || (selectedProduct && !selectedProduct.isEditable)}
          >
            {isSaving
              ? "Saving..."
              : selectedProduct
                ? "Save Product"
                : "Add Product"}
          </button>
        </form>
      </main>
    </div>
  );
}
