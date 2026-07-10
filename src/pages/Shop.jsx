import { useState } from "react";

import products from "../data/products";

import ProductCard from "../components/ProductCard";

import ProductModal from "../components/ProductModal";

const hiddenSaleCategories = new Set(["Father's Day", "Graduation"]);

const categorySections = [
  {
    title: "Limited-Time Presale",
    category: "Back To School Presale",
    description:
      "Back to school bundle pricing available 7/11-7/18 while presale is open.",
  },
  {
    title: "Back To School",
    category: "Back to School",
    description:
      "Personalized school essentials, including the limited-time presale bundle.",
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

export default function Shop() {
  const [selectedProduct, setSelectedProduct] = useState(null);

  const visibleProducts = products.filter(
    (product) => !hiddenSaleCategories.has(product.category),
  );

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

      {categorySections.map((section) => {
        const sectionProducts = visibleProducts.filter(
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
                  product={product}
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
