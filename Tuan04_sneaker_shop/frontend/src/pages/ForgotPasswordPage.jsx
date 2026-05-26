import { useEffect, useState } from 'react';
import { MailOutlined, RightOutlined, SafetyCertificateOutlined } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import authApi, {
  getProfileRouteByRole,
  getStoredToken,
  getStoredUser,
  setPendingResetEmail,
} from '../api/authApi';

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function ForgotPasswordPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const token = getStoredToken();

    if (token) {
      navigate(getProfileRouteByRole(getStoredUser()?.role), { replace: true });
    }
  }, [navigate]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    const normalizedEmail = email.trim().toLowerCase();

    if (!emailRegex.test(normalizedEmail)) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }

    try {
      setLoading(true);
      setErrorMessage('');

      const response = await authApi.forgotPassword({ email: normalizedEmail });

      setPendingResetEmail(normalizedEmail);
      navigate('/reset-password', {
        replace: true,
        state: {
          email: normalizedEmail,
          message: response?.data?.message || 'Password reset OTP sent to your email.',
        },
      });
    } catch (error) {
      setErrorMessage(
        error.response?.data?.message ||
          'Cannot send password reset OTP right now.'
      );
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
              <p className="text-sm font-bold uppercase tracking-[0.34em] text-orange-300">
                Password Recovery
              </p>
              <h1 className="mt-4 text-4xl font-bold tracking-tight sm:text-5xl">
                Request an OTP to reset your password.
              </h1>
              <p className="mt-5 text-base leading-8 text-slate-300">
                The backend already supports email-based password reset. This page
                simply connects the current SneakerHub UI to that API flow.
              </p>
            </div>
          </div>

          <div className="p-6 sm:p-8 lg:p-10">
            <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-50 text-2xl text-orange-600">
              <SafetyCertificateOutlined />
            </div>
            <h2 className="mt-5 text-3xl font-bold tracking-tight text-slate-950">
              Forgot password
            </h2>
            <p className="mt-3 text-sm leading-7 text-slate-500">
              Enter your registered email and we will send a 6-digit OTP for password
              reset.
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
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder="student@example.com"
                    className="field-input pl-11"
                  />
                </div>
              </div>

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
                {loading ? 'Sending OTP...' : 'Send reset OTP'}
                {!loading && <RightOutlined />}
              </button>
            </form>

            <p className="mt-6 text-sm text-slate-500">
              Remembered your password?{' '}
              <Link
                to="/login"
                className="font-bold text-orange-600 transition hover:text-orange-700"
              >
                Back to login
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ForgotPasswordPage;
