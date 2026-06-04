import { useState } from "react";

import { useCart } from "../context/CartContext";

export default function ProductModal({ product, onClose }) {
  const { addToCart } = useCart();

  const defaultOption = product.options.sizes
    ? product.options.sizes[0]
    : product.options.styles[0];

  const [selected, setSelected] = useState(defaultOption);

  const [childName, setChildName] = useState("");

  const [addedToCart, setAddedToCart] = useState(false);

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
                    {product.options.sizes[0].dimensions}
                  </div>
                </div>
              ) : (
                <div className="optionGroup">
                  <label>Choose Size</label>

                  <select
                    value={selected.label}
                    onChange={(e) =>
                      setSelected(
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
              <label>Choose Tag Style</label>

              <select
                value={selected.id}
                onChange={(e) =>
                  setSelected(
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
