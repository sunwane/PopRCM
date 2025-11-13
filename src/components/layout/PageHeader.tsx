import SearchBar from "@/components/feature/searchBar/SearchBar";

export default function PageHeader() {
  return (
    <div className="flex space-x-[3vw] mx-auto py-3 px-2">
        <img
          src="/logo.png"
          alt="PopRCM Logo"
          className="h-[60px] w-auto"
        />
        <SearchBar />

        <div className="flex items-center">
          {/* Navigation Links */}
        <nav className="flex shrink-0 items-center space-x-[2.5vw] text-white/70 text-sm text-nowrap">
          <a href="#" className="hover:text-white transition">Phim lẻ</a>
          <a href="#" className="hover:text-white transition">Phim bộ</a>
          <button className="hover:text-white transition flex items-center space-x-2 text-white opacity-70 hover:opacity-100">
            <div>Thể loại</div>
            <img src="/icons/Down.png" alt="" className="w-auto h-1.5" />
          </button>
          <button className="hover:text-white transition flex items-center space-x-2 text-white opacity-70 hover:opacity-100">
            <div>Quốc gia</div>
            <img src="/icons/Down.png" alt="" className="w-auto h-1.5" />
          </button>
          <button className="hover:text-white transition flex items-center space-x-2 text-white opacity-70 hover:opacity-100">
            <div>Thêm</div>
            <img src="/icons/Down.png" alt="" className="w-auto h-1.5" />
          </button>
          <a href="#" className="hover:text-white transition flex items-top space-x-2 text-white opacity-70 hover:opacity-100">
            <div>AI gợi ý phim</div>
            <img src="/icons/Sparkles.png" alt="" className="w-4 h-4" />
          </a>
        </nav>
        </div>

        {/* User Actions */}
        <div className="flex items-center">
          <button className="flex items-center space-x-1.5 bg-(--primary)/30 px-4 py-3 border-2 border-(--primary) rounded-lg">
            <img src="/icons/Account.png" alt="Account" className="w-5 h-5" />
            <div className="text-white font-medium text-nowrap text-shadow-[1px_1px_2px_var(--border-blue)]">Đăng nhập</div>
          </button>
        </div>
    </div>
  );
}