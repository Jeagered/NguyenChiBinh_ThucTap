import { BrowserRouter as Router, Routes, Route, Navigate, Outlet, Link } from 'react-router-dom';

import Home from './pages/Home';
import Login from './pages/auth/Login';
import Products from './pages/product/Products';
import ProductDetail from './pages/product/ProductDetail';
import Signup from './pages/auth/Signup';
import UserProfile from './pages/user/UserProfile';
import Cart from './pages/order/Cart';
import Checkout from './pages/order/Checkout';
import MyOrders from './pages/order/MyOrders';
import OrderDetails from './pages/order/OrderDetails';
import About from './pages/About';
import ServicesPage from './pages/Services';
import ServiceDetail from './pages/ServiceDetail';
import NewsPage from './pages/News';
import NewsDetail from './pages/NewsDetail';
import Contact from './pages/Contact';

import AdminLayout from './pages/admin/AdminLayout';
import Dashboard from './pages/admin/Dashboard';
import Users from './pages/admin/Users';
import AdminProducts from './pages/admin/Products';
import Categories from './pages/admin/Categories';
import Orders from './pages/admin/Orders';
import Services from './pages/admin/Services';
import News from './pages/admin/News';
import Settings from './pages/admin/Settings';
import Chats from './pages/admin/Chats';
import ChatDetail from './pages/admin/ChatDetail';

const PlaceholderPage = ({ title }) => (
  <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50">
    <h1 className="text-3xl font-black text-slate-800 uppercase tracking-wide">{title}</h1>
    <p className="mt-4 text-slate-500 font-medium">Trang này đang trong quá trình phát triển và hoàn thiện.</p>
    <Link to="/" className="mt-6 text-orange-600 font-bold hover:text-orange-700 transition">&larr; Quay lại trang chủ</Link>
  </div>
);

const ProtectedAdminRoute = () => {
  const userStr = localStorage.getItem('user');
  if (!userStr) {
    return <Navigate to="/login" replace />;
  }
  try {
    const user = JSON.parse(userStr);
    if (user.role !== 'admin') {
      return <Navigate to="/" replace />;
    }
    return <Outlet />; 
  } catch (e) {
    return <Navigate to="/login" replace />;
  }
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/profile" element={<UserProfile />} />
        <Route path="/products" element={<Products />} />
        <Route path="/products/:idOrSlug" element={<ProductDetail />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/my-orders" element={<MyOrders />} />
        <Route path="/orders/:id" element={<OrderDetails />} />

        {/* Các Route của thanh Menu Header & Trang chủ */}
        <Route path="/about" element={<About />} />
        <Route path="/services" element={<ServicesPage />} />
        <Route path="/services/:id" element={<ServiceDetail />} />
        <Route path="/news" element={<NewsPage />} />
        <Route path="/news/:id" element={<NewsDetail />} />
        <Route path="/contact" element={<Contact />} />

        {/* Admin Routes */}
        <Route element={<ProtectedAdminRoute />}>
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="users" element={<Users />} />
            <Route path="products" element={<AdminProducts />} />
            <Route path="categories" element={<Categories />} />
            <Route path="orders" element={<Orders />} />
            <Route path="services" element={<Services />} />
            <Route path="news" element={<News />} />
            <Route path="chats" element={<Chats />} />
            <Route path="chats/:userId" element={<ChatDetail />} />
            <Route path="settings" element={<Settings />} />
          </Route>
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
