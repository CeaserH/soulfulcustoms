import React, { useState } from "react";

import { useCart } from "../context/CartContext";

import { uploadFile } from "../services/uploadService";

import { createOrder } from "../services/orderService";

import { Link } from "react-router-dom";

export default function Checkout() {
  const { cart, setCart } = useCart();

  const [customer, setCustomer] = useState({
    name: "",

    email: "",

    phone: "",
  });
  const [checkoutError, setCheckoutError] = useState("");
  const [submittedOrder, setSubmittedOrder] = useState(null);
  const [paymentStarted, setPaymentStarted] = useState(false);
  const [paymentConfirmed, setPaymentConfirmed] = useState(false);

  if (submittedOrder) {
    return (
      <section className="checkoutPage">
        <div className="checkoutContainer">
          <div className="successCard">
            <h1>Thank You!</h1>

            <p>Your order has been submitted successfully.</p>

            <h2>Order #{submittedOrder.orderNumber}</h2>

            <p>
              Soulful Customs will contact you by phone and/or email when your
              order is ready for pickup.
            </p>
          </div>
        </div>
      </section>
    );
  }

  const subtotal = cart.reduce(
    (total, item) => total + item.price * item.quantity,

    0,
  );

  const TAX_RATE = 0.08375;

  const taxAmount = Number((subtotal * TAX_RATE).toFixed(2));

  const phraseCost = cart.reduce(
    (total, item) =>
      total +
      (item.uploads || []).reduce(
        (uploadTotal, upload) =>
          uploadTotal + (upload.hasPhrase && !item.freeCustomPhrase ? 1 : 0),
        0,
      ),
    0,
  );

  const total = Number((subtotal + phraseCost + taxAmount).toFixed(2));
  const PAYPAL_URL = `https://www.paypal.me/elliadelgado/${total.toFixed(2)}`;

  function generateOrderNumber() {
    const year = new Date().getFullYear();

    const random = Math.floor(1000 + Math.random() * 9000);

    return `SC-${year}-${random}`;
  }

  function validateOrder() {
    if (!customer.name.trim()) {
      setCheckoutError("Please enter your full name.");

      return false;
    }

    if (!customer.email.trim()) {
      setCheckoutError("Please enter your email address.");

      return false;
    }

    if (!customer.phone.trim()) {
      setCheckoutError("Please enter your phone number.");

      return false;
    }
    for (const item of cart) {
      if (item.requiresChildName && !item.childName?.trim()) {
        setCheckoutError(`${item.name}: Please enter the child's name.`);

        return false;
      }

      const missingUpload = (item.uploads || []).some(
        (upload) => !upload?.uploadedId,
      );

      if (missingUpload) {
        setCheckoutError(
          `${item.name}: Please upload all required photos before checkout.`,
        );

        return false;
      }

      if (item.freeCustomPhrase && !item.paragraph?.trim()) {
        setCheckoutError(
          `${item.name}: Please enter your message or paragraph.`,
        );

        return false;
      }
    }

    setCheckoutError("");

    return true;
  }

  async function handleCheckout() {
    setCheckoutError("");
    if (!validateOrder()) {
      return;
    }
    try {
      const orderNumber = generateOrderNumber();

      const orderItems = cart.map((item) => ({
        cartItemId: item.cartItemId,

        id: item.id,

        name: item.name,

        category: item.category,

        selectedOption: {
          label: item.selectedOption?.label || "",
          dimensions: item.selectedOption?.dimensions || "",
          price: item.selectedOption?.price || 0,
          description: item.selectedOption?.description || "",
        },

        quantity: item.quantity,

        childName: item.childName || "",

        paragraph: item.paragraph || "",

        uploads: item.uploads.map((upload) => ({
          file: upload.file || "",
          uploadedId: upload.uploadedId || "",
          note: upload.note || "",
          hasPhrase: upload.hasPhrase || false,
          customPhrase: upload.customPhrase || "",
          uploadedAt: upload.uploadedAt || 0,
        })),
      }));

      const order = {
        orderNumber,

        customer,

        items: orderItems,

        subtotal,

        phraseCost,

        taxAmount,

        total,

        status: "pending",

        paymentMethod: "paypal-manual",

        paymentStatus: "pending-verification",

        paymentAmount: total,
      };
      await createOrder(order);

      setSubmittedOrder({
        orderNumber,
      });

      setCart([]);
    } catch (err) {
      console.error(err);

      alert("Checkout failed");
    }
  }

  const updateUpload = async (itemId, optionLabel, slot, file) => {
    if (!file) return;

    const result = await uploadFile(file);

    setCart(
      cart.map((item) => {
        if (
          item.cartItemId !== itemId ||
          item.selectedOption?.label !== optionLabel
        ) {
          return item;
        }

        const uploads = [...(item.uploads || [])];

        uploads[slot] = {
          ...uploads[slot],

          file: file.name,

          uploadedId: result.fileId,

          url: result.url,

          uploadedAt: Date.now(),
        };

        return {
          ...item,

          uploads,
        };
      }),
    );
  };

  const updateQuantity = (id, optionLabel, value) => {
    const qty = Math.max(1, parseInt(value) || 1);

    setCart(
      cart.map((item) => {
        if (
          item.cartItemId !== id ||
          item.selectedOption?.label !== optionLabel
        ) {
          return item;
        }

        let uploadCount;

        if (item.selectedOption?.id === "doubleDifferent") {
          uploadCount = qty * 2;
        } else if (item.requiredUploads) {
          uploadCount = qty * item.requiredUploads;
        } else {
          uploadCount = qty;
        }

        const uploads = Array.from({
          length: uploadCount,
        }).map(
          (_, i) =>
            item.uploads?.[i] || {
              file: null,

              uploadedId: null,

              note: "",

              hasPhrase: false,

              customPhrase: "",
            },
        );

        return {
          ...item,

          quantity: qty,

          uploads,
        };
      }),
    );
  };

  return (
    <section className="checkoutPage">
      <div className="checkoutContainer">
        <div className="checkoutLeft">
          <h1>Shopping Cart</h1>
          <div className="photoQualityNotice">
            <h4>📸 Photo Quality Notice</h4>

            <p>
              For the best print quality, please upload high-resolution, clear
              photos.
            </p>

            <p>
              Low-quality, blurry, dark, cropped, heavily compressed, or
              screenshot-quality images may result in a printed product that
              appears pixelated or unclear.
            </p>

            <p>
              Soulful Customs is not responsible for print quality issues caused
              by low-resolution photos submitted by the customer.
            </p>
          </div>
          {cart.length === 0 && (
            <div className="emptyCart">
              <h2>Your Cart is Empty</h2>

              <p>Browse our collection and create something memorable.</p>

              <Link to="/shop" className="primaryBtn">
                Shop Now
              </Link>
            </div>
          )}
          {cart.map((item) => (
            <div key={item.cartItemId} className="checkoutItem">
              <img src={item.image} alt={item.name} />

              <div className="checkoutInfo">
                <h3>{item.name}</h3>

                <p className="itemSize">
                  Size:{" "}
                  {item.selectedOption?.dimensions ||
                    item.selectedOption?.label}
                </p>
                {item.childName && (
                  <p className="itemSize">Child: {item.childName}</p>
                )}

                {item.selectedOption?.description && (
                  <p>{item.selectedOption.description}</p>
                )}

                <div className="quantityControl">
                  {!item.isCustomProject && (
                    <input
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(e) =>
                        updateQuantity(
                          item.cartItemId,
                          item.selectedOption?.label,
                          e.target.value,
                        )
                      }
                    />
                  )}
                  <button
                    className="removeBtn"
                    onClick={() =>
                      setCart(
                        cart.filter((i) => i.cartItemId !== item.cartItemId),
                      )
                    }
                  >
                    Remove
                  </button>
                </div>

                <div className="uploadSection">
                  {(item.uploads || []).map((upload, index) => {
                    const isDoubleDifferent =
                      item.selectedOption?.id === "doubleDifferent";

                    let uploadLabel = `Photo ${index + 1} of ${
                      item.requiredUploads || item.quantity
                    }`;

                    if (isDoubleDifferent) {
                      uploadLabel =
                        index % 2 === 0
                          ? `Front Photo ${Math.floor(index / 2) + 1}`
                          : `Back Photo ${Math.floor(index / 2) + 1}`;
                    }

                    return (
                      <div key={index} className="uploadCard">
                        <h4>{uploadLabel}</h4>

                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) =>
                            updateUpload(
                              item.cartItemId,

                              item.selectedOption?.label,

                              index,

                              e.target.files[0],
                            )
                          }
                        />

                        {upload.file && <p>✓ {upload.file}</p>}

                        {item.allowCustomPhrase !== false &&
                          !item.freeCustomPhrase && (
                            <>
                              <label className="phraseCheckbox">
                                <input
                                  type="checkbox"
                                  checked={upload.hasPhrase || false}
                                  onChange={(e) => {
                                    setCart(
                                      cart.map((i) => {
                                        if (
                                          i.cartItemId !== item.cartItemId ||
                                          i.selectedOption?.label !==
                                            item.selectedOption?.label
                                        ) {
                                          return i;
                                        }

                                        const uploads = [...i.uploads];

                                        uploads[index] = {
                                          ...uploads[index],

                                          hasPhrase: e.target.checked,
                                        };

                                        if (!e.target.checked) {
                                          uploads[index].customPhrase = "";
                                        }

                                        return {
                                          ...i,
                                          uploads,
                                        };
                                      }),
                                    );
                                  }}
                                />
                                Add Custom Phrase (+$1)
                              </label>

                              {upload.hasPhrase && (
                                <input
                                  type="text"
                                  className="phraseInput"
                                  maxLength="50"
                                  placeholder="Enter custom phrase..."
                                  value={upload.customPhrase || ""}
                                  onChange={(e) => {
                                    setCart(
                                      cart.map((i) => {
                                        if (
                                          i.cartItemId !== item.cartItemId ||
                                          i.selectedOption?.label !==
                                            item.selectedOption?.label
                                        ) {
                                          return i;
                                        }

                                        const uploads = [...i.uploads];

                                        uploads[index] = {
                                          ...uploads[index],

                                          customPhrase: e.target.value,
                                        };

                                        return {
                                          ...i,
                                          uploads,
                                        };
                                      }),
                                    );
                                  }}
                                />
                              )}

                              <textarea
                                placeholder="Special instructions"
                                value={upload.note || ""}
                                onChange={(e) => {
                                  setCart(
                                    cart.map((i) => {
                                      if (
                                        i.cartItemId !== item.cartItemId ||
                                        i.selectedOption?.label !==
                                          item.selectedOption?.label
                                      ) {
                                        return i;
                                      }

                                      const uploads = [...i.uploads];

                                      uploads[index] = {
                                        ...uploads[index],

                                        note: e.target.value,
                                      };

                                      return {
                                        ...i,
                                        uploads,
                                      };
                                    }),
                                  );
                                }}
                              />
                            </>
                          )}
                      </div>
                    );
                  })}
                </div>
                {item.freeCustomPhrase && (
                  <div className="uploadCard">
                    <h4>Message / Paragraph</h4>

                    <textarea
                      className="paragraphInput"
                      placeholder="Enter the message or paragraph you'd like added..."
                      value={item.paragraph || ""}
                      onChange={(e) => {
                        setCart(
                          cart.map((i) =>
                            i.cartItemId === item.cartItemId
                              ? {
                                  ...i,
                                  paragraph: e.target.value,
                                }
                              : i,
                          ),
                        );
                      }}
                    />
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {cart.length > 0 && (
          <div className="checkoutRight">
            <h2>Summary</h2>
            {checkoutError && (
              <div className="checkoutErrorCard">
                <div className="checkoutErrorIcon">⚠</div>

                <div>
                  <strong>Missing Required Information</strong>

                  <p>{checkoutError}</p>
                </div>
              </div>
            )}
            <div className="summaryBreakdown">
              <div>
                <span>Subtotal</span>

                <span>${subtotal.toFixed(2)}</span>
              </div>

              {phraseCost > 0 && (
                <div>
                  <span>Custom Phrases</span>

                  <span>${phraseCost.toFixed(2)}</span>
                </div>
              )}

              <div className="summaryRow">
                <span>Sales Tax (8.375%)</span>

                <span>${taxAmount.toFixed(2)}</span>
              </div>

              <div className="summaryRow totalRow">
                <span>Total</span>

                <span>${total.toFixed(2)}</span>
              </div>
            </div>

            <div className="customerSection">
              <h3>Customer Information</h3>
              <div className="pickupNotice">
                <strong>Pickup Only</strong>

                <p>
                  Orders are available for local pickup only. Soulful Customs
                  will contact you by phone and/or email when your order is
                  ready and arrange pickup details.
                </p>
              </div>
              <input
                type="text"
                placeholder="Full Name"
                value={customer.name}
                onChange={(e) =>
                  setCustomer({
                    ...customer,

                    name: e.target.value,
                  })
                }
              />

              <input
                type="email"
                placeholder="Email"
                value={customer.email}
                onChange={(e) =>
                  setCustomer({
                    ...customer,

                    email: e.target.value,
                  })
                }
              />

              <input
                type="tel"
                placeholder="Phone"
                value={customer.phone}
                onChange={(e) =>
                  setCustomer({
                    ...customer,

                    phone: e.target.value,
                  })
                }
              />
            </div>

            {!paymentStarted ? (
              <button
                className="primaryBtn"
                onClick={() => {
                  if (!validateOrder()) {
                    return;
                  }

                  window.open(PAYPAL_URL, "_blank");

                  setPaymentStarted(true);
                }}
              >
                Pay Now
              </button>
            ) : (
              <>
                <div className="paymentConfirmation">
                  <label className="paymentCheckbox">
                    <input
                      type="checkbox"
                      checked={paymentConfirmed}
                      onChange={(e) => setPaymentConfirmed(e.target.checked)}
                    />

                    <span>
                      I have submitted payment via PayPal and understand my
                      order will not begin until payment is verified.
                    </span>
                  </label>
                </div>

                <button
                  className="primaryBtn"
                  onClick={handleCheckout}
                  disabled={!paymentConfirmed}
                >
                  Submit Order
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
