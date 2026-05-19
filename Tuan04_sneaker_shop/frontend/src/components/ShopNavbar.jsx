import { useState } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { LogoutOutlined, MenuOutlined, CloseOutlined, UserOutlined, ShopOutlined } from '@ant-design/icons';
import { getUserDisplayName, getUserRole } from '../utils/shop';

function ShopNavbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const user = (() => {
    try {
      const storedUser = localStorage.getItem('user');
      return storedUser ? JSON.parse(storedUser) : null;
    } catch {
      return null;
    }
  })();

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setMobileMenuOpen(false);
    navigate('/login');
  };

  const navLinks = [
    { label: 'Home', to: '/home' },
    { label: 'Products', to: '/products' },
    { label: 'Categories', to: '/categories' },
    { label: 'Profile', to: '/profile' },
  ];

  const authRoute = location.pathname === '/login' || location.pathname === '/register';
  const displayName = getUserDisplayName(user);
  const role = getUserRole(user);
  const avatarLetter = displayName.charAt(0).toUpperCase();

  return (
    <header className="sticky top-0 z-50 border-b border-white/60 bg-white/85 backdrop-blur-xl">
      <div className="content-shell">
        <div className="flex min-h-20 items-center justify-between gap-4 py-3">
          <NavLink to="/home" className="flex min-w-0 items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-950 text-white shadow-lg shadow-slate-950/20">
              <ShopOutlined className="text-lg" />
            </div>
            <div className="min-w-0">
              <p className="truncate text-xl font-bold tracking-tight text-slate-950">SneakerHub</p>
              <p className="truncate text-xs font-semibold uppercase tracking-[0.28em] text-orange-600">
                Premium Sneaker Shop
              </p>
            </div>
          </NavLink>

          <nav className="hidden items-center gap-2 lg:flex">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  `rounded-full px-4 py-2 text-sm font-bold transition ${
                    isActive
                      ? 'bg-orange-50 text-orange-600'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-950'
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>

          <div className="hidden items-center gap-3 lg:flex">
            {user ? (
              <>
                <NavLink
                  to="/profile"
                  className="flex max-w-[280px] items-center gap-3 rounded-full border border-slate-200 bg-white px-3 py-2 shadow-sm transition hover:border-orange-200 hover:shadow-md"
                >
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-slate-950 text-sm font-bold text-white">
                    {avatarLetter || <UserOutlined />}
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-bold text-slate-900">{displayName}</p>
                    <p className="truncate text-xs font-semibold uppercase tracking-[0.24em] text-orange-600">
                      {role}
                    </p>
                  </div>
                </NavLink>
                <button type="button" onClick={handleLogout} className="btn-secondary px-4 py-2.5">
                  <LogoutOutlined />
                  Logout
                </button>
              </>
            ) : (
              <div className="flex items-center gap-3">
                {!authRoute && (
                  <NavLink to="/register" className="btn-secondary px-5 py-2.5">
                    Register
                  </NavLink>
                )}
                <NavLink to="/login" className="btn-primary px-5 py-2.5">
                  Login
                </NavLink>
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={() => setMobileMenuOpen((current) => !current)}
            className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:border-orange-300 hover:text-orange-600 lg:hidden"
          >
            {mobileMenuOpen ? <CloseOutlined className="text-lg" /> : <MenuOutlined className="text-lg" />}
          </button>
        </div>

        <div
          className={`overflow-hidden transition-all duration-300 lg:hidden ${
            mobileMenuOpen ? 'max-h-[420px] pb-4' : 'max-h-0'
          }`}
        >
          <div className="glass-panel space-y-3 p-4">
            <div className="grid gap-2">
              {navLinks.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  onClick={() => setMobileMenuOpen(false)}
                  className={({ isActive }) =>
                    `rounded-2xl px-4 py-3 text-sm font-bold transition ${
                      isActive
                        ? 'bg-slate-950 text-white'
                        : 'bg-slate-50 text-slate-700 hover:bg-orange-50 hover:text-orange-600'
                    }`
                  }
                >
                  {link.label}
                </NavLink>
              ))}
            </div>

            {user ? (
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-950 text-base font-bold text-white">
                    {avatarLetter || <UserOutlined />}
                  </div>
                  <div className="min-w-0">
                    <p className="truncate font-bold text-slate-950">{displayName}</p>
                    <p className="truncate text-xs font-semibold uppercase tracking-[0.24em] text-orange-600">
                      {role}
                    </p>
                  </div>
                </div>
                <button type="button" onClick={handleLogout} className="btn-secondary mt-4 w-full justify-center">
                  <LogoutOutlined />
                  Logout
                </button>
              </div>
            ) : (
              <div className="grid gap-3">
                {!authRoute && (
                  <NavLink to="/register" onClick={() => setMobileMenuOpen(false)} className="btn-secondary justify-center">
                    Register
                  </NavLink>
                )}
                <NavLink to="/login" onClick={() => setMobileMenuOpen(false)} className="btn-primary justify-center">
                  Login
                </NavLink>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

export default ShopNavbar;
