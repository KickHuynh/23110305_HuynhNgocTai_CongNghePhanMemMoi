import { useEffect, useState } from 'react';
import { IdcardOutlined, LockOutlined, MailOutlined, RightOutlined, UserOutlined } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import authApi, {
  getProfileRouteByRole,
  getStoredToken,
  getStoredUser,
  setPendingVerificationEmail,
} from '../api/authApi';

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function RegisterPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    studentId: '',
    password: '',
  });
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);

  // Chuyển người dùng đã đăng nhập sang đúng trang hồ sơ thay vì cho đăng ký lại.
  useEffect(() => {
    const token = getStoredToken();
    if (token) {
      navigate(getProfileRouteByRole(getStoredUser()?.role), { replace: true });
    }
  }, [navigate]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
  };

  // Gửi thông tin đăng ký và chuyển sang màn hình nhập OTP xác thực email.
  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!formData.fullName.trim()) {
      setErrorMessage('Vui lòng nhập họ và tên.');
      return;
    }

    if (!emailRegex.test(formData.email.trim().toLowerCase())) {
      setErrorMessage('Vui lòng nhập email hợp lệ.');
      return;
    }

    if (!formData.studentId.trim()) {
      setErrorMessage('Vui lòng nhập mã sinh viên.');
      return;
    }

    if (formData.password.length < 6) {
      setErrorMessage('Mật khẩu phải có ít nhất 6 ký tự.');
      return;
    }

    try {
      setLoading(true);
      setErrorMessage('');

      const response = await authApi.register(formData);
      const email =
        response?.data?.verification?.email ||
        response?.data?.data?.user?.email ||
        formData.email.trim().toLowerCase();

      setPendingVerificationEmail(email);
      navigate('/verify-otp', {
        replace: true,
        state: {
          email,
          from: 'register',
          message: response?.data?.message || 'Mã OTP xác thực đã được gửi đến email của bạn.',
        },
      });
    } catch (error) {
      setErrorMessage(error.response?.data?.message || 'Đăng ký thất bại. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-shell">
      <div className="content-shell py-12 sm:py-16">
        <div className="mx-auto grid max-w-6xl gap-8 overflow-hidden rounded-[36px] border border-white/70 bg-white shadow-2xl shadow-slate-900/10 lg:grid-cols-[440px_1fr]">
          <div className="p-6 sm:p-8 lg:p-10">
            <p className="text-sm font-bold uppercase tracking-[0.28em] text-orange-600">Tạo tài khoản</p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-950">Đăng ký SneakerHub</h2>
            <p className="mt-3 text-sm leading-7 text-slate-500">
              Đăng ký bằng luồng xác thực backend hiện tại và bắt đầu trải nghiệm storefront mới.
            </p>

            <form onSubmit={handleSubmit} className="mt-8 space-y-5">
              <div>
                <label htmlFor="fullName" className="mb-2 block text-sm font-bold text-slate-900">
                  Họ và tên
                </label>
                <div className="relative">
                  <UserOutlined className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    id="fullName"
                    name="fullName"
                    type="text"
                    required
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder="Huynh Ngoc Tai"
                    className="field-input pl-11"
                  />
                </div>
              </div>

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
                <label htmlFor="studentId" className="mb-2 block text-sm font-bold text-slate-900">
                  Mã sinh viên
                </label>
                <div className="relative">
                  <IdcardOutlined className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    id="studentId"
                    name="studentId"
                    type="text"
                    required
                    value={formData.studentId}
                    onChange={handleChange}
                    placeholder="23110305"
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
                    minLength={6}
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Ít nhất 6 ký tự"
                    className="field-input pl-11"
                  />
                </div>
              </div>

              {errorMessage && (
                <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-600">
                  {errorMessage}
                </div>
              )}

              <button type="submit" disabled={loading} className="btn-primary flex w-full justify-center rounded-2xl px-5 py-4 disabled:cursor-not-allowed disabled:opacity-70">
                {loading ? 'Đang tạo tài khoản...' : 'Đăng ký'}
                {!loading && <RightOutlined />}
              </button>
            </form>

            <p className="mt-6 text-sm text-slate-500">
              Đã có tài khoản?{' '}
              <Link to="/login" className="font-bold text-orange-600 transition hover:text-orange-700">
                Đăng nhập tại đây
              </Link>
            </p>
          </div>

          <div className="relative overflow-hidden bg-[radial-gradient(circle_at_top_right,_rgba(255,69,0,0.25),_transparent_26%),linear-gradient(135deg,_#020617_0%,_#111827_58%,_#1f2937_100%)] px-6 py-10 text-white sm:px-10 lg:px-12 lg:py-14">
            <div className="relative z-10 max-w-xl">
              <p className="text-sm font-bold uppercase tracking-[0.34em] text-orange-300">Nâng cấp tuần 4</p>
              <h1 className="mt-4 text-4xl font-bold tracking-tight sm:text-5xl">Tạo tài khoản và khám phá demo sneaker cao cấp.</h1>
              <p className="mt-5 text-base leading-8 text-slate-300">
                API đăng nhập, hồ sơ và sản phẩm vẫn giữ nguyên cấu trúc backend trong khi giao diện storefront được làm mới rõ nét hơn.
              </p>

              <div className="mt-10 space-y-4">
                <div className="rounded-3xl border border-white/10 bg-white/10 p-5 backdrop-blur">
                  <p className="text-xl font-bold">Responsive mặc định</p>
                  <p className="mt-2 text-sm text-slate-300">Bố cục desktop, tablet và mobile đều đã được tinh chỉnh để sẵn sàng trình bày.</p>
                </div>
                <div className="rounded-3xl border border-white/10 bg-white/10 p-5 backdrop-blur">
                  <p className="text-xl font-bold">An toàn cho backend</p>
                  <p className="mt-2 text-sm text-slate-300">Không tạo project mới, không bỏ auth và dữ liệu sản phẩm vẫn lấy từ backend API hiện tại.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;
