"use client";

export default function Navbar() {
  const handleScroll = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      // 計算包含 Navbar 高度的偏移量 (約 70px)
      const y = element.getBoundingClientRect().top + window.scrollY - 70;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  const navItems = [
    { id: 'hero', label: '卷首' },
    { id: 'wiki', label: '諸神' },
    { id: 'calendar', label: '歲時' },
    { id: 'story', label: '說書' },
    { id: 'literature', label: '研考' },
    { id: 'map', label: '尋蹤' },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 bg-rice/90 backdrop-blur-md border-b border-ink/20">
      <div className="text-ink font-serif text-xl font-bold tracking-widest flex items-center gap-2">
        <span className="w-2 h-2 bg-vermilion inline-block"></span>
        世代銘印
      </div>
      <ul className="flex items-center gap-8 text-sm tracking-widest font-sans text-ink">
        {navItems.map((item) => (
          <li key={item.id}>
            <button 
              onClick={() => handleScroll(item.id)}
              className="hover:text-vermilion transition-colors duration-300 cursor-pointer"
            >
              {item.label}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
}
