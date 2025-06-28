import React, { useState, useEffect } from 'react';
import {
  BarChart3, TrendingUp, TrendingDown, DollarSign, Package, ShoppingCart, Users,
  Calendar, Download, Printer, Eye, Filter, Search, ArrowUp, ArrowDown, Clock,
  AlertTriangle, CheckCircle, XCircle
} from 'lucide-react';
import { supabase } from '@/config/supabase';
import {
  LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';

const Analytics = ({ products }) => {
  // State hooks
  const [dateRange, setDateRange] = useState('7days');
  const [salesData, setSalesData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [analytics, setAnalytics] = useState({
    totalSales: 0,
    totalRevenue: 0,
    totalProducts: 0,
    lowStockItems: 0,
    topProducts: [],
    recentSales: [],
    categoryData: [],
    dailySales: [],
    monthlyTrends: []
  });

  // Fetch analytics data when dateRange or products change
  useEffect(() => {
    fetchAnalytics();
  }, [dateRange, products]);

  // Fetch analytics data from Supabase
  const fetchAnalytics = async () => {
    try {
      setLoading(true);

      // Calculate date range
      const endDate = new Date();
      const startDate = new Date();
      switch (dateRange) {
        case '7days':
          startDate.setDate(endDate.getDate() - 7);
          break;
        case '30days':
          startDate.setDate(endDate.getDate() - 30);
          break;
        case '90days':
          startDate.setDate(endDate.getDate() - 90);
          break;
        case '1year':
          startDate.setFullYear(endDate.getFullYear() - 1);
          break;
        default:
          startDate.setDate(endDate.getDate() - 7);
      }

      // Fetch sales data from Supabase
      const { data: sales, error: salesError } = await supabase
        .from('sales')
        .select(`
          *,
          sale_items (
            *,
            products (*)
          )
        `)
        .gte('created_at', startDate.toISOString())
        .lte('created_at', endDate.toISOString())
        .order('created_at', { ascending: false });

      if (salesError) throw salesError;

      // Process and set analytics
      const processedAnalytics = processAnalyticsData(sales || [], products);
      setAnalytics(processedAnalytics);
      setSalesData(sales || []);
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  // Process analytics data
  const processAnalyticsData = (sales, products) => {
    // Totals
    const totalSales = sales.length;
    const totalRevenue = sales.reduce((sum, sale) => sum + parseFloat(sale.total_amount || 0), 0);
    const totalProducts = products.length;
    const lowStockItems = products.filter(p => p.stock <= p.min_stock).length;

    // Top selling products
    const productSales = {};
    sales.forEach(sale => {
      sale.sale_items?.forEach(item => {
        const productId = item.product_id;
        if (!productSales[productId]) {
          productSales[productId] = {
            product: item.products,
            quantity: 0,
            revenue: 0
          };
        }
        productSales[productId].quantity += item.quantity;
        productSales[productId].revenue += parseFloat(item.total_price || 0);
      });
    });
    const topProducts = Object.values(productSales)
      .sort((a, b) => b.quantity - a.quantity)
      .slice(0, 5);

    // Category statistics
    const categoryStats = {};
    products.forEach(product => {
      if (!categoryStats[product.category]) {
        categoryStats[product.category] = {
          name: product.category,
          products: 0,
          value: 0,
          sales: 0
        };
      }
      categoryStats[product.category].products += 1;
      categoryStats[product.category].value += parseFloat(product.price || 0) * (product.stock || 0);
    });

    // Add sales to categories
    sales.forEach(sale => {
      sale.sale_items?.forEach(item => {
        const category = item.products?.category;
        if (category && categoryStats[category]) {
          categoryStats[category].sales += item.quantity;
        }
      });
    });
    const categoryData = Object.values(categoryStats);

    // Daily sales
    const dailyStats = {};
    sales.forEach(sale => {
      const date = new Date(sale.created_at).toISOString().split('T')[0];
      if (!dailyStats[date]) {
        dailyStats[date] = {
          date,
          sales: 0,
          revenue: 0,
          orders: 0
        };
      }
      dailyStats[date].sales += 1;
      dailyStats[date].revenue += parseFloat(sale.total_amount || 0);
      dailyStats[date].orders += sale.sale_items?.length || 0;
    });
    const dailySales = Object.values(dailyStats).sort((a, b) => new Date(a.date) - new Date(b.date));

    // Monthly trends (last 12 months)
    const monthlyStats = {};
    const last12Months = [];
    for (let i = 11; i >= 0; i--) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      const monthKey = date.toISOString().slice(0, 7); // YYYY-MM
      monthlyStats[monthKey] = {
        month: date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
        sales: 0,
        revenue: 0
      };
      last12Months.push(monthKey);
    }
    sales.forEach(sale => {
      const monthKey = sale.created_at.slice(0, 7);
      if (monthlyStats[monthKey]) {
        monthlyStats[monthKey].sales += 1;
        monthlyStats[monthKey].revenue += parseFloat(sale.total_amount || 0);
      }
    });
    const monthlyTrends = last12Months.map(key => monthlyStats[key]);

    return {
      totalSales,
      totalRevenue,
      totalProducts,
      lowStockItems,
      topProducts,
      recentSales: sales.slice(0, 10),
      categoryData,
      dailySales,
      monthlyTrends
    };
  };

  // Stat card component
  const StatCard = ({ title, value, icon: Icon, trend, trendValue, color = 'blue' }) => {
    const colorClasses = {
      blue: 'from-blue-600 to-blue-700',
      green: 'from-green-600 to-green-700',
      purple: 'from-purple-600 to-purple-700',
      orange: 'from-orange-600 to-orange-700',
      red: 'from-red-600 to-red-700'
    };
    return (
      <div className={`bg-gradient-to-r ${colorClasses[color]} rounded-xl p-6 text-white shadow-lg`}>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-white/80 text-sm font-medium">{title}</p>
            <p className="text-3xl font-bold mt-1">{value}</p>
            {trend && (
              <div className="flex items-center mt-2">
                {trend === 'up'
                  ? <ArrowUp className="h-4 w-4 text-green-300 mr-1" />
                  : <ArrowDown className="h-4 w-4 text-red-300 mr-1" />
                }
                <span className="text-white/80 text-sm">{trendValue}</span>
              </div>
            )}
          </div>
          <Icon className="h-12 w-12 text-white/60" />
        </div>
      </div>
    );
  };

  // Colors for charts
  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4'];

  // Loading spinner
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Main dashboard
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Analytics Dashboard</h1>
          <p className="text-gray-400 mt-1">Prakash Electronics - Performance Overview</p>
        </div>
        <div className="flex items-center gap-4">
          <select
            value={dateRange}
            onChange={e => setDateRange(e.target.value)}
            className="bg-gray-800 text-white border border-gray-700 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="7days">Last 7 Days</option>
            <option value="30days">Last 30 Days</option>
            <option value="90days">Last 90 Days</option>
            <option value="1year">Last Year</option>
          </select>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2">
            <Download className="h-4 w-4" />
            Export
          </button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Sales"
          value={analytics.totalSales.toLocaleString()}
          icon={ShoppingCart}
          trend="up"
          trendValue="+12% from last period"
          color="blue"
        />
        <StatCard
          title="Total Revenue"
          value={`₹${analytics.totalRevenue.toLocaleString()}`}
          icon={DollarSign}
          trend="up"
          trendValue="+8% from last period"
          color="green"
        />
        <StatCard
          title="Total Products"
          value={analytics.totalProducts.toLocaleString()}
          icon={Package}
          color="purple"
        />
        <StatCard
          title="Low Stock Alert"
          value={analytics.lowStockItems.toLocaleString()}
          icon={AlertTriangle}
          trend={analytics.lowStockItems > 0 ? "down" : "up"}
          trendValue={analytics.lowStockItems > 0 ? "Needs attention" : "All good"}
          color={analytics.lowStockItems > 0 ? "red" : "green"}
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sales Trend Chart */}
        <div className="bg-gray-800 rounded-xl p-6 shadow-lg">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-white">Sales Trend</h3>
            <BarChart3 className="h-5 w-5 text-gray-400" />
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={analytics.dailySales}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis
                dataKey="date"
                stroke="#9CA3AF"
                tick={{ fill: '#9CA3AF' }}
                tickFormatter={value =>
                  new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
                }
              />
              <YAxis stroke="#9CA3AF" tick={{ fill: '#9CA3AF' }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1F2937',
                  border: '1px solid #374151',
                  borderRadius: '8px',
                  color: '#fff'
                }}
              />
              <Line
                type="monotone"
                dataKey="revenue"
                stroke="#3B82F6"
                strokeWidth={2}
                dot={{ fill: '#3B82F6', strokeWidth: 2, r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Category Distribution */}
        <div className="bg-gray-800 rounded-xl p-6 shadow-lg">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-white">Category Distribution</h3>
            <Package className="h-5 w-5 text-gray-400" />
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={analytics.categoryData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="products"
              >
                {analytics.categoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1F2937',
                  border: '1px solid #374151',
                  borderRadius: '8px',
                  color: '#fff'
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Monthly Revenue Trend */}
      <div className="bg-gray-800 rounded-xl p-6 shadow-lg">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-white">Monthly Revenue Trend</h3>
          <TrendingUp className="h-5 w-5 text-gray-400" />
        </div>
        <ResponsiveContainer width="100%" height={400}>
          <AreaChart data={analytics.monthlyTrends}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis
              dataKey="month"
              stroke="#9CA3AF"
              tick={{ fill: '#9CA3AF' }}
            />
            <YAxis stroke="#9CA3AF" tick={{ fill: '#9CA3AF' }} />
            <Tooltip
              contentStyle={{
                backgroundColor: '#1F2937',
                border: '1px solid #374151',
                borderRadius: '8px',
                color: '#fff'
              }}
            />
            <Area
              type="monotone"
              dataKey="revenue"
              stroke="#10B981"
              fill="#10B981"
              fillOpacity={0.3}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Tables Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Selling Products */}
        <div className="bg-gray-800 rounded-xl p-6 shadow-lg">
          <h3 className="text-xl font-semibold text-white mb-6">Top Selling Products</h3>
          <div className="space-y-4">
            {analytics.topProducts.map((item, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-gray-700 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">
                    {index + 1}
                  </div>
                  <div>
                    <p className="font-medium text-white">{item.product?.name || 'Unknown Product'}</p>
                    <p className="text-sm text-gray-400">SKU: {item.product?.sku}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-white">{item.quantity} sold</p>
                  <p className="text-sm text-green-400">₹{item.revenue.toFixed(2)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        {/* Recent Sales */}
        <div className="bg-gray-800 rounded-xl p-6 shadow-lg">
          <h3 className="text-xl font-semibold text-white mb-6">Recent Sales</h3>
          <div className="space-y-4">
            {analytics.recentSales.map((sale) => (
              <div key={sale.id} className="flex items-center justify-between p-4 bg-gray-700 rounded-lg">
                <div>
                  <p className="font-medium text-white">Sale #{sale.sale_number}</p>
                  <p className="text-sm text-gray-400">
                    {new Date(sale.created_at).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                  {sale.customer_name && (
                    <p className="text-sm text-gray-400">Customer: {sale.customer_name}</p>
                  )}
                </div>
                <div className="text-right">
                  <p className="font-semibold text-white">₹{parseFloat(sale.total_amount).toFixed(2)}</p>
                  <p className="text-sm text-gray-400">{sale.payment_method}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Category Performance Table */}
      <div className="bg-gray-800 rounded-xl p-6 shadow-lg">
        <h3 className="text-xl font-semibold text-white mb-6">Category Performance</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-700">
                <th className="text-left py-3 px-4 font-medium text-gray-300">Category</th>
                <th className="text-left py-3 px-4 font-medium text-gray-300">Products</th>
                <th className="text-left py-3 px-4 font-medium text-gray-300">Inventory Value</th>
                <th className="text-left py-3 px-4 font-medium text-gray-300">Units Sold</th>
                <th className="text-left py-3 px-4 font-medium text-gray-300">Performance</th>
              </tr>
            </thead>
            <tbody>
              {analytics.categoryData.map((category, index) => (
                <tr key={index} className="border-b border-gray-700 hover:bg-gray-700">
                  <td className="py-4 px-4 text-white font-medium">{category.name}</td>
                  <td className="py-4 px-4 text-gray-300">{category.products}</td>
                  <td className="py-4 px-4 text-gray-300">₹{category.value.toFixed(2)}</td>
                  <td className="py-4 px-4 text-gray-300">{category.sales}</td>
                  <td className="py-4 px-4">
                    <div className="flex items-center">
                      {category.sales > 10 ? (
                        <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                      ) : category.sales > 5 ? (
                        <Clock className="h-5 w-5 text-yellow-500 mr-2" />
                      ) : (
                        <XCircle className="h-5 w-5 text-red-500 mr-2" />
                      )}
                      <span className={`text-sm ${
                        category.sales > 10 ? 'text-green-400' :
                        category.sales > 5 ? 'text-yellow-400' : 'text-red-400'
                      }`}>
                        {category.sales > 10 ? 'Excellent' :
                         category.sales > 5 ? 'Good' : 'Needs Attention'}
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
