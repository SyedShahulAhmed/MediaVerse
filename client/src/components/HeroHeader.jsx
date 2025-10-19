export default function HeroHeader() {
  return (
    <header className="relative py-20 text-center text-white overflow-hidden">
      <div className="absolute inset-0 opacity-20 bg-[url('https://cdn.pixabay.com/photo/2016/03/27/22/22/controller-1283629_1280.jpg')] bg-cover bg-center blur-md"></div>
      <div className="relative z-10">
        <h1 className="text-5xl font-bold text-primary mb-3 flex justify-center items-center gap-2">
          <span>🎬</span> Recollect
        </h1>
        <p className="text-gray-400 max-w-xl mx-auto">
          Track your movies, series, anime, books and games all in one beautiful place.
        </p>
      </div>
    </header>
  );
}
