import { useEffect, useState } from "react";

import ProductCard from "../components/ProductCard";

import ProductModal from "../components/ProductModal";

import useProducts from "../hooks/useProducts";
import { getCategorySections } from "../services/categoryService";

export default function Shop() {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [categorySections, setCategorySections] = useState([]);

  const { products, isLoading, error } = useProducts();

  useEffect(() => {
    let isMounted = true;

    async function loadCategories() {
      try {
        const sections = await getCategorySections(products);

        if (isMounted) {
          setCategorySections(sections);
        }
      } catch (err) {
        console.error(err);
      }
    }

    if (products.length > 0) {
      loadCategories();
    }

    return () => {
      isMounted = false;
    };
  }, [products]);

  return (
    <section className="shopPage">
      <div className="shopHeader">
        <div>
          <span className="shopEyebrow">Shop</span>
          <h1>Custom Collection</h1>
        </div>

        <p>
          Choose a product, select a size or style, then add any required
          photos or notes at checkout.
        </p>
      </div>

      {isLoading && <div className="emptyCart">Loading products...</div>}

      {error && <div className="checkoutErrorCard">{error}</div>}

      {categorySections.map((section) => {
        const sectionProducts = products.filter(
          (product) => product.category === section.category,
        );

        if (sectionProducts.length === 0) {
          return null;
        }

        return (
          <div className="shopCategory" key={section.category}>
            <div className="shopCategoryHeader">
              <div>
                <h2>{section.title}</h2>

                <p className="categoryDescription">{section.description}</p>
              </div>

              <span className="categoryCount">
                {sectionProducts.length}{" "}
                {sectionProducts.length === 1 ? "item" : "items"}
              </span>
            </div>

            <div className="productGrid">
              {sectionProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={{
                    ...product,
                    displayCategory: section.title,
                  }}
                  onClick={() => setSelectedProduct(product)}
                />
              ))}
            </div>
          </div>
        );
      })}

      {selectedProduct && (
        <ProductModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}
    </section>
  );
}
