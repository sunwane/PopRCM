interface HeaderDropdownProps {
  type?: string;
  items: Array<{
    label: string;
    id: string;
    link?: string;
    icon?: string;
  }>;
}

export default function HeaderDropdown({ items, type }: HeaderDropdownProps) {
  const columnCount = items.length <= 4 ? 1 : items.length <= 20 ? 2 : 3;

  return (
    <div
      className={`bg-black/85 px-5 py-4 rounded-lg grid gap-5 items-left shadow-md animate-fadeIn shrink-0`}
      style={{
        gridTemplateColumns: `repeat(${columnCount}, minmax(140px, 1fr))`,
        zIndex: 30, // Đảm bảo dropdown nằm trên cùng
        position: "absolute", // Đặt dropdown ở chế độ `absolute`
      }}
    >
      {type !== "more" ? (
        items.map((item) => (
          <a
            href={`/${type}/${item.id}`}
            key={item.id}
            className="hover:text-(--hover) cursor-pointer text-sm"
          >
            {item.label}
          </a>
        ))
      ) : (
        items.map((item) => (
          <a href={`${item.link}`} key={item.id} className="hover:text-(--hover) cursor-pointer text-left text-sm">
            {item.label}
          </a>
        ))
      )}
    </div>
  );
}