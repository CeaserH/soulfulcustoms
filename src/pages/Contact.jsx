import React from "react";

export default function Contact() {
  return (
    <section className="section">
      <div className="section-container">
        <h2>Contact Us</h2>

        <div className="contact-grid">
          <div className="contact-card">
            <h3>Email</h3>
            <p>support@soulfulcustoms.shop</p>
          </div>

          <div className="contact-card">
            <h3>Instagram</h3>
            <p>@soulfulcustoms</p>
          </div>

          <div className="contact-card">
            <h3>Turnaround</h3>
            <p>3-7 Business Days</p>
          </div>
        </div>
      </div>
    </section>
  );
}