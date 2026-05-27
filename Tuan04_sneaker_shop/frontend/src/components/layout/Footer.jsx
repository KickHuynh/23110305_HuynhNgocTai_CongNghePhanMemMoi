import { Link } from 'react-router-dom';

const footerLinks = [
  { label: 'Trang chủ', to: '/' },
  { label: 'Sản phẩm', to: '/products' },
  { label: 'Danh mục', to: '/categories' },
];

function Footer() {
  return (
    <footer className="border-t border-white/60 bg-white/80 backdrop-blur">
      <div className="content-shell flex flex-col gap-4 py-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.3em] text-orange-600">SneakerHub</p>
          <p className="mt-1 text-sm text-slate-500">
            Website portfolio sneaker fullstack được xây dựng bằng React, Express và MongoDB.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-4 text-sm font-semibold text-slate-500">
          {footerLinks.map((link) => (
            <Link key={link.to} to={link.to} className="transition hover:text-orange-600">
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </footer>
  );
}

export default Footer;
