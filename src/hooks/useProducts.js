import { useEffect, useState } from "react";

import {
  getProductCatalog,
  getStaticProductCatalog,
} from "../services/productService";

export default function useProducts(options) {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    async function loadProducts() {
      try {
        setIsLoading(true);
        setError("");

        const catalog = await getProductCatalog(options);

        if (isMounted) {
          setProducts(catalog);
        }
      } catch (err) {
        console.error(err);

        if (isMounted) {
          setProducts(getStaticProductCatalog(options));
          setError("Product catalog could not be loaded.");
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadProducts();

    return () => {
      isMounted = false;
    };
  }, [options?.includeInactive]);

  return {
    products,
    isLoading,
    error,
    setProducts,
  };
}
