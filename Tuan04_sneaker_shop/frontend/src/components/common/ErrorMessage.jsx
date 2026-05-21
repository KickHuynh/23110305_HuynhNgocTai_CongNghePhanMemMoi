import { WarningOutlined } from '@ant-design/icons';

function ErrorMessage({
  title = 'Something went wrong',
  message = 'Please try again in a moment.',
  action = null,
  minHeight = 'min-h-56',
  className = '',
}) {
  return (
    <div className={`glass-panel flex ${minHeight} flex-col items-center justify-center gap-4 p-8 text-center ${className}`}>
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-50 text-2xl text-red-500">
        <WarningOutlined />
      </div>
      <div className="space-y-2">
        <h3 className="text-2xl font-bold text-slate-950">{title}</h3>
        <p className="section-copy max-w-xl">{message}</p>
      </div>
      {action}
    </div>
  );
}

export default ErrorMessage;
