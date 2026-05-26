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
  const [email, setEmail] = useState(
    location.state?.email || getPendingVerificationEmail()
  );
  const [otp, setOtp] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [infoMessage, setInfoMessage] = useState(
    location.state?.message ||
      'Enter the 6-digit OTP sent to your email to finish account activation.'
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
      setErrorMessage('Please enter a valid email address.');
      return;
    }

    if (otp.length !== 6) {
      setErrorMessage('OTP must be exactly 6 digits.');
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
      navigate(
        resolveAuthRedirect(
          session.redirectUrl,
          getProfileRouteByRole(session.user?.role)
        ),
        { replace: true }
      );
    } catch (error) {
      setErrorMessage(
        error.response?.data?.message || 'Email verification failed. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    const normalizedEmail = normalizeEmail(email);

    if (!normalizedEmail) {
      setErrorMessage('Please enter your email to resend OTP.');
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
      setInfoMessage(
        response?.data?.message ||
          'A new verification OTP has been sent to your email.'
      );
    } catch (error) {
      setErrorMessage(
        error.response?.data?.message ||
          'Cannot resend verification OTP right now.'
      );
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
              <p className="text-sm font-bold uppercase tracking-[0.34em] text-orange-300">
                OTP Verification
              </p>
              <h1 className="mt-4 text-4xl font-bold tracking-tight sm:text-5xl">
                Activate your account before the first login.
              </h1>
              <p className="mt-5 text-base leading-8 text-slate-300">
                SneakerHub now uses OTP-based email verification so only confirmed
                accounts can receive a JWT session.
              </p>

              <div className="mt-10 space-y-4">
                <div className="rounded-3xl border border-white/10 bg-white/10 p-5 backdrop-blur">
                  <p className="text-xl font-bold">Secure by default</p>
                  <p className="mt-2 text-sm text-slate-300">
                    Registration no longer creates a partial login session before
                    email ownership is confirmed.
                  </p>
                </div>
                <div className="rounded-3xl border border-white/10 bg-white/10 p-5 backdrop-blur">
                  <p className="text-xl font-bold">Resend supported</p>
                  <p className="mt-2 text-sm text-slate-300">
                    If the OTP expires or gets lost, you can request a new code
                    without creating another account.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="p-6 sm:p-8 lg:p-10">
            <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-50 text-2xl text-orange-600">
              <SafetyCertificateOutlined />
            </div>
            <h2 className="mt-5 text-3xl font-bold tracking-tight text-slate-950">
              Verify your email
            </h2>
            <p className="mt-3 text-sm leading-7 text-slate-500">
              Use the email you registered with and enter the 6-digit OTP. The code
              expires after 10 minutes.
            </p>

            <form onSubmit={handleVerify} className="mt-8 space-y-5">
              <div>
                <label
                  htmlFor="verify-email"
                  className="mb-2 block text-sm font-bold text-slate-900"
                >
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
                <label
                  htmlFor="otp"
                  className="mb-2 block text-sm font-bold text-slate-900"
                >
                  Verification OTP
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
                {loading ? 'Verifying...' : 'Verify and continue'}
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
                {resendLoading ? 'Sending...' : 'Resend OTP'}
              </button>
              <Link to="/login" className="btn-secondary justify-center">
                <CheckCircleFilled />
                Back to login
              </Link>
            </div>

            <p className="mt-6 text-sm text-slate-500">
              Need a fresh account?{' '}
              <Link
                to="/register"
                className="font-bold text-orange-600 transition hover:text-orange-700"
              >
                Register here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default VerifyEmailPage;
