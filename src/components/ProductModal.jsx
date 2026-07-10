import { useState } from "react";

import { useCart } from "../context/CartContext";

export default function ProductModal({ product, onClose }) {
  const { addToCart } = useCart();

  const sizeOptionLabel = product.sizeOptionLabel || "Choose Size";
  const styleOptionLabel =
    product.optionLabel ||
    (product.category === "Tags" ? "Choose Tag Style" : "Choose Style");
  const quantityOptionLabel = product.quantityLabel || "Choose Quantity";
  const hasVisualStyleOptions = Boolean(
    product.options.visualStyles?.length && product.options.quantities?.length,
  );

  const defaultOption = product.options.sizes
    ? product.options.sizes[0]
    : product.options.styles?.[0];

  const [selectedOption, setSelectedOption] = useState(defaultOption);

  const [selectedVisualStyles, setSelectedVisualStyles] = useState(
    product.options.visualStyles ? [product.options.visualStyles[0]] : [],
  );

  const [activeVisualStyleIndex, setActiveVisualStyleIndex] = useState(0);

  const [selectedQuantity, setSelectedQuantity] = useState(
    product.options.quantities?.[0],
  );

  const [childName, setChildName] = useState("");

  const [addedToCart, setAddedToCart] = useState(false);

  const selectedBadgeCount =
    selectedQuantity?.id === "three-pack" ? 3 : 1;
  const activeVisualStyles = hasVisualStyleOptions
    ? Array.from({ length: selectedBadgeCount }, (_, index) =>
        selectedVisualStyles[index] || product.options.visualStyles[0],
      )
    : [];
  const selectedStyleLabels = activeVisualStyles.map((style) => style.label);

  const selected = hasVisualStyleOptions
    ? {
        id: `${selectedStyleLabels.join("-")}-${selectedQuantity.id}`,
        label:
          selectedBadgeCount === 1
            ? `${activeVisualStyles[0].label} - ${selectedQuantity.label}`
            : `${selectedStyleLabels.join(", ")} - ${selectedQuantity.label}`,
        description:
          selectedQuantity.description || activeVisualStyles[0].description,
        price: selectedQuantity.price,
        styleId: activeVisualStyles[0].id,
        styleLabel: activeVisualStyles[0].label,
        styleNumber: activeVisualStyles[0].styleNumber,
        styles: activeVisualStyles.map((style, index) => ({
          badgeNumber: index + 1,
          id: style.id,
          label: style.label,
          styleNumber: style.styleNumber,
          image: style.image,
        })),
        quantityId: selectedQuantity.id,
        quantityLabel: selectedQuantity.label,
        image: activeVisualStyles[0].image,
      }
    : selectedOption;

  function handleVisualStyleSelect(style) {
    setSelectedVisualStyles((currentStyles) => {
      const nextStyles = [...activeVisualStyles];

      nextStyles[activeVisualStyleIndex] = style;

      return nextStyles;
    });

    if (activeVisualStyleIndex < selectedBadgeCount - 1) {
      setActiveVisualStyleIndex(activeVisualStyleIndex + 1);
    }
  }

  function handleQuantityChange(quantityId) {
    const nextQuantity = product.options.quantities.find(
      (quantity) => quantity.id === quantityId,
    );
    const nextCount = nextQuantity.id === "three-pack" ? 3 : 1;

    setSelectedQuantity(nextQuantity);
    setSelectedVisualStyles((currentStyles) =>
      Array.from(
        { length: nextCount },
        (_, index) => currentStyles[index] || product.options.visualStyles[0],
      ),
    );
    setActiveVisualStyleIndex((currentIndex) =>
      Math.min(currentIndex, nextCount - 1),
    );
  }

  function handleAddToCart() {
    if (product.requiresChildName && !childName.trim()) {
      alert("Please enter the child's name.");

      return;
    }

    addToCart({
      ...product,

      selectedOption: selected,

      price: selected.price,

      quantity: 1,

      childName,
    });

    setAddedToCart(true);

    setTimeout(() => {
      setAddedToCart(false);
    }, 2500);
  }

  return (
    <div className="modalOverlay" onClick={onClose}>
      <div className="productModal" onClick={(e) => e.stopPropagation()}>
        <button className="closeModal" onClick={onClose}>
          ✕
        </button>

        <img src={product.image} alt={product.name} className="modalImage" />

        <div className="modalContent">
          <h2>{product.name}</h2>

          <p>{product.description}</p>

          {product.options.sizes && (
            <>
              {product.options.sizes.length === 1 ? (
                <div className="optionGroup">
                  <label>Size</label>

                  <div className="singleOptionDisplay">
                    {product.options.sizes[0].dimensions ||
                      product.options.sizes[0].label}
                  </div>
                </div>
              ) : (
                <div className="optionGroup">
                  <label>{sizeOptionLabel}</label>

                  <select
                    value={selected.label}
                    onChange={(e) =>
                      setSelectedOption(
                        product.options.sizes.find(
                          (s) => s.label === e.target.value,
                        ),
                      )
                    }
                  >
                    {product.options.sizes.map((size) => (
                      <option key={size.label} value={size.label}>
                        {size.label}
                        {" • "}
                        {size.dimensions}
                        {" • $"}
                        {size.price.toFixed(2)}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </>
          )}

          {product.options.styles && (
            <div className="optionGroup">
              <label>{styleOptionLabel}</label>

              <select
                value={selected.id}
                onChange={(e) =>
                  setSelectedOption(
                    product.options.styles.find((s) => s.id === e.target.value),
                  )
                }
              >
                {product.options.styles.map((style) => (
                  <option key={style.id} value={style.id}>
                    {style.label}
                  </option>
                ))}
              </select>
            </div>
          )}

          {hasVisualStyleOptions && (
            <>
              <div className="optionGroup visualOptionGroup">
                <label>{styleOptionLabel}</label>

                {selectedBadgeCount > 1 && (
                  <div className="badgeSelectionSlots">
                    {activeVisualStyles.map((style, index) => (
                      <button
                        type="button"
                        className={`badgeSelectionSlot${
                          activeVisualStyleIndex === index ? " isActive" : ""
                        }`}
                        key={`badge-slot-${index}`}
                        onClick={() => setActiveVisualStyleIndex(index)}
                      >
                        <span>Holder {index + 1}</span>
                        <strong>{style.label}</strong>
                      </button>
                    ))}
                  </div>
                )}

                <div className="badgeStyleGrid">
                  {product.options.visualStyles.map((style) => (
                    <button
                      type="button"
                      className={`badgeStyleOption${
                        activeVisualStyles.some(
                          (selectedStyle) => selectedStyle.id === style.id,
                        )
                          ? " isSelected"
                          : ""
                      }`}
                      key={style.id}
                      onClick={() => handleVisualStyleSelect(style)}
                    >
                      <img src={style.image} alt={style.label} />

                      <span>{style.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="optionGroup">
                <label>{quantityOptionLabel}</label>

                <select
                  value={selectedQuantity.id}
                  onChange={(e) => handleQuantityChange(e.target.value)}
                >
                  {product.options.quantities.map((quantity) => (
                    <option key={quantity.id} value={quantity.id}>
                      {quantity.label}
                      {" - $"}
                      {quantity.price.toFixed(2)}
                    </option>
                  ))}
                </select>
              </div>
            </>
          )}

          {product.requiresChildName && (
            <div className="optionGroup">
              <label>Child's Name</label>

              <input
                type="text"
                value={childName}
                onChange={(e) => setChildName(e.target.value)}
                placeholder="Enter child's name"
                className="modalInput"
              />
            </div>
          )}

          {selected.description && (
            <div className="optionDescription">{selected.description}</div>
          )}

          <div className="modalPriceBlock">
            <span>Price</span>

            <h3 className="modalPrice">${selected.price.toFixed(2)}</h3>
          </div>

          <div className="heroButtons">
            <button className="primaryBtn" onClick={handleAddToCart}>
              Add To Cart
            </button>
          </div>
        </div>

        {addedToCart && (
          <div className="cartToast">
            <div className="cartToastIcon">✓</div>

            <div>
              <strong>Added To Cart</strong>

              <p>
                {product.name}
                {" • "}
                {selected.label}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
