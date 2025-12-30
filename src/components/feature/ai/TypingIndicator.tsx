export default function TypingIndicator() {
  return (
    <div className="flex justify-start mb-4">
      <div className="w-8 h-8 bg-linear-to-br from-(--gradient-secondary-start) to-(--gradient-secondary-end) rounded-full flex items-center justify-center mr-3 mt-1 shrink-0">
        <div className="">
          <img
            src={"/LogoIcon.png"}
            alt="PopRCM Icon"
            className="h-4 w-4"
          />
        </div>
      </div>
      <div className="bg-(--surface) px-6 py-4 rounded-2xl rounded-bl-md shadow-lg border border-(--border-blue)/20">
        <div className="flex items-center gap-3">
          <div className="flex gap-1">
            <div className="w-2 h-2 bg-(--primary) rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
            <div className="w-2 h-2 bg-(--primary) rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
            <div className="w-2 h-2 bg-(--primary) rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
          </div>
          <span className="text-sm text-(--text-secondary)">AI đang suy nghĩ...</span>
        </div>
      </div>
    </div>
  );
}