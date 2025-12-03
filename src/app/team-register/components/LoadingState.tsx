import React from 'react';
import { Loader2 } from 'lucide-react';
import { SkeletonForm } from '@/components/Skeleton';

interface LoadingStateProps {
  message?: string;
  variant?: 'spinner' | 'skeleton';
}

export function LoadingState({ message = 'Loading...', variant = 'spinner' }: LoadingStateProps) {
  if (variant === 'skeleton') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <div className="h-10 w-96 mx-auto bg-gray-200 rounded-lg animate-pulse mb-2" />
            <div className="h-6 w-64 mx-auto bg-gray-200 rounded-lg animate-pulse" />
          </div>
          <SkeletonForm />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="bg-white rounded-2xl shadow-xl p-8 flex flex-col items-center gap-4">
        <Loader2 className="w-12 h-12 animate-spin text-blue-600" />
        <p className="text-gray-600 font-medium">{message}</p>
      </div>
    </div>
  );
}
