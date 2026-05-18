import { Navigate, Route, Routes } from 'react-router-dom';

import ShopNavbar from './components/ShopNavbar';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import ProfilePage from './pages/ProfilePage';
import HomePage from './pages/HomePage';
import ProductSearchPage from './pages/ProductSearchPage';
import ProductDetailPage from './pages/ProductDetailPage';

function App() {
  return (
    <div className="flex min-h-screen flex-col text-slate-900">
      <ShopNavbar />

      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Navigate to="/home" replace />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/products" element={<ProductSearchPage />} />
          <Route path="/products/:id" element={<ProductDetailPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="*" element={<Navigate to="/home" replace />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
