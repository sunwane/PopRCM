import Link from 'next/link';
import { useState } from 'react';

export interface ExpandableButtonProps {
  href: string;
  message: string;
  icon?: React.ReactNode;
  className?: string;
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
}

export function ExpandableButton({ 
  href, 
  message, 
  icon, 
  className = "",
  variant = 'ghost',
  size = 'md'
}: ExpandableButtonProps) {
  const [isHovered, setIsHovered] = useState(false);

  const defaultIcon = (
    <svg 
      className={`${size === 'sm' ? 'w-3 h-3' : size === 'lg' ? 'w-5 h-5' : 'w-4 h-4'}`}
      fill="none" 
      stroke="currentColor" 
      viewBox="0 0 24 24"
    >
      <path 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        strokeWidth={3} 
        d="M9 5l7 7-7 7" 
      />
    </svg>
  );

  const getVariantStyles = () => {
    switch (variant) {
      case 'secondary':
        return 'bg-gray-600 hover:bg-gray-500 text-white';
      case 'ghost':
        return 'bg-transparent hover:bg-white/10 text-blue-400 hover:text-blue-300 border border-blue-400/40';
      default:
        return 'bg-blue-600 hover:bg-blue-500 text-white';
    }
  };

  const getSizeStyles = () => {
    switch (size) {
      case 'sm':
        return {
          collapsed: 'w-6 h-6',
          expanded: 'pl-2 pr-3 py-1',
          text: 'text-xs'
        };
      case 'lg':
        return {
          collapsed: 'w-10 h-10',
          expanded: 'pl-5 pr-5 py-2',
          text: 'text-base'
        };
      default:
        return {
          collapsed: 'w-8 h-8',
          expanded: 'pl-3 pr-4 py-1.5',
          text: 'text-sm'
        };
    }
  };

  const sizeStyles = getSizeStyles();

  return (
    <Link href={href}>
      <button
        className={`
          relative flex items-center justify-center
          ${getVariantStyles()}
          ${sizeStyles.text} font-medium
          rounded-full
          overflow-hidden
          ${isHovered ? sizeStyles.expanded : sizeStyles.collapsed}
          ${className}
        `}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Icon container */}
        <div className={`
          flex items-center justify-center shrink-0
          transition-all duration-300 ease-in-out
          ${isHovered ? 'mr-2' : ''}
        `}>
          {icon || defaultIcon}
        </div>
        
        {/* Message container */}
        <div className={`
          whitespace-nowrap transition-all duration-300 ease-in-out
          ${isHovered ? 'opacity-100 max-w-xs' : 'opacity-0 max-w-0'}
        `}>
          {message}
        </div>
      </button>
    </Link>
  );
}