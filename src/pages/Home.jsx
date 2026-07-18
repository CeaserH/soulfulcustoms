import React, { useState } from "react";

import { Link } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import ProductModal from "../components/ProductModal";
import products from "../data/products";

const glassLifestyle = new URL(
  "../assets/hero/lifestyle-glass-frame.png",
  import.meta.url,
).href;
const lightUpFrameBedtimeLifestyle = new URL(
  "../assets/hero/lifestyle-light-up-frame-bedtime.png",
  import.meta.url,
).href;
const slateLifestyle = new URL(
  "../assets/hero/lifestyle-slate-gift.png",
  import.meta.url,
).href;
const tagLifestyle = new URL(
  "../assets/hero/lifestyle-sports-tag.png",
  import.meta.url,
).href;
const teacherBadgeLifestyle = new URL(
  "../assets/hero/lifestyle-id-badge-teacher.png",
  import.meta.url,
).href;
const denimPinsLifestyle = new URL(
  "../assets/hero/lifestyle-button-pins-denim.png",
  import.meta.url,
).href;
const kitchenPotHoldersLifestyle = new URL(
  "../assets/hero/lifestyle-pot-holders-cooking.png",
  import.meta.url,
).href;

const heroTags = [
  "Backpacks",
  "Glass Frames",
  "Light-Up Frames",
  "Slate Frames",
  "Sports Tags",
  "ID Holders",
  "Button Pins",
  "Pot Holders",
];

const hiddenSaleCategories = new Set(["Father's Day", "Graduation"]);

const categoryHighlights = [
  {
    title: "Back To School",
    category: "Back to School",
    copy: "Personalized backpacks, lunch bags, pencil pouches, and school essentials.",
  },
  {
    title: "Glass Frames",
    category: "Glass",
    copy: "Glossy keepsakes with vivid photo color and clean display stands.",
  },
  {
    title: "Slate Frames",
    category: "Slate",
    copy: "Natural stone pieces with organic edges and a substantial feel.",
  },
  {
    title: "Sports & Luggage Tags",
    category: "Tags",
    copy: "Personalized tags for teams, travel bags, backpacks, and gifts.",
  },
];

const howItWorks = [
  {
    step: "01",
    title: "Choose your custom piece",
    copy: "Pick the frame, school essential, badge, pin, or tag style that fits the moment.",
  },
  {
    step: "02",
    title: "Add your details",
    copy: "Send the photos, style choices, and notes needed to personalize the piece.",
  },
  {
    step: "03",
    title: "Pickup locally",
    copy: "Soulful Customs confirms details and lets you know when it is ready.",
  },
];

const heroScenes = [
  {
    image: glassLifestyle,
    title: "Rectangle Glass Frame",
    label: "Glass frames",
    headline: "Preserve Your Memories",
    copy:
      "Turn favorite photos into polished glass keepsakes made for shelves, desks, and everyday reminders.",
  },
  {
    image: lightUpFrameBedtimeLifestyle,
    title: "Light-Up Glass Frame",
    label: "Light-up frames",
    imagePosition: "68% center",
    headline: "Keep Memories Close At Night",
    copy:
      "Add a soft glow to favorite family photos with a light-up glass frame made for bedside moments.",
  },
  {
    image: slateLifestyle,
    title: "Heart Rock Slate",
    label: "Slate frames",
    headline: "Give Moments More Meaning",
    copy:
      "Create a heartfelt stone slate gift with natural texture, rich color, and a personal story behind it.",
  },
  {
    image: tagLifestyle,
    title: "Sports / Luggage Tags",
    label: "Custom tags",
    headline: "Make Everyday Gear Personal",
    copy:
      "Add custom photos, colors, and details to sports bags, backpacks, and luggage tags.",
  },
  {
    image: denimPinsLifestyle,
    title: "Jean Jacket Button Pins",
    label: "Wearable keepsakes",
    imagePosition: "center 18%",
    headline: "Pin Memories Where They Show",
    copy:
      "Add photo buttons to jackets, bags, and everyday outfits for a small custom detail with personality.",
  },
  {
    image: teacherBadgeLifestyle,
    title: "Teacher ID/Badge Holder",
    label: "Teacher styles",
    headline: "Carry Your Style To Work",
    copy:
      "Choose a teacher-inspired holder style and add the name or title that makes it yours.",
  },
  {
    image: kitchenPotHoldersLifestyle,
    title: "Custom Kitchen Pot Holders",
    label: "Kitchen gifts",
    headline: "Make The Kitchen Personal",
    copy:
      "Turn family photos and custom artwork into useful kitchen pieces made for everyday cooking.",
  },
];

