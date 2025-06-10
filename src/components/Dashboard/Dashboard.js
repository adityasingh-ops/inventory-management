// components/Dashboard/Dashboard.js
import React, { useState, useEffect } from 'react';
import { supabase } from '@/config/supabase';
import { 
  TrendingUp, 
  Package, 
  ShoppingCart, 
  AlertTriangle, 
  Calendar, 
  DollarSign,
  Users,
  Activity
} from 'lucide-react';

const Dashboard = ({ products }) => {
  const [stats, setStats] = useState({
    totalProducts: 0,
    lowStockItems: 0,
    todaySales: 0,
    todayRevenue: 0,
    thisMonthRevenue: 0,
    totalRevenue: 0,
    totalCustomers: 0
  });
  const [recentSales, setRecentSales] = useState([]);
  const [lowStockProducts, setLowStockProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, [products]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Calculate products stats
      const lowStock = products?.filter(product => product.stock <= (product.min_stock || 5)) || [];
      
      // Fetch today's sales
      const today = new Date().toISOString().split('T')[0];
      const { data: todaySales, error: salesError } = await supabase
        .from('sales')
        .select('*')
        .gte('created_at', today + 'T00:00:00')
        .lte('created_at', today + 'T23:59:59');
      
      if (salesError) throw salesError;

      // Fetch this month's sales
      const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString();
      const { data: monthSales, error: monthError } = await supabase
        .from('sales')
        .select('*')
        .gte('created_at', startOfMonth);
      
      if (monthError) throw monthError;

      // Fetch all sales for total revenue
      const { data: allSales, error: allSalesError } = await supabase
        .from('sales')
        .select('*');
      
      if (allSalesError) throw allSalesError;

      // Fetch recent sales with product details
      const { data: recentSalesData, error: recentError } = await supabase
        .from('sales')
        .select(`
          *,
          sale_items (
            *,
            products (name, barcode)
          )
        `)
        .order('created_at', { ascending: false })
        .limit(5);
      
      if (recentError) throw recentError;

      // Calculate stats
      const todayRevenue = todaySales?.reduce((sum, sale) => sum + parseFloat(sale.total_amount || 0), 0) || 0;
      const monthRevenue = monthSales?.reduce((sum, sale) => sum + parseFloat(sale.total_amount || 0), 0) || 0;
      const totalRevenue = allSales?.reduce((sum, sale) => sum + parseFloat(sale.total_amount || 0), 0) || 0;
      
      // Get unique customers
      const uniqueCustomers = new Set(allSales?.map(sale => sale.customer_phone).filter(Boolean)).size;

      setStats({
        totalProducts: products?.length || 0,
        lowStockItems: lowStock.length,
        todaySales: todaySales?.length || 0,
        todayRevenue,
        thisMonthRevenue: monthRevenue,
        totalRevenue,
        totalCustomers: uniqueCustomers
      });

      setRecentSales(recentSalesData || []);
      setLowStockProducts(lowStock.slice(0, 5));
      
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({ title, value, icon: Icon, color = "blue", subtitle }) => (
    <div className="bg-gray-800 border border-gray-700 rounded-xl p-6 hover:bg-gray-750 transition-colors">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-400 text-sm font-medium">{title}</p>
          <p className={`text-2xl font-bold text-${color}-400 mt-1`}>{value}</p>
          {subtitle && <p className="text-gray-500 text-xs mt-1">{subtitle}</p>}
        </div>
        <div className={`p-3 bg-${color}-500/10 rounded-lg`}>
          <Icon className={`h-6 w-6 text-${color}-400`} />
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Dashboard</h1>
          <p className="text-gray-400 mt-1">Welcome to Prakash Electronics POS System</p>
        </div>
        <div className="mt-4 sm:mt-0 text-sm text-gray-400">
          Last updated: {new Date().toLocaleString()}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Products"
          value={stats.totalProducts}
          icon={Package}
          color="blue"
        />
        <StatCard
          title="Today's Sales"
          value={stats.todaySales}
          icon={ShoppingCart}
          color="green"
          subtitle={`₹${stats.todayRevenue.toFixed(2)} revenue`}
        />
        <StatCard
          title="Low Stock Items"
          value={stats.lowStockItems}
          icon={AlertTriangle}
          color="red"
        />
        <StatCard
          title="Total Customers"
          value={stats.totalCustomers}
          icon={Users}
          color="purple"
        />
      </div>

      {/* Revenue Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          title="Today's Revenue"
          value={`₹${stats.todayRevenue.toFixed(2)}`}
          icon={DollarSign}
          color="green"
        />
        <StatCard
          title="This Month"
          value={`₹${stats.thisMonthRevenue.toFixed(2)}`}
          icon={TrendingUp}
          color="blue"
        />
        <StatCard
          title="Total Revenue"
          value={`₹${stats.totalRevenue.toFixed(2)}`}
          icon={Activity}
          color="purple"
        />
      </div>

      {/* Recent Sales and Low Stock */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Sales */}
        <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
          <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
            <ShoppingCart className="h-5 w-5 mr-2 text-blue-400" />
            Recent Sales
          </h3>
          <div className="space-y-4">
            {recentSales.length > 0 ? (
              recentSales.map((sale) => (
                <div key={sale.id} className="flex items-center justify-between p-4 bg-gray-750 rounded-lg">
                  <div>
                    <p className="font-medium text-white">
                      Sale #{sale.sale_number}
                    </p>
                    <p className="text-sm text-gray-400">
                      {sale.customer_name || 'Walk-in Customer'}
                    </p>
                    <p className="text-xs text-gray-500">
                      {new Date(sale.created_at).toLocaleString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-green-400">
                      ₹{parseFloat(sale.total_amount).toFixed(2)}
                    </p>
                    <p className="text-xs text-gray-500">
                      {sale.payment_method}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-8">No recent sales</p>
            )}
          </div>
        </div>

        {/* Low Stock Items */}
        <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
          <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
            <AlertTriangle className="h-5 w-5 mr-2 text-red-400" />
            Low Stock Alert
          </h3>
          <div className="space-y-4">
            {lowStockProducts.length > 0 ? (
              lowStockProducts.map((product) => (
                <div key={product.id} className="flex items-center justify-between p-4 bg-gray-750 rounded-lg">
                  <div>
                    <p className="font-medium text-white">{product.name}</p>
                    <p className="text-sm text-gray-400">{product.brand}</p>
                    <p className="text-xs text-gray-500">SKU: {product.sku}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-red-400">
                      {product.stock} left
                    </p>
                    <p className="text-xs text-gray-500">
                      Min: {product.min_stock || 5}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-8">All products are well stocked!</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;