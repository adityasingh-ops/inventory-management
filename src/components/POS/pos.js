// components/POS/POS.js
import React, { useState, useEffect } from 'react';
import { supabase } from '@/config/supabase';
import { 
  ShoppingCart, 
  Scan, 
  Plus, 
  Minus, 
  Trash2, 
  User, 
  Phone, 
  CreditCard,
  Banknote,
  Printer,
  Calculator,
  X,
  Search
} from 'lucide-react';

// Move CheckoutModal outside of POS component
const CheckoutModal = ({ 
  show, 
  onClose, 
  customerInfo, 
  setCustomerInfo, 
  paymentMethod, 
  setPaymentMethod, 
  discount, 
  setDiscount, 
  receivedAmount, 
  setReceivedAmount, 
  total, 
  subtotal, 
  discountAmount, 
  tax, 
  loading, 
  onComplete 
}) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-gray-800 rounded-xl p-6 w-full max-w-md">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">Checkout</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white p-2"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="space-y-4">
          {/* Customer Info */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Customer Name
            </label>
            <input
              type="text"
              value={customerInfo.name}
              onChange={(e) => setCustomerInfo({...customerInfo, name: e.target.value})}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
              placeholder="Optional"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Phone Number
            </label>
            <input
              type="tel"
              value={customerInfo.phone}
              onChange={(e) => setCustomerInfo({...customerInfo, phone: e.target.value})}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
              placeholder="Optional"
            />
          </div>

          {/* Payment Method */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Payment Method
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => setPaymentMethod('cash')}
                className={`flex items-center justify-center p-3 rounded-lg transition-colors ${
                  paymentMethod === 'cash' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                <Banknote className="h-5 w-5 mr-1" />
                Cash
              </button>
              <button
                onClick={() => setPaymentMethod('card')}
                className={`flex items-center justify-center p-3 rounded-lg transition-colors ${
                  paymentMethod === 'card' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                <CreditCard className="h-5 w-5 mr-1" />
                Card
              </button>
              <button
                onClick={() => setPaymentMethod('upi')}
                className={`flex items-center justify-center p-3 rounded-lg transition-colors ${
                  paymentMethod === 'upi' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                UPI
              </button>
            </div>
          </div>

          {/* Discount */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Discount (%)
            </label>
            <input
              type="number"
              min="0"
              max="100"
              value={discount}
              onChange={(e) => setDiscount(parseFloat(e.target.value) || 0)}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
            />
          </div>

          {/* Received Amount (Cash only) */}
          {paymentMethod === 'cash' && (
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Received Amount (₹)
              </label>
              <input
                type="number"
                step="0.01"
                value={receivedAmount}
                onChange={(e) => setReceivedAmount(e.target.value)}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                placeholder="Enter received amount"
              />
              {receivedAmount && (
                <p className="text-sm text-gray-400 mt-1">
                  Change: ₹{Math.max(0, parseFloat(receivedAmount) - total).toFixed(2)}
                </p>
              )}
            </div>
          )}

          {/* Order Summary */}
          <div className="border-t border-gray-700 pt-4">
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-400">Subtotal:</span>
                <span className="text-white">₹{subtotal.toFixed(2)}</span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between">
                  <span className="text-gray-400">Discount:</span>
                  <span className="text-red-400">-₹{discountAmount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-gray-400">GST (18%):</span>
                <span className="text-white">₹{tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-bold text-lg border-t border-gray-700 pt-2">
                <span className="text-white">Total:</span>
                <span className="text-green-400">₹{total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Complete Sale Button */}
          <button
            onClick={onComplete}
            disabled={loading}
            className="w-full py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold transition-colors disabled:opacity-50"
          >
            {loading ? 'Processing...' : 'Complete Sale'}
          </button>
        </div>
      </div>
    </div>
  );
};

const POS = ({ products, cart, setCart, setScanMode }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    phone: ''
  });
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [receivedAmount, setReceivedAmount] = useState('');
  const [discount, setDiscount] = useState(0);
  const [showCheckout, setShowCheckout] = useState(false);
  const [showReceipt, setShowReceipt] = useState(false);
  const [currentSale, setCurrentSale] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    filterProducts();
  }, [products, searchTerm]);

  const filterProducts = () => {
    if (!searchTerm) {
      setFilteredProducts(products.slice(0, 20)); // Show first 20 products
    } else {
      const filtered = products.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.barcode.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.brand.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredProducts(filtered);
    }
  };

  const addToCart = (product) => {
    if (product.stock <= 0) {
      alert('Product is out of stock!');
      return;
    }

    const existingItem = cart.find(item => item.id === product.id);
    if (existingItem) {
      if (existingItem.quantity >= product.stock) {
        alert('Cannot add more items than available stock!');
        return;
      }
      setCart(cart.map(item =>
        item.id === product.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
  };

  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(productId);
      return;
    }

    const product = products.find(p => p.id === productId);
    if (newQuantity > product.stock) {
      alert('Cannot add more items than available stock!');
      return;
    }

    setCart(cart.map(item =>
      item.id === productId
        ? { ...item, quantity: newQuantity }
        : item
    ));
  };

  const removeFromCart = (productId) => {
    setCart(cart.filter(item => item.id !== productId));
  };

  const clearCart = () => {
    setCart([]);
    setCustomerInfo({ name: '', phone: '' });
    setDiscount(0);
    setReceivedAmount('');
  };

  const calculateTotals = () => {
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const discountAmount = (subtotal * discount) / 100;
    const tax = ((subtotal - discountAmount) * 18) / 100; // 18% GST
    const total = subtotal - discountAmount + tax;
    
    return { subtotal, discountAmount, tax, total };
  };

  const generateSaleNumber = () => {
    const date = new Date();
    const dateStr = date.toISOString().slice(0, 10).replace(/-/g, '');
    const timeStr = date.getTime().toString().slice(-4);
    return `PE${dateStr}${timeStr}`;
  };

  const completeSale = async () => {
    if (cart.length === 0) {
      alert('Cart is empty!');
      return;
    }

    const { total } = calculateTotals();
    
    if (paymentMethod === 'cash' && parseFloat(receivedAmount) < total) {
      alert('Received amount is less than total amount!');
      return;
    }

    setLoading(true);
    
    try {
      const saleNumber = generateSaleNumber();
      
      // Create sale record
      const { data: saleData, error: saleError } = await supabase
        .from('sales')
        .insert([{
          sale_number: saleNumber,
          customer_name: customerInfo.name || null,
          customer_phone: customerInfo.phone || null,
          total_amount: total,
          discount: calculateTotals().discountAmount,
          tax: calculateTotals().tax,
          payment_method: paymentMethod
        }])
        .select()
        .single();

      if (saleError) throw saleError;

      // Create sale items
      const saleItems = cart.map(item => ({
        sale_id: saleData.id,
        product_id: item.id,
        quantity: item.quantity,
        unit_price: item.price,
        total_price: item.price * item.quantity
      }));

      const { error: itemsError } = await supabase
        .from('sale_items')
        .insert(saleItems);

      if (itemsError) throw itemsError;

      // Update product stock
      for (const item of cart) {
        const { error: stockError } = await supabase
          .from('products')
          .update({ 
            stock: item.stock - item.quantity,
            updated_at: new Date().toISOString()
          })
          .eq('id', item.id);

        if (stockError) throw stockError;
      }

      setCurrentSale({
        ...saleData,
        items: cart,
        totals: calculateTotals(),
        receivedAmount: parseFloat(receivedAmount) || total,
        change: paymentMethod === 'cash' ? parseFloat(receivedAmount) - total : 0
      });

      setShowCheckout(false);
      setShowReceipt(true);
      clearCart();

    } catch (error) {
      console.error('Error completing sale:', error);
      alert('Error completing sale: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const printReceipt = () => {
    window.print();
  };

  const { subtotal, discountAmount, tax, total } = calculateTotals();

  const ReceiptModal = () => {
    if (!showReceipt || !currentSale) return null;
  
    // Format date and time properly
    const formatDateTime = (dateString) => {
      const date = new Date(dateString);
      const dateOptions = { 
        year: 'numeric', 
        month: '2-digit', 
        day: '2-digit' 
      };
      const timeOptions = { 
        hour: '2-digit', 
        minute: '2-digit', 
        hour12: true 
      };
      
      return {
        date: date.toLocaleDateString('en-IN', dateOptions),
        time: date.toLocaleTimeString('en-IN', timeOptions)
      };
    };
  
    const { date, time } = formatDateTime(currentSale.created_at);
  
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white text-black w-full max-w-sm max-h-[90vh] overflow-y-auto font-mono" id="receipt">
          {/* Receipt Paper */}
          <div className="p-4 border-2 border-dashed border-gray-300">
            
            {/* Store Header */}
            <div className="text-center border-b border-gray-400 pb-3 mb-3">
              <h1 className="text-xl font-bold tracking-wider">PRAKASH ELECTRONICS</h1>
              <p className="text-sm">Rudrapur Deoria</p>
              <p className="text-sm">Phone: +91-9555993557</p>
              <p className="text-xs">GST: 09DYPPS5702H1ZV</p>
            </div>
  
            {/* Receipt Details */}
            <div className="text-sm mb-3 border-b border-gray-400 pb-3">
              <div className="flex justify-between">
                <span>Receipt #:</span>
                <span>{currentSale.sale_number}</span>
              </div>
              <div className="flex justify-between">
                <span>Date:</span>
                <span>{date}</span>
              </div>
              <div className="flex justify-between">
                <span>Time:</span>
                <span>{time}</span>
              </div>
              {currentSale.customer_name && (
                <>
                  <div className="flex justify-between">
                    <span>Customer:</span>
                    <span>{currentSale.customer_name}</span>
                  </div>
                  {currentSale.customer_phone && (
                    <div className="flex justify-between">
                      <span>Phone:</span>
                      <span>{currentSale.customer_phone}</span>
                    </div>
                  )}
                </>
              )}
            </div>
  
            {/* Items */}
            <div className="mb-3">
              <div className="border-b border-gray-400 pb-1 mb-2">
                <div className="text-xs font-bold">
                  ITEM                 QTY   PRICE    TOTAL
                </div>
              </div>
              {currentSale.items.map((item, index) => (
                <div key={index} className="text-xs mb-2">
                  <div className="font-semibold">{item.name}</div>
                  <div className="text-gray-600 text-xs">{item.brand}</div>
                  <div className="flex justify-between">
                    <span className="w-16 text-center">{item.quantity}</span>
                    <span className="w-16 text-right">₹{item.price.toFixed(2)}</span>
                    <span className="w-20 text-right font-semibold">₹{(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                </div>
              ))}
            </div>
  
            {/* Totals */}
            <div className="border-t border-gray-400 pt-2 mb-3">
              <div className="text-sm space-y-1">
                <div className="flex justify-between">
                  <span>SUBTOTAL:</span>
                  <span>₹{currentSale.totals.subtotal.toFixed(2)}</span>
                </div>
                
                {currentSale.totals.discountAmount > 0 && (
                  <div className="flex justify-between">
                    <span>DISCOUNT:</span>
                    <span>-₹{currentSale.totals.discountAmount.toFixed(2)}</span>
                  </div>
                )}
                
                <div className="flex justify-between">
                  <span>GST (18%):</span>
                  <span>₹{currentSale.totals.tax.toFixed(2)}</span>
                </div>
                
                <div className="border-t border-gray-400 pt-1 mt-2">
                  <div className="flex justify-between font-bold text-lg">
                    <span>TOTAL:</span>
                    <span>₹{currentSale.totals.total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
  
            {/* Payment Info */}
            <div className="border-t border-gray-400 pt-2 mb-3">
              <div className="text-sm space-y-1">
                <div className="flex justify-between">
                  <span>PAYMENT:</span>
                  <span>{currentSale.payment_method.toUpperCase()}</span>
                </div>
                
                {currentSale.payment_method === 'cash' && (
                  <>
                    <div className="flex justify-between">
                      <span>RECEIVED:</span>
                      <span>₹{currentSale.receivedAmount.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>CHANGE:</span>
                      <span>₹{currentSale.change.toFixed(2)}</span>
                    </div>
                  </>
                )}
              </div>
            </div>
  
            {/* Footer */}
            <div className="text-center text-xs border-t border-gray-400 pt-3">
              <div className="mb-2">
                <p className="font-bold">*** TERMS & CONDITIONS ***</p>
              </div>
              <div className="text-left mb-3 space-y-1">
                <p>* Goods once sold cannot be returned</p>
                <p>* Warranty as per manufacturer terms</p>
                <p>* Subject to local jurisdiction</p>
              </div>
              
              <div className="border-t border-gray-400 pt-2 mb-3">
                <p className="font-bold">THANK YOU FOR SHOPPING WITH US!</p>
                <p>VISIT US AGAIN!</p>
                <p className="font-bold">WITH LOVE FROM PRAKASH ELECTRONICS</p>
              </div>
              
              <div className="border-t border-gray-400 pt-2 text-xs">
                <p>Made with ❤️ by <strong>CodeNest Labs</strong></p>
                <p>Contact: adi7753071602@gmail.com</p>
              </div>
            </div>
  
          </div>
  
          {/* Action Buttons */}
          <div className="flex space-x-4 p-4">
            <button
              onClick={printReceipt}
              className="flex-1 py-2 bg-black hover:bg-gray-800 text-white rounded transition-colors flex items-center justify-center"
            >
              <Printer className="h-4 w-4 mr-2" />
              Print
            </button>
            <button
              onClick={() => {
                setShowReceipt(false);
                setCurrentSale(null);
              }}
              className="flex-1 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
      {/* Products Section */}
      <div className="lg:col-span-2 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-3xl font-bold text-white">Point of Sale</h1>
          <button
            onClick={() => setScanMode(true)}
            className="mt-4 sm:mt-0 flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          >
            <Scan className="h-5 w-5 mr-2" />
            Scan Product
          </button>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
          />
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              onClick={() => addToCart(product)}
              className="bg-gray-800 border border-gray-700 rounded-lg p-4 hover:border-gray-600 transition-colors cursor-pointer"
            >
              {product.image_url && (
                <img
                  src={product.image_url}
                  alt={product.name}
                  className="w-full h-24 object-cover rounded mb-2"
                />
              )}
              <h3 className="font-medium text-white text-sm mb-1">{product.name}</h3>
              <p className="text-gray-400 text-xs mb-2">{product.brand}</p>
              <div className="flex items-center justify-between">
                <span className="text-green-400 font-bold">₹{product.price}</span>
                <span className="text-gray-500 text-xs">Stock: {product.stock}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Cart Section */}
      <div className="bg-gray-800 rounded-xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white flex items-center">
            <ShoppingCart className="h-5 w-5 mr-2" />
            Cart ({cart.length})
          </h2>
          {cart.length > 0 && (
            <button
              onClick={clearCart}
              className="text-red-400 hover:text-red-300 text-sm"
            >
              Clear All
            </button>
          )}
        </div>

        {/* Cart Items */}
        <div className="space-y-4 mb-6 flex-1 overflow-y-auto max-h-96">
          {cart.length === 0 ? (
            <p className="text-gray-500 text-center py-8">Cart is empty</p>
          ) : (
            cart.map((item) => (
              <div key={item.id} className="bg-gray-750 rounded-lg p-4">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <h4 className="text-white font-medium text-sm">{item.name}</h4>
                    <p className="text-gray-400 text-xs">{item.brand}</p>
                  </div>
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="text-red-400 hover:text-red-300 p-1"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="p-1 bg-gray-600 hover:bg-gray-500 rounded text-white"
                    >
                      <Minus className="h-3 w-3" />
                    </button>
                    <span className="text-white font-medium px-2">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="p-1 bg-gray-600 hover:bg-gray-500 rounded text-white"
                    >
                      <Plus className="h-3 w-3" />
                    </button>
                  </div>
                  <div className="text-right">
                    <p className="text-white font-medium">₹{(item.price * item.quantity).toFixed(2)}</p>
                    <p className="text-gray-400 text-xs">₹{item.price} each</p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Cart Summary */}
        {cart.length > 0 && (
          <>
            <div className="border-t border-gray-700 pt-4 mb-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Subtotal:</span>
                  <span className="text-white">₹{subtotal.toFixed(2)}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Discount:</span>
                    <span className="text-red-400">-₹{discountAmount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">GST (18%):</span>
                  <span className="text-white">₹{tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-bold text-lg border-t border-gray-700 pt-2">
                  <span className="text-white">Total:</span>
                  <span className="text-green-400">₹{total.toFixed(2)}</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => setShowCheckout(true)}
              className="w-full py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold transition-colors flex items-center justify-center"
            >
              <Calculator className="h-5 w-5 mr-2" />
              Proceed to Checkout
            </button>
          </>
        )}
      </div>

      {/* Modals */}
      <CheckoutModal
        show={showCheckout}
        onClose={() => setShowCheckout(false)}
        customerInfo={customerInfo}
        setCustomerInfo={setCustomerInfo}
        paymentMethod={paymentMethod}
        setPaymentMethod={setPaymentMethod}
        discount={discount}
        setDiscount={setDiscount}
        receivedAmount={receivedAmount}
        setReceivedAmount={setReceivedAmount}
        total={total}
        subtotal={subtotal}
        discountAmount={discountAmount}
        tax={tax}
        loading={loading}
        onComplete={completeSale}
      />
      <ReceiptModal />
    </div>
  );
};

export default POS;