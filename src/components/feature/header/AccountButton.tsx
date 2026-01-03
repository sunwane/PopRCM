"use client";
import { useState, useRef, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useUserData } from '@/hooks/useData/useUserData';
import GradientAvatar from '@/components/ui/GradientAvatar';
import AccountDropdown from './AccountDropdown';

export default function AccountButton() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();
  const { userProfile, getUserAvatarText } = useUserData();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Close dropdown on escape key
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, []);

  if (!user || !userProfile) return null;

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        className="flex items-center space-x-2 py-1.5 px-2 rounded-lg bg-(--primary)/30 bg-blur-sm border-2 border-(--border-blue) hover:bg-(--primary)/40 transition-colors"
        aria-label="Account menu"
      >
        {userProfile.avatarUrl ? (
          <img 
            src={userProfile.avatarUrl} 
            alt={userProfile.fullName || userProfile.userName}
            className="w-8 h-8 rounded-full object-cover border-2 border-(--border-blue)"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
              e.currentTarget.nextElementSibling?.classList.remove('hidden');
            }}
          />
        ) : null}
        <div className={userProfile.avatarUrl ? 'hidden' : ''}>
          <GradientAvatar 
            initial={getUserAvatarText(userProfile?.userName || userProfile?.fullName)} 
            size="w-8 h-8 text-sm border-2 border-(--border-blue)"
          />
        </div>
        
        {/* Dropdown Arrow */}
        <img
          src="/icons/Down.png"
          alt="Dropdown Arrow"
          className={`w-2.5 h-1.5 text-gray-400 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`}
        />
      </button>

      <AccountDropdown 
        isOpen={isDropdownOpen}
        onClose={() => setIsDropdownOpen(false)}
      />
    </div>
  );
}