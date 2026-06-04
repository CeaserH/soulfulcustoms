import { useState } from "react";

import products from "../data/products";

import ProductCard from "../components/ProductCard";

import ProductModal from "../components/ProductModal";

export default function Shop() {
  const [selectedProduct, setSelectedProduct] = useState(null);

  const fathersDayProducts = products.filter(
    (product) => product.category === "Father's Day",
  );

  const graduationProducts = products.filter(
    (product) => product.category === "Graduation",
  );

  const glassFrames = products.filter(
    (product) => product.category === "Glass",
  );

  const slateFrames = products.filter(
    (product) => product.category === "Slate",
  );

  const tags = products.filter((product) => product.category === "Tags");

  return (
    <section className="shopPage">
      <h1>Custom Collection</h1>

      <div className="shopCategory">
        <h2>Father's Day Collection</h2>

        <p className="categoryDescription">
          Meaningful personalized gifts designed to celebrate Dad.
        </p>

        <div className="productGrid">
          {fathersDayProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onClick={() => setSelectedProduct(product)}
            />
          ))}
        </div>
      </div>

      <div className="shopCategory">
        <h2>Graduation Collection</h2>

        <p className="categoryDescription">
          Personalized graduation keepsakes, apparel, and commemorative gifts.
        </p>

        <div className="productGrid">
          {graduationProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onClick={() => setSelectedProduct(product)}
            />
          ))}
        </div>
      </div>

      <div className="shopCategory">
        <h2>Glass Frames</h2>

        <p className="categoryDescription">
          Premium glass keepsakes with vibrant photo reproduction and elegant
          display stands.
        </p>

        <div className="productGrid">
          {glassFrames.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onClick={() => setSelectedProduct(product)}
            />
          ))}
        </div>
      </div>

      <div className="shopCategory">
        <h2>Slate Frames</h2>

        <p className="categoryDescription">
          Natural stone photo displays crafted to preserve life's most
          meaningful moments.
        </p>

        <div className="productGrid">
          {slateFrames.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onClick={() => setSelectedProduct(product)}
            />
          ))}
        </div>
      </div>

      <div className="shopCategory">
        <h2>Sports & Luggage Tags</h2>

        <p className="categoryDescription">
          Personalized tags perfect for athletes, teams, travel, and everyday
          identification.
        </p>

        <div className="productGrid">
          {tags.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onClick={() => setSelectedProduct(product)}
            />
          ))}
        </div>
      </div>

      {selectedProduct && (
        <ProductModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}
    </section>
  );
}
