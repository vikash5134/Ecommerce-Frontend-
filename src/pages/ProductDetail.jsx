import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FiShoppingCart, FiStar, FiMinus, FiPlus } from "react-icons/fi";
import api from "../lib/axios";
import { Breadcrumb } from "../components/Breadcrumb";
import { Toast } from "../components/Toast";
import { useCartStore } from "../store/cartStore";
import { useAuthStore } from "../store/authStore";

export const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [toast, setToast] = useState(null);

  const { addToCart } = useCartStore();
  const { user } = useAuthStore();

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      const { data } = await api.get(`/products/${id}`);
      setProduct(data);
    } catch (error) {
      console.error("Error fetching product:", error);
      setToast({ message: "Product not found", type: "error" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddToCart = async () => {
    if (!user) {
      navigate("/login");
      return;
    }

    const result = await addToCart(product.id, quantity);
    if (result.success) {
      setToast({ message: "Added to cart successfully!", type: "success" });
    } else {
      setToast({ message: result.message, type: "error" });
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-300 dark:bg-gray-700 rounded w-1/3 mb-8" />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="aspect-square bg-gray-300 dark:bg-gray-700 rounded-lg" />
            <div className="space-y-4">
              <div className="h-8 bg-gray-300 dark:bg-gray-700 rounded w-3/4" />
              <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-1/2" />
              <div className="h-20 bg-gray-300 dark:bg-gray-700 rounded" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <h2 className="text-2xl font-bold">Product not found</h2>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {toast && <Toast {...toast} onClose={() => setToast(null)} />}

      <Breadcrumb
        items={[
          { label: "Products", link: "/products" },
          { label: product.name },
        ]}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Product Image */}
        <div>
          <div className="aspect-square rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.currentTarget.src = "https://images.unsplash.com/photo-1560393464-5c69a73c5770?auto=format&fit=crop&q=80&w=800";
              }}
            />
          </div>
        </div>

        {/* Product Info */}
        <div>
          <h1 className="text-3xl font-bold mb-4">{product.name}</h1>

          <div className="flex items-center mb-4">
            <div className="flex items-center text-yellow-500">
              {Array.from({ length: 5 }).map((_, i) => (
                <FiStar
                  key={i}
                  className={`w-5 h-5 ${i < Math.floor(product.rating) ? "fill-current" : ""}`}
                />
              ))}
            </div>
            <span className="ml-2 text-gray-600 dark:text-gray-400">
              {product.rating.toFixed(1)} ({product.numReviews} reviews)
            </span>
          </div>

          <div className="text-4xl font-bold text-primary-600 mb-6">
            ₹{product.price.toFixed(2)}
          </div>

          <p className="text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
            {product.description}
          </p>

          <div className="mb-6">
            <span className="inline-block px-3 py-1 bg-primary-100 dark:bg-primary-900 text-primary-600 rounded-full text-sm font-medium">
              {product.category}
            </span>
            {product.brand && (
              <span className="ml-2 inline-block px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-full text-sm">
                {product.brand}
              </span>
            )}
          </div>

          <div className="mb-6">
            <p className="text-sm mb-2">
              <span className="font-semibold">Availability:</span>{" "}
              {product.stock > 0 ? (
                <span className="text-green-600">{product.stock} in stock</span>
              ) : (
                <span className="text-red-600">Out of stock</span>
              )}
            </p>
            {product.warranty && (
              <p className="text-sm">
                <span className="font-semibold">Warranty:</span>{" "}
                {product.warranty}
              </p>
            )}
          </div>

          {product.stock > 0 && (
            <>
              <div className="flex items-center space-x-4 mb-6">
                <span className="font-semibold">Quantity:</span>
                <div className="flex items-center border border-gray-300 dark:border-gray-600 rounded-lg">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <FiMinus />
                  </button>
                  <span className="px-6 py-2 font-semibold">{quantity}</span>
                  <button
                    onClick={() =>
                      setQuantity(Math.min(product.stock, quantity + 1))
                    }
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <FiPlus />
                  </button>
                </div>
              </div>

              <button
                onClick={handleAddToCart}
                className="btn-primary w-full flex items-center justify-center space-x-2 text-lg py-3"
              >
                <FiShoppingCart className="w-5 h-5" />
                <span>Add to Cart</span>
              </button>
            </>
          )}
        </div>
      </div>

      {/* Specifications Section */}
      {product.specifications && (
        <div className="mt-16">
          <h2 className="text-2xl font-bold mb-6">Specifications</h2>
          <div className="card p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(JSON.parse(product.specifications)).map(
                ([key, value]) => (
                  <div
                    key={key}
                    className="flex justify-between py-2 border-b border-gray-200 dark:border-gray-700 last:border-b-0"
                  >
                    <span className="font-medium text-gray-600 dark:text-gray-400">
                      {key}:
                    </span>
                    <span className="text-gray-900 dark:text-gray-100">
                      {value}
                    </span>
                  </div>
                ),
              )}
            </div>
          </div>
        </div>
      )}

      {/* Features Section */}
      {product.features && (
        <div className="mt-16">
          <h2 className="text-2xl font-bold mb-6">Key Features</h2>
          <div className="card p-6">
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {product.features.split(",").map((feature, index) => (
                <li key={index} className="flex items-center">
                  <span className="w-2 h-2 bg-primary-500 rounded-full mr-3 flex-shrink-0"></span>
                  <span className="text-gray-700 dark:text-gray-300">
                    {feature.trim()}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* Reviews Section */}
      <div className="mt-16">
        <h2 className="text-2xl font-bold mb-6">Customer Reviews</h2>
        {product.reviews && product.reviews.length > 0 ? (
          <div className="space-y-4">
            {product.reviews.map((review) => (
              <div key={review.id} className="card p-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold">{review.username}</span>
                  <div className="flex items-center text-yellow-500">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <FiStar
                        key={i}
                        className={`w-4 h-4 ${i < review.rating ? "fill-current" : ""}`}
                      />
                    ))}
                  </div>
                </div>
                <p className="text-gray-600 dark:text-gray-400">
                  {review.comment}
                </p>
                <p className="text-sm text-gray-500 mt-2">
                  {new Date(review.createdAt).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No reviews yet</p>
        )}
      </div>
    </div>
  );
};
