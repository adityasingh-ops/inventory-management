// "use client";
// import React, { useState, useEffect, useRef } from 'react';
// import { 
//   Package, 
//   Scan, 
//   ShoppingCart, 
//   Users, 
//   TrendingUp, 
//   Plus, 
//   Search, 
//   Filter,
//   Edit3,
//   Trash2,
//   Eye,
//   Camera,
//   Check,
//   X,
//   Download,
//   Printer,
//   BarChart3,
//   DollarSign,
//   AlertTriangle,
//   Menu,
//   Home,
//   Settings
// } from 'lucide-react';

// const InventoryManagementSystem = () => {
//   const [activeTab, setActiveTab] = useState('dashboard');
//   const [products, setProducts] = useState([
//     {
//       id: 1,
//       name: 'Wireless Headphones',
//       sku: 'WH001',
//       barcode: '1234567890123',
//       category: 'Electronics',
//       price: 99.99,
//       cost: 60.00,
//       stock: 45,
//       minStock: 10,
//       supplier: 'TechCorp',
//       image: '/api/placeholder/100/100'
//     },
//     {
//       id: 2,
//       name: 'Coffee Beans Premium',
//       sku: 'CB002',
//       barcode: '2345678901234',
//       category: 'Food & Beverage',
//       price: 24.99,
//       cost: 15.00,
//       stock: 8,
//       minStock: 15,
//       supplier: 'Bean Co',
//       image: '/api/placeholder/100/100'
//     },
//     {
//       id: 3,
//       name: 'Yoga Mat',
//       sku: 'YM003',
//       barcode: '3456789012345',
//       category: 'Sports',
//       price: 39.99,
//       cost: 25.00,
//       stock: 22,
//       minStock: 5,
//       supplier: 'FitGear',
//       image: '/api/placeholder/100/100'
//     }
//   ]);

//   const [cart, setCart] = useState([]);
//   const [scanMode, setScanMode] = useState(false);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [showAddProduct, setShowAddProduct] = useState(false);
//   const [selectedProduct, setSelectedProduct] = useState(null);
//   const [showBill, setShowBill] = useState(false);
//   const [completedSale, setCompletedSale] = useState(null);

//   // Calculate dashboard metrics
//   const totalProducts = products.length;
//   const totalValue = products.reduce((sum, p) => sum + (p.price * p.stock), 0);
//   const lowStockItems = products.filter(p => p.stock <= p.minStock).length;
//   const totalRevenue = 15420; // Mock data

//   // Filtered products
//   const filteredProducts = products.filter(product =>
//     product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//     product.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
//     product.barcode.includes(searchTerm)
//   );

//   // Add to cart
//   const addToCart = (product, quantity = 1) => {
//     const existingItem = cart.find(item => item.id === product.id);
//     if (existingItem) {
//       setCart(cart.map(item =>
//         item.id === product.id
//           ? { ...item, quantity: item.quantity + quantity }
//           : item
//       ));
//     } else {
//       setCart([...cart, { ...product, quantity }]);
//     }
//   };

//   // Remove from cart
//   const removeFromCart = (productId) => {
//     setCart(cart.filter(item => item.id !== productId));
//   };

//   // Calculate cart total
//   const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

//   // Mock barcode scanner
//   const handleScan = (barcode) => {
//     const product = products.find(p => p.barcode === barcode);
//     if (product) {
//       addToCart(product);
//       setScanMode(false);
//     }
//   };

//   // Complete sale
//   const completeSale = () => {
//     const saleData = {
//       id: Date.now(),
//       items: cart,
//       total: cartTotal,
//       date: new Date().toISOString(),
//       paymentMethod: 'Cash'
//     };
//     setCompletedSale(saleData);
//     setCart([]);
//     setShowBill(true);
//   };

//   // Print bill
//   const printBill = () => {
//     window.print();
//   };

//   // Dashboard Component
//   const Dashboard = () => (
//     <div className="space-y-6">
//       {/* Stats Cards */}
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//         <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-6 text-white">
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="text-blue-100 text-sm">Total Products</p>
//               <p className="text-3xl font-bold">{totalProducts}</p>
//             </div>
//             <Package className="h-12 w-12 text-blue-200" />
//           </div>
//         </div>
        
