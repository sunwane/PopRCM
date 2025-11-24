export function LoadingPage() {
  return (
    <div className="flex justify-center items-center mx-auto h-screen">
      <div className="animate-glow items-center flex flex-col">
        <div className="flex justify-center drop-shadow-[0_0_10px_#3080FF] px-5 py-4 bg-black/30 rounded-lg border-2 border-blue-500/30">
          <img
            src="/Logo.png"
            alt="loading"
            className="h-[15vh]"
          />
        </div>
        <div className="mt-6 justify-center text-center text-[26px] text-white font-semibold tracking-wide space-y-0.5">
          <div className="">Thư giãn xem phim là việc của bạn, </div>
          <div className="">tìm phim là vai trò chúng tôi</div>
        </div>
      </div>

      <style jsx>{`
        @keyframes glow {
          0% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.05);
          }
          100% {
            transform: scale(1);
          }
        }

        .animate-glow {
          animation: glow 1.5s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}