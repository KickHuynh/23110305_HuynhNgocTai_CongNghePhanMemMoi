import { LoadingOutlined } from '@ant-design/icons';

function Loading({
  title = 'Loading content',
  description = 'Please wait while SneakerHub loads the latest data.',
  minHeight = 'min-h-56',
  className = '',
}) {
  return (
    <div className={`glass-panel flex ${minHeight} flex-col items-center justify-center gap-4 p-8 text-center ${className}`}>
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-orange-50 text-2xl text-orange-600">
        <LoadingOutlined />
      </div>
      <div className="space-y-2">
        <h3 className="text-2xl font-bold text-slate-950">{title}</h3>
        <p className="section-copy max-w-xl">{description}</p>
      </div>
    </div>
  );
}

export default Loading;
