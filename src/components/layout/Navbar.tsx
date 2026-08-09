export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 bg-rice/90 backdrop-blur-md border-b border-ink/20">
      <div className="text-ink font-serif text-xl font-bold tracking-widest flex items-center gap-2">
        <span className="w-2 h-2 bg-vermilion inline-block"></span>
        世代銘印
      </div>
      <ul className="flex items-center gap-8 text-sm tracking-widest font-sans text-ink">
        <li>
          <a href="#hero" className="hover:text-vermilion transition-colors duration-300">卷首</a>
        </li>
        <li>
          <a href="#wiki" className="hover:text-vermilion transition-colors duration-300">諸神</a>
        </li>
        <li>
          <a href="#calendar" className="hover:text-vermilion transition-colors duration-300">歲時</a>
        </li>
        <li>
          <a href="#story" className="hover:text-vermilion transition-colors duration-300">說書</a>
        </li>
        <li>
          <a href="#literature" className="hover:text-vermilion transition-colors duration-300">研考</a>
        </li>
        <li>
          <a href="#map" className="hover:text-vermilion transition-colors duration-300">尋蹤</a>
        </li>
      </ul>
    </nav>
  );
}
