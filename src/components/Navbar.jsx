import React, { useEffect, useState } from "react";

import { Link, useLocation } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";

import { useCart } from "../context/CartContext";
import { ADMIN_EMAILS } from "../config/adminEmails";
import { auth } from "../firebase";
import { hasActiveAdminSession } from "../services/adminSessionService";

const logo = new URL("../assets/newflamesmalltrans.png", import.meta.url).href;

export default function Navbar() {
  const location = useLocation();

  const { cart } = useCart();
  const [showAdminLink, setShowAdminLink] = useState(false);

  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);

  useEffect(() => {
    function updateAdminLink(currentUser) {
      setShowAdminLink(
        Boolean(
          currentUser &&
            ADMIN_EMAILS.includes(currentUser.email) &&
            hasActiveAdminSession(),
        ),
      );
    }

    const unsubscribe = onAuthStateChanged(auth, updateAdminLink);
    const sessionTimer = window.setInterval(() => {
      updateAdminLink(auth.currentUser);
    }, 30000);

    return () => {
      unsubscribe();
      window.clearInterval(sessionTimer);
    };
  }, []);

  return (
    <header className="navbar">
      <div className="navLeft">
        <Link to="/" className="logoLink">
          <span className="navBrand" aria-label="Soulful Customs">
            <img src={logo} alt="" className="navBrandMark" />

            <span className="navBrandText">
              <strong>SOULFUL</strong>
              <span>CUSTOMS</span>
            </span>
          </span>
        </Link>
      </div>

      <nav>
        <Link to="/" className={location.pathname === "/" ? "activeNav" : ""}>
          Home
        </Link>

        <Link
          to="/shop"
          className={location.pathname === "/shop" ? "activeNav" : ""}
        >
          Shop
        </Link>

        <Link
          to="/about"
          className={location.pathname === "/about" ? "activeNav" : ""}
        >
          About
        </Link>

        <Link
          to="/contact"
          className={location.pathname === "/contact" ? "activeNav" : ""}
        >
          Contact
        </Link>
      </nav>

      <div className="navRight">
        {showAdminLink && (
          <Link
            to="/admin"
            className={`adminPortalLink ${
              location.pathname === "/admin" ? "isActive" : ""
            }`}
          >
            Admin Portal
          </Link>
        )}

        <Link to="/checkout" className="cartButton">
          🛒
          <span
            className={`cartCount ${
              cartCount > 0 ? "cartCountActive" : "cartCountEmpty"
            }`}
          >
            {cartCount}
          </span>
        </Link>
      </div>
    </header>
  );
}
