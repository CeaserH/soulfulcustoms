import React from "react";

export default function Contact() {
  return (
    <section className="section contactSection">
      <div className="contactContainer">
        <h2>Contact Soulful Customs</h2>

        <p className="contactIntro">
          Questions about an order, custom requests, product options, or special
          occasions? We'd love to hear from you and help create the perfect
          personalized keepsake.
        </p>

        <div className="contactGrid">
          <div className="contactCard">
            <h3>Email</h3>

            <a
              href="mailto:support@soulfulcustoms.shop"
              className="contactLink"
            >
              support@soulfulcustoms.shop
            </a>
          </div>

          <div className="contactCard">
            <h3>Phone</h3>

            <a href="tel:5103506360" className="contactLink">
              (510) 350-6360
            </a>
          </div>

          <div className="contactCard">
            <h3>Instagram</h3>

            <a
              href="https://instagram.com/soulful_customs_"
              target="_blank"
              rel="noopener noreferrer"
              className="contactLink"
            >
              @soulful_customs_
            </a>
          </div>

          <div className="contactCard">
            <h3>Turnaround Time</h3>

            <p>4–5 Business Days</p>
          </div>
        </div>
      </div>
    </section>
  );
}
