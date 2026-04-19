import { useState, useEffect } from "react";
import { FiPlus, FiEdit2, FiTrash2, FiBox } from "react-icons/fi";
import api from "../lib/axios";
import { Breadcrumb } from "../components/Breadcrumb";
import { ProductFormModal } from "../components/ProductFormModal";
import { Toast } from "../components/Toast";

export const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const { data } = await api.get("/products");
      setProducts(data.products);
    } catch (error) {
      console.error("Error fetching products:", error);
      showToast("Failed to fetch products", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const showToast = (message, type) => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleCreateProduct = async (productData) => {
    try {
      await api.post("/products", productData);
      showToast("Product created successfully!", "success");
      setIsModalOpen(false);
      fetchProducts();
    } catch (error) {
      showToast(error.response?.data?.message || "Error creating product", "error");
    }
  };

  const handleUpdateProduct = async (productData) => {
    try {
      await api.put(`/products/${editingProduct.id}`, productData);
      showToast("Product updated successfully!", "success");
      setIsModalOpen(false);
      setEditingProduct(null);
      fetchProducts();
    } catch (error) {
      showToast(error.response?.data?.message || "Error updating product", "error");
    }
  };

  const handleDeleteProduct = async (productId) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    try {
      await api.delete(`/products/${productId}`);
      showToast("Product deleted successfully!", "success");
      fetchProducts();
    } catch (error) {
      showToast("Error deleting product", "error");
    }
  };

  const openEditModal = (product) => {
    setEditingProduct(product);
    setIsModalOpen(true);
  };

  const openCreateModal = () => {
    setEditingProduct(null);
    setIsModalOpen(true);
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex justify-center mt-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      {toast && <Toast {...toast} onClose={() => setToast(null)} />}

      <Breadcrumb items={[{ label: "Admin Dashboard", href: "/admin/dashboard" }, { label: "Products" }]} />

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-fuchsia-600">Product Management</h1>
          <p className="text-gray-500 mt-1">Manage all your store items</p>
        </div>
        <button onClick={openCreateModal} className="btn-primary flex items-center shadow-lg hover:shadow-primary-500/30">
          <FiPlus className="w-5 h-5 mr-2" />
          Add New Product
        </button>
      </div>

      <div className="card overflow-hidden border border-gray-100 dark:border-gray-700 shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 dark:bg-gray-800/50 border-b border-gray-100 dark:border-gray-700">
                <th className="py-4 px-6 font-semibold text-gray-600 dark:text-gray-300">Product</th>
                <th className="py-4 px-6 font-semibold text-gray-600 dark:text-gray-300">Category</th>
                <th className="py-4 px-6 font-semibold text-gray-600 dark:text-gray-300">Price</th>
                <th className="py-4 px-6 font-semibold text-gray-600 dark:text-gray-300">Stock</th>
                <th className="py-4 px-6 font-semibold text-gray-600 dark:text-gray-300 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.length === 0 ? (
                <tr>
                  <td colSpan="5" className="py-12 text-center text-gray-500">
                    <FiBox className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                    No products found. Start by adding one!
                  </td>
                </tr>
              ) : (
                products.map((product) => (
                  <tr key={product.id} className="border-b border-gray-50 dark:border-gray-700/50 hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition-colors group">
                    <td className="py-4 px-6">
                      <div className="flex items-center space-x-4">
                        <div className="h-12 w-12 flex-shrink-0 overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700 bg-white">
                          <img 
                            src={product.image} 
                            alt="" 
                            className="h-full w-full object-cover group-hover:scale-110 transition-transform" 
                            onError={(e) => { e.currentTarget.src = "https://images.unsplash.com/photo-1560393464-5c69a73c5770?auto=format&fit=crop&q=80&w=800"; }}
                          />
                        </div>
                        <div>
                          <div className="font-medium text-gray-900 dark:text-white line-clamp-1">{product.name}</div>
                          <div className="text-sm text-gray-500 line-clamp-1">{product.brand}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800 dark:bg-primary-900 dark:text-primary-200">
                        {product.category}
                      </span>
                    </td>
                    <td className="py-4 px-6 font-semibold text-gray-900 dark:text-white">
                      ₹{product.price.toFixed(2)}
                    </td>
                    <td className="py-4 px-6">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${product.stock > 10 ? 'bg-green-100 text-green-800' : product.stock > 0 ? 'bg-orange-100 text-orange-800' : 'bg-red-100 text-red-800'}`}>
                        {product.stock} in stock
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right space-x-3">
                      <button onClick={() => openEditModal(product)} className="text-primary-600 hover:text-primary-800 transition-colors p-2 hover:bg-primary-50 rounded-lg">
                        <FiEdit2 className="w-5 h-5" />
                      </button>
                      <button onClick={() => handleDeleteProduct(product.id)} className="text-red-500 hover:text-red-700 transition-colors p-2 hover:bg-red-50 rounded-lg">
                        <FiTrash2 className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <ProductFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={editingProduct ? handleUpdateProduct : handleCreateProduct}
        initialData={editingProduct}
      />
    </div>
  );
};
