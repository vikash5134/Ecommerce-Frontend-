import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FiArrowRight, FiTruck, FiShield, FiCreditCard } from "react-icons/fi";
import api from "../lib/axios";
import { ProductCard } from "../components/ProductCard";
import { LoadingSkeleton } from "../components/LoadingSkeleton";
import { Toast } from "../components/Toast";
import { useCartStore } from "../store/cartStore";
import { useAuthStore } from "../store/authStore";

export const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [toast, setToast] = useState(null);

  const { addToCart } = useCartStore();
  const { user } = useAuthStore();

  useEffect(() => {
    fetchFeaturedProducts();
  }, []);

  const fetchFeaturedProducts = async () => {
    try {
      const { data } = await api.get("/products?limit=8");
      setFeaturedProducts(data.products);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddToCart = async (productId) => {
    if (!user) {
      setToast({
        message: "Please login to add items to cart",
        type: "warning",
      });
      return;
    }

    const result = await addToCart(productId, 1);
    if (result.success) {
      setToast({ message: "Added to cart successfully!", type: "success" });
    } else {
      setToast({ message: result.message, type: "error" });
    }
  };

  return (
    <div>
      {toast && <Toast {...toast} onClose={() => setToast(null)} />}

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary-900 via-primary-800 to-fuchsia-900 text-white py-24 sm:py-32">
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-primary-500 rounded-full mix-blend-screen filter blur-[100px] opacity-40 animate-float"></div>
        <div className="absolute top-1/2 right-10 w-96 h-96 bg-fuchsia-600 rounded-full mix-blend-screen filter blur-[100px] opacity-40 animate-pulse-slow"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10">
          <div className="max-w-3xl">
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 animate-slide-up drop-shadow-md">
              Welcome to <span className="text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-300 to-primary-300">ShopHub</span>
            </h1>
            <p className="text-xl md:text-2xl mb-10 text-primary-100 animate-fade-in" style={{ animationDelay: '0.2s' }}>
              Discover amazing products at unbeatable prices. Shop with
              confidence and premium aesthetic.
            </p>
            <Link
              to="/products"
              className="inline-flex items-center space-x-2 bg-white text-primary-700 px-8 py-4 rounded-xl font-bold hover:bg-gray-50 hover:scale-105 active:scale-95 transition-all shadow-xl animate-fade-in"
              style={{ animationDelay: '0.4s' }}
            >
              <span>Explore Collection</span>
              <FiArrowRight className="w-5 h-5 ml-2" />
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-12 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex items-start space-x-4 p-6 rounded-2xl bg-white dark:bg-gray-800 shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
              <div className="p-3 bg-gradient-to-br from-primary-100 to-primary-200 dark:from-primary-900/50 dark:to-primary-800/50 rounded-xl shadow-inner">
                <FiTruck className="w-6 h-6 text-primary-600 dark:text-primary-400" />
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2">Free Shipping</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  On orders over ₹500
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4 p-6 rounded-2xl bg-white dark:bg-gray-800 shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
              <div className="p-3 bg-gradient-to-br from-fuchsia-100 to-fuchsia-200 dark:from-fuchsia-900/50 dark:to-fuchsia-800/50 rounded-xl shadow-inner">
                <FiShield className="w-6 h-6 text-fuchsia-600 dark:text-fuchsia-400" />
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2">Secure Payment</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  100% secure transactions
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4 p-6 rounded-2xl bg-white dark:bg-gray-800 shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
              <div className="p-3 bg-gradient-to-br from-primary-100 to-primary-200 dark:from-primary-900/50 dark:to-primary-800/50 rounded-xl shadow-inner">
                <FiCreditCard className="w-6 h-6 text-primary-600 dark:text-primary-400" />
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2">Easy Returns</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  30-day return policy
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold">Featured Products</h2>
            <Link
              to="/products"
              className="text-primary-600 hover:text-primary-700 font-medium flex items-center space-x-2"
            >
              <span>View All</span>
              <FiArrowRight />
            </Link>
          </div>

          {isLoading ? (
            <LoadingSkeleton count={8} />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onAddToCart={handleAddToCart}
                />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};
