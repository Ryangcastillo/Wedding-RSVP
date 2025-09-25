
export default function Home() {
  return (
    <div className="min-h-screen bg-[url('/paper-texture.png')] bg-repeat flex flex-col items-center">
      <header className="w-full max-w-3xl mx-auto pt-12 pb-4 flex flex-col items-center">
        <h1 className="font-serif text-5xl font-bold text-gray-800 mb-6 text-center tracking-tight">Loren &amp; Billy</h1>
        <nav className="w-full flex justify-center mb-8">
          <ul className="flex gap-8 text-lg font-light text-gray-700">
            {navLinks.map((link, i) => (
              <li key={link.name} className="relative">
                <a href={link.href} className={`hover:text-black transition-colors ${i === 0 ? 'font-semibold underline underline-offset-8' : ''}`}>{link.name}</a>
              </li>
            ))}
          </ul>
        </nav>
      </header>
      <main className="w-full max-w-3xl mx-auto flex flex-col items-center">
        <div className="w-full bg-white rounded-xl shadow-lg p-8 flex flex-col items-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={heroImage} alt="Wedding Hero" className="rounded-lg shadow-lg w-full object-cover mb-8" style={{maxHeight: 400}} />
          <div className="flex flex-col items-center w-full">
            <svg width="64" height="24" viewBox="0 0 64 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="mb-4">
              <path d="M2 12C10 2 22 22 32 12C42 2 54 22 62 12" stroke="#bbb" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            <p className="font-serif text-2xl text-gray-700 mt-2">Thursday, December 12, 2024</p>
          </div>
        </div>
      </main>
    </div>
  );
}


const navLinks = [
  { name: "Home", href: "#" },
  { name: "Story", href: "/story" },
  { name: "Moments", href: "/moments" },
  { name: "Schedule", href: "/schedule" },
  { name: "Registry", href: "/registry" },
  { name: "Travel", href: "/travel" },
  { name: "Q & A", href: "/qa" },
  { name: "RSVP", href: "/rsvp" },
  { name: "Get the app", href: "/app" },
];

const heroImage = "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80";
