import { Navigate, Route, Routes } from 'react-router-dom';
import MainLayout from '../components/layout/MainLayout';
import {
  getProfileRouteByRole,
  getStoredToken,
  getStoredUser,
} from '../api/authApi';
import AdminProfilePage from '../pages/AdminProfilePage';
import CartPage from '../pages/CartPage';
import CategoryProductsPage from '../pages/CategoryProductsPage';
import CheckoutPage from '../pages/CheckoutPage';
import ForgotPasswordPage from '../pages/ForgotPasswordPage';
import HomePage from '../pages/HomePage';
import LoginPage from '../pages/LoginPage';
import OrderDetailPage from '../pages/OrderDetailPage';
import OrderHistoryPage from '../pages/OrderHistoryPage';
import ProductDetailPage from '../pages/ProductDetailPage';
import ProductSearchPage from '../pages/ProductSearchPage';
import ProfilePage from '../pages/ProfilePage';
import RegisterPage from '../pages/RegisterPage';
import ResetPasswordPage from '../pages/ResetPasswordPage';
import VerifyOtpPage from '../pages/VerifyOtpPage';
import ProtectedRoute from './ProtectedRoute';

// Điều hướng người dùng đã đăng nhập đến đúng trang hồ sơ theo role.
function ProfileRouteRedirect() {
  const token = getStoredToken();

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return <Navigate to={getProfileRouteByRole(getStoredUser()?.role)} replace />;
}

function AppRoutes() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route index element={<HomePage />} />
        <Route path="/home" element={<Navigate to="/" replace />} />
        <Route path="/products" element={<ProductSearchPage />} />
        <Route path="/products/:productId" element={<ProductDetailPage />} />
        <Route path="/categories" element={<CategoryProductsPage />} />
        <Route path="/products/categories" element={<CategoryProductsPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/verify-otp" element={<VerifyOtpPage />} />
        <Route path="/verify-email" element={<Navigate to="/verify-otp" replace />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route path="/profile" element={<ProfileRouteRedirect />} />
        {/* Bảo vệ các trang mua hàng và hồ sơ sinh viên bằng JWT. */}
        <Route element={<ProtectedRoute allowedRoles={['student', 'user']} />}>
          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/orders" element={<OrderHistoryPage />} />
          <Route path="/orders/:orderId" element={<OrderDetailPage />} />
          <Route path="/user/profile" element={<ProfilePage />} />
        </Route>
        {/* Chỉ cho phép tài khoản admin truy cập khu vực hồ sơ quản trị. */}
        <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
          <Route path="/admin/profile" element={<AdminProfilePage />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}

export default AppRoutes;
