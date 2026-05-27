import { useEffect, useState } from 'react';
import {
  CheckCircleFilled,
  MailOutlined,
  ReloadOutlined,
  RightOutlined,
  SafetyCertificateOutlined,
} from '@ant-design/icons';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import authApi, {
  clearPendingVerificationEmail,
  extractAuthSession,
  getProfileRouteByRole,
  getPendingVerificationEmail,
  getStoredToken,
  getStoredUser,
  resolveAuthRedirect,
  setAuthSession,
  setPendingVerificationEmail,
} from '../api/authApi';

const normalizeEmail = (value) => value.trim().toLowerCase();
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const normalizeOtp = (value) => value.replace(/\D/g, '').slice(0, 6);

function VerifyEmailPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState(location.state?.email || getPendingVerificationEmail());
  const [otp, setOtp] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [infoMessage, setInfoMessage] = useState(
    location.state?.message || 'Vui lòng nhập mã OTP 6 số đã được gửi đến email để hoàn tất kích hoạt tài khoản.'
  );
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);

  useEffect(() => {
    const token = getStoredToken();

    if (token) {
      navigate(getProfileRouteByRole(getStoredUser()?.role), { replace: true });
    }
  }, [navigate]);

  useEffect(() => {
    if (email) {
      setPendingVerificationEmail(email);
    }
  }, [email]);

  const handleVerify = async (event) => {
    event.preventDefault();

    const normalizedEmail = normalizeEmail(email);

    if (!emailRegex.test(normalizedEmail)) {
      setErrorMessage('Vui lòng nhập email hợp lệ.');
      return;
    }

    if (otp.length !== 6) {
      setErrorMessage('Mã OTP phải gồm đúng 6 chữ số.');
      return;
    }

    try {
      setLoading(true);
      setErrorMessage('');
      setInfoMessage('');

      const response = await authApi.verifyRegisterOtp({
        email: normalizedEmail,
        otp,
      });
      const session = extractAuthSession(response);

      clearPendingVerificationEmail();
      setAuthSession(session);
      navigate(resolveAuthRedirect(session.redirectUrl, getProfileRouteByRole(session.user?.role)), {
        replace: true,
      });
    } catch (error) {
      setErrorMessage(error.response?.data?.message || 'Xác thực email thất bại. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    const normalizedEmail = normalizeEmail(email);

    if (!normalizedEmail) {
      setErrorMessage('Vui lòng nhập email để gửi lại OTP.');
      return;
    }

    try {
      setResendLoading(true);
      setErrorMessage('');

      const response = await authApi.resendRegisterOtp({
        email: normalizedEmail,
      });

      setPendingVerificationEmail(normalizedEmail);
      setOtp('');
      setInfoMessage(response?.data?.message || 'Mã OTP xác thực mới đã được gửi đến email của bạn.');
    } catch (error) {
      setErrorMessage(error.response?.data?.message || 'Hiện không thể gửi lại mã OTP xác thực.');
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <div className="page-shell">
      <div className="content-shell py-12 sm:py-16">
        <div className="mx-auto grid max-w-6xl gap-8 overflow-hidden rounded-[36px] border border-white/70 bg-white shadow-2xl shadow-slate-900/10 lg:grid-cols-[1fr_440px]">
          <div className="relative overflow-hidden bg-[radial-gradient(circle_at_top_left,_rgba(255,69,0,0.25),_transparent_24%),linear-gradient(135deg,_#020617_0%,_#111827_58%,_#1f2937_100%)] px-6 py-10 text-white sm:px-10 lg:px-12 lg:py-14">
            <div className="relative z-10 max-w-xl">
              <p className="text-sm font-bold uppercase tracking-[0.34em] text-orange-300">Xác thực OTP</p>
              <h1 className="mt-4 text-4xl font-bold tracking-tight sm:text-5xl">
                Kích hoạt tài khoản trước khi đăng nhập lần đầu.
              </h1>
              <p className="mt-5 text-base leading-8 text-slate-300">
                SneakerHub dùng xác thực email bằng OTP để chỉ những tài khoản đã xác nhận mới có thể nhận JWT session.
              </p>

              <div className="mt-10 space-y-4">
                <div className="rounded-3xl border border-white/10 bg-white/10 p-5 backdrop-blur">
                  <p className="text-xl font-bold">Bảo mật mặc định</p>
                  <p className="mt-2 text-sm text-slate-300">
                    Đăng ký sẽ không tạo phiên đăng nhập tạm trước khi xác nhận quyền sở hữu email.
                  </p>
                </div>
                <div className="rounded-3xl border border-white/10 bg-white/10 p-5 backdrop-blur">
                  <p className="text-xl font-bold">Hỗ trợ gửi lại</p>
                  <p className="mt-2 text-sm text-slate-300">
                    Nếu OTP hết hạn hoặc thất lạc, bạn có thể yêu cầu mã mới mà không cần tạo tài khoản khác.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="p-6 sm:p-8 lg:p-10">
            <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-50 text-2xl text-orange-600">
              <SafetyCertificateOutlined />
            </div>
            <h2 className="mt-5 text-3xl font-bold tracking-tight text-slate-950">Xác thực email</h2>
            <p className="mt-3 text-sm leading-7 text-slate-500">
              Sử dụng email đã đăng ký và nhập mã OTP 6 số. Mã có hiệu lực trong 10 phút.
            </p>

            <form onSubmit={handleVerify} className="mt-8 space-y-5">
              <div>
                <label htmlFor="verify-email" className="mb-2 block text-sm font-bold text-slate-900">
                  Email
                </label>
                <div className="relative">
                  <MailOutlined className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    id="verify-email"
                    name="email"
                    type="email"
                    required
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder="student@example.com"
                    className="field-input pl-11"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="otp" className="mb-2 block text-sm font-bold text-slate-900">
                  Mã OTP xác thực
                </label>
                <input
                  id="otp"
                  name="otp"
                  type="text"
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  required
                  maxLength={6}
                  value={otp}
                  onChange={(event) => setOtp(normalizeOtp(event.target.value))}
                  placeholder="123456"
                  className="field-input text-center text-lg tracking-[0.35em]"
                />
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
                {loading ? 'Đang xác thực...' : 'Xác nhận và tiếp tục'}
                {!loading && <RightOutlined />}
              </button>
            </form>

            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <button
                type="button"
                onClick={handleResendOtp}
                disabled={resendLoading}
                className="btn-secondary justify-center disabled:cursor-not-allowed disabled:opacity-70"
              >
                <ReloadOutlined />
                {resendLoading ? 'Đang gửi...' : 'Gửi lại OTP'}
              </button>
              <Link to="/login" className="btn-secondary justify-center">
                <CheckCircleFilled />
                Quay lại đăng nhập
              </Link>
            </div>

            <p className="mt-6 text-sm text-slate-500">
              Muốn tạo tài khoản mới?{' '}
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

export default VerifyEmailPage;
