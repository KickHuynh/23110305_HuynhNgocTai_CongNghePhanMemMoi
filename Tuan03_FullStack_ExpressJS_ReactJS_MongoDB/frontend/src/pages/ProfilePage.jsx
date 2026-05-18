import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CheckCircleFilled, IdcardOutlined, MailOutlined, UserOutlined } from '@ant-design/icons';
import axiosClient from '../api/axiosClient';
import { extractApiData, getUserDisplayName, getUserRole } from '../utils/shop';

function ProfilePage() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('accessToken') || localStorage.getItem('token');

    if (!token) {
      navigate('/login', { replace: true });
      return;
    }

    const fetchCurrentUser = async () => {
      try {
        setLoading(true);
        setErrorMessage('');

        const response = await axiosClient.get('/auth/me');
        const currentUser = extractApiData(response, {}).user;

        setUser(currentUser);
        localStorage.setItem('user', JSON.stringify(currentUser));
      } catch (error) {
        setErrorMessage(error.response?.data?.message || 'Cannot get current user information.');
        localStorage.removeItem('accessToken');
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      } finally {
        setLoading(false);
      }
    };

    fetchCurrentUser();
  }, [navigate]);

  if (loading) {
    return (
      <div className="page-shell">
        <div className="content-shell py-16">
          <div className="mx-auto max-w-4xl rounded-[36px] border border-slate-200 bg-white p-6 shadow-lg shadow-slate-900/5 sm:p-8">
            <div className="space-y-4">
              <div className="skeleton-block h-8 w-48" />
              <div className="skeleton-block h-20 w-full rounded-3xl" />
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="skeleton-block h-32 w-full rounded-3xl" />
                <div className="skeleton-block h-32 w-full rounded-3xl" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (errorMessage) {
    return (
      <div className="page-shell">
        <div className="content-shell py-16">
          <div className="mx-auto max-w-3xl rounded-[36px] border border-red-200 bg-white p-8 text-center shadow-lg shadow-slate-900/5">
            <h1 className="text-3xl font-bold text-slate-950">Profile unavailable</h1>
            <p className="mt-4 text-base leading-8 text-slate-500">{errorMessage}</p>
            <Link to="/login" className="btn-primary mt-6">
              Back to Login
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const displayName = getUserDisplayName(user);
  const role = getUserRole(user);

  return (
    <div className="page-shell">
      <div className="content-shell py-12 sm:py-16">
        <div className="mx-auto max-w-5xl overflow-hidden rounded-[36px] border border-white/70 bg-white shadow-2xl shadow-slate-900/10">
          <div className="bg-[radial-gradient(circle_at_top_left,_rgba(255,69,0,0.22),_transparent_20%),linear-gradient(135deg,_#020617_0%,_#111827_65%,_#1f2937_100%)] px-6 py-10 text-white sm:px-10">
            <p className="text-sm font-bold uppercase tracking-[0.34em] text-orange-300">Profile Overview</p>
            <div className="mt-5 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-4">
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-white/10 text-3xl font-bold backdrop-blur">
                  {displayName.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">{displayName}</h1>
                  <p className="mt-2 text-sm font-semibold uppercase tracking-[0.28em] text-orange-300">{role}</p>
                </div>
              </div>
              <Link to="/products" className="btn-secondary border-white/15 bg-white/10 text-white hover:border-orange-300 hover:text-orange-300">
                Continue shopping
              </Link>
            </div>
          </div>

          <div className="grid gap-6 p-6 sm:p-8 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="rounded-[28px] border border-slate-200 bg-slate-50 p-6">
              <h2 className="text-2xl font-bold text-slate-950">Account Details</h2>
              <div className="mt-6 space-y-4">
                <div className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-950 text-white">
                    <UserOutlined />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-500">Full name</p>
                    <p className="text-base font-bold text-slate-950">{user?.fullName}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-950 text-white">
                    <MailOutlined />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-500">Email</p>
                    <p className="text-base font-bold text-slate-950">{user?.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-950 text-white">
                    <IdcardOutlined />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-500">Student ID</p>
                    <p className="text-base font-bold text-slate-950">{user?.studentId}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-[28px] border border-slate-200 bg-white p-6">
              <h2 className="text-2xl font-bold text-slate-950">Status</h2>
              <div className="mt-6 space-y-4">
                <div className="rounded-3xl border border-emerald-100 bg-emerald-50 p-5">
                  <div className="flex items-center gap-3 text-emerald-700">
                    <CheckCircleFilled />
                    <p className="font-bold">Authenticated successfully</p>
                  </div>
                  <p className="mt-2 text-sm leading-7 text-emerald-700/80">
                    Profile data is loaded from your ExpressJS API and MongoDB database through the existing JWT flow.
                  </p>
                </div>
                <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
                  <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">Current role</p>
                  <p className="mt-2 text-2xl font-bold text-slate-950">{role}</p>
                  <p className="mt-2 text-sm leading-7 text-slate-500">
                    Login and profile functions remain intact while the Sneaker Shop UI has been upgraded for Week 4.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;