//         <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-6 text-white">
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="text-green-100 text-sm">Inventory Value</p>
//               <p className="text-3xl font-bold">${totalValue.toFixed(0)}</p>
//             </div>
//             <DollarSign className="h-12 w-12 text-green-200" />
//           </div>
//         </div>
        
//         <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl p-6 text-white">
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="text-orange-100 text-sm">Low Stock Items</p>
//               <p className="text-3xl font-bold">{lowStockItems}</p>
//             </div>
//             <AlertTriangle className="h-12 w-12 text-orange-200" />
//           </div>
//         </div>
        
//         <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl p-6 text-white">
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="text-purple-100 text-sm">Total Revenue</p>
//               <p className="text-3xl font-bold">${totalRevenue}</p>
//             </div>
//             <TrendingUp className="h-12 w-12 text-purple-200" />
//           </div>
//         </div>
//       </div>

//       {/* Quick Actions */}
//       <div className="bg-white rounded-xl shadow-lg p-6">
//         <h3 className="text-xl font-semibold mb-4">Quick Actions</h3>
//         <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
//           <button
//             onClick={() => setActiveTab('products')}
//             className="flex flex-col items-center p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
//           >
//             <Package className="h-8 w-8 text-blue-600 mb-2" />
//             <span className="text-sm font-medium text-blue-600">View Products</span>
//           </button>
          
//           <button
//             onClick={() => setScanMode(true)}
//             className="flex flex-col items-center p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
//           >
//             <Scan className="h-8 w-8 text-green-600 mb-2" />
//             <span className="text-sm font-medium text-green-600">Scan Product</span>
//           </button>
          
//           <button
//             onClick={() => setActiveTab('pos')}
//             className="flex flex-col items-center p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors"
//           >
//             <ShoppingCart className="h-8 w-8 text-purple-600 mb-2" />
//             <span className="text-sm font-medium text-purple-600">Point of Sale</span>
//           </button>
          
//           <button
//             onClick={() => setShowAddProduct(true)}
//             className="flex flex-col items-center p-4 bg-orange-50 rounded-lg hover:bg-orange-100 transition-colors"
//           >
//             <Plus className="h-8 w-8 text-orange-600 mb-2" />
//             <span className="text-sm font-medium text-orange-600">Add Product</span>
//           </button>
//         </div>
//       </div>

//       {/* Low Stock Alert */}
//       {lowStockItems > 0 && (
//         <div className="bg-red-50 border border-red-200 rounded-xl p-6">
//           <div className="flex items-center">
//             <AlertTriangle className="h-6 w-6 text-red-600 mr-3" />
//             <div>
//               <h4 className="text-red-800 font-medium">Low Stock Alert</h4>
//               <p className="text-red-600 text-sm">
//                 {lowStockItems} product(s) are running low on stock. Please reorder soon.
//               </p>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );

//   // Products Component
//   const Products = () => (
//     <div className="space-y-6">
//       <div className="flex justify-between items-center">
//         <h2 className="text-2xl font-bold text-gray-800">Products</h2>
//         <button
//           onClick={() => setShowAddProduct(true)}
//           className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
//         >
//           <Plus className="h-4 w-4" />
//           Add Product
//         </button>
//       </div>

//       {/* Search and Filter */}
//       <div className="bg-white rounded-xl shadow-lg p-6">
//         <div className="flex gap-4 mb-6">
//           <div className="flex-1 relative">
//             <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
//             <input
//               type="text"
//               placeholder="Search products..."
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//               className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//             />
//           </div>
//           <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2">
//             <Filter className="h-4 w-4" />
//             Filter
//           </button>
//         </div>

