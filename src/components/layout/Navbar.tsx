export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 bg-xuan/80 backdrop-blur-md border-b border-jiang/50">
      <div className="text-amber font-serif text-xl font-bold tracking-widest">
        世代銘印
      </div>
      <ul className="flex items-center gap-8 text-sm tracking-widest font-sans">
        <li>
          <a href="#hero" className="hover:text-amber transition-colors duration-300">卷首</a>
        </li>
        <li>
          <a href="#wiki" className="hover:text-amber transition-colors duration-300">諸神</a>
        </li>
        <li>
          <a href="#story" className="hover:text-amber transition-colors duration-300">說書</a>
        </li>
        <li>
          <a href="#literature" className="hover:text-amber transition-colors duration-300">研考</a>
        </li>
        <li>
          <a href="#map" className="hover:text-amber transition-colors duration-300">尋蹤</a>
        </li>
      </ul>
    </nav>
  );
}
