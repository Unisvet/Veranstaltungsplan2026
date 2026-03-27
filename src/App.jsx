import React, { useState, useEffect } from 'react';
import EventCard from './components/EventCard';
import PhotoModal from './components/PhotoModal';
import { Leaf, Sun, CloudRain, Snowflake } from 'lucide-react';

function App() {
  const [events, setEvents] = useState([]);
  const [selectedEventForPhotos, setSelectedEventForPhotos] = useState(null);
  const [season, setSeason] = useState(() => {
    const month = new Date().getMonth();
    if (month >= 2 && month <= 4) return 'spring';
    if (month >= 5 && month <= 7) return 'summer';
    if (month >= 8 && month <= 10) return 'autumn';
    return 'winter';
  });

  useEffect(() => {
    // Fetch event data from the purely static JSON file
    fetch('./events.json')
      .then(res => res.json())
      .then(data => setEvents(data))
      .catch(err => console.error("Fehler beim Laden der events.json:", err));
  }, []);

  // Update theme background via data-season attribute
  useEffect(() => {
    document.documentElement.setAttribute('data-season', season);
  }, [season]);

  return (
    <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">

        <header className="mb-12 text-center relative">
          <div className="flex justify-center gap-2 mb-6">
            <SeasonButton icon={<Leaf size={16} />} label="Frühling" active={season === 'spring'} onClick={() => setSeason('spring')} />
            <SeasonButton icon={<Sun size={16} />} label="Sommer" active={season === 'summer'} onClick={() => setSeason('summer')} />
            <SeasonButton icon={<CloudRain size={16} />} label="Herbst" active={season === 'autumn'} onClick={() => setSeason('autumn')} />
            <SeasonButton icon={<Snowflake size={16} />} label="Winter" active={season === 'winter'} onClick={() => setSeason('winter')} />
          </div>

          <div className="flex flex-col items-center justify-center gap-4 mb-6">
            <img src="/favicon.png" alt="Klingmühl Paradise Logo" className="w-20 h-20 drop-shadow-2xl rounded-2xl border-2 border-white/20 p-2 glass" />
            <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight drop-shadow-md">
              Klingmühl <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-white/60">Paradise</span>
            </h1>
          </div>
          <p className="text-xl text-white/80 max-w-2xl mx-auto font-medium shadow-sm glass inline-block px-6 py-2 rounded-full">
            Veranstaltungsplan 2026 – Unser Dorfkalender für das kommende Jahr.
          </p>
        </header>

        <main className="relative z-10">
          {events.length === 0 ? (
            <div className="text-center py-20 text-white/50 animate-pulse">
              Lade Veranstaltungen...
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              {events.map((event) => (
                <EventCard
                  key={event.id}
                  event={event}
                  onOpenPhotos={setSelectedEventForPhotos}
                />
              ))}
            </div>
          )}
        </main>

        <footer className="mt-20 text-center text-white/60 text-sm">
          <p>© 2026 Dorf Klingmühl. Erstellt für die Dorfgemeinschaft.</p>
        </footer>
      </div>

      {selectedEventForPhotos && (
        <PhotoModal
          event={selectedEventForPhotos}
          onClose={() => setSelectedEventForPhotos(null)}
        />
      )}
    </div>
  );
}

const SeasonButton = ({ icon, label, active, onClick }) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300
      ${active ? 'bg-white/20 shadow-lg border border-white/40 scale-105' : 'bg-white/5 hover:bg-white/10 border border-transparent'}`}
    title={label}
  >
    {icon}
    <span className="hidden sm:inline">{label}</span>
  </button>
);

export default App;
