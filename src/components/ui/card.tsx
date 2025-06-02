import { ReactNode } from 'react';
import clsx from 'clsx';

interface CardProps {
  children: ReactNode;
  className?: string;
}

export const Card = ({ children, className }: CardProps) => {
  return (
    <div
      className={clsx(
        'rounded-2xl shadow-md p-4 border',
        'bg-white dark:bg-gray-800',
        'border-gray-200 dark:border-gray-700',
        className
      )}
    >
      {children}
    </div>
  );
};
