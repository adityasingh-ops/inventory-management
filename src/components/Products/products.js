// components/Products/Products.js
import React, { useState, useEffect } from 'react';
import { supabase } from '@/config/supabase';
import {
  Plus,
  Search,
  Filter,
  Edit,
  Trash2,
  Scan,
  AlertTriangle,
  CheckCircle,
  X,
} from 'lucide-react';

// --- Utility Functions ---
const getInitialFormData = () => ({
  name: '',
  sku: '',
  barcode: '',
  category: '',
  brand: '',
  price: '',
  cost: '',
  stock: '',
  min_stock: '',
  supplier: '',
  warranty: '',
  image_url: '',
});

const getStockStatus = (stock, minStock) =>
  stock <= minStock
    ? { status: 'low', color: 'text-red-400', icon: AlertTriangle }
    : { status: 'good', color: 'text-green-400', icon: CheckCircle };

// --- Product Modal Component ---
const ProductModal = ({
  isEdit = false,
  show,
  onClose,
  onSubmit,
  formData,
  setFormData,
  loading,
  setScanMode, // Added to handle barcode scan button
}) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-gray-800 rounded-xl p-6 w-full max-w-2xl max-h-90vh overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">
            {isEdit ? 'Edit Product' : 'Add New Product'}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white p-2">
            <X className="h-6 w-6" />
          </button>
        </div>
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Product Name */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Product Name *
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
              />
            </div>
            {/* SKU */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                SKU *
              </label>
              <input
                type="text"
                required
                value={formData.sku}
                onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
              />
            </div>
            {/* Barcode */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Barcode *
              </label>
              <div className="flex">
                <input
                  type="text"
                  required
                  value={formData.barcode}
                  onChange={(e) => setFormData({ ...formData, barcode: e.target.value })}
                  className="flex-1 px-3 py-2 bg-gray-700 border border-gray-600 rounded-l-lg text-white focus:outline-none focus:border-blue-500"
                />
                <button
                  type="button"
                  onClick={() => setScanMode && setScanMode(true)}
                  className="px-3 py-2 bg-blue-600 hover:bg-blue-700 rounded-r-lg transition-colors"
                >
                  <Scan className="h-5 w-5" />
                </button>
              </div>
            </div>
            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Category *
              </label>
              <select
                required
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
              >
                <option value="">Select Category</option>
                <option value="Mobile">Mobile</option>
                <option value="Laptop">Laptop</option>
                <option value="TV">TV</option>
                <option value="Audio">Audio</option>
                <option value="Gaming">Gaming</option>
                <option value="Accessories">Accessories</option>
                <option value="Home Appliances">Home Appliances</option>
                <option value="Other">Other</option>
              </select>
            </div>
            {/* Brand */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Brand *
              </label>
              <input
                type="text"
                required
                value={formData.brand}
                onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
              />
            </div>
            {/* Price */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Price (₹) *
              </label>
              <input
                type="number"
                step="0.01"
                required
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
              />
            </div>
            {/* Cost */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Cost (₹) *
              </label>
              <input
                type="number"
                step="0.01"
                required
                value={formData.cost}
                onChange={(e) => setFormData({ ...formData, cost: e.target.value })}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
              />
            </div>
            {/* Stock */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Stock Quantity *
              </label>
              <input
                type="number"
                required
                value={formData.stock}
                onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
              />
            </div>
            {/* Min Stock */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Minimum Stock
              </label>
              <input
                type="number"
                value={formData.min_stock}
                onChange={(e) => setFormData({ ...formData, min_stock: e.target.value })}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
              />
            </div>
            {/* Supplier */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Supplier
              </label>
              <input
                type="text"
                value={formData.supplier}
                onChange={(e) => setFormData({ ...formData, supplier: e.target.value })}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
              />
            </div>
            {/* Warranty */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Warranty
              </label>
              <input
                type="text"
                value={formData.warranty}
                onChange={(e) => setFormData({ ...formData, warranty: e.target.value })}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                placeholder="e.g., 1 Year, 6 Months"
              />
            </div>
          </div>
          {/* Image URL */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Image URL
            </label>
            <input
              type="url"
              value={formData.image_url}
              onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
            />
          </div>
          {/* Modal Actions */}
          <div className="flex justify-end space-x-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 border border-gray-600 text-gray-300 rounded-lg hover:bg-gray-700 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50"
            >
              {loading ? 'Saving...' : isEdit ? 'Update Product' : 'Add Product'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// --- Main Products Component ---
const Products = ({ products, setProducts, setScanMode, fetchProducts }) => {
  // --- State ---
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [formData, setFormData] = useState(getInitialFormData());
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);

  // --- Effects ---
  useEffect(() => {
    filterProducts();
    extractCategories();
  }, [products, searchTerm, selectedCategory]);

  // --- Helpers ---
  const extractCategories = () => {
    const uniqueCategories = [...new Set(products.map((p) => p.category).filter(Boolean))];
    setCategories(uniqueCategories);
  };

  const filterProducts = () => {
    let filtered = products;
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (product) =>
          product.name.toLowerCase().includes(term) ||
          product.sku.toLowerCase().includes(term) ||
          product.barcode.toLowerCase().includes(term) ||
          product.brand.toLowerCase().includes(term)
      );
    }
    if (selectedCategory !== 'all') {
      filtered = filtered.filter((product) => product.category === selectedCategory);
    }
    setFilteredProducts(filtered);
  };

  const resetForm = () => setFormData(getInitialFormData());

  // --- CRUD Handlers ---
  const handleAddProduct = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { error } = await supabase.from('products').insert([
        {
          ...formData,
          price: parseFloat(formData.price),
          cost: parseFloat(formData.cost),
          stock: parseInt(formData.stock),
          min_stock: parseInt(formData.min_stock) || 5,
        },
      ]);
      if (error) throw error;
      await fetchProducts();
      setShowAddModal(false);
      resetForm();
      alert('Product added successfully!');
    } catch (error) {
      console.error('Error adding product:', error);
      alert('Error adding product: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEditProduct = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { error } = await supabase
        .from('products')
        .update({
          ...formData,
          price: parseFloat(formData.price),
          cost: parseFloat(formData.cost),
          stock: parseInt(formData.stock),
          min_stock: parseInt(formData.min_stock) || 5,
          updated_at: new Date().toISOString(),
        })
        .eq('id', selectedProduct.id);
      if (error) throw error;
      await fetchProducts();
      setShowEditModal(false);
      resetForm();
      setSelectedProduct(null);
      alert('Product updated successfully!');
    } catch (error) {
      console.error('Error updating product:', error);
      alert('Error updating product: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProduct = async (productId) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    try {
      const { error } = await supabase.from('products').delete().eq('id', productId);
      if (error) throw error;
      await fetchProducts();
      alert('Product deleted successfully!');
    } catch (error) {
      console.error('Error deleting product:', error);
      alert('Error deleting product: ' + error.message);
    }
  };

  const openEditModal = (product) => {
    setSelectedProduct(product);
    setFormData({
      name: product.name,
      sku: product.sku,
      barcode: product.barcode,
      category: product.category,
      brand: product.brand,
      price: product.price.toString(),
      cost: product.cost.toString(),
      stock: product.stock.toString(),
      min_stock: (product.min_stock || 5).toString(),
      supplier: product.supplier || '',
      warranty: product.warranty || '',
      image_url: product.image_url || '',
    });
    setShowEditModal(true);
  };

  // --- Render ---
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Products</h1>
          <p className="text-gray-400 mt-1">Manage your inventory</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="mt-4 sm:mt-0 flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
        >
          <Plus className="h-5 w-5 mr-2" />
          Add Product
        </button>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
          />
        </div>
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
        >
          <option value="all">All Categories</option>
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredProducts.map((product) => {
          const { color, icon: StockIcon } = getStockStatus(product.stock, product.min_stock || 5);
          return (
            <div
              key={product.id}
              className="bg-gray-800 border border-gray-700 rounded-xl p-6 hover:border-gray-600 transition-colors"
            >
              {product.image_url && (
                <img
                  src={product.image_url}
                  alt={product.name}
                  className="w-full h-32 object-cover rounded-lg mb-4"
                />
              )}
              <div className="space-y-2">
                <h3 className="font-semibold text-white text-lg">{product.name}</h3>
                <p className="text-gray-400 text-sm">{product.brand}</p>
                <p className="text-gray-500 text-xs">SKU: {product.sku}</p>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-green-400">₹{product.price}</span>
                  <div className={`flex items-center ${color}`}>
                    <StockIcon className="h-4 w-4 mr-1" />
                    <span className="text-sm">{product.stock}</span>
                  </div>
                </div>
                <div className="pt-4 flex justify-between">
                  <button
                    onClick={() => openEditModal(product)}
                    className="flex items-center px-3 py-1 text-blue-400 hover:bg-blue-500/10 rounded-lg transition-colors"
                  >
                    <Edit className="h-4 w-4 mr-1" />
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteProduct(product.id)}
                    className="flex items-center px-3 py-1 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                  >
                    <Trash2 className="h-4 w-4 mr-1" />
                    Delete
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modals */}
      <ProductModal
        show={showAddModal}
        onClose={() => {
          setShowAddModal(false);
          resetForm();
        }}
        onSubmit={handleAddProduct}
        formData={formData}
        setFormData={setFormData}
        loading={loading}
        setScanMode={setScanMode}
      />
      <ProductModal
        isEdit
        show={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          resetForm();
          setSelectedProduct(null);
        }}
        onSubmit={handleEditProduct}
        formData={formData}
        setFormData={setFormData}
        loading={loading}
        setScanMode={setScanMode}
      />
    </div>
  );
};

export default Products;
