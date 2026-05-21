import { Navigate, Route, Routes } from 'react-router-dom';
import MainLayout from '../components/layout/MainLayout';
import CategoryProductsPage from '../pages/CategoryProductsPage';
import HomePage from '../pages/HomePage';
import LoginPage from '../pages/LoginPage';
import ProductDetailPage from '../pages/ProductDetailPage';
import ProductSearchPage from '../pages/ProductSearchPage';
import ProfilePage from '../pages/ProfilePage';
import RegisterPage from '../pages/RegisterPage';

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
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}

export default AppRoutes;
