import { useEffect, useState } from 'react';
import { LockOutlined, MailOutlined, RightOutlined } from '@ant-design/icons';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import authApi, {
  extractAuthSession,
  getProfileRouteByRole,
  getStoredToken,
  getStoredUser,
  resolveAuthRedirect,
  setAuthSession,
  setPendingVerificationEmail,
} from '../api/authApi';

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errorMessage, setErrorMessage] = useState('');
  const [infoMessage, setInfoMessage] = useState(location.state?.message || '');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const token = getStoredToken();
    if (token) {
      navigate(location.state?.from || getProfileRouteByRole(getStoredUser()?.role), {
        replace: true,
      });
    }
  }, [location.state?.from, navigate]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!emailRegex.test(formData.email.trim().toLowerCase())) {
      setErrorMessage('Vui lòng nhập email hợp lệ.');
      return;
    }

    if (!formData.password) {
      setErrorMessage('Vui lòng nhập mật khẩu.');
      return;
    }

    try {
      setLoading(true);
      setErrorMessage('');
      setInfoMessage('');

      const response = await authApi.login(formData);
      const session = extractAuthSession(response);
      const fallbackRedirectPath =
        typeof location.state?.from === 'string' && location.state.from.startsWith('/')
          ? location.state.from
          : getProfileRouteByRole(session.user?.role);

      setAuthSession(session);
      navigate(resolveAuthRedirect(session.redirectUrl, fallbackRedirectPath), { replace: true });
    } catch (error) {
      const errorCode = error.response?.data?.code;
      const shouldVerifyEmail =
        errorCode === 'EMAIL_NOT_VERIFIED' ||
        error.response?.data?.data?.requiresEmailVerification === true;

      if (shouldVerifyEmail) {
        const email = error.response?.data?.data?.email || formData.email.trim().toLowerCase();

        setPendingVerificationEmail(email);
        navigate('/verify-otp', {
          state: {
            email,
            from: 'login',
            message: error.response?.data?.message || 'Vui lòng xác thực email trước khi đăng nhập.',
          },
        });
        return;
      }

      setErrorMessage(error.response?.data?.message || 'Đăng nhập thất bại. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-shell">
      <div className="content-shell py-12 sm:py-16">
        <div className="mx-auto grid max-w-6xl gap-8 overflow-hidden rounded-[36px] border border-white/70 bg-white shadow-2xl shadow-slate-900/10 lg:grid-cols-[1fr_440px]">
          <div className="relative overflow-hidden bg-[radial-gradient(circle_at_top_left,_rgba(255,69,0,0.25),_transparent_25%),linear-gradient(135deg,_#020617_0%,_#111827_60%,_#1f2937_100%)] px-6 py-10 text-white sm:px-10 lg:px-12 lg:py-14">
            <div className="relative z-10 max-w-xl">
              <p className="text-sm font-bold uppercase tracking-[0.34em] text-orange-300">Truy cập SneakerHub</p>
              <h1 className="mt-4 text-4xl font-bold tracking-tight sm:text-5xl">Chào mừng bạn quay lại với không gian sneaker cao cấp.</h1>
              <p className="mt-5 text-base leading-8 text-slate-300">
                Đăng nhập để tiếp tục khám phá sản phẩm mới, theo dõi hồ sơ cá nhân và trải nghiệm Sneaker Shop đã được nâng cấp.
              </p>

              <div className="mt-10 grid gap-4 sm:grid-cols-2">
                <div className="rounded-3xl border border-white/10 bg-white/10 p-5 backdrop-blur">
                  <p className="text-2xl font-bold">Giao diện mới</p>
                  <p className="mt-2 text-sm text-slate-300">Phong cách storefront hiện đại mà không thay đổi backend route hiện có.</p>
                </div>
                <div className="rounded-3xl border border-white/10 bg-white/10 p-5 backdrop-blur">
                  <p className="text-2xl font-bold">Sẵn sàng JWT</p>
                  <p className="mt-2 text-sm text-slate-300">Luồng xác thực hiện tại vẫn được giữ nguyên và điều hướng đúng sau khi đăng nhập.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="p-6 sm:p-8 lg:p-10">
            <p className="text-sm font-bold uppercase tracking-[0.28em] text-orange-600">Đăng nhập</p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-950">Đăng nhập vào SneakerHub</h2>
            <p className="mt-3 text-sm leading-7 text-slate-500">
              Sử dụng tài khoản hiện tại để trải nghiệm Sneaker Shop đã được nâng cấp.
            </p>

            <form onSubmit={handleSubmit} className="mt-8 space-y-5">
              <div>
                <label htmlFor="email" className="mb-2 block text-sm font-bold text-slate-900">
                  Email
                </label>
                <div className="relative">
                  <MailOutlined className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="tai.week03@gmail.com"
                    className="field-input pl-11"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="mb-2 block text-sm font-bold text-slate-900">
                  Mật khẩu
                </label>
                <div className="relative">
                  <LockOutlined className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    id="password"
                    name="password"
                    type="password"
                    required
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Nhập mật khẩu của bạn"
                    className="field-input pl-11"
                  />
                </div>
              </div>

              {errorMessage && (
                <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-600">
                  {errorMessage}
                </div>
              )}

              {infoMessage && (
                <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700">
                  {infoMessage}
                </div>
              )}

              <button type="submit" disabled={loading} className="btn-primary flex w-full justify-center rounded-2xl px-5 py-4 disabled:cursor-not-allowed disabled:opacity-70">
                {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
                {!loading && <RightOutlined />}
              </button>
            </form>

            <p className="mt-4 text-sm text-slate-500">
              Quên mật khẩu?{' '}
              <Link to="/forgot-password" className="font-bold text-orange-600 transition hover:text-orange-700">
                Đặt lại tại đây
              </Link>
            </p>

            <p className="mt-2 text-sm text-slate-500">
              Chưa có tài khoản?{' '}
              <Link to="/register" className="font-bold text-orange-600 transition hover:text-orange-700">
                Đăng ký tại đây
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
