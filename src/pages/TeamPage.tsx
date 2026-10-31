import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

/** PRD #11: route publik /team. */
export default function TeamPage() {
  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      <Navbar />
      <main className="mx-auto w-full max-w-4xl flex-1 px-4 py-14 text-center">
        <h1 className="text-3xl font-bold text-slate-900">Tim VR-GeoNusa</h1>
        <p className="mt-4 text-slate-600">
          Dikembangkan oleh tim peneliti, dosen, dan mahasiswa yang berfokus pada pembelajaran
          geometri berbasis teknologi immersive.
        </p>
      </main>
      <Footer />
    </div>
  );
}
