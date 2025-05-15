// src/components/ui/card.tsx

import { FC } from 'react'

interface CardProps {
  className?: string
  children: React.ReactNode
}

export const Card: FC<CardProps> = ({ className, children }) => {
  return (
    <div className={`rounded-lg overflow-hidden border bg-white shadow-lg dark:bg-gray-800 ${className}`}>
      {children}
    </div>
  )
}

export const CardContent: FC<CardProps> = ({ className, children }) => {
  return (
    <div className={`p-4 ${className}`}>
      {children}
    </div>
  )
}
