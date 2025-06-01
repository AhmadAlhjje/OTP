'use client';

import React from 'react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  color?: 'green' | 'blue' | 'white' | 'gray';
  message?: string;
  overlay?: boolean;
  pulse?: boolean;
  dots?: boolean;
}

export default function LoadingSpinner({
  size = 'md',
  color = 'green',
  message = '',
  overlay = true,
  pulse = false,
  dots = true,
}: LoadingSpinnerProps) {
  
  // تحديد أحجام مختلفة للسبينر
  const sizeClasses = {
    sm: 'w-6 h-6 border-2',
    md: 'w-12 h-12 border-4',
    lg: 'w-16 h-16 border-4',
    xl: 'w-20 h-20 border-[6px]'
  };

  // تحديد الألوان المختلفة
  const colorClasses = {
    green: 'border-green-200 border-t-green-600 dark:border-green-700 dark:border-t-green-400',
    blue: 'border-blue-200 border-t-blue-600 dark:border-blue-700 dark:border-t-blue-400',
    white: 'border-gray-200 border-t-white',
    gray: 'border-gray-300 border-t-gray-600 dark:border-gray-600 dark:border-t-gray-300'
  };

  // النقاط المتحركة
  const DotsAnimation = () => (
    <div className="flex items-center justify-center space-x-1 mt-4">
      <div className={`w-2 h-2 bg-${color === 'green' ? 'green' : color}-500 rounded-full animate-bounce`}></div>
      <div className={`w-2 h-2 bg-${color === 'green' ? 'green' : color}-500 rounded-full animate-bounce`} style={{ animationDelay: '0.1s' }}></div>
      <div className={`w-2 h-2 bg-${color === 'green' ? 'green' : color}-500 rounded-full animate-bounce`} style={{ animationDelay: '0.2s' }}></div>
    </div>
  );

  // الرسائل المتحركة
  const messages = [
    'جاري التحميل...',
    'يرجى الانتظار...',
    'معالجة البيانات...',
    'تحديث المعلومات...',
  ];

  const [currentMessage, setCurrentMessage] = React.useState(message || messages[0]);

  React.useEffect(() => {
    if (!message) {
      const interval = setInterval(() => {
        setCurrentMessage(prev => {
          const currentIndex = messages.indexOf(prev);
          return messages[(currentIndex + 1) % messages.length];
        });
      }, 2000);
      return () => clearInterval(interval);
    }
  }, [message]);

  const spinnerContent = (
    <div className="flex flex-col items-center justify-center">
      {/* السبينر الرئيسي مع تأثيرات إضافية */}
      <div className="relative">
        {/* حلقة خارجية مع تأثير النبض */}
        {pulse && (
          <div className={`absolute inset-0 ${sizeClasses[size]} ${colorClasses[color]} rounded-full animate-ping opacity-20`}></div>
        )}
        
        {/* السبينر الأساسي */}
        <div className={`${sizeClasses[size]} ${colorClasses[color]} rounded-full animate-spin`}></div>
        
        {/* نقطة وسطية للتصميم */}
        <div className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-${color === 'green' ? 'green' : color}-500 rounded-full animate-pulse`}></div>
      </div>

      {/* النص المتحرك */}
      {(message || !overlay) && (
        <div className="mt-4 text-center animate-fadeIn">
          <p className="text-gray-700 dark:text-gray-300 font-medium text-sm transition-all duration-500">
            {currentMessage}
          </p>
          {dots && <DotsAnimation />}
        </div>
      )}
      
      {/* شريط تقدم وهمي */}
      <div className="mt-4 w-32 bg-gray-200 dark:bg-gray-700 rounded-full h-1 overflow-hidden">
        <div className={`h-full bg-${color === 'green' ? 'green' : color}-500 rounded-full animate-pulse`} style={{ width: '60%', animation: 'progress 2s ease-in-out infinite' }}></div>
      </div>
    </div>
  );

  if (!overlay) {
    return (
      <div className="flex items-center justify-center p-4">
        {spinnerContent}
      </div>
    );
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/30 backdrop-blur-sm z-50 animate-fadeIn">
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-2xl border border-gray-200 dark:border-gray-700 mx-4 max-w-sm w-full">
        {spinnerContent}
      </div>
      
      <style jsx global>{`
        @keyframes progress {
          0% {
            width: 0%;
            margin-left: 0%;
          }
          50% {
            width: 75%;
            margin-left: 0%;
          }
          100% {
            width: 0%;
            margin-left: 100%;
          }
        }
        
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}