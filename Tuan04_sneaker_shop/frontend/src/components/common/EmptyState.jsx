import { InboxOutlined } from '@ant-design/icons';

function EmptyState({
  title = 'Nothing to show yet',
  description = 'This section is waiting for more data from the backend.',
  icon,
  action = null,
  minHeight = 'min-h-56',
  className = '',
}) {
  return (
    <div className={`glass-panel flex ${minHeight} flex-col items-center justify-center gap-4 p-8 text-center ${className}`}>
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 text-2xl text-slate-500">
        {icon || <InboxOutlined />}
      </div>
      <div className="space-y-2">
        <h3 className="text-2xl font-bold text-slate-950">{title}</h3>
        <p className="section-copy max-w-xl">{description}</p>
      </div>
      {action}
    </div>
  );
}

export default EmptyState;
