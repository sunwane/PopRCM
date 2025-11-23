export interface NotFoundDivProps {
  message?: string;
}


export default function NotFoundDiv({ message = "Không tìm thấy trang" }: NotFoundDivProps) {
  return (
    <div className="text-center text-white">{message}</div>
  );
}