import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FiPackage, FiDownload } from "react-icons/fi";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import api from "../lib/axios";
import { Breadcrumb } from "../components/Breadcrumb";

export const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const { data } = await api.get("/orders/my-orders");
      setOrders(data);
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      pending:
        "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
      processing:
        "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
      shipped:
        "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
      delivered:
        "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
      cancelled: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
    };
    return colors[status] || colors.pending;
  };

  const getStatusText = (status) => {
    const statusTexts = {
      pending: "Order Placed",
      processing: "Processing",
      shipped: "Shipped",
      delivered: "Delivered",
      cancelled: "Cancelled",
    };
    return statusTexts[status] || "Order Placed";
  };

  const downloadInvoice = async (order) => {
    try {
      // Create a temporary div for the invoice content
      const invoiceElement = document.createElement("div");
      invoiceElement.style.width = "800px";
      invoiceElement.style.padding = "20px";
      invoiceElement.style.fontFamily = "Arial, sans-serif";
      invoiceElement.style.backgroundColor = "white";
      invoiceElement.style.color = "black";
      invoiceElement.innerHTML = `
        <div style="text-align: center; margin-bottom: 30px; border-bottom: 2px solid #333; padding-bottom: 20px;">
          <h1 style="color: #2563eb; margin: 0; font-size: 28px;">E-Commerce Invoice</h1>
          <p style="margin: 5px 0; color: #666;">Order ID: ${order.id}</p>
          <p style="margin: 5px 0; color: #666;">Date: ${new Date(order.createdAt).toLocaleDateString()}</p>
        </div>

        <div style="margin-bottom: 30px;">
          <h2 style="color: #333; margin-bottom: 15px;">Order Details</h2>
          <p><strong>Status:</strong> ${getStatusText(order.status)}</p>
          <p><strong>Payment Method:</strong> ${
            order.paymentMethod === "cod"
              ? "Cash on Delivery"
              : order.paymentMethod === "card"
                ? "Credit/Debit Card"
                : order.paymentMethod === "upi"
                  ? "UPI"
                  : order.paymentMethod === "wallet"
                    ? "Digital Wallet"
                    : "EMI"
          }</p>
          <p><strong>Shipping Address:</strong> ${order.shippingAddress}</p>
        </div>

        <div style="margin-bottom: 30px;">
          <h2 style="color: #333; margin-bottom: 15px;">Items Ordered</h2>
          <table style="width: 100%; border-collapse: collapse;">
            <thead>
              <tr style="background-color: #f8f9fa;">
                <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Item</th>
                <th style="border: 1px solid #ddd; padding: 8px; text-align: center;">Qty</th>
                <th style="border: 1px solid #ddd; padding: 8px; text-align: right;">Price</th>
                <th style="border: 1px solid #ddd; padding: 8px; text-align: right;">Total</th>
              </tr>
            </thead>
            <tbody>
              ${order.items
                .map(
                  (item) => `
                <tr>
                  <td style="border: 1px solid #ddd; padding: 8px;">${item.product.name}</td>
                  <td style="border: 1px solid #ddd; padding: 8px; text-align: center;">${item.quantity}</td>
                  <td style="border: 1px solid #ddd; padding: 8px; text-align: right;">₹${item.price.toFixed(2)}</td>
                  <td style="border: 1px solid #ddd; padding: 8px; text-align: right;">₹${(item.quantity * item.price).toFixed(2)}</td>
                </tr>
              `,
                )
                .join("")}
            </tbody>
          </table>
        </div>

        <div style="text-align: right; border-top: 2px solid #333; padding-top: 20px;">
          <h3 style="color: #2563eb; font-size: 20px;">Total Amount: ₹${order.totalAmount.toFixed(2)}</h3>
        </div>

        <div style="text-align: center; margin-top: 40px; color: #666; font-size: 12px;">
          <p>Thank you for shopping with us!</p>
          <p>For any queries, please contact our support team.</p>
        </div>
      `;

      document.body.appendChild(invoiceElement);

      const canvas = await html2canvas(invoiceElement, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
      });

      document.body.removeChild(invoiceElement);

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");

      const imgWidth = 210;
      const pageHeight = 295;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;

      let position = 0;

      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save(`invoice-${order.id}.pdf`);
    } catch (error) {
      console.error("Error generating invoice:", error);
      alert("Error generating invoice. Please try again.");
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="h-48 bg-gray-300 dark:bg-gray-700 rounded-lg"
            />
          ))}
        </div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <FiPackage className="w-24 h-24 mx-auto text-gray-400 mb-4" />
          <h2 className="text-2xl font-bold mb-4">No orders yet</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            Start shopping to see your orders here!
          </p>
          <Link to="/products" className="btn-primary">
            Browse Products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Breadcrumb items={[{ label: "My Orders" }]} />

      <h1 className="text-3xl font-bold mb-8">My Orders</h1>

      <div className="space-y-6">
        {orders.map((order) => (
          <div key={order.id} className="card p-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Order ID: <span className="font-mono">{order.id}</span>
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Placed on {new Date(order.createdAt).toLocaleDateString()}
                </p>
              </div>
              <div className="mt-2 md:mt-0 flex items-center gap-3">
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}
                >
                  {getStatusText(order.status)}
                </span>
                <button
                  onClick={() => downloadInvoice(order)}
                  className="flex items-center gap-2 px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                >
                  <FiDownload className="w-4 h-4" />
                  Invoice
                </button>
              </div>
            </div>

            <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
              <div className="space-y-3">
                {order.items.map((item) => (
                  <div key={item.id} className="flex items-center gap-4">
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      className="w-16 h-16 object-cover rounded"
                    />
                    <div className="flex-1">
                      <Link
                        to={`/products/${item.product.id}`}
                        className="font-medium hover:text-primary-600 transition-colors"
                      >
                        {item.product.name}
                      </Link>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Quantity: {item.quantity} × ₹{item.price.toFixed(2)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">
                        ₹{(item.quantity * item.price).toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-200 dark:border-gray-700 mt-4 pt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Shipping Address
                    </p>
                    <p className="text-sm">{order.shippingAddress}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Payment Method
                    </p>
                    <p className="text-sm font-medium capitalize">
                      {order.paymentMethod === "cod" && "💵 Cash on Delivery"}
                      {order.paymentMethod === "card" && "💳 Credit/Debit Card"}
                      {order.paymentMethod === "upi" && "📱 UPI"}
                      {order.paymentMethod === "wallet" && "👛 Digital Wallet"}
                      {order.paymentMethod === "emi" && "💰 EMI"}
                    </p>
                  </div>
                  <div className="md:col-span-2 text-right">
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Total Amount
                    </p>
                    <p className="text-2xl font-bold text-primary-600">
                      ₹{order.totalAmount.toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
