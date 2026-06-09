import { useEffect, useState } from 'react';
import {
  LockOutlined,
  MailOutlined,
  RightOutlined,
  SafetyCertificateOutlined,
} from '@ant-design/icons';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import authApi, {
  clearPendingResetEmail,
  getPendingResetEmail,
  getProfileRouteByRole,
  getStoredToken,
  getStoredUser,
  setPendingResetEmail,
} from '../api/authApi';

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const otpRegex = /^\d{6}$/;

function ResetPasswordPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [formData, setFormData] = useState({
    email: location.state?.email || getPendingResetEmail(),
    otp: '',
    newPassword: '',
  });
  const [errorMessage, setErrorMessage] = useState('');
  const [infoMessage, setInfoMessage] = useState(location.state?.message || '');
  const [loading, setLoading] = useState(false);

  // Không cho người đã đăng nhập đi tiếp vào luồng đặt lại mật khẩu.
  useEffect(() => {
    const token = getStoredToken();

    if (token) {
      navigate(getProfileRouteByRole(getStoredUser()?.role), { replace: true });
    }
  }, [navigate]);

  // Ghi nhớ email reset để người dùng đổi trang vẫn không mất ngữ cảnh.
  useEffect(() => {
    if (formData.email) {
      setPendingResetEmail(formData.email);
    }
  }, [formData.email]);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((current) => ({
      ...current,
      [name]: name === 'otp' ? value.replace(/\D/g, '').slice(0, 6) : value,
    }));
  };

  // Gửi email, OTP và mật khẩu mới để hoàn tất đặt lại mật khẩu.
  const handleSubmit = async (event) => {
    event.preventDefault();

    const normalizedEmail = formData.email.trim().toLowerCase();

    if (!emailRegex.test(normalizedEmail)) {
      setErrorMessage('Vui lòng nhập email hợp lệ.');
      return;
    }

    if (!otpRegex.test(formData.otp.trim())) {
      setErrorMessage('Mã OTP phải gồm đúng 6 chữ số.');
      return;
    }

    if (formData.newPassword.length < 6) {
      setErrorMessage('Mật khẩu mới phải có ít nhất 6 ký tự.');
      return;
    }

    try {
      setLoading(true);
      setErrorMessage('');
      setInfoMessage('');

      const response = await authApi.resetPassword({
        email: normalizedEmail,
        otp: formData.otp.trim(),
        newPassword: formData.newPassword,
      });

      clearPendingResetEmail();
      navigate('/login', {
        replace: true,
        state: {
          message: response?.data?.message || 'Đặt lại mật khẩu thành công',
        },
      });
    } catch (error) {
      setErrorMessage(error.response?.data?.message || 'Hiện không thể đặt lại mật khẩu.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-shell">
      <div className="content-shell py-12 sm:py-16">
        <div className="mx-auto grid max-w-6xl gap-8 overflow-hidden rounded-[36px] border border-white/70 bg-white shadow-2xl shadow-slate-900/10 lg:grid-cols-[1fr_440px]">
          <div className="relative overflow-hidden bg-[radial-gradient(circle_at_top_left,_rgba(255,69,0,0.25),_transparent_24%),linear-gradient(135deg,_#020617_0%,_#111827_58%,_#1f2937_100%)] px-6 py-10 text-white sm:px-10 lg:px-12 lg:py-14">
            <div className="relative z-10 max-w-xl">
              <p className="text-sm font-bold uppercase tracking-[0.34em] text-orange-300">Đặt lại bảo mật</p>
              <h1 className="mt-4 text-4xl font-bold tracking-tight sm:text-5xl">
                Tạo mật khẩu mới bằng OTP từ email.
              </h1>
              <p className="mt-5 text-base leading-8 text-slate-300">
                Form này khớp với API reset password hiện có của backend và giữ nguyên phong cách giao diện SneakerHub.
              </p>
            </div>
          </div>

          <div className="p-6 sm:p-8 lg:p-10">
            <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-50 text-2xl text-orange-600">
              <SafetyCertificateOutlined />
            </div>
            <h2 className="mt-5 text-3xl font-bold tracking-tight text-slate-950">Đặt lại mật khẩu</h2>
            <p className="mt-3 text-sm leading-7 text-slate-500">
              Nhập email, mã OTP 6 số và mật khẩu mới có ít nhất 6 ký tự.
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
                    placeholder="student@example.com"
                    className="field-input pl-11"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="otp" className="mb-2 block text-sm font-bold text-slate-900">
                  OTP
                </label>
                <input
                  id="otp"
                  name="otp"
                  type="text"
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  required
                  maxLength={6}
                  value={formData.otp}
                  onChange={handleChange}
                  placeholder="123456"
                  className="field-input text-center text-lg tracking-[0.35em]"
                />
              </div>

              <div>
                <label htmlFor="newPassword" className="mb-2 block text-sm font-bold text-slate-900">
                  Mật khẩu mới
                </label>
                <div className="relative">
                  <LockOutlined className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    id="newPassword"
                    name="newPassword"
                    type="password"
                    required
                    minLength={6}
                    value={formData.newPassword}
                    onChange={handleChange}
                    placeholder="Ít nhất 6 ký tự"
                    className="field-input pl-11"
                  />
                </div>
              </div>

              {infoMessage && (
                <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700">
                  {infoMessage}
                </div>
              )}

              {errorMessage && (
                <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-600">
                  {errorMessage}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="btn-primary flex w-full justify-center rounded-2xl px-5 py-4 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {loading ? 'Đang đặt lại...' : 'Đặt lại mật khẩu'}
                {!loading && <RightOutlined />}
              </button>
            </form>

            <p className="mt-6 text-sm text-slate-500">
              Quay lại{' '}
              <Link to="/login" className="font-bold text-orange-600 transition hover:text-orange-700">
                Đăng nhập
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ResetPasswordPage;
