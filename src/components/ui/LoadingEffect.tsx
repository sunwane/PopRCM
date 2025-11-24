export interface LoadingEffectProps {
  message?: string;
}

export function LoadingEffect( { message = "Đang tải..." }: LoadingEffectProps) {
  return (
    <div className="flex justify-center items-center mx-auto h-[70vh]">
      <div className="animate-pulse items-center flex flex-col">
        <img
          src="/LogoIcon.png"
          alt="loading"
          className="w-[10vw] drop-shadow-[0_0_10px_#3080FF]"
        />
        <div className="flex items-center space-x-2.5 mt-4 justify-center drop-shadow-[0_0_10px_#3080FF]">
          <div className="w-6 h-6 border-4 border-t-transparent border-blue-500 rounded-full animate-spin"></div>
          <div className="text-center text-xl text-white">{message}</div>
        </div>
      </div>
    </div>
  );
}