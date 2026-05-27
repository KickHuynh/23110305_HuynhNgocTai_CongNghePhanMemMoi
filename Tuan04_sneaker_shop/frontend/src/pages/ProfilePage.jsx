import { useEffect, useState } from 'react';
import {
  CheckCircleFilled,
  CloseOutlined,
  EditOutlined,
  IdcardOutlined,
  MailOutlined,
  SaveOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import authApi, { clearAuthSession, getStoredToken, setAuthSession } from '../api/authApi';
import ErrorMessage from '../components/common/ErrorMessage';
import { extractApiData, getUserDisplayName, getUserRole } from '../utils/shop';

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const createProfileForm = (profile = {}) => ({
  fullName: profile.fullName || '',
  email: profile.email || '',
  studentId: profile.studentId || '',
});

function ProfilePage() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState(createProfileForm());
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const token = getStoredToken();

    if (!token) {
      navigate('/login', { replace: true });
      return;
    }

    const fetchCurrentUser = async () => {
      try {
        setLoading(true);
        setErrorMessage('');

        const response = await authApi.getCurrentUser();
        const currentUser = extractApiData(response, {}).user;

        setUser(currentUser);
        setFormData(createProfileForm(currentUser));
        setAuthSession({ user: currentUser });
      } catch (error) {
        setErrorMessage(error.response?.data?.message || 'Không thể lấy thông tin người dùng hiện tại.');
        clearAuthSession();
      } finally {
        setLoading(false);
      }
    };

    fetchCurrentUser();
  }, [navigate]);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const handleStartEditing = () => {
    setErrorMessage('');
    setSuccessMessage('');
    setFormData(createProfileForm(user));
    setIsEditing(true);
  };

  const handleCancelEditing = () => {
    setErrorMessage('');
    setSuccessMessage('');
    setFormData(createProfileForm(user));
    setIsEditing(false);
  };

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

    try {
      setSaving(true);
      setErrorMessage('');
      setSuccessMessage('');

      const response = await authApi.updateProfile(formData);
      const updatedUser = extractApiData(response, {}).user;

      setUser(updatedUser);
      setFormData(createProfileForm(updatedUser));
      setAuthSession({ user: updatedUser });
      setIsEditing(false);
      setSuccessMessage(response?.data?.message || 'Cập nhật hồ sơ thành công.');
    } catch (error) {
      setErrorMessage(error.response?.data?.message || 'Hiện không thể cập nhật hồ sơ.');
    } finally {
      setSaving(false);
    }
  };

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

  if (errorMessage && !user) {
    return (
      <div className="page-shell">
        <div className="content-shell py-16">
          <ErrorMessage
            title="Không thể tải hồ sơ"
            message={errorMessage}
            minHeight="min-h-[360px]"
            className="mx-auto max-w-3xl rounded-[36px]"
            action={
              <Link to="/login" className="btn-primary">
                Quay lại đăng nhập
              </Link>
            }
          />
        </div>
      </div>
    );
  }

  const displayName = getUserDisplayName(user);
  const role = getUserRole(user);
  const hasProfileChanges =
    user &&
    (formData.fullName.trim() !== (user.fullName || '').trim() ||
      formData.email.trim().toLowerCase() !== (user.email || '').trim().toLowerCase() ||
      formData.studentId.trim() !== (user.studentId || '').trim());

  return (
    <div className="page-shell">
      <div className="content-shell py-12 sm:py-16">
        <div className="mx-auto max-w-5xl overflow-hidden rounded-[36px] border border-white/70 bg-white shadow-2xl shadow-slate-900/10">
          <div className="bg-[radial-gradient(circle_at_top_left,_rgba(255,69,0,0.22),_transparent_20%),linear-gradient(135deg,_#020617_0%,_#111827_65%,_#1f2937_100%)] px-6 py-10 text-white sm:px-10">
            <p className="text-sm font-bold uppercase tracking-[0.34em] text-orange-300">Tổng quan hồ sơ</p>
            <div className="mt-5 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-4">
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-white/10 text-3xl font-bold backdrop-blur">
                  {displayName.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">{displayName}</h1>
                  <div className="mt-2 flex flex-wrap items-center gap-3">
                    <p className="text-sm font-semibold uppercase tracking-[0.28em] text-orange-300">{role}</p>
                    <span className="inline-flex items-center gap-2 rounded-full border border-emerald-300/30 bg-emerald-400/10 px-3 py-1 text-xs font-bold uppercase tracking-[0.22em] text-emerald-200">
                      <CheckCircleFilled />
                      {user?.isEmailVerified ? 'Email đã xác thực' : 'Đang chờ xác thực'}
                    </span>
                  </div>
                </div>
              </div>
              <Link to="/products" className="btn-secondary border-white/15 bg-white/10 text-white hover:border-orange-300 hover:text-orange-300">
                Tiếp tục mua sắm
              </Link>
            </div>
          </div>

          <div className="grid gap-6 p-6 sm:p-8 lg:grid-cols-[1.15fr_0.85fr]">
            <div className="rounded-[28px] border border-slate-200 bg-slate-50 p-6">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-slate-950">Thông tin tài khoản</h2>
                  <p className="mt-2 text-sm leading-7 text-slate-500">
                    Chỉnh sửa thông tin cá nhân và đồng bộ phiên local với API hồ sơ từ backend.
                  </p>
                </div>

                {isEditing ? (
                  <button type="button" onClick={handleCancelEditing} className="btn-secondary justify-center">
                    <CloseOutlined />
                    Hủy
                  </button>
                ) : (
                  <button type="button" onClick={handleStartEditing} className="btn-secondary justify-center">
                    <EditOutlined />
                    Chỉnh sửa hồ sơ
                  </button>
                )}
              </div>

              <form onSubmit={handleSubmit} className="mt-6 space-y-5">
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
                      minLength={2}
                      value={formData.fullName}
                      onChange={handleChange}
                      disabled={!isEditing || saving}
                      className="field-input pl-11 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-500"
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
                      disabled={!isEditing || saving}
                      className="field-input pl-11 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-500"
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
                      disabled={!isEditing || saving}
                      className="field-input pl-11 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-500"
                    />
                  </div>
                </div>

                {successMessage && (
                  <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700">
                    {successMessage}
                  </div>
                )}

                {errorMessage && user && (
                  <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-600">
                    {errorMessage}
                  </div>
                )}

                {isEditing && (
                  <div className="flex flex-col gap-3 sm:flex-row">
                    <button
                      type="submit"
                      disabled={saving || !hasProfileChanges}
                      className="btn-primary justify-center disabled:cursor-not-allowed disabled:opacity-70"
                    >
                      <SaveOutlined />
                      {saving ? 'Đang lưu...' : 'Lưu thay đổi'}
                    </button>
                    <button
                      type="button"
                      onClick={handleCancelEditing}
                      disabled={saving}
                      className="btn-secondary justify-center disabled:cursor-not-allowed disabled:opacity-70"
                    >
                      <CloseOutlined />
                      Hủy thay đổi
                    </button>
                  </div>
                )}
              </form>
            </div>

            <div className="rounded-[28px] border border-slate-200 bg-white p-6">
              <h2 className="text-2xl font-bold text-slate-950">Trạng thái</h2>
              <div className="mt-6 space-y-4">
                <div className="rounded-3xl border border-emerald-100 bg-emerald-50 p-5">
                  <div className="flex items-center gap-3 text-emerald-700">
                    <CheckCircleFilled />
                    <p className="font-bold">Đăng nhập thành công</p>
                  </div>
                  <p className="mt-2 text-sm leading-7 text-emerald-700/80">
                    Dữ liệu hồ sơ được tải từ ExpressJS API và MongoDB qua luồng JWT hiện có.
                  </p>
                </div>
                <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
                  <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">Vai trò hiện tại</p>
                  <p className="mt-2 text-2xl font-bold text-slate-950">{role}</p>
                  <p className="mt-2 text-sm leading-7 text-slate-500">
                    Frontend hiện hỗ trợ xem và chỉnh sửa đúng các trường hồ sơ được mở qua `PUT /auth/me`.
                  </p>
                </div>
                <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
                  <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">Trạng thái xác thực</p>
                  <p className="mt-2 text-2xl font-bold text-slate-950">
                    {user?.isEmailVerified ? 'Đã xác thực' : 'Đang chờ'}
                  </p>
                  <p className="mt-2 text-sm leading-7 text-slate-500">
                    Trạng thái xác thực email được trả về từ backend và lưu lại trong phiên người dùng sau mỗi lần làm mới hoặc cập nhật hồ sơ.
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
