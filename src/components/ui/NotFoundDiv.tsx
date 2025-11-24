export interface NotFoundDivProps {
  message?: string;
}

export default function NotFoundDiv({ message = "Không tìm thấy trang" }: NotFoundDivProps) {
  return (
    <div className="flex flex-col items-center justify-center py-20 border-3 shadow-2xl border-gray-800 rounded-md mb-24">
      <div className="mb-2 text-8xl font-bold stroke-text-hollow">
        404
      </div>
      <div className="text-center text-gray-400 text-lg">
        {message}
      </div>
    </div>
  );
}