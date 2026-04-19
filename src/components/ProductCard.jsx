import { Link } from "react-router-dom";
import { FiShoppingCart, FiStar, FiTag, FiPackage } from "react-icons/fi";

export const ProductCard = ({ product, onAddToCart }) => {
  return (
    <div className="card overflow-hidden group flex flex-col h-full">
      <Link to={`/products/${product.id}`}>
        <div className="relative overflow-hidden aspect-square">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
            onError={(e) => {
              e.currentTarget.src = "https://images.unsplash.com/photo-1560393464-5c69a73c5770?auto=format&fit=crop&q=80&w=800"; // Fallback aesthetic placeholder
            }}
          />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300"></div>
          {product.stock === 0 && (
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
              <span className="text-white font-semibold">Out of Stock</span>
            </div>
          )}
          {product.stock > 0 && product.stock <= 5 && (
            <div className="absolute top-2 right-2 bg-orange-500 text-white text-xs px-2 py-1 rounded-full font-semibold">
              Only {product.stock} left
            </div>
          )}
          {product.category && (
            <div className="absolute top-3 left-3 bg-gradient-to-r from-primary-500 to-fuchsia-500 text-white text-xs px-3 py-1 rounded-full shadow-md backdrop-blur-md">
              {product.category}
            </div>
          )}
        </div>
      </Link>

      <div className="p-5 flex flex-col flex-grow">
        <Link to={`/products/${product.id}`}>
          <h3 className="font-bold text-lg mb-2 group-hover:text-primary-600 transition-colors line-clamp-2 leading-tight">
            {product.name}
          </h3>
        </Link>

        {product.brand && (
          <p className="text-gray-500 dark:text-gray-400 text-xs mb-2 font-medium">
            {product.brand}
          </p>
        )}

        <p className="text-gray-600 dark:text-gray-400 text-sm mb-3 line-clamp-2">
          {product.description}
        </p>

        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center text-yellow-500">
            <FiStar className="w-4 h-4 fill-current" />
            <span className="ml-1 text-sm font-medium">
              {product.rating.toFixed(1)}
            </span>
            <span className="text-gray-500 text-sm ml-1">
              ({product.numReviews})
            </span>
          </div>
          {product.stock > 5 && (
            <div className="flex items-center text-green-600 text-xs">
              <FiPackage className="w-3 h-3 mr-1" />
              <span>In Stock</span>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100 dark:border-gray-700/50">
          <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-fuchsia-500 block">
            ₹{product.price.toFixed(2)}
          </span>

          <button
            onClick={() => onAddToCart(product.id)}
            disabled={product.stock === 0}
            className="btn-primary flex items-center space-x-2 disabled:opacity-50"
          >
            <FiShoppingCart className="w-5 h-5" />
            <span className="hidden sm:inline">Add</span>
          </button>
        </div>
      </div>
    </div>
  );
};
