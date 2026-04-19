import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";

export const MyOrders = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const allOrders = JSON.parse(localStorage.getItem("orders") || "[]");
    const userOrders = allOrders.filter(
      (order) => order.username === user.username,
    );
    setOrders(userOrders.sort((a, b) => new Date(b.date) - new Date(a.date)));
  }, [user]);

  return (
    <div style={styles.container}>
      <h1>My Orders</h1>
      {orders.length === 0 ? (
        <p>No orders yet</p>
      ) : (
        <div style={styles.orderList}>
          {orders.map((order) => (
            <div key={order.id} style={styles.orderCard}>
              <div style={styles.orderHeader}>
                <h3>{order.productName}</h3>
                <span style={getStatusStyle(order.status)}>
                  {order.status === "Pending" ? "Order Placed" : order.status}
                </span>
              </div>
              <p>Order ID: {order.id}</p>
              <p>Price: ₹{order.price}</p>
              <p>Address: {order.address}</p>
              <p>Date: {new Date(order.date).toLocaleDateString()}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const getStatusStyle = (status) => {
  const baseStyle = {
    padding: "0.25rem 0.75rem",
    fontSize: "0.875rem",
    fontWeight: "bold",
  };

  if (status === "Pending" || status === "Order Placed")
    return { ...baseStyle, background: "#4CAF50", color: "#fff" };
  if (status === "Processing")
    return { ...baseStyle, background: "#2196F3", color: "#fff" };
  if (status === "Shipped")
    return { ...baseStyle, background: "#9C27B0", color: "#fff" };
  if (status === "Delivered")
    return { ...baseStyle, background: "#4CAF50", color: "#fff" };
  if (status === "Cancelled")
    return { ...baseStyle, background: "#f44336", color: "#fff" };
  return baseStyle;
};

const styles = {
  container: {
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "2rem 1rem",
  },
  orderList: {
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
    marginTop: "1rem",
  },
  orderCard: {
    border: "1px solid #ddd",
    padding: "1.5rem",
  },
  orderHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "1rem",
  },
};
