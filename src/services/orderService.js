import { collection, addDoc, doc, updateDoc } from "firebase/firestore";

import { db } from "../firebase";
import { queueOrderConfirmationEmails } from "./emailService";

export async function createOrder(order) {
  const firestoreOrder = JSON.parse(JSON.stringify(order));

  firestoreOrder.createdAt = Date.now();

  const docRef = await addDoc(collection(db, "orders"), firestoreOrder);

  let emailDocIds = [];

  try {
    emailDocIds = await queueOrderConfirmationEmails(firestoreOrder);
  } catch (err) {
    console.warn("Order saved, but confirmation email queue failed.", err);

    try {
      await updateDoc(doc(db, "orders", docRef.id), {
        emailQueueStatus: "failed",
        emailQueueError: err?.message || "Unknown email queue error",
        emailQueueFailedAt: Date.now(),
      });
    } catch (updateErr) {
      console.warn("Could not save email queue failure status.", updateErr);
    }

    return docRef.id;
  }

  try {
    await updateDoc(doc(db, "orders", docRef.id), {
      emailQueueStatus: "queued",
      emailQueuedAt: Date.now(),
      emailDocIds,
    });
  } catch (err) {
    console.warn("Confirmation emails queued, but order diagnostics were not saved.", err);
  }

  return docRef.id;
}