//         {/* Products Table */}
//         <div className="overflow-x-auto">
//           <table className="w-full">
//             <thead>
//               <tr className="border-b border-gray-200">
//                 <th className="text-left py-3 px-4 font-medium text-gray-700">Product</th>
//                 <th className="text-left py-3 px-4 font-medium text-gray-700">SKU</th>
//                 <th className="text-left py-3 px-4 font-medium text-gray-700">Category</th>
//                 <th className="text-left py-3 px-4 font-medium text-gray-700">Price</th>
//                 <th className="text-left py-3 px-4 font-medium text-gray-700">Stock</th>
//                 <th className="text-left py-3 px-4 font-medium text-gray-700">Status</th>
//                 <th className="text-left py-3 px-4 font-medium text-gray-700">Actions</th>
//               </tr>
//             </thead>
//             <tbody>
//               {filteredProducts.map((product) => (
//                 <tr key={product.id} className="border-b border-gray-100 hover:bg-gray-50">
//                   <td className="py-4 px-4">
//                     <div className="flex items-center gap-3">
//                       <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
//                         <Package className="h-6 w-6 text-gray-500" />
//                       </div>
//                       <div>
//                         <p className="font-medium text-gray-800">{product.name}</p>
//                         <p className="text-sm text-gray-500">{product.barcode}</p>
//                       </div>
//                     </div>
//                   </td>
//                   <td className="py-4 px-4 text-gray-600">{product.sku}</td>
//                   <td className="py-4 px-4 text-gray-600">{product.category}</td>
//                   <td className="py-4 px-4 font-medium text-gray-800">${product.price}</td>
//                   <td className="py-4 px-4 text-gray-600">{product.stock}</td>
//                   <td className="py-4 px-4">
//                     <span className={`px-2 py-1 rounded-full text-xs font-medium ${
//                       product.stock <= product.minStock
//                         ? 'bg-red-100 text-red-800'
//                         : 'bg-green-100 text-green-800'
//                     }`}>
//                       {product.stock <= product.minStock ? 'Low Stock' : 'In Stock'}
//                     </span>
//                   </td>
//                   <td className="py-4 px-4">
//                     <div className="flex gap-2">
//                       <button className="p-2 text-blue-600 hover:bg-blue-50 rounded">
//                         <Eye className="h-4 w-4" />
//                       </button>
//                       <button className="p-2 text-green-600 hover:bg-green-50 rounded">
//                         <Edit3 className="h-4 w-4" />
//                       </button>
//                       <button className="p-2 text-red-600 hover:bg-red-50 rounded">
//                         <Trash2 className="h-4 w-4" />
//                       </button>
//                     </div>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       </div>
//     </div>
//   );

//   // POS Component
//   const POS = () => (
//     <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//       {/* Product Selection */}
//       <div className="lg:col-span-2 space-y-6">
//         <div className="flex justify-between items-center">
//           <h2 className="text-2xl font-bold text-gray-800">Point of Sale</h2>
//           <button
//             onClick={() => setScanMode(true)}
//             className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center gap-2"
//           >
//             <Scan className="h-4 w-4" />
//             Scan Item
//           </button>
//         </div>

//         <div className="bg-white rounded-xl shadow-lg p-6">
//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
//             {products.map((product) => (
//               <div
//                 key={product.id}
//                 className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
//                 onClick={() => addToCart(product)}
//               >
//                 <div className="w-full h-32 bg-gray-200 rounded-lg mb-3 flex items-center justify-center">
//                   <Package className="h-12 w-12 text-gray-400" />
//                 </div>
//                 <h3 className="font-medium text-gray-800 mb-1">{product.name}</h3>
//                 <p className="text-sm text-gray-500 mb-2">{product.sku}</p>
//                 <p className="text-lg font-bold text-blue-600">${product.price}</p>
//                 <p className="text-xs text-gray-400">Stock: {product.stock}</p>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>

//       {/* Cart */}
//       <div className="space-y-6">
//         <div className="bg-white rounded-xl shadow-lg p-6">
//           <h3 className="text-lg font-semibold mb-4">Cart</h3>
          
//           {cart.length === 0 ? (
//             <p className="text-gray-500 text-center py-8">Cart is empty</p>
//           ) : (
//             <div className="space-y-4">
//               {cart.map((item) => (
//                 <div key={item.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
//                   <div className="flex-1">
//                     <p className="font-medium text-gray-800">{item.name}</p>
//                     <p className="text-sm text-gray-500">
//                       ${item.price} x {item.quantity}
//                     </p>
//                   </div>
//                   <div className="flex items-center gap-2">
//                     <span className="font-bold text-gray-800">
//                       ${(item.price * item.quantity).toFixed(2)}
//                     </span>
//                     <button
//                       onClick={() => removeFromCart(item.id)}
//                       className="text-red-600 hover:bg-red-50 p-1 rounded"
//                     >
//                       <X className="h-4 w-4" />
//                     </button>
//                   </div>
//                 </div>
//               ))}
              