export default function Home({ isCompact = false }) {
  const [selectedProduct, setSelectedProduct] = useState(null);

  const visibleProducts = products.filter(
    (product) => !hiddenSaleCategories.has(product.category),
  );

  const featuredProducts = [12, 1, 6]
    .map((id) => visibleProducts.find((product) => product.id === id))
    .filter(Boolean);

  const galleryProducts = [1, 3, 4, 5, 6, 2]
    .map((id) => visibleProducts.find((product) => product.id === id))
    .filter(Boolean);

  return (
    <>
      <section className={`luxHero${isCompact ? " luxHeroCompact" : ""}`}>
        <div className="heroOverlay"></div>

        <div className="heroContent">
          <div className="heroCopy">
            <div className="heroTextCarousel" aria-live="polite">
              {heroScenes.map((scene, index) => (
                <div
                  className="heroTextSlide"
                  key={scene.headline}
                  style={{ "--scene-index": index }}
                >
                  <h1>{scene.headline}</h1>

                  <p>{scene.copy}</p>
                </div>
              ))}
            </div>

            <div className="heroButtons">
              <Link to="/shop" className="primaryBtn">
                Order Prints
              </Link>

              <Link to="/about" className="secondaryBtn">
                Our Story
              </Link>
            </div>

            <div className="heroTags" aria-label="Featured product types">
              {heroTags.map((tag) => (
                <span key={tag}>{tag}</span>
              ))}
            </div>
          </div>

          <div className="heroShowcase" aria-label="Product lifestyle scenes">
            {heroScenes.map((scene, index) => (
              <figure
                className={`heroScene${
                  scene.imagePosition ? " heroScenePositioned" : ""
                }`}
                key={scene.title}
                style={{
                  "--scene-index": index,
                  "--image-position": scene.imagePosition,
                }}
              >
                <img src={scene.image} alt={`${scene.title} lifestyle scene`} />

                <figcaption>
                  <span>{scene.label}</span>
                  <strong>{scene.title}</strong>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>

        <div className="heroBottomFade"></div>
      </section>

      <main
        className={`homeStorefront${
          isCompact ? " homeStorefrontCompact" : ""
        }`}
      >
        <section className="homeIntroBand">
          <div>
            <span className="sectionEyebrow">Start here</span>
            <h2>Custom pieces for the photos worth keeping close.</h2>
          </div>

          <p>
            Browse the core collection, add your details at checkout, and
            Soulful Customs will prepare your order for local pickup.
          </p>
        </section>

        <section className="homeCategoryGrid" aria-label="Shop by category">
          {categoryHighlights.map((category) => {
            const count = visibleProducts.filter(
              (product) => product.category === category.category,
            ).length;

            return (
              <Link
                to="/shop"
                className="homeCategoryCard"
                key={category.category}
              >
                <span>{count} options</span>
                <h3>{category.title}</h3>
                <p>{category.copy}</p>
              </Link>
            );
          })}
        </section>

        <section className="homeSplitSection">
          <div>
            <span className="sectionEyebrow">How it works</span>
            <h2>A simple path from favorite photo to finished keepsake.</h2>
          </div>

          <div className="processGrid">
            {howItWorks.map((item) => (
              <div className="processStep" key={item.step}>
                <span>{item.step}</span>
                <h3>{item.title}</h3>
                <p>{item.copy}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="homeProductSection">
          <div className="homeSectionHeader">
            <div>
              <span className="sectionEyebrow">Featured</span>
              <h2>Popular ways to customize.</h2>
            </div>

            <Link to="/shop" className="textLink">
              View all products
            </Link>
          </div>

          <div className="productGrid">
            {featuredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onClick={() => setSelectedProduct(product)}
              />
            ))}
          </div>
        </section>

        <section className="homeGallerySection">
          <div className="homeSectionHeader">
            <div>
              <span className="sectionEyebrow">Previous work</span>
              <h2>A growing gallery of personalized pieces.</h2>
            </div>

            <Link to="/contact" className="textLink">
              Ask a question
            </Link>
          </div>

          <div className="homeGalleryGrid">
            {galleryProducts.map((product) => (
              <img src={product.image} alt={product.name} key={product.id} />
            ))}
          </div>
        </section>

        <section className="homeTrustBand">
          <div>
            <strong>Pickup only</strong>
            <span>Local pickup arranged after your order is ready.</span>
          </div>

          <div>
            <strong>4-5 business days</strong>
            <span>Typical turnaround after purchase and order details.</span>
          </div>

          <div>
            <strong>Personalized orders</strong>
            <span>Each piece is made from the photos and notes you provide.</span>
          </div>
        </section>
      </main>

      {selectedProduct && (
        <ProductModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}
    </>
  );
}
