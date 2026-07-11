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
  const [agreementScrolled, setAgreementScrolled] = useState(false);
  const [agreementAccepted, setAgreementAccepted] = useState(false);
  const [isSubmittingOrder, setIsSubmittingOrder] = useState(false);
  const skipsUploads = (item) => item.skipUploads || item.id === 15;

  if (submittedOrder) {
    return (
      <section className="checkoutPage">
        <div className="checkoutContainer">
          <div className="successCard">
            <h1>Thank You!</h1>

            <p>
              Your order has been submitted successfully. PayPal has opened so
              you can complete payment.
            </p>

            <h2>Order #{submittedOrder.orderNumber}</h2>

            <p>
              Soulful Customs will confirm payment and contact you by phone
              and/or email when your order is ready for pickup.
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

      if (item.personalization?.required && !item.personalizationText?.trim()) {
        setCheckoutError(
          `${item.name}: Please enter ${item.personalization.label.toLowerCase()}.`,
        );

        return false;
      }

      const missingUpload =
        !skipsUploads(item) &&
        (item.uploads || []).some((upload) => !upload?.uploadedId);

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

  function buildOrder(orderNumber) {
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
        styles: item.selectedOption?.styles || [],
        quantityLabel: item.selectedOption?.quantityLabel || "",
      },

      quantity: item.quantity,

      childName: item.childName || "",

      personalizationText: item.personalizationText || "",
      personalizationEnabled: Boolean(
        item.personalization?.required ||
          item.personalizationEnabled ||
          item.personalizationText,
      ),

      paragraph: item.paragraph || "",

      uploads: (item.uploads || []).map((upload) => ({
        file: upload.file || "",
        uploadedId: upload.uploadedId || "",
        note: upload.note || "",
        hasPhrase: upload.hasPhrase || false,
        customPhrase: upload.customPhrase || "",
        uploadedAt: upload.uploadedAt || 0,
      })),
    }));

    return {
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

      agreementAccepted: true,

      agreementAcceptedAt: new Date().toISOString(),
    };
  }

  function handleAgreementScroll(e) {
    const target = e.currentTarget;
    const hasReachedBottom =
      target.scrollTop + target.clientHeight >= target.scrollHeight - 8;

    if (hasReachedBottom) {
      setAgreementScrolled(true);
    }
  }

  async function handlePayNow() {
    setCheckoutError("");
    if (!validateOrder()) {
      return;
    }

    if (!agreementAccepted) {
      setCheckoutError(
        "Please read and accept the user agreement before payment.",
      );

      return;
    }

    setIsSubmittingOrder(true);

    const paypalWindow = window.open("about:blank", "_blank");

    try {
      const orderNumber = generateOrderNumber();

      await createOrder(buildOrder(orderNumber));

      if (paypalWindow) {
        paypalWindow.location.href = PAYPAL_URL;
      } else {
        window.open(PAYPAL_URL, "_blank");
      }

      setSubmittedOrder({
        orderNumber,
      });

      setCart([]);
    } catch (err) {
      console.error(err);

      if (paypalWindow) {
        paypalWindow.close();
      }

      alert("Checkout failed");
    } finally {
      setIsSubmittingOrder(false);
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

  const updateCartItem = (cartItemId, updates) => {
    setCart(
      cart.map((item) =>
        item.cartItemId === cartItemId
          ? {
              ...item,
              ...updates,
            }
          : item,
      ),
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

        if (skipsUploads(item)) {
          uploadCount = 0;
        } else if (item.selectedOption?.id === "doubleDifferent") {
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
          {cart.some((item) => !skipsUploads(item)) && (
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
          )}
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
                  Selection:{" "}
                  {item.selectedOption?.dimensions ||
                    item.selectedOption?.label}
                </p>
                {item.childName && (
                  <p className="itemSize">Child: {item.childName}</p>
                )}

                {item.personalizationText && (
                  <p className="itemSize">
                    {item.personalization?.label || "Personalization"}:{" "}
                    {item.personalizationText}
                  </p>
                )}

                {item.selectedOption?.description && (
                  <p>{item.selectedOption.description}</p>
                )}

                {item.selectedOption?.styles?.length > 0 && (
                  <div className="selectedStylePreviewGrid">
                    {item.selectedOption.styles.map((style) => (
                      <div
                        className="selectedStylePreview"
                        key={`${item.cartItemId}-${style.badgeNumber}`}
                      >
                        <img src={style.image} alt={style.label} />

                        <span>
                          Holder {style.badgeNumber}: {style.label}
                        </span>
                      </div>
                    ))}
                  </div>
                )}

                <div className="quantityControl">
                  {!item.isCustomProject && !skipsUploads(item) && (
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

                {item.personalization?.enabled && (
                  <div className="uploadCard personalizationCard">
                    <label className="phraseCheckbox">
                      <input
                        type="checkbox"
                        checked={
                          item.personalization.required ||
                          item.personalizationEnabled ||
                          Boolean(item.personalizationText)
                        }
                        disabled={item.personalization.required}
                        onChange={(e) => {
                          updateCartItem(item.cartItemId, {
                            personalizationEnabled: e.target.checked,
                            personalizationText: e.target.checked
                              ? item.personalizationText || ""
                              : "",
                          });
                        }}
                      />
                      {item.personalization.required
                        ? item.personalization.label
                        : `${item.personalization.label} (included)`}
                    </label>

                    {(item.personalization.required ||
                      item.personalizationEnabled ||
                      item.personalizationText !== "") && (
                      <input
                        type="text"
                        className="phraseInput"
                        value={item.personalizationText || ""}
                        placeholder={item.personalization.placeholder}
                        onChange={(e) =>
                          updateCartItem(item.cartItemId, {
                            personalizationText: e.target.value,
                          })
                        }
                      />
                    )}

                    {item.personalization.helperText && (
                      <p>{item.personalization.helperText}</p>
                    )}
                  </div>
                )}

                {!skipsUploads(item) && (
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
                          !item.freeCustomPhrase &&
                          !item.personalization?.enabled && (
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

                            </>
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
                      </div>
                    );
                    })}
                  </div>
                )}
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

            <div className="userAgreementCard">
              <div className="agreementHeader">
                <span>Required</span>
                <h3>User Agreement</h3>
                <p>
                  Please review the order, production, and refund terms before
                  continuing to payment.
                </p>
              </div>

              <div
                className="agreementScrollBox"
                onScroll={handleAgreementScroll}
                tabIndex="0"
              >
                <section>
                  <strong>Payment & Production</strong>
                  <p>
                    After payment has been received, your order will be
                    confirmed, and production of your custom items will begin.
                  </p>
                </section>

                <section>
                  <strong>Sublimation Printing Notice</strong>
                  <p>
                    All products are created using the sublimation printing
                    process. Due to the nature of sublimation printing, slight
                    variations in color and minor printing imperfections may
                    occur. These variations are normal and do not affect the
                    overall quality or functionality of the finished product.
                  </p>
                </section>

                <section>
                  <strong>Custom Order & Refund Policy</strong>
                  <p>
                    Because all items are custom-made specifically for your
                    order, all sales are final. Once payment has been submitted,
                    refunds, cancellations, or exchanges cannot be accepted.
                    Customized products cannot be resold, so please review and
                    approve your design carefully before completing your
                    purchase.
                  </p>
                </section>

                <section>
                  <strong>Final Review</strong>
                  <p>
                    Please confirm all photos, names, phrases, badge holder
                    styles, product options, and contact details are correct
                    before paying. Soulful Customs will use the details provided
                    in this checkout to prepare your order.
                  </p>
                </section>
              </div>

              {!agreementScrolled && (
                <p className="agreementHint">
                  Scroll to the bottom of the agreement to unlock acceptance.
                </p>
              )}

              <label
                className={`agreementCheckbox ${
                  !agreementScrolled ? "agreementCheckboxDisabled" : ""
                }`}
              >
                <input
                  type="checkbox"
                  checked={agreementAccepted}
                  disabled={!agreementScrolled}
                  onChange={(e) => setAgreementAccepted(e.target.checked)}
                />

                <span>
                  I have read, understand, and agree to the user agreement.
                </span>
              </label>
            </div>

            <button
              className="primaryBtn"
              onClick={handlePayNow}
              disabled={!agreementAccepted || isSubmittingOrder}
            >
              {isSubmittingOrder ? "Submitting Order..." : "Pay Now"}
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