//               <div className="border-t pt-4">
//                 <div className="flex justify-between items-center text-lg font-bold">
//                   <span>Total:</span>
//                   <span>${cartTotal.toFixed(2)}</span>
//                 </div>
//               </div>
              
//               <button
//                 onClick={completeSale}
//                 className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 font-medium"
//               >
//                 Complete Sale
//               </button>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );

//   // Scanner Modal
//   const ScannerModal = () => (
//     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//       <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4">
//         <div className="flex justify-between items-center mb-4">
//           <h3 className="text-lg font-semibold">Barcode Scanner</h3>
//           <button
//             onClick={() => setScanMode(false)}
//             className="text-gray-500 hover:text-gray-700"
//           >
//             <X className="h-6 w-6" />
//           </button>
//         </div>
        
//         <div className="text-center py-8">
//           <Camera className="h-16 w-16 text-gray-400 mx-auto mb-4" />
//           <p className="text-gray-600 mb-4">Point camera at barcode</p>
          
//           {/* Mock scanner - in real app, integrate with camera API */}
//           <div className="space-y-2">
//             <button
//               onClick={() => handleScan('1234567890123')}
//               className="w-full p-2 text-left border rounded hover:bg-gray-50"
//             >
//               Test: Scan Wireless Headphones
//             </button>
//             <button
//               onClick={() => handleScan('2345678901234')}
//               className="w-full p-2 text-left border rounded hover:bg-gray-50"
//             >
//               Test: Scan Coffee Beans
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );

//   // Bill Modal
//   const BillModal = () => (
//     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//       <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4 max-h-96 overflow-y-auto">
//         <div className="flex justify-between items-center mb-4">
//           <h3 className="text-lg font-semibold">Sale Receipt</h3>
//           <button
//             onClick={() => setShowBill(false)}
//             className="text-gray-500 hover:text-gray-700"
//           >
//             <X className="h-6 w-6" />
//           </button>
//         </div>
        
//         {completedSale && (
//           <div className="space-y-4">
//             <div className="text-center border-b pb-4">
//               <h2 className="text-xl font-bold">Your Store</h2>
//               <p className="text-sm text-gray-600">123 Main St, City, State</p>
//               <p className="text-sm text-gray-600">Phone: (555) 123-4567</p>
//             </div>
            
//             <div className="space-y-2">
//               <div className="flex justify-between text-sm">
//                 <span>Receipt #:</span>
//                 <span>{completedSale.id}</span>
//               </div>
//               <div className="flex justify-between text-sm">
//                 <span>Date:</span>
//                 <span>{new Date(completedSale.date).toLocaleString()}</span>
//               </div>
//             </div>
            
//             <div className="border-t border-b py-4 space-y-2">
//               {completedSale.items.map((item) => (
//                 <div key={item.id} className="flex justify-between text-sm">
//                   <div>
//                     <p className="font-medium">{item.name}</p>
//                     <p className="text-gray-600">${item.price} x {item.quantity}</p>
//                   </div>
//                   <span>${(item.price * item.quantity).toFixed(2)}</span>
//                 </div>
//               ))}
//             </div>
            
//             <div className="space-y-2">
//               <div className="flex justify-between font-bold text-lg">
//                 <span>Total:</span>
//                 <span>${completedSale.total.toFixed(2)}</span>
//               </div>
//               <div className="flex justify-between text-sm">
//                 <span>Payment Method:</span>
//                 <span>{completedSale.paymentMethod}</span>
//               </div>
//             </div>
            
//             <div className="text-center text-sm text-gray-600 pt-4 border-t">
//               <p>Thank you for your purchase!</p>
//               <p>Please keep this receipt for your records.</p>
//             </div>
            
//             <button
//               onClick={printBill}
//               className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 flex items-center justify-center gap-2"
//             >
//               <Printer className="h-4 w-4" />
//               Print Receipt
//             </button>
//           </div>
//         )}
//       </div>
//     </div>
//   );

//   return (
//     <div className="min-h-screen bg-gray-100">
//       {/* Header */}
//       <header className="bg-white shadow-sm border-b">
//         <div className="px-6 py-4">
//           <div className="flex items-center justify-between">
//             <div className="flex items-center gap-4">
//               <div className="flex items-center gap-2">
//                 <Package className="h-8 w-8 text-blue-600" />
//                 <span className="text-2xl font-bold text-gray-800">InventoryPro</span>
//               </div>
//             </div>
            
