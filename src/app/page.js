"use client";
import React, { useState, useEffect } from 'react';
import Header from '@/components/Header/Header';
import Dashboard from '@/components/Dashboard/Dashboard';
import Products from '@/components/Products/products';
import POS from '@/components/POS/pos';
import Analytics from '@/components/Analytics/Analytics';
import BarcodeScanner from '@/components/BarCodeScanner/BarCodeScanner';
import { supabase } from '@/config/supabase';

// Login Component
const LoginForm = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');


  // using login function from supabase
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
      setMessage('Login successful!');
    } catch (error) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center">
      <div className="bg-gray-900 p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-white mb-6 text-center">
          Login to RetailPOS
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-300 text-sm font-medium mb-2">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          
          <div>
            <label className="block text-gray-300 text-sm font-medium mb-2">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        
        {message && (
          <p className={`mt-4 text-sm text-center ${
            message.includes('successful') 
              ? 'text-green-400' 
              : 'text-red-400'
          }`}>
            {message}
          </p>
        )}
      </div>
    </div>
  );
};

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [scanMode, setScanMode] = useState(false);
  const [isOnline, setIsOnline] = useState(true);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  

  useEffect(() => {
    // Check initial auth state
    checkAuth();
    
    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setUser(session?.user ?? null);
        setAuthLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (user) {
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
    }
  }, [user]);

  const checkAuth = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
    } catch (error) {
      console.error('Error checking auth:', error);
    } finally {
      setAuthLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

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
      case 'analytics':
        return <Analytics products={products} />;
      default:
        return <Dashboard products={products} />;
    }
  };

  // Show loading spinner while checking auth
  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Show login form if not authenticated
  if (!user) {
    return <LoginForm onLogin={setUser} />;
  }

  // Show main app if authenticated
  return (
    <div className="min-h-screen bg-gray-950">
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        cart={cart}
        isOnline={isOnline}
        user={user}
        onLogout={handleLogout}
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