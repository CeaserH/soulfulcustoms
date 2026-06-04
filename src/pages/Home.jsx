import React from "react";

import { Link } from "react-router-dom";
import HeroMarquee from "../components/HeroMarquee";

const logo = new URL("../assets/newlogotrans.png", import.meta.url).href;

export default function Home() {
  return (
    <section className="luxHero">
      <HeroMarquee />
      <div className="heroOverlay"></div>

      <img src={logo} className="luxLogo" alt="Soulful Customs" />

      <h1>Preserve Your Moments</h1>

      <p>
        Museum-quality photography prints, premium finishes, handcrafted
        presentation.
      </p>

      <div className="heroButtons">
        <Link to="/shop" className="primaryBtn">
          Order Prints
        </Link>

        <Link to="/about" className="secondaryBtn">
          Our Story
        </Link>
      </div>

      <div className="heroTags">
        <span>Custom Prints</span>

        <span>•</span>

        <span>Canvas</span>

        <span>•</span>

        <span>Portraits</span>

        <span>•</span>

        <span>Wall Art</span>

        <span>•</span>

        <span>Keepsakes</span>
      </div>
    </section>
  );
}
