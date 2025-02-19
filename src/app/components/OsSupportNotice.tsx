import { FaWindows, FaApple } from 'react-icons/fa';

export default function OsSupportNotice() {
  return (
    <div className="flex items-center space-x-3 text-white font-medium bg-gradient-to-r from-blue-500/20 to-purple-500/20 px-4 py-2 rounded-full border border-blue-400/20">
      <span>Supported on:</span>
      <div className="flex items-center space-x-3">
        <div className="flex items-center space-x-1.5">
          <FaApple className="h-4 w-4" />
          <span>macOS</span>
        </div>
        <div className="flex items-center space-x-1.5">
          <FaWindows className="h-4 w-4" />
          <span>Windows</span>
        </div>
      </div>
    </div>
  );
}