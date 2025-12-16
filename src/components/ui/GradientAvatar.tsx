interface GradientAvatarProps {
  initial: string;
  size?: string;
}

export default function GradientAvatar({ initial, size }: GradientAvatarProps) {
    return (
        <div className={`bg-linear-to-br from-blue-400 to-blue-800 rounded-full flex items-center justify-center text-white font-semibold ${size ? size : 'w-10 h-10'}`}>
        { initial }
        </div>
    );
}