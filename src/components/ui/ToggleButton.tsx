interface ToggleButtonProps {
  isActive: boolean;
  onToggle: () => void;
  leftLabel: string;
  rightLabel: string;
  className?: string;
}

export default function ToggleButton({
  isActive,
  onToggle,
  leftLabel,
  rightLabel,
  className = ""
}: ToggleButtonProps) {
  return (
    <div className={`flex items-center ${className}`}>
      <button
        onClick={onToggle}
        className={`relative inline-flex items-center rounded-lg border-2 p-1 border-white transition-all duration-300 ${
          isActive ? 'text-black' : ' text-white'
        }`}
      >
        {/* Left Label */}
        <span
          className={`flex-1 text-center transition-all duration-300 px-3 py-2 text-nowrap lg:text-sm text-xs ${
            !isActive ? 'text-black bg-white rounded-l-[5px]' : 'text-white bg-(--background)'
          }`}
        >
          {leftLabel}
        </span>

        {/* Right Label */}
        <span
          className={`flex-1 text-center transition-all duration-300 px-3 py-2 text-nowrap lg:text-sm text-xs ${
            isActive ? 'text-black bg-white rounded-r-[5px]' : 'text-white bg-(--background)'
          }`}
        >
          {rightLabel}
        </span>
      </button>
    </div>
  );
}