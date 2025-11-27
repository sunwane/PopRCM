export default function PageFooter() {
  return (
    <footer className="bg-gray-900 text-white py-6 mt-10 px-4">
      <div className="lg:max-w-[65vw] md:max-w-full sm:max-w-full max-w-full
                      px-4 lg:text-left md:text-center sm:text-center">

        <div className="py-2 flex lg:flex-row md:flex-col sm:flex-col flex-col
          lg:items-center md:items-center sm:items-center text-center
          lg:justify-start md:justify-center sm:justify-center justify-center
          lg:gap-10 gap-y-5">
          <div className="flex justify-center items-center">
            <img
              src="/Logo.png"
              alt="PopRCM Logo"
              className="h-16 w-auto"
            />
          </div>
          <div className="flex lg:flex-row md:flex-row sm:flex-row flex-row
            lg:items-center md:items-center sm:items-center items-center
            lg:justify-start md:justify-center sm:justify-center justify-center
            gap-2.5">
            <a href="/#" className="bg-white/10 p-2 rounded-full flex items-center justify-center">
              <img src="/icons/GitHub.png" alt="Github" className="w-5 h-5" />
            </a>
            <a href="/#" className="bg-white/10 p-2.5 rounded-full flex items-center justify-center">
              <img src="/icons/Mail.png" alt="Email" className="w-4 h-4" />
            </a>
            <a href="/#" className="bg-white/10 p-2.5 rounded-full flex items-center justify-center">
              <img src="/icons/Facebook.png" alt="Facebook" className="w-4 h-4" />
            </a>
            <a href="/#" className="bg-white/10 p-2.5 rounded-full flex items-center justify-center">
              <img src="/icons/Youtube.png" alt="Youtube" className="w-4 h-4" />
            </a>
            <a href="/#" className="bg-white/10 p-2 rounded-full flex items-center justify-center">
              <img src="/icons/Tiktok.png" alt="Tiktok" className="w-5 h-5" />
            </a>
          </div>
        </div>

        <div className="flex lg:items-center md:items-center sm:items-center text-center
          lg:justify-start md:justify-center sm:justify-center justify-center
          lg:gap-10 md:gap-6 sm:gap-4 gap-4 mt-2
          lg:text-[16px] md:text-sm sm:text-sm text-sm   flex-wrap">
          <a href="/#" className="text-white hover:text-(--hover) text-nowrap" >Chính sách bảo mật</a>
          <a href="/#" className="text-white hover:text-(--hover) text-nowrap">Điều khoản sử dụng</a>
          <a href="/#" className="text-white hover:text-(--hover) text-nowrap">Dự án học tập</a>
          <a href="/about" className="text-white hover:text-(--hover) text-nowrap">Về chúng tôi</a>
        </div>

        <div>
          <p className="lg:text-sm md:text-sm sm:text-[11px] text-[11px] text-gray-400 px-2 py-5 lg:text-justify md:text-center sm:text-center text-center">
            Bạn đang ở PopRCM - nơi AI giúp bạn chọn phim mà không cần suy nghĩ! <br />
            Đây là dự án thử nghiệm nhằm nghiên cứu khả năng gợi ý phim bằng trí tuệ nhân tạo. 
            Trang web không chịu trách nhiệm về nội dung được liên kết bên ngoài và không lưu trữ video nào trên máy chủ. 
            Chúng tôi hoàn toàn không cung cấp nội dung có bản quyền, toàn bộ dữ liệu chỉ phục vụ mục đích học tập và nghiên cứu công nghệ.
            Nếu bạn yêu thích bộ phim nào, hãy ủng hộ bản quyền chính thức từ các nền tảng phát hành hợp pháp.
          </p>
        </div>

        <div className="lg:text-[16px] md:text-sm sm:text-sm text-xs">
          <p>&copy; {new Date().getFullYear()} <b>POPRCM</b>. Toàn bộ nội dung trên website này chỉ phục vụ cho mục đích học tập.</p>
          <p>Thiết kế và phát triển bởi PopRCM Team.</p>
        </div>

      </div>
    </footer>
  );
}