//             <nav className="hidden md:flex items-center gap-6">
//               <button
//                 onClick={() => setActiveTab('dashboard')}
//                 className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
//                   activeTab === 'dashboard'
//                     ? 'bg-blue-100 text-blue-700'
//                     : 'text-gray-600 hover:text-gray-800'
//                 }`}
//               >
//                 <Home className="h-4 w-4" />
//                 Dashboard
//               </button>
              
//               <button
//                 onClick={() => setActiveTab('products')}
//                 className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
//                   activeTab === 'products'
//                     ? 'bg-blue-100 text-blue-700'
//                     : 'text-gray-600 hover:text-gray-800'
//                 }`}
//               >
//                 <Package className="h-4 w-4" />
//                 Products
//               </button>
              
//               <button
//                 onClick={() => setActiveTab('pos')}
//                 className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
//                   activeTab === 'pos'
//                     ? 'bg-blue-100 text-blue-700'
//                     : 'text-gray-600 hover:text-gray-800'
//                 }`}
//               >
//                 <ShoppingCart className="h-4 w-4" />
//                 POS
//               </button>
//             </nav>
            
//             <div className="flex items-center gap-4">
//               {cart.length > 0 && (
//                 <div className="relative">
//                   <ShoppingCart className="h-6 w-6 text-gray-600" />
//                   <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
//                     {cart.reduce((sum, item) => sum + item.quantity, 0)}
//                   </span>
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>
//       </header>

//       {/* Main Content */}
//       <main className="p-6">
//         {activeTab === 'dashboard' && <Dashboard />}
//         {activeTab === 'products' && <Products />}
//         {activeTab === 'pos' && <POS />}
//       </main>

//       {/* Modals */}
//       {scanMode && <ScannerModal />}
//       {showBill && <BillModal />}
//     </div>
//   );
// };

// export default InventoryManagementSystem;

"use client";
import React, { useState, useEffect } from 'react';
import Header from '@/components/Header/Header';
import Dashboard from '@/components/Dashboard/Dashboard';
import Products from '@/components/Products/products';
import POS from '@/components/POS/pos';
// import Analytics from './components/Analytics/Analytics';
import BarcodeScanner from '@/components/BarCodeScanner/BarCodeScanner';
import { supabase } from '@/config/supabase';


function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [scanMode, setScanMode] = useState(false);
  const [isOnline, setIsOnline] = useState();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
    
    // Online/Offline detection
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setProducts(data || []);
    } catch (error) {
      console.error('Error fetching products:', error);
      // Load from localStorage as fallback
      const localProducts = localStorage.getItem('products');
      if (localProducts) {
        setProducts(JSON.parse(localProducts));
      }
    } finally {
      setLoading(false);
    }
  };

  const handleBarcodeScanned = async (barcode) => {
    const product = products.find(p => p.barcode === barcode);
    
    if (product) {
      if (activeTab === 'pos') {
        // Add to cart
        const existingItem = cart.find(item => item.id === product.id);
        if (existingItem) {
          setCart(cart.map(item =>
            item.id === product.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          ));
        } else {
          setCart([...cart, { ...product, quantity: 1 }]);
        }
      }
    } else {
      alert('Product not found! Please add this product first.');
    }
    
    setScanMode(false);
  };

  const renderActiveComponent = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500"></div>
        </div>
      );
    }

    switch (activeTab) {
      case 'dashboard':
        return <Dashboard products={products} />;
      case 'products':
        return (
          <Products
            products={products}
            setProducts={setProducts}
            setScanMode={setScanMode}
            fetchProducts={fetchProducts}
          />
        );
      case 'pos':
        return (
          <POS
            products={products}
            cart={cart}
            setCart={setCart}
            setScanMode={setScanMode}
          />
        );
      // case 'analytics':
      //   return <Analytics products={products} />;
      default:
        return <Dashboard products={products} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-950">
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        cart={cart}
        isOnline={isOnline}
      />
      
      <main className="px-6 py-8">
        <div className="max-w-7xl mx-auto">
          {renderActiveComponent()}
        </div>
      </main>

      {scanMode && (
        <BarcodeScanner
          onBarcodeScanned={handleBarcodeScanned}
          onClose={() => setScanMode(false)}
        />
      )}
    </div>
  );
}

export default App;