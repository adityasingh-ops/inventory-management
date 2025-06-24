import React, { useState } from 'react';
import {
  Zap,
  Home,
  Package,
  ShoppingCart,
  BarChart3,
  Bell,
  User,
  Settings,
  LogOut,
  MapPin,
  Wifi,
  WifiOff,
  Menu,
  X,
} from 'lucide-react';

// Navigation items configuration
const NAV_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: Home },
  { id: 'products', label: 'Products', icon: Package },
  { id: 'pos', label: 'POS', icon: ShoppingCart },
  { id: 'analytics', label: 'Analytics', icon: BarChart3 },
];

const Header = ({
  activeTab,
  setActiveTab,
  cart,
  isOnline,
  user,
  onLogout,
}) => {
  const [showProfile, setShowProfile] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  // Calculate total cart items
  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  // Render navigation buttons
  const renderNavButtons = (onClickExtra = () => {}) =>
    NAV_ITEMS.map(({ id, label, icon: Icon }) => (
      <button
        key={id}
        onClick={() => {
          setActiveTab(id);
          onClickExtra();
        }}
        className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-200 ${
          activeTab === id
            ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
            : 'text-gray-300 hover:text-white hover:bg-gray-800'
        }`}
      >
        <Icon className="h-4 w-4" />
        {label}
      </button>
    ));

  // Render profile dropdown
  const renderProfileDropdown = () =>
    showProfile && (
      <div className="absolute right-0 top-full mt-2 w-48 bg-gray-800 rounded-xl shadow-xl border border-gray-700 py-2 z-50">
        <div className="px-4 py-3 border-b border-gray-700">
          <p className="text-sm font-medium text-white">Prakash</p>
          <p className="text-xs text-gray-400">{user?.email || 'Shop Owner'}</p>
        </div>
        <button className="w-full px-4 py-2 text-left text-sm text-gray-300 hover:bg-gray-700 flex items-center gap-2">
          <Settings className="h-4 w-4" />
          Settings
        </button>
        <button
          onClick={onLogout}
          className="w-full px-4 py-2 text-left text-sm text-red-400 hover:bg-gray-700 flex items-center gap-2"
        >
          <LogOut className="h-4 w-4" />
          Logout
        </button>
      </div>
    );

  // Render cart indicator if items exist
  const renderCartIndicator = () =>
    cartItemCount > 0 && (
      <div className="relative">
        <button
          onClick={() => setActiveTab('pos')}
          className="p-2 bg-gray-800 rounded-xl hover:bg-gray-700 transition-colors"
        >
          <ShoppingCart className="h-5 w-5 text-gray-300" />
        </button>
        <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center animate-pulse">
          {cartItemCount}
        </span>
      </div>
    );

  // Render mobile navigation
  const renderMobileNav = () =>
    showMobileMenu && (
      <div className="lg:hidden mt-4 pt-4 border-t border-gray-800">
        <nav className="flex flex-col gap-2">
          {renderNavButtons(() => setShowMobileMenu(false))}
        </nav>
      </div>
    );

  return (
    <header className="bg-gray-900 border-b border-gray-800 sticky top-0 z-40">
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo and Shop Info */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="relative">
                <Zap className="h-10 w-10 text-blue-400" />
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
              </div>
              <div>
                <span className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  Prakash Electronics
                </span>
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <MapPin className="h-3 w-3" />
                  <span>Rudrapur Deoria</span>
                  {isOnline ? (
                    <Wifi className="h-3 w-3 text-green-400" />
                  ) : (
                    <WifiOff className="h-3 w-3 text-red-400" />
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-2">
            {renderNavButtons()}
          </nav>

          {/* Right Side Actions */}
          <div className="flex items-center gap-4">
            {renderCartIndicator()}

            {/* Notifications */}
            <button className="p-2 bg-gray-800 rounded-xl hover:bg-gray-700 transition-colors relative">
              <Bell className="h-5 w-5 text-gray-300" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>

            {/* Profile Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowProfile((v) => !v)}
                className="flex items-center gap-2 p-2 bg-gray-800 rounded-xl hover:bg-gray-700 transition-colors"
              >
                <User className="h-5 w-5 text-gray-300" />
              </button>
              {renderProfileDropdown()}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setShowMobileMenu((v) => !v)}
              className="lg:hidden p-2 bg-gray-800 rounded-xl hover:bg-gray-700 transition-colors"
            >
              {showMobileMenu ? (
                <X className="h-5 w-5 text-gray-300" />
              ) : (
                <Menu className="h-5 w-5 text-gray-300" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {renderMobileNav()}
      </div>
    </header>
  );
};

export default Header;
