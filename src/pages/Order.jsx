import React from "react";

export default function Order() {
  return (
    <section className="section dark-section">
      <div className="section-container">
        <h2>Place Your Order</h2>

        <div className="form-wrapper">
          <iframe
            title="Jotform Order Form"
            src="https://form.jotform.com/261174080458053"
            frameBorder="0"
            allow="geolocation; microphone; camera"
          ></iframe>
        </div>
      </div>
    </section>
  );
}