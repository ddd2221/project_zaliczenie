import Link from 'next/link';
import { Compass, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="max-w-md mx-auto my-20 p-8 rounded-3xl glass-panel border border-card-border text-center space-y-4">
      <div className="w-16 h-16 mx-auto rounded-3xl bg-primary-600/20 border border-primary-500/30 flex items-center justify-center text-primary-400">
        <Compass className="w-8 h-8" />
      </div>
      <h2 className="text-2xl font-bold text-white">Event Not Found</h2>
      <p className="text-xs text-slate-400">
        The page or event pass you were looking for doesn't exist or has expired.
      </p>
      <div className="pt-2">
        <Link
          href="/"
          className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl text-xs font-bold bg-primary-600 hover:bg-primary-500 text-white transition-all shadow-md"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Explore</span>
        </Link>
      </div>
    </div>
  );
}
