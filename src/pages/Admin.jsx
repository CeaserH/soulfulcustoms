import { useState, useEffect } from "react";

import { loginWithGoogle } from "../services/authService";

import { ADMIN_EMAILS } from "../config/adminEmails";

import { getOrders, updateOrderStatus } from "../services/orderAdminService";

export default function Admin() {
  const [user, setUser] = useState(null);

  const [error, setError] = useState("");

  const [orders, setOrders] = useState([]);

  const [selectedOrder, setSelectedOrder] = useState(null);

  const [status, setStatus] = useState("");

  async function handleLogin() {
    try {
      const loggedInUser = await loginWithGoogle();

      if (!ADMIN_EMAILS.includes(loggedInUser.email)) {
        setError("You are not authorized.");

        return;
      }

      setUser(loggedInUser);
    } catch (err) {
      console.error(err);
    }
  }

  async function handleStatusUpdate() {
    if (!selectedOrder) {
      return;
    }

    try {
      await updateOrderStatus(selectedOrder.firestoreId, status);

      setSelectedOrder({
        ...selectedOrder,

        status,
      });

      setOrders(
        orders.map((order) =>
          order.firestoreId === selectedOrder.firestoreId
            ? {
                ...order,

                status,
              }
            : order,
        ),
      );
    } catch (err) {
      console.error(err);
    }
  }

  useEffect(() => {
    async function loadOrders() {
      try {
        const data = await getOrders();

        setOrders(data);
      } catch (err) {
        console.error(err);
      }
    }

    if (user) {
      loadOrders();
    }
  }, [user]);

  if (!user) {
    return (
      <section className="adminLogin">
        <h1>Admin Login</h1>

        <button className="primaryBtn" onClick={handleLogin}>
          Sign In With Google
        </button>

        {error && <p>{error}</p>}
      </section>
    );
  }

  const activeOrders = orders.filter(
    (order) => order.status !== "cancelled" && order.status !== "archived",
  );

  const inactiveOrders = orders.filter(
    (order) => order.status === "cancelled" || order.status === "archived",
  );

  return (
    <section className="adminPage">
      <div className="adminHeader">
        <div>
          <h1>Soulful Customs Admin</h1>
          <p>{user.email}</p>
        </div>

        <div className="adminStats">
          <div className="adminStatCard">
            <span>Total Orders</span>
            <strong>{orders.length}</strong>
          </div>
        </div>
      </div>

      <div className="adminDashboard">
        <aside className="adminSidebar">
          <h3 className="adminSectionTitle">Active Orders</h3>

          {activeOrders.map((order) => (
            <button
              key={order.firestoreId}
              className={`adminOrderListItem ${
                selectedOrder?.firestoreId === order.firestoreId ? "active" : ""
              }`}
              onClick={() => {
                setSelectedOrder(order);

                setStatus(order.status);
              }}
            >
              <div>
                <strong>{order.orderNumber}</strong>

                <p>{order.customer?.name}</p>
              </div>

              <div>
                <span className={`statusBadge status-${order.status}`}>
                  {order.status}
                </span>

                <p>${order.total?.toFixed(2)}</p>
              </div>
            </button>
          ))}

          {inactiveOrders.length > 0 && (
            <>
              <h3 className="adminSectionTitle">Archived & Cancelled</h3>

              {inactiveOrders.map((order) => (
                <button
                  key={order.firestoreId}
                  className={`adminOrderListItem ${
                    selectedOrder?.firestoreId === order.firestoreId
                      ? "active"
                      : ""
                  }`}
                  onClick={() => {
                    setSelectedOrder(order);

                    setStatus(order.status);
                  }}
                >
                  <div>
                    <strong>{order.orderNumber}</strong>

                    <p>{order.customer?.name}</p>
                  </div>

                  <div>
                    <span className={`statusBadge status-${order.status}`}>
                      {order.status}
                    </span>

                    <p>${order.total?.toFixed(2)}</p>
                  </div>
                </button>
              ))}
            </>
          )}
        </aside>

        <main className="adminContent">
          {!selectedOrder ? (
            <div className="adminEmptyState">
              <h2>Select an Order</h2>
              <p>Choose an order from the left to view details.</p>
            </div>
          ) : (
            <>
              <div className="adminDetailCard">
                <div className="adminStatusControls">
                  <label>Order Status</label>

                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                  >
                    <option value="pending">Pending</option>

                    <option value="in-progress">In Progress</option>

                    <option value="ready">Ready For Pickup</option>

                    <option value="completed">Completed</option>

                    <option value="cancelled">Cancelled</option>

                    <option value="archived">Archived</option>
                  </select>

                  <button className="primaryBtn" onClick={handleStatusUpdate}>
                    Save Status
                  </button>
                </div>
                <h2>{selectedOrder.orderNumber}</h2>

                <div className="adminInfoGrid">
                  <div>
                    <label>Name</label>
                    <p>{selectedOrder.customer?.name}</p>
                  </div>

                  <div>
                    <label>Email</label>
                    <p>{selectedOrder.customer?.email}</p>
                  </div>

                  <div>
                    <label>Phone</label>
                    <p>{selectedOrder.customer?.phone}</p>
                  </div>

                  <div>
                    <label>Status</label>
                    <span
                      className={`statusBadge status-${selectedOrder.status}`}
                    >
                      {selectedOrder.status}
                    </span>
                  </div>
                </div>
              </div>

              {selectedOrder.items?.map((item, itemIndex) => (
                <div
                  key={item.cartItemId || itemIndex}
                  className="adminDetailCard"
                >
                  <h3>{item.name}</h3>

                  <div className="adminInfoGrid">
                    <div>
                      <label>Category</label>
                      <p>{item.category}</p>
                    </div>

                    <div>
                      <label>Quantity</label>
                      <p>{item.quantity}</p>
                    </div>

                    {item.selectedOption?.label && (
                      <div>
                        <label>Option</label>
                        <p>{item.selectedOption.label}</p>
                      </div>
                    )}

                    {item.selectedOption?.dimensions && (
                      <div>
                        <label>Dimensions</label>
                        <p>{item.selectedOption.dimensions}</p>
                      </div>
                    )}

                    {item.childName && (
                      <div>
                        <label>Child Name</label>
                        <p>{item.childName}</p>
                      </div>
                    )}
                  </div>

                  {item.paragraph && (
                    <div className="adminParagraph">
                      <label>Paragraph</label>
                      <p>{item.paragraph}</p>
                    </div>
                  )}

                  <h4>Uploaded Photos</h4>

                  <div className="adminUploads">
                    {item.uploads?.map((upload, uploadIndex) => (
                      <div key={uploadIndex} className="adminUploadCard">
                        <img
                          src={`${process.env.UPLOAD_WORKER_URL}?file=${upload.uploadedId}`}
                          alt="Customer Upload"
                          className="adminUploadPreview"
                        />

                        <a
                          href={`${process.env.UPLOAD_WORKER_URL}?file=${upload.uploadedId}`}
                          target="_blank"
                          rel="noreferrer"
                          className="adminDownloadBtn"
                        >
                          Download
                        </a>

                        {upload.customPhrase && (
                          <p>
                            <strong>Phrase:</strong> {upload.customPhrase}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </>
          )}
        </main>
      </div>
    </section>
  );
}
