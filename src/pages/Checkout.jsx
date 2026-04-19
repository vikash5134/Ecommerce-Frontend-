import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../lib/axios";
import { useCartStore } from "../store/cartStore";
import { useAuthStore } from "../store/authStore";
import { Breadcrumb } from "../components/Breadcrumb";
import { Toast } from "../components/Toast";

export const Checkout = () => {
  const navigate = useNavigate();
  const { cart, fetchCart, getCartTotal, clearCart } = useCartStore();
  const { user } = useAuthStore();
  const [toast, setToast] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    shippingAddress: user?.address || "",
    paymentMethod: "cod",
  });

  useEffect(() => {
    fetchCart();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { data } = await api.post("/orders", formData);
      await clearCart();
      setToast({ message: "Order placed successfully!", type: "success" });
      setTimeout(() => navigate("/orders"), 2000);
    } catch (error) {
      setToast({
        message: error.response?.data?.message || "Failed to place order",
        type: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const total = getCartTotal();

  if (!cart?.items || cart.items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <h2 className="text-2xl font-bold mb-4">Your cart is empty</h2>
        <button onClick={() => navigate("/products")} className="btn-primary">
          Continue Shopping
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {toast && <Toast {...toast} onClose={() => setToast(null)} />}

      <Breadcrumb
        items={[{ label: "Cart", link: "/cart" }, { label: "Checkout" }]}
      />

      <h1 className="text-3xl font-bold mb-8">Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Shipping Address */}
            <div className="card p-6">
              <h2 className="text-xl font-bold mb-4">Shipping Address</h2>
              <textarea
                value={formData.shippingAddress}
                onChange={(e) =>
                  setFormData({ ...formData, shippingAddress: e.target.value })
                }
                placeholder="Enter your full shipping address"
                rows="4"
                required
                className="input-field"
              />
            </div>

            {/* Payment Method */}
            <div className="card p-6">
              <h2 className="text-xl font-bold mb-4">Payment Method</h2>
              <div className="space-y-3">
                {/* Credit/Debit Card */}
                <label className="flex items-center p-4 border border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="card"
                    checked={formData.paymentMethod === "card"}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        paymentMethod: e.target.value,
                      })
                    }
                    className="mr-3"
                  />
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center">
                      <span className="text-white text-xs font-bold">💳</span>
                    </div>
                    <div>
                      <p className="font-semibold">Credit/Debit Card</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Visa, Mastercard, RuPay accepted
                      </p>
                    </div>
                  </div>
                </label>

                {/* UPI */}
                <label className="flex items-center p-4 border border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="upi"
                    checked={formData.paymentMethod === "upi"}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        paymentMethod: e.target.value,
                      })
                    }
                    className="mr-3"
                  />
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-purple-600 rounded flex items-center justify-center">
                      <span className="text-white text-xs font-bold">📱</span>
                    </div>
                    <div>
                      <p className="font-semibold">UPI</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Paytm, Google Pay, PhonePe, BHIM UPI
                      </p>
                    </div>
                  </div>
                </label>

                {/* Digital Wallet */}
                <label className="flex items-center p-4 border border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="wallet"
                    checked={formData.paymentMethod === "wallet"}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        paymentMethod: e.target.value,
                      })
                    }
                    className="mr-3"
                  />
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-green-600 rounded flex items-center justify-center">
                      <span className="text-white text-xs font-bold">👛</span>
                    </div>
                    <div>
                      <p className="font-semibold">Digital Wallet</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Paytm, Mobikwik, Ola Money, Amazon Pay
                      </p>
                    </div>
                  </div>
                </label>

                {/* EMI */}
                <label className="flex items-center p-4 border border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="emi"
                    checked={formData.paymentMethod === "emi"}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        paymentMethod: e.target.value,
                      })
                    }
                    className="mr-3"
                  />
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-orange-600 rounded flex items-center justify-center">
                      <span className="text-white text-xs font-bold">💰</span>
                    </div>
                    <div>
                      <p className="font-semibold">EMI</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        3, 6, 9, 12 months options available
                      </p>
                    </div>
                  </div>
                </label>

                {/* Cash on Delivery */}
                <label className="flex items-center p-4 border border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="cod"
                    checked={formData.paymentMethod === "cod"}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        paymentMethod: e.target.value,
                      })
                    }
                    className="mr-3"
                  />
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gray-600 rounded flex items-center justify-center">
                      <span className="text-white text-xs font-bold">💵</span>
                    </div>
                    <div>
                      <p className="font-semibold">Cash on Delivery</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Pay when you receive your order
                      </p>
                    </div>
                  </div>
                </label>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary w-full text-lg py-3"
            >
              {isLoading ? "Placing Order..." : "Place Order"}
            </button>
          </form>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="card p-6 sticky top-20">
            <h2 className="text-xl font-bold mb-4">Order Summary</h2>

            <div className="space-y-3 mb-6">
              {cart.items.map((item) => (
                <div key={item.id} className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">
                    {item.product.name} x {item.quantity}
                  </span>
                  <span className="font-semibold">
                    ₹{(item.product.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}

              <div className="border-t border-gray-200 dark:border-gray-700 pt-3">
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600 dark:text-gray-400">
                    Subtotal
                  </span>
                  <span className="font-semibold">₹{total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600 dark:text-gray-400">
                    Shipping
                  </span>
                  <span className="font-semibold">Free</span>
                </div>
                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span className="text-primary-600">₹{total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
