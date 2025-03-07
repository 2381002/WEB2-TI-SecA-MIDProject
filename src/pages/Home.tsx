import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-purple-500 to-indigo-600 text-white px-6">

      {/* Hero Section */}
      <div className="text-center max-w-2xl mx-auto mt-16">
        <h1 className="text-4xl md:text-6xl font-bold leading-tight">
          🌟 Selamat Datang di <span className="text-yellow-300">MID Website</span>
        </h1>
        <p className="mt-4 text-lg md:text-xl opacity-90">
          Temukan berbagai <strong>produk berkualitas</strong>, <strong>resep lezat</strong>, <strong>artikel menarik</strong>, <strong>manajemen tugas yang mudah</strong>, dan <strong>komentar dari pengguna</strong>!
        </p>
      </div>

      {/* Sections Navigation */}
      <div className="flex-grow flex flex-col items-center justify-center">
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-5xl">
          
          {/* Products */}
          <Link to="/products" className="group bg-white text-gray-900 p-6 rounded-lg shadow-lg transition transform hover:scale-105">
            <h2 className="text-2xl font-semibold flex items-center gap-2">
              🛍️ Products
            </h2>
            <p className="mt-2 text-gray-700 group-hover:text-gray-900 transition">
              Jelajahi produk berkualitas dan temukan yang terbaik untuk Anda.
            </p>
          </Link>

          {/* Recipes */}
          <Link to="/recipes" className="group bg-white text-gray-900 p-6 rounded-lg shadow-lg transition transform hover:scale-105">
            <h2 className="text-2xl font-semibold flex items-center gap-2">
              🍲 Recipes
            </h2>
            <p className="mt-2 text-gray-700 group-hover:text-gray-900 transition">
              Temukan berbagai resep lezat untuk dicoba di rumah!
            </p>
          </Link>

          {/* Posts */}
          <Link to="/posts" className="group bg-white text-gray-900 p-6 rounded-lg shadow-lg transition transform hover:scale-105">
            <h2 className="text-2xl font-semibold flex items-center gap-2">
              ✍️ Posts
            </h2>
            <p className="mt-2 text-gray-700 group-hover:text-gray-900 transition">
              Baca artikel menarik dan dapatkan wawasan baru setiap hari.
            </p>
          </Link>

          {/* Todos */}
          <Link to="/todos" className="group bg-white text-gray-900 p-6 rounded-lg shadow-lg transition transform hover:scale-105">
            <h2 className="text-2xl font-semibold flex items-center gap-2">
              ✅ Todos
            </h2>
            <p className="mt-2 text-gray-700 group-hover:text-gray-900 transition">
              Kelola tugas dan aktivitas harian Anda dengan mudah!
            </p>
          </Link>

          {/* Comments */}
          <Link to="/comments" className="group bg-white text-gray-900 p-6 rounded-lg shadow-lg transition transform hover:scale-105">
            <h2 className="text-2xl font-semibold flex items-center gap-2">
              💬 Comments
            </h2>
            <p className="mt-2 text-gray-700 group-hover:text-gray-900 transition">
              Lihat pendapat dan ulasan dari pengguna lain, atau tambahkan komentar Anda!
            </p>
          </Link>
        </div>
      </div>

      {/* Footer */}
      <footer className="w-full text-center py-4 text-sm opacity-75">
        Dibuat dengan ❤️ oleh <span className="font-semibold">Gabrach</span>
      </footer>
    </div>
  );
};

export default Home;
