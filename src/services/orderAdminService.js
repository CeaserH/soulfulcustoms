import {
  collection,
  getDocs,
  query,
  orderBy,
  doc,
  updateDoc,
} from "firebase/firestore";

import { db } from "../firebase";

export async function getOrders() {
  const ordersRef = collection(db, "orders");

  const q = query(ordersRef, orderBy("createdAt", "desc"));

  const snapshot = await getDocs(q);

  return snapshot.docs.map((docSnapshot) => ({
    firestoreId: docSnapshot.id,

    ...docSnapshot.data(),
  }));
}

export async function updateOrderStatus(firestoreId, status) {
  const orderRef = doc(db, "orders", firestoreId);

  await updateDoc(orderRef, {
    status,
  });
}
