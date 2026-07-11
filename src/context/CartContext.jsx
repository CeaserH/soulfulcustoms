import { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem("cart");

    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  const buildUploads = (count) => {
    return Array.from({
      length: count,
    }).map(() => ({
      file: null,

      uploadedId: null,

      note: "",

      hasPhrase: false,

      customPhrase: "",
    }));
  };

  const getUploadSlots = (product, quantity = 1) => {
    if (product.skipUploads) {
      return 0;
    }

    if (product.selectedOption?.id === "doubleDifferent") {
      return quantity * 2;
    }

    if (product.requiredUploads) {
      return product.requiredUploads * quantity;
    }

    return quantity;
  };

  const addToCart = (product) => {
    setCart((prev) => {
      // Custom project products
      // ALWAYS create a new cart item

      if (product.isCustomProject) {
        return [
          ...prev,

          {
            ...product,

            cartItemId: crypto.randomUUID(),

            quantity: 1,

            childName: product.childName || "",

            uploads: buildUploads(getUploadSlots(product)),
          },
        ];
      }

      const existing = prev.find((item) => {
        if (item.id !== product.id) {
          return false;
        }

        if (item.selectedOption?.label !== product.selectedOption?.label) {
          return false;
        }

        if ((item.personalizationText || "") !== (product.personalizationText || "")) {
          return false;
        }

        return true;
      });

      if (existing) {
        return prev.map((item) => {
          if (
            item.id !== product.id ||
            item.selectedOption?.label !== product.selectedOption?.label ||
            (item.personalizationText || "") !== (product.personalizationText || "")
          ) {
            return item;
          }

          const qty = item.quantity + 1;

          const uploadSlots = getUploadSlots(item, qty);

          return {
            ...item,

            quantity: qty,

            uploads: buildUploads(uploadSlots),
          };
        });
      }

      return [
        ...prev,

        {
          ...product,

          cartItemId: crypto.randomUUID(),

          quantity: 1,

          childName: product.childName || "",

          uploads: buildUploads(getUploadSlots(product)),
        },
      ];
    });
  };

  return (
    <CartContext.Provider
      value={{
        cart,

        setCart,

        addToCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
