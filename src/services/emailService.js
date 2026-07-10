import { addDoc, collection } from "firebase/firestore";

import { db } from "../firebase";

const SUPPORT_EMAIL = "support@soulfulcustoms.shop";
const FROM_NAME = "Soulful Customs";
const EMAIL_COLLECTION = "soulfulcustoms-mail";

function formatCurrency(value = 0) {
  return `$${Number(value || 0).toFixed(2)}`;
}

function formatItems(items = []) {
  return items
    .map((item) => {
      const option =
        item.selectedOption?.dimensions || item.selectedOption?.label || "";
      const styles = item.selectedOption?.styles?.length
        ? `\n   Styles: ${item.selectedOption.styles
            .map((style) => style.label)
            .join(", ")}`
        : "";

      return `- ${item.name} x${item.quantity}${
        option ? `\n   Option: ${option}` : ""
      }${styles}`;
    })
    .join("\n");
}

function buildCustomerText(order) {
  return `Thank you for ordering from Soulful Customs.

Order Number: ${order.orderNumber}
Order Total: ${formatCurrency(order.total)}

Your order has been received. After payment has been received, your order will be confirmed, and production of your custom items will begin.

Order Summary:
${formatItems(order.items)}

Sublimation Printing Notice
All products are created using the sublimation printing process. Due to the nature of sublimation printing, slight variations in color and minor printing imperfections may occur. These variations are normal and do not affect the overall quality or functionality of the finished product.

Custom Order & Refund Policy
Because all items are custom-made specifically for your order, all sales are final. Once payment has been submitted, refunds, cancellations, or exchanges cannot be accepted. Customized products cannot be resold, so please review and approve your design carefully before completing your purchase.

Soulful Customs will contact you when your order is ready for pickup.

Thank you,
Soulful Customs`;
}

function buildCustomerHtml(order) {
  const itemRows = order.items
    .map((item) => {
      const option =
        item.selectedOption?.dimensions || item.selectedOption?.label || "";
      const styles = item.selectedOption?.styles?.length
        ? `<br><span style="color:#6e646b;">Styles: ${item.selectedOption.styles
            .map((style) => style.label)
            .join(", ")}</span>`
        : "";

      return `<li style="margin-bottom:12px;"><strong>${item.name}</strong> x${
        item.quantity
      }${option ? `<br><span style="color:#6e646b;">Option: ${option}</span>` : ""}${styles}</li>`;
    })
    .join("");

  return `
    <div style="font-family:Arial,sans-serif;color:#171417;line-height:1.6;max-width:640px;margin:0 auto;background:#fffdf9;padding:28px;border-radius:16px;">
      <h1 style="margin:0 0 12px;color:#d64686;">Thank you for ordering from Soulful Customs.</h1>
      <p style="margin:0 0 18px;">Your order has been received.</p>

      <div style="background:#fbf7f2;border:1px solid rgba(30,22,28,0.12);border-radius:12px;padding:16px;margin:18px 0;">
        <p style="margin:0;"><strong>Order Number:</strong> ${order.orderNumber}</p>
        <p style="margin:6px 0 0;"><strong>Order Total:</strong> ${formatCurrency(order.total)}</p>
      </div>

      <p>After payment has been received, your order will be confirmed, and production of your custom items will begin.</p>

      <h2 style="font-size:18px;margin-top:24px;">Order Summary</h2>
      <ul style="padding-left:20px;">${itemRows}</ul>

      <h2 style="font-size:18px;margin-top:24px;color:#226674;">Sublimation Printing Notice</h2>
      <p>All products are created using the sublimation printing process. Due to the nature of sublimation printing, slight variations in color and minor printing imperfections may occur. These variations are normal and do not affect the overall quality or functionality of the finished product.</p>

      <h2 style="font-size:18px;margin-top:24px;color:#226674;">Custom Order & Refund Policy</h2>
      <p>Because all items are custom-made specifically for your order, all sales are final. Once payment has been submitted, refunds, cancellations, or exchanges cannot be accepted. Customized products cannot be resold, so please review and approve your design carefully before completing your purchase.</p>

      <p style="margin-top:24px;">Soulful Customs will contact you when your order is ready for pickup.</p>
      <p style="margin-top:24px;">Thank you,<br><strong>Soulful Customs</strong></p>
    </div>
  `;
}

function buildSupportText(order) {
  return `New Soulful Customs order submitted.

Order Number: ${order.orderNumber}
Customer: ${order.customer.name}
Email: ${order.customer.email}
Phone: ${order.customer.phone}
Total: ${formatCurrency(order.total)}
Payment Status: ${order.paymentStatus}

Items:
${formatItems(order.items)}

The customer accepted the user agreement at ${order.agreementAcceptedAt}.`;
}

export async function queueOrderConfirmationEmails(order) {
  const mailRef = collection(db, EMAIL_COLLECTION);

  const customerEmail = order.customer?.email?.trim();

  if (!customerEmail) {
    return;
  }

  const emailJobs = [
    {
      to: customerEmail,
      replyTo: SUPPORT_EMAIL,
      message: {
        subject: `Soulful Customs Order Confirmation - ${order.orderNumber}`,
        text: buildCustomerText(order),
        html: buildCustomerHtml(order),
      },
    },
    {
      to: SUPPORT_EMAIL,
      replyTo: customerEmail,
      message: {
        subject: `New Order Submitted - ${order.orderNumber}`,
        text: buildSupportText(order),
      },
    },
  ];

  const emailDocRefs = await Promise.all(
    emailJobs.map((email) => addDoc(mailRef, email)),
  );

  return emailDocRefs.map((docRef) => docRef.id);
}

export { FROM_NAME, SUPPORT_EMAIL };
