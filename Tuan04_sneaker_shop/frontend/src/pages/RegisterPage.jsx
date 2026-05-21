import { useEffect, useState } from 'react';
import { IdcardOutlined, LockOutlined, MailOutlined, RightOutlined, UserOutlined } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import authApi, { extractAuthSession, getStoredToken, setAuthSession } from '../api/authApi';

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

  useEffect(() => {
    const token = getStoredToken();
    if (token) {
      navigate('/', { replace: true });
    }
  }, [navigate]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setLoading(true);
      setErrorMessage('');

      const response = await authApi.register(formData);
      setAuthSession(extractAuthSession(response));
      navigate('/', { replace: true });
    } catch (error) {
      setErrorMessage(error.response?.data?.message || 'Register failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-shell">
      <div className="content-shell py-12 sm:py-16">
        <div className="mx-auto grid max-w-6xl gap-8 overflow-hidden rounded-[36px] border border-white/70 bg-white shadow-2xl shadow-slate-900/10 lg:grid-cols-[440px_1fr]">
          <div className="p-6 sm:p-8 lg:p-10">
            <p className="text-sm font-bold uppercase tracking-[0.28em] text-orange-600">Create Account</p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-950">Join SneakerHub</h2>
            <p className="mt-3 text-sm leading-7 text-slate-500">
              Register with your current backend auth flow and step straight into the refreshed storefront.
            </p>

            <form onSubmit={handleSubmit} className="mt-8 space-y-5">
              <div>
                <label htmlFor="fullName" className="mb-2 block text-sm font-bold text-slate-900">
                  Full name
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
                  Student ID
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
                  Password
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
                    placeholder="At least 6 characters"
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
                {loading ? 'Creating account...' : 'Register'}
                {!loading && <RightOutlined />}
              </button>
            </form>

            <p className="mt-6 text-sm text-slate-500">
              Already have an account?{' '}
              <Link to="/login" className="font-bold text-orange-600 transition hover:text-orange-700">
                Login here
              </Link>
            </p>
          </div>

          <div className="relative overflow-hidden bg-[radial-gradient(circle_at_top_right,_rgba(255,69,0,0.25),_transparent_26%),linear-gradient(135deg,_#020617_0%,_#111827_58%,_#1f2937_100%)] px-6 py-10 text-white sm:px-10 lg:px-12 lg:py-14">
            <div className="relative z-10 max-w-xl">
              <p className="text-sm font-bold uppercase tracking-[0.34em] text-orange-300">Week 4 Upgrade</p>
              <h1 className="mt-4 text-4xl font-bold tracking-tight sm:text-5xl">Build your account and explore the premium sneaker demo.</h1>
              <p className="mt-5 text-base leading-8 text-slate-300">
                Login, profile, and product APIs keep the same backend structure while the storefront gets a stronger
                e-commerce look and feel.
              </p>

              <div className="mt-10 space-y-4">
                <div className="rounded-3xl border border-white/10 bg-white/10 p-5 backdrop-blur">
                  <p className="text-xl font-bold">Responsive by default</p>
                  <p className="mt-2 text-sm text-slate-300">Desktop, tablet, and mobile layouts are tuned for demo-ready presentation.</p>
                </div>
                <div className="rounded-3xl border border-white/10 bg-white/10 p-5 backdrop-blur">
                  <p className="text-xl font-bold">Backend-safe refresh</p>
                  <p className="mt-2 text-sm text-slate-300">No new project, no auth removal, and product data still comes from your backend API.</p>
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
