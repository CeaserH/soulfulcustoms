import { collection, addDoc } from "firebase/firestore";

import { db } from "../firebase";

export async function createOrder(order) {
  const firestoreOrder = JSON.parse(JSON.stringify(order));

  firestoreOrder.createdAt = Date.now();

  const docRef = await addDoc(collection(db, "orders"), firestoreOrder);

  return docRef.id;
}
