import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { FiFilter, FiX } from "react-icons/fi";
import api from "../lib/axios";
import { ProductCard } from "../components/ProductCard";
import { LoadingSkeleton } from "../components/LoadingSkeleton";
import { Breadcrumb } from "../components/Breadcrumb";
import { Toast } from "../components/Toast";
import { useCartStore } from "../store/cartStore";
import { useAuthStore } from "../store/authStore";

export const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [toast, setToast] = useState(null);
  const [pagination, setPagination] = useState({});

  const { addToCart } = useCartStore();
  const { user } = useAuthStore();

  const category = searchParams.get("category") || "";
  const search = searchParams.get("search") || "";
  const sort = searchParams.get("sort") || "";
  const page = searchParams.get("page") || "1";

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [category, search, sort, page]);

  const fetchCategories = async () => {
    try {
      const { data } = await api.get("/products/categories");
      setCategories(data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      if (category) params.append("category", category);
      if (search) params.append("search", search);
      if (sort) params.append("sort", sort);
      params.append("page", page);

      const { data } = await api.get(`/products?${params}`);
      setProducts(data.products);
      setPagination(data.pagination);
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

  const updateFilter = (key, value) => {
    const params = new URLSearchParams(searchParams);
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    // Only reset page to 1 for non-page filters
    if (key !== "page") {
      params.set("page", "1");
    }
    setSearchParams(params);
  };

  const clearFilters = () => {
    setSearchParams({});
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {toast && <Toast {...toast} onClose={() => setToast(null)} />}

      <Breadcrumb items={[{ label: "Products" }]} />

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Filters Sidebar */}
        <aside
          className={`lg:w-64 ${showFilters ? "block" : "hidden lg:block"}`}
        >
          <div className="card p-6 sticky top-20">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">Filters</h2>
              <button
                onClick={clearFilters}
                className="text-sm text-primary-600 hover:text-primary-700"
              >
                Clear All
              </button>
            </div>

            {/* Category Filter */}
            <div className="mb-6">
              <h3 className="font-semibold mb-3">Category</h3>
              <div className="space-y-2">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="category"
                    checked={!category}
                    onChange={() => updateFilter("category", "")}
                    className="mr-2"
                  />
                  <span className="text-sm">All</span>
                </label>
                {categories.map((cat) => (
                  <label key={cat} className="flex items-center">
                    <input
                      type="radio"
                      name="category"
                      checked={category === cat}
                      onChange={() => updateFilter("category", cat)}
                      className="mr-2"
                    />
                    <span className="text-sm">{cat}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Sort */}
            <div>
              <h3 className="font-semibold mb-3">Sort By</h3>
              <select
                value={sort}
                onChange={(e) => updateFilter("sort", e.target.value)}
                className="input-field text-sm"
              >
                <option value="">Latest</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="rating">Top Rated</option>
              </select>
            </div>
          </div>
        </aside>

        {/* Products Grid */}
        <div className="flex-1">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-2xl font-bold mb-2">
                {search
                  ? `Search results for "${search}"`
                  : category || "All Products"}
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                {pagination.total || 0} products found
              </p>
            </div>

            <button
              onClick={() => setShowFilters(!showFilters)}
              className="lg:hidden btn-secondary flex items-center space-x-2"
            >
              {showFilters ? <FiX /> : <FiFilter />}
              <span>Filters</span>
            </button>
          </div>

          {isLoading ? (
            <LoadingSkeleton count={12} />
          ) : products.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-gray-500 text-lg">No products found</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onAddToCart={handleAddToCart}
                  />
                ))}
              </div>

              {/* Pagination */}
              {pagination.pages > 1 && (
                <div className="flex justify-center mt-8 space-x-2">
                  {Array.from(
                    { length: pagination.pages },
                    (_, i) => i + 1,
                  ).map((p) => (
                    <button
                      key={p}
                      onClick={() => updateFilter("page", p.toString())}
                      className={`px-4 py-2 rounded-lg ${
                        parseInt(page) === p
                          ? "bg-primary-600 text-white"
                          : "bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600"
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
