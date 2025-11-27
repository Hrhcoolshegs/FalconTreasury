import FalconLogo from './FalconLogo';

interface FalconLoaderProps {
  message?: string;
  fullScreen?: boolean;
}

export default function FalconLoader({ message = 'Loading Falcon Treasury...', fullScreen = true }: FalconLoaderProps) {
  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-white/95 backdrop-blur-sm flex items-center justify-center z-50">
        <div className="text-center space-y-6">
          <div className="animate-bounce">
            <FalconLogo size={80} variant="full" />
          </div>
          <div className="space-y-2">
            <p className="text-lg font-semibold text-gray-900">{message}</p>
            <div className="flex justify-center space-x-2">
              <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse" style={{ animationDelay: '0ms' }}></div>
              <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse" style={{ animationDelay: '150ms' }}></div>
              <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse" style={{ animationDelay: '300ms' }}></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center p-8">
      <div className="text-center space-y-4">
        <div className="animate-spin">
          <FalconLogo size={48} variant="icon" />
        </div>
        <p className="text-sm text-gray-600">{message}</p>
      </div>
    </div>
  );
}